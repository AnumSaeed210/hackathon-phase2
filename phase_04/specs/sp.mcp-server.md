# MCP Server Specification

## Purpose

Expose task operations as AI tools.

## Overview

The MCP (Minimum Compute Protocol) server provides a standardized interface for AI agents to access task management functionality. The server hosts stateless tools that perform specific operations on tasks while enforcing user authentication and authorization.

## Architecture

The MCP server operates as a separate service that:
- Exposes tools through the MCP protocol
- Maintains no internal state between requests
- Validates user permissions for each operation
- Interacts with the database for persistence
- Returns structured responses to the AI agent

## Rules

- **Stateless execution**: Each tool invocation is independent with no shared state between calls
- **DB persistence only**: All data is stored in and retrieved from the database; no in-memory caching
- **Structured responses**: All tools return responses in a consistent, predictable format
- **Graceful error handling**: Errors are caught and returned in a structured format without crashing the server
- **User validation**: Each tool validates that the requesting user has permission to perform the operation
- **Input validation**: All tool inputs are validated before processing

## Configuration

### Environment Variables
- `DATABASE_URL`: Connection string for the PostgreSQL database
- `BETTER_AUTH_SECRET`: Secret key for JWT token verification
- `MCP_PORT`: Port on which the MCP server listens (default: 3001)

### Dependencies
- Official MCP SDK for Python
- SQLModel for database interactions
- PyJWT for token verification
- FastAPI for web framework

## Tool Registration

The MCP server registers the following tools with the MCP protocol:
- add_task
- list_tasks
- complete_task
- delete_task
- update_task

Each tool is registered with appropriate input/output schemas and descriptions.

## Security Measures

- JWT token validation for each tool invocation
- User ownership verification for all operations
- Input sanitization to prevent injection attacks
- Rate limiting to prevent abuse
- Structured logging for audit trails

## Error Handling

### Standard Error Format
```json
{
  "error": {
    "type": "string - Error type (e.g., 'validation_error', 'authorization_error')",
    "message": "string - Human-readable error message",
    "code": "string - Machine-readable error code"
  }
}
```

### Common Error Types
- `validation_error`: Input parameters failed validation
- `authorization_error`: User lacks permission for the requested operation
- `not_found_error`: Requested resource does not exist
- `server_error`: Unexpected server error occurred

## Logging and Monitoring

- All tool invocations are logged with user ID, tool name, and timestamp
- Error conditions are logged with additional context
- Performance metrics are collected for each tool
- Audit logs track all user actions for compliance

## Health Checks

The MCP server provides a health check endpoint:
- GET `/health`: Returns 200 OK if server is operational
- Includes database connectivity check
- Reports server status and version

## Deployment

- Runs as a separate service from the main backend API
- Can be scaled independently based on AI agent usage
- Supports containerized deployment (Docker)
- Configurable port and environment variables

## Success Criteria

- MCP server successfully registers all required tools
- Tools execute statelessly with no shared state between invocations
- All data operations are persisted to the database
- Responses follow the structured format consistently
- Error conditions are handled gracefully with appropriate messages
- User authentication and authorization are enforced for all operations
- Server maintains performance under expected load
- Health checks pass reliably