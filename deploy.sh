#!/bin/bash

# Build the project
echo "Building React app..."
npm run build

# Create .nojekyll file
echo "" > ./build/.nojekyll

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
git add build -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix build origin gh-pages

echo "Deployment complete!"
echo "Your site should be live at: http://aximoix.com"
