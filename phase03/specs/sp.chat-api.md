# Chat API Specification

## Purpose

Enable stateless natural-language task management via chat.

## Overview

The Chat API provides a REST endpoint that accepts user messages and returns AI-generated responses. The endpoint handles conversation state management by loading historical messages from the database and storing new messages after processing.

## API Endpoint

### POST `/api/{user_id}/chat`

#### Request Parameters

- `user_id` (path parameter): The authenticated user's unique identifier
- `message` (body parameter): The user's message in natural language
- `conversation_id` (optional body parameter): The conversation identifier to continue an existing conversation

#### Request Headers

- `Authorization: Bearer <jwt_token>`: Valid JWT token for authentication

#### Request Body

```json
{
  "message": "String, required - The user's message",
  "conversation_id": "String, optional - Existing conversation ID"
}
```

#### Response Body

```json
{
  "response": "String - Assistant's response to the user",
  "conversation_id": "String - The conversation ID (new or existing)",
  "tool_usage": {
    "tool_name": "String - Name of the MCP tool used",
    "input": "Object - Input parameters to the tool",
    "output": "Object - Result from the tool execution"
  },
  "timestamp": "ISO 8601 timestamp"
}
```

#### Status Codes

- `200 OK`: Successfully processed the message and returned a response
- `400 Bad Request`: Invalid request parameters or malformed JSON
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User attempting to access another user's conversation
- `404 Not Found`: Conversation ID not found for the user
- `500 Internal Server Error`: Unexpected server error during processing

## Behavior

1. Validates JWT token and extracts user identity
2. Verifies user has access to the specified conversation (if provided)
3. Loads conversation history from database
4. Passes message and history to AI agent for processing
5. Agent executes appropriate MCP tool based on intent
6. Stores user message and assistant response in database
7. Returns assistant reply and tool usage metadata

## Rules

- **Stateless per request**: Each request contains all necessary information; no server-side session state
- **JWT required**: All requests must include a valid JWT token in the Authorization header
- **User-scoped access only**: Users can only access their own conversations
- **Database persistence**: All conversation history is stored in the database
- **Structured responses**: Responses follow the defined JSON schema

## Error Handling

- Invalid JWT tokens result in 401 Unauthorized responses
- Attempts to access another user's conversation result in 403 Forbidden
- Malformed request bodies result in 400 Bad Request responses
- Database errors result in 500 Internal Server Error responses
- Tool execution errors are caught and returned as structured error responses

## Success Criteria

- API accepts natural language messages and returns appropriate responses
- Conversation history is maintained between requests
- User isolation is enforced at the API level
- Responses include relevant tool usage information
- API handles errors gracefully with appropriate status codes