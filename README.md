# Pairings Project - Universal Tournament Organizer

A modern, mobile-first tournament management platform for tabletop gaming. Currently supporting Warmachine Steamroller 2025 format, with plans to expand to Magic: The Gathering, Warhammer, and other games.

**🚧 Status: In Development (Phase 0: Foundation)**

---

## Features

### For Players
- ✅ Create account and track statistics
- ✅ Register for tournaments
- ✅ Check in day-of
- ✅ View live pairings and standings
- ✅ Submit match results
- ✅ Receive push notifications for rounds
- ✅ View personal tournament history

### For Tournament Organizers
- ✅ Create and manage tournaments
- ✅ Automated Swiss pairing system
- ✅ Scenario selection (random or manual)
- ✅ Real-time standings calculation
- ✅ Check-in management
- ✅ Drop player handling
- ✅ Manual pairing adjustments

### For Admins
- ✅ User management (ban, role changes)
- ✅ Tournament oversight
- ✅ System analytics
- ✅ Audit logging

---

## Technology Stack

### Frontend
- **Framework:** React Native (Expo)
- **Deployment:** Vercel (web), App Stores (mobile)
- **State Management:** React Context / Redux

### Backend
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime / Socket.io

### Infrastructure
- **Development:** Local + Supabase (free tier)
- **Beta:** Railway.app + Supabase (free tier)
- **Production:** Hetzner VPS

---

## Documentation

All project documentation is in the `/docs` folder:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and technical architecture
- **[DATABASE.md](docs/DATABASE.md)** - Complete database schema
- **[API.md](docs/API.md)** - API endpoint specifications
- **[ROADMAP.md](docs/ROADMAP.md)** - Development timeline and feature plan
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guides for all environments

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pairings-project.git
cd pairings-project
```

2. **Set up Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Copy Project URL and API keys

3. **Set up Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run migrate
npm run dev
```

4. **Set up Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npx expo start
```

5. **Open in Expo Go**
   - Install Expo Go on your phone
   - Scan QR code from terminal
   - App should load

For detailed setup instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Project Structure

```
pairings-project/
├── docs/                  # All project documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── ROADMAP.md
│   └── DEPLOYMENT.md
│
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── core/        # Core system features
│   │   ├── modules/     # Game-specific modules
│   │   ├── api/         # API routes
│   │   ├── middleware/
│   │   └── utils/
│   ├── database/
│   │   └── migrations/
│   └── package.json
│
├── frontend/            # React Native (Expo) app
│   ├── src/
│   │   ├── core/       # Shared components
│   │   ├── modules/    # Game-specific screens
│   │   ├── screens/    # App screens
│   │   └── services/   # API client
│   ├── app.json
│   └── package.json
│
└── README.md           # This file
```

---

## Game Modules

### Warmachine (Steamroller 2025) - In Development
- ✅ Swiss pairing algorithm
- ✅ 6 official scenarios
- ✅ Deathclock system
- ✅ Army list submission
- ✅ Victory condition tracking
- ✅ Strength of schedule tiebreakers

### Coming Soon
- Magic: The Gathering
- Warhammer 40k
- Age of Sigmar

---

## Development Roadmap

### Phase 0: Foundation (Current)
Setting up infrastructure and core architecture

### Phase 1: MVP (Target: Feb 2026)
Basic tournament management with Warmachine support

### Phase 2: Enhancement (Target: Apr 2026)
Mobile apps, notifications, enhanced statistics

### Phase 3: Production (Target: Jun 2026)
Admin dashboard, performance optimization, scaling

### Phase 4: Expansion (Target: Aug 2026+)
Additional game systems and advanced features

See [ROADMAP.md](docs/ROADMAP.md) for detailed timeline.

---

## Contributing

We welcome contributions! Here's how you can help:

### For Developers
1. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) to understand the system
2. Check [ROADMAP.md](docs/ROADMAP.md) for current priorities
3. Create feature branch from `main`
4. Make changes and test thoroughly
5. Submit pull request with clear description

### For Tournament Organizers
- Test the platform and provide feedback
- Report bugs via GitHub issues
- Suggest features you'd like to see

### For Players
- Try the app and share your experience
- Report any issues you encounter
- Spread the word in your gaming community

---

## License

[To be determined - likely MIT or Apache 2.0]

---

## Contact & Community

- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/pairings-project/issues)
- **Discussions:** [Ask questions and share ideas](https://github.com/yourusername/pairings-project/discussions)
- **Discord:** [Coming soon]

---

## Acknowledgments

Inspired by [longshanks.org](https://longshanks.org) and the Warmachine community.

Built with love for the tabletop gaming community.

---

## Project Status

**Current Phase:** Phase 0 - Foundation  
**Version:** 0.1.0-alpha  
**Last Updated:** October 22, 2025

### What's Working
- ✅ Project documentation complete
- ✅ Database schema designed
- ✅ API specification defined
- ✅ Development roadmap established

### In Progress
- 🔄 Setting up development environment
- 🔄 Creating initial database migrations
- 🔄 Building authentication system

### Coming Next
- ⏳ Tournament creation
- ⏳ Swiss pairing algorithm
- ⏳ Match result recording
- ⏳ Live standings

---

## FAQ

**Q: When will it be ready to use?**  
A: We're targeting February 2026 for MVP with basic Warmachine support.

**Q: Will it support [my game]?**  
A: We're starting with Warmachine, then expanding to other games based on demand.

**Q: How much will it cost?**  
A: The platform will be free to use. Hosting costs are minimal (~$10/month at scale).

**Q: Can I help?**  
A: Yes! Check the Contributing section above.

**Q: Is there a mobile app?**  
A: Yes, mobile apps for iOS and Android are planned for Phase 2 (April 2026).

**Q: How is this different from existing platforms?**  
A: Modern tech stack, mobile-first design, modular game system support, and completely open source.

---

## Support This Project

This is a passion project built for the community. Ways to support:

- ⭐ Star this repository
- 🐛 Report bugs and test features
- 💡 Suggest improvements
- 📢 Share with your gaming community
- 🛠️ Contribute code or documentation

---

**Happy gaming! 🎲**
