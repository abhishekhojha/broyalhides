# Role & Permission Management API Documentation

## Base URL

Role endpoints are prefixed with `/api/roles`

## Authentication & Authorization

- **All role endpoints require:**
  - Authentication (`requireAuth` middleware)
  - **Super Admin privileges** (`isSuperAdmin` middleware)

> [!IMPORTANT]
> All role management endpoints are restricted to Super Admin users only. Regular users and admins cannot access these endpoints.

---

## 🎭 Role Endpoints

### 1. Create Role

Create a new role with specific permissions.

**Endpoint:** `POST /api/roles`

**Authentication:** Required (Bearer Token + Super Admin)

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Request Body:**

```json
{
  "name": "Store Manager",
  "description": "Manages store operations including products and orders",
  "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_CATEGORIES"]
}
```

**Field Details:**

- `name` (string, required): Role name (will be converted to lowercase and must be unique)
- `description` (string, optional): Description of the role and its responsibilities
- `permissions` (array of strings, required): Array of permission strings

**Available Permissions:**

- `MANAGE_PRODUCTS` - Create, update, delete products and variants
- `MANAGE_ORDERS` - Manage customer orders
- `MANAGE_CATEGORIES` - Create and manage product categories
- `MANAGE_COUPONS` - Create and manage discount coupons
- `MANAGE_SECTIONS` - Manage website sections

**Success Response (201):**

```json
{
  "message": "Role created",
  "role": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "store manager",
    "description": "Manages store operations including products and orders",
    "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_CATEGORIES"],
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Error Responses:**

_Missing Required Fields (400):_

```json
{
  "message": "Name and permissions are required."
}
```

_Role Already Exists (409):_

```json
{
  "message": "Role with this name already exists."
}
```

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

**Notes:**

- Role names are automatically converted to lowercase for consistency
- Role names must be unique across the system
- Permissions array must contain valid permission strings
- Invalid permissions are not validated at creation (consider adding validation)

---

### 2. Get All Roles

Retrieve a list of all roles in the system.

**Endpoint:** `GET /api/roles`

**Authentication:** Required (Bearer Token + Super Admin)

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Success Response (200):**

```json
{
  "roles": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "customer",
      "description": "Regular customer with basic permissions",
      "permissions": [],
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "store manager",
      "description": "Manages store operations including products and orders",
      "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_CATEGORIES"],
      "createdAt": "2026-01-02T11:30:00.000Z",
      "updatedAt": "2026-01-02T11:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "admin",
      "description": "Full system administrator",
      "permissions": [
        "MANAGE_PRODUCTS",
        "MANAGE_ORDERS",
        "MANAGE_CATEGORIES",
        "MANAGE_COUPONS",
        "MANAGE_SECTIONS"
      ],
      "createdAt": "2026-01-02T12:00:00.000Z",
      "updatedAt": "2026-01-02T12:00:00.000Z"
    }
  ]
}
```

**Response Structure:**

- `roles` (array): Array of all role objects
  - Each role contains: `_id`, `name`, `description`, `permissions`, `createdAt`, `updatedAt`

**Error Responses:**

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

---

### 3. Get All Permissions

Retrieve a list of all available system permissions.

**Endpoint:** `GET /api/roles/permissions`

**Authentication:** Required (Bearer Token + Super Admin)

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Success Response (200):**

```json
{
  "permissions": [
    "MANAGE_PRODUCTS",
    "MANAGE_ORDERS",
    "MANAGE_CATEGORIES",
    "MANAGE_COUPONS",
    "MANAGE_SECTIONS"
  ]
}
```

**Response Structure:**

- `permissions` (array of strings): List of all available system permissions

**Permission Descriptions:**

| Permission          | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `MANAGE_PRODUCTS`   | Create, read, update, and delete products and variants |
| `MANAGE_ORDERS`     | View and manage customer orders                        |
| `MANAGE_CATEGORIES` | Create and manage product categories                   |
| `MANAGE_COUPONS`    | Create and manage discount coupons                     |
| `MANAGE_SECTIONS`   | Manage website content sections                        |

**Error Responses:**

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

**Notes:**

- This endpoint is useful for building role management UIs
- Permissions are defined in `/src/constants/permissions.ts`
- New permissions can be added to the system by updating the constants file

---

### 4. Get Role by ID

Retrieve a single role by its ID.

**Endpoint:** `GET /api/roles/:id`

**Authentication:** Required (Bearer Token + Super Admin)

**URL Parameters:**

- `id` (ObjectId, required): Role ID

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Example Request:**

```
GET /api/roles/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "role": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "store manager",
    "description": "Manages store operations including products and orders",
    "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_CATEGORIES"],
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T11:30:00.000Z"
  }
}
```

**Error Responses:**

_Role Not Found (404):_

```json
{
  "message": "Role not found"
}
```

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

---

### 5. Update Role

Update an existing role's name, description, or permissions.

**Endpoint:** `PUT /api/roles/:id`

**Authentication:** Required (Bearer Token + Super Admin)

**URL Parameters:**

- `id` (ObjectId, required): Role ID

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Request Body:** (All fields are optional)

```json
{
  "name": "Senior Store Manager",
  "description": "Senior manager with extended responsibilities",
  "permissions": [
    "MANAGE_PRODUCTS",
    "MANAGE_ORDERS",
    "MANAGE_CATEGORIES",
    "MANAGE_COUPONS"
  ]
}
```

**Example Requests:**

_Update Only Permissions:_

```json
{
  "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS"]
}
```

_Update Only Description:_

```json
{
  "description": "Updated role description"
}
```

_Update All Fields:_

```json
{
  "name": "Product Manager",
  "description": "Manages product catalog and inventory",
  "permissions": ["MANAGE_PRODUCTS", "MANAGE_CATEGORIES"]
}
```

**Success Response (200):**

```json
{
  "message": "Role updated",
  "role": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "senior store manager",
    "description": "Senior manager with extended responsibilities",
    "permissions": [
      "MANAGE_PRODUCTS",
      "MANAGE_ORDERS",
      "MANAGE_CATEGORIES",
      "MANAGE_COUPONS"
    ],
    "createdAt": "2026-01-02T11:30:00.000Z",
    "updatedAt": "2026-01-02T12:45:00.000Z"
  }
}
```

**Error Responses:**

_Role Not Found (404):_

```json
{
  "message": "Role not found"
}
```

_Role Name Already Exists (409):_

```json
{
  "message": "Role name already exists."
}
```

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

**Notes:**

- Role name will be converted to lowercase if provided
- Name uniqueness is validated (excluding the current role)
- You can update individual fields without affecting others
- Permissions array will be completely replaced if provided

---

### 6. Delete Role

Delete a role from the system.

**Endpoint:** `DELETE /api/roles/:id`

**Authentication:** Required (Bearer Token + Super Admin)

**URL Parameters:**

- `id` (ObjectId, required): Role ID

**Request Headers:**

```
Authorization: Bearer <superAdminToken>
```

**Example Request:**

```
DELETE /api/roles/507f1f77bcf86cd799439012
```

**Success Response (200):**

```json
{
  "message": "Role deleted"
}
```

**Error Responses:**

_Role Not Found (404):_

```json
{
  "message": "Role not found"
}
```

_Unauthorized (401):_

```json
{
  "message": "Unauthorized"
}
```

_Forbidden - Not Super Admin (403):_

```json
{
  "message": "Access denied. Super admin only."
}
```

> [!WARNING]
> Deleting a role does not automatically reassign users who have this role. Users with deleted roles may experience permission issues. Consider implementing a cascade update or prevention mechanism.

---

## 📝 Data Models

### Role Model

```typescript
{
  _id: ObjectId,
  name: string,              // Unique, lowercase role name
  description?: string,      // Optional role description
  permissions: string[],     // Array of permission strings
  createdAt: Date,
  updatedAt: Date
}
```

### Permission Type

```typescript
type Permission =
  | "MANAGE_PRODUCTS"
  | "MANAGE_ORDERS"
  | "MANAGE_CATEGORIES"
  | "MANAGE_COUPONS"
  | "MANAGE_SECTIONS";
```

---

## 🔐 How Roles Work in the System

### Role Assignment

Users are assigned roles through the `role` field in the User model:

```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  role: ObjectId,  // Reference to Role model
  // ... other fields
}
```

### Permission Checking

The system uses the `requirePermission` middleware to check if a user has specific permissions:

```typescript
// Example from product.routes.ts
router.post(
  "/",
  requireAuth,
  requirePermission("MANAGE_PRODUCTS"),
  createProduct
);
```

### Permission Middleware Flow

```
1. User makes request with JWT token
2. requireAuth extracts user info from token
3. requirePermission checks if user's role has the required permission
4. If yes → proceed to controller
5. If no → return 403 Forbidden
```

---

## ⚠️ Error Codes

| Status Code | Description                                        |
| ----------- | -------------------------------------------------- |
| 200         | Success                                            |
| 201         | Created                                            |
| 400         | Bad Request (validation errors)                    |
| 401         | Unauthorized (missing/invalid token)               |
| 403         | Forbidden (not super admin or missing permissions) |
| 404         | Not Found (role not found)                         |
| 409         | Conflict (role name already exists)                |
| 500         | Internal Server Error                              |

---

## 💡 Usage Examples

### Example 1: Create a New Role

```javascript
const createRole = async (token) => {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Content Manager",
      description: "Manages website content and sections",
      permissions: ["MANAGE_PRODUCTS", "MANAGE_SECTIONS"],
    }),
  });

  const { message, role } = await response.json();
  console.log(message); // "Role created"
  console.log("Role ID:", role._id);
  return role;
};
```

### Example 2: Get All Roles and Display

```javascript
const fetchAndDisplayRoles = async (token) => {
  const response = await fetch("/api/roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { roles } = await response.json();

  roles.forEach((role) => {
    console.log(`Role: ${role.name}`);
    console.log(`Description: ${role.description}`);
    console.log(`Permissions: ${role.permissions.join(", ")}`);
    console.log("---");
  });
};
```

### Example 3: Update Role Permissions

```javascript
const updateRolePermissions = async (token, roleId) => {
  const response = await fetch(`/api/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      permissions: [
        "MANAGE_PRODUCTS",
        "MANAGE_ORDERS",
        "MANAGE_CATEGORIES",
        "MANAGE_COUPONS",
        "MANAGE_SECTIONS",
      ],
    }),
  });

  const { message, role } = await response.json();
  console.log(message); // "Role updated"
  return role;
};
```

### Example 4: Get Available Permissions for UI

```javascript
const getAvailablePermissions = async (token) => {
  const response = await fetch("/api/roles/permissions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { permissions } = await response.json();

  // Use for building a permission selector UI
  return permissions.map((permission) => ({
    value: permission,
    label: permission.replace(/_/g, " ").toLowerCase(),
  }));
};

// Result:
// [
//   { value: 'MANAGE_PRODUCTS', label: 'manage products' },
//   { value: 'MANAGE_ORDERS', label: 'manage orders' },
//   ...
// ]
```

### Example 5: Delete Role with Confirmation

```javascript
const deleteRoleWithConfirmation = async (token, roleId, roleName) => {
  if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/roles/${roleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const { message } = await response.json();
      console.log(message); // "Role deleted"
      return true;
    } else {
      const error = await response.json();
      console.error("Error:", error.message);
      return false;
    }
  } catch (error) {
    console.error("Failed to delete role:", error);
    return false;
  }
};
```

### Example 6: Build Role Management UI

```javascript
// Complete role management component example
class RoleManager {
  constructor(token) {
    this.token = token;
    this.baseUrl = "/api/roles";
  }

  async getAllRoles() {
    const response = await fetch(this.baseUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    const { roles } = await response.json();
    return roles;
  }

  async createRole(roleData) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(roleData),
    });
    return await response.json();
  }

  async updateRole(roleId, updates) {
    const response = await fetch(`${this.baseUrl}/${roleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(updates),
    });
    return await response.json();
  }

  async deleteRole(roleId) {
    const response = await fetch(`${this.baseUrl}/${roleId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  async getPermissions() {
    const response = await fetch(`${this.baseUrl}/permissions`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    const { permissions } = await response.json();
    return permissions;
  }
}

// Usage
const roleManager = new RoleManager(superAdminToken);
const roles = await roleManager.getAllRoles();
const permissions = await roleManager.getPermissions();
```

---

## 🔒 Security Considerations

### Super Admin Protection

All role management endpoints require Super Admin privileges. The `isSuperAdmin` middleware ensures:

1. User is authenticated
2. User has a role assigned
3. User's role has super admin privileges

### Role-Based Access Control (RBAC)

The system implements RBAC through:

1. **Roles**: Collections of permissions (e.g., "Store Manager")
2. **Permissions**: Specific capabilities (e.g., "MANAGE_PRODUCTS")
3. **Middleware**: Validates permissions before allowing access

### Best Practices

1. **Principle of Least Privilege**: Assign minimal permissions needed
2. **Regular Audits**: Periodically review role assignments
3. **Avoid Hardcoding**: Use the permissions constants, not hardcoded strings
4. **Cascading Deletes**: Implement logic to handle users when roles are deleted
5. **Permission Validation**: Consider validating permissions against the PERMISSIONS constant

---

## 📊 Common Role Patterns

### Example Role Configurations

**Customer Role:**

```json
{
  "name": "customer",
  "description": "Regular customer with basic access",
  "permissions": []
}
```

**Store Manager Role:**

```json
{
  "name": "store manager",
  "description": "Manages products and customer orders",
  "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_CATEGORIES"]
}
```

**Marketing Manager Role:**

```json
{
  "name": "marketing manager",
  "description": "Manages marketing campaigns and content",
  "permissions": ["MANAGE_COUPONS", "MANAGE_SECTIONS"]
}
```

**Administrator Role:**

```json
{
  "name": "administrator",
  "description": "Full system access except super admin functions",
  "permissions": [
    "MANAGE_PRODUCTS",
    "MANAGE_ORDERS",
    "MANAGE_CATEGORIES",
    "MANAGE_COUPONS",
    "MANAGE_SECTIONS"
  ]
}
```

---

## 📌 Important Notes

1. **Lowercase Names**: Role names are automatically converted to lowercase for consistency

2. **Unique Names**: Role names must be unique across the system

3. **Super Admin Only**: All role management requires super admin privileges

4. **No Built-in Roles**: The system doesn't enforce or require specific role names

5. **Permission Constants**: Available permissions are defined in `/src/constants/permissions.ts`

6. **User Impact**: Deleting or modifying roles affects all users assigned to that role

7. **No Permission Validation**: The API doesn't validate if provided permissions exist (consider adding this)

8. **Role Assignment**: Roles are assigned to users through the User model's `role` field

9. **Default Role**: New users may or may not have a default role depending on your configuration

10. **Super Admin Role**: There should be a mechanism to identify super admin roles (not evident in the current code)

---

## 🚀 Extending the System

### Adding New Permissions

To add new permissions to the system:

1. Update `/src/constants/permissions.ts`:

```typescript
export const PERMISSIONS = [
  "MANAGE_PRODUCTS",
  "MANAGE_ORDERS",
  "MANAGE_CATEGORIES",
  "MANAGE_COUPONS",
  "MANAGE_SECTIONS",
  "MANAGE_USERS", // New permission
  "MANAGE_ANALYTICS", // New permission
];
```

2. Use the new permission in routes:

```typescript
router.get(
  "/users",
  requireAuth,
  requirePermission("MANAGE_USERS"),
  getAllUsers
);
```

3. Update existing roles to include new permissions as needed

### Implementing Permission Groups

Consider grouping related permissions:

```typescript
export const PERMISSION_GROUPS = {
  CONTENT: ["MANAGE_PRODUCTS", "MANAGE_CATEGORIES", "MANAGE_SECTIONS"],
  SALES: ["MANAGE_ORDERS", "MANAGE_COUPONS"],
  SYSTEM: ["MANAGE_USERS", "MANAGE_ANALYTICS"],
};
```
