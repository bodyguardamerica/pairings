# PAIRINGS PROJECT - System Architecture

**Last Updated:** October 22, 2025  
**Project Coordinator:** Claude (Web)  
**Primary Developer:** User (with Claude assistance)

---

## Project Overview

**Name:** Universal Tournament Organizer (working title)  
**Primary Game Module:** Warmachine (first implementation)  
**Purpose:** Web and mobile app for organizing tabletop game tournaments with automated pairings, live standings, and player statistics tracking.

**Inspiration:** longshanks.org functionality

---

## Tech Stack

### Frontend
- **Framework:** React + React Native (Expo)
- **Deployment:** Vercel (free tier)
- **IDE:** VS Code

### Backend
- **Runtime:** Node.js + Express
- **Deployment Path:**
  - Dev: Localhost
  - Beta: Railway.app or Render.com (free tier)
  - Production: Hetzner VPS (~$6/month)

### Database
- **Type:** PostgreSQL
- **Hosting:**
  - Dev/Beta: Supabase (free tier)
  - Production: Self-hosted on Hetzner VPS
  
### Additional Services
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime / Socket.io
- **Push Notifications:** Firebase Cloud Messaging (free)
- **File Storage:** Cloudflare R2 or local disk

---

## System Architecture

### Modular Design Philosophy

The system has a **core** that handles universal tournament functions, with **game modules** that plug in for game-specific logic.

```
Core System
├── User Management (auth, profiles, accounts)
├── Tournament Framework (create, manage, register)
├── Statistics Engine (track performance over time)
├── Notification System (push alerts, email)
└── Admin Dashboard

Game Modules (pluggable)
├── Warmachine Module (FIRST)
│   ├── Pairing Algorithm (Swiss)
│   ├── Scoring Rules (Tournament Points + Tiebreakers)
│   ├── Deathclock System
│   ├── Formats (Steamroller 2025)
│   ├── Scenarios (6 official scenarios)
│   └── Army Lists
├── Magic: The Gathering Module (FUTURE)
├── Warhammer Module (FUTURE)
└── [Other games...]
```

---

## User Roles

### 1. Player
- Create account
- Register for tournaments
- Check-in to events
- View pairings and standings
- Report match results (if enabled)
- View personal statistics
- Receive push notifications

### 2. Tournament Organizer (TO)
- All Player permissions, plus:
- Create tournaments
- Manage registrations
- Run check-in process
- Generate pairings
- Manually adjust pairings/scores
- Issue penalties/warnings
- Manage drops and byes
- Publish results
- Access organizer dashboard

### 3. Admin
- All TO permissions, plus:
- Manage all users (ban, promote, demote)
- Manage all tournaments (edit, delete, override)
- View system analytics
- Manage game modules (enable/disable)
- Configure system settings
- Access logs and reports
- Moderate content

---

## Core Features

### User Management
- Account creation with email verification
- Profile management (name, photo, location, bio)
- Privacy settings
- Multi-role support (user can be player AND organizer)
- Account linking (merge duplicate accounts)

### Tournament Management
- Create event (select game module, format, date, location)
- Set registration parameters (max players, deadline, etc.)
- Pre-registration system
- Check-in functionality (day-of confirmation)
- Drop management (players leaving mid-tournament)
- Bye assignment (for odd player counts)

### Pairing System
- **Game-specific algorithms** (defined per module)
- Support for:
  - Swiss pairings
  - Single elimination
  - Double elimination
  - Round robin
  - Team tournaments
- Tiebreaker calculation
- Pairing history tracking (avoid rematches)

### Live Features
- Real-time pairing updates
- Live standings refresh
- Push notifications:
  - "Round X pairings posted - Table Y"
  - "Round starts in 5 minutes"
  - "Tournament results published"
- Round timers with warnings

### Statistics Tracking

**Per Player:**
- Overall win/loss record
- Record by game system
- Record by format
- Record by army/faction/deck
- Opponent quality metrics (strength of schedule)
- Tournament placements
- Head-to-head records vs specific opponents

**Leaderboards:**
- Global rankings (per game system)
- Regional rankings
- Seasonal rankings
- Format-specific rankings

### Admin Dashboard

**User Management:**
- Search/filter users
- View user profiles and stats
- Ban/suspend users
- Promote users to TO or Admin
- Merge duplicate accounts
- View user activity logs

**Tournament Management:**
- View all tournaments (past, current, upcoming)
- Edit/delete any tournament
- Override pairings or results
- Resolve disputes
- View tournament logs

**System Management:**
- Game module configuration
- System-wide settings
- Feature flags (enable/disable features)
- Notification templates
- Email configuration

**Analytics:**
- User growth metrics
- Tournament activity
- Popular game systems
- Geographic distribution
- Performance metrics

---

## Warmachine Module Specifications

**Status:** First module to be implemented  
**Format:** Steamroller 2025 (SR2025)
**Source Document:** WM-Steamroller-2025_USL_Printer-friendly.pdf

### Tournament Structure

**Pairing Algorithm:**
- **Round 1:** Random pairings
- **Subsequent Rounds:** Swiss system
  - Pair players with equal tournament points
  - If odd number in bracket, "pair down" to next bracket
  - No rematches allowed
  - Players should not pair down more than once

**Round Count by Player Number:**
```
8 or fewer    → 3 rounds
9-16          → 4 rounds
17-32         → 5 rounds
33-64         → 6 rounds
65-128        → 7 rounds
```

**Optional: Cut to Top X** (for 6+ round events)
- After threshold met, remaining rounds only for top X players

### Scoring System

**Tournament Points:**
- Win = 1 TP
- Loss/Tie = 0 TP
- Bye = 1 TP + 3 CP + (army points / 2, rounded up)

**Victory Conditions:**
1. **Assassination** - Opponent's Leader destroyed
2. **Scenario** - Control Point threshold (typically 3+ ahead)
3. **Deathclock** - Opponent runs out of time

**Tiebreakers (in order):**
1. Tournament Points (wins)
2. Strength of Schedule (sum of opponents' TP)
3. Control Points (CP)
4. Army Points (AP)

### Deathclock System

**Time Allocation:**
```
30 points → 20 min per player
50 points → 30 min per player
75 points → 50 min per player
100 points → 60 min per player
```

**Clock Rules:**
- Chess clock starts at deployment
- Active player runs their clock
- Clock switched when turn/phase ends
- TO can pause for rules disputes only
- Running out of time = immediate loss

### Scenarios

**6 Official Scenarios:**
1. Color Guard
2. Trench Warfare
3. Wolves at Our Heels
4. Payload
5. Two Fronts
6. Best Laid Plans

**Scenario Elements:**
- **Objectives:** 50mm and 40mm bases (secured for points)
- **Flags:** Terrain markers for scenario terrain
- **Caches:** 30mm bases (opponent scores these)
- **Kill Box:** Starting player's turn 2, Leader within 12" of edge = 2 VP penalty

**Victory Points:**
- Objective secured = 1 VP
- Cache scored = 2 VP
- Scenario terrain secured = varies by scenario

**Scenario Victory:** 3+ VP ahead of opponent (checked at end of opponent's turn)

**Game Length:** Fixed at 7 turns (end of 2nd player's 7th turn)

### Army Lists

**List Requirements:**
- 1-2 lists per player
- If 2 lists: different Leader models required
- Point total: Within 4 points of event limit
- Lists from Prime Arena only
- 5 command cards required

**List Selection:**
- Revealed simultaneously before game
- Cannot change after reveal
- Player relationships locked (attachments, battlegroups, etc.)

### Byes

**Bye Assignment:**
- Round 1: Random selection
- Subsequent rounds: Lowest tournament points
- Should not receive bye more than once
- Bye awards: 1 TP, 3 VP, half army points (rounded up)

### Special Rules

**Concession:**
- Winner receives: Win, 5 VP (or current if higher), 50% opponent army points destroyed
- Loser receives: Loss, 0 points all categories
- Can be deemed unsporting by TO

**Terrain:**
- 10-14 pieces per table recommended
- Minimum 4 line-of-sight blocking pieces
- At least 1 hazard terrain
- Quadrant placement method (detailed in rules)

### Data Tracking Requirements

**Per Match:**
- Opponent name
- List played
- Result (Win/Loss/Tie/Bye)
- Control Points (CP)
- Army Points (AP)
- Time remaining on clock (optional)
- Scenario played

**Per Player (Tournament-wide):**
- Total Tournament Points (TP)
- Total Control Points (CP)
- Total Army Points (AP)
- Strength of Schedule
- Opponents faced (prevent rematches)
- Number of times paired down
- Number of byes received

---

## Database Schema (High-Level)

### Core Tables

```sql
users
├── id (uuid, primary key)
├── email (unique)
├── username (unique)
├── display_name
├── avatar_url
├── role (enum: player, organizer, admin)
├── location
├── created_at
└── updated_at

tournaments
├── id (uuid, primary key)
├── name
├── game_system_id (references game_systems)
├── format_id
├── organizer_id (references users)
├── location
├── start_date
├── status (enum: registration, check-in, active, completed)
├── max_players
├── point_level (30, 50, 75, 100 for Warmachine)
├── settings (jsonb - module-specific config)
├── created_at
└── updated_at

tournament_entries
├── id (uuid, primary key)
├── tournament_id (references tournaments)
├── player_id (references users)
├── list_ids (array of list identifiers)
├── checked_in (boolean, default false)
├── dropped (boolean, default false)
├── drop_round (integer, nullable)
├── registration_timestamp
└── created_at

rounds
├── id (uuid, primary key)
├── tournament_id (references tournaments)
├── round_number (integer)
├── status (enum: pending, active, completed)
├── scenario_id (references scenarios, Warmachine-specific)
├── started_at
└── completed_at

matches
├── id (uuid, primary key)
├── round_id (references rounds)
├── player1_id (references tournament_entries)
├── player2_id (references tournament_entries, nullable for bye)
├── table_number
├── result (enum: player1_win, player2_win, draw, bye)
├── player1_score (victory points)
├── player2_score (victory points)
├── player1_army_destroyed (points)
├── player2_army_destroyed (points)
├── player1_time_remaining (seconds, nullable)
├── player2_time_remaining (seconds, nullable)
├── victory_condition (enum: assassination, scenario, deathclock, bye)
├── reported_at
└── reported_by (references users)

player_statistics
├── id (uuid, primary key)
├── player_id (references users)
├── game_system_id (references game_systems)
├── format_id
├── wins (integer)
├── losses (integer)
├── draws (integer)
├── total_victory_points (integer)
├── total_army_destroyed (integer)
├── tournaments_played (integer)
├── average_placement (decimal)
└── updated_at

game_systems
├── id (uuid, primary key)
├── name (e.g., "Warmachine")
├── active (boolean)
└── settings (jsonb)

formats
├── id (uuid, primary key)
├── game_system_id (references game_systems)
├── name (e.g., "Steamroller 2025")
├── active (boolean)
└── rules (jsonb)
```

### Game Module Tables (Warmachine Example)

```sql
warmachine_scenarios
├── id (uuid, primary key)
├── name (e.g., "Color Guard")
├── description (text)
├── victory_condition_details (jsonb)
└── scenario_elements (jsonb)

warmachine_armies
├── id (uuid, primary key)
├── tournament_entry_id (references tournament_entries)
├── list_number (1 or 2)
├── faction
├── leader_name
├── army_list_json (jsonb - full list data)
└── points_total

warmachine_match_details
├── match_id (references matches, primary key)
├── scenario_id (references warmachine_scenarios)
├── player1_list_used (1 or 2)
├── player2_list_used (1 or 2)
├── terrain_setup (jsonb, optional)
└── special_notes (text, nullable)
```

---

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `GET /api/users/:id/stats`
- `GET /api/users/:id/tournaments`

### Tournaments
- `GET /api/tournaments` (list/search)
- `POST /api/tournaments` (create)
- `GET /api/tournaments/:id`
- `PUT /api/tournaments/:id`
- `DELETE /api/tournaments/:id`
- `POST /api/tournaments/:id/register`
- `POST /api/tournaments/:id/checkin`
- `POST /api/tournaments/:id/drop`
- `GET /api/tournaments/:id/standings`
- `GET /api/tournaments/:id/players`

### Rounds & Pairings
- `POST /api/tournaments/:id/rounds` (generate next round)
- `GET /api/tournaments/:id/rounds/:round_number/pairings`
- `GET /api/rounds/:id/pairings`
- `POST /api/matches/:id/result`
- `PUT /api/matches/:id` (edit result - TO only)

### Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/tournaments`
- `GET /api/admin/analytics`
- `GET /api/admin/logs`

### Game Modules
- `GET /api/modules` (list available modules)
- `GET /api/modules/:game_system/formats`
- `GET /api/modules/:game_system/scenarios`

---

## Deployment Strategy

### Phase 1: Local Development ($0)
- Frontend: localhost:19006 (Expo)
- Backend: localhost:3000
- Database: Supabase free tier

### Phase 2: Beta Testing ($0-5)
- Frontend: Vercel
- Backend: Railway.app (free)
- Database: Supabase free tier

### Phase 3: Production (~$10/month)
- Frontend: Vercel (free)
- Backend + DB: Hetzner VPS CX21
- Domain: ~$10/year

### Phase 4: Scale ($30-100/month)
- Option A: Larger Hetzner VPS
- Option B: Managed services (Supabase Pro + Railway)

---

## File Structure

```
pairings-project/
├── docs/
│   ├── ARCHITECTURE.md (this document)
│   ├── DATABASE.md
│   ├── API.md
│   ├── WARMACHINE.md
│   ├── DEPLOYMENT.md
│   └── ROADMAP.md
│
├── backend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── tournaments/
│   │   │   ├── statistics/
│   │   │   └── notifications/
│   │   ├── modules/
│   │   │   └── warmachine/
│   │   │       ├── pairing.js
│   │   │       ├── scoring.js
│   │   │       ├── tiebreakers.js
│   │   │       ├── scenarios.js
│   │   │       └── models/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── database/
│   │   └── migrations/
│   ├── tests/
│   ├── .env.example
│   ├── .env.local
│   ├── .env.production
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   ├── context/
│   │   │   └── utils/
│   │   ├── modules/
│   │   │   └── warmachine/
│   │   │       ├── components/
│   │   │       └── screens/
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── tournaments/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── assets/
│   ├── app.json
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Development Workflow

### For Detailed Feature Implementation

When asking another Claude instance to implement a specific feature:

1. **Reference this document**: "See ARCHITECTURE.md in the Pairings Project"
2. **Specify the component**: "Working on the Warmachine pairing algorithm"
3. **Provide context**: Link to specific sections (Database Schema, API Endpoints, etc.)
4. **Share relevant files**: Current code state if modifying existing features

### Task Delegation Examples

**To Claude for VS Code:**
- "Implement the Swiss pairing algorithm for Warmachine (see ARCHITECTURE.md Warmachine section)"
- "Create the tournament standings component (see frontend/screens/tournaments)"
- "Build the Deathclock timer component based on specs in ARCHITECTURE.md"

**Back to Project Coordinator (me):**
- "The pairing algorithm is complex - need architectural review"
- "Should we add this feature? How does it fit the roadmap?"
- "Need to design the admin analytics dashboard"

---

## Current Status

**Completed:**
- ✅ Tech stack selected
- ✅ Architecture designed
- ✅ User roles defined
- ✅ Core features planned
- ✅ Deployment strategy outlined
- ✅ Warmachine Steamroller 2025 rules analyzed
- ✅ Warmachine pairing algorithm specified
- ✅ Scoring and tiebreaker system defined

**In Progress:**
- 🔄 Creating detailed database schema
- 🔄 Setting up project structure

**Next Steps:**
1. Create detailed database schema (DATABASE.md)
2. Set up initial project files
3. Create API specification (API.md)
4. Build Swiss pairing algorithm for Warmachine
5. Implement Deathclock system
6. Implement user authentication
7. Create tournament management system

---

## Questions & Decisions Needed

1. **Tournament naming convention** - how should we handle duplicate tournament names?
2. **Result reporting** - should players report their own results, or only TOs?
3. **Privacy** - what player data should be public vs private by default?
4. **Dispute resolution** - how do we handle contested match results?
5. **Clock integration** - should we build a digital deathclock into the app, or assume external clocks?

---

## Notes for Future Claude Instances

- User has Claude Pro but found context between conversations unreliable - rely on docs
- User has limited dev experience - provide clear, detailed explanations
- Cost optimization is important - keep hosting cheap
- Scalability matters - design for 1000+ concurrent users, 100+ events
- Admin controls are critical - admins need full system access
- This is a modular system - keep game-specific logic separate from core
- Warmachine is the first and primary module - get this right before expanding

---

**Document Version:** 1.1  
**Last Updated:** October 22, 2025  
**Next Review:** After database schema completion
