import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: false },
  milestoneIndex: Number,
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  clientName: { type: String, trim: true },
  freelancerName: { type: String, trim: true },
  projectName: { type: String, trim: true },
  transactionId: { type: String, index: true },
  invoiceId: { type: String, index: true },
  invoiceNumber: { type: String, sparse: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  netAmount: { type: Number },
  netPayout: { type: Number },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: 'UPI' },
  escrowStatus: {
    type: String,
    enum: ['held', 'released', 'disputed', 'refunded', 'pending'],
    default: 'held'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  type: {
    type: String,
    enum: ['escrow_deposit', 'escrow_release', 'refund', 'milestone_payment', 'direct_payout'],
    default: 'milestone_payment'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'completed', 'disputed', 'failed', 'refunded'],
    default: 'pending'
  },
  payoutStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'held', 'failed'],
    default: 'pending'
  },
  paidAt: Date,
  payoutDate: Date,
  notes: String,
  refundDetails: {
    status: {
      type: String,
      enum: ['none', 'requested', 'under_review', 'approved', 'rejected', 'completed'],
      default: 'none'
    },
    amount: Number,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    processedBy: String,
    notes: String
  },
  disputeDetails: {
    status: {
      type: String,
      enum: ['none', 'open', 'investigating', 'resolved', 'closed'],
      default: 'none'
    },
    reason: String,
    claimant: String,
    evidence: String,
    openedAt: Date,
    resolvedAt: Date,
    resolutionNotes: String,
    outcome: String
  },
  timeline: [
    {
      stage: String,
      description: String,
      timestamp: { type: Date, default: Date.now },
      user: String
    }
  ]
}, {
  timestamps: true
});

paymentSchema.index({ contract: 1 });
paymentSchema.index({ payer: 1, createdAt: -1 });
paymentSchema.index({ recipient: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ escrowStatus: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
