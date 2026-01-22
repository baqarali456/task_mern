👤 User Authentication API Documentation
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

