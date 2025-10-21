# deploy-complete.ps1
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus"
)

Write-Host "🚀 AximoIX Complete Deployment" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

# Validate Azure login
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
try {
    $Response = Invoke-RestMethod -Uri "$BackendUrl/api" -Method Get -TimeoutSec 30
    Write-Host "✅ Backend is responding: $($Response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend might still be starting... Continuing" -ForegroundColor Yellow
}

# Deploy frontend
Write-Host "`n🎨 Step 2: Deploying Frontend..." -ForegroundColor Green
cd frontend
$FrontendUrl = & ".\deploy-frontend.ps1" -ResourceGroup $ResourceGroup -Location $Location -BackendUrl $BackendUrl

if (-not $FrontendUrl) {
    Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🌐 Backend API: $BackendUrl/api" -ForegroundColor Cyan
Write-Host "🎨 Frontend: https://$FrontendUrl" -ForegroundColor Cyan
Write-Host "📚 Check frontend in browser: https://$FrontendUrl" -ForegroundColor Cyan

# Output for custom domain setup
Write-Host "`n🔧 For custom domain (aximoix.com):" -ForegroundColor Yellow
Write-Host "1. Run: az staticwebapp hostname set --name aximoix-frontend --resource-group $ResourceGroup --hostname www.aximoix.com" -ForegroundColor White
Write-Host "2. Configure DNS with your domain provider" -ForegroundColor White