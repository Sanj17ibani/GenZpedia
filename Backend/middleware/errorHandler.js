const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const first = Object.values(err.errors || {})[0];
    message = first ? first.message : message;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
