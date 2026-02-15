# PowerShell script to verify Docker setup for Taskie Todo App

Write-Host "Testing Docker setup for Taskie Todo App..." -ForegroundColor Green

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

# Check if docker-compose is available
$composeCheck = docker-compose version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: docker-compose is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check if the required files exist
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "Error: docker-compose.yml not found in current directory." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "backend/Dockerfile")) {
    Write-Host "Error: Backend Dockerfile not found." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "frontend/Dockerfile")) {
    Write-Host "Error: Frontend Dockerfile not found." -ForegroundColor Red
    exit 1
}

Write-Host "✓ All required files are present" -ForegroundColor Green
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host "✓ docker-compose is available" -ForegroundColor Green

Write-Host ""
Write-Host "To build and run the application:" -ForegroundColor Yellow
Write-Host "1. Run: docker-compose build" -ForegroundColor White
Write-Host "2. Run: docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "After running, you can access:" -ForegroundColor Yellow
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "- Backend API Docs: http://localhost:8000/docs" -ForegroundColor White

exit 0