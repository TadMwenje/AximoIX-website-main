# setup-domain.ps1
param(
    [string]$ResourceGroup = "aximoix-rg",
    [string]$DomainName = "aximoix.com",
    [string]$StaticAppName = "aximoix-frontend"
)

Write-Host "🌐 Setting up custom domain..." -ForegroundColor Green

# Buy domain through Azure (if available in your region)
Write-Host "🛒 Checking domain availability..." -ForegroundColor Yellow
az appservice domain list --output table

# For existing domains, we'll configure DNS manually
Write-Host "`n📋 Manual DNS Configuration Required:" -ForegroundColor Yellow
Write-Host "1. Go to your domain registrar's DNS settings" -ForegroundColor White
Write-Host "2. Add these records:" -ForegroundColor White

# Get the static web app hostname
$StaticAppHostname = az staticwebapp show --name $StaticAppName --resource-group $ResourceGroup --query "defaultHostname" -o tsv

Write-Host "`nCNAME Record:" -ForegroundColor Cyan
Write-Host "Name: www" -ForegroundColor White
Write-Host "Value: $StaticAppHostname" -ForegroundColor White

Write-Host "`nA Record (for apex domain):" -ForegroundColor Cyan
Write-Host "Name: @" -ForegroundColor White
Write-Host "Value: [Get IP from Azure Static Web App custom domains]" -ForegroundColor White

Write-Host "`nAfter setting up DNS, run:" -ForegroundColor Yellow
Write-Host "az staticwebapp hostname set --name $StaticAppName --resource-group $ResourceGroup --hostname www.$DomainName" -ForegroundColor White