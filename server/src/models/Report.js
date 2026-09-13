import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      default: 'other',
      trim: true,
    },
    project: {
      type: String,
      trim: true,
    },
    submittedBy: {
      // Can reference a User doc or store a name string for seeded data
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedByName: {
      // Fallback display name when submittedBy user is not in DB
      type: String,
      trim: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewerName: {
      type: String,
      trim: true,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    attachments: [
      {
        url: String,
        fileName: String,
        fileType: String,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, submittedAt: -1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ project: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
