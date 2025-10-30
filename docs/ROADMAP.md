# PROJECT ROADMAP - Pairings Project

**Last Updated:** October 2025 (Updated with feature suggestions)  
**Project Start:** October 2025  
**Target MVP:** Q1 2026

---

## Vision

Build a universal tournament organizer platform that makes running tabletop gaming tournaments easy, fair, and engaging for both organizers and players. Start with Warmachine Steamroller 2025 format and expand to other games.

---

## Development Phases

### Phase 0: Foundation (4-6 weeks)

**Goal:** Set up development environment and core infrastructure

**Backend:**
- [ ] Initialize Node.js + Express project
- [ ] Set up PostgreSQL database (local + Supabase)
- [ ] Configure Supabase Authentication
- [ ] Create initial database migrations (core tables)
- [ ] Set up environment configurations (.env files)
- [ ] Create basic API structure
- [ ] Implement health check endpoint

**Frontend:**
- [ ] Initialize React Native (Expo) project
- [ ] Set up navigation structure
- [ ] Configure environment variables
- [ ] Create basic component library
- [ ] Set up state management (Context API or Redux)
- [ ] Configure API client

**DevOps:**
- [ ] Set up Git repository
- [ ] Create README with setup instructions
- [ ] Configure ESLint and Prettier
- [ ] Set up development workflow

**Documentation:**
- [x] ARCHITECTURE.md
- [x] DATABASE.md
- [x] API.md
- [x] ROADMAP.md (this document)
- [ ] DEPLOYMENT.md
- [ ] CONTRIBUTING.md
- [ ] Development setup guide

**Success Criteria:**
- Developer can clone repo and run locally
- Database migrations run successfully
- Basic API responds to health check
- Mobile app runs in Expo

---

### Phase 1: MVP Core Features (8-12 weeks)

**Goal:** Build minimum viable product with Warmachine Steamroller support

#### 1.1: User Authentication & Profiles (2 weeks)

**Backend:**
- [ ] User registration endpoint
- [ ] Login/logout endpoints
- [ ] JWT token management
- [ ] Password reset flow
- [ ] User profile CRUD endpoints
- [ ] Profile photo upload

**Frontend:**
- [ ] Login screen
- [ ] Registration screen
- [ ] Profile view screen
- [ ] Profile edit screen
- [ ] Password reset flow

**Testing:**
- [ ] User can register and login
- [ ] Profile updates persist
- [ ] Authentication tokens work correctly

---

#### 1.2: Tournament Creation & Management (3 weeks)

**Backend:**
- [ ] Tournament CRUD endpoints
- [ ] Tournament registration endpoint
- [ ] Check-in system
- [ ] Player list management
- [ ] Drop player functionality
- [ ] Tournament status transitions

**Frontend:**
- [ ] Tournament list screen
- [ ] Tournament detail screen
- [ ] Tournament creation form
- [ ] Tournament registration button
- [ ] Check-in interface
- [ ] Organizer dashboard

**Testing:**
- [ ] Organizers can create tournaments
- [ ] Players can register
- [ ] Check-in process works
- [ ] Drop functionality works

---

#### 1.3: Warmachine Pairing Algorithm (3 weeks)

**Backend:**
- [ ] Swiss pairing algorithm implementation
- [ ] First round random pairing
- [ ] Subsequent round pairing with tournament points
- [ ] Pairing down logic
- [ ] No-rematch enforcement
- [ ] Bye assignment logic
- [ ] Round generation endpoint
- [ ] Scenario selection (random/chosen)

**Frontend:**
- [ ] Round generation button (TO only)
- [ ] Pairings display screen
- [ ] Table assignment view
- [ ] Scenario display

**Testing:**
- [ ] First round pairs randomly
- [ ] Swiss pairing works correctly
- [ ] No duplicate pairings
- [ ] Bye assigned to correct player
- [ ] Pairing down works with odd brackets

---

#### 1.4: Match Results & Standings (2-3 weeks)

**Backend:**
- [ ] Match result submission endpoint
- [ ] Result validation
- [ ] Tournament standings calculation
- [ ] Strength of schedule calculation
- [ ] Tiebreaker logic
- [ ] Statistics update triggers
- [ ] Victory Points tracking
- [ ] Army Points Destroyed tracking

**Frontend:**
- [ ] Match result entry form
- [ ] Standings table view
- [ ] Real-time standings updates
- [ ] Player match history
- [ ] Round summary view

**Testing:**
- [ ] Results correctly update standings
- [ ] Tiebreakers calculate properly
- [ ] Statistics update in real-time
- [ ] Standings sort correctly

---

#### 1.5: Warmachine-Specific Features (1-2 weeks)

**Backend:**
- [ ] Warmachine scenarios table seeded
- [ ] Army list submission
- [ ] List validation (point totals)
- [ ] Deathclock time tracking
- [ ] Victory condition recording

**Frontend:**
- [ ] Army list submission form
- [ ] List viewer
- [ ] Scenario information display
- [ ] Deathclock timer (basic)
- [ ] Victory condition selection

**Testing:**
- [ ] Army lists save correctly
- [ ] Scenarios display properly
- [ ] Deathclock tracks time
- [ ] All victory conditions work

---

### Phase 1 Success Criteria

**Must Have:**
- ✅ Users can create accounts and login
- ✅ TOs can create Warmachine tournaments
- ✅ Players can register for tournaments
- ✅ Swiss pairing algorithm works correctly
- ✅ Match results can be recorded
- ✅ Live standings are accurate
- ✅ Tournament completes with final rankings

**Nice to Have:**
- ⚠️ Mobile app polished UI
- ⚠️ Email notifications
- ⚠️ Push notifications

**Can Wait:**
- ❌ Admin dashboard
- ❌ Advanced statistics
- ❌ Other game systems

---

### Phase 2: Enhancement & Polish (6-8 weeks)

**Goal:** Improve user experience and add supporting features

#### 2.1: Mobile Apps (2-3 weeks)

- [ ] Build iOS app
- [ ] Build Android app
- [ ] Test on real devices
- [ ] Submit to app stores (if ready)
- [ ] App icon and branding

---

#### 2.2: Notifications System (1-2 weeks)

**⚠️ Cost Management Note:** SMS notifications deferred to Phase 3 (too expensive without revenue). Focus on FREE notification methods first.

**Backend:**
- [ ] Push notification infrastructure (Firebase) - FREE
- [ ] Notification preferences
- [ ] Notification triggers
- [ ] Email notification system (SendGrid/Mailgun integration) - FREE tier
- [ ] Email alert preferences for new events

**Frontend:**
- [ ] Push notification handling
- [ ] Notification settings screen
- [ ] In-app notification display
- [ ] Email preferences management screen

**Notifications (FREE methods only):**
- [ ] Round pairings posted (push + email)
- [ ] Match about to start (5 min warning) - push
- [ ] Tournament registration opened (push + email)
- [ ] Tournament starting soon (push)
- [ ] Result needs reporting (push)
- [ ] New event alerts (push + email based on location/game preferences)

**SMS Notifications:** Deferred to Phase 3.7 (after revenue established) - see SMS_NOTIFICATIONS_RESEARCH.md

---

#### 2.3: Enhanced Statistics & Global Rankings (2-3 weeks)

**Backend:**
- [ ] Detailed player statistics
- [ ] Head-to-head records
- [ ] Performance trends
- [ ] **Global rankings system (RPI-based rating across all tournaments)**
- [ ] Leaderboards (global, regional, seasonal, faction-specific)
- [ ] Faction/army statistics
- [ ] **Faction matchup win rates**
- [ ] **Scenario performance statistics**
- [ ] **Meta analysis for factions**

**Frontend:**
- [ ] Statistics dashboard
- [ ] Charts and graphs
- [ ] Leaderboard screens (multiple categories)
- [ ] Faction performance views
- [ ] **Global ranking display**
- [ ] **Regional ranking filters**

---

#### 2.4: Advanced Tournament Features & Formats (2-3 weeks)

- [ ] Team tournaments
- [ ] "Cut to Top X" functionality
- [ ] **Leagues format (flexible scheduling, no strict rounds)**
- [ ] Multi-day tournaments
- [ ] Scenario selection methods (sequential, TO choice)
- [ ] Custom tiebreakers
- [ ] Tournament templates
- [ ] Recurring tournaments
- [ ] **Advanced pairing options (adjacent, fold, slide pairing)**
- [ ] **Bracket/elimination pairing support**
- [ ] **Manual pairings option**

---

#### 2.5: Deathclock Integration (1 week)

- [ ] Digital deathclock in app
- [ ] Clock synchronization
- [ ] Time warnings
- [ ] Automatic loss on timeout
- [ ] Clock adjustment (TO only)

---

#### 2.6: Geographic Event Discovery & Army Lists (2 weeks)

**Geographic Features:**
- [ ] **Geographic filtering (continent, country, state/region, city)**
- [ ] **Distance-based search ("Near Me" feature)**
- [ ] **Map view of events**
- [ ] **Timezone handling and display**
- [ ] Location-based event recommendations

**Army List Management (Warmachine):**
- [ ] **Army list submission**
- [ ] **List editing deadlines**
- [ ] **List privacy (public/private)**
- [ ] **List validation**
- [ ] **List file upload (PDF, etc.)**
- [ ] **Print lists for opponents**

---

#### 2.7: Waiting Lists & Entry Fees (1-2 weeks)

**Waiting Lists:**
- [ ] **Waiting list for full events**
- [ ] **Auto-promotion from waitlist**
- [ ] **Capacity limits**
- [ ] **Registration approval workflow**

**Entry Fees & Payments:**
- [ ] **Entry fee configuration**
- [ ] **Payment processing integration (Stripe/Square)**
- [ ] **Prize pool management**
- [ ] **Refund management**
- [ ] **Payment status tracking**

---

#### 2.8: UX Improvements & Communication (1 week)

**UX Features:**
- [ ] **Dark mode support**
- [ ] **Offline mode (cache data, queue actions)**
- [ ] **QR code check-in for tournaments**
- [ ] **Match history viewer**

**Communication:**
- [ ] **TO announcements system**
- [ ] **In-tournament messaging**

---

#### 2.9: Data Export & International Support (1 week)

**Data Export:**
- [ ] **Export tournament results to CSV/JSON**
- [ ] **Export player statistics**
- [ ] **Backup/restore tournament data**
- [ ] **Data portability for users**

**International:**
- [ ] **Multi-language support (i18n)**
- [ ] **Language selection UI**
- [ ] **Localized date/time formats**

---

#### 2.10: Guest Access & Public Features (1 week)

**Guest Account Features:**
- [ ] **Guest account creation (no email required)**
- [ ] **Guest tournament participation**
- [ ] **Limited guest features (no statistics, temporary account)**
- [ ] **Guest-to-full account conversion**
- [ ] **Guest account expiration (30-day auto-cleanup)**

**Public Access:**
- [ ] **View tournaments without login**
- [ ] **Public tournament listings**
- [ ] **Public standings/results viewing**
- [ ] **Event calendar (public)**
- [ ] **Share tournament links (public access)**

**Tournament Rating System:**
- [ ] **Rated vs Unrated event toggle**
- [ ] **Rating impact display**
- [ ] **Filter by rated/unrated events**
- [ ] **Casual/practice event designation**

**Value:** Lowers barrier to entry, increases event discovery, allows tournament testing without commitment

---

### Phase 3: Scaling & Admin Tools (4-6 weeks)

**Goal:** Support larger user base and provide admin oversight

#### 3.1: Admin Dashboard (2 weeks)

**Backend:**
- [ ] Admin-specific endpoints
- [ ] User management (ban, role changes)
- [ ] Tournament oversight
- [ ] System analytics
- [ ] Audit logging

**Frontend:**
- [ ] Admin dashboard screen
- [ ] User management interface
- [ ] Tournament moderation tools
- [ ] Analytics views
- [ ] System health monitoring

---

#### 3.2: Performance Optimization (1-2 weeks)

- [ ] Database query optimization
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] API response time optimization
- [ ] Frontend performance tuning
- [ ] Image optimization
- [ ] Lazy loading

---

#### 3.3: Production Deployment (1-2 weeks)

- [ ] Set up Hetzner VPS
- [ ] Configure Nginx
- [ ] Set up SSL certificates
- [ ] Database migration to production
- [ ] CI/CD pipeline
- [ ] Monitoring and logging (Sentry, LogRocket)
- [ ] Backup strategy

---

#### 3.4: Documentation & Support (1 week)

- [ ] User guide for players
- [ ] TO guide for organizers
- [ ] FAQ section
- [ ] Video tutorials
- [ ] API documentation (public)
- [ ] Support ticket system
- [ ] **User feature request portal**
- [ ] **Voting/upvoting on feature requests**
- [ ] **Public roadmap display**
- [ ] **Feature request status tracking**

---

#### 3.4.1: Alternative Tournament Formats (1-2 weeks)

**Single Match Events:**
- [ ] **Standalone single match recording** (no tournament structure required)
- [ ] **Casual play tracking**
- [ ] **Pick-up game results**
- [ ] **League match recording** (independent of rounds)
- [ ] **Practice match tracking**
- [ ] **Head-to-head challenge system**

**Value:** Allows players to track all games, not just tournaments. Builds engagement between events.

---

#### 3.5: SMS Text Notifications (1-2 weeks) ⚠️ COST-CONTROLLED

**Prerequisites (MUST have):**
- [ ] Entry fees/payment processing working
- [ ] 500+ active monthly users
- [ ] Revenue stream established
- [ ] Cost recovery mechanism in place

**⚠️ Cost Management Critical:**
- SMS costs ~$0.0075 per message
- Can reach $750+/month at scale
- **MUST** implement cost controls and recovery

**Backend:**
- [ ] Twilio integration (or AWS SNS/Plivo)
- [ ] SMS service with cost tracking
- [ ] Daily/monthly SMS budget limits
- [ ] Automatic fallback to push if budget exceeded
- [ ] Cost monitoring dashboard
- [ ] Usage throttling per user

**Database:**
- [ ] Add phone_number to users table
- [ ] Add phone_verified field
- [ ] SMS preferences table
- [ ] SMS usage tracking table

**Frontend:**
- [ ] Phone number collection/verification
- [ ] SMS preferences UI (opt-in)
- [ ] SMS notification settings
- [ ] Cost display (if pay-per-use)

**Cost Recovery Options (choose one):**
- [ ] Premium subscription includes SMS ($5/month)
- [ ] Pay-per-use SMS credits ($10 = 1,000 SMS)
- [ ] Tournament SMS fee ($0.50 per tournament)
- [ ] Free tier with limits (10 SMS/month)

**Notification Strategy:**
- [ ] SMS for urgent only (round pairings, match starting)
- [ ] Push notifications for everything else
- [ ] Email for digests/summaries
- [ ] SMS opt-in only (never default)

**See:** SMS_NOTIFICATIONS_RESEARCH.md for detailed implementation guide and cost analysis

---

### Phase 4: Module Expansion (8-12 weeks per module)

**Goal:** Add support for additional game systems

#### 4.1: Magic: The Gathering Module

**Considerations:**
- Different pairing systems (Swiss)
- Different tiebreakers (OMW%, GW%, OGW%)
- Deck registration
- Formats (Standard, Modern, Draft, Sealed)
- Match best-of-3 structure
- Playoff structure (Top 8 single elimination)

**Timeline:** 8-10 weeks

---

#### 4.2: Warhammer 40k Module

**Considerations:**
- Different scenarios
- Army list submission
- Painting requirements
- Custom missions
- Variable game length

**Timeline:** 8-10 weeks

---

#### 4.3: Additional Game Systems

Based on user demand:
- Age of Sigmar
- X-Wing
- Star Wars Legion
- Other miniature games
- Board game tournaments

**Timeline:** 6-10 weeks each

---

### Phase 5: Advanced Features (Ongoing)

**Goal:** Add features that increase platform value

#### 5.1: Social Features

- [ ] Friend system
- [ ] Player messaging
- [ ] Tournament chat/forums
- [ ] Team/club management
- [ ] Share tournament results to social media
- [ ] Spectator mode (follow players, view tournaments without competing)
- [ ] Follow favorite players feature

---

#### 5.2: Marketplace/Store Integration

- [ ] Event ticketing
- [ ] **Entry fee collection (Moved to Phase 2.7)**
- [ ] Prize pool management
- [ ] Store credit tracking
- [ ] Payment processing (Stripe)

---

#### 5.3: League Management

- [ ] **Leagues format (Moved to Phase 2.4)**
- [ ] Season-long leagues
- [ ] Cumulative rankings
- [ ] League playoffs
- [ ] Championship events

---

#### 5.4: Streaming Integration

- [ ] Featured table designation
- [ ] Stream overlay data API
- [ ] Live match viewing
- [ ] Commentary tools

---

#### 5.5: AI & Analytics

**Predictive Analytics:**
- [ ] Meta analysis
- [ ] List strength predictions
- [ ] Matchup win rates
- [ ] Player performance predictions
- [ ] Tournament outcome predictions

**AI-Powered Features:**
- [ ] **AI-generated statistics summaries** (natural language summaries of player performance)
- [ ] **Tournament recap generation** (automated narrative summaries)
- [ ] **Player strengths/weaknesses analysis** (AI-powered insights)
- [ ] **Matchup advice** (AI recommendations based on historical data)
- [ ] **Performance trend analysis** (AI-detected patterns)
- [ ] **Personalized improvement suggestions**

**Value:** Helps players understand their performance without manual analysis. Creates engaging content automatically.

---

#### 5.6: Advanced Tournament Management (Future)

- [ ] Referee/staff management system
- [ ] Sponsor & advertising management
- [ ] Hotel & travel integration for major events
- [ ] External rating system integration
- [ ] Conflict detection for multi-tournament play
- [ ] Prize distribution tracking & history

---

## Timeline Overview

```
Months 1-2:  Phase 0 - Foundation
Months 2-4:  Phase 1 - MVP Core Features
Months 5-6:  Phase 2 - Enhancement & Polish
Months 7-8:  Phase 3 - Scaling & Admin Tools
Month 9+:    Phase 4 - Module Expansion
```

**MVP Target:** End of Month 4  
**Public Beta:** End of Month 6  
**Version 1.0:** End of Month 8

---

## Feature Priority Matrix

### Must Have (MVP)
- User authentication
- Tournament creation
- Swiss pairing
- Match results
- Live standings
- Warmachine Steamroller support

### Should Have (Beta)
- Mobile apps
- Push notifications
- Enhanced statistics
- Admin dashboard

### Nice to Have (v1.0)
- Team tournaments
- Deathclock integration
- Social features
- Multiple game systems

### Future
- Marketplace integration
- Streaming tools
- AI analytics
- League management

---

## Risk Management

### Technical Risks

**Risk:** Pairing algorithm bugs
- **Mitigation:** Extensive testing, manual override capability
- **Impact:** High
- **Probability:** Medium

**Risk:** Database performance at scale
- **Mitigation:** Proper indexing, caching, query optimization
- **Impact:** High
- **Probability:** Medium

**Risk:** Real-time updates overwhelming server
- **Mitigation:** WebSocket connection limits, throttling
- **Impact:** Medium
- **Probability:** Low

---

### Business Risks

**Risk:** Low user adoption
- **Mitigation:** Focus on Warmachine community first, get TO feedback
- **Impact:** High
- **Probability:** Medium

**Risk:** Competition from existing platforms
- **Mitigation:** Focus on superior UX, mobile-first approach
- **Impact:** Medium
- **Probability:** Medium

**Risk:** Hosting costs exceed budget
- **Mitigation:** Start cheap (Supabase free tier), scale gradually
- **Impact:** Medium
- **Probability:** Low

---

## Success Metrics

### Phase 1 (MVP)
- 50+ registered users
- 10+ tournaments run successfully
- 5+ repeat tournament organizers
- < 5 critical bugs reported
- 90%+ uptime

### Phase 2 (Beta)
- 250+ registered users
- 50+ tournaments
- 20+ active tournament organizers
- Mobile apps published
- Push notifications working

### Phase 3 (v1.0)
- 1000+ registered users
- 200+ tournaments
- 50+ active tournament organizers
- Support for 100+ player events
- < 2 second average API response time

### Phase 4 (Expansion)
- 2500+ users
- 500+ tournaments
- 2+ game systems supported
- Positive user reviews (4+ stars)

---

## Go/No-Go Decision Points

### After Phase 1 (MVP)
**Evaluate:**
- Are TOs actually using it?
- Does the pairing algorithm work correctly?
- Are there critical bugs?
- Do we have positive feedback?

**Decision:** Continue to Phase 2 or pivot?

---

### After Phase 2 (Beta)
**Evaluate:**
- User growth trajectory
- Hosting costs vs. value
- Community engagement
- Feature requests

**Decision:** Continue to Phase 3 or focus on different game system?

---

### After Phase 3 (v1.0)
**Evaluate:**
- Monthly active users
- Tournament frequency
- Revenue potential (if applicable)
- Competition landscape

**Decision:** Expand to new games or deepen Warmachine features?

---

## Version History

### v0.1 - Foundation (Target: Dec 2025)
- Database schema
- Basic API
- Authentication
- Development environment

### v0.5 - MVP (Target: Feb 2026)
- Tournament creation
- Swiss pairing
- Match results
- Live standings

### v0.8 - Beta (Target: Apr 2026)
- Mobile apps
- Push notifications
- Enhanced statistics
- Polish and bug fixes

### v1.0 - Production (Target: June 2026)
- Admin dashboard
- Performance optimized
- Full Warmachine Steamroller support
- Deployed on production infrastructure

### v1.x - Expansion (Target: Aug 2026+)
- Additional game systems
- Advanced features
- Community features

---

## Notes

- Timeline is aggressive but achievable with dedicated development
- Priorities may shift based on user feedback
- Focus on getting MVP right before expanding
- User experience is more important than feature count
- Build for scale from day one (proper indexes, architecture)
- Test extensively with real tournament organizers
- Document everything for future developers

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** End of Phase 0
