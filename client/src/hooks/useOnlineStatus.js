import { useSelector } from 'react-redux';

export const useOnlineStatus = () => {
  const { onlineUsers } = useSelector((state) => state.chat);

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  return { onlineUsers, isOnline };
};
