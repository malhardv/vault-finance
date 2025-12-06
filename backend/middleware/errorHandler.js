/**
 * Global error handling middleware for the Vault System
 * Provides consistent error response format and handles specific error types
 */

/**
 * Error handler middleware
 * Catches all errors thrown in route handlers and returns consistent JSON responses
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: errors.join(', ')
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'The provided ID is not valid'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      error: `A record with this ${field} already exists`
    });
  }

  // JWT authentication errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      error: 'Token has expired'
    });
  }

  // Custom authentication errors
  if (err.message === 'Not authorized' || err.message === 'No token provided') {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      error: err.message
    });
  }

  // Custom validation errors
  if (err.message && err.message.includes('Invalid credentials')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication error',
      error: err.message
    });
  }

  // File upload errors
  if (err.message && (err.message.includes('file') || err.message.includes('upload'))) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  // Not found errors
  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
      error: err.message
    });
  }

  // File too large error (from multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large',
      error: 'The uploaded file exceeds the maximum allowed size'
    });
  }

  // Unsupported file type error (from multer)
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file',
      error: 'Unsupported file type'
    });
  }

  // Database connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({
      success: false,
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'A database error occurred'
    });
  }

  // Default error response for unhandled errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 404 Not Found handler
 * Handles requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export { errorHandler, notFoundHandler };
