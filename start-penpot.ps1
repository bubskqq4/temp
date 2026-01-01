# Start Penpot locally using Docker Compose
Write-Host "Starting Penpot Design Tool..." -ForegroundColor Green
Write-Host "This will start Penpot on http://localhost:9001" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker is running ✓" -ForegroundColor Green

# Start Penpot services
Write-Host ""
Write-Host "Starting Penpot services..." -ForegroundColor Cyan
docker-compose -f docker-compose.penpot.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Penpot is starting!" -ForegroundColor Green
    Write-Host ""
    Write-Host "┌─────────────────────────────────────────┐" -ForegroundColor Cyan
    Write-Host "│  Penpot Design Lab is now running!     │" -ForegroundColor Cyan  
    Write-Host "│                                         │" -ForegroundColor Cyan
    Write-Host "│  URL: http://localhost:9001             │" -ForegroundColor White
    Write-Host "│                                         │" -ForegroundColor Cyan
    Write-Host "│  First time?                            │" -ForegroundColor Yellow
    Write-Host "│  - Create an account at the URL above   │" -ForegroundColor White
    Write-Host "│  - No email verification needed!        │" -ForegroundColor White
    Write-Host "└─────────────────────────────────────────┘" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Opening Penpot in your browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:9001"
    
    Write-Host ""
    Write-Host "To view logs: docker-compose -f docker-compose.penpot.yml logs -f" -ForegroundColor Gray
    Write-Host "To stop: docker-compose -f docker-compose.penpot.yml down" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to start Penpot" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
    exit 1
}
