# MCP Tools Specification

## Tools

### add_task
Creates a new task for the authenticated user.

**Input Schema:**
```json
{
  "title": "string - Required - Title of the task",
  "description": "string - Optional - Description of the task",
  "user_id": "string - Required - ID of the user creating the task"
}
```

**Output Schema:**
```json
{
  "success": "boolean - Whether the operation succeeded",
  "task_id": "string - ID of the created task (if successful)",
  "message": "string - Result message"
}
```

### list_tasks
Retrieves all tasks for the authenticated user.

**Input Schema:**
```json
{
  "user_id": "string - Required - ID of the user whose tasks to retrieve"
}
```

**Output Schema:**
```json
{
  "success": "boolean - Whether the operation succeeded",
  "tasks": "array - List of task objects",
  "count": "number - Number of tasks returned"
}
```

### complete_task
Marks a task as completed for the authenticated user.

**Input Schema:**
```json
{
  "task_id": "string - Required - ID of the task to complete",
  "user_id": "string - Required - ID of the user completing the task"
}
```

**Output Schema:**
```json
{
  "success": "boolean - Whether the operation succeeded",
  "message": "string - Result message"
}
```

### delete_task
Removes a task for the authenticated user.

**Input Schema:**
```json
{
  "task_id": "string - Required - ID of the task to delete",
  "user_id": "string - Required - ID of the user deleting the task"
}
```

**Output Schema:**
```json
{
  "success": "boolean - Whether the operation succeeded",
  "message": "string - Result message"
}
```

### update_task
Modifies task properties for the authenticated user.

**Input Schema:**
```json
{
  "task_id": "string - Required - ID of the task to update",
  "user_id": "string - Required - ID of the user updating the task",
  "title": "string - Optional - New title for the task",
  "description": "string - Optional - New description for the task",
  "completed": "boolean - Optional - New completion status for the task"
}
```

**Output Schema:**
```json
{
  "success": "boolean - Whether the operation succeeded",
  "message": "string - Result message"
}
```

## Rules

- **user_id required**: Every tool invocation must include the user_id of the authenticated user performing the operation
- **Ownership validation**: Each tool must validate that the specified user owns the resource being operated on
- **One action per tool**: Each tool performs exactly one type of operation (create, read, update, delete, or mark complete)
- **Deterministic output**: Each tool returns consistent output format regardless of success or failure
- **Input validation**: All inputs are validated before processing
- **Database consistency**: All operations maintain database consistency and integrity

## Common Error Responses

### Authorization Error
```json
{
  "success": false,
  "error": {
    "type": "authorization_error",
    "message": "User does not have permission to perform this operation",
    "code": "ERR_UNAUTHORIZED"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": {
    "type": "validation_error",
    "message": "Invalid input parameters provided",
    "code": "ERR_VALIDATION_FAILED"
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "error": {
    "type": "not_found_error",
    "message": "Requested resource does not exist",
    "code": "ERR_RESOURCE_NOT_FOUND"
  }
}
```

## Database Interaction Patterns

### For all tools:
1. Validate user_id format and existence
2. Verify user ownership of the resource (where applicable)
3. Perform the requested operation
4. Handle database errors gracefully
5. Return structured response

### For read operations (list_tasks):
1. Query database for records matching user_id
2. Return results in consistent format
3. Include count of returned records

### For write operations (add_task, update_task, complete_task, delete_task):
1. Validate input parameters
2. Verify user ownership of the resource
3. Perform the database operation
4. Return success status and relevant information

## Success Criteria

- Each tool accepts the specified input schema and returns the specified output schema
- User authentication and authorization are validated for every operation
- Tools operate independently with no shared state
- Error conditions are handled with appropriate structured responses
- Database operations maintain data integrity
- Tools return deterministic output regardless of external factors
- Ownership validation prevents unauthorized access to resources