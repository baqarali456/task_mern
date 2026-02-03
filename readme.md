� Getting Started

Prerequisites

Node.js (v14 or higher)
npm (Node Package Manager)
MongoDB

Installation & Setup

1️⃣ Install Dependencies

# Install backend dependencies
cd backend
npm i

# Install frontend dependencies
cd ../frontend
npm i

2️⃣ Run Development Server

# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory, in a new terminal)
npm run dev

Both will start on their respective ports (Backend: typically /8000, Frontend: typically 5173)

---

��👤 User Authentication API Documentation
Base URL
/api/v1/user

🔐 Authentication Mechanism

JWT-based authentication

Tokens generated:

accessToken

refreshToken

Tokens are stored as HTTP-only secure cookies

Set-Cookie: accessToken=...; HttpOnly; Secure
Set-Cookie: refreshToken=...; HttpOnly; Secure

📌 API Endpoints Summary
Method	Endpoint	Auth Required	Description
POST	/register	 ❌ No	Register a new user
POST	/login	     ❌ No	Login user & generate tokens
GET	/getCurrentUser	 ✅ Yes	Get logged-in user
POST	/logout	     ✅ Yes	Logout user

1️⃣ Register User
POST /register

Registers a new user.

Request Body
{
  "username": "sayed",
  "email": "sayed@example.com",
  "password": "Password@123"
}

Validation Rules

username, email, password are required

Empty or whitespace-only values are rejected

hash password using bcrypt

Email must be unique

Success Response (201)
{
  "statusCode": 200,
  "message": "user registered successfully",
  "data": "65ab89f1c2..."
}


data contains the user ID

Error Responses
Status	Message
400	fields are required
409	user already exists
500	Internal server error
2️⃣ Login User
POST /login

Authenticates user and issues JWT tokens.

Request Body
{
  "email": "sayed@example.com",
  "password": "Password@123"
}

Login Flow

Validate input fields

Find user by email

Compare password

Generate:

accessToken

refreshToken

Save refresh token in DB

Set tokens as cookies

Success Response (200)
{
  "statusCode": 200,
  "message": "user login successfully",
  "data": {
    "loggedinUser": {
      "_id": "65ab89f1c2...",
      "username": "sayed",
      "email": "sayed@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Cookies Set
accessToken → HttpOnly, Secure
refreshToken → HttpOnly, Secure

Error Responses
Status	Message
400	fields are required
404	user not found
401	password is wrong
500	Token generation error
3️⃣ Get Current User
GET /getCurrentUser

Returns the authenticated user's details.

Authentication

✅ Required
JWT validated via verifyJWT

Success Response (200)
{
  "statusCode": 200,
  "message": "get current user successfully",
  "data": {
    "_id": "65ab89f1c2...",
    "username": "sayed",
    "email": "sayed@example.com",
    "refreshToken": "eyJhb..."
  }
}


⚠️ Note: Password is excluded, but refreshToken is still present (based on current code)

Error Responses
Status	Message
401	Unauthorized
500	Internal server error
4️⃣ Logout User
POST /logout

Logs out the authenticated user.

Authentication

✅ Required

Logout Flow

Removes refreshToken from database

Clears cookies:

accessToken

refreshToken

Success Response (200)
{
  "statusCode": 200,
  "message": " user logout successfully",
  "data": null
}

Cookies Cleared
accessToken
refreshToken

Error Responses
Status	Message
401	Unauthorized
500	Internal server error
🔧 Internal Utility: Token Generator
generateAccessandRefreshToken(userId)

Fetches user by ID

Generates:

Access Token (short-lived)

Refresh Token (long-lived)

Saves refresh token in DB

Returns:

[accessToken, refreshToken]

⚠️ Important Notes (Based on Code)

Cookies use secure: true → HTTPS required

Refresh token stored in database

Logout invalidates refresh token

Error handling uses:

ApiError

ApiResponse

All async logic wrapped in asyncHandler


✅ Task Management API Documentation
Base URL
/api/v1/task


Example mount:

app.use("/api/v1/task", taskRouter);

🔐 Authentication & Authorization

All endpoints require JWT authentication

JWT is validated using verifyJWT middleware

Each task is owned by the user who created it

Users can only update or delete their own tasks

📌 Endpoints Overview
Method	Endpoint	      Auth Required	 Description
POST	/createTask	        ✅ Yes	   Create a new task
PATCH	/updateTask/:taskId	✅ Yes	   Update an existing task
DELETE	/deleteTask/:taskId	✅ Yes	   Delete a task
GET	    /getallTasks	        ✅ Yes	   Get all tasks of logged-in user
1️⃣ Create Task
POST /createTask

Creates a new task for the authenticated user.

Request Body
{
  "title": "Learn Node.js",
  "description": "Study authentication and JWT"
}

Validation Rules

title and description are required

Empty or whitespace-only values are rejected

Success Response (201)
{
  "statusCode": 200,
  "message": "task create successfully",
  "data": {
    "_id": "65ac45b...",
    "title": "Learn Node.js",
    "description": "Study authentication and JWT",
    "status": "pending",
    "createdBy": "65ab12c...",
    "createdAt": "2026-01-22T11:20:00Z"
  }
}

Error Responses
Status	Message
400	all fields are required
401	Unauthorized
500	Internal server error
2️⃣ Update Task
PATCH /updateTask/:taskId

Updates an existing task.

URL Params
taskId → MongoDB ObjectId

Request Body
{
  "title": "Learn Advanced Node.js",
  "description": "JWT, refresh tokens, middleware",
  "status": "completed"
}

Notes

status defaults to "pending" if not provided

User must be the task owner

Success Response (200)
{
  "statusCode": 200,
  "message": "update task successfully",
  "data": {
    "_id": "65ac45b...",
    "title": "Learn Advanced Node.js",
    "description": "JWT, refresh tokens, middleware",
    "status": "completed"
  }
}

Error Responses
Status	Message
400	taskId is not valid
400	all fields are required
401	you are not authorize to update the task
404	task not found
500	Internal server error
3️⃣ Delete Task
DELETE /deleteTask/:taskId

Deletes a task created by the authenticated user.

URL Params
taskId → MongoDB ObjectId

Authorization Rule

Only the task owner can delete the task

Success Response (200)
{
  "statusCode": 200,
  "message": "user delete task  successfully",
  "data": null
}

Error Responses
Status	Message
400	taskId is not valid
401	you are not authorize to update the task
404	task not found
500	Internal server error
4️⃣ Get All Tasks of User
GET /getallTasks

Fetches all tasks created by the authenticated user.

Success Response (200)
{
  "statusCode": 200,
  "message": "user get successfully all tasks",
  "data": [
    {
      "_id": "65ac45b...",
      "title": "Learn Node.js",
      "description": "Study authentication and JWT",
      "status": "pending"
    },
    {
      "_id": "65ac47c...",
      "title": "Build Task App",
      "description": "Frontend + Backend",
      "status": "completed"
    }
  ]
}

Error Responses
Status	Message
401	Unauthorized
500	Internal server error
🔧 Controller-Level Logic Summary

Input validation handled manually

ObjectId validation via isValidObjectId

Ownership enforced using:

task.createdBy.toString() === req.user._id.toString()


Responses standardized using ApiResponse

Errors handled via ApiError

All async logic wrapped in asyncHandler



🚀 Scaling Frontend–Backend Integration for Production

1️⃣ Clean API Contract (Most Important)
Why

Frontend and backend must scale independently.

How

Define clear REST APIs

Use consistent response structure

{
  "statusCode": 200,
  "message": "success",
  "data": {}
}

Best Practices

API versioning:

/api/v1/user
/api/v1/task


Centralized error handling

Never change API response shape without version bump

✅ This allows frontend teams to deploy without breaking backend.

2️⃣ Environment-Based Configuration
Separate Environments
Environment	Purpose
Development	Local machine
Staging	Pre-production testing
Production	Real users
Example
VITE_API_URL=https://api.example.com

axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})


✅ Prevents hardcoding URLs
✅ Enables multiple deployments easily

3️⃣ Authentication at Scale (JWT + Cookies)
Production Approach

Short-lived Access Token

Long-lived Refresh Token

Store tokens in HTTP-only cookies

accessToken → 15 min
refreshToken → 7–30 days

Frontend Strategy

Automatically retry API on 401

Call /refresh-token silently

No token stored in localStorage (XSS safe)

✅ Secure
✅ Scales to millions of users

4️⃣ API Gateway & Reverse Proxy
Why

Avoid direct frontend → backend communication.

Use

Nginx

Cloudflare

AWS ALB / API Gateway

Flow
Browser
  ↓
CDN (Cloudflare)
  ↓
Nginx / API Gateway
  ↓
Node.js services


Benefits:

Load balancing

Rate limiting

TLS termination

DDoS protection

5️⃣ Horizontal Backend Scaling
Production Setup

Run multiple Node.js instances

Use PM2 / Docker / Kubernetes

pm2 start server.js -i max

Why

Node.js is single-threaded
Scaling = more instances, not bigger instance

6️⃣ Database Scaling Strategy (MongoDB)
Start Simple

Index frequently queried fields:

TaskSchema.index({ createdBy: 1 })

Grow Further

Read replicas

Sharding (large-scale)

Separate read/write workloads

7️⃣ Frontend Performance Optimization
Key Techniques

Code splitting (React.lazy)

API caching (React Query / TanStack Query)

Debounce user input

Memoization

Example
useQuery(["tasks"], fetchTasks, {
  staleTime: 5 * 60 * 1000
});


✅ Less API load
✅ Faster UI

8️⃣ Caching Layer (Critical at Scale)
Backend Caching

Redis for:

User sessions

Frequently fetched data

Rate limiting

Frontend Caching

Browser cache

CDN cache

React Query cache

9️⃣ Rate Limiting & Security
Why

Protect backend from abuse.

Example
rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})


Also:

Helmet

CORS restrictions

Input validation

Request size limits

🔟 CI/CD Pipeline
Production Flow
Git Push
 ↓
Run Tests
 ↓
Build Frontend
 ↓
Deploy Backend
 ↓
Health Check


Tools:

GitHub Actions

Docker

Vercel (frontend)

AWS / Render / Railway (backend)

1️⃣1️⃣ Observability & Monitoring
What to Monitor

API response time

Error rates

Memory usage

DB query performance

Tools

Winston / Pino logs

Prometheus + Grafana

Sentry (frontend + backend)

1️⃣2️⃣ Microservices (When Needed)
Don’t Start Here 🚫

Monolith is fine early.

Move When:

Large team

Independent deployments

Heavy traffic

Example split:

Auth Service
Task Service
Notification Service

🔁 Final Production Architecture
React App (CDN)
   ↓
API Gateway / Nginx
   ↓
Node.js (Multiple Instances)
   ↓
Redis (Cache)
   ↓
MongoDB (Replica Set)





