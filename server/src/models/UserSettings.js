import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  device: { type: String, default: 'Desktop' },
  browser: { type: String, default: 'Chrome' },
  os: { type: String, default: 'Windows' },
  location: { type: String, default: 'Udaipur, Rajasthan, India' },
  ip: { type: String, default: '127.0.0.1' },
  lastActive: { type: Date, default: Date.now },
  current: { type: Boolean, default: false }
}, { _id: false });

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  general: {
    username: { type: String, trim: true, lowercase: true, default: '' },
    displayName: { type: String, trim: true, default: '' },
    language: { type: String, default: 'English (US)' },
    timeZone: { type: String, default: 'UTC+05:30 (India Standard Time)' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' }
  },
  account: {
    company: { type: String, trim: true, default: '' },
    jobTitle: { type: String, trim: true, default: '' }
  },
  appearance: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    accentColor: { type: String, default: '#0A84FF' },
    density: { type: String, enum: ['comfortable', 'compact'], default: 'comfortable' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' }
  },
  notifications: {
    email: {
      messages: { type: Boolean, default: true },
      proposals: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true }
    },
    push: {
      chat: { type: Boolean, default: true },
      deadlines: { type: Boolean, default: true },
      offers: { type: Boolean, default: false }
    },
    sms: {
      securityAlerts: { type: Boolean, default: true },
      paymentConfirmations: { type: Boolean, default: true }
    }
  },
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'clients_only', 'private'], default: 'public' },
    showOnlineStatus: { type: Boolean, default: true },
    showLastSeen: { type: Boolean, default: true },
    allowDirectMessages: { type: Boolean, default: true },
    searchEngineIndexing: { type: Boolean, default: true },
    freelancerRecommendations: { type: Boolean, default: true }
  },
  billing: {
    currentPlan: { type: String, default: 'Pro Freelancer' },
    billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    paymentMethods: [{
      id: { type: String, default: () => 'pm_' + Math.random().toString(36).substr(2, 9) },
      brand: { type: String, default: 'Visa' },
      last4: { type: String, default: '4242' },
      expMonth: { type: String, default: '08' },
      expYear: { type: String, default: '28' },
      isDefault: { type: Boolean, default: true }
    }]
  },
  connectedAccounts: {
    google: { connected: { type: Boolean, default: false }, email: { type: String, default: '' } },
    github: { connected: { type: Boolean, default: true }, username: { type: String, default: 'rajesh-dev' } },
    linkedin: { connected: { type: Boolean, default: true }, username: { type: String, default: 'in/rajesh-kumar' } },
    microsoft: { connected: { type: Boolean, default: false }, email: { type: String, default: '' } }
  },
  sessions: {
    type: [sessionSchema],
    default: () => [
      {
        sessionId: 'sess_1',
        device: 'Windows PC',
        browser: 'Chrome 124.0',
        os: 'Windows 11',
        location: 'Udaipur, Rajasthan, India',
        ip: '103.212.145.28',
        lastActive: new Date(),
        current: true
      },
      {
        sessionId: 'sess_2',
        device: 'MacBook Pro',
        browser: 'Safari 17.4',
        os: 'macOS Sonoma',
        location: 'Jaipur, Rajasthan, India',
        ip: '103.212.145.92',
        lastActive: new Date(Date.now() - 36 * 3600 * 1000),
        current: false
      },
      {
        sessionId: 'sess_3',
        device: 'OnePlus 11',
        browser: 'Chrome Mobile',
        os: 'Android 14',
        location: 'Ahmedabad, Gujarat, India',
        ip: '49.36.12.110',
        lastActive: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        current: false
      }
    ]
  }
}, {
  timestamps: true
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;
