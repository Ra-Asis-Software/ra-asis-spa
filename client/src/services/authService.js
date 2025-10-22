import api from "./api";

const AUTH_PATH = "/auth";

// Register a new user
export const registerUser = (userData) =>
  api.post(`${AUTH_PATH}/register`, userData);

// Verify email using a token sent by email
export const verifyEmail = (token) =>
  api.get(`${AUTH_PATH}/verify-email/${token}`);

// Log in with email/username + password
export const loginUser = (credentials) =>
  api.post(`${AUTH_PATH}/login`, credentials);

// Request a password‑reset email
export const requestPasswordReset = (email, frontendUrl) =>
  api.post(`${AUTH_PATH}/reset-password`, { email, frontendUrl });

// Reset password using token from email
export const resetPassword = (token, newPassword) =>
  api.post(`${AUTH_PATH}/reset-password/${token}`, { newPassword });
