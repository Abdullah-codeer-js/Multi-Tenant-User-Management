const companyService = require("../services/companyServices");
const { OK } = require("../constants/httpStatus");

async function getCompanyProfile(req, res, next) {
  try {
    const company = await companyService.getCompanyProfile(req.user.company_id);

    return res.status(OK).json({
      success: true,
      data: company,
    });
  } catch (error) {
    return next(error);
  }
}

async function listCompanies(req, res, next) {
  try {
    const companies = await companyService.listCompanies();

    return res.status(OK).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCompanyProfile,
  listCompanies,
};
