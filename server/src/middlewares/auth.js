import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization Bearer header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Check HTTP-only cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    
    if (!token || token === 'null' || token === 'undefined') {
      throw ApiError.unauthorized('Not authorized to access this route');
    }

    try {
      const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'workstation_super_secret_access_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      const userId = decoded.id || decoded.userId || decoded._id;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw ApiError.unauthorized('User not found');
      }
      
      if (user.status === 'suspended') {
        throw ApiError.unauthorized('User account is suspended');
      }
      
      req.user = user;
      next();
    } catch (error) {
      throw ApiError.unauthorized('Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Access denied for role: ${req.user ? req.user.role : 'unknown'}`));
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token || token === 'null' || token === 'undefined') {
      req.user = null;
      return next();
    }

    try {
      const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'workstation_super_secret_access_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      const userId = decoded.id || decoded.userId || decoded._id;
      const user = await User.findById(userId).select('-password');
      
      if (user && user.status !== 'suspended') {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (error) {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
