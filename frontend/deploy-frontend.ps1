# deploy-frontend.ps1
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$BackendUrl = "https://aximoix-backend.eastus.azurecontainer.io",
    [string]$StaticAppName = "aximoix-frontend"
)

Write-Host "🎨 Starting AximoIX Frontend Deployment..." -ForegroundColor Green

# Check if Node.js and npm are available
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js $nodeVersion and npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js and npm are required. Please install them first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the frontend with production API URL
Write-Host "🔨 Building frontend for production..." -ForegroundColor Yellow
$env:REACT_APP_API_URL = "$BackendUrl/api"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if build directory exists
if (-not (Test-Path "build")) {
    Write-Host "❌ Build directory not found. Build may have failed." -ForegroundColor Red
    exit 1
}

# Create Azure Static Web App
Write-Host "☁️ Creating Azure Static Web App..." -ForegroundColor Yellow
az staticwebapp create `
    --name $StaticAppName `
    --resource-group $ResourceGroup `
    --source . `
    --location $Location `
    --branch main `
    --app-location "./" `
    --output-location "build" `
    --sku Free

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Static Web App" -ForegroundColor Red
    exit 1
}

# Get the static web app URL
$StaticAppUrl = az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup --query "defaultHostname" -o tsv

if (-not $StaticAppUrl) {
    Write-Host "❌ Failed to get Static Web App URL" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend URL: https://$StaticAppUrl" -ForegroundColor Cyan
Write-Host "🔗 Backend API: $BackendUrl/api" -ForegroundColor Cyan

return $StaticAppUrl