export const USER_STORAGE_KEY = 'readtogether_user';
export const TOKEN_STORAGE_KEY = 'readtogether_token';
export const LEGACY_TOKEN_STORAGE_KEY = 'token';

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getDefaultPageForRole = (role) => (
  role === 'admin' ? 'admin-dashboard' : 'dashboard'
);

export const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  const parsedUser = safeJsonParse(savedUser);

  if (!parsedUser) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

  return parsedUser;
};

export const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
};

export const setStoredAuth = (user, token) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, token);
  }
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
};
