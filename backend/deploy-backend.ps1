# deploy-backend.ps1 - FREE TIER VERSION
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$ContainerName = "aximoix-backend"
)

Write-Host "🚀 Starting AximoIX Backend Deployment (Free Tier)..." -ForegroundColor Green

# Login to Azure (if not already)
Write-Host "🔐 Checking Azure login..." -ForegroundColor Yellow
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Logging into Azure..." -ForegroundColor Yellow
    az login
}

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# Deploy to Azure Container Instances (FREE TIER FRIENDLY)
Write-Host "🚀 Deploying to Azure Container Instances..." -ForegroundColor Yellow

# Get MongoDB connection string from environment
$MongoUrl = "mongodb+srv://tadiwamwenje00_db_user:RPvXEHmqSU4d12V6@aximoixcluster.yhr0vt9.mongodb.net/?retryWrites=true&w=majority&appName=aximoixcluster"

# Build and deploy using ACR free tier
Write-Host "🐳 Setting up container registry..." -ForegroundColor Yellow
$AcrName = "aximoixacr$(Get-Random -Minimum 1000 -Maximum 9999)"

az acr create --resource-group $ResourceGroup `
    --name $AcrName `
    --sku Basic `
    --admin-enabled true

# Build and push image
az acr build --registry $AcrName --image aximoix-backend:latest .

# Deploy to Container Instances
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
    --cpu 1 `
    --memory 1.5 `
    --restart-policy OnFailure

# Get the public URL
$Fqdn = az container show --resource-group $ResourceGroup --name $ContainerName --query "ipAddress.fqdn" -o tsv

if (-not $Fqdn) {
    Write-Host "❌ Failed to get backend URL" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Backend URL: https://$Fqdn" -ForegroundColor Cyan
Write-Host "📚 API Documentation: https://${Fqdn}/api/docs" -ForegroundColor Cyan

return $Fqdn