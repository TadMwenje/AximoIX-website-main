// config.js - Frontend configuration
const getApiBaseUrl = () => {
  // For local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Production - Vercel backend
  return 'https://aximoixwebsitemain.vercel.app/api';
};

const config = {
  API_BASE_URL: getApiBaseUrl(),
  ENV: process.env.NODE_ENV || 'production',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

export { config };
export default config;