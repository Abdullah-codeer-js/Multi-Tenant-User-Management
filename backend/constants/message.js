module.exports = {
  AUTH: {
    INVALID_TOKEN: "Invalid or expired token.",
    MISSING_TOKEN: "Authentication token is required.",
    LOGIN_SUCCESS: "Login successful.",
    REGISTER_SUCCESS: "Company registered successfully.",
    PROFILE_FETCHED: "Profile retrieved successfully.",
    PROFILE_UPDATED: "Profile updated successfully.",
    LOGOUT_SUCCESS: "Logged out successfully. Remove the token from the client to complete logout.",
  },
  COMPANY: {
    CREATED: "Company created successfully.",
    DUPLICATE_SUBDOMAIN: "This subdomain is already in use.",
    NOT_FOUND: "Company not found.",
  },
  USER: {
    CREATED: "User created successfully.",
    UPDATED: "User updated successfully.",
    DELETED: "User deleted successfully.",
    NOT_FOUND: "User not found.",
    EMAIL_IN_USE: "A user with this email already exists in this tenant.",
  },
  VALIDATION: {
    INVALID_SUBDOMAIN: "Subdomain is invalid. Use letters, numbers, and hyphen characters only.",
    PASSWORD_MISMATCH: "Password confirmation does not match.",
    WEAK_PASSWORD: "Password must be at least 8 characters long.",
  },
};
