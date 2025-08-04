# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://your-api-domain.com`

## Authentication

All protected endpoints require a valid JWT token. The token can be provided in two ways:

1. **HTTP-only Cookie** (Recommended): `access_token` cookie set by the authentication flow
2. **Authorization Header**: `Authorization: Bearer <token>`

## Authentication Endpoints

### Initiate Discord OAuth2 Flow
```http
GET /auth/discord
```

Redirects the user to Discord's OAuth2 authorization page.

**Response**: Redirect to Discord OAuth2 page

---

### Discord OAuth2 Callback
```http
GET /auth/discord/callback
```

Handles the OAuth2 callback from Discord, creates or updates the user, and sets authentication cookies.

**Query Parameters**:
- `code` (string): Authorization code from Discord
- `state` (string): State parameter for CSRF protection

**Response**: Redirect to frontend with authentication cookies set

---

### Get Current User
```http
GET /auth/me
```

Returns the currently authenticated user's profile.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`

**Response**:
```json
{
  "_id": "user_id",
  "discordId": "discord_user_id",
  "username": "username",
  "avatar": "avatar_url",
  "email": "user@example.com",
  "role": "user",
  "lastLogin": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

---

### Logout
```http
POST /auth/logout
```

Clears the authentication cookies and logs out the user.

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

## Task Management Endpoints

### Get Tasks
```http
GET /tasks
```

Returns a paginated list of tasks for the authenticated user.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by status (`todo`, `in_progress`, `completed`)
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`, `urgent`)

**Response**:
```json
{
  "tasks": [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "status": "todo",
      "priority": "medium",
      "userId": "user_id",
      "dueDate": "2023-12-31T23:59:59.000Z",
      "completedAt": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

### Create Task
```http
POST /tasks
```

Creates a new task for the authenticated user.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Task Title",
  "description": "Task Description (optional)",
  "priority": "medium",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
```

**Response** (201 Created):
```json
{
  "_id": "task_id",
  "title": "Task Title",
  "description": "Task Description",
  "status": "todo",
  "priority": "medium",
  "userId": "user_id",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "completedAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

---

### Get Single Task
```http
GET /tasks/:id
```

Returns a specific task by ID.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`

**Path Parameters**:
- `id` (string): Task ID

**Response**:
```json
{
  "_id": "task_id",
  "title": "Task Title",
  "description": "Task Description",
  "status": "todo",
  "priority": "medium",
  "userId": "user_id",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "completedAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

---

### Update Task
```http
PATCH /tasks/:id
```

Updates a specific task. Only provided fields will be updated.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`
- `Content-Type: application/json`

**Path Parameters**:
- `id` (string): Task ID

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
```

**Response**:
```json
{
  "_id": "task_id",
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "in_progress",
  "priority": "high",
  "userId": "user_id",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "completedAt": null,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

---

### Delete Task
```http
DELETE /tasks/:id
```

Deletes a specific task.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`

**Path Parameters**:
- `id` (string): Task ID

**Response** (204 No Content): Empty response body

---

### Get Task Statistics
```http
GET /tasks/stats
```

Returns task statistics for the authenticated user.

**Headers**:
- `Authorization: Bearer <token>` or `Cookie: access_token=<token>`

**Response**:
```json
{
  "total": 25,
  "completed": 10,
  "inProgress": 5,
  "todo": 10
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Task endpoints**: 100 requests per minute per user
- **General endpoints**: 1000 requests per hour per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Data Types

### Task Status
- `todo`: Task is not started
- `in_progress`: Task is being worked on
- `completed`: Task is finished

### Task Priority
- `low`: Low priority
- `medium`: Medium priority (default)
- `high`: High priority
- `urgent`: Urgent priority

### Date Format
All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
