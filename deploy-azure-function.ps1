# deploy-azure-function.ps1
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$Location = "eastus",
    [string]$FunctionAppName = "aximoix-api"
)

Write-Host "🚀 Deploying Azure Function Backend..." -ForegroundColor Green

# Validate Azure login
az account show
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please login to Azure first: az login" -ForegroundColor Red
    exit 1
}

# Create resource group if it doesn't exist
az group create --name $ResourceGroup --location $Location

# Create storage account
$StorageName = "aximoixstorage$(Get-Random -Minimum 1000 -Maximum 9999)"
az storage account create `
    --name $StorageName `
    --location $Location `
    --resource-group $ResourceGroup `
    --sku Standard_LRS

# Create Function App (Consumption plan - FREE)
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
cd api
Compress-Archive -Path * -DestinationPath function-app.zip -Force

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

# Get the function URL
$FunctionUrl = "https://$FunctionAppName.azurewebsites.net"
Write-Host "✅ Azure Function deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Function URL: $FunctionUrl" -ForegroundColor Cyan

return $FunctionUrl