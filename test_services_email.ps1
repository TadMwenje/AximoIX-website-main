$body = @{
    name = "David Martinez"
    email = "david@test.com"
    service_interest = "AI Solutions"
    message = "Testing email delivery to services@aximoix.com"
} | ConvertTo-Json

Write-Host "TESTING CONTACT FORM EMAIL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sending to: services@aximoix.com" -ForegroundColor Yellow
Write-Host "From: david@test.com" -ForegroundColor Yellow
Write-Host ""

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/contact" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green

$responseJson = $response.Content | ConvertFrom-Json
Write-Host "Submission ID: $($responseJson.id)" -ForegroundColor Cyan
Write-Host "Email Status: $($responseJson.email_status)" -ForegroundColor Cyan
Write-Host "Message: $($responseJson.message)" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK Check services@aximoix.com inbox for the email!" -ForegroundColor Green
