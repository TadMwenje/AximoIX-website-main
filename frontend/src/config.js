// src/config.js
const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000/api'
  },
  production: {
    apiBaseUrl: 'https://aximoix-api.azurewebsites.net/api'
  }
};

// Always use production for now to ensure it works
const currentConfig = config.production;

export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;// Build timestamp: Tue Oct 21 12:11:10 PM UTC 2025
