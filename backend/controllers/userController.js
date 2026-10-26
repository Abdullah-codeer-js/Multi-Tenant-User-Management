const userService = require("../services/userServices");
const { OK, CREATED } = require("../constants/httpStatus");

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers(req.user.company_id);
    return res.status(OK).json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.company_id, req.params.id);
    return res.status(OK).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.user.company_id, req.user.role, req.body);
    return res.status(CREATED).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.user.company_id, req.user.role, req.params.id, req.body);
    return res.status(OK).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userService.deleteUser(req.user.company_id, req.user.role, req.params.id);
    return res.status(OK).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
