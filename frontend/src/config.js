// frontend/config.js - UPDATED FOR GITHUB PAGES
const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  },
  production: {
    // Use your actual Vercel backend URL
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://aximo-ix-website-main.vercel.app/api'
  }
};

// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = isDevelopment ? config.development : config.production;

export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;