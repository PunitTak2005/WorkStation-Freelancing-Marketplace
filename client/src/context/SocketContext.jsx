import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers, addOnlineUser, removeOnlineUser } from '../store/slices/chatSlice';
import toast from 'react-hot-toast';

export const SocketContext = createContext({ socket: null, isConnected: false });

export const SocketProvider = ({ children, isAuthenticated }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken && user?._id) {
      if (socketRef.current?.connected) return;

      const serverUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL?.replace('/api', '') ||
        'http://localhost:9005';

      const newSocket = io(serverUrl, {
        auth: { token: accessToken },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'], // Start with websocket to avoid 400 bad request with polling
        withCredentials: true,
      });

      socketRef.current = newSocket;

      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      const handleConnectError = (err) => {
        setIsConnected(false);
        const msg = err?.message || '';
        if (msg.includes('Authentication') || msg.includes('Token') || msg.includes('jwt') || msg.includes('unauthorized')) {
          newSocket.disconnect();
        }
      };

      const handleOnlineUsers = (users) => dispatch(setOnlineUsers(users));
      const handleUserOnline = (userId) => dispatch(addOnlineUser(userId));
      const handleUserOffline = (userId) => dispatch(removeOnlineUser(userId));
      const handleNewNotification = (data) => {
        toast(data.message || 'New marketplace notification', { icon: '🔔', duration: 4000 });
      };

      newSocket.on('connect', handleConnect);
      newSocket.on('disconnect', handleDisconnect);
      newSocket.on('connect_error', handleConnectError);
      newSocket.on('online_users', handleOnlineUsers);
      newSocket.on('user_online', handleUserOnline);
      newSocket.on('user_offline', handleUserOffline);
      newSocket.on('new_notification', handleNewNotification);

      setSocket(newSocket);

      return () => {
        newSocket.off('connect', handleConnect);
        newSocket.off('disconnect', handleDisconnect);
        newSocket.off('connect_error', handleConnectError);
        newSocket.off('online_users', handleOnlineUsers);
        newSocket.off('user_online', handleUserOnline);
        newSocket.off('user_offline', handleUserOffline);
        newSocket.off('new_notification', handleNewNotification);
        newSocket.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, accessToken, user?._id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
