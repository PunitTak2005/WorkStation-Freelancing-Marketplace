import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [5, 'Project title must be at least 5 characters'],
    maxlength: [100, 'Project title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required']
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [1, 'Minimum budget must be greater than 0']
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [1, 'Maximum budget must be greater than 0']
    },
    type: {
      type: String,
      enum: {
        values: ['fixed', 'hourly'],
        message: 'Budget type must be either fixed or hourly'
      },
      required: true,
      default: 'fixed'
    }
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true;
        // Only enforce future deadline on new documents
        if (this.isNew) {
          return new Date(v).getTime() > Date.now();
        }
        return true;
      },
      message: 'Deadline cannot be in the past'
    }
  },
  experienceLevel: {
    type: String,
    enum: {
      values: ['entry', 'intermediate', 'expert'],
      message: 'Experience level must be entry, intermediate, or expert'
    },
    required: [true, 'Experience level is required'],
    default: 'intermediate'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client ID is required']
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'pending_review', 'suspended', 'archived'],
      message: 'Invalid job status'
    },
    default: 'open'
  },
  skillsRequired: {
    type: [String],
    required: [true, 'Required skills are mandatory'],
    validate: [v => Array.isArray(v) && v.length > 0, 'At least one skill is required']
  },
  attachments: [{
    url: String,
    fileName: String,
    publicId: String
  }],
  locationType: {
    type: String,
    enum: {
      values: ['remote', 'onsite', 'hybrid'],
      message: 'Location type must be remote, onsite, or hybrid'
    },
    default: 'remote'
  },
  proposalCount: {
    type: Number,
    default: 0,
    min: [0, 'Proposal count cannot be negative']
  },
  image: {
    type: String
  },
  company: {
    type: String
  },
  deliverables: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationNotes: {
    type: String,
    trim: true
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

jobSchema.index({ title: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'budget.min': 1, 'budget.max': 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ skillsRequired: 1 });
jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });
jobSchema.index({ status: 1, category: 1, createdAt: -1 });
jobSchema.index({ client: 1 });

jobSchema.virtual('isExpired').get(function() {
  return this.deadline && this.deadline < new Date();
});

jobSchema.virtual('proposals', {
  ref: 'Proposal',
  localField: '_id',
  foreignField: 'job'
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
