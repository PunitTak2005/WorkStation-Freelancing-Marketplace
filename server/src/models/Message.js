import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  attachments: [{ url: String, fileName: String, fileType: String, fileSize: Number }],
  isRead: { type: Boolean, default: false },
  readAt: Date,
  messageType: { type: String, enum: ['chat', 'system', 'milestone_update'], default: 'chat' }
}, {
  timestamps: true
});

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

messageSchema.pre('validate', function(next) {
  if (!this.text && (!this.attachments || this.attachments.length === 0)) {
    this.invalidate('text', 'Message must contain text or attachments');
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
