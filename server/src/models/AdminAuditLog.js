import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminName: {
    type: String,
    trim: true,
  },
  adminEmail: {
    type: String,
    trim: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  targetUserName: {
    type: String,
    trim: true,
  },
  targetUserEmail: {
    type: String,
    trim: true,
  },
  targetJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false,
  },
  targetJobTitle: {
    type: String,
    trim: true,
  },
  targetPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: false,
  },
  targetTransactionId: {
    type: String,
    trim: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'suspend_user',
      'activate_user',
      'verify_user',
      'unverify_user',
      'change_role',
      'soft_delete',
      'restore_user',
      'create_user',
      'update_user',
      'approve_job',
      'reject_job',
      'suspend_job',
      'reopen_job',
      'archive_job',
      'feature_job',
      'unfeature_job',
      'soft_delete_job',
      'create_job',
      'mark_paid',
      'mark_failed',
      'process_refund',
      'release_escrow',
      'hold_payment',
      'resolve_dispute',
      'retry_payment',
    ],
  },
  previousValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  notes: {
    type: String,
    trim: true,
  },
  ip: {
    type: String,
    default: '127.0.0.1',
  },
  userAgent: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

adminAuditLogSchema.index({ targetUser: 1, createdAt: -1 });
adminAuditLogSchema.index({ targetJob: 1, createdAt: -1 });
adminAuditLogSchema.index({ admin: 1, createdAt: -1 });
adminAuditLogSchema.index({ action: 1 });

const AdminAuditLog = mongoose.model('AdminAuditLog', adminAuditLogSchema);
export default AdminAuditLog;
