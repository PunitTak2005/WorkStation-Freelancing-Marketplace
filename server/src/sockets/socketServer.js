import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { setupChatHandlers } from './chatHandlers.js';

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

export const getOnlineUsers = () => onlineUsers;

export const initializeSocket = (httpServer) => {
  const allowedOrigins = [
    'http://localhost:3256',
    'http://127.0.0.1:3256',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
  ].filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'workstation_super_secret_access_jwt_key_2026');
      socket.userId = decoded.id || decoded.userId || decoded._id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`⚡ User connected: ${userId} (socket: ${socket.id})`);

    // Join personal notification room
    socket.join(`user_${userId}`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      // Broadcast user came online (only on first connection)
      socket.broadcast.emit('user_online', { userId });
    }
    onlineUsers.get(userId).add(socket.id);

    // Send current online users to the newly connected client
    socket.emit('online_users', Array.from(onlineUsers.keys()));

    // Setup chat event handlers
    setupChatHandlers(io, socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId} (socket: ${socket.id})`);
      
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          // Broadcast user went offline
          socket.broadcast.emit('user_offline', { 
            userId, 
            lastSeen: new Date().toISOString() 
          });
        }
      }
    });

    // Handle errors
    socket.on('error', (err) => {
      console.error(`Socket error for ${userId}:`, err.message);
    });
  });

  return io;
};
