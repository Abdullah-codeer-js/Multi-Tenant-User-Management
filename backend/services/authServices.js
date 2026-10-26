const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const userRepository = require("../repositories/userRepository");
const { BAD_REQUEST, CONFLICT, NOT_FOUND, UNAUTHORIZED } = require("../constants/httpStatus");
const { USER } = require("../constants/message");

function sanitizeUser(user) {
  if (!user) return null;

  const { password_hash, ...safeUser } = user;
  return safeUser;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeSubdomain(subdomain) {
  return String(subdomain || "").trim().toLowerCase();
}

async function loginUser({ subdomain, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedSubdomain = normalizeSubdomain(subdomain);

  const user = await userRepository.findByEmailAndSubdomain({
    email: normalizedEmail,
    subdomain: normalizedSubdomain,
  });

  if (!user) {
    throw new ApiError(UNAUTHORIZED, "Invalid email, password, or tenant.");
  }

  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new ApiError(UNAUTHORIZED, "Invalid email, password, or tenant.");
  }

  const token = signToken({
    id: user.id,
    company_id: user.company_id,
    role: user.role,
    email: user.email,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function getProfile(user) {
  const profile = await userRepository.getUserById(user.id, user.company_id);
  if (!profile) {
    throw new ApiError(NOT_FOUND, USER.NOT_FOUND);
  }

  return sanitizeUser(profile);
}

async function updateProfile(user, payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ApiError(BAD_REQUEST, "A profile update must be provided.");
  }

  const unsupportedFields = Object.keys(payload).filter(
    (field) => !["name", "email"].includes(field)
  );
  if (unsupportedFields.length > 0) {
    throw new ApiError(BAD_REQUEST, "Only name and email can be updated.");
  }

  const updates = {};

  if (payload.name !== undefined) {
    if (typeof payload.name !== "string" || payload.name.trim().length < 2) {
      throw new ApiError(BAD_REQUEST, "Name must be at least 2 characters.");
    }
    updates.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    const email = normalizeEmail(payload.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(BAD_REQUEST, "A valid email is required.");
    }

    const existingUser = await userRepository.getUserByEmailInCompany(
      user.company_id,
      email
    );
    if (existingUser && String(existingUser.id) !== String(user.id)) {
      throw new ApiError(CONFLICT, USER.EMAIL_IN_USE);
    }
    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(BAD_REQUEST, "Name or email must be provided.");
  }

  const updatedUser = await userRepository.updateUser(
    user.id,
    user.company_id,
    updates
  );
  if (!updatedUser) {
    throw new ApiError(NOT_FOUND, USER.NOT_FOUND);
  }

  return sanitizeUser(updatedUser);
}

module.exports = {
  loginUser,
  getProfile,
  updateProfile,
};
