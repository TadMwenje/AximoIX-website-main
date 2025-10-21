# deploy-azure-function.ps1 - FIXED VERSION
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$FunctionAppName = "aximoix-api"
)

Write-Host "🚀 Deploying Azure Function Backend..." -ForegroundColor Green

# Validate Azure login
Write-Host "🔐 Validating Azure login..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure first: az login" -ForegroundColor Red
    exit 1
}

# Check if api directory exists
if (-not (Test-Path "api")) {
    Write-Host "❌ 'api' directory not found. Please make sure you have the api folder with your function code." -ForegroundColor Red
    Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "📁 Available directories:" -ForegroundColor Yellow
    Get-ChildItem -Directory | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
    exit 1
}

# Create resource group if it doesn't exist
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# Create storage account
Write-Host "💾 Creating storage account..." -ForegroundColor Yellow
$StorageName = "aximoixstorage$(Get-Random -Minimum 1000 -Maximum 9999)"
az storage account create `
    --name $StorageName `
    --location $Location `
    --resource-group $ResourceGroup `
    --sku Standard_LRS

# Create Function App (Consumption plan - FREE)
Write-Host "⚙️ Creating Azure Function App..." -ForegroundColor Yellow
az functionapp create `
    --name $FunctionAppName `
    --storage-account $StorageName `
    --consumption-plan-location $Location `
    --resource-group $ResourceGroup `
    --os-type Linux `
    --runtime python `
    --runtime-version 3.9 `
    --functions-version 4

# Create function app package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Set-Location "api"

# Check what files are in the api directory
Write-Host "📁 Files in api directory:" -ForegroundColor Yellow
Get-ChildItem | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }

# Create zip package
Compress-Archive -Path * -DestinationPath function-app.zip -Force

if (-not (Test-Path "function-app.zip")) {
    Write-Host "❌ Failed to create deployment package" -ForegroundColor Red
    exit 1
}

# Deploy the function
Write-Host "📤 Deploying function code..." -ForegroundColor Yellow
az functionapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $FunctionAppName `
    --src ./function-app.zip

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Function deployment failed" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ".."

# Get the function URL
$FunctionUrl = "https://$FunctionAppName.azurewebsites.net"
Write-Host "✅ Azure Function deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Function URL: $FunctionUrl" -ForegroundColor Cyan
Write-Host "📚 API Endpoint: $FunctionUrl/api" -ForegroundColor Cyan

return $FunctionUrl