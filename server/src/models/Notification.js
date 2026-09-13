import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['bid_received', 'proposal_accepted', 'proposal_rejected', 'payment_completed', 'escrow_released', 'new_message', 'review_received', 'contract_created', 'milestone_submitted', 'milestone_approved', 'dispute_opened', 'dispute_resolved', 'escrow_held', 'mediation_started', 'system'],
    required: true
  },
  linkUrl: String,
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

notificationSchema.index({ receiver: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
