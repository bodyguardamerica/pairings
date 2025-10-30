# Test Accounts Documentation

This file contains all test account credentials and tournament data for development and testing purposes.

**⚠️ IMPORTANT:** These accounts are for **testing only**. Never use these credentials in production.

---

## Test Accounts

All test accounts use the same password for easy testing:

**Password:** `password123`

### Admin Account

| Field | Value |
|-------|-------|
| **Email** | admin@test.com |
| **Username** | admin_test |
| **Role** | admin |
| **First Name** | Admin |
| **Last Name** | User |
| **Password** | password123 |

**Permissions:**
- Full administrative access
- Can create and manage tournaments
- Can manage all users
- Access to admin dashboard

---

### Player Accounts

| # | Email | Username | Role | First Name | Last Name | Password |
|---|-------|----------|------|------------|-----------|----------|
| 1 | player1@test.com | player1 | player | Alice | Johnson | password123 |
| 2 | player2@test.com | player2 | player | Bob | Smith | password123 |
| 3 | player3@test.com | player3 | player | Charlie | Brown | password123 |
| 4 | player4@test.com | player4 | player | Diana | Wilson | password123 |
| 5 | player5@test.com | player5 | player | Eve | Davis | password123 |
| 6 | player6@test.com | player6 | player | Frank | Miller | password123 |
| 7 | player7@test.com | player7 | player | Grace | Lee | password123 |
| 8 | player8@test.com | player8 | player | Henry | Taylor | password123 |

---

## Test Tournament

### Tournament Details

| Field | Value |
|-------|-------|
| **Name** | Test Tournament - Multi Round |
| **Organizer** | admin@test.com (admin_test) |
| **Game System** | warmachine |
| **Format** | Swiss |
| **Status** | active |
| **Location** | Test Convention Center |
| **Start Date** | 2025-11-15 10:00:00 |
| **Max Players** | 16 |
| **Total Rounds** | 5 |
| **Current Round** | 3 (completed) |

**Description:** A comprehensive test tournament with multiple rounds for testing all features

---

### Registered Players & Factions

| Player | Username | Faction | List Name |
|--------|----------|---------|-----------|
| Alice Johnson | player1 | Khador | Khador Test List |
| Bob Smith | player2 | Cygnar | Cygnar Test List |
| Charlie Brown | player3 | Cryx | Cryx Test List |
| Diana Wilson | player4 | Protectorate | Protectorate Test List |
| Eve Davis | player5 | Retribution | Retribution Test List |
| Frank Miller | player6 | Mercenaries | Mercenaries Test List |
| Grace Lee | player7 | Trollbloods | Trollbloods Test List |
| Henry Taylor | player8 | Circle | Circle Test List |

---

### Round 1 Results

| Table | Player 1 | Player 2 | Winner | P1 CP | P2 CP | P1 AP | P2 AP |
|-------|----------|----------|--------|-------|-------|-------|-------|
| 1 | player1 (Khador) | player2 (Cygnar) | player1 | 5 | 2 | 45 | 23 |
| 2 | player3 (Cryx) | player4 (Protectorate) | player3 | 5 | 1 | 48 | 19 |
| 3 | player5 (Retribution) | player6 (Mercenaries) | player6 | 3 | 5 | 35 | 50 |
| 4 | player7 (Trollbloods) | player8 (Circle) | player7 | 5 | 4 | 47 | 42 |

**Status:** Completed

---

### Round 2 Results

| Table | Player 1 | Player 2 | Winner | P1 CP | P2 CP | P1 AP | P2 AP |
|-------|----------|----------|--------|-------|-------|-------|-------|
| 1 | player1 (Khador) | player3 (Cryx) | player1 | 5 | 3 | 49 | 38 |
| 2 | player6 (Mercenaries) | player7 (Trollbloods) | player6 | 5 | 2 | 46 | 28 |
| 3 | player2 (Cygnar) | player4 (Protectorate) | player2 | 5 | 4 | 48 | 45 |
| 4 | player5 (Retribution) | player8 (Circle) | player8 | 2 | 5 | 25 | 50 |

**Status:** Completed

**Pairing Strategy:** Winners vs Winners, Losers vs Losers (Swiss format)

---

### Round 3 Results

| Table | Player 1 | Player 2 | Winner | P1 CP | P2 CP | P1 AP | P2 AP |
|-------|----------|----------|--------|-------|-------|-------|-------|
| 1 | player1 (Khador) | player6 (Mercenaries) | player6 | 4 | 5 | 41 | 50 |
| 2 | player3 (Cryx) | player2 (Cygnar) | player3 | 5 | 3 | 47 | 36 |
| 3 | player7 (Trollbloods) | player8 (Circle) | player8 | 3 | 5 | 32 | 48 |
| 4 | player4 (Protectorate) | player5 (Retribution) | player4 | 5 | 4 | 46 | 44 |

**Status:** Completed

---

### Current Standings (After 3 Rounds)

| Rank | Player | Faction | Record | Control Points | Army Points |
|------|--------|---------|--------|----------------|-------------|
| 1 | player6 (Frank) | Mercenaries | 3-0 | 15 | 146 |
| 2 | player8 (Henry) | Circle | 2-1 | 14 | 140 |
| 3 | player1 (Alice) | Khador | 2-1 | 14 | 135 |
| 4 | player3 (Charlie) | Cryx | 2-1 | 13 | 133 |
| 5 | player4 (Diana) | Protectorate | 1-2 | 10 | 110 |
| 6 | player7 (Grace) | Trollbloods | 1-2 | 10 | 107 |
| 7 | player2 (Bob) | Cygnar | 1-2 | 10 | 107 |
| 8 | player5 (Eve) | Retribution | 0-3 | 9 | 104 |

**Tiebreakers:**
1. Win/Loss Record
2. Total Control Points
3. Total Army Points

---

## Testing Scenarios

### Login Testing
1. **Admin Login:** Use admin@test.com / password123 to test administrative functions
2. **Player Login:** Use any player1-8@test.com / password123 to test player features

### Tournament Testing
- The test tournament has 3 completed rounds with realistic match data
- Players have varying records (3-0 down to 0-3) for standings testing
- All matches include control points and army points for scoring verification

### Features to Test
- [x] User registration and login
- [x] Tournament creation (admin)
- [x] Player registration for tournaments
- [x] Round creation and management
- [x] Match result submission
- [x] Standings calculation
- [ ] Round 4 & 5 pairing generation
- [ ] Tournament completion workflow
- [ ] Player profile statistics
- [ ] Admin dashboard analytics

---

## Resetting Test Data

To regenerate the test tournament and accounts, run:

```bash
cd backend
node seed-test-tournament.js
```

**Note:** The script is idempotent - it will skip creating accounts that already exist and create a new tournament instance each time.

---

## Database Access

**Connection String:** Configured in `backend/.env`

**Supabase Dashboard:** Access your Supabase project dashboard for direct database inspection

---

## Quick Start Testing

1. **Login as Admin:**
   - Email: admin@test.com
   - Password: password123
   - Navigate to Admin Dashboard to see stats

2. **Login as Player:**
   - Email: player1@test.com (or any player 1-8)
   - Password: password123
   - View your tournament registrations and standings

3. **View Test Tournament:**
   - Tournament should appear in the events list
   - Click to view details, rounds, standings

---

Last Updated: 2025-10-30
Created by: seed-test-tournament.js script
