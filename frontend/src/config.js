// src/config.js
const config = {
  // Development - local backend
  development: {
    apiBaseUrl: 'http://localhost:8000/api'
  },
  // Production - Azure backend
  production: {
    apiBaseUrl: 'https://aximoix-backend.eastus.azurecontainer.io/api'
  }
};

// Auto-detect environment
const isProduction = process.env.NODE_ENV === 'production';
const currentConfig = isProduction ? config.production : config.development;

// Fallback to production if backend URL is set via environment
if (process.env.REACT_APP_API_URL) {
  currentConfig.apiBaseUrl = process.env.REACT_APP_API_URL;
}

// Export both the config and the base URL for convenience
export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;