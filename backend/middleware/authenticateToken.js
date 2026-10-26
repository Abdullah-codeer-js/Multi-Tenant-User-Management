const { UNAUTHORIZED } = require("../constants/httpStatus");
const { AUTH } = require("../constants/message");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return next(new ApiError(UNAUTHORIZED, AUTH.MISSING_TOKEN));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(UNAUTHORIZED, AUTH.INVALID_TOKEN));
  }
}

module.exports = {
  authenticateToken,
};
