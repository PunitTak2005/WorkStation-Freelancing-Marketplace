import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as tokenUtils from '../utils/tokenUtils.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['freelancer', 'client', 'admin'], default: 'freelancer' },
  avatar: {
    url: { type: String, default: function() { return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}`; } },
    publicId: String
  },
  coverBanner: {
    url: String,
    publicId: String
  },
  // Client company fields
  companyLogo: { url: String, publicId: String },
  companyDescription: { type: String, maxlength: 1000 },
  industry: String,
  title: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String }],
  hourlyRate: { type: Number, min: 0 },
  portfolio: [{
    title: String,
    description: String,
    images: [{ url: String, publicId: String }],
    projectUrl: String,
    createdAt: { type: Date, default: Date.now }
  }],
  location: String,
  socialLinks: { github: String, linkedin: String, website: String, twitter: String },
  experience: { type: String, enum: ['entry', 'intermediate', 'expert'], default: 'entry' },
  expertiseLevel: { type: String, default: 'Intermediate' },
  education: [{ degree: String, institution: String, year: Number }],
  certifications: [{ type: String }],
  certificationsList: [{
    title: String,
    issuer: String,
    date: String,
    credentialId: String,
    url: String
  }],
  experiences: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  availability: { type: String, enum: ['available', 'busy', 'not_available'], default: 'available' },
  verified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: true },
  otp: { code: String, expiresAt: Date },
  refreshToken: String,
  earnings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: val => Math.round(val * 10) / 10 },
  ratingsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  lastActive: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpiry: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ experience: 1 });
userSchema.index({ expertiseLevel: 1 });
userSchema.index({ hourlyRate: 1 });
userSchema.index({ ratingsAverage: -1 });
userSchema.index({ name: 'text', bio: 'text', skills: 'text' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function() {
  // ensure tokenUtils has a generateAccessToken method
  return tokenUtils.generateAccessToken({ id: this._id, role: this.role });
};

userSchema.methods.generateRefreshToken = function() {
  return tokenUtils.generateRefreshToken({ id: this._id });
};

userSchema.virtual('fullAvatarUrl').get(function() {
  return this.avatar.url;
});

const User = mongoose.model('User', userSchema);
export default User;
