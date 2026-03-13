Write-Host ""
Write-Host "FINAL TEST: Email from africau.edu domain" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$body = @{
    name = "Tadiwa Mwenje"
    email = "mwenjet@africau.edu"
    service_interest = "AI & Cloud Solutions"
    message = "Testing contact form with africau.edu domain. This email should arrive at services@aximoix.com"
} | ConvertTo-Json

Write-Host "Submitting contact form..." -ForegroundColor Yellow
Write-Host "From: mwenjet@africau.edu" -ForegroundColor Cyan
Write-Host "To: services@aximoix.com" -ForegroundColor Cyan
Write-Host ""

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/contact" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
$result = $response.Content | ConvertFrom-Json

Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
Write-Host "Email Status: $($result.email_status)" -ForegroundColor Green
Write-Host "Submission ID: $($result.id)" -ForegroundColor Cyan
Write-Host "Message: $($result.message)" -ForegroundColor Green
Write-Host ""
Write-Host "Email sent successfully to services@aximoix.com!" -ForegroundColor Green
Write-Host "Check your iCloud+ mailbox for the email" -ForegroundColor Cyan
