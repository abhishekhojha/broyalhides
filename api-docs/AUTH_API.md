# Authentication API Documentation

## Base URL

Authentication endpoints are prefixed with `/api/auth`

## Authentication Flow

This API supports **two authentication methods**:

1. **OTP-based Authentication** (Email/Phone)
2. **Password-based Authentication** (Email/Phone + Password)

---

## 🔐 Authentication Endpoints

### 1. Send OTP

Send a One-Time Password (OTP) to the user's email or phone number.

**Endpoint:** `POST /api/auth/send-otp`

**Authentication:** Not required

**Request Body:**

```json
{
  "identifier": "user@example.com",
  "purpose": "login"
}
```

**Field Details:**

- `identifier` (string, required): Email address or phone number
- `purpose` (string, optional, default: "login"): Purpose of OTP
  - Allowed values: `"login"`, `"signup"`, `"reset"`

**Example Requests:**

_With Email:_

```json
{
  "identifier": "john.doe@example.com",
  "purpose": "login"
}
```

_With Phone:_

```json
{
  "identifier": "+919876543210",
  "purpose": "login"
}
```

**Success Response (200):**

```json
{
  "message": "OTP sent"
}
```

**Error Responses:**

_Missing Identifier (400):_

```json
{
  "message": "identifier is required (email or phone)"
}
```

_Failed to Send OTP (500):_

```json
{
  "message": "Failed to send OTP",
  "error": "Email/SMS service error details"
}
```

**Notes:**

- OTP expires after **5 minutes** (300 seconds)
- Previous OTPs for the same identifier and purpose are deleted when a new OTP is sent
- The system automatically detects if the identifier is an email or phone number

---

### 2. Verify OTP

Verify the OTP and authenticate the user. Creates a new user if they don't exist.

**Endpoint:** `POST /api/auth/verify-otp`

**Authentication:** Not required

**Request Body:**

```json
{
  "identifier": "user@example.com",
  "otp": "123456",
  "purpose": "login"
}
```

**Field Details:**

- `identifier` (string, required): Email address or phone number (must match the one used in send-otp)
- `otp` (string, required): The 6-digit OTP received
- `purpose` (string, optional, default: "login"): Must match the purpose used in send-otp

**Success Response (200):**

```json
{
  "status": "success",
  "message": "OTP verified",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**JWT Payload Structure:**
The `accessToken` contains the following user information:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "avatar": "https://example.com/avatar.jpg",
  "isProfileCompleted": false,
  "role": "507f1f77bcf86cd799439012",
  "isActive": true,
  "iat": 1704201955,
  "exp": 1704288355
}
```

**Error Responses:**

_Missing Fields (400):_

```json
{
  "message": "identifier and otp are required"
}
```

_Invalid or Expired OTP (400):_

```json
{
  "message": "Invalid or expired OTP"
}
```

**User Creation Behavior:**

- **New User**: If the identifier doesn't exist, a new user is automatically created with:

  - `email` or `phone` set based on identifier type
  - `isEmailVerified: true` (if email) or `isPhoneVerified: true` (if phone)
  - `isProfileCompleted: false`
  - `name: undefined` (needs to complete profile)
  - `passwordHash: null` (can set later via complete-profile)

- **Existing User**: If user exists:
  - Updates `isEmailVerified` or `isPhoneVerified` to `true`
  - Returns existing user data in the token

**Auth Provider:**

- Creates or updates an `AuthProvider` record with `provider: "otp"`
- Updates `lastUsedAt` timestamp

---

### 3. Complete Profile

Complete user profile after OTP-based registration. Sets name and password.

**Endpoint:** `POST /api/auth/complete-profile`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "password": "SecurePassword123!"
}
```

**Field Details:**

- `name` (string, required): User's full name
- `password` (string, required): User's password (will be hashed with bcrypt)

**Success Response (200):**

```json
{
  "message": "Profile completed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Updated JWT Payload:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "avatar": null,
  "isProfileCompleted": true,
  "role": "507f1f77bcf86cd799439012",
  "isActive": true,
  "iat": 1704202000,
  "exp": 1704288400
}
```

**Error Responses:**

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Missing Fields (400):_

```json
{
  "message": "Name and password are required"
}
```

_Profile Already Completed (400):_

```json
{
  "message": "Profile already completed"
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

**Notes:**

- Password is hashed using bcrypt with a salt round of 12
- Sets `isProfileCompleted: true`
- Returns a new JWT token with updated user information
- This endpoint can only be called once per user

---

### 4. Login with Password

Authenticate using email/phone and password.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "identifier": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Field Details:**

- `identifier` (string, required): Email address or phone number
- `password` (string, required): User's password

**Example Requests:**

_With Email:_

```json
{
  "identifier": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

_With Phone:_

```json
{
  "identifier": "+919876543210",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**JWT Payload Structure:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "avatar": "https://example.com/avatar.jpg",
  "isProfileCompleted": true,
  "role": "507f1f77bcf86cd799439012",
  "isActive": true,
  "iat": 1704202100,
  "exp": 1704288500
}
```

**Error Responses:**

_Missing Fields (400):_

```json
{
  "message": "identifier and password are required"
}
```

_Invalid Credentials (400):_

```json
{
  "message": "Invalid credentials"
}
```

_Profile Incomplete (403):_

```json
{
  "message": "Profile incomplete. Please complete registration first."
}
```

_Email Not Verified (403):_

```json
{
  "message": "Email not verified. Please login via OTP."
}
```

_Phone Not Verified (403):_

```json
{
  "message": "Phone not verified. Please login via OTP."
}
```

**Validation Checks:**

1. User must exist in the database
2. User's profile must be completed (`isProfileCompleted: true`)
3. Email/Phone must be verified based on identifier type
4. Password must match the stored hash

**Notes:**

- Identifier is automatically detected as email (contains `@`) or phone
- Email identifiers are converted to lowercase for case-insensitive matching
- Password is compared using bcrypt

---

## 👤 Profile Endpoints

### 5. Get Current User Profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /api/me`

**Authentication:** Required (Bearer Token)

**Request Headers:**

```
Authorization: Bearer <accessToken>
```

**Success Response (200):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "role": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "customer",
      "permissions": ["VIEW_PRODUCTS", "MANAGE_OWN_ORDERS"]
    },
    "isActive": true,
    "isProfileCompleted": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Response Structure:**

- `user` (object): User profile object
  - `_id` (ObjectId): User ID
  - `email` (string): User's email address (optional)
  - `phone` (string): User's phone number (optional)
  - `name` (string): User's full name
  - `avatar` (string): Profile picture URL (optional)
  - `isEmailVerified` (boolean): Email verification status
  - `isPhoneVerified` (boolean): Phone verification status
  - `role` (object): Populated role object with permissions
  - `isActive` (boolean): Account active status
  - `isProfileCompleted` (boolean): Profile completion status
  - `createdAt` (Date): Account creation timestamp
  - `updatedAt` (Date): Last update timestamp
  - **Note:** `passwordHash` is excluded from the response for security

**Error Responses:**

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

**Notes:**

- The `role` field is populated with the full role object including permissions
- `passwordHash` is automatically excluded from the response
- Requires a valid JWT token in the Authorization header

---

## 📝 Data Models

### User Model

```typescript
{
  _id: ObjectId,
  email?: string,                // Unique, lowercase, trimmed
  phone?: string,                // Unique
  passwordHash?: string | null,  // Bcrypt hash (excluded from responses)
  name?: string,                 // User's full name
  avatar?: string,               // Profile picture URL
  isEmailVerified: boolean,      // Default: false
  isPhoneVerified: boolean,      // Default: false
  role?: ObjectId,               // Reference to Role model
  isActive: boolean,             // Default: true
  isProfileCompleted: boolean,   // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model

```typescript
{
  _id: ObjectId,
  identifier: string,            // Email or phone
  otp: string,                   // 6-digit numeric code
  purpose: "login" | "signup" | "reset",
  createdAt: Date,
  updatedAt: Date
}
```

**TTL:** OTP documents expire and are auto-deleted after 5 minutes (300 seconds)

### Auth Provider Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId,                                    // Reference to User
  provider: "password" | "otp" | "google" | "apple",  // Auth method
  providerId?: string,                                 // OAuth provider ID
  accessToken?: string,                                // OAuth access token
  refreshToken?: string,                               // OAuth refresh token
  lastUsedAt: Date,                                    // Last login timestamp
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 JWT Token Information

### Token Generation

Tokens are generated using the `generateAccessToken` function with the following payload structure:

```typescript
{
  userId: string,
  name?: string,
  email?: string,
  phone?: string,
  avatar?: string,
  isProfileCompleted: boolean,
  role?: string,
  isActive: boolean
}
```

### Authorization Header Format

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

- Tokens are typically valid for 24 hours (check your JWT configuration)
- Expired tokens will return a 401 Unauthorized response

---

## 🔄 Authentication Flow Diagrams

### OTP-based Registration & Login Flow

```
┌─────────────────────────────────────────────────────┐
│ User provides email/phone                            │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/send-otp                              │
│ { identifier, purpose }                              │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ OTP sent to email/phone (valid for 5 minutes)       │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/verify-otp                            │
│ { identifier, otp, purpose }                         │
└─────────────┬───────────────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
   New User    Existing User
        │           │
        ├───────────┤
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ Returns accessToken                                  │
│ (isProfileCompleted: false for new users)           │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
     Profile Complete?
        │           │
       No          Yes
        │           │
        ▼           ▼
   Complete    Ready to use
   Profile     application
        │
        ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/complete-profile                      │
│ { name, password }                                   │
│ Headers: { Authorization: Bearer <token> }          │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ Returns new accessToken                              │
│ (isProfileCompleted: true)                           │
└─────────────────────────────────────────────────────┘
```

### Password-based Login Flow

```
┌─────────────────────────────────────────────────────┐
│ User provides email/phone + password                 │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/login                                 │
│ { identifier, password }                             │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ Validations:                                         │
│ ✓ User exists                                        │
│ ✓ Profile completed                                  │
│ ✓ Email/Phone verified                               │
│ ✓ Password matches                                   │
└─────────────┬───────────────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
     Success     Failure
        │           │
        ▼           ▼
   accessToken   Error Message
   (200 OK)      (400/403)
```

---

## ⚠️ Error Codes

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| 200         | Success                                              |
| 400         | Bad Request (validation errors, invalid credentials) |
| 401         | Unauthorized (missing/invalid token)                 |
| 403         | Forbidden (profile incomplete, not verified)         |
| 404         | Not Found (user not found)                           |
| 500         | Internal Server Error                                |

---

## 💡 Usage Examples

### Example 1: Complete OTP Registration Flow

```javascript
// Step 1: Request OTP
const otpResponse = await fetch("/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "john.doe@example.com",
    purpose: "login",
  }),
});
// Response: { message: "OTP sent" }

// Step 2: Verify OTP (user receives OTP via email)
const verifyResponse = await fetch("/api/auth/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "john.doe@example.com",
    otp: "123456",
    purpose: "login",
  }),
});
const { accessToken } = await verifyResponse.json();
// Store the token for future requests

// Step 3: Complete profile (if new user)
const profileResponse = await fetch("/api/auth/complete-profile", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    name: "John Doe",
    password: "SecurePassword123!",
  }),
});
const { accessToken: newToken } = await profileResponse.json();
// Update stored token
```

### Example 2: Password Login

```javascript
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "john.doe@example.com",
    password: "SecurePassword123!",
  }),
});

const { status, message, accessToken } = await loginResponse.json();

if (status === "success") {
  // Store token and redirect to dashboard
  localStorage.setItem("token", accessToken);
  window.location.href = "/dashboard";
}
```

### Example 3: Get User Profile

```javascript
const token = localStorage.getItem("token");

const profileResponse = await fetch("/api/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const { user } = await profileResponse.json();
console.log("User:", user.name);
console.log("Role:", user.role.name);
console.log("Permissions:", user.role.permissions);
```

### Example 4: Phone Number Authentication

```javascript
// Using phone number instead of email
const otpResponse = await fetch("/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "+919876543210",
    purpose: "login",
  }),
});

// Verify OTP
const verifyResponse = await fetch("/api/auth/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "+919876543210",
    otp: "123456",
    purpose: "login",
  }),
});
```

---

## 🔐 Security Best Practices

1. **OTP Security**

   - OTPs expire after 5 minutes
   - Previous OTPs are deleted when new ones are generated
   - OTPs are deleted immediately after successful verification

2. **Password Security**

   - Passwords are hashed using bcrypt with salt round 12
   - Password hashes are never returned in API responses
   - Password comparison uses bcrypt's secure compare function

3. **Token Security**

   - Store JWT tokens securely (httpOnly cookies recommended for web)
   - Never expose tokens in URLs or logs
   - Implement token refresh mechanism for long-lived sessions

4. **Identifier Validation**

   - Email identifiers are normalized (lowercase, trimmed)
   - Phone numbers should include country code
   - Both email and phone fields are unique and sparse indexed

5. **Account Verification**
   - Users must verify email/phone before password login
   - Profile must be completed for password-based auth
   - Inactive accounts (`isActive: false`) should be handled appropriately

---

## 📌 Important Notes

1. **User Creation**: Users are automatically created during OTP verification if they don't exist
2. **Identifier Flexibility**: Users can authenticate with either email or phone number
3. **Profile Completion**: OTP-based registration requires completing profile before password login
4. **Role Assignment**: New users get a default role (if configured), or `role: null`
5. **Auth Providers**: The system tracks authentication methods used by each user
6. **Case Sensitivity**: Email addresses are case-insensitive, phone numbers are exact match
7. **Sparse Indexes**: Email and phone fields use sparse indexes, allowing null values
8. **Token Refresh**: Consider implementing a refresh token mechanism for production use
