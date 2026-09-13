import React from 'react';
import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';
import { Star, X, Quote } from 'lucide-react';

export default function AllReviewsModal({ isOpen, onClose, reviews = [], averageRating = 4.9 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span>All Verified Client Reviews ({reviews.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Average Client Rating: <strong className="text-slate-800 dark:text-slate-200">{averageRating} / 5.0</strong> across all completed enterprise contracts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list of reviews */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar || '/freelancers/rajesh-kumar.webp'}
                    alt={rev.reviewerName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      {rev.reviewerName}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {rev.reviewerCompany || 'Enterprise Partner'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <StarRating rating={rev.rating || 5.0} size="sm" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {rev.rating ? rev.rating.toFixed(1) : '5.0'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Verified Contract Deliverable</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="rounded-xl px-5">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
