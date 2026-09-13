import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Freelancer ID is required']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    trim: true,
    minlength: [10, 'Cover letter must be at least 10 characters'],
    maxlength: [3000, 'Cover letter cannot exceed 3000 characters']
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [1, 'Bid amount must be greater than 0']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Delivery time is required'],
    min: [1, 'Delivery time must be at least 1 day'],
    max: [365, 'Delivery time cannot exceed 365 days']
  },
  milestones: [{
    title: {
      type: String,
      trim: true,
      required: [true, 'Milestone title is required']
    },
    amount: {
      type: Number,
      required: [true, 'Milestone amount is required'],
      min: [1, 'Milestone amount must be greater than 0']
    },
    deadline: Date
  }],
  status: {
    type: String,
    enum: {
      values: ['pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn'],
      message: 'Invalid proposal status'
    },
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: null
  },
  decidedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Enforce unique proposal per freelancer per job
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ freelancer: 1, status: 1 });
proposalSchema.index({ job: 1, status: 1 });

proposalSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      await mongoose.model('Job').findByIdAndUpdate(this.job, { $inc: { proposalCount: 1 } });
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;
