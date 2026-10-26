const authService = require("../services/authServices");
const companyService = require("../services/companyServices");
const { CREATED, OK } = require("../constants/httpStatus");
const { AUTH } = require("../constants/message");

async function register(req, res, next) {
  try {
    const result = await companyService.registerCompany({
      companyName: req.body.companyName,
      subdomain: req.body.subdomain,
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });

    const response = {
      success: true,
      message: AUTH.REGISTER_SUCCESS,
      data: {
        company: result.company,
        user: result.user,
      },
    };

    return res.status(CREATED).json(response);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { subdomain, email, password } = req.body;
    const result = await authService.loginUser({ subdomain, email, password });

    return res.status(OK).json({
      success: true,
      message: AUTH.LOGIN_SUCCESS,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user);

    return res.status(OK).json({
      success: true,
      message: AUTH.PROFILE_FETCHED,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await authService.updateProfile(req.user, req.body);

    return res.status(OK).json({
      success: true,
      message: AUTH.PROFILE_UPDATED,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res) {
  return res.status(OK).json({
    success: true,
    message: AUTH.LOGOUT_SUCCESS,
  });
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
};
