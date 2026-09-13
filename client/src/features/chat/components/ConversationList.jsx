import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/formatters';
import Avatar from '@/components/common/Avatar';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';

export default function ConversationList({ conversations, loading, activeId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants ? conv.participants.find(p => p._id !== user?._id) : conv.otherUser;
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 px-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#0A84FF] outline-none text-slate-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-2 space-y-1 pb-4">
        {loading ? (
          <div className="p-2 space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-2xl">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={Search} 
              title="No conversations found" 
              description={searchTerm ? "Try a different search term" : "You haven't started any conversations yet."} 
            />
          </div>
        ) : (
          filteredConversations.map(conv => {
            const otherUser = conv.participants ? conv.participants.find(p => p._id !== user?._id) : conv.otherUser;
            const isUnread = conv.unreadCount > 0;
            const isActive = conv._id === activeId;

            return (
              <div
                key={conv._id}
                onClick={() => navigate(`/dashboard/messages/${conv._id}`)}
                className={cn(
                  "p-3 rounded-2xl flex gap-3 cursor-pointer transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-50 dark:bg-[#0A84FF]/10 shadow-sm border border-blue-100 dark:border-[#0A84FF]/20" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0A84FF] rounded-r-full" />
                )}
                
                <div className="relative flex-shrink-0">
                  <Avatar src={otherUser?.avatar} alt={otherUser?.name} size="lg" className="w-12 h-12" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0F172A] rounded-full shadow-sm" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={cn(
                      "text-[15px] font-semibold truncate",
                      isUnread ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                    )}>
                      {otherUser?.name}
                    </h4>
                    {conv.lastMessage && (
                      <span className={cn(
                        "text-[11px] whitespace-nowrap ml-2 font-medium",
                        isUnread ? "text-[#0A84FF]" : "text-slate-400"
                      )}>
                        {timeAgo(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  {conv.job?.title && (
                    <p className="text-xs text-[#0A84FF] dark:text-[#2FA8FF] font-medium mb-1 truncate">
                      {conv.job.title}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center gap-2">
                    <p className={cn(
                      "text-sm truncate pr-2",
                      isUnread ? "text-slate-800 dark:text-slate-200 font-semibold" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {conv.lastMessage?.text || conv.lastMessage?.content || 'Started a conversation'}
                    </p>
                    {isUnread && (
                      <span className="bg-[#0A84FF] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm transition-all duration-300">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
