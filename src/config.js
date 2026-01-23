// config.js - Frontend configuration
const getApiBaseUrl = () => {
  // For local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // For custom domain (aximoix.com) or GitHub Pages - use Vercel backend
  return 'https://aximoixwebsitemain.vercel.app/api';
};

const config = {
  API_BASE_URL: getApiBaseUrl(),
  ENV: process.env.NODE_ENV || 'production',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

// Debug info
console.log('🔧 Frontend Configuration:');
console.log('🔧 Hostname:', window.location.hostname);
console.log('🔧 API Base URL:', config.API_BASE_URL);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('🔧 REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);

export { config };
export default config;