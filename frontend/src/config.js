// src/config.js
const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000/api'
  },
  production: {
    // This will be your Azure Function URL
    apiBaseUrl: 'https://aximoix-api.azurewebsites.net/api'
  }
};

const isProduction = process.env.NODE_ENV === 'production';
const currentConfig = isProduction ? config.production : config.development;

// Override with environment variable if set
if (process.env.REACT_APP_API_URL) {
  currentConfig.apiBaseUrl = process.env.REACT_APP_API_URL;
}

export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;// Build timestamp: Tue Oct 21 12:11:10 PM UTC 2025
