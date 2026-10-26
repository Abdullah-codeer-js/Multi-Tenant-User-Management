const employeeService = require("../services/employeeServices");
const { OK, CREATED } = require("../constants/httpStatus");

async function listEmployees(req, res, next) {
  try {
    const employees = await employeeService.listEmployees(req.user.company_id);
    return res.status(OK).json({ success: true, data: employees });
  } catch (error) {
    return next(error);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeById(req.user.company_id, req.params.id);
    return res.status(OK).json({ success: true, data: employee });
  } catch (error) {
    return next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const employee = await employeeService.createEmployee(req.user.company_id, req.body);
    return res.status(CREATED).json({ success: true, data: employee });
  } catch (error) {
    return next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employee = await employeeService.updateEmployee(req.user.company_id, req.params.id, req.body);
    return res.status(OK).json({ success: true, data: employee });
  } catch (error) {
    return next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const employee = await employeeService.deleteEmployee(req.user.company_id, req.params.id);
    return res.status(OK).json({ success: true, data: employee });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
