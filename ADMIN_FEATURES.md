# Admin Features Documentation

**Last Updated:** October 25, 2025
**Status:** Implemented and Ready for Testing

---

## Overview

The Pairings project now includes comprehensive admin functionality for system administrators to manage users, view statistics, and moderate the platform.

---

## Features Implemented

### 1. Statistics Tracking ✅

#### Player Statistics (All Users)
- **Endpoint:** `GET /api/tournaments/players/:playerId/statistics`
- **Access:** Public (any logged-in user can view)
- **Data Tracked:**
  - Tournaments participated in
  - Matches played (wins, losses, byes)
  - Win rate percentage
  - Average Control Points (CP)
  - Average Army Points (AP)
  - Faction usage statistics
  - Recent tournament history

#### System-Wide Statistics (Admin Only)
- **Endpoint:** `GET /api/admin/stats`
- **Access:** Admin only
- **Data Provided:**
  - **User Statistics:**
    - Total users count
    - Breakdown by role (Player, TO, Admin)
    - New users this week/month
  - **Tournament Statistics:**
    - Total tournaments
    - Status breakdown (Draft, Registration, Active, Completed)
    - Tournaments created this week/month
  - **Match Statistics:**
    - Total matches played
    - Completed vs pending matches
    - Average CP and AP per match
  - **Engagement Metrics:**
    - Active players count
    - Average matches per player
  - **Game System Breakdown:**
    - Tournament count per game system
  - **Recent Activity:**
    - Latest 20 system events (new users, tournaments)

---

### 2. Admin Dashboard ✅

#### User Management
- **List All Users:**
  - Search by username or email
  - Filter by role (All, Player, TO, Admin)
  - Pagination support
  - Display user details and roles

- **Update User Roles:**
  - Change user roles between Player, TO, and Admin
  - Admins cannot demote themselves (safety feature)
  - Instant role updates with validation

- **Delete Users:**
  - Remove user accounts
  - Cascade deletion of related data
  - Admins cannot delete themselves (safety feature)
  - Confirmation dialogs to prevent accidents

- **View User Details:**
  - Individual user information
  - Tournament participation stats
  - Tournaments organized count

#### System Monitoring
- Real-time system statistics dashboard
- Visual breakdown of users, tournaments, and matches
- Game system popularity tracking
- Recent activity feed

---

## API Endpoints

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get All Users
```
GET /api/admin/users
```

**Query Parameters:**
- `role` - Filter by role (player, to, admin)
- `search` - Search by username or email
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "users": [...],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

#### Get User by ID
```
GET /api/admin/users/:userId
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "player1",
    "role": "player",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-10-24T...",
    "updatedAt": "2025-10-24T..."
  },
  "stats": {
    "tournamentsParticipated": 5,
    "tournamentsOrganized": 2
  }
}
```

---

#### Update User Role
```
PUT /api/admin/users/:userId/role
```

**Request Body:**
```json
{
  "role": "to"
}
```

**Validation:**
- Role must be one of: `player`, `to`, `admin`
- Admin cannot change their own role

**Response:**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "uuid",
    "username": "player1",
    "role": "to"
  }
}
```

---

#### Delete User
```
DELETE /api/admin/users/:userId
```

**Validation:**
- Admin cannot delete themselves

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "id": "uuid",
    "username": "player1"
  }
}
```

---

#### Get System Statistics
```
GET /api/admin/stats
```

**Response:**
```json
{
  "users": {
    "total": 150,
    "players": 130,
    "organizers": 18,
    "admins": 2,
    "newThisWeek": 5,
    "newThisMonth": 23
  },
  "tournaments": {
    "total": 45,
    "draft": 3,
    "registration": 5,
    "active": 2,
    "completed": 35,
    "createdThisWeek": 2,
    "createdThisMonth": 8
  },
  "matches": {
    "total": 340,
    "completed": 320,
    "pending": 20,
    "avgTotalCP": "6.8",
    "avgTotalAP": "42.5"
  },
  "engagement": {
    "activePlayers": 85,
    "avgMatchesPerPlayer": "4.0"
  },
  "gameSystems": [
    { "name": "warmachine", "count": 45 }
  ],
  "recentActivity": [...]
}
```

---

## Frontend Admin Dashboard

### Access Control
- Admin tab only visible to users with `role: 'admin'`
- Automatically appears in bottom navigation for admin users
- Icon: ⚙️ (Settings/Admin gear)

### Features

#### Statistics Tab
- System overview cards:
  - Total Users
  - Total Tournaments
  - Total Matches
  - Active Players

- Users by Role breakdown
- Tournament Status breakdown
- Match Statistics
- Game Systems popularity
- Pull-to-refresh support

#### User Management Tab
- Search functionality (username/email)
- Role filter chips (All, Player, TO, Admin)
- User cards showing:
  - Username and email
  - Current role badge
  - Change Role button
  - Delete button

- Actions:
  - **Change Role:** Select new role from dialog
  - **Delete User:** Confirmation dialog with username

---

## Security Features

### Role-Based Access Control
- All admin endpoints protected by `authenticate` and `authorize('admin')` middleware
- JWT token verification on every request
- User role validated against database

### Safety Mechanisms
- Admins cannot change their own role (prevents accidental demotion)
- Admins cannot delete themselves (prevents account lockout)
- Confirmation dialogs for destructive actions
- Validation on all inputs

### Cascade Deletion
When a user is deleted:
- Tournament registrations removed
- Owned tournaments transferred or deleted (based on implementation)
- Match results preserved for historical integrity
- Database handles cascading properly

---

## Testing the Admin Features

### Backend Testing

#### 1. Update a User's Role
To give admin access to a test user:

```bash
# Update alice to admin role
node backend/update-role.js alice@example.com admin
```

#### 2. Test API Endpoints with curl

**Get System Stats:**
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**List All Users:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Search Users:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?search=alice" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Filter by Role:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?role=player" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Update User Role:**
```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"role":"to"}'
```

**Delete User:**
```bash
curl -X DELETE http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Frontend Testing

#### 1. Login as Admin
- Use the script to make a user an admin first
- Login with that account in the mobile app
- Verify the Admin tab (⚙️) appears in bottom navigation

#### 2. Test Statistics Tab
- Navigate to Admin tab
- Verify all statistics load correctly
- Pull down to refresh
- Check that numbers match database

#### 3. Test User Management Tab
- Switch to "User Management" tab
- Search for users by username
- Filter by different roles
- Try changing a user's role
- Try deleting a test user (NOT yourself!)

---

## Integration with Existing Features

### Player Statistics
- Available in Profile screen for all users
- Shows personal tournament and match history
- Faction usage tracking
- Recent tournaments list

### Admin Badge
- Displayed on user profiles when role is admin
- Red badge with "ADMIN" text
- Visible in profile header

---

## Future Enhancements (Optional)

### Moderation Tools
- Content review queue
- User report system
- Ban/suspend users temporarily
- IP blocking

### Advanced Analytics
- User retention metrics
- Tournament growth trends
- Popular time slots for events
- Geographic distribution

### Audit Logs
- Track all admin actions
- User activity logs
- Change history

### Bulk Operations
- Bulk role updates
- Export user data (CSV)
- Bulk email notifications

---

## Files Added/Modified

### Backend
- **New:** `backend/src/core/admin/adminController.js`
- **New:** `backend/src/api/adminRoutes.js`
- **Modified:** `backend/src/server.js` (added admin routes)

### Frontend
- **New:** `frontend/src/screens/admin/AdminDashboardScreen.js`
- **Modified:** `frontend/src/services/api.js` (added adminAPI)
- **Modified:** `frontend/src/navigation/AppNavigator.js` (added Admin tab)

---

## API Summary

**Total Endpoints:** 34 (up from 29)

New Admin Endpoints:
- GET `/api/admin/users` - List all users
- GET `/api/admin/users/:userId` - Get user details
- PUT `/api/admin/users/:userId/role` - Update user role
- DELETE `/api/admin/users/:userId` - Delete user
- GET `/api/admin/stats` - System statistics

---

## Permissions Matrix

| Action | Player | TO | Admin |
|--------|--------|-----|-------|
| View own stats | ✅ | ✅ | ✅ |
| View other player stats | ✅ | ✅ | ✅ |
| View system stats | ❌ | ❌ | ✅ |
| List all users | ❌ | ❌ | ✅ |
| Update user roles | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Access Admin Dashboard | ❌ | ❌ | ✅ |

---

## Support

For issues or questions:
- Check API logs for detailed error messages
- Verify JWT token is valid
- Ensure user has admin role in database
- Check network connectivity between frontend and backend

---

**Status:** All admin features implemented and ready for testing ✅
**Version:** 1.0.0
**Last Updated:** October 25, 2025
