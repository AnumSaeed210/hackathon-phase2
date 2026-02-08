# Phase 3 Todo Chatbot - Implementation Guide

## Setup

### Environment Variables
1. Add `HF_TOKEN` to both frontend and backend `.env` files with your Hugging Face API token
2. Ensure `HF_TOKEN` is identical in both environments for proper AI functionality
3. Update CORS settings to include any new origins required for the chat interface

### Database Migrations
1. Create new SQLModel models for Conversation and Message entities
2. Add Conversation model with fields: id, user_id, created_at, updated_at
3. Add Message model with fields: id, conversation_id, user_id, role, content, timestamp, metadata
4. Run database migration to create new tables
5. Update existing services to handle conversation and message operations

## MCP Server & Tools

### MCP Server Setup
1. Install official MCP SDK for Python in the backend
2. Create MCP server module that runs separately from main FastAPI app
3. Configure MCP server to use the same database connection as main app
4. Set up authentication validation using JWT middleware

### Stateless Tools Implementation
1. **add_task tool**: Wrap existing task creation logic with user validation
   - Validate user_id from JWT token matches the authenticated user
   - Call existing TaskService.create_task method
   - Return structured response with task details

2. **list_tasks tool**: Wrap existing task listing logic with user validation
   - Validate user_id from JWT token matches the authenticated user
   - Call existing TaskService.get_tasks_for_user method
   - Return structured response with task array

3. **complete_task tool**: Wrap existing task completion logic with user validation
   - Validate user_id and task ownership
   - Call existing TaskService.mark_complete method
   - Return structured response with updated task

4. **delete_task tool**: Wrap existing task deletion logic with user validation
   - Validate user_id and task ownership
   - Call existing TaskService.delete_task method
   - Return structured response confirming deletion

5. **update_task tool**: Wrap existing task update logic with user validation
   - Validate user_id and task ownership
   - Call existing TaskService.update_task method
   - Return structured response with updated task

## Chat Endpoint

### API Endpoint Implementation
1. Create `/api/{user_id}/chat` POST endpoint in FastAPI
2. Add JWT authentication middleware to validate user access
3. Implement request schema: `{ message: string, conversation_id?: string }`
4. Implement response schema: `{ response: string, conversation_id: string, tool_usage: object, timestamp: string }`

### Stateless Request Cycle
1. Validate JWT token and extract authenticated user_id
2. Verify user has access to the specified conversation_id (if provided)
3. Load conversation history from database using conversation_id
4. Prepare context for Hugging Face model with user message and conversation history
5. Call Hugging Face API with conversation context to determine intent
6. Map detected intent to appropriate MCP tool
7. Execute MCP tool with proper user validation
8. Generate natural language response based on tool results
9. Store user message in database with role='user'
10. Store assistant response in database with role='assistant'
11. Return response with conversation_id and tool usage metadata

## Agent Integration

### Intent Mapping
1. Configure Hugging Face API to process user messages and detect intent
2. Create intent classification system that maps natural language to tool names:
   - "add task", "create task", "new task" → add_task tool
   - "list tasks", "show tasks", "my tasks" → list_tasks tool
   - "complete task", "finish task", "done" → complete_task tool
   - "delete task", "remove task", "cancel task" → delete_task tool
   - "update task", "edit task", "change task" → update_task tool
3. Implement fallback responses for unrecognized intents
4. Add confirmation prompts for destructive actions (delete, complete)

### Natural Language Processing
1. Use Hugging Face transformers library for intent recognition
2. Implement context awareness to handle follow-up messages
3. Generate friendly, conversational responses based on tool outcomes
4. Handle error cases with appropriate user-friendly messages
5. Implement conversation memory to maintain context across exchanges

## Frontend Integration

### Chat Interface
1. Create React-based chat component using the existing UI design patterns
2. Implement message history display with user and assistant differentiation
3. Add message input field with submission handling
4. Integrate with existing authentication context to pass JWT tokens
5. Ensure responsive design compatibility with existing Tailwind CSS classes

### API Connection
1. Update API client to handle new chat endpoint with proper authentication
2. Implement real-time message display as responses arrive
3. Add loading indicators during AI processing
4. Handle conversation state management in the UI
5. Ensure compatibility with Next.js App Router and existing navigation

## Security

### JWT Authentication
1. Ensure all chat endpoints require valid JWT tokens in Authorization header
2. Validate user_id in JWT matches the requested user_id in the URL
3. Implement proper error responses for unauthorized access attempts
4. Add token refresh functionality if needed for extended chat sessions

### User-Scope Enforcement
1. Verify conversation ownership before allowing access to conversation history
2. Ensure messages can only be viewed by the owning user
3. Add user_id validation to all MCP tool calls
4. Implement proper error handling that doesn't reveal other users' data

### MCP Tools Ownership Validation
1. Each MCP tool must verify the authenticated user owns the target resource
2. Return 404 errors (not 403) when users try to access others' resources
3. Log access attempts for security monitoring
4. Implement rate limiting to prevent abuse of MCP tools