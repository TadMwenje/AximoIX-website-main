#!/bin/bash
# setup-github-pages.sh

echo "🚀 Setting up GitHub Pages deployment for AximoIX..."

# Navigate to frontend directory
cd frontend

# Install gh-pages package
echo "📦 Installing gh-pages..."
npm install --save-dev gh-pages

# Create GitHub Actions workflow directory
echo "📁 Setting up GitHub Actions..."
cd ..
mkdir -p .github/workflows

echo "🎉 GitHub Pages setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Commit these changes to your repository"
echo "2. Enable GitHub Pages in repository settings:"
echo "   - Go to Settings → Pages"
echo "   - Select 'GitHub Actions' as source"
echo "3. Add REACT_APP_API_URL secret in repository settings:"
echo "   - Go to Settings → Secrets and variables → Actions"
echo "   - Add New Repository Secret"
echo "   - Name: REACT_APP_API_URL"
echo "   - Value: Your backend API URL"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://tadmwenje.github.io/AximoIX-website-main"