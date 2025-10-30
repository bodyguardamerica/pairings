# Longshanks.org Feature Parity Analysis

**Comparison Date:** October 25, 2025
**Your Project:** Pairings v2.1.0
**Benchmark:** Longshanks.org

---

## Executive Summary

Longshanks.org is a comprehensive tournament management platform serving 50+ tabletop game systems with advanced features including global rankings, extensive pairing options, and multi-format event support. This document compares your Pairings project against Longshanks to identify gaps and create an implementation roadmap.

**Current Status:** Your project has ~60% feature parity with strong fundamentals (Swiss pairing, authentication, mobile app). Major gaps include: global rankings, multiple pairing systems, leagues, team/doubles events, and external integrations.

---

## Feature Comparison Matrix

### ✅ Features You HAVE (Parity Achieved)

| Feature | Your Project | Longshanks | Notes |
|---------|-------------|-----------|--------|
| **Swiss Pairing** | ✅ | ✅ | Full implementation |
| **Tournament CRUD** | ✅ | ✅ | Complete |
| **Player Registration** | ✅ | ✅ | Self-service registration |
| **Match Result Submission** | ✅ | ✅ | Players can submit |
| **Live Standings** | ✅ | ✅ | Real-time calculation |
| **User Authentication** | ✅ | ✅ | JWT-based |
| **Role-Based Access** | ✅ | ✅ | Player/TO/Admin |
| **Tournament Search** | ✅ | ✅ | Name search implemented |
| **Tournament Filtering** | ✅ | ✅ | By status |
| **Player Statistics** | ✅ | ✅ | Win/loss, averages |
| **Admin Dashboard** | ✅ | ✅ | User management, stats |
| **Multiple TOs** | ✅ | ✅ | Co-organizer system |
| **Mobile App** | ✅ | ❌ | You have advantage here! |
| **Tournament Points (TP)** | ✅ | ✅ | Win = 1, Loss = 0 |
| **Basic Tiebreakers** | ✅ | ✅ | SoS, CP, AP |

---

### ⚠️ Features You Have PARTIALLY (Needs Enhancement)

| Feature | Your Project | Longshanks | Gap Description |
|---------|-------------|-----------|-----------------|
| **Tiebreaker Options** | Partial | Full | You: 5 tiebreakers; They: 3+ customizable, user-selectable order |
| **Tournament Status** | Partial | Full | You: Draft/Registration/Active/Completed; Missing: Cancelled, Postponed |
| **Event Discovery** | Partial | Full | You: Search + filter by status; Missing: Geographic filters, game system filter |
| **Player Profile** | Partial | Full | You: Stats; Missing: Unique LSID, nickname, privacy settings |
| **Tournament Types** | Partial | Full | You: Single elimination concept; Missing: Brackets, leagues |
| **Game System Support** | Single | 50+ | You: Warmachine only; They: Modular multi-game |

---

### ❌ Features You DON'T Have (Missing)

#### **1. Advanced Pairing Systems**

| Feature | Status | Priority |
|---------|--------|----------|
| Adjacent Pairing (1st vs 2nd, 3rd vs 4th) | ❌ | High |
| Fold Pairing (highest vs lowest) | ❌ | Medium |
| Slide Pairing (split groups) | ❌ | Medium |
| Bracket/Elimination | ❌ | High |
| Random Pairing | ❌ | Low |
| Custom Manual Pairings | ❌ | Medium |

**Your Current:** Swiss only
**Longshanks:** 6+ pairing methods

---

#### **2. Global Rankings & Rating System**

| Feature | Status | Priority |
|---------|--------|----------|
| RPI (Rating Percentage Index) | ❌ | High |
| Global Leaderboards | ❌ | High |
| Faction-Specific Rankings | ❌ | Medium |
| Regional Rankings | ❌ | Medium |
| Q-Factor (games played weighting) | ❌ | Low |
| Cross-Tournament Rating | ❌ | High |
| Historical Rating Trends | ❌ | Low |

**Your Current:** Tournament-specific stats only
**Longshanks:** Global player rankings across all events

---

#### **3. Event Formats**

| Feature | Status | Priority |
|---------|--------|----------|
| **Leagues** (flexible scheduling, no rounds) | ❌ | High |
| **Team Events** (multiple players per team) | ❌ | Medium |
| **Doubles Events** (2v2 on same board) | ❌ | Medium |
| **Extended Events** (multi-day, ongoing) | ❌ | Medium |
| **Virtual/Online Events** | ❌ | Low |

**Your Current:** Single-player tournaments only
**Longshanks:** Singles, doubles, teams, leagues

---

#### **4. Geographic & Discovery Features**

| Feature | Status | Priority |
|---------|--------|----------|
| Continental Filtering | ❌ | High |
| Country Filtering | ❌ | High |
| Regional/State Filtering | ❌ | Medium |
| Distance-Based Search | ❌ | Low |
| Map View of Events | ❌ | Low |
| Time Zone Display | ❌ | Medium |
| "Near Me" Feature | ❌ | High |

**Your Current:** No geographic filtering
**Longshanks:** Multi-level geographic filtering (continent → country → region)

---

#### **5. Advanced Event Management**

| Feature | Status | Priority |
|---------|--------|----------|
| Waiting Lists | ❌ | High |
| Player Capacity Limits | ❌ | High |
| Registration Deadlines | ❌ | High |
| Registration Approval Workflow | ❌ | Medium |
| Private Events (invite-only) | ❌ | Medium |
| External Payment Integration | ❌ | High |
| Entry Fees | ❌ | High |
| Refund Management | ❌ | Low |
| Event Check-in System | ❌ | Medium |
| No-Show Tracking | ❌ | Low |

**Your Current:** Basic registration
**Longshanks:** Full registration lifecycle management

---

#### **6. List Management**

| Feature | Status | Priority |
|---------|--------|----------|
| Army List Submission | ❌ | High |
| List Editing Deadlines | ❌ | High |
| List Privacy (public/private) | ❌ | Medium |
| List Templates | ❌ | Low |
| List Validation | ❌ | Medium |
| Print Lists for Opponents | ❌ | Low |
| List File Upload (PDF, etc.) | ❌ | Medium |

**Your Current:** Just faction + list name
**Longshanks:** Full list management with deadlines and privacy

---

#### **7. Communication Features**

| Feature | Status | Priority |
|---------|--------|----------|
| Player-to-Player Messaging | ❌ | Medium |
| TO Announcements | ❌ | High |
| Email Notifications | ❌ | High |
| Push Notifications (mobile) | ❌ | Medium |
| Event Updates/News Feed | ❌ | Medium |
| Results Notifications | ❌ | Low |

**Your Current:** No communication system
**Longshanks:** Email-based messaging, announcements

---

#### **8. Advanced Statistics & Analytics**

| Feature | Status | Priority |
|---------|--------|----------|
| Faction Meta Analysis | ❌ | Medium |
| Matchup Win Rates | ❌ | Low |
| Scenario Statistics | ❌ | Medium |
| Victory Condition Breakdown | ❌ | Low |
| Historical Trends | ❌ | Low |
| Tournament Attendance Trends | ❌ | Low |
| Player Activity Heatmaps | ❌ | Low |

**Your Current:** Basic player stats
**Longshanks:** Comprehensive meta analysis

---

#### **9. Awards & Achievements**

| Feature | Status | Priority |
|---------|--------|----------|
| Event Championships | ❌ | Medium |
| Faction Leadership Awards | ❌ | Low |
| Win Streak Badges | ❌ | Low |
| Diversity Badges | ❌ | Low |
| Hosting Achievements | ❌ | Low |
| Custom Badges | ❌ | Low |

**Your Current:** No achievement system
**Longshanks:** Comprehensive awards system

---

#### **10. Subscription/Premium Features**

| Feature | Status | Priority |
|---------|--------|----------|
| Custom Name Badges | ❌ | Low |
| Highlighted Nicknames | ❌ | Low |
| Event Following | ❌ | Medium |
| Advanced Analytics Dashboard | ❌ | Medium |
| Custom Event Imagery | ❌ | Medium |
| Enhanced Profile Customization | ❌ | Low |

**Your Current:** All features free
**Longshanks:** Freemium model with premium features

---

#### **11. Data Privacy & User Control**

| Feature | Status | Priority |
|---------|--------|----------|
| Account Privacy Settings | ❌ | High |
| GDPR Compliance Tools | ❌ | High |
| Data Export | ❌ | Medium |
| Account Deletion | ✅ | - |
| Email Privacy (never shared) | ✅ | - |
| Opt-out of Leaderboards | ❌ | Medium |

**Your Current:** Basic privacy
**Longshanks:** GDPR-compliant with user controls

---

#### **12. Integration & External Features**

| Feature | Status | Priority |
|---------|--------|----------|
| External Payment Links | ❌ | High |
| Calendar Export (iCal) | ❌ | Medium |
| Social Media Sharing | ❌ | Low |
| Embeddable Widgets | ❌ | Low |
| API for Third Parties | ❌ | Medium |
| Import from Other Platforms | ❌ | Low |

**Your Current:** Standalone system
**Longshanks:** External integrations

---

#### **13. Public Access & Guest Features**

| Feature | Status | Priority |
|---------|--------|----------|
| View Events Without Login | ❌ | **CRITICAL** |
| Public Tournament Browsing | ❌ | **CRITICAL** |
| Guest Account Participation | ❌ | High |
| Public Standings View | ❌ | High |
| Public Player Profile View | ❌ | Medium |
| Guest Result Submission | ❌ | Medium |
| Anonymous Event Discovery | ❌ | High |

**Your Current:** Login required for all features
**Longshanks:** Public browsing, guest participation allowed

**Impact:** Major barrier to entry - users can't explore before committing to registration

---

#### **14. Event Rating & Visibility**

| Feature | Status | Priority |
|---------|--------|----------|
| Rated vs Unrated Events | ❌ | High |
| Rated Event Toggle | ❌ | High |
| Rating Impact Display | ❌ | Medium |
| Unrated Event Benefits (practice, casual) | ❌ | Medium |
| Rating Opt-in/Opt-out | ❌ | Low |

**Your Current:** No rating system distinction
**Longshanks:** Clear rated/unrated event types affecting global rankings

**Impact:** Can't differentiate between competitive (rated) and casual (unrated) events

---

#### **15. Event Series & Campaigns**

| Feature | Status | Priority |
|---------|--------|----------|
| Event Series Creation | ❌ | High |
| Link Multiple Events in Series | ❌ | High |
| Series Standings (aggregate) | ❌ | Medium |
| Series Championships | ❌ | Medium |
| Campaign Tracking | ❌ | Low |
| Multi-Event Registration | ❌ | Medium |
| Series Badges/Awards | ❌ | Low |

**Your Current:** Each event is standalone
**Longshanks:** Support for linked event series (leagues, campaigns, seasonal circuits)

**Impact:** Can't run multi-event campaigns like "Winter Championship Series" with cumulative points

---

#### **16. Community Features & Engagement**

| Feature | Status | Priority |
|---------|--------|----------|
| User Request Portal | ❌ | Medium |
| Feature Voting | ❌ | Low |
| Community Forums | ❌ | Low |
| Event Comments/Discussion | ❌ | Low |
| Player Endorsements | ❌ | Low |
| TO Ratings/Reviews | ❌ | Low |

**Your Current:** No community interaction features
**Longshanks:** User request portal for feature suggestions

**Impact:** No feedback loop or community engagement mechanism

---

#### **17. Notification & Alert System**

| Feature | Status | Priority |
|---------|--------|----------|
| Email Alerts for New Events | ❌ | **CRITICAL** |
| Location-Based Event Alerts | ❌ | High |
| Game System Subscription Alerts | ❌ | High |
| Favorite TO Notifications | ❌ | Medium |
| Tournament Update Alerts | ❌ | High |
| Registration Opening Alerts | ❌ | High |
| Result Submission Reminders | ❌ | Medium |
| Round Start Notifications | ❌ | High |

**Your Current:** No notification system
**Longshanks:** Comprehensive email alert system

**Impact:** Players miss new events in their area, reducing participation

---

#### **18. Advanced Player Statistics**

| Feature | Status | Priority |
|---------|--------|----------|
| Public Player Stat Viewing | ❌ | High |
| Cross-Player Stat Comparison | ❌ | Medium |
| Player Search by Stats | ❌ | Low |
| Historical Performance Charts | ❌ | Medium |
| Head-to-Head Records | ❌ | Low |
| Opponent Analysis | ❌ | Low |
| Performance Trends | ❌ | Low |

**Your Current:** Stats only visible to logged-in user (self only)
**Longshanks:** Public player profiles with full stat viewing

**Impact:** Can't look up opponents, research players, or compare performance

---

## Priority Implementation Roadmap

### **Phase 0: CRITICAL Pre-Launch Features (MUST DO FIRST)**

**Estimated Time:** 2-3 weeks

These features are **blocking issues** that prevent the platform from being usable:

1. **Public Event Browsing (NO LOGIN)** (3 days) ⚠️ **BLOCKER**
   - Remove authentication requirement for viewing tournaments
   - Public tournament list page
   - Public tournament details page
   - Public standings view
   - Anonymous browsing analytics

2. **Email Alert System for New Events** (1 week) ⚠️ **CRITICAL**
   - Email subscription preferences
   - Location-based alerts
   - Game system alerts
   - Favorite TO alerts
   - Daily/weekly digest options
   - Unsubscribe management

3. **Rated vs Unrated Events** (3 days)
   - Add `is_rated` boolean to tournaments
   - Display rated/unrated badge
   - Filter by rated/unrated
   - Impact on future global rankings

4. **Public Player Statistics Viewing** (3 days)
   - Public player profile pages
   - View any player's stats (not just your own)
   - Player search functionality
   - Privacy toggle (opt-out option)

**Why Phase 0 is Critical:**
- **Without public browsing:** Users must register before seeing if any events interest them (huge barrier)
- **Without email alerts:** Players don't know about new events in their area
- **Without public stats:** Can't research opponents or build community reputation
- **Without rated/unrated:** All events impact rankings equally (unfair)

---

### **Phase 1: Critical Gaps (Must-Have for Parity)**

**Estimated Time:** 5-6 weeks

1. **Guest Account Participation** (1 week)
   - Register for events without full account
   - Guest check-in system
   - Convert guest to full account
   - Guest result submission

2. **Waiting Lists & Capacity Management** (1 week)
   - Set max players per tournament
   - Automatic waiting list when full
   - Promote from waitlist when spots open

3. **Registration Deadlines** (3 days)
   - Deadline date/time field
   - Prevent late registration
   - Display countdown timer

4. **Entry Fees & Payment Integration** (1 week)
   - Add entry fee field to tournaments
   - Link to external payment (Stripe, PayPal)
   - Payment status tracking

5. **Event Series Support** (1 week)
   - Create event series (linked tournaments)
   - Series standings (aggregate points)
   - Series badges/championships
   - Multi-event registration

6. **Geographic Filtering** (1 week)
   - Add location fields (country, state/region, city)
   - Geographic filters on browse page
   - Distance-based search (optional)

7. **Army List Management** (1.5 weeks)
   - List submission interface
   - List editing deadline
   - Public/private toggle
   - File upload support (PDF, txt)

8. **Additional Pairing Systems** (1 week)
   - Adjacent pairing
   - Bracket/elimination
   - Manual pairing override

---

### **Phase 2: High-Value Enhancements (Competitive Features)**

**Estimated Time:** 6-8 weeks

9. **Global Rankings System** (2 weeks)
   - RPI calculation algorithm
   - Cross-tournament rating tracking
   - Global leaderboards
   - Faction-specific rankings
   - Rated events affect rankings
   - Unrated events don't affect rankings

10. **League Format Support** (2 weeks)
    - Flexible match scheduling
    - No fixed rounds
    - Extended timeframes
    - Self-scheduled matches

11. **Team & Doubles Events** (2 weeks)
    - Team creation and management
    - Team scoring aggregation
    - Doubles pairing (2v2)
    - Team standings

12. **Enhanced Notification System** (1 week)
    - Round start notifications
    - Result submission reminders
    - Tournament update announcements
    - Registration confirmations
    - Push notifications (mobile)

13. **Advanced Event Discovery** (1 week)
    - Filter by game system
    - Filter by event type (rated/unrated)
    - Filter by format (singles/doubles/teams)
    - Saved search preferences
    - Favorite TOs

14. **Event Check-in System** (3 days)
    - Check-in window before tournament
    - Track who showed up
    - Remove no-shows from pairings

15. **User Request Portal** (1 week)
    - Feature request submission
    - Bug reporting
    - Community voting on features
    - Request status tracking
    - Admin dashboard for requests

---

### **Phase 3: Nice-to-Have Features (Polish & Premium)**

**Estimated Time:** 4-6 weeks

14. **Player-to-Player Messaging** (1 week)
    - Direct messages through platform
    - Email routing (privacy preserved)
    - Message history

15. **Advanced Analytics Dashboard** (2 weeks)
    - Faction meta analysis
    - Matchup statistics
    - Scenario win rates
    - Historical trends

16. **Achievement System** (1 week)
    - Badge definitions
    - Automatic badge awards
    - Achievement display on profile
    - Leaderboard integration

17. **Premium/Subscription Features** (2 weeks)
    - Payment integration
    - Feature gating
    - Subscription management
    - Custom branding options

18. **Data Export & GDPR Tools** (1 week)
    - Export user data (JSON, CSV)
    - Account privacy settings
    - Opt-out of public leaderboards
    - GDPR-compliant deletion

---

### **Phase 4: Advanced Features (Long-term Goals)**

**Estimated Time:** 8-12 weeks

19. **Multiple Game System Support** (3 weeks)
    - Abstract game module interface
    - Additional game modules (40K, AoS, Kill Team, MCP)
    - Game-specific scoring rules
    - Game-specific tiebreakers

20. **Virtual/Online Event Support** (1 week)
    - Virtual event flag
    - Online platform links
    - Virtual-specific features

21. **Calendar & External Integrations** (2 weeks)
    - iCal export
    - Google Calendar integration
    - Social media sharing
    - Embeddable widgets

22. **Advanced List Management** (2 weeks)
    - List templates
    - List validation (point totals, restrictions)
    - Print-friendly list views
    - List comparison tools

23. **Mobile App Enhancements** (3 weeks)
    - Offline mode
    - Push notifications
    - QR code check-in
    - Camera-based result entry

---

## Feature Gap Summary

### By Priority Level

**CRITICAL (must have for basic parity):**
- Waiting lists & capacity
- Registration deadlines
- Entry fees/payment integration
- Geographic filtering
- Army list management
- Additional pairing systems
- TO announcements

**HIGH (competitive advantage):**
- Global rankings/RPI
- League format
- Team/doubles events
- Email notifications
- Advanced discovery filters
- Check-in system

**MEDIUM (nice to have):**
- Messaging system
- Advanced analytics
- Achievement badges
- Data export/GDPR
- Calendar integration

**LOW (polish & premium):**
- Custom branding
- Social sharing
- Virtual event features
- List validation
- Subscription model

---

## Your Competitive Advantages

### Features Where You EXCEED Longshanks:

1. **Mobile-First App** ✨
   - Native mobile experience (iOS/Android)
   - Longshanks is web-only
   - Better UX for on-site tournament use

2. **Modern UI/UX** ✨
   - Purple gradient design system
   - Clean, modern interface
   - Better visual hierarchy

3. **Co-Organizer System** ✨
   - Multiple TOs can manage same event
   - Shared responsibilities
   - More flexible than Longshanks

4. **Admin Dashboard** ✨
   - Comprehensive admin tools
   - User management
   - System statistics

5. **Draft Mode** ✨
   - Create private tournaments before publishing
   - Better workflow for TOs

6. **Content Filtering** ✨
   - Profanity and hate speech protection
   - Safer community

---

## Technology Stack Comparison

| Component | Your Project | Longshanks (inferred) |
|-----------|-------------|----------------------|
| Frontend | React Native + Expo | Web (likely React) |
| Backend | Node.js + Express | Unknown (likely PHP or Node) |
| Database | PostgreSQL (Supabase) | Unknown (likely PostgreSQL or MySQL) |
| Mobile | Native iOS/Android app | Web-only (responsive) |
| Authentication | JWT | Session-based (inferred) |
| Deployment | Self-hosted option | Cloud-hosted |

**Your advantages:** Modern stack, mobile-native, easier to scale

---

## Estimated Development Effort

### To Reach 90% Feature Parity:

**Updated Total Time:** ~21-27 weeks (5-7 months) with 1 full-time developer

**Breakdown:**
- **Phase 0 (CRITICAL):** 2-3 weeks ⚠️ **DO THIS FIRST**
- Phase 1 (Critical): 6 weeks
- Phase 2 (High-Value): 8 weeks
- Phase 3 (Polish): 6 weeks
- **Total Core Features:** 22-23 weeks

**Additional Time:**
- Testing & QA: 2 weeks
- Documentation: 1 week
- Bug fixes & refinement: 2 weeks

**With 2 developers:** 11-14 weeks
**With 3 developers:** 8-10 weeks

---

## Recommended Approach

### ⚠️ **IMMEDIATE PRIORITY: Phase 0 (2-3 weeks)**

**These are BLOCKERS that prevent platform adoption:**

1. ✅ **Public event browsing (NO LOGIN)** - 3 days
2. ✅ **Email alerts for new events** - 1 week
3. ✅ **Rated vs unrated events** - 3 days
4. ✅ **Public player stat viewing** - 3 days

**Why these are critical:**
- Longshanks allows browsing without login - yours requires account first
- Players can't discover events → no adoption
- No email alerts → players don't know about new events
- Can't differentiate competitive vs casual events

---

### Minimum Viable Parity (MVP+)

After Phase 0, focus on these 10 features (8-10 weeks):

1. ✅ Guest account participation
2. ✅ Event series support
3. ✅ Waiting lists & capacity
4. ✅ Registration deadlines
5. ✅ Geographic filtering
6. ✅ Army list management
7. ✅ Additional pairing systems (bracket, adjacent)
8. ✅ Entry fees & payment links
9. ✅ Global rankings (RPI)
10. ✅ League format

**Result:** You'd have core parity + mobile advantage, positioning you as a competitive alternative.

---

## Business Model Considerations

### Longshanks Revenue Model:
- Core features: FREE
- Premium subscriptions: Custom badges, advanced analytics, enhanced features
- Event hosting: Always free

### Your Options:

**Option 1: Fully Free (Open Source)**
- Compete on mobile experience + modern UX
- Build community, get contributors
- Monetize through donations or partnerships

**Option 2: Freemium (Match Longshanks)**
- Free: Core tournament features
- Premium: Advanced analytics, custom branding, enhanced profiles
- Subscription: $5-10/month or $50-100/year

**Option 3: Event-Based Pricing**
- Free: For small events (<16 players)
- Paid: For large events or premium features
- One-time fee per tournament or subscription for TOs

---

## Conclusion

Your **Pairings** project has excellent fundamentals and some unique advantages (mobile app, modern stack, co-organizers). You're at ~60% feature parity with Longshanks.

### Key Takeaways:

1. **Your Strengths:** Mobile-first, modern UX, co-organizers, admin tools
2. **Biggest Gaps:** Global rankings, leagues, multiple pairing systems, geographic discovery
3. **Critical Path:** Phase 1 features (6 weeks) would put you at 75% parity
4. **Full Parity:** 18-24 weeks of development
5. **Strategic Focus:** Build on mobile advantage while closing ranking/pairing gaps

### Next Steps:

1. Decide on business model (free vs freemium)
2. Prioritize Phase 1 features
3. Build global rankings system (high value)
4. Add league format (differentiator)
5. Enhance mobile app with offline features
6. Market to Warmachine community first, expand to other games

**You're well-positioned to become a modern, mobile-first alternative to Longshanks!** 🚀

---

**Document Version:** 1.0
**Last Updated:** October 25, 2025
**Status:** Comprehensive Analysis Complete
