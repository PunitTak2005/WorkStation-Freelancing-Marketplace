import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { timeAgo } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'unread' ? '/notifications?isRead=false' : '/notifications';
      const res = await api.get(endpoint);
      setNotifications(res.data.data.notifications || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated with your account activity</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-1.5 text-sm rounded-md transition-colors", filter === 'all' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white font-medium" : "text-slate-500 hover:text-slate-700")}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={cn("px-4 py-1.5 text-sm rounded-md transition-colors", filter === 'unread' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white font-medium" : "text-slate-500 hover:text-slate-700")}
            >
              Unread
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} icon={CheckCircle}>
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={Bell} 
              title="You're all caught up!" 
              description={filter === 'unread' ? "You have no unread notifications." : "You don't have any notifications yet."}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((notif, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notif._id}
                className={cn(
                  "p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group",
                  !notif.isRead && "bg-indigo-50/30 dark:bg-indigo-900/10"
                )}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("text-base", !notif.isRead ? "font-semibold text-slate-900 dark:text-white" : "font-medium text-slate-800 dark:text-slate-200")}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                    {notif.message}
                  </p>
                  
                  {notif.linkUrl && (
                    <a href={notif.linkUrl} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center">
                      View details &rarr;
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
