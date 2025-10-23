# API SPECIFICATION - Pairings Project

**Last Updated:** October 22, 2025  
**API Version:** 1.0  
**Base URL:** `https://api.pairings-project.com/v1` (production)  
**Base URL:** `http://localhost:3000/api/v1` (development)

---

## Overview

This document defines all API endpoints for the Pairings Project. The API follows RESTful conventions and returns JSON responses.

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

**Authentication is provided by Supabase Auth.**

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource successfully created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate entry)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "player123",
  "password": "SecurePass123!",
  "display_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "player123",
      "display_name": "John Doe",
      "role": "player"
    },
    "token": "jwt-token"
  }
}
```

---

### Login

**POST** `/auth/login`

Authenticate user and receive token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "expires_at": "2025-10-23T12:00:00Z"
  }
}
```

---

### Logout

**POST** `/auth/logout`

**Auth Required:** Yes

Invalidate current session token.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### Get Current User

**GET** `/auth/me`

**Auth Required:** Yes

Get currently authenticated user's information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "player123",
    "display_name": "John Doe",
    "role": "player",
    "avatar_url": "https://...",
    "location": "Chicago, IL"
  }
}
```

---

## User Endpoints

### Get User Profile

**GET** `/users/:userId`

Get public user profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "player123",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "location": "Chicago, IL",
    "bio": "Warmachine player since 2020",
    "stats": {
      "warmachine": {
        "wins": 45,
        "losses": 23,
        "tournaments_played": 12
      }
    },
    "recent_tournaments": [...]
  }
}
```

---

### Update User Profile

**PUT** `/users/:userId`

**Auth Required:** Yes (own profile or admin)

Update user profile information.

**Request Body:**
```json
{
  "display_name": "Johnny Doe",
  "location": "New York, NY",
  "bio": "Updated bio",
  "avatar_url": "https://..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "display_name": "Johnny Doe",
    ...
  },
  "message": "Profile updated successfully"
}
```

---

### Get User Statistics

**GET** `/users/:userId/stats`

Get detailed player statistics.

**Query Parameters:**
- `game_system` (optional) - Filter by game system slug
- `format` (optional) - Filter by format slug

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overall": {
      "wins": 45,
      "losses": 23,
      "draws": 2,
      "win_percentage": 64.3
    },
    "by_game_system": {
      "warmachine": {
        "wins": 45,
        "losses": 23,
        "tournaments": 12,
        "avg_placement": 8.5,
        "best_placement": 1
      }
    },
    "recent_results": [...]
  }
}
```

---

### Get User Tournaments

**GET** `/users/:userId/tournaments`

Get tournaments user has participated in.

**Query Parameters:**
- `status` - `upcoming`, `in_progress`, `completed` (default: all)
- `game_system` - Filter by game system
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "tournaments": [
      {
        "id": "uuid",
        "name": "Monthly Steamroller",
        "game_system": "Warmachine",
        "format": "Steamroller 2025",
        "start_date": "2025-10-15T10:00:00Z",
        "status": "completed",
        "placement": 3,
        "record": "4-1-0"
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

## Tournament Endpoints

### List Tournaments

**GET** `/tournaments`

Get list of tournaments.

**Query Parameters:**
- `status` - Filter by status (`draft`, `registration`, `in_progress`, `completed`)
- `game_system` - Filter by game system slug
- `location` - Filter by location (partial match)
- `upcoming` - Boolean, show only future tournaments
- `public` - Boolean, show only public tournaments (default: true)
- `search` - Search in name and description
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "tournaments": [
      {
        "id": "uuid",
        "name": "Monthly Steamroller",
        "game_system": "Warmachine",
        "format": "Steamroller 2025",
        "point_level": 75,
        "location": "Chicago, IL",
        "venue_name": "Local Game Store",
        "start_date": "2025-11-15T10:00:00Z",
        "organizer": {
          "id": "uuid",
          "display_name": "TO Name"
        },
        "player_count": 24,
        "max_players": 32,
        "status": "registration"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

### Create Tournament

**POST** `/tournaments`

**Auth Required:** Yes (organizer or admin)

Create a new tournament.

**Request Body:**
```json
{
  "name": "Monthly Steamroller",
  "description": "Our monthly competitive event",
  "game_system_id": "uuid",
  "format_id": "uuid",
  "point_level": 75,
  "location": "Chicago, IL",
  "venue_name": "Local Game Store",
  "venue_address": "123 Main St, Chicago, IL 60601",
  "start_date": "2025-11-15T10:00:00Z",
  "registration_deadline": "2025-11-14T23:59:59Z",
  "max_players": 32,
  "min_players": 8,
  "public": true,
  "settings": {
    "scenario_selection": "random",
    "deathclock_enabled": true
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Monthly Steamroller",
    "status": "draft",
    ...
  },
  "message": "Tournament created successfully"
}
```

---

### Get Tournament Details

**GET** `/tournaments/:tournamentId`

Get detailed tournament information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Monthly Steamroller",
    "description": "...",
    "game_system": {
      "id": "uuid",
      "name": "Warmachine",
      "slug": "warmachine"
    },
    "format": {
      "id": "uuid",
      "name": "Steamroller 2025"
    },
    "point_level": 75,
    "organizer": {
      "id": "uuid",
      "display_name": "TO Name"
    },
    "location": "Chicago, IL",
    "venue_name": "Local Game Store",
    "start_date": "2025-11-15T10:00:00Z",
    "player_count": 24,
    "max_players": 32,
    "status": "registration",
    "registration_open": true,
    "rounds_count": 5,
    "current_round": null,
    "settings": {...}
  }
}
```

---

### Update Tournament

**PUT** `/tournaments/:tournamentId`

**Auth Required:** Yes (organizer or admin)

Update tournament details.

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Tournament Name",
  "description": "Updated description",
  "max_players": 40,
  "registration_deadline": "2025-11-14T20:00:00Z"
}
```

**Response:** `200 OK`

---

### Delete Tournament

**DELETE** `/tournaments/:tournamentId`

**Auth Required:** Yes (organizer or admin)

Delete a tournament (only if status is 'draft' or 'registration' with no players).

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tournament deleted successfully"
}
```

---

### Register for Tournament

**POST** `/tournaments/:tournamentId/register`

**Auth Required:** Yes

Register current user for tournament.

**Request Body:**
```json
{
  "list_data": {
    "list_1": {...},
    "list_2": {...}
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "entry_id": "uuid",
    "tournament_id": "uuid",
    "player_id": "uuid",
    "registration_timestamp": "2025-10-22T14:30:00Z"
  },
  "message": "Successfully registered for tournament"
}
```

---

### Unregister from Tournament

**DELETE** `/tournaments/:tournamentId/register`

**Auth Required:** Yes

Remove current user's registration from tournament.

**Response:** `200 OK`

---

### Check-In to Tournament

**POST** `/tournaments/:tournamentId/checkin`

**Auth Required:** Yes

Check in for tournament (confirms attendance).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "entry_id": "uuid",
    "checked_in": true,
    "check_in_timestamp": "2025-11-15T09:45:00Z"
  },
  "message": "Checked in successfully"
}
```

---

### Drop from Tournament

**POST** `/tournaments/:tournamentId/drop`

**Auth Required:** Yes

Drop from active tournament.

**Request Body:**
```json
{
  "reason": "Optional reason for dropping"
}
```

**Response:** `200 OK`

---

### Get Tournament Standings

**GET** `/tournaments/:tournamentId/standings`

Get current tournament standings.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "standings": [
      {
        "rank": 1,
        "player": {
          "id": "uuid",
          "display_name": "John Doe",
          "username": "player123"
        },
        "tournament_points": 5,
        "victory_points": 15,
        "army_points_destroyed": 375,
        "strength_of_schedule": 18,
        "record": "5-0-0",
        "dropped": false
      }
    ],
    "last_updated": "2025-11-15T14:30:00Z"
  }
}
```

---

### Get Tournament Players

**GET** `/tournaments/:tournamentId/players`

Get list of registered/checked-in players.

**Query Parameters:**
- `checked_in` - Filter by check-in status (boolean)
- `dropped` - Filter by dropped status (boolean)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "players": [
      {
        "entry_id": "uuid",
        "player": {
          "id": "uuid",
          "display_name": "John Doe",
          "username": "player123"
        },
        "checked_in": true,
        "dropped": false,
        "lists_submitted": true
      }
    ],
    "total": 24,
    "checked_in": 22,
    "dropped": 0
  }
}
```

---

## Round & Pairing Endpoints

### Generate Next Round

**POST** `/tournaments/:tournamentId/rounds`

**Auth Required:** Yes (organizer or admin)

Generate pairings for the next round.

**Request Body:**
```json
{
  "scenario_selection": "random",
  "time_limit_minutes": 60
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "round_id": "uuid",
    "round_number": 3,
    "scenario": {
      "id": "uuid",
      "name": "Color Guard"
    },
    "matches_count": 12,
    "bye_player": null
  },
  "message": "Round 3 pairings generated"
}
```

---

### Get Round Pairings

**GET** `/tournaments/:tournamentId/rounds/:roundNumber/pairings`

Get pairings for a specific round.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "round_id": "uuid",
    "round_number": 3,
    "status": "in_progress",
    "scenario": {
      "name": "Color Guard",
      "description": "..."
    },
    "pairings": [
      {
        "match_id": "uuid",
        "table_number": 1,
        "player1": {
          "entry_id": "uuid",
          "player": {
            "id": "uuid",
            "display_name": "John Doe"
          },
          "record": "2-0-0",
          "tournament_points": 2
        },
        "player2": {
          "entry_id": "uuid",
          "player": {
            "id": "uuid",
            "display_name": "Jane Smith"
          },
          "record": "2-0-0",
          "tournament_points": 2
        },
        "result": "in_progress"
      }
    ]
  }
}
```

---

### Get All Tournament Rounds

**GET** `/tournaments/:tournamentId/rounds`

Get all rounds for a tournament.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "rounds": [
      {
        "round_number": 1,
        "status": "completed",
        "scenario": "Trench Warfare",
        "completed_at": "2025-11-15T12:30:00Z"
      },
      {
        "round_number": 2,
        "status": "in_progress",
        "scenario": "Color Guard",
        "started_at": "2025-11-15T13:00:00Z"
      }
    ]
  }
}
```

---

### Report Match Result

**POST** `/matches/:matchId/result`

**Auth Required:** Yes (player in match, organizer, or admin)

Report the result of a match.

**Request Body:**
```json
{
  "result": "player1_win",
  "victory_condition": "scenario",
  "player1_victory_points": 5,
  "player2_victory_points": 2,
  "player1_army_destroyed": 45,
  "player2_army_destroyed": 75,
  "player1_time_remaining": 420,
  "player2_time_remaining": 180,
  "notes": "Optional match notes"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "match_id": "uuid",
    "result": "player1_win",
    "reported_at": "2025-11-15T14:30:00Z"
  },
  "message": "Match result recorded"
}
```

---

### Update Match Result

**PUT** `/matches/:matchId`

**Auth Required:** Yes (organizer or admin)

Edit an existing match result.

**Request Body:** (same as POST /matches/:matchId/result)

**Response:** `200 OK`

---

### Get Match Details

**GET** `/matches/:matchId`

Get detailed match information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "round_number": 3,
    "table_number": 5,
    "scenario": "Color Guard",
    "player1": {...},
    "player2": {...},
    "result": "player1_win",
    "victory_condition": "scenario",
    "player1_victory_points": 5,
    "player2_victory_points": 2,
    "player1_army_destroyed": 45,
    "player2_army_destroyed": 75,
    "completed_at": "2025-11-15T14:30:00Z"
  }
}
```

---

## Game Module Endpoints

### Get Game Systems

**GET** `/modules`

Get list of available game systems.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "game_systems": [
      {
        "id": "uuid",
        "name": "Warmachine",
        "slug": "warmachine",
        "active": true,
        "logo_url": "https://..."
      }
    ]
  }
}
```

---

### Get Formats for Game System

**GET** `/modules/:gameSystemSlug/formats`

Get available formats for a game system.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "formats": [
      {
        "id": "uuid",
        "name": "Steamroller 2025",
        "slug": "steamroller-2025",
        "point_levels": [30, 50, 75, 100]
      }
    ]
  }
}
```

---

### Get Scenarios (Warmachine)

**GET** `/modules/warmachine/scenarios`

Get list of Warmachine scenarios.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "scenarios": [
      {
        "id": "uuid",
        "name": "Color Guard",
        "dice_value": 1,
        "description": "..."
      }
    ]
  }
}
```

---

## Admin Endpoints

### Get All Users

**GET** `/admin/users`

**Auth Required:** Yes (admin only)

Get list of all users with admin capabilities.

**Query Parameters:**
- `role` - Filter by role
- `active` - Filter by active status
- `banned` - Filter by banned status
- `search` - Search username, email, display name
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "player123",
        "email": "user@example.com",
        "display_name": "John Doe",
        "role": "player",
        "active": true,
        "banned": false,
        "created_at": "2025-01-15T10:00:00Z",
        "last_login": "2025-10-22T09:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### Update User Role

**PUT** `/admin/users/:userId/role`

**Auth Required:** Yes (admin only)

Change a user's role.

**Request Body:**
```json
{
  "role": "organizer",
  "reason": "User requested TO privileges"
}
```

**Response:** `200 OK`

---

### Ban User

**POST** `/admin/users/:userId/ban`

**Auth Required:** Yes (admin only)

Ban a user from the platform.

**Request Body:**
```json
{
  "reason": "Repeated unsporting conduct",
  "duration_days": 30
}
```

**Response:** `200 OK`

---

### Unban User

**POST** `/admin/users/:userId/unban`

**Auth Required:** Yes (admin only)

Remove ban from user.

**Response:** `200 OK`

---

### Get All Tournaments (Admin)

**GET** `/admin/tournaments`

**Auth Required:** Yes (admin only)

Get all tournaments including drafts and private tournaments.

**Query Parameters:** (same as GET /tournaments plus additional filters)

**Response:** `200 OK`

---

### Get System Analytics

**GET** `/admin/analytics`

**Auth Required:** Yes (admin only)

Get system-wide analytics.

**Query Parameters:**
- `start_date` - Start of date range
- `end_date` - End of date range

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1247,
      "new_this_period": 58,
      "active_this_period": 432
    },
    "tournaments": {
      "total": 156,
      "completed_this_period": 23,
      "in_progress": 5,
      "upcoming": 12
    },
    "matches": {
      "total": 8942,
      "played_this_period": 456
    },
    "by_game_system": {
      "warmachine": {
        "tournaments": 156,
        "players": 847
      }
    }
  }
}
```

---

### Get Audit Logs

**GET** `/admin/logs`

**Auth Required:** Yes (admin only)

Get system audit logs.

**Query Parameters:**
- `actor_id` - Filter by user who performed action
- `entity_type` - Filter by entity type
- `entity_id` - Filter by specific entity
- `start_date` - Filter by date range
- `end_date` - Filter by date range
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "actor": {
          "id": "uuid",
          "display_name": "Admin User"
        },
        "action": "user.ban",
        "entity_type": "user",
        "entity_id": "uuid",
        "changes": {...},
        "reason": "Unsporting conduct",
        "created_at": "2025-10-22T14:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

## Notifications Endpoints

### Get User Notifications

**GET** `/notifications`

**Auth Required:** Yes

Get current user's notifications.

**Query Parameters:**
- `unread` - Filter to unread only (boolean)
- `type` - Filter by notification type
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "pairing_posted",
        "title": "Round 3 Pairings Posted",
        "message": "You are paired at Table 5",
        "tournament": {
          "id": "uuid",
          "name": "Monthly Steamroller"
        },
        "read": false,
        "created_at": "2025-10-22T13:00:00Z"
      }
    ],
    "unread_count": 3
  }
}
```

---

### Mark Notification as Read

**PUT** `/notifications/:notificationId/read`

**Auth Required:** Yes

Mark a notification as read.

**Response:** `200 OK`

---

### Mark All Notifications as Read

**PUT** `/notifications/read-all`

**Auth Required:** Yes

Mark all user's notifications as read.

**Response:** `200 OK`

---

## Webhooks (Future)

### Tournament Events

Tournament organizers can register webhooks for events:
- `tournament.registration_opened`
- `tournament.registration_closed`
- `tournament.started`
- `tournament.round_generated`
- `tournament.completed`
- `match.result_reported`

---

## Rate Limiting

**Default Limits:**
- Authenticated users: 100 requests per minute
- Unauthenticated users: 20 requests per minute
- Admin endpoints: 200 requests per minute

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

---

## Error Codes

### Authentication Errors
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Token invalid
- `AUTH_004` - Insufficient permissions

### Validation Errors
- `VAL_001` - Missing required field
- `VAL_002` - Invalid format
- `VAL_003` - Value out of range
- `VAL_004` - Duplicate entry

### Tournament Errors
- `TOURN_001` - Tournament not found
- `TOURN_002` - Registration closed
- `TOURN_003` - Tournament full
- `TOURN_004` - Already registered
- `TOURN_005` - Cannot modify active tournament
- `TOURN_006` - Round generation failed

### Match Errors
- `MATCH_001` - Match not found
- `MATCH_002` - Invalid result
- `MATCH_003` - Match already reported
- `MATCH_004` - Not authorized to report

---

## Notes for Implementation

1. **All timestamps** should be in ISO 8601 format with timezone (UTC)
2. **UUIDs** should be used for all resource identifiers
3. **Pagination** should be consistent across all list endpoints
4. **Filters** should use query parameters, not request body
5. **Sorting** should support multiple fields: `?sort=tournament_points:desc,victory_points:desc`
6. **Include related data** using `?include=organizer,format,game_system`
7. **Field selection** using `?fields=id,name,status`
8. **Real-time updates** via WebSocket for live tournament data

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** After backend implementation begins
