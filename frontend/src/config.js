// config.js - UPDATED
const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  },
  production: {
    // Replace with your Vercel backend URL
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://aximo-ix-website-main.vercel.app'
  }
};

const currentConfig = config.production;
export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;