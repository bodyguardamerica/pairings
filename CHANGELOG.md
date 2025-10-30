# Changelog

All notable changes to the Pairings Project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.2.0] - 2025-10-26

### Added

#### Phase 0: Rated vs Unrated Events ✅
- **Complete Rated/Unrated Event System**
  - Tournament organizers can mark events as "Rated" or "Unrated" when creating tournaments
  - Rated events affect player rankings (competitive)
  - Unrated events are for practice and casual play (do not affect rankings)
  - Default: Rated (maintains competitive integrity)

- **Frontend Implementation:**
  - CreateTournamentScreen: Added "Event Type" selector with Rated/Unrated toggle
  - TournamentCard: Displays rated/unrated badge with color coding (purple for rated, gray for unrated)
  - TournamentListScreen: Added rated/unrated filter in advanced filters modal
  - TournamentDetailsScreen: Shows rated/unrated status in event header
  - Badge Component: Added 'rated' and 'unrated' status support

- **User Experience:**
  - Clear visual distinction between competitive and casual events
  - Filter tournaments by event type (All/Rated Only/Unrated Only)
  - Helper text explains the impact on rankings
  - Affects: CreateTournamentScreen.js, TournamentCard.js, TournamentListScreen.js, TournamentDetailsScreen.js, Badge.js

- **Backend Integration:**
  - Uses existing `isRated` field from Phase 0 backend implementation
  - Backend API: POST /api/tournaments accepts isRated boolean
  - Filter support: GET /api/tournaments?rated=true/false

---

## [2.1.1] - 2025-10-26

### Fixed
- **Web Scrolling for Non-Authenticated Users**
  - Fixed tournament list not scrolling when logged out on web browsers
  - Root cause: React Navigation Web's Stack.Navigator lacks proper height constraints without Tab.Navigator
  - Solution: Added global CSS injection in App.js for proper flex layout hierarchy
  - Enhanced PublicStack with cardStyle: flex: 1 for proper screen constraints
  - Added webListContent style with minHeight: 100% for ScrollView
  - Affects: App.js, AppNavigator.js, TournamentListScreen.js
  - Issue discovered through comparison of logged-in (working) vs logged-out (broken) states

---

## [2.1.0] - 2025-10-25

### Added

#### Content Filtering & Moderation
- **Profanity Filter System**
  - Backend utility: `profanityFilter.js` with comprehensive word list
  - Backend middleware: `contentFilter.js` for automatic validation
  - Frontend utility: `profanityFilter.js` for client-side validation
  - Frontend hook: `useContentFilter.js` for form validation
  - Context-aware detection to avoid false positives
  - Bypass detection (l33t speak, special characters, spacing)
  - Applied to all text inputs: usernames, descriptions, messages, etc.
  - ValidatedTextInput component for reusable validation
  - Real-time validation feedback to users

#### Tournament Management Enhancements
- **Ownership Transfer**
  - Transfer tournament ownership to another user
  - Backend endpoint: `POST /api/tournaments/:id/transfer-ownership`
  - Frontend UI in tournament Info tab
  - Restricted to main organizer only
  - Updates displayed on all tournament events

- **Draft Mode for Events**
  - Status selector when creating tournaments (Draft vs Registration Open)
  - Draft events are hidden from public view
  - Backend supports status field in create endpoint
  - Helper text explaining the difference
  - Default: Registration Open (maintains current behavior)

- **Organizer as Player**
  - Removed restriction preventing organizers from registering
  - Organizers and co-organizers can now play in their own tournaments
  - Frontend: Updated canRegister logic
  - Backend: Already supported, just needed UI change

#### Match Result Management
- **Edit Match Results**
  - TOs can edit results if players submit incorrectly
  - Backend: Updated authorization to include co-organizers
  - Frontend: Edit button on completed matches in Round Details
  - Reuses SubmitResultScreen in edit mode
  - Pre-fills form with existing data
  - Conditional API calls (submit vs update)
  - Dynamic screen title and button text

#### Tournament Flow Improvements
- **Simplified Tournament Start**
  - Creating first round now automatically starts tournament
  - Removed separate "Start Tournament" button
  - Backend: Auto-activates when Round 1 is created
  - Frontend: "Create First Round & Start" button
  - Status changes from 'registration' to 'active' automatically

#### My Events vs Profile
- **Event Display Logic**
  - Events I created appear in Events tab (My Events filter)
  - Events I'm registered for appear in Profile
  - Clear separation of organizer vs player view
  - Better organization of personal events

### Changed

#### Backend
- Updated `editMatchResult()` to include co-organizer authorization
- Updated `deleteMatchResult()` to include co-organizer authorization
- Modified `createRound()` to allow Round 1 from 'registration' status
- Added auto-activation when creating Round 1
- Updated `createTournament()` to accept status field (draft/registration)
- Added content validation middleware to auth and tournament routes

#### Frontend
- Enhanced SubmitResultScreen to handle both submit and edit modes
- Updated RoundDetailsScreen with Edit Result button for organizers
- Modified CreateTournamentScreen with status dropdown
- Added content validation to all Input components by default
- Updated TournamentListScreen search with validation
- Improved navigation with EditResult screen route
- Updated TournamentDetailsScreen to allow organizer registration

### Security
- Comprehensive profanity and hate speech filtering
- Dual-layer validation (backend + frontend)
- Context-aware word detection
- Protection against bypass attempts
- Applied across all user-generated content

### Documentation
- Updated README.md with new features
- Updated CHANGELOG.md with version 2.1.0

---

## [2.0.0] - 2025-10-25

### Added

#### Backend
- **Co-Organizer System**
  - Added `co_organizers` JSONB field to tournaments table (migration 003)
  - New endpoint: `GET /api/tournaments/:id/co-organizers` - Get co-organizers with user details
  - New endpoint: `POST /api/tournaments/:id/co-organizers` - Add co-organizer
  - New endpoint: `DELETE /api/tournaments/:id/co-organizers/:userId` - Remove co-organizer
  - Updated permission checks to include co-organizers in all TO operations
  - GIN index on co_organizers field for performance
  - Total API endpoints: 29 (was 26)

#### Frontend
- **Tournament Operations**
  - Complete tournament registration flow with form validation
  - Match result submission screen with Warmachine scoring (CP, AP, scenarios)
  - Round details screen showing all matches with statuses
  - Edit player registration screen
  - Player withdrawal functionality
  - Tournament lifecycle controls (Draft → Registration → Active → Completed)

- **Co-Organizer Management**
  - Co-organizers section in tournament Info tab
  - Add co-organizers from registered players
  - Remove co-organizers (main organizer only)
  - Real-time permission updates
  - Co-organizers see all TO controls

- **Enhanced Tournament Details**
  - 4 tabs: Info, Players, Standings, Rounds
  - Rounds tab with round list and creation
  - Players tab with edit/withdraw actions
  - Tournament status badges and controls
  - Auto-refresh on navigation focus

#### Test Data
- Created seed-test-data.js script
- 8 test player accounts (alice@example.com through henry@example.com)
- 4 sample events with varying player counts
- All accounts use password: `Password123!`

### Changed

#### Backend
- Updated `updateTournament()` to check main organizer OR co-organizers
- Updated `createRound()` to allow co-organizers
- Enhanced tournament response to include `coOrganizers` array
- Improved error messages for permission denials

#### Frontend
- Updated `isOrganizer` logic to include co-organizers
- Enhanced TournamentDetailsScreen with complete TO functionality
- Improved navigation with proper screen names
- Better loading states and error handling
- Platform-specific dialogs (web vs mobile)

#### Database
- Added migration system with numbered migrations
- Migration 003: Co-organizer support

### Documentation
- Updated README.md with Phase 2 completion
- Updated API_IMPLEMENTED.md with 3 new co-organizer endpoints
- Created CO_ORGANIZER_FEATURE.md with comprehensive feature documentation
- Updated statistics and project status

---

## [1.0.0] - 2025-10-24

### Added

#### Backend
- Complete authentication system with JWT
  - User registration with validation
  - Login with email or username
  - Password hashing with bcrypt (10 rounds)
  - 7-day JWT token expiration
- Tournament management
  - CRUD operations for tournaments
  - Role-based access control (Player, TO, Admin)
  - Tournament status workflow
- Swiss pairing algorithm
  - Automatic pairings by record
  - Opponent history tracking
  - BYE handling for odd player counts
- Match and round management
  - Create rounds with pairings
  - Submit match results
  - Warmachine Steamroller 2025 scoring
  - Edit and delete matches
- Live standings calculation
  - Tournament points (TP)
  - Strength of Schedule (SoS)
  - Tiebreaker system
- Player statistics
  - Win/loss record
  - Faction usage tracking
  - Tournament participation history
- Security features
  - Helmet.js security headers
  - CORS configuration
  - Rate limiting (100 req/min)
  - Input validation on all endpoints
  - SQL injection prevention
- Database
  - PostgreSQL via Supabase
  - 5 tables with proper relations
  - Indexes for performance
  - Migration system
- 26 API endpoints

#### Frontend
- Authentication screens
  - Login screen with form validation
  - Registration screen with password requirements
  - Token storage with AsyncStorage
- Tournament browsing
  - List all tournaments with status badges
  - Search by name
  - Filter by status
  - Pull-to-refresh
- Tournament details
  - Info tab with all tournament data
  - Players tab showing registered players
  - Standings tab with rankings
  - Responsive layout (mobile & web)
- User profile
  - Statistics display
  - Tournament history
  - Win/loss record
  - Faction tracking
- Navigation
  - Bottom tab navigation (Home, Profile)
  - Stack navigation for tournaments
  - Proper screen transitions
- Design system
  - Color palette (purple gradient theme)
  - Typography scale
  - Reusable components (Buttons, Inputs, Cards, Badges)
  - Consistent spacing
  - Professional UI/UX
- Cross-platform support
  - React Native for iOS/Android
  - Expo for web
  - Platform-specific adaptations

#### Documentation
- README.md with quick start guide
- FRONTEND_SETUP.md with step-by-step instructions
- API_IMPLEMENTED.md with all endpoints
- DESIGN-SYSTEM.md with UI guidelines
- PROJECT_STATUS_UPDATED.md with progress tracking
- Backend README with deployment instructions

### Technical Stack
- **Backend:** Node.js 18, Express 4, PostgreSQL, JWT, bcrypt
- **Frontend:** React Native 0.74, Expo 51, React Navigation 7, Axios
- **Database:** PostgreSQL via Supabase
- **Authentication:** JWT with 7-day expiration
- **Deployment:** Ready for Railway/Heroku (backend), EAS Build (frontend)

---

## Version Numbering

- **Major version (X.0.0)**: New phases, major feature sets
- **Minor version (0.X.0)**: New features, enhancements
- **Patch version (0.0.X)**: Bug fixes, documentation updates

---

## Links

- [GitHub Repository](#)
- [API Documentation](docs/API_IMPLEMENTED.md)
- [Co-Organizer Feature](CO_ORGANIZER_FEATURE.md)
- [Setup Guide](README.md)
