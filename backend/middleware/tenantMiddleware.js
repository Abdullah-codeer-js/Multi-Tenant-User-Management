const { FORBIDDEN } = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");

function tenantMiddleware(req, res, next) {
  if (!req.user || !req.user.company_id) {
    return next(new ApiError(FORBIDDEN, "Tenant context is missing from the authenticated user."));
  }

  req.companyId = req.user.company_id;
  return next();
}

module.exports = {
  tenantMiddleware,
};
