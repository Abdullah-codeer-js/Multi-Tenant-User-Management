const { FORBIDDEN } = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");

function authorizeRoles(...roleGroups) {
  const allowedRoles = roleGroups.flatMap((group) =>
    Array.isArray(group) ? group : [group]
  );

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(FORBIDDEN, "Access denied. User context is missing."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(FORBIDDEN, "You do not have permission to perform this action.")
      );
    }

    return next();
  };
}

module.exports = {
  authorizeRoles,
};
