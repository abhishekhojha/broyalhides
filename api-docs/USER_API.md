# User Management API Documentation

## Base URL

User endpoints are prefixed with `/api/users`

## Authentication & Authorization

- **All user management endpoints require:**
  - Authentication (`requireAuth` middleware)
  - `MANAGE_USERS` permission (`requirePermission` middleware)

> [!IMPORTANT]
> All user management endpoints require the `MANAGE_USERS` permission. Only administrators with this permission can access these endpoints.

---

## 👥 User Endpoints

### 1. Create User

Create a new user account (admin function).

**Endpoint:** `POST /api/users`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "passwordHash": "$2a$12$hashed_password_here",
  "name": "John Doe",
  "avatar": "https://example.com/avatars/john.jpg",
  "role": "507f1f77bcf86cd799439011"
}
```

**Field Details:**

- `email` (string, optional): User's email address (unique, lowercase, trimmed)
- `phone` (string, optional): User's phone number (unique)
- `passwordHash` (string, optional): Bcrypt hashed password
- `name` (string, optional): User's full name
- `avatar` (string, optional): Profile picture URL
- `role` (ObjectId, optional): Reference to Role model

> [!NOTE]
> At least one of `email` or `phone` is required. Both can be provided but must be unique.

**Example Requests:**

_Create User with Email Only:_

```json
{
  "email": "jane.smith@example.com",
  "name": "Jane Smith",
  "role": "507f1f77bcf86cd799439011"
}
```

_Create User with Phone Only:_

```json
{
  "phone": "+919876543210",
  "name": "John Doe",
  "role": "507f1f77bcf86cd799439012"
}
```

_Create User with Both Email and Phone:_

```json
{
  "email": "admin@example.com",
  "phone": "+919999999999",
  "passwordHash": "$2a$12$hashed_password",
  "name": "Admin User",
  "avatar": "https://example.com/avatars/admin.jpg",
  "role": "507f1f77bcf86cd799439013"
}
```

**Success Response (201):**

```json
{
  "message": "User created",
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "passwordHash": "$2a$12$hashed_password_here",
    "name": "John Doe",
    "avatar": "https://example.com/avatars/john.jpg",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "role": "507f1f77bcf86cd799439011",
    "isActive": true,
    "isProfileCompleted": false,
    "createdAt": "2026-01-02T11:50:00.000Z",
    "updatedAt": "2026-01-02T11:50:00.000Z"
  }
}
```

**Error Responses:**

_Missing Email and Phone (400):_

```json
{
  "message": "Email or phone is required."
}
```

_Invalid Role ID (400):_

```json
{
  "message": "Invalid role ID."
}
```

_User Already Exists (409):_

```json
{
  "message": "User with this email or phone already exists."
}
```

_Unauthorized/No Permission (401/403):_

```json
{
  "message": "Unauthorized"
}
```

---

### 2. Get All Users

Retrieve a paginated list of users with optional search and filtering.

**Endpoint:** `GET /api/users`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**

- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 20): Number of users per page
- `search` (string, optional): Search in name, email, or phone
- `role` (ObjectId, optional): Filter by role ID
- `isActive` (boolean, optional): Filter by active status
- `isProfileCompleted` (boolean, optional): Filter by profile completion status

**Example Requests:**

_Get First Page (Default):_

```
GET /api/users
```

_Get Second Page with 10 Users:_

```
GET /api/users?page=2&limit=10
```

_Search Users:_

```
GET /api/users?search=john
```

_Filter Active Users:_

```
GET /api/users?isActive=true
```

_Filter by Role:_

```
GET /api/users?role=507f1f77bcf86cd799439011
```

_Filter Users with Completed Profiles:_

```
GET /api/users?isProfileCompleted=true
```

_Combined Filters:_

```
GET /api/users?search=admin&isActive=true&page=1&limit=20
```

**Success Response (200):**

```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "email": "john.doe@example.com",
      "phone": "+919876543210",
      "passwordHash": "$2a$12$hashed_password_here",
      "name": "John Doe",
      "avatar": "https://example.com/avatars/john.jpg",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "role": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "customer",
        "permissions": []
      },
      "isActive": true,
      "isProfileCompleted": true,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-02T11:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "email": "jane.smith@example.com",
      "phone": null,
      "passwordHash": "$2a$12$another_hashed_password",
      "name": "Jane Smith",
      "avatar": null,
      "isEmailVerified": true,
      "isPhoneVerified": false,
      "role": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "store manager",
        "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS"]
      },
      "isActive": true,
      "isProfileCompleted": true,
      "createdAt": "2026-01-01T12:00:00.000Z",
      "updatedAt": "2026-01-02T09:15:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 45,
  "totalPages": 3
}
```

**Response Structure:**

- `users` (array): Array of user objects with populated role (name and permissions only)
- `page` (number): Current page number
- `limit` (number): Users per page
- `total` (number): Total number of users matching the filters
- `totalPages` (number): Total number of pages

**Notes:**

- Role field is automatically populated with `name` and `permissions`
- Password hash is included in the response (consider excluding in production)
- Search is case-insensitive and searches across name, email, and phone

---

### 3. Get User by ID

Retrieve a single user by their ID.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**URL Parameters:**

- `id` (ObjectId, required): User ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
GET /api/users/507f1f77bcf86cd799439020
```

**Success Response (200):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "passwordHash": "$2a$12$hashed_password_here",
    "name": "John Doe",
    "avatar": "https://example.com/avatars/john.jpg",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "role": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "customer",
      "permissions": []
    },
    "isActive": true,
    "isProfileCompleted": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Error Responses:**

_Invalid User ID (400):_

```json
{
  "message": "Invalid user ID."
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

**Notes:**

- Role field is populated with `name` and `permissions`
- Password hash is included (consider security implications)

---

### 4. Update User

Update an existing user's details.

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**URL Parameters:**

- `id` (ObjectId, required): User ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:** (All fields are optional)

```json
{
  "email": "newemail@example.com",
  "phone": "+919999999999",
  "passwordHash": "$2a$12$new_hashed_password",
  "name": "Updated Name",
  "avatar": "https://example.com/avatars/new.jpg",
  "role": "507f1f77bcf86cd799439012",
  "isActive": true,
  "isProfileCompleted": true
}
```

**Field Details:**

- `email` (string, optional): New email address
- `phone` (string, optional): New phone number
- `passwordHash` (string, optional): New password hash
- `name` (string, optional): Updated name
- `avatar` (string, optional): New avatar URL (can be set to null)
- `role` (ObjectId, optional): New role ID (can be set to null)
- `isActive` (boolean, optional): Active status
- `isProfileCompleted` (boolean, optional): Profile completion status

**Example Requests:**

_Update Name Only:_

```json
{
  "name": "John Michael Doe"
}
```

_Update Email and Phone:_

```json
{
  "email": "john.m.doe@example.com",
  "phone": "+919888888888"
}
```

_Deactivate User:_

```json
{
  "isActive": false
}
```

_Update Role:_

```json
{
  "role": "507f1f77bcf86cd799439013"
}
```

_Remove Avatar:_

```json
{
  "avatar": null
}
```

**Success Response (200):**

```json
{
  "message": "User updated",
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "email": "newemail@example.com",
    "phone": "+919999999999",
    "passwordHash": "$2a$12$new_hashed_password",
    "name": "Updated Name",
    "avatar": "https://example.com/avatars/new.jpg",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "role": "507f1f77bcf86cd799439012",
    "isActive": true,
    "isProfileCompleted": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T13:45:00.000Z"
  }
}
```

**Error Responses:**

_Invalid User ID (400):_

```json
{
  "message": "Invalid user ID."
}
```

_Invalid Role ID (400):_

```json
{
  "message": "Invalid role ID."
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

**Notes:**

- Only provided fields will be updated
- Setting role to `undefined` keeps existing role; setting to `null` removes the role
- Email and phone uniqueness is not validated during update (potential issue)
- Verification flags are not automatically updated when email/phone changes

---

### 5. Delete User

Delete a user from the system.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**URL Parameters:**

- `id` (ObjectId, required): User ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
DELETE /api/users/507f1f77bcf86cd799439020
```

**Success Response (200):**

```json
{
  "message": "User deleted"
}
```

**Error Responses:**

_Invalid User ID (400):_

```json
{
  "message": "Invalid user ID."
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

> [!CAUTION] > **Data Integrity Considerations:**
>
> - Deleting a user does NOT cascade delete related data (orders, cart, etc.)
> - Related records may become orphaned
> - Consider implementing soft delete (isActive: false) instead of hard delete
> - Related auth provider records are not deleted

---

### 6. Assign Role to User

Assign a role to a user (alternative to updating user).

**Endpoint:** `POST /api/users/:id/assign-role`

**Authentication:** Required (Bearer Token)

**Permission:** `MANAGE_USERS`

**URL Parameters:**

- `id` (ObjectId, required): User ID

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "roleId": "507f1f77bcf86cd799439012"
}
```

**Field Details:**

- `roleId` (ObjectId, required): ID of the role to assign

**Example Request:**

```json
{
  "roleId": "507f1f77bcf86cd799439013"
}
```

**Success Response (200):**

```json
{
  "message": "Role assigned",
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "passwordHash": "$2a$12$hashed_password_here",
    "name": "John Doe",
    "avatar": "https://example.com/avatars/john.jpg",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "role": "507f1f77bcf86cd799439013",
    "isActive": true,
    "isProfileCompleted": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T14:00:00.000Z"
  }
}
```

**Error Responses:**

_Invalid User or Role ID (400):_

```json
{
  "message": "Invalid user or role ID."
}
```

_User Not Found (404):_

```json
{
  "message": "User not found"
}
```

_Role Not Found (404):_

```json
{
  "message": "Role not found"
}
```

**Notes:**

- This endpoint validates that the role exists before assignment
- Functionally similar to `PUT /api/users/:id` with role field
- Provides explicit validation of role existence

---

## 📝 Data Models

### User Model

```typescript
{
  _id: ObjectId,
  email?: string,                    // Unique, lowercase, trimmed, sparse
  phone?: string,                    // Unique, sparse
  passwordHash?: string | null,      // Bcrypt hash
  name?: string,                     // User's full name, trimmed
  avatar?: string,                   // Profile picture URL
  isEmailVerified: boolean,          // Default: false
  isPhoneVerified: boolean,          // Default: false
  role?: ObjectId,                   // Reference to Role model
  isActive: boolean,                 // Default: true
  isProfileCompleted: boolean,       // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Populated User (in responses)

```typescript
{
  _id: ObjectId,
  email?: string,
  phone?: string,
  passwordHash?: string | null,
  name?: string,
  avatar?: string,
  isEmailVerified: boolean,
  isPhoneVerified: boolean,
  role?: {
    _id: ObjectId,
    name: string,
    permissions: string[]
  },
  isActive: boolean,
  isProfileCompleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚠️ Error Codes

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 201         | Created                                     |
| 400         | Bad Request (validation errors, invalid ID) |
| 401         | Unauthorized (missing/invalid token)        |
| 403         | Forbidden (missing MANAGE_USERS permission) |
| 404         | Not Found (user or role not found)          |
| 409         | Conflict (email or phone already exists)    |
| 500         | Internal Server Error                       |

---

## 💡 Usage Examples

### Example 1: Create and Assign Role to User

```javascript
const createAndAssignRole = async (token) => {
  // Step 1: Create user
  const createResponse = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: "newuser@example.com",
      name: "New User",
    }),
  });

  const { user } = await createResponse.json();
  console.log("User created:", user._id);

  // Step 2: Assign role
  const assignResponse = await fetch(`/api/users/${user._id}/assign-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      roleId: "507f1f77bcf86cd799439012",
    }),
  });

  const { user: updatedUser } = await assignResponse.json();
  console.log("Role assigned");
  return updatedUser;
};
```

### Example 2: Search and Filter Users

```javascript
const searchUsers = async (token, searchTerm) => {
  const params = new URLSearchParams({
    search: searchTerm,
    isActive: "true",
    page: "1",
    limit: "10",
  });

  const response = await fetch(`/api/users?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { users, total, totalPages } = await response.json();
  console.log(`Found ${total} users across ${totalPages} pages`);
  return users;
};

// Usage
const users = await searchUsers(token, "john");
```

### Example 3: Paginate Through All Users

```javascript
const getAllUsersWithPagination = async (token) => {
  let page = 1;
  const limit = 20;
  let allUsers = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { users, totalPages } = await response.json();
    allUsers = allUsers.concat(users);

    hasMore = page < totalPages;
    page++;
  }

  return allUsers;
};
```

### Example 4: Update User Profile

```javascript
const updateUserProfile = async (token, userId, updates) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const { message, user } = await response.json();
  console.log(message);
  return user;
};

// Usage - Update multiple fields
await updateUserProfile(token, "507f1f77bcf86cd799439020", {
  name: "John Updated Doe",
  avatar: "https://example.com/new-avatar.jpg",
  isActive: true,
});
```

### Example 5: Toggle User Active Status

```javascript
const toggleUserStatus = async (token, userId, currentStatus) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      isActive: !currentStatus,
    }),
  });

  const { user } = await response.json();
  return user;
};

// Usage
const user = await toggleUserStatus(token, "507f1f77bcf86cd799439020", true);
console.log("User is now:", user.isActive ? "Active" : "Inactive");
```

### Example 6: Get Users by Role

```javascript
const getUsersByRole = async (token, roleId) => {
  const params = new URLSearchParams({
    role: roleId,
    page: "1",
    limit: "100",
  });

  const response = await fetch(`/api/users?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { users } = await response.json();
  return users;
};

// Usage - Get all admins
const admins = await getUsersByRole(token, "adminRoleId");
```

### Example 7: User Management Dashboard

```javascript
class UserManager {
  constructor(token) {
    this.token = token;
    this.baseUrl = "/api/users";
  }

  async create(userData) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  }

  async search(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async update(id, updates) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(updates),
    });
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async assignRole(userId, roleId) {
    const response = await fetch(`${this.baseUrl}/${userId}/assign-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ roleId }),
    });
    return await response.json();
  }

  async getActiveUsers(page = 1, limit = 20) {
    return await this.search({ isActive: true, page, limit });
  }

  async getInactiveUsers(page = 1, limit = 20) {
    return await this.search({ isActive: false, page, limit });
  }

  async getUsersWithCompletedProfiles(page = 1, limit = 20) {
    return await this.search({ isProfileCompleted: true, page, limit });
  }
}

// Usage
const userManager = new UserManager(adminToken);

// Get active users
const activeUsers = await userManager.getActiveUsers(1, 10);

// Search for users
const results = await userManager.search({
  search: "john",
  isActive: true,
  page: 1,
  limit: 20,
});

// Create new user
const newUser = await userManager.create({
  email: "test@example.com",
  name: "Test User",
});
```

---

## 🔒 Security Considerations

### 1. Password Handling

> [!WARNING]
> The API returns `passwordHash` in responses. This should be excluded in production for security.

**Recommendation:**

```typescript
// In controller, exclude passwordHash
const user = await User.findById(id)
  .select("-passwordHash")
  .populate("role", "name permissions");
```

### 2. Permission Requirements

- All endpoints require `MANAGE_USERS` permission
- Ensure proper role-based access control
- Consider separate permissions for create/read/update/delete

### 3. Email/Phone Uniqueness

- Uniqueness is only checked during creation
- Updates don't validate uniqueness (potential bug)
- Consider adding validation in update endpoint

### 4. Soft Delete vs Hard Delete

- Current implementation uses hard delete
- Consider soft delete (setting `isActive: false`)
- Preserves data integrity and audit trail

### 5. Sensitive User Operations

Consider adding additional checks for:

- Preventing self-deletion
- Preventing removal of super admin role
- Logging user management actions
- Requiring additional confirmation for deletion

---

## 📊 User Statistics and Analytics

### Get User Statistics

```javascript
const getUserStats = async (token) => {
  // Get all users (or use aggregation in backend)
  const response = await fetch("/api/users?limit=1000", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { users, total } = await response.json();

  return {
    total: total,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    verified: users.filter((u) => u.isEmailVerified || u.isPhoneVerified)
      .length,
    profileCompleted: users.filter((u) => u.isProfileCompleted).length,
    byRole: users.reduce((acc, user) => {
      const roleName = user.role?.name || "No Role";
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {}),
  };
};

// Result:
// {
//   total: 150,
//   active: 142,
//   inactive: 8,
//   verified: 135,
//   profileCompleted: 120,
//   byRole: {
//     'customer': 100,
//     'store manager': 30,
//     'admin': 15,
//     'No Role': 5
//   }
// }
```

---

## 📌 Important Notes

1. **Password Hash Exposure**: Password hashes are included in responses - consider excluding

2. **Email/Phone Validation**: No uniqueness validation during updates

3. **Verification Flags**: Not automatically reset when email/phone changes

4. **Sparse Indexes**: Email and phone use sparse unique indexes (allow null)

5. **Role Population**: Role is populated with `name` and `permissions` only

6. **Default Values**:

   - `isActive`: true
   - `isProfileCompleted`: false
   - `isEmailVerified`: false
   - `isPhoneVerified`: false

7. **Search**: Case-insensitive search across name, email, and phone

8. **Pagination**: Default limit is 20 users per page

9. **No Cascade Delete**: Related data is not deleted when user is deleted

10. **Permission Required**: All endpoints require `MANAGE_USERS` permission

---

## 🚀 Enhancement Suggestions

Consider implementing these features for production:

1. **Exclude Password Hash**: Remove `passwordHash` from all responses
2. **Email/Phone Validation**: Validate uniqueness in update operations
3. **Soft Delete**: Implement soft delete instead of hard delete
4. **Bulk Operations**: Add endpoints for bulk user creation/updates
5. **Export Users**: Add CSV/Excel export functionality
6. **User Activity Log**: Track user management actions
7. **Self-Prevention**: Prevent users from deleting themselves
8. **Advanced Search**: Add more search filters (date range, verification status)
9. **User Import**: Bulk user import from CSV
10. **Profile Picture Upload**: Integration with file upload service
11. **Email Notifications**: Notify users when their account is created/modified
12. **Password Reset**: Send password reset link when creating user
