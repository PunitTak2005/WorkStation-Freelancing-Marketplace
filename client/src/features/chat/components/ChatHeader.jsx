import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import Avatar from '@/components/common/Avatar';

export default function ChatHeader({ otherUser, isTyping, onBack, onMoreClick }) {
  return (
    <div className="sticky top-0 h-[76px] border-b border-slate-200 dark:border-slate-800/60 flex items-center px-4 md:px-6 justify-between bg-white/95 dark:bg-[#111B21]/95 backdrop-blur-sm z-20 shrink-0 shadow-sm">
      {/* Left Side: Avatar + Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onBack && (
          <button 
            type="button"
            onClick={onBack} 
            className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1 -ml-1 rounded-full transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        
        <div className="flex items-center gap-4 sm:gap-5 cursor-pointer group min-w-0">
          <div className="relative shrink-0">
            <Avatar 
              src={otherUser?.avatar} 
              name={otherUser?.name}
              alt={otherUser?.name} 
              className="w-12 h-12 md:w-[54px] md:h-[54px] rounded-full object-cover ring-2 ring-transparent group-hover:ring-slate-200 dark:group-hover:ring-slate-700 transition-all" 
            />
            {/* Online status indicator dot on avatar */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#111B21] rounded-full"></span>
          </div>
          
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="text-[16px] md:text-[17px] font-semibold text-slate-900 dark:text-white leading-snug truncate">
              {otherUser?.name || 'Loading...'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[13px] text-emerald-600 dark:text-emerald-500 font-medium shrink-0">
                {isTyping ? 'typing...' : 'Online'}
              </p>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full hidden sm:block shrink-0"></span>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                {otherUser?.project || 'Project: Website Redesign'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Three-dot More menu only */}
      <div className="flex items-center text-slate-500 dark:text-slate-400 shrink-0">
        <button 
          type="button"
          onClick={onMoreClick}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          title="More options"
          aria-label="More options"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
