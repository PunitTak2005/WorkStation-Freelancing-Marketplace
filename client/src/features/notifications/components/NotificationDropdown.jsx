import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, DollarSign, Briefcase, Star, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { useSocket } from '@/hooks/useSocket';
import { timeAgo } from '@/utils/formatters';
import { cn } from '@/utils/cn';

export default function NotificationDropdown({ className, buttonClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { socket, isConnected } = useSocket();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('new_notification', handleNotification);

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off('new_notification', handleNotification);
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications?limit=10');
      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.notifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare size={16} className="text-blue-500" />;
      case 'payment': return <DollarSign size={16} className="text-emerald-500" />;
      case 'contract': return <Briefcase size={16} className="text-purple-500" />;
      case 'review': return <Star size={16} className="text-orange-500" />;
      case 'system': return <Info size={16} className="text-indigo-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification._id);
    setIsOpen(false);
    if (notification.linkUrl) navigate(notification.linkUrl);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-full text-slate-600 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] hover:bg-[#EAF6FF]/80 dark:hover:bg-[#101826] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40",
          buttonClassName
        )}
        aria-label="View notifications"
      >
        <Bell size={19} className="transition-transform duration-200 hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#080B12]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-[#0A101D]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[#D6EFFF] dark:border-[#22324A] z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-[#D6EFFF]/80 dark:border-[#22324A] flex justify-between items-center bg-slate-50/70 dark:bg-[#080B12]/70">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF]">
                  <Bell size={14} />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-[#0A84FF] dark:text-[#2FA8FF] hover:underline flex items-center gap-1 font-semibold"
                >
                  <CheckCircle size={12} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-3 text-slate-400">
                    <Bell size={22} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No new notifications</p>
                  <p className="text-xs text-slate-400 mt-1">We'll alert you when important activity occurs</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif._id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "p-3.5 flex gap-3 cursor-pointer hover:bg-[#F0F7FF] dark:hover:bg-[#131D2E] transition-colors relative",
                      !notif.isRead ? "bg-[#EAF6FF]/50 dark:bg-[#0D1829]/60" : ""
                    )}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A84FF]" />
                    )}
                    <div className="mt-0.5 flex-shrink-0 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm h-fit">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("text-xs leading-snug mb-1", !notif.isRead ? "font-bold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1.5">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-[#D6EFFF]/80 dark:border-[#22324A] text-center bg-slate-50/70 dark:bg-[#080B12]/70">
              <Link 
                to="/dashboard/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
