export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let errors = err.errors || null;

  if (process.env.NODE_ENV === 'development') {
    console.error('Error encountered:', err);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error.message = `Resource not found with id: ${err.value}`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `An account or record with that ${field} already exists.`;
    errors = { [field]: `${field} is already in use.` };
    error.statusCode = 409;
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    const fieldErrors = {};
    Object.keys(err.errors || {}).forEach((key) => {
      fieldErrors[key] = err.errors[key].message;
    });
    errors = fieldErrors;
    error.message = Object.values(fieldErrors)[0] || 'Validation failed';
    error.statusCode = 400;
  }

  // JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token. Please sign in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Authentication token expired. Please refresh your session.';
    error.statusCode = 401;
  }

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'Uploaded file is too large. Maximum allowed size is 10MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Unexpected file field or maximum number of files exceeded.';
    } else {
      error.message = err.message;
    }
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
