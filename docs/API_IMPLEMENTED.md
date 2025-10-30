# API SPECIFICATION - Pairings Project (IMPLEMENTED)

**Last Updated:** October 25, 2025
**API Version:** 2.0.0
**Status:** Phase 2 Complete - Full Tournament Operations
**Base URL:** `http://localhost:3000/api` (development)

---

## Overview

This document defines all **IMPLEMENTED** API endpoints. The API follows RESTful conventions and returns JSON responses.

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are JWT tokens with 7-day expiration, generated on login/register.

### Response Format

Responses return JSON with direct data (not wrapped in success/data envelope):

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": [ ... ]  // For validation errors
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account. New users default to 'player' role.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "player123",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation:**
- Email must be valid format
- Username: 3-50 characters, alphanumeric + underscore/hyphen only
- Password: min 8 characters, must contain uppercase, lowercase, and number
- firstName/lastName: optional, max 100 characters

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "player123",
    "role": "player",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-10-24T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "login": "player123",  // email or username
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "player123",
    "role": "player",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Get Profile

**GET** `/auth/profile`

Get current authenticated user's profile.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "player123",
    "role": "player",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null
  }
}
```

---

## Tournament Endpoints

### Create Tournament

**POST** `/tournaments`

Create a new tournament. Requires TO or Admin role.

**Auth Required:** Yes (TO or Admin only)

**Request Body:**
```json
{
  "name": "Winter Steamroller 2025",
  "gameSystem": "warmachine",
  "format": "Steamroller",
  "description": "Seasonal tournament",
  "location": "Local Game Store",
  "startDate": "2025-11-01T10:00:00Z",
  "endDate": "2025-11-01T18:00:00Z",
  "maxPlayers": 16,
  "totalRounds": 4,
  "settings": {}
}
```

**Response:** `201 Created`
```json
{
  "message": "Tournament created successfully",
  "tournament": {
    "id": "uuid",
    "name": "Winter Steamroller 2025",
    "gameSystem": "warmachine",
    "format": "Steamroller",
    "status": "draft",
    "currentRound": 0,
    "totalRounds": 4,
    "playerCount": 0,
    "organizer": {
      "id": "uuid",
      "username": "organizer"
    },
    "createdAt": "2025-10-24T...",
    "updatedAt": "2025-10-24T..."
  }
}
```

---

### Get Tournaments

**GET** `/tournaments`

Get list of tournaments with optional filters.

**Query Parameters:**
- `status` - Filter by status (draft, registration, active, completed, cancelled)
- `gameSystem` - Filter by game system
- `organizerId` - Filter by organizer
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "tournaments": [ {...tournament objects...} ],
  "count": 10,
  "limit": 50,
  "offset": 0
}
```

---

### Get Tournament by ID

**GET** `/tournaments/:id`

Get detailed tournament information.

**Response:** `200 OK`
```json
{
  "tournament": {
    "id": "uuid",
    "name": "Winter Steamroller 2025",
    "gameSystem": "warmachine",
    "format": "Steamroller",
    "description": "...",
    "location": "Local Game Store",
    "startDate": "2025-11-01T10:00:00Z",
    "endDate": null,
    "maxPlayers": 16,
    "currentRound": 1,
    "totalRounds": 4,
    "status": "active",
    "settings": {},
    "organizer": {
      "id": "uuid",
      "username": "organizer",
      "firstName": "Tournament",
      "lastName": "Organizer",
      "email": "to@example.com"
    },
    "playerCount": 8,
    "createdAt": "2025-10-24T...",
    "updatedAt": "2025-10-24T..."
  }
}
```

---

### Update Tournament

**PUT** `/tournaments/:id`

Update tournament details. Only organizer or admin can update.

**Auth Required:** Yes (Organizer or Admin)

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "description": "New description",
  "status": "active",
  "maxPlayers": 20
}
```

**Response:** `200 OK`

---

### Delete Tournament

**DELETE** `/tournaments/:id`

Delete a tournament. Only organizer or admin can delete.

**Auth Required:** Yes (Organizer or Admin)

**Response:** `200 OK`
```json
{
  "message": "Tournament deleted successfully"
}
```

---

## Player Registration Endpoints

### Register for Tournament

**POST** `/tournaments/:id/register`

Register current user for a tournament.

**Auth Required:** Yes

**Request Body:**
```json
{
  "listName": "My Awesome List",
  "faction": "Cygnar"
}
```

**Response:** `201 Created`
```json
{
  "message": "Player registered successfully",
  "registration": {
    "id": "uuid",
    "tournamentId": "uuid",
    "playerId": "uuid",
    "listName": "My Awesome List",
    "faction": "Cygnar",
    "dropped": false,
    "dropRound": null,
    "seedScore": 0,
    "registeredAt": "2025-10-24T..."
  }
}
```

---

### Get Tournament Players

**GET** `/tournaments/:id/players`

Get all players registered for a tournament.

**Response:** `200 OK`
```json
{
  "players": [
    {
      "id": "uuid",
      "tournamentId": "uuid",
      "playerId": "uuid",
      "username": "player1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "player1@example.com",
      "listName": "My List",
      "faction": "Cygnar",
      "dropped": false,
      "dropRound": null,
      "registeredAt": "2025-10-24T..."
    }
  ],
  "count": 8
}
```

---

### Drop Player from Tournament

**POST** `/tournaments/:tournamentId/players/:playerId/drop`

Drop a player from an active tournament. Can be done by organizer, admin, or the player themselves.

**Auth Required:** Yes (Organizer, Admin, or Self)

**Response:** `200 OK`
```json
{
  "message": "Player dropped from tournament",
  "playerId": "uuid",
  "dropRound": 2
}
```

---

### Unregister Player

**DELETE** `/tournaments/:tournamentId/players/:playerId`

Completely remove player registration (only before tournament starts).

**Auth Required:** Yes (Organizer, Admin, or Self)

**Response:** `200 OK`
```json
{
  "message": "Player unregistered from tournament"
}
```

---

### Update Player List

**PUT** `/tournaments/:tournamentId/players/:playerId`

Update player's list name or faction.

**Auth Required:** Yes (Player or Admin)

**Request Body:**
```json
{
  "listName": "Updated List",
  "faction": "Khador"
}
```

**Response:** `200 OK`

---

## Co-Organizer Endpoints

### Get Co-Organizers

**GET** `/tournaments/:id/co-organizers`

Get all co-organizers for a tournament with full user details.

**Auth Required:** No (Public)

**Response:** `200 OK`
```json
{
  "coOrganizers": [
    {
      "id": "uuid",
      "username": "bob",
      "firstName": "Bob",
      "lastName": "Baker",
      "email": "bob@example.com"
    }
  ],
  "count": 1
}
```

---

### Add Co-Organizer

**POST** `/tournaments/:id/co-organizers`

Add a user as co-organizer to share TO responsibilities. Only the main tournament organizer can add co-organizers.

**Auth Required:** Yes (Main Organizer or Admin only)

**Request Body:**
```json
{
  "userId": "uuid"
}
```

**Validation:**
- User must exist
- User cannot be the main organizer
- User cannot already be a co-organizer
- User should be a registered player (recommended but not enforced)

**Response:** `200 OK`
```json
{
  "message": "Co-organizer added successfully",
  "coOrganizer": {
    "id": "uuid",
    "username": "bob"
  }
}
```

**Errors:**
- `400 Bad Request` - User is main organizer or missing userId
- `404 Not Found` - User or tournament not found
- `409 Conflict` - User already a co-organizer
- `403 Forbidden` - Not main organizer

---

### Remove Co-Organizer

**DELETE** `/tournaments/:id/co-organizers/:userId`

Remove a co-organizer from a tournament. Only the main tournament organizer can remove co-organizers.

**Auth Required:** Yes (Main Organizer or Admin only)

**URL Parameters:**
- `id` - Tournament ID
- `userId` - User ID of co-organizer to remove

**Response:** `200 OK`
```json
{
  "message": "Co-organizer removed successfully"
}
```

**Errors:**
- `404 Not Found` - User is not a co-organizer or tournament not found
- `403 Forbidden` - Not main organizer

**Notes:**
- Co-organizers have full TO access except managing other co-organizers
- Permissions are granted/revoked immediately
- All TO operations check for main organizer OR co-organizer status

---

## Round & Pairing Endpoints

### Create Round

**POST** `/tournaments/:tournamentId/rounds`

Create a new round with Swiss pairings. Tournament must be 'active' status.

**Auth Required:** Yes (Organizer or Admin)

**Response:** `201 Created`
```json
{
  "message": "Round created successfully",
  "round": {
    "id": "uuid",
    "tournamentId": "uuid",
    "roundNumber": 1,
    "status": "active",
    "startedAt": "2025-10-24T..."
  },
  "matches": [
    {
      "id": "uuid",
      "roundId": "uuid",
      "tournamentId": "uuid",
      "tableNumber": 1,
      "player1": {
        "id": "uuid",
        "username": "player1",
        "faction": "Cygnar",
        "score": 0,
        "controlPoints": 0,
        "armyPoints": 0
      },
      "player2": {
        "id": "uuid",
        "username": "player2",
        "faction": "Khador",
        "score": 0,
        "controlPoints": 0,
        "armyPoints": 0
      },
      "winnerId": null,
      "status": "pending"
    }
  ]
}
```

---

### Get Round

**GET** `/tournaments/:tournamentId/rounds/:roundNumber`

Get round details with all matches.

**Response:** `200 OK`

---

### Delete Round

**DELETE** `/tournaments/:tournamentId/rounds/:roundNumber`

Delete the most recent round and all its matches. Can only delete latest round.

**Auth Required:** Yes (Organizer or Admin)

**Response:** `200 OK`
```json
{
  "message": "Round deleted successfully",
  "deletedRound": 2
}
```

---

## Match Endpoints

### Submit Match Result

**POST** `/tournaments/matches/:matchId/result`

Submit match result. Can be done by organizer, admin, or players in the match.

**Auth Required:** Yes (Organizer, Admin, or Player in match)

**Request Body (Warmachine):**
```json
{
  "winner_id": "uuid",
  "player1_control_points": 5,
  "player2_control_points": 2,
  "player1_army_points": 35,
  "player2_army_points": 15,
  "scenario": "Color Guard",
  "result_type": "scenario"
}
```

**Validation (Warmachine):**
- winner_id required (no draws)
- Control points: 0-10
- Army points: >= 0
- Scenario: Color Guard, Trench Warfare, Wolves at Our Heels, Payload, Two Fronts, Best Laid Plans
- Result type: scenario, assassination, timeout, concession

**Response:** `200 OK`
```json
{
  "message": "Match result submitted successfully",
  "match": {
    "id": "uuid",
    "player1": { "score": 1, "controlPoints": 5, "armyPoints": 35 },
    "player2": { "score": 0, "controlPoints": 2, "armyPoints": 15 },
    "winnerId": "uuid",
    "scenario": "Bunkers",
    "status": "completed"
  }
}
```

---

### Edit Match Result

**PUT** `/tournaments/matches/:matchId/result`

Edit a completed match result. Only organizer or admin.

**Auth Required:** Yes (Organizer or Admin only)

**Request Body:** Same as Submit Match Result

**Response:** `200 OK`

---

### Delete Match Result

**DELETE** `/tournaments/matches/:matchId/result`

Reset match to pending status. Only organizer or admin.

**Auth Required:** Yes (Organizer or Admin only)

**Response:** `200 OK`
```json
{
  "message": "Match result deleted, reset to pending"
}
```

---

## Standings Endpoint

### Get Tournament Standings

**GET** `/tournaments/:tournamentId/standings`

Get current tournament standings with game-specific tiebreakers.

**Response:** `200 OK`
```json
{
  "standings": [
    {
      "rank": 1,
      "playerId": "uuid",
      "playerName": "player1",
      "firstName": "John",
      "lastName": "Doe",
      "faction": "Cygnar",
      "listName": "My List",
      "record": "3-1",
      "tournamentPoints": 3,
      "strengthOfSchedule": 8,
      "controlPoints": 15,
      "armyPoints": 120,
      "opponentsSoS": 25
    }
  ]
}
```

**Warmachine Tiebreaker Order:**
1. Tournament Points (TP)
2. Strength of Schedule (SoS)
3. Control Points (CP)
4. Army Points (AP)
5. Opponent's Strength of Schedule (SoS2)

---

## Player Statistics Endpoint

### Get Player Statistics

**GET** `/tournaments/players/:playerId/statistics`

Get player's statistics across all tournaments.

**Response:** `200 OK`
```json
{
  "player": {
    "id": "uuid",
    "username": "player1",
    "firstName": "John",
    "lastName": "Doe"
  },
  "statistics": {
    "tournaments": {
      "played": 5,
      "completed": 3
    },
    "matches": {
      "total": 18,
      "wins": 12,
      "losses": 6,
      "byes": 0,
      "winRate": 66.7
    },
    "averages": {
      "controlPoints": "3.5",
      "armyPoints": "28.3"
    },
    "factions": [
      { "faction": "Cygnar", "times_played": "3" },
      { "faction": "Khador", "times_played": "2" }
    ],
    "recentTournaments": [
      {
        "id": "uuid",
        "name": "Winter Steamroller 2025",
        "start_date": "2025-11-01T...",
        "status": "completed",
        "faction": "Cygnar",
        "dropped": false
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Tournament must be active to create rounds"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied. Required role: to or admin"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Tournament not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "User with this email or username already exists"
}
```

### 422 Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

---

## Rate Limiting

- **Window:** 60 seconds
- **Max Requests:** 100 per window
- **Applies to:** All `/api/*` endpoints

**Rate Limit Response:** `429 Too Many Requests`
```json
{
  "error": "Too Many Requests",
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Summary

**Total Endpoints:** 26

- Authentication: 3
- Tournaments: 5
- Players: 4
- Co-Organizers: 3
- Rounds: 3
- Matches: 3
- Standings: 1
- Statistics: 1
- Health: 1 (`/health`)
- API Info: 1 (`/api`)

**Status:** All endpoints implemented and tested ✅

---

**Document Version:** 2.0
**Last Updated:** October 25, 2025
**Phase:** 2 Complete - Full Tournament Operations
