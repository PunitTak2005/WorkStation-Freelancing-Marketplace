import React from 'react';
import Card from '@/components/common/Card';
import StarRating from '@/components/common/StarRating';
import { Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden group">
      <div className="min-w-0">
        {/* Top: Avatar, Name, Company, Quote Icon */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={review.avatar || '/freelancers/rajesh-kumar.webp'}
              alt={review.reviewerName}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                {review.reviewerName}
              </h5>
              <p className="text-[11px] text-slate-400 truncate">
                {review.reviewerCompany || 'Enterprise Partner'}
              </p>
            </div>
          </div>
          <Quote size={18} className="text-slate-300 dark:text-slate-700 shrink-0" />
        </div>

        {/* Rating Stars & Value */}
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={review.rating || 5.0} size="sm" />
          <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
            {review.rating ? review.rating.toFixed(1) : '5.0'}
          </span>
        </div>

        {/* Review Quote Text */}
        <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed line-clamp-3 min-w-0">
          "{review.comment}"
        </p>
      </div>

      {/* Date & Project info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400 gap-2">
        <span className="truncate font-medium text-slate-500 dark:text-slate-400 min-w-0">
          {review.projectTitle || 'Verified Engagement'}
        </span>
        <span className="shrink-0">{review.date}</span>
      </div>
    </Card>
  );
}
