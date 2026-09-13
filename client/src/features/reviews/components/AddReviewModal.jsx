import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import api from '@/services/api';
import toast from 'react-hot-toast';

const RATING_CATEGORIES = [
  { id: 'communication', label: 'Communication' },
  { id: 'quality', label: 'Quality of Work' },
  { id: 'deadlines', label: 'Adherence to Deadlines' },
];

export default function AddReviewModal({ isOpen, onClose, contractId, targetUserId, onSuccess }) {
  const [ratings, setRatings] = useState({
    communication: 0,
    quality: 0,
    deadlines: 0,
    overall: 0
  });
  const [hoverRatings, setHoverRatings] = useState({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingClick = (category, value) => {
    setRatings(prev => {
      const newRatings = { ...prev, [category]: value };
      // Auto-calculate overall average if setting specific categories
      if (category !== 'overall') {
        const cats = ['communication', 'quality', 'deadlines'];
        let sum = 0;
        let count = 0;
        cats.forEach(c => {
          const val = c === category ? value : newRatings[c];
          if (val > 0) { sum += val; count++; }
        });
        if (count > 0) {
          newRatings.overall = Math.round(sum / count);
        }
      }
      return newRatings;
    });
  };

  const handleSubmit = async () => {
    if (!ratings.overall) return toast.error('Please provide an overall rating');
    
    try {
      setSubmitting(true);
      await api.post('/reviews', {
        contract: contractId,
        reviewee: targetUserId,
        rating: ratings.overall,
        categories: {
          communication: ratings.communication || ratings.overall,
          quality: ratings.quality || ratings.overall,
          deadlines: ratings.deadlines || ratings.overall
        },
        comment
      });
      toast.success('Review submitted successfully');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category) => {
    const currentRating = ratings[category];
    const hoverRating = hoverRatings[category] || 0;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= (hoverRating || currentRating)
                ? 'fill-orange-400 text-orange-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
            onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [category]: star }))}
            onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [category]: 0 }))}
            onClick={() => handleRatingClick(category, star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <div className="space-y-6 pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your feedback helps build trust in the Workstation community. Reviews are public and cannot be edited once submitted.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-lg text-slate-900 dark:text-white">Overall Rating</span>
            {renderStars('overall')}
          </div>

          <div className="space-y-3">
            {RATING_CATEGORIES.map(cat => (
              <div key={cat.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-700 dark:text-slate-300">{cat.label}</span>
                <div className="scale-75 origin-right">
                  {renderStars(cat.id)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <TextArea
            label="Share your experience (Optional)"
            placeholder="What was it like working with them? What did they do well?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-right text-slate-500 mt-1">{comment.length}/1000</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={submitting}>Submit Review</Button>
        </div>
      </div>
    </Modal>
  );
}
