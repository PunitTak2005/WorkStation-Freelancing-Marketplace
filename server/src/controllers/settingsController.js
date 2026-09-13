import User from '../models/User.js';
import UserSettings from '../models/UserSettings.js';
import bcrypt from 'bcryptjs';

// Helper to find or create user settings
const getOrCreateSettings = async (userId, userObj = null) => {
  let settings = await UserSettings.findOne({ user: userId });
  if (!settings) {
    const defaultUsername = userObj?.name 
      ? userObj.name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900)
      : 'user' + Math.floor(1000 + Math.random() * 9000);
    
    settings = await UserSettings.create({
      user: userId,
      general: {
        username: defaultUsername,
        displayName: userObj?.name || 'WorkStation Pro',
        language: 'English (US)',
        timeZone: 'UTC+05:30 (India Standard Time)',
        dateFormat: 'DD/MM/YYYY'
      },
      account: {
        company: userObj?.companyDescription ? 'Enterprise Client' : '',
        jobTitle: userObj?.title || (userObj?.role === 'freelancer' ? 'Full-Stack Developer' : 'Technical Director')
      }
    });
  }
  return settings;
};

// GET /api/settings - Fetch all settings + user info
export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const settings = await getOrCreateSettings(user._id, user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          role: user.role,
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled ?? true,
          verified: user.verified ?? true,
        },
        settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/general
export const updateGeneral = async (req, res, next) => {
  try {
    const { name, username, displayName, language, timeZone, dateFormat } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update User model Name if provided
    if (name && name.trim()) {
      if (name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({ status: 'fail', field: 'name', message: 'Name must be between 2 and 50 characters.' });
      }
      user.name = name.trim();
      await user.save();
    }

    const settings = await getOrCreateSettings(user._id, user);

    // Validate username uniqueness if changed
    if (username && username.trim()) {
      const cleanUsername = username.trim().toLowerCase();
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleanUsername)) {
        return res.status(400).json({
          status: 'fail',
          field: 'username',
          message: 'Username must be 3-30 characters (letters, numbers, hyphens, underscores).'
        });
      }

      const existing = await UserSettings.findOne({
        'general.username': cleanUsername,
        user: { $ne: req.user._id }
      });
      if (existing) {
        return res.status(400).json({
          status: 'fail',
          field: 'username',
          message: 'Username is already taken. Please choose another.'
        });
      }
      settings.general.username = cleanUsername;
    }

    if (displayName !== undefined) settings.general.displayName = displayName.trim();
    if (language !== undefined) settings.general.language = language;
    if (timeZone !== undefined) settings.general.timeZone = timeZone;
    if (dateFormat !== undefined) settings.general.dateFormat = dateFormat;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'General preferences updated successfully',
      data: { user, settings }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/account
export const updateAccount = async (req, res, next) => {
  try {
    const { email, phone, location, company, jobTitle } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Validate Email
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ status: 'fail', field: 'email', message: 'Enter a valid email address.' });
      }
      const existingUser = await User.findOne({ email: cleanEmail, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ status: 'fail', field: 'email', message: 'Email address is already registered.' });
      }
      user.email = cleanEmail;
    }

    // Validate Indian Phone
    if (phone !== undefined && phone.trim() !== '') {
      const cleanPhone = phone.trim();
      const digits = cleanPhone.replace(/\D/g, '');
      const tenDigits = (digits.startsWith('91') && digits.length === 12) ? digits.slice(2) : digits;
      if (tenDigits.length !== 10 || !/^[6-9]/.test(tenDigits)) {
        return res.status(400).json({ status: 'fail', field: 'phone', message: 'Enter a valid 10-digit Indian mobile number.' });
      }
      user.phone = cleanPhone;
    }

    // Validate Location
    if (location !== undefined && location.trim() !== '') {
      const cleanLoc = location.trim().replace(/\s+/g, ' ');
      if (cleanLoc.length < 3 || cleanLoc.length > 120 || /^\d+$/.test(cleanLoc)) {
        return res.status(400).json({ status: 'fail', field: 'location', message: 'Enter a valid city/location between 3 and 120 characters.' });
      }
      user.location = cleanLoc;
    }

    if (jobTitle !== undefined) {
      user.title = jobTitle.trim();
    }

    await user.save();

    const settings = await getOrCreateSettings(user._id, user);
    if (company !== undefined) settings.account.company = company.trim();
    if (jobTitle !== undefined) settings.account.jobTitle = jobTitle.trim();
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Account information updated successfully',
      data: { user, settings }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/security
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'All password fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ status: 'fail', field: 'confirmPassword', message: 'New passwords do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ status: 'fail', field: 'newPassword', message: 'Password must be at least 8 characters long.' });
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
      return res.status(400).json({
        status: 'fail',
        field: 'newPassword',
        message: 'Password must contain uppercase, lowercase, number, and special character.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ status: 'fail', field: 'currentPassword', message: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/notifications
export const updateNotifications = async (req, res, next) => {
  try {
    const { email, push, sms } = req.body;
    const settings = await getOrCreateSettings(req.user._id);

    if (email) settings.notifications.email = { ...settings.notifications.email.toObject(), ...email };
    if (push) settings.notifications.push = { ...settings.notifications.push.toObject(), ...push };
    if (sms) settings.notifications.sms = { ...settings.notifications.sms.toObject(), ...sms };

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: { notifications: settings.notifications }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/appearance
export const updateAppearance = async (req, res, next) => {
  try {
    const { theme, accentColor, density, fontSize } = req.body;
    const settings = await getOrCreateSettings(req.user._id);

    if (theme) settings.appearance.theme = theme;
    if (accentColor) settings.appearance.accentColor = accentColor;
    if (density) settings.appearance.density = density;
    if (fontSize) settings.appearance.fontSize = fontSize;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Appearance preferences updated successfully',
      data: { appearance: settings.appearance }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/privacy
export const updatePrivacy = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);

    const allowed = ['profileVisibility', 'showOnlineStatus', 'showLastSeen', 'allowDirectMessages', 'searchEngineIndexing', 'freelancerRecommendations'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        settings.privacy[field] = req.body[field];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Privacy controls updated successfully',
      data: { privacy: settings.privacy }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/billing
export const updateBilling = async (req, res, next) => {
  try {
    const { currentPlan, billingCycle } = req.body;
    const settings = await getOrCreateSettings(req.user._id);

    if (currentPlan) settings.billing.currentPlan = currentPlan;
    if (billingCycle) settings.billing.billingCycle = billingCycle;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Billing preferences updated successfully',
      data: { billing: settings.billing }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/settings/connected-accounts/:provider/toggle
export const toggleConnectedAccount = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const settings = await getOrCreateSettings(req.user._id);

    if (!settings.connectedAccounts[provider]) {
      return res.status(400).json({ success: false, message: 'Invalid provider' });
    }

    const currentStatus = settings.connectedAccounts[provider].connected;
    settings.connectedAccounts[provider].connected = !currentStatus;
    if (!currentStatus) {
      if (provider === 'google') settings.connectedAccounts.google.email = (req.user.email || 'user') + '@gmail.com';
      if (provider === 'microsoft') settings.connectedAccounts.microsoft.email = (req.user.email || 'user') + '@outlook.com';
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: `${provider.toUpperCase()} account ${!currentStatus ? 'connected' : 'disconnected'} successfully`,
      data: { connectedAccounts: settings.connectedAccounts }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/settings/sessions/:sessionId
export const terminateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const settings = await getOrCreateSettings(req.user._id);

    settings.sessions = settings.sessions.filter(s => s.sessionId !== sessionId);
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Session terminated successfully',
      data: { sessions: settings.sessions }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/settings/sessions/signout-all
export const terminateAllSessions = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings(req.user._id);
    // Keep only the current active session
    settings.sessions = settings.sessions.filter(s => s.current === true);
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Signed out of all other devices',
      data: { sessions: settings.sessions }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/settings/export
export const exportUserData = async (req, res, next) => {
  try {
    const { type = 'full' } = req.body;
    const user = await User.findById(req.user._id);
    const settings = await getOrCreateSettings(req.user._id, user);

    const exportPayload = {
      exportGeneratedAt: new Date().toISOString(),
      exportType: type,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        skills: user.skills,
        hourlyRate: user.hourlyRate,
        bio: user.bio,
        createdAt: user.createdAt
      },
      settings: settings.toObject()
    };

    res.status(200).json({
      success: true,
      message: 'Export archive generated successfully',
      data: exportPayload
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/settings/danger/delete-account
export const deleteAccount = async (req, res, next) => {
  try {
    const { password, confirmationPhrase } = req.body;
    if (confirmationPhrase !== 'delete my workstation account') {
      return res.status(400).json({
        status: 'fail',
        message: 'Confirmation phrase does not match. Please type "delete my workstation account" exactly.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ status: 'fail', field: 'password', message: 'Incorrect password verification.' });
    }

    // Set status to suspended or delete
    user.status = 'suspended';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account has been scheduled for permanent deletion.'
    });
  } catch (error) {
    next(error);
  }
};
