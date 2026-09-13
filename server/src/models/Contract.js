import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  title: { type: String, trim: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 10 },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['active', 'completed', 'disputed', 'under_review', 'cancelled', 'pending'], default: 'active' },
  escrowStatus: { type: String, enum: ['unfunded', 'funded', 'partially_released', 'released', 'refunded', 'held', 'frozen'], default: 'unfunded' },
  dispute: {
    status: { type: String, enum: ['none', 'disputed', 'under_review', 'resolved'], default: 'none' },
    reason: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    openedAt: Date,
    reviewDeadline: Date,
    resolvedAt: Date,
    outcome: String,
    amountReleased: Number,
    escrowHeld: { type: Number, default: 0 }
  },
  milestones: [{
    title: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'funded', 'in_progress', 'submitted', 'approved', 'revision_requested', 'disputed'], default: 'pending' },
    dueDate: Date,
    submission: {
      description: String,
      attachments: [{ url: String, fileName: String, publicId: String }],
      submittedAt: Date
    },
    fundedAt: Date,
    approvedAt: Date
  }],
  startDate: { type: Date, default: Date.now },
  endDate: Date
}, {
  timestamps: true
});

contractSchema.index({ client: 1, status: 1 });
contractSchema.index({ freelancer: 1, status: 1 });
contractSchema.index({ job: 1 });

const Contract = mongoose.model('Contract', contractSchema);
export default Contract;
