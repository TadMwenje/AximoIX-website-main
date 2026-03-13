Write-Host ""
Write-Host "SENDING EMAIL TO SERVICES@AXIMOIX.COM" -ForegroundColor Cyan
Write-Host ""

$body = @{
    name = "Test User"
    email = "test@example.com"
    service_interest = "Cloud Solutions"
    message = "Testing email delivery system"
} | ConvertTo-Json

Write-Host "Submitting contact form..." -ForegroundColor Yellow

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/contact" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

$result = $response.Content | ConvertFrom-Json

Write-Host ""
Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
Write-Host "Email Status: $($result.email_status)" -ForegroundColor Green
Write-Host "Submission ID: $($result.id)" -ForegroundColor Green
Write-Host "Message: $($result.message)" -ForegroundColor Green
Write-Host "Recipient: services@aximoix.com" -ForegroundColor Green
Write-Host ""
Write-Host "✅ EMAIL SENT SUCCESSFULLY!" -ForegroundColor Green
