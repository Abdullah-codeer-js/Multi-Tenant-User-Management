const { BAD_REQUEST, CONFLICT, NOT_FOUND } = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");
const employeeRepository = require("../repositories/employeeRepository");
const userRepository = require("../repositories/userRepository");

function normalizeString(value) {
  if (value === null || value === undefined) return null;

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function ensureRequiredValue(value, fieldName) {
  const normalized = normalizeString(value);
  if (!normalized) {
    throw new ApiError(BAD_REQUEST, `${fieldName} is required.`);
  }

  return normalized;
}

function ensureInteger(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new ApiError(BAD_REQUEST, `${fieldName} must be a valid integer.`);
  }

  return parsed;
}

async function listEmployees(companyId) {
  return employeeRepository.getEmployeesByCompany(companyId);
}

async function getEmployeeById(companyId, id) {
  const employee = await employeeRepository.getEmployeeById(id, companyId);
  if (!employee) {
    throw new ApiError(NOT_FOUND, "Employee not found.");
  }

  return employee;
}

async function createEmployee(companyId, payload) {
  const { user_id, employee_code, department, job_title, phone, joining_date } = payload || {};

  const normalizedUserId = ensureRequiredValue(user_id, "User reference");
  const validUserId = ensureInteger(normalizedUserId, "User reference");
  const normalizedEmployeeCode = ensureRequiredValue(employee_code, "Employee code");
  const normalizedDepartment = ensureRequiredValue(department, "Department");
  const normalizedJobTitle = ensureRequiredValue(job_title, "Job title");
  const normalizedJoiningDate = ensureRequiredValue(joining_date, "Joining date");

  const user = await userRepository.getUserById(validUserId, companyId);
  if (!user) {
    throw new ApiError(NOT_FOUND, "User not found.");
  }

  const duplicateEmployee = await employeeRepository.getEmployeeByCodeInCompany(companyId, normalizedEmployeeCode);
  if (duplicateEmployee) {
    throw new ApiError(CONFLICT, "An employee with this code already exists in this company.");
  }

  const normalizedPhone = normalizeString(phone);

  return employeeRepository.createEmployee({
    company_id: companyId,
    user_id: validUserId,
    employee_code: normalizedEmployeeCode,
    department: normalizedDepartment,
    job_title: normalizedJobTitle,
    phone: normalizedPhone,
    joining_date: normalizedJoiningDate,
  });
}

async function updateEmployee(companyId, id, payload) {
  const safePayload = payload || {};
  const updates = {};

  if (safePayload.employee_code !== undefined) {
    const normalizedEmployeeCode = ensureRequiredValue(safePayload.employee_code, "Employee code");
    updates.employee_code = normalizedEmployeeCode;
  }

  if (safePayload.department !== undefined) {
    const normalizedDepartment = ensureRequiredValue(safePayload.department, "Department");
    updates.department = normalizedDepartment;
  }

  if (safePayload.job_title !== undefined) {
    const normalizedJobTitle = ensureRequiredValue(safePayload.job_title, "Job title");
    updates.job_title = normalizedJobTitle;
  }

  if (safePayload.phone !== undefined) {
    updates.phone = normalizeString(safePayload.phone);
  }

  if (safePayload.joining_date !== undefined) {
    updates.joining_date = ensureRequiredValue(safePayload.joining_date, "Joining date");
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(BAD_REQUEST, "No valid employee updates were provided.");
  }

  const employee = await employeeRepository.getEmployeeById(id, companyId);
  if (!employee) {
    throw new ApiError(NOT_FOUND, "Employee not found.");
  }

  if (updates.employee_code) {
    const duplicateEmployee = await employeeRepository.getEmployeeByCodeInCompany(companyId, updates.employee_code);
    if (duplicateEmployee && duplicateEmployee.id !== id) {
      throw new ApiError(CONFLICT, "An employee with this code already exists in this company.");
    }
  }

  return employeeRepository.updateEmployee(id, companyId, updates);
}

async function deleteEmployee(companyId, id) {
  const employee = await employeeRepository.getEmployeeById(id, companyId);
  if (!employee) {
    throw new ApiError(NOT_FOUND, "Employee not found.");
  }

  return employeeRepository.softDeleteEmployee(id, companyId);
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
