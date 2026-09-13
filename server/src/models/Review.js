import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    communication: { type: Number, min: 1, max: 5, required: true },
    quality: { type: Number, min: 1, max: 5, required: true },
    deadline: { type: Number, min: 1, max: 5, required: true },
    overall: { type: Number, min: 1, max: 5, required: true }
  },
  comment: { type: String, maxlength: 1000 }
}, {
  timestamps: true
});

reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1, createdAt: -1 });

reviewSchema.statics.calcAverageRatings = async function(revieweeId) {
  const stats = await this.aggregate([
    { $match: { reviewee: revieweeId } },
    {
      $group: {
        _id: '$reviewee',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating.overall' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('User').findByIdAndUpdate(revieweeId, {
      ratingsCount: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await mongoose.model('User').findByIdAndUpdate(revieweeId, {
      ratingsCount: 0,
      ratingsAverage: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.reviewee);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.reviewee);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
