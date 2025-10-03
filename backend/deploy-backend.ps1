# deploy-backend.ps1
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$AcrName = "aximoixacr",
    [string]$ContainerName = "aximoix-backend"
)

Write-Host "🚀 Starting AximoIX Backend Deployment..." -ForegroundColor Green

# Login to Azure
Write-Host "🔐 Logging into Azure..." -ForegroundColor Yellow
az login

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# Create Azure Container Registry (Basic tier - free)
Write-Host "🐳 Creating Azure Container Registry..." -ForegroundColor Yellow
az acr create --resource-group $ResourceGroup `
    --name $AcrName `
    --sku Basic `
    --admin-enabled true

# Build and push Docker image
Write-Host "📦 Building and pushing Docker image..." -ForegroundColor Yellow

# Login to ACR
az acr login --name $AcrName

# Build image
docker build -t $AcrName.azurecr.io/aximoix-backend:latest .

# Push to ACR
docker push $AcrName.azurecr.io/aximoix-backend:latest

# Get MongoDB connection string (you'll need to set this as an environment variable)
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
    --registry-login-server "$AcrName.azurecr.io" `
    --registry-username $(az acr credential show --name $AcrName --query "username" -o tsv) `
    --registry-password $(az acr credential show --name $AcrName --query "passwords[0].value" -o tsv) `
    --cpu 1 `
    --memory 1.5

# Get the public URL
$Fqdn = az container show --resource-group $ResourceGroup --name $ContainerName --query "ipAddress.fqdn" -o tsv

Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Backend URL: https://$Fqdn" -ForegroundColor Cyan
Write-Host "📚 API Documentation: https://${Fqdn}/api/docs" -ForegroundColor Cyan

return $Fqdn