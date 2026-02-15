# Taskie Todo App

A full-stack todo application with user authentication and task management capabilities.

## Features

- User authentication and authorization
- Task management (create, read, update, delete)
- Responsive UI built with Next.js
- FastAPI backend with PostgreSQL database
- Docker containerization for easy deployment

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11
- **Database**: PostgreSQL
- **Authentication**: Better Auth
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Docker Desktop (or Docker Engine)
- Docker Compose

## Getting Started with Docker

### 1. Clone the repository

```bash
git clone <repository-url>
cd taskie-todo-app/phase_04
```

### 2. Build and run the application

```bash
# Build the Docker images
docker-compose build

# Start the application in detached mode
docker-compose up -d
```

### 3. Access the application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Database: PostgreSQL running on localhost:5432

### 4. View logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### 5. Stop the application

```bash
# Stop the application
docker-compose down

# Stop and remove volumes (will delete database data)
docker-compose down -v
```

## Development with Docker

For development purposes, you can use the override configuration which enables hot-reloading:

```bash
# This will mount your source code into the containers for live updates
docker-compose up
```

## Environment Variables

The application uses the following environment variables:

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for authentication (minimum 32 characters)
- `UNDO_TOKEN_SECRET`: Secret key for undo tokens
- `REQUEST_ID_HEADER`: Header name for request IDs
- `LOG_LEVEL`: Logging level (INFO, DEBUG, etc.)

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Authentication URL

## Architecture

The application consists of the following services:

- **frontend**: Next.js application serving the user interface
- **backend**: FastAPI application providing REST API endpoints
- **postgres**: PostgreSQL database for data persistence
- **agent**: Optional agent service for additional functionality

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure ports 3000, 8000, and 5432 are available
2. **Database connection errors**: Ensure the postgres service is running before the backend
3. **Environment variables**: Make sure all required environment variables are set

### Resetting the Application

To completely reset the application and start fresh:

```bash
docker-compose down -v  # Removes volumes too
docker-compose build
docker-compose up
```

## Production Deployment

For production deployments, consider:

1. Using a managed PostgreSQL service instead of the containerized database
2. Setting up proper SSL certificates
3. Configuring environment variables securely
4. Implementing backup strategies for the database