$body = @{
    name = "Emma Wilson"
    email = "emma@example.com"
    service_interest = "Advertising & Marketing"
    message = "We need help with our digital marketing campaign"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/contact" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ CONTACT FORM TEST #2" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Response:" -ForegroundColor Cyan
$responseJson = $response.Content | ConvertFrom-Json
$responseJson | Format-List
Write-Host ""
Write-Host "Key Info:" -ForegroundColor Yellow
Write-Host "  Message: $($responseJson.message)" 
Write-Host "  Email Status: $($responseJson.email_status)"
Write-Host "  Contact ID: $($responseJson.id)"
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
