const { BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND } = require("../constants/httpStatus");
const { ROLE_VALUES, ADMIN, MANAGER } = require("../constants/roles");
const { USER } = require("../constants/message");
const ApiError = require("../utils/ApiError");
const { hashPassword } = require("../utils/password");
const userRepository = require("../repositories/userRepository");

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function assertRoleAssignmentAllowed(actorRole, targetRole) {
  const permittedRolesByActor = {
    [ADMIN]: [MANAGER, "Employee"],
    [MANAGER]: ["Employee"],
  };

  const allowedRoles = permittedRolesByActor[actorRole] || [];

  if (!targetRole || !allowedRoles.includes(targetRole)) {
    throw new ApiError(
      FORBIDDEN,
      actorRole === MANAGER
        ? "Managers can only create Employee users."
        : "Admins can only create Manager or Employee users."
    );
  }
}

async function listUsers(companyId) {
  return userRepository.getUsersByCompany(companyId);
}

async function getUserById(companyId, userId) {
  const user = await userRepository.getUserById(userId, companyId);
  if (!user) {
    throw new ApiError(NOT_FOUND, USER.NOT_FOUND);
  }

  return user;
}

async function createUser(companyId, actorRole, payload) {
  const { name, email, password, role } = payload;

  if (!name || !email || !password || !role) {
    throw new ApiError(BAD_REQUEST, "Name, email, password, and role are required.");
  }

  if (!ROLE_VALUES.includes(role)) {
    throw new ApiError(BAD_REQUEST, "Role must be one of Admin, Manager, or Employee.");
  }

  assertRoleAssignmentAllowed(actorRole, role);

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userRepository.getUserByEmailInCompany(companyId, normalizedEmail);

  if (existingUser) {
    throw new ApiError(CONFLICT, USER.EMAIL_IN_USE);
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.createUser({
    company_id: companyId,
    name: name.trim(),
    email: normalizedEmail,
    password_hash: passwordHash,
    role,
  });

  return user;
}

async function updateUser(companyId, actorRole, userId, payload) {
  const updates = {};

  if (payload.name) updates.name = payload.name.trim();
  if (payload.email) updates.email = normalizeEmail(payload.email);
  if (payload.role) {
    if (!ROLE_VALUES.includes(payload.role)) {
      throw new ApiError(BAD_REQUEST, "Role must be one of Admin, Manager, or Employee.");
    }
    assertRoleAssignmentAllowed(actorRole, payload.role);
    updates.role = payload.role;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(BAD_REQUEST, "No valid changes were provided.");
  }

  const existingUser = await userRepository.getUserById(userId, companyId);
  if (!existingUser) {
    throw new ApiError(NOT_FOUND, USER.NOT_FOUND);
  }

  if (actorRole === MANAGER && existingUser.role === MANAGER) {
    throw new ApiError(FORBIDDEN, "Managers cannot modify other Manager accounts.");
  }

  if (payload.email) {
    const duplicate = await userRepository.getUserByEmailInCompany(companyId, updates.email);
    if (duplicate && duplicate.id !== userId) {
      throw new ApiError(CONFLICT, USER.EMAIL_IN_USE);
    }
  }

  return userRepository.updateUser(userId, companyId, updates);
}

async function deleteUser(companyId, actorRole, userId) {
  const existingUser = await userRepository.getUserById(userId, companyId);
  if (!existingUser) {
    throw new ApiError(NOT_FOUND, USER.NOT_FOUND);
  }

  if (actorRole === MANAGER && existingUser.role !== "Employee") {
    throw new ApiError(FORBIDDEN, "Managers can only remove Employee users.");
  }

  return userRepository.softDeleteUser(userId, companyId);
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
