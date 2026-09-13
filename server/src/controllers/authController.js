import * as authService from '../services/authService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.js';
import { verifyRefreshToken } from '../utils/tokenUtils.js';

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
    
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('token', accessToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: accessToken,
      accessToken,
      user,
      data: {
        token: accessToken,
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.body);
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, rememberMe } = await authService.loginUser(req.body);
    
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge,
      path: '/',
    };

    res.cookie('token', accessToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: accessToken,
      accessToken,
      user,
      data: {
        token: accessToken,
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no refresh token provided',
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);

    let user = null;
    try {
      const decoded = verifyRefreshToken(newRefreshToken || refreshToken);
      const userId = decoded.id || decoded.userId;
      user = await User.findById(userId).select('-password');
    } catch (e) {
      // Non-fatal if user lookup fails during refresh
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('token', accessToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: accessToken,
      accessToken,
      user,
      data: {
        token: accessToken,
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const message = await authService.forgotPassword(req.body.email);
    return res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const message = await authService.resetPassword({ token: req.params.token, password: req.body.password });
    return res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user?._id) {
      await authService.logoutUser(req.user._id);
    }
    
    const isProduction = process.env.NODE_ENV === 'production';
    const clearOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    res.clearCookie('token', clearOptions);
    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      user: req.user,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};
