import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function MessageBubble({ message, isOwn, isFirst, isLast }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isRead = message.isRead || message.status === 'read';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full flex",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%] group"
      )}>
        <div
          className={cn(
            "px-4 pt-3 pb-3 relative shadow-sm hover:shadow-md transition-shadow duration-200",
            // Outgoing (Rajesh) styling
            isOwn && "bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white",
            // Incoming (Freelancer) styling
            !isOwn && "bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/30",
            // Rounding logic for tails - 22px base
            "rounded-[22px]",
            isOwn && isFirst && "rounded-tr-[4px]",
            !isOwn && isFirst && "rounded-tl-[4px]",
            (!isFirst && !isLast) && (isOwn ? "rounded-r-lg" : "rounded-l-lg"),
            isOwn && isLast && !isFirst && "rounded-br-[4px]",
            !isOwn && isLast && !isFirst && "rounded-bl-[4px]"
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text || message.content}
          </p>
        </div>
        
        {/* Timestamp below the bubble */}
        <div className={cn(
          "flex items-center gap-1 mt-1 px-1",
          isOwn ? "justify-end text-slate-400 dark:text-slate-500" : "justify-start text-slate-400 dark:text-slate-500"
        )}>
          <span className="text-[11px] font-medium">{time}</span>
          {isOwn && (
            <span className="ml-0.5">
              {isRead ? (
                <CheckCheck size={14} className="text-[#0A84FF]" />
              ) : (
                <Check size={14} />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
