# deploy-backend.ps1 - FIXED VERSION
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$ContainerName = "aximoix-backend"
)

Write-Host "🚀 Starting AximoIX Backend Deployment" -ForegroundColor Green

# Validate Azure login
Write-Host "🔐 Validating Azure login..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure first: az login" -ForegroundColor Red
    exit 1
}

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# Create Azure Container Registry
Write-Host "🐳 Creating Azure Container Registry..." -ForegroundColor Yellow
$AcrName = "aximoixacr$(Get-Random -Minimum 1000 -Maximum 9999)"

az acr create --resource-group $ResourceGroup `
    --name $AcrName `
    --sku Basic `
    --admin-enabled true

# Build image directly in ACR from current directory (backend)
Write-Host "📦 Building container image in Azure Container Registry..." -ForegroundColor Yellow
az acr build --registry $AcrName --image aximoix-backend:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build container image" -ForegroundColor Red
    exit 1
}

# Get MongoDB connection string
$MongoUrl = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"

# Deploy to Azure Container Instances
Write-Host "🚀 Deploying to Azure Container Instances..." -ForegroundColor Yellow
az container create `
    --resource-group $ResourceGroup `
    --name $ContainerName `
    --image $AcrName.azurecr.io/aximoix-backend:latest `
    --dns-name-label $ContainerName `
    --ports 8000 `
    --environment-variables `
        MONGO_URL=$MongoUrl `
        DB_NAME="aximoix" `
    --registry-username $(az acr credential show --name $AcrName --query "username" -o tsv) `
    --registry-password $(az acr credential show --name $AcrName --query "passwords[0].value" -o tsv) `
    --os-type Linux `
    --cpu 1 `
    --memory 1.5 `
    --restart-policy OnFailure

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy container" -ForegroundColor Red
    exit 1
}

# Get the public URL
Write-Host "⏳ Waiting for container to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

$Fqdn = az container show --resource-group $ResourceGroup --name $ContainerName --query "ipAddress.fqdn" -o tsv

if (-not $Fqdn) {
    Write-Host "❌ Failed to get backend URL" -ForegroundColor Red
    Write-Host "🔍 Checking container status..." -ForegroundColor Yellow
    az container show --resource-group $ResourceGroup --name $ContainerName --query "{ProvisioningState:provisioningState, State:instanceView.state}" -o table
    exit 1
}

$BackendUrl = "http://${Fqdn}:8000"
Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Backend URL: $BackendUrl" -ForegroundColor Cyan
Write-Host "📚 API Documentation: ${BackendUrl}/api/docs" -ForegroundColor Cyan

return $BackendUrl