# Agent-Backend-Frontend Integration Specification

## Purpose

Define end-to-end chat flow.

## Overview

This specification defines the complete integration flow between the frontend chat interface, backend API, AI agent, and MCP tools. The system follows a strict separation of concerns where each component has well-defined responsibilities and interfaces.

## Flow

```
OpenAI ChatKit → Chat API → Agent → MCP Tools → Database → Chat API → OpenAI ChatKit
```

### Step-by-step Process

1. **Frontend (OpenAI ChatKit)**: User sends a message through the chat interface
2. **Backend (Chat API)**: Receives the message and validates authentication
3. **Backend (Chat API)**: Loads conversation history from database
4. **AI Agent**: Processes the user message with conversation context
5. **AI Agent**: Determines appropriate MCP tool to execute based on intent
6. **MCP Tools**: Execute the selected tool with proper user validation
7. **MCP Tools**: Persist changes to database
8. **MCP Tools**: Return structured response to AI agent
9. **AI Agent**: Generates natural language response based on tool results
10. **Backend (Chat API)**: Stores assistant response in database
11. **Backend (Chat API)**: Returns response to frontend
12. **Frontend (OpenAI ChatKit)**: Displays response to user

## Component Responsibilities

### Frontend (OpenAI ChatKit)
- Display chat interface to users
- Send user messages to backend API
- Display assistant responses from backend API
- Manage client-side UI state
- Handle authentication tokens

### Backend (Chat API)
- Authenticate requests using JWT tokens
- Validate user access to conversations
- Load conversation history from database
- Interface with AI agent
- Store messages to database
- Return responses to frontend

### AI Agent (OpenAI Agents SDK)
- Interpret user intent from natural language
- Select appropriate MCP tool based on intent
- Execute MCP tools through MCP server
- Generate natural language responses from tool results
- Maintain conversation context

### MCP Server
- Host MCP tools for AI agent access
- Validate tool inputs and user permissions
- Execute tools in a secure environment
- Return structured responses to AI agent

### MCP Tools
- Perform specific task operations (add, list, complete, delete, update)
- Validate user ownership of resources
- Interact with database for persistence
- Return structured data to MCP server

### Database
- Store conversations and messages
- Store task data
- Enforce user isolation through foreign key relationships
- Provide data persistence across restarts

## Rules

- **Frontend never calls MCP**: The frontend only communicates with the backend API, never directly with MCP tools
- **Agent never accesses DB**: The AI agent only interacts with data through MCP tools, never directly with the database
- **Backend orchestrates flow**: The backend API coordinates the entire flow between components
- **Stateless operation**: Each request contains all necessary context; no server-side session state
- **User isolation**: Each component enforces user access controls
- **Error propagation**: Errors are properly propagated through the flow with appropriate handling

## Data Contracts

### Frontend ↔ Backend API
- Request: `{ message: string, conversation_id?: string }`
- Response: `{ response: string, conversation_id: string, tool_usage: object, timestamp: string }`

### Backend API ↔ AI Agent
- Input: Conversation history with user message
- Output: Tool selection and parameters, natural language response

### AI Agent ↔ MCP Tools
- Input: Tool name and parameters
- Output: Structured result from tool execution

### MCP Tools ↔ Database
- Input: Database queries and mutations
- Output: Query results and mutation confirmations

## Error Handling

- Network errors between frontend and backend result in appropriate UI feedback
- Authentication errors are caught and returned to frontend
- Tool execution errors are handled by the agent and communicated to the user
- Database errors are caught and returned as API errors
- Invalid tool inputs result in structured error responses

## Success Criteria

- Complete end-to-end flow functions as described
- Frontend only communicates with backend API
- AI agent only accesses data through MCP tools
- Backend properly orchestrates the entire flow
- User isolation is maintained throughout the flow
- Error conditions are handled appropriately
- Conversation context is properly maintained
- Natural language responses are generated based on tool results