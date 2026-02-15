#!/bin/bash
# Docker build and run script for Taskie Todo App

echo "Building Docker images for Taskie Todo App..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker Desktop first."
    exit 1
fi

# Build the images
echo "Building images..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "Images built successfully!"
    echo ""
    echo "To run the application, use: docker-compose up"
    echo "To run in detached mode, use: docker-compose up -d"
    echo ""
    echo "The application will be available at:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:8000"
    echo "- Backend Docs: http://localhost:8000/docs"
else
    echo "Failed to build images. Please check the error messages above."
    exit 1
fi