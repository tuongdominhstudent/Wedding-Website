const FALLBACK_API_BASE_URL = 'http://localhost:4000/api/v1';

export const env = Object.freeze({
  appName: import.meta.env.VITE_APP_NAME || 'Minh Tuong & Thao Nguyen - Wedding',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL
});
