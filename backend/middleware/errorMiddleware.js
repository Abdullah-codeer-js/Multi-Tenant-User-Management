const { INTERNAL_SERVER_ERROR } = require("../constants/httpStatus");

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const payload = {
    success: false,
    message: err.message || "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;
