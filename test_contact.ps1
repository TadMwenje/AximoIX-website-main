$body = @{
    name = "Alice Johnson"
    email = "alice@example.com"
    service_interest = "Financial Technology"
    message = "I need fintech solutions for my startup"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/contact" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONTACT FORM TEST RESULT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
Write-Host ""
Write-Host "Response:" -ForegroundColor Yellow
$responseJson = $response.Content | ConvertFrom-Json
$responseJson | ConvertTo-Json | Write-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
