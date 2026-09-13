import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['JWT_SECRET'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `⚠️ Warning: Missing environment variables: ${missing.join(', ')}. Using development defaults.`
    );
  }
};

export const config = {
  port: process.env.PORT || 9005,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/freelancing_marketplace',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_super_secret_key_12345',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_jwt_secret_67890',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CLIENT_URL || 'http://localhost:3256',
};

export default config;
