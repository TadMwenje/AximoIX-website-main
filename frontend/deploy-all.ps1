# deploy-all.ps1 - UPDATED FOR CORRECT PATHS
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus"
)

Write-Host "🚀 AximoIX Full Stack Deployment" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

# Validate Azure login
Write-Host "🔐 Validating Azure login..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure first: az login" -ForegroundColor Red
    exit 1
}

# Deploy backend from backend directory
Write-Host "`n📦 Step 1: Deploying Backend..." -ForegroundColor Green
$BackendUrl = ../backend/deploy-backend.ps1 -ResourceGroup $ResourceGroup -Location $Location

if (-not $BackendUrl) {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
    exit 1
}

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test backend
Write-Host "🔍 Testing backend connection..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BackendUrl/api/" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend is responding: $($Response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend might still be starting... Continuing deployment" -ForegroundColor Yellow
}

# Deploy frontend
Write-Host "`n🎨 Step 2: Deploying Frontend..." -ForegroundColor Green
$FrontendUrl = ./deploy-frontend.ps1 -ResourceGroup $ResourceGroup -Location $Location -BackendUrl $BackendUrl

if (-not $FrontendUrl) {
    Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🌐 Backend API: $BackendUrl" -ForegroundColor Cyan
Write-Host "📚 API Docs: $BackendUrl/api/docs" -ForegroundColor Cyan
Write-Host "🎨 Frontend: https://$FrontendUrl" -ForegroundColor Cyan
Write-Host "`n🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the contact form at https://$FrontendUrl" -ForegroundColor White
Write-Host "2. Set up custom domain using setup-domain.ps1" -ForegroundColor White
Write-Host "3. Configure DNS records for your domain" -ForegroundColor White