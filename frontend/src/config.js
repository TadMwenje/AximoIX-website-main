const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
  },
  production: {
    // CORRECT Vercel URL - NOTE THE DASHES!
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://aximo-ix-website-main.vercel.app/api'
  }
};