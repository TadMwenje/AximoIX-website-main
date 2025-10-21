# deploy-complete.ps1 - FIXED VERSION
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus"
)

Write-Host "🚀 AximoIX Complete Deployment" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

# Validate Azure login
Write-Host "🔐 Validating Azure login..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure first: az login" -ForegroundColor Red
    exit 1
}

# Deploy backend (Azure Function)
Write-Host "`n📦 Step 1: Deploying Backend (Azure Function)..." -ForegroundColor Green
$BackendUrl = & ".\deploy-azure-function.ps1" -ResourceGroup $ResourceGroup -Location $Location

if (-not $BackendUrl) {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
    exit 1
}

# Wait for backend
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test backend
Write-Host "🔍 Testing backend connection..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BackendUrl/api" -Method Get -TimeoutSec 30
    Write-Host "✅ Backend is responding: $($Response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend might still be starting... Continuing" -ForegroundColor Yellow
}

# Deploy frontend
Write-Host "`n🎨 Step 2: Deploying Frontend..." -ForegroundColor Green

# Check if frontend directory exists
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Frontend directory not found" -ForegroundColor Red
    exit 1
}

# Navigate to frontend folder and deploy
Set-Location "frontend"
$FrontendUrl = & ".\deploy-frontend.ps1" -ResourceGroup $ResourceGroup -Location $Location -BackendUrl $BackendUrl

if (-not $FrontendUrl) {
    Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ".."

Write-Host "`n🎉 Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🌐 Backend API: $BackendUrl/api" -ForegroundColor Cyan
Write-Host "🎨 Frontend: https://$FrontendUrl" -ForegroundColor Cyan
Write-Host "📚 API Documentation: $BackendUrl/api/docs" -ForegroundColor Cyan
Write-Host "🔧 Health Check: $BackendUrl/api/health" -ForegroundColor Cyan

Write-Host "`n🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your website: https://$FrontendUrl" -ForegroundColor White
Write-Host "2. Test the contact form" -ForegroundColor White
Write-Host "3. Set up custom domain using setup-domain.ps1" -ForegroundColor White