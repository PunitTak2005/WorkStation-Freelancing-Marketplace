import mongoose from 'mongoose';

const timeLogSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in hours
  date: { type: Date, required: true },
  day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], required: true },
  hourlyRate: { type: Number, default: 2200 },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ['logged', 'invoiced', 'paid'], default: 'logged' }
}, {
  timestamps: true
});

timeLogSchema.index({ freelancer: 1, date: -1 });
timeLogSchema.index({ contract: 1 });

const TimeLog = mongoose.models.TimeLog || mongoose.model('TimeLog', timeLogSchema);
export default TimeLog;
