// frontend/config.js - DOUBLE CHECK THIS
const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  },
  production: {
    // MAKE SURE THIS IS YOUR ACTUAL VERCEL URL
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://aximo-ix-website-main.vercel.app/api'
  }
};

const currentConfig = config.production;
export const API_BASE_URL = currentConfig.apiBaseUrl;
export default currentConfig;