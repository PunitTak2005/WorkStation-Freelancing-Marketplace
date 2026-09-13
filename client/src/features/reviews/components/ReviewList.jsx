import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '@/services/api';
import Avatar from '@/components/common/Avatar';
import Skeleton from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import { formatDate } from '@/utils/formatters';

export default function ReviewList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reviews/user/${userId}`);
      setReviews(res.data.data.reviews || []);
      
      // Calculate stats client-side for now if not provided by backend
      if (res.data.data.reviews?.length > 0) {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let total = 0;
        res.data.data.reviews.forEach(r => {
          counts[Math.round(r.rating)]++;
          total += r.rating;
        });
        setStats({
          average: (total / res.data.data.reviews.length).toFixed(1),
          total: res.data.data.reviews.length,
          distribution: counts
        });
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState 
        icon={Star} 
        title="No reviews yet" 
        description="This user hasn't received any reviews." 
      />
    );
  }

  const StarRating = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${star <= rating ? 'fill-orange-400 text-orange-400' : 'text-slate-200 dark:text-slate-700'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      {stats && (
        <div className="flex flex-col md:flex-row gap-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-5xl font-bold text-slate-900 dark:text-white">{stats.average}</span>
            <div className="my-2"><StarRating rating={Math.round(stats.average)} size={20} /></div>
            <span className="text-sm text-slate-500">{stats.total} reviews</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = stats.distribution[star];
              const percentage = (count / stats.total) * 100;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-slate-600 dark:text-slate-400 font-medium">{star} stars</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review._id} className="pb-6 border-b border-slate-200 dark:border-slate-800 last:border-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <Avatar src={review.reviewer?.avatar} alt={review.reviewer?.name} />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{review.reviewer?.name}</h4>
                  <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            
            {review.comment && (
              <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                {review.comment}
              </p>
            )}
            
            {review.contract?.job?.title && (
              <div className="mt-3 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-500">
                Project: {review.contract.job.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
