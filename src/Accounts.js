// src/Accounts.js
// Lightweight client-side accounts for private beta (use server auth in prod).

const USERS = [
  { username: "ragincagin", password: "Top5", displayName: "Jodyce" },
  { username: "trainee02", password: "Route#02", displayName: "Trainee 02" },
  { username: "trainee03", password: "Route#03", displayName: "Trainee 03" },
  { username: "trainee04", password: "Route#04", displayName: "Trainee 04" },
  { username: "trainee05", password: "Route#05", displayName: "Trainee 05" },
  { username: "trainee06", password: "Route#06", displayName: "Trainee 06" },
  { username: "trainee07", password: "Route#07", displayName: "Trainee 07" },
  { username: "trainee08", password: "Route#08", displayName: "Trainee 08" },
  { username: "trainee09", password: "Route#09", displayName: "Trainee 09" },
  { username: "Dylan", password: "Power26", displayName: "Dylan_S" },
  { username: "Phoenix", password: "Power25", displayName: "DevTeam" },
];

const SKEY = "auth-user";

export function listUsers() {
  return USERS.map(u => ({ username: u.username, displayName: u.displayName }));
}

export function validateUser(username, password) {
  return USERS.find(u => u.username === username && u.password === password) || null;
}

export function login(username, password) {
  const user = validateUser(username, password);
  if (user) {
    sessionStorage.setItem(SKEY, JSON.stringify({ username: user.username, displayName: user.displayName }));
    return { username: user.username, displayName: user.displayName };
  }
  return null;
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SKEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem(SKEY);
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

// Simple per-user storage helpers (used by training modules)
export function readUserKey(user, key, fallback) {
  try {
    const v = localStorage.getItem(`user:${user}:${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
export function writeUserKey(user, key, value) {
  localStorage.setItem(`user:${user}:${key}`, JSON.stringify(value));
}
