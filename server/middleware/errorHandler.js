// server/middleware/errorHandler.js
function notFound(req, res, next) {
  const error = new Error(`🔍 Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
}

module.exports = { notFound, errorHandler };
