# Frontend Requirements - Pairings Project

**For:** Web-based Claude (UI/UX Design)
**Project:** Universal Tournament Organizer
**Primary Use Case:** Warmachine Steamroller 2025 Tournaments
**Platform:** React Native (Expo) - Mobile First, Web Compatible

---

## Project Context

### What Is This?
A mobile-first tournament management app for tabletop gaming tournaments. Tournament Organizers (TOs) can create tournaments, manage players, generate pairings, and track live standings. Players can register, view pairings, submit match results, and see standings.

### Primary Users
1. **Tournament Organizers (TOs)** - Create/manage tournaments
2. **Players** - Register, play, submit results, view standings
3. **Spectators** - View tournaments and standings (public)

### Key Use Case Flow
1. TO creates tournament on their phone
2. Players register at the venue
3. TO starts tournament, app generates Round 1 pairings
4. Players see their pairing, table number, opponent
5. After match, either player or TO submits result
6. Standings update automatically
7. TO creates next round, app pairs by record (Swiss)
8. Repeat until tournament complete

---

## Technical Stack

### Recommended
- **React Native (Expo)** - One codebase for iOS/Android/Web
- **React Navigation** - Screen navigation
- **Axios** - API calls to backend
- **AsyncStorage** - Token storage
- **React Query** or **SWR** - Data fetching/caching

### API
- **Base URL:** `http://localhost:3000/api` (development)
- **Authentication:** JWT Bearer tokens
- **Format:** JSON requests/responses
- **Full API Docs:** See `/docs/API_IMPLEMENTED.md`

---

## Required Screens

### Authentication Flow

#### 1. Login Screen
**Purpose:** User authentication

**Elements:**
- Email/Username input
- Password input (masked)
- "Login" button
- "Register" link
- "Forgot Password" link (future)
- Error message display

**API:** POST `/api/auth/login`

**Success:** Store JWT token, navigate to Home

---

#### 2. Register Screen
**Purpose:** New user registration

**Elements:**
- Email input
- Username input
- Password input (with strength indicator)
- First Name input
- Last Name input
- "Register" button
- "Already have account? Login" link
- Validation error display

**API:** POST `/api/auth/register`

**Validation:**
- Email format
- Username: 3-50 chars, alphanumeric
- Password: 8+ chars, uppercase, lowercase, number

---

### Main Navigation (After Login)

Bottom Tab Navigation:
1. **Home** (Tournaments list)
2. **My Tournaments** (Registered tournaments)
3. **Profile** (User profile)

---

### Home Screen (Tournament List)

#### 3. Tournaments List
**Purpose:** Browse available tournaments

**Elements:**
- Search bar
- Filter chips: Status (Draft, Registration, Active, Completed)
- Tournament cards showing:
  - Tournament name
  - Game system badge (Warmachine logo/icon)
  - Location
  - Date/Time
  - Status badge
  - Player count (8/16)
  - Organizer name
- "Create Tournament" FAB (if user is TO/Admin)
- Pull to refresh
- Empty state: "No tournaments yet"

**API:** GET `/api/tournaments?status=...&gameSystem=...`

**Actions:**
- Tap card → Tournament Details
- Tap FAB → Create Tournament (TO only)

---

### Tournament Details

#### 4. Tournament Details Screen
**Purpose:** View tournament information and register

**Tabs:**
- **Info** - Tournament details
- **Players** - Registered players list
- **Standings** - Live standings (if active)
- **Rounds** - Round by round results (if started)

**Info Tab Elements:**
- Tournament name (header)
- Status badge
- Game system icon
- Format (Steamroller)
- Location (with map icon)
- Date/Time
- Max players (16) - Current (8)
- Progress bar
- Description
- Organizer info (name, avatar)
- "Register" button (if not registered & status = registration)
- "Unregister" button (if registered & not started)
- "View My Registration" (if registered)

**Actions:**
- Register → Show list submission form
- Edit Tournament (if organizer)
- Delete Tournament (if organizer, confirm dialog)

---

#### 5. Player List Tab
**Purpose:** See who's registered

**Elements:**
- Search bar
- Player list items:
  - Player name
  - Faction (with icon)
  - List name
  - Registration timestamp
  - Drop indicator (if dropped)
- Player count badge
- "Export List" button (organizer)

**API:** GET `/api/tournaments/:id/players`

---

#### 6. Standings Tab
**Purpose:** Live tournament rankings

**Elements:**
- Refresh button
- Last updated timestamp
- Standings table:
  - Rank (#1, #2, etc)
  - Player name
  - Faction icon
  - Record (W-L, e.g., 3-1)
  - TP (Tournament Points)
  - SoS (Strength of Schedule)
  - CP (Control Points)
  - AP (Army Points)
- Highlighted row if current user
- Tiebreaker explanation (info icon)
- "Export Standings" (organizer)

**API:** GET `/api/tournaments/:id/standings`

**Visual:**
- Top 3 get medals/colors (gold, silver, bronze)
- Current user row highlighted in blue
- Dropped players greyed out

---

#### 7. Rounds Tab
**Purpose:** View all rounds and matches

**Elements:**
- Round selector (Round 1, Round 2, etc)
- Current round highlighted
- For each round:
  - Round status badge (Pending, Active, Completed)
  - "Create Round" button (if organizer & previous round complete)
  - Match list:
    - Table number
    - Player 1 name, faction, score, CP, AP
    - VS
    - Player 2 name, faction, score, CP, AP
    - Winner indicator
    - Match status (Pending, Active, Completed)
    - "Submit Result" button (if pending)
    - "Edit Result" button (if organizer)

**API:** GET `/api/tournaments/:id/rounds/:roundNumber`

---

### Registration Flow

#### 8. Register for Tournament Screen
**Purpose:** Submit tournament registration

**Elements:**
- Tournament name (header)
- "Choose Your Faction" dropdown
  - Cygnar
  - Khador
  - Protectorate of Menoth
  - Cryx
  - Retribution of Scyrah
  - Convergence of Cyriss
  - Mercenaries
  - (Others...)
- "List Name" input (optional)
- "Register" button
- "Cancel" button

**API:** POST `/api/tournaments/:id/register`

**Success:** Navigate back, show "Registered!" toast

---

### Match Result Submission

#### 9. Submit Match Result Screen
**Purpose:** Record match outcome (Warmachine specific)

**Elements:**
- Match info header:
  - Table number
  - Player 1 vs Player 2
  - Factions
- "Who Won?" selector
  - Player 1 button
  - Player 2 button
- Scenario dropdown:
  - Color Guard
  - Trench Warfare
  - Wolves at Our Heels
  - Payload
  - Two Fronts
  - Best Laid Plans
- "How did they win?" radio buttons:
  - Scenario (CP)
  - Assassination
  - Timeout (Deathclock)
  - Concession
- Scoring section:
  - Player 1 Control Points (0-10 slider/stepper)
  - Player 2 Control Points (0-10 slider/stepper)
  - Player 1 Army Points Destroyed (number input)
  - Player 2 Army Points Destroyed (number input)
- "Submit Result" button
- "Cancel" button
- Validation errors display

**API:** POST `/api/tournaments/matches/:matchId/result`

**Validation:**
- Winner required
- CP 0-10
- AP >= 0
- Scenario required

**Success:** Navigate back, show "Result submitted!" toast

---

### Tournament Creation (TO Only)

#### 10. Create Tournament Screen
**Purpose:** TO creates new tournament

**Elements:**
- "Tournament Details" header
- Name input
- Game System selector (Warmachine selected)
- Format input (default: Steamroller)
- Location input (with location picker icon)
- Start Date/Time picker
- End Date/Time picker (optional)
- Max Players stepper (2-256, default 16)
- Total Rounds stepper (1-10, default: Swiss calc)
- Description textarea
- "Create Tournament" button
- "Cancel" button

**API:** POST `/api/tournaments`

**Success:** Navigate to tournament details, show "Tournament created!" toast

---

### Round Management (TO Only)

#### 11. Create Round Confirmation
**Purpose:** Confirm round creation with pairing preview

**Elements:**
- "Round X Pairings" header
- Player count badge (8 active players)
- Pairing preview list:
  - Table 1: Player A vs Player B
  - Table 2: Player C vs Player D
  - (etc)
- Warning if odd players: "Player X will receive a BYE"
- "Create Round" button
- "Cancel" button

**API:** POST `/api/tournaments/:id/rounds`

**Success:** Navigate to round view, matches appear

---

### Profile

#### 12. Profile Screen
**Purpose:** User profile and stats

**Elements:**
- Avatar (placeholder or uploaded image)
- Username
- Role badge (Player, TO, Admin)
- Email
- Statistics section:
  - Tournaments Played
  - Win Rate (%)
  - Favorite Faction (with icon)
  - Total Matches
- "Edit Profile" button
- "Logout" button
- "Settings" (future)

**API:** GET `/api/auth/profile`

---

### Player Statistics

#### 13. Player Statistics Screen
**Purpose:** Detailed player stats across all tournaments

**Elements:**
- Player name (header)
- Overall Stats Card:
  - Tournaments Played / Completed
  - Total Matches
  - Win/Loss Record
  - Win Rate %
- Averages Card:
  - Avg Control Points
  - Avg Army Points Destroyed
- Faction Usage Chart:
  - Bar chart or pie chart
  - Faction name + times played
- Recent Tournaments List:
  - Tournament name
  - Date
  - Faction played
  - Result (Dropped, Completed)

**API:** GET `/api/tournaments/players/:playerId/statistics`

---

## Design Guidelines

### Visual Style
**Theme:** Modern, Clean, Gaming-Friendly

**Colors:**
- **Primary:** Deep Blue (#2563EB) - Trust, professional
- **Secondary:** Orange/Gold (#F59E0B) - Energy, competitive
- **Success:** Green (#10B981) - Wins, completed
- **Danger:** Red (#EF4444) - Losses, dropped
- **Background:** White/Light Grey (#F9FAFB)
- **Text:** Dark Grey (#1F2937)

**Typography:**
- **Headers:** Bold, Sans-serif
- **Body:** Regular, Sans-serif (Inter, Roboto)
- **Numbers/Stats:** Monospace for alignment

### UI Components

**Cards:**
- Rounded corners (8-12px)
- Subtle shadow
- Padding: 16px
- White background

**Buttons:**
- Primary: Filled with primary color
- Secondary: Outlined
- Danger: Red filled
- Rounded (6-8px)
- Clear labels

**Status Badges:**
- Draft: Grey
- Registration: Blue
- Active: Green
- Completed: Gold
- Cancelled: Red

**Faction Icons:**
- Use consistent icon style
- Color-coded per faction
- Small (24x24) next to names
- Large (48x48) in details

### Mobile-First Considerations

**Touch Targets:**
- Minimum 44x44px tap area
- Adequate spacing between tappable elements

**Navigation:**
- Bottom tab bar for main sections
- Stack navigation for details
- Back button always visible in header

**Forms:**
- Large input fields
- Clear labels above inputs
- Inline validation
- Error messages below fields
- Native keyboard types (email, number, etc.)

**Lists:**
- Pull to refresh
- Infinite scroll or pagination
- Empty states with helpful message
- Loading skeletons

**Responsiveness:**
- Works on phones (primary)
- Works on tablets
- Works on web (bonus)

---

## User Flows

### Player Journey
1. Open app → Login
2. Home → Browse tournaments
3. Tap tournament → View details
4. Register → Submit faction/list
5. Wait for tournament start
6. Rounds tab → See pairing
7. Play match
8. Submit result → Enter scores
9. Standings tab → See ranking
10. Repeat for next rounds

### TO Journey
1. Open app → Login
2. Create Tournament → Fill details
3. Wait for registrations
4. Players list → Review registrations
5. Start tournament (change status to Active)
6. Create Round → Automatic pairings
7. Monitor matches
8. Create next round
9. View final standings
10. Complete tournament

---

## API Integration Notes

### Authentication
```javascript
// Store token after login
await AsyncStorage.setItem('authToken', token);

// Include in requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Error Handling
```javascript
// 401 Unauthorized → Logout, go to login
// 403 Forbidden → Show "Access Denied" message
// 404 Not Found → Show "Not Found" message
// 500 Server Error → Show "Something went wrong, try again"
```

### Real-time Updates
Consider polling or websockets for:
- Live standings
- New round creation
- Match result submissions

---

## Mockup Priorities

### Phase 1 (Essential Screens)
1. Login
2. Register
3. Tournaments List
4. Tournament Details (Info tab)
5. Player List (Players tab)
6. Standings (Standings tab)
7. Submit Match Result

### Phase 2 (Important)
8. Create Tournament (TO)
9. Round View (Rounds tab)
10. Profile
11. Register for Tournament

### Phase 3 (Nice to Have)
12. Player Statistics
13. Edit Tournament
14. Edit Match Result

---

## Sample Data for Mockups

### Tournament Example
```json
{
  "name": "Winter Steamroller 2025",
  "gameSystem": "warmachine",
  "format": "Steamroller",
  "location": "Dragon's Lair Comics & Games",
  "startDate": "2025-11-15T10:00:00Z",
  "maxPlayers": 16,
  "currentPlayers": 12,
  "status": "registration",
  "organizer": "JohnTO"
}
```

### Player Example
```json
{
  "username": "SteelCommander",
  "faction": "Cygnar",
  "listName": "Storm Division",
  "rank": 3,
  "record": "2-1",
  "tournamentPoints": 2,
  "controlPoints": 12,
  "armyPoints": 85
}
```

### Match Example
```json
{
  "table": 1,
  "player1": "SteelCommander (Cygnar)",
  "player2": "IronFist (Khador)",
  "scenario": "Bunkers",
  "status": "pending"
}
```

---

## Questions for Design Decisions

1. **Color Scheme:** Does the blue/orange work, or prefer different?
2. **Faction Icons:** Create custom or use existing Warmachine faction symbols?
3. **Tournament Cards:** Horizontal or vertical layout?
4. **Standings Table:** Scrollable table or simplified cards?
5. **Match Result Form:** All on one screen or wizard-style?
6. **Dark Mode:** Include or just light mode for MVP?

---

## Success Criteria

✅ **Intuitive:** TOs can create tournament in under 2 minutes
✅ **Fast:** Players can submit results in under 30 seconds
✅ **Clear:** Standings are easy to understand at a glance
✅ **Responsive:** Works well on all phone sizes
✅ **Accessible:** Clear labels, good contrast, touch targets

---

## Reference Materials

- **Backend API:** `/docs/API_IMPLEMENTED.md`
- **Database Schema:** `/docs/DATABASE.md`
- **Project Overview:** `/README.md`
- **Architecture:** `/docs/ARCHITECTURE.md`

---

## Deliverables Needed

From web-based Claude:

1. **Wireframes** - Low-fidelity layouts for all screens
2. **High-fidelity Mockups** - 3-5 key screens with colors/styling
3. **Component Library** - Reusable UI components
4. **User Flow Diagrams** - Visual flow of main journeys
5. **Style Guide** - Colors, typography, spacing rules
6. **Responsive Breakpoints** - Phone, tablet, web layouts

---

**Ready for Design!** 🎨

All backend APIs are implemented and tested. Focus on creating an intuitive, mobile-first experience for tournament organizers and players at gaming events.
