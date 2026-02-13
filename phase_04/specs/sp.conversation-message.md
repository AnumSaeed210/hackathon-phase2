# Conversation & Message Specification

## Purpose

Persist chat sessions and messages for agent context.

## Overview

This specification defines the data models and persistence layer for chat conversations and messages. The system maintains conversation history to provide context for the AI agent and enable stateless operation of the chat API.

## Data Models

### Conversation Model

Represents a single chat session for a user.

```sql
Table: conversations
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users table)
- created_at: Timestamp (UTC)
- updated_at: Timestamp (UTC)
```

### Message Model

Represents individual messages within a conversation.

```sql
Table: messages
- id: UUID (Primary Key)
- conversation_id: UUID (Foreign Key to conversations table)
- user_id: UUID (Foreign Key to users table)
- role: String (Enum: 'user' | 'assistant')
- content: Text (The message content)
- timestamp: Timestamp (UTC)
- metadata: JSON (Additional data like tool usage, etc.)
```

## Rules

- **One conversation per user session**: Each active chat session gets its own conversation record
- **Messages are append-only**: Once stored, messages cannot be modified, only new messages can be added
- **Data persists across restarts**: All conversation and message data is stored in the database and survives server restarts
- **User isolation**: Users can only access conversations and messages associated with their user ID
- **Timestamp accuracy**: All timestamps are stored in UTC for consistency

## Database Operations

### Creating a New Conversation

1. Generate a new UUID for the conversation
2. Associate the conversation with the authenticated user ID
3. Set both `created_at` and `updated_at` to the current timestamp
4. Insert the conversation record into the database

### Adding a Message

1. Validate that the conversation belongs to the authenticated user
2. Generate a new UUID for the message
3. Set the conversation_id to the target conversation
4. Set the user_id to the authenticated user
5. Set the role to either 'user' or 'assistant'
6. Store the message content
7. Set the timestamp to the current time
8. Optionally store metadata (like tool usage information)
9. Insert the message record into the database

### Retrieving Conversation History

1. Validate that the conversation belongs to the authenticated user
2. Query all messages in the conversation ordered by timestamp (ascending)
3. Return the messages as an ordered list

## Constraints

- Foreign key relationships ensure referential integrity
- User ID must match between conversation and message records
- Role field is restricted to 'user' or 'assistant' values
- Conversation and message creation timestamps cannot be modified after creation

## Indexes

- Index on `conversations.user_id` for efficient user-based queries
- Index on `messages.conversation_id` for efficient conversation history retrieval
- Index on `messages.timestamp` for chronological ordering
- Composite index on `messages.conversation_id` and `messages.timestamp` for optimized history queries

## Error Handling

- Attempting to access another user's conversation returns an error
- Invalid conversation IDs result in appropriate error responses
- Database connection errors are handled gracefully with appropriate status codes

## Success Criteria

- Conversations are properly created and associated with users
- Messages are stored with correct roles and timestamps
- Conversation history can be retrieved in chronological order
- User isolation is maintained at the database level
- Data persists across server restarts and deployments
- Append-only nature of messages is preserved