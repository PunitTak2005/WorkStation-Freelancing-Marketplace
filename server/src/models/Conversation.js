import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validate: [v => v.length === 2, 'Conversation must have exactly 2 participants']
  },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
  },
  unreadCounts: { type: Map, of: Number, default: {} }
}, {
  timestamps: true
});

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
