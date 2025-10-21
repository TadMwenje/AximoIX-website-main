# deploy-frontend.ps1 - FIXED VERSION
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$BackendUrl = "https://aximoix-api.azurewebsites.net",
    [string]$StaticAppName = "aximoix-frontend"
)

Write-Host "🎨 Starting AximoIX Frontend Deployment..." -ForegroundColor Green

# Show current directory for debugging
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow

# Check if we're in the right place
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Make sure you're in the frontend directory." -ForegroundColor Red
    Write-Host "📁 Available files:" -ForegroundColor Yellow
    Get-ChildItem | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build with the correct backend URL
Write-Host "🔨 Building frontend with backend URL: $BackendUrl/api" -ForegroundColor Yellow
$env:REACT_APP_API_URL = "$BackendUrl/api"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if build was successful
if (-not (Test-Path "build")) {
    Write-Host "❌ Build directory not found. Build may have failed." -ForegroundColor Red
    Write-Host "📁 Available files after build:" -ForegroundColor Yellow
    Get-ChildItem | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
    exit 1
}

Write-Host "✅ Build successful! Build directory created." -ForegroundColor Green

# Deploy to Static Web App
Write-Host "☁️ Deploying to Azure Static Web Apps..." -ForegroundColor Yellow
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
    Write-Host "❌ Static Web App deployment failed" -ForegroundColor Red
    exit 1
}

# Get URL
Write-Host "⏳ Waiting for deployment to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

$StaticAppUrl = az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup --query "defaultHostname" -o tsv

if (-not $StaticAppUrl) {
    Write-Host "❌ Failed to get frontend URL" -ForegroundColor Red
    Write-Host "🔍 Checking deployment status..." -ForegroundColor Yellow
    az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup --query "{ProvisioningState:provisioningState, Status:status}" -o table
    exit 1
}

Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend URL: https://$StaticAppUrl" -ForegroundColor Cyan
Write-Host "🔗 Backend API: $BackendUrl/api" -ForegroundColor Cyan
Write-Host "📱 Test your website: https://$StaticAppUrl" -ForegroundColor Cyan

return $StaticAppUrl