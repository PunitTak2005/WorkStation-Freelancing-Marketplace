import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  const actualSocket = context?.socket || null;

  return {
    socket: actualSocket,
    isConnected: context?.isConnected || false,
    // Delegated safe methods so any consumer calling socket.on() or socket.emit() directly doesn't crash
    on: (event, handler) => {
      if (actualSocket && typeof actualSocket.on === 'function') {
        return actualSocket.on(event, handler);
      }
    },
    off: (event, handler) => {
      if (actualSocket && typeof actualSocket.off === 'function') {
        return actualSocket.off(event, handler);
      }
    },
    emit: (event, ...args) => {
      if (actualSocket && typeof actualSocket.emit === 'function') {
        return actualSocket.emit(event, ...args);
      }
    },
    get connected() {
      return actualSocket ? actualSocket.connected : false;
    },
    get id() {
      return actualSocket ? actualSocket.id : undefined;
    },
  };
};
