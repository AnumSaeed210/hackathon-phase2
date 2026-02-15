# PowerShell script to build Docker images for Taskie Todo App

Write-Host "Building Docker images for Taskie Todo App..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info *> $null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker daemon is not running"
    }
} catch {
    Write-Host "Error: Docker daemon is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Build the images
Write-Host "Building images..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Images built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To run the application, use: docker-compose up" -ForegroundColor White
    Write-Host "To run in detached mode, use: docker-compose up -d" -ForegroundColor White
    Write-Host ""
    Write-Host "The application will be available at:" -ForegroundColor White
    Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "- Backend API: http://localhost:8000" -ForegroundColor White
    Write-Host "- Backend Docs: http://localhost:8000/docs" -ForegroundColor White
} else {
    Write-Host "Failed to build images. Please check the error messages above." -ForegroundColor Red
    exit 1
}