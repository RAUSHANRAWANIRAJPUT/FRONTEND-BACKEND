import axios from 'axios';

const LOCAL_API_FALLBACKS = [
  'http://localhost:5050/api',
  'http://localhost:5051/api',
  'http://localhost:5052/api',
  'http://localhost:5000/api',
];

const LEGACY_API_URLS = new Set([
  'http://192.168.1.39:5000/api',
  'http://192.168.1.39:5000/api/',
]);

const normalizeApiUrl = (value) => String(value || '').trim().replace(/\/$/, '');

const isLikelyLocalUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};

const dedupeUrls = (urls) => Array.from(new Set(urls.filter(Boolean).map(normalizeApiUrl)));

const getSavedApiUrl = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedApiUrl = normalizeApiUrl(localStorage.getItem('api_base_url'));

  if (!savedApiUrl || LEGACY_API_URLS.has(savedApiUrl)) {
    return null;
  }

  return savedApiUrl;
};

const getApiCandidates = () => {
  const savedApiUrl = getSavedApiUrl();
  const defaultBaseUrl = normalizeApiUrl(import.meta.env.VITE_API_BASE_URL || LOCAL_API_FALLBACKS[0]);

  if (savedApiUrl && !isLikelyLocalUrl(savedApiUrl)) {
    return dedupeUrls([savedApiUrl, defaultBaseUrl, ...LOCAL_API_FALLBACKS]);
  }

  return dedupeUrls([defaultBaseUrl, savedApiUrl, ...LOCAL_API_FALLBACKS]);
};

const apiCandidates = getApiCandidates();
let activeApiBaseUrl = apiCandidates[0];

const syncActiveApiUrl = (nextApiBaseUrl) => {
  const normalizedApiUrl = normalizeApiUrl(nextApiBaseUrl);

  if (!normalizedApiUrl) {
    return;
  }

  activeApiBaseUrl = normalizedApiUrl;
  apiClient.defaults.baseURL = normalizedApiUrl;

  if (typeof window !== 'undefined') {
    localStorage.setItem('api_base_url', normalizedApiUrl);
  }
};

export const apiBaseUrl = activeApiBaseUrl;
export const socketServerUrl = activeApiBaseUrl.replace(/\/api\/?$/, '');

export const apiClient = axios.create({
  baseURL: activeApiBaseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const shouldRetryWithFallback = (error) => {
  if (error.config?.skipBaseUrlFallback) {
    return false;
  }

  if (error.config?._apiFallbackRetried) {
    return false;
  }

  if (error.response) {
    return false;
  }

  return error.code === 'ERR_NETWORK' || !error.code;
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.baseURL) {
      syncActiveApiUrl(response.config.baseURL);
    }

    return response;
  },
  async (error) => {
    if (!shouldRetryWithFallback(error)) {
      throw error;
    }

    const attemptedBaseUrl = normalizeApiUrl(
      error.config?.baseURL ||
      apiClient.defaults.baseURL ||
      activeApiBaseUrl
    );

    const fallbackCandidates = apiCandidates.filter((candidate) => candidate !== attemptedBaseUrl);
    let lastError = error;

    for (const candidate of fallbackCandidates) {
      try {
        const response = await axios({
          ...error.config,
          baseURL: candidate,
          _apiFallbackRetried: true,
        });

        syncActiveApiUrl(candidate);
        return response;
      } catch (candidateError) {
        lastError = candidateError;

        if (candidateError.response) {
          throw candidateError;
        }
      }
    }

    throw lastError;
  }
);
