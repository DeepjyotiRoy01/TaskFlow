# 🔌 Task Manager Pro - API Documentation

This document provides comprehensive documentation for the Task Manager Pro API endpoints.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Error Handling](#error-handling)
- [Authentication Endpoints](#authentication-endpoints)
- [Task Management Endpoints](#task-management-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [AI Features Endpoints](#ai-features-endpoints)
- [Gamification Endpoints](#gamification-endpoints)
- [WebSocket Events](#websocket-events)

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Format
- **Type**: JWT
- **Algorithm**: HS256
- **Expiration**: 7 days (configurable)
- **Header**: `Authorization: Bearer <token>`

---

## 🌐 Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

---

## ❌ Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (optional)",
  "statusCode": 400
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔑 Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "level": 1,
      "points": 0,
      "createdAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "level": 1,
      "points": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

**GET** `/auth/me`

Get current authenticated user's information.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "level": 1,
      "points": 0,
      "achievements": [],
      "preferences": {
        "theme": "dark",
        "notifications": true
      }
    }
  }
}
```

### Update User Profile

**PUT** `/auth/profile`

Update user profile information.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Smith",
      "username": "johnsmith",
      "email": "john@example.com",
      "preferences": {
        "theme": "light",
        "notifications": false
      }
    }
  }
}
```

### Change Password

**PUT** `/auth/change-password`

Change user password.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

#### Response
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Logout

**POST** `/auth/logout`

Logout user (client-side token removal).

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📋 Task Management Endpoints

### Get All Tasks

**GET** `/tasks`

Get all tasks for the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
- `status` (optional): Filter by status (todo, in-progress, done)
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `category` (optional): Filter by category
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Response
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Complete project proposal",
        "description": "Write and submit the Q4 project proposal",
        "status": "in-progress",
        "priority": "high",
        "category": "work",
        "dueDate": "2023-09-15T00:00:00.000Z",
        "estimatedTime": 120,
        "actualTime": 45,
        "tags": ["project", "proposal"],
        "assignees": ["64f8a1b2c3d4e5f6a7b8c9d0"],
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Create Task

**POST** `/tasks`

Create a new task.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "title": "New task title",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "category": "work",
  "dueDate": "2023-09-15T00:00:00.000Z",
  "estimatedTime": 60,
  "tags": ["important", "deadline"],
  "assignees": ["64f8a1b2c3d4e5f6a7b8c9d0"]
}
```

#### Response
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "title": "New task title",
      "description": "Task description",
      "status": "todo",
      "priority": "medium",
      "category": "work",
      "dueDate": "2023-09-15T00:00:00.000Z",
      "estimatedTime": 60,
      "tags": ["important", "deadline"],
      "assignees": ["64f8a1b2c3d4e5f6a7b8c9d0"],
      "createdBy": "64f8a1b2c3d4e5f6a7b8c9d0",
      "createdAt": "2023-09-06T12:00:00.000Z"
    }
  }
}
```

### Get Task by ID

**GET** `/tasks/:id`

Get a specific task by ID.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Complete project proposal",
      "description": "Write and submit the Q4 project proposal",
      "status": "in-progress",
      "priority": "high",
      "category": "work",
      "dueDate": "2023-09-15T00:00:00.000Z",
      "estimatedTime": 120,
      "actualTime": 45,
      "timeEntries": [
        {
          "startTime": "2023-09-06T10:00:00.000Z",
          "endTime": "2023-09-06T10:45:00.000Z",
          "duration": 45
        }
      ],
      "tags": ["project", "proposal"],
      "assignees": ["64f8a1b2c3d4e5f6a7b8c9d0"],
      "attachments": [],
      "notes": [],
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T11:00:00.000Z"
    }
  }
}
```

### Update Task

**PUT** `/tasks/:id`

Update a specific task.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "done",
  "priority": "low",
  "category": "personal"
}
```

#### Response
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Updated task title",
      "description": "Updated description",
      "status": "done",
      "priority": "low",
      "category": "personal",
      "updatedAt": "2023-09-06T13:00:00.000Z"
    }
  }
}
```

### Delete Task

**DELETE** `/tasks/:id`

Delete a specific task.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Complete Task

**POST** `/tasks/:id/complete`

Mark a task as completed and award points.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "actualTime": 90,
  "notes": "Task completed successfully"
}
```

#### Response
```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "status": "done",
      "actualTime": 90,
      "completedAt": "2023-09-06T14:00:00.000Z"
    },
    "pointsEarned": 50,
    "levelUp": false,
    "achievements": []
  }
}
```

### Add Time Entry

**POST** `/tasks/:id/time-entries`

Add a time entry to a task.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "startTime": "2023-09-06T10:00:00.000Z",
  "endTime": "2023-09-06T10:30:00.000Z",
  "notes": "Worked on initial setup"
}
```

#### Response
```json
{
  "success": true,
  "message": "Time entry added successfully",
  "data": {
    "timeEntry": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "startTime": "2023-09-06T10:00:00.000Z",
      "endTime": "2023-09-06T10:30:00.000Z",
      "duration": 30,
      "notes": "Worked on initial setup",
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### Get Task Statistics

**GET** `/tasks/stats`

Get task statistics for the authenticated user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
- `period` (optional): Time period (week, month, year, all)

#### Response
```json
{
  "success": true,
  "data": {
    "totalTasks": 25,
    "completedTasks": 18,
    "pendingTasks": 7,
    "completionRate": 72,
    "averageCompletionTime": 45,
    "totalTimeSpent": 810,
    "tasksByStatus": {
      "todo": 3,
      "in-progress": 4,
      "done": 18
    },
    "tasksByPriority": {
      "low": 5,
      "medium": 12,
      "high": 6,
      "urgent": 2
    },
    "tasksByCategory": {
      "work": 15,
      "personal": 8,
      "shopping": 2
    }
  }
}
```

---

## 👥 User Management Endpoints

### Get User Preferences

**GET** `/users/preferences`

Get user preferences and settings.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "emailNotifications": false,
      "soundEnabled": true,
      "autoSave": true,
      "defaultView": "kanban"
    }
  }
}
```

### Update User Preferences

**PUT** `/users/preferences`

Update user preferences.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "theme": "light",
  "notifications": false,
  "emailNotifications": true,
  "soundEnabled": false,
  "autoSave": true,
  "defaultView": "list"
}
```

#### Response
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferences": {
      "theme": "light",
      "notifications": false,
      "emailNotifications": true,
      "soundEnabled": false,
      "autoSave": true,
      "defaultView": "list"
    }
  }
}
```

### Search Users

**GET** `/users/search`

Search for users (for collaboration).

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
- `q` (required): Search query
- `limit` (optional): Maximum results (default: 10)

#### Response
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
        "firstName": "Jane",
        "lastName": "Smith",
        "username": "janesmith",
        "email": "jane@example.com",
        "level": 3,
        "points": 1250
      }
    ]
  }
}
```

### Get User Statistics

**GET** `/users/stats`

Get detailed user statistics and gamification data.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "level": 2,
      "points": 750,
      "experience": 750,
      "nextLevelExp": 1000
    },
    "statistics": {
      "totalTasks": 25,
      "completedTasks": 18,
      "streak": 5,
      "longestStreak": 12,
      "averageCompletionTime": 45,
      "totalTimeSpent": 810,
      "productivityScore": 85
    },
    "achievements": [
      {
        "id": "first_task",
        "name": "First Task",
        "description": "Complete your first task",
        "earnedAt": "2023-09-01T10:00:00.000Z"
      }
    ],
    "badges": [
      {
        "id": "productive_week",
        "name": "Productive Week",
        "description": "Complete 5 tasks in a week",
        "earnedAt": "2023-09-05T15:00:00.000Z"
      }
    ]
  }
}
```

---

## 🤖 AI Features Endpoints

### Get AI Suggestions

**POST** `/ai/suggestions`

Get AI-powered suggestions for task optimization.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "taskTitle": "Complete project proposal",
  "taskDescription": "Write and submit the Q4 project proposal for the new client",
  "currentPriority": "medium",
  "currentCategory": "work"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "suggestions": {
      "priority": "high",
      "estimatedTime": 120,
      "category": "work",
      "tags": ["project", "proposal", "client"],
      "recommendations": [
        "Break down into smaller subtasks",
        "Set intermediate deadlines",
        "Consider collaboration with team members"
      ]
    }
  }
}
```

### Process Voice Command

**POST** `/ai/voice-command`

Process natural language voice commands.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "command": "Add task: Buy groceries tomorrow at 5 PM with high priority"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "parsedCommand": {
      "action": "add",
      "title": "Buy groceries",
      "dueDate": "2023-09-07T17:00:00.000Z",
      "priority": "high",
      "category": "shopping"
    },
    "task": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "title": "Buy groceries",
      "dueDate": "2023-09-07T17:00:00.000Z",
      "priority": "high",
      "category": "shopping",
      "status": "todo"
    }
  }
}
```

### Generate Task Template

**POST** `/ai/templates`

Generate AI-powered task templates.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "context": "software development project",
  "templateType": "project",
  "complexity": "medium"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "template": {
      "name": "Software Development Project",
      "description": "Template for a medium-complexity software development project",
      "tasks": [
        {
          "title": "Project Planning",
          "description": "Define project scope, requirements, and timeline",
          "priority": "high",
          "estimatedTime": 240,
          "dependencies": []
        },
        {
          "title": "Design Phase",
          "description": "Create UI/UX designs and technical architecture",
          "priority": "high",
          "estimatedTime": 360,
          "dependencies": ["Project Planning"]
        },
        {
          "title": "Development",
          "description": "Implement core features and functionality",
          "priority": "medium",
          "estimatedTime": 1200,
          "dependencies": ["Design Phase"]
        }
      ]
    }
  }
}
```

### Auto-categorize Task

**POST** `/ai/categorize`

Automatically categorize a task based on its content.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "title": "Review quarterly budget report",
  "description": "Analyze Q3 financial data and prepare budget recommendations"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "category": "work",
    "priority": "medium",
    "tags": ["budget", "report", "financial"],
    "confidence": 0.92
  }
}
```

---

## 🏆 Gamification Endpoints

### Get Achievements

**GET** `/gamification/achievements`

Get user's achievements and badges.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first_task",
        "name": "First Task",
        "description": "Complete your first task",
        "icon": "🎯",
        "earnedAt": "2023-09-01T10:00:00.000Z",
        "points": 10
      },
      {
        "id": "productive_week",
        "name": "Productive Week",
        "description": "Complete 5 tasks in a week",
        "icon": "⭐",
        "earnedAt": "2023-09-05T15:00:00.000Z",
        "points": 50
      }
    ],
    "availableAchievements": [
      {
        "id": "streak_master",
        "name": "Streak Master",
        "description": "Maintain a 7-day task completion streak",
        "icon": "🔥",
        "progress": 5,
        "target": 7,
        "points": 100
      }
    ]
  }
}
```

### Get Leaderboard

**GET** `/gamification/leaderboard`

Get leaderboard rankings.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
- `type` (optional): Leaderboard type (points, level, streak, tasks)
- `period` (optional): Time period (week, month, all)

#### Response
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
          "firstName": "Alice",
          "lastName": "Johnson",
          "username": "alicej",
          "level": 5,
          "points": 2500
        },
        "value": 2500
      },
      {
        "rank": 2,
        "user": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "firstName": "John",
          "lastName": "Doe",
          "username": "johndoe",
          "level": 2,
          "points": 750
        },
        "value": 750
      }
    ],
    "userRank": 2,
    "totalParticipants": 25
  }
}
```

### Get Level Progress

**GET** `/gamification/level-progress`

Get user's current level and progress to next level.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "currentLevel": 2,
    "currentExperience": 750,
    "nextLevelExperience": 1000,
    "experienceNeeded": 250,
    "progressPercentage": 75,
    "levelRewards": {
      "nextLevel": 3,
      "rewards": ["New badge", "Extra points multiplier", "Custom themes"]
    }
  }
}
```

### Award Achievement

**POST** `/gamification/award`

Award an achievement to a user (internal use).

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Request Body
```json
{
  "achievementId": "streak_master",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

#### Response
```json
{
  "success": true,
  "message": "Achievement awarded successfully",
  "data": {
    "achievement": {
      "id": "streak_master",
      "name": "Streak Master",
      "description": "Maintain a 7-day task completion streak",
      "icon": "🔥",
      "earnedAt": "2023-09-06T15:00:00.000Z",
      "points": 100
    },
    "pointsEarned": 100,
    "levelUp": true,
    "newLevel": 3
  }
}
```

---

## 🔌 WebSocket Events

The application uses Socket.IO for real-time features. Connect to the WebSocket server at the same URL as the API.

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Client to Server

**Join Room**
```javascript
socket.emit('join-room', { roomId: 'task-123' });
```

**Leave Room**
```javascript
socket.emit('leave-room', { roomId: 'task-123' });
```

**Task Update**
```javascript
socket.emit('task-update', {
  taskId: '64f8a1b2c3d4e5f6a7b8c9d1',
  updates: { status: 'in-progress' }
});
```

**User Typing**
```javascript
socket.emit('user-typing', {
  taskId: '64f8a1b2c3d4e5f6a7b8c9d1',
  isTyping: true
});
```

#### Server to Client

**Task Updated**
```javascript
socket.on('task-updated', (data) => {
  console.log('Task updated:', data);
  // data: { taskId, updates, updatedBy, timestamp }
});
```

**User Joined**
```javascript
socket.on('user-joined', (data) => {
  console.log('User joined:', data);
  // data: { userId, username, taskId }
});
```

**User Left**
```javascript
socket.on('user-left', (data) => {
  console.log('User left:', data);
  // data: { userId, username, taskId }
});
```

**User Typing**
```javascript
socket.on('user-typing', (data) => {
  console.log('User typing:', data);
  // data: { userId, username, taskId, isTyping }
});
```

**Notification**
```javascript
socket.on('notification', (data) => {
  console.log('Notification:', data);
  // data: { type, message, taskId, timestamp }
});
```

---

## 📝 Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per 15 minutes

When rate limited, you'll receive a 429 status code with:

```json
{
  "success": false,
  "message": "Too many requests",
  "retryAfter": 900
}
```

---

## 🔒 Security

### CORS
The API supports CORS for cross-origin requests. Configured origins:
- Development: `http://localhost:5173`
- Production: Your domain

### Input Validation
All inputs are validated using Joi schemas to prevent injection attacks.

### XSS Protection
Helmet.js provides XSS protection headers.

### SQL Injection
Mongoose ODM prevents SQL injection attacks.

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT token decoder
- [Socket.IO Documentation](https://socket.io/docs/) - WebSocket implementation
- [MongoDB Documentation](https://docs.mongodb.com/) - Database queries
- [Express.js Documentation](https://expressjs.com/) - Web framework

---

**For support and questions, please refer to the main README.md file or create an issue on GitHub.** 