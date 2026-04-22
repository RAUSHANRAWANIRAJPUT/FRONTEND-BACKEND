import axios from 'axios';

// Check for user-configured API URL in localStorage
const savedApiUrl = typeof window !== 'undefined' ? localStorage.getItem('api_base_url') : null;

// Default to env variable or the fallback IP
const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.39:5000/api';

const rawApiBaseUrl = savedApiUrl || defaultBaseUrl;

export const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, '');
export const socketServerUrl = apiBaseUrl.replace(/\/api\/?$/, '');

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

