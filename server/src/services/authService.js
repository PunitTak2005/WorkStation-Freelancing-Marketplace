import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateOTP } from '../utils/helpers.js';
import { sendEmail } from '../utils/email.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const registerUser = async ({ name, email, password, role, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest('Email already registered');
  }

  const user = await User.create({ name, email, password, role, phone });

  const otp = generateOTP();
  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
  };

  await sendEmail({
    to: email,
    subject: 'Welcome to Workstation - Verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; color: #0F172A; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Welcome to Workstation!</h1>
        <p>Thank you for registering. Please verify your email address to complete your registration.</p>
        <p>Your verification code is: <strong style="font-size: 24px; color: #7C3AED;">${otp}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>Best regards,<br>The Workstation Team</p>
      </div>
    `
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

export const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select('+otp');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired OTP');
  }

  user.verified = true;
  user.otp = undefined;
  
  await user.save();
  
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  
  return userObj;
};

export const loginUser = async ({ email, password, rememberMe }) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.status === 'suspended') {
    throw ApiError.forbidden('Account suspended');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken, rememberMe };
};

export const refreshTokens = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isMatch) {
    // Potential theft: clear refresh token
    user.refreshToken = undefined;
    await user.save();
    throw ApiError.unauthorized('Token reuse detected');
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  
  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return 'If that email exists, a password reset link has been sent.';
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiry = Date.now() + 30 * 60 * 1000; // 30 min

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3256'}/reset-password/${resetToken}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Workstation - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; color: #0F172A; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}" style="color: #4F46E5;">${resetUrl}</a></p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  });

  return 'Password reset email sent';
};

export const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() }
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  
  await user.save();

  return 'Password reset successful';
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }
};
