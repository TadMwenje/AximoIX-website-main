// config.js - FIXED VERSION
const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://aximoix-api.azurewebsites.net/api'
  }
};

// Use production for now to ensure it works
const currentConfig = config.production;

export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;