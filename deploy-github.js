// deploy-github.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages Deployment...');
console.log('📁 Current directory:', __dirname);

try {
  // Navigate to frontend directory
  process.chdir('frontend');
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('🌐 Deploying to GitHub Pages...');
  execSync('npx gh-pages -d build', { stdio: 'inherit' });

  console.log('✅ Successfully deployed to GitHub Pages!');
  console.log('📢 Your site is available at: https://tadmwenje.github.io/AximoIX-website-main');
} catch (error) {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
}