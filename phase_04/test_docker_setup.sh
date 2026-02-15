#!/bin/bash
# Test script to verify Docker setup for Taskie Todo App

echo "Testing Docker setup for Taskie Todo App..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed."
    exit 1
fi

# Check if the required files exist
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found in current directory."
    exit 1
fi

if [ ! -f "backend/Dockerfile" ]; then
    echo "Error: Backend Dockerfile not found."
    exit 1
fi

if [ ! -f "frontend/Dockerfile" ]; then
    echo "Error: Frontend Dockerfile not found."
    exit 1
fi

echo "✓ All required files are present"
echo "✓ Docker is running"
echo "✓ docker-compose is available"

echo ""
echo "To build and run the application:"
echo "1. Run: docker-compose build"
echo "2. Run: docker-compose up -d"
echo ""
echo "After running, you can access:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- Backend API Docs: http://localhost:8000/docs"

exit 0