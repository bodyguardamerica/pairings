# Pairings Project - Universal Tournament Organizer

A complete web and mobile application for organizing tabletop game tournaments with automated pairings, live standings, and player statistics tracking.

**Primary Game Module:** Warmachine Steamroller 2025

**Status:** ✅ MVP Complete - Backend Ready (Frontend in progress)

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Expo Go** app on your phone (iOS/Android) - For testing the mobile app

### 1. Clone This Project

```bash
git clone https://github.com/yourusername/pairings-project.git
cd pairings-project
```

### 2. Set Up Backend

See [backend/README_COMPLETE.md](backend/README_COMPLETE.md) for detailed instructions.

**Quick Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

Backend will run on: `http://localhost:3000`

### 3. Set Up Frontend

See [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for detailed instructions.

**Quick Setup:**
```bash
cd frontend
npm install
# Edit src/services/api.js to set your API URL
npm start
```

Scan the QR code with Expo Go app to open the mobile app!

---

## 📱 What's Been Built

### Backend (Node.js + Express) ✅
Complete tournament management API with 26 endpoints: authentication, tournaments, players, rounds, matches, standings, Swiss pairings, and Warmachine scoring. See [Backend Setup](backend/README_COMPLETE.md) for details.

### Frontend (React Native + Expo) ✅  
Mobile-first tournament management app with full tournament operations. See [Frontend Setup](FRONTEND_SETUP.md) for details.

---

## 📁 Project Structure

```
pairings-project/
├── backend/                      # ✅ Complete
│   ├── src/
│   │   ├── core/                # Core tournament logic
│   │   │   ├── auth/            # Authentication
│   │   │   └── tournaments/     # Tournament management
│   │   ├── modules/             # Game-specific modules
│   │   │   └── warmachine/      # Warmachine Steamroller
│   │   ├── api/                 # API routes
│   │   ├── middleware/          # Auth & validation
│   │   ├── utils/               # Helpers
│   │   └── config/              # Database config
│   ├── database/
│   │   └── migrations/          # Database schema
│   └── .env                     # Environment variables
│
├── frontend/                     # ✅ Complete
│   ├── App.js                   # Main entry
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # Buttons, Inputs, Cards
│   │   │   └── tournament/      # Tournament cards
│   │   ├── screens/             # App screens
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── tournaments/     # Tournament screens
│   │   │   └── profile/         # Profile screen
│   │   ├── navigation/          # Navigation setup
│   │   ├── services/            # API client
│   │   ├── utils/               # Auth helpers
│   │   └── constants/           # Colors, typography
│   └── package.json
│
└── docs/                        # Documentation
    ├── API_IMPLEMENTED.md       # ✅ API reference
    ├── INDEX.md                 # ✅ Index
    ├── ARCHITECTURE.md          # ✅ Architecture
    ├── DATABASE.md              # ✅ Database schema
    ├── ROADMAP.md               # ✅ Roadmap
    └── DEPLOYMENT.md            # ✅ Deployment
```

---

## 🎯 Key Features

**Players:** Register for tournaments, submit match results, view live standings, track statistics  
**Tournament Organizers:** Create/manage tournaments, generate Swiss pairings, control tournament lifecycle, manage co-organizers  
**Admin:** System management features planned for Phase 3

---

## 🔧 Tech Stack

**Backend:** Node.js + Express, PostgreSQL (Supabase), JWT (Supabase Auth)  
**Frontend:** React Native + Expo, React Navigation, Axios  
**Database:** PostgreSQL with UUIDs, JSONB, proper indexes

---

## 📚 Documentation

**Setup:** [Backend Setup](backend/README_COMPLETE.md) | [Frontend Setup](FRONTEND_SETUP.md) | [Quick Start](QUICKSTART.md)  
**Technical:** [API Reference](docs/API_IMPLEMENTED.md) | [Architecture](docs/ARCHITECTURE.md) | [Database Schema](docs/DATABASE.md)  
**Frontend:** [Design System](frontend/DESIGN-SYSTEM.md) | [Requirements](FRONTEND_REQUIREMENTS.md)  
**Status:** [Current Status](PROJECT_STATUS_UPDATED.md) | [Admin Features (Planned)](ADMIN_FEATURES.md)

---

## 🧪 Testing

Backend: `npm run dev` → Visit http://localhost:3000/health  
Frontend: `npm start` → Scan QR with Expo Go  
Test accounts: alice@example.com, bob@example.com (Password123!)

---

## 🎨 Design System

Purple gradient primary (#667eea → #764ba2), modern components. See [DESIGN-SYSTEM.md](frontend/DESIGN-SYSTEM.md) for details.

---

## 🚦 Current Status

**Backend:** ✅ Complete - 26 API endpoints, Swiss pairings, Warmachine scoring  
**Frontend:** ⏳ In Progress - Core functionality being built  
**Next:** Phase 3 - Real-time updates, notifications, admin features

---

## 🛠️ Development

### Running Backend

```bash
cd backend
npm run dev          # Development with auto-reload
npm run start        # Production mode
npm run migrate      # Run database migrations
```

### Running Frontend

```bash
cd frontend
npm start            # Start Expo dev server
npm run android      # Open on Android
npm run ios          # Open on iOS
npm run web          # Open in browser
```

---


---

## 🐛 Troubleshooting

### Backend Issues

**Port in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**Database connection:**
- Check Supabase credentials in .env
- Verify project is running (green status)
- Use transaction pooler URL

### Frontend Issues

**Cannot connect to API:**
1. Check backend is running
2. Update API_BASE_URL in `src/services/api.js`
3. Use your computer's IP for physical devices

**Web scrolling not working:**
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. The app includes web-specific scroll fixes in App.js

**Dependencies:**
```bash
npm install
```

See [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for complete troubleshooting.

---

## 🔐 Security

JWT authentication (Supabase Auth), role-based access control, input validation, CORS, security headers, rate limiting.

---

## 🚀 Deployment

Backend: Railway/Heroku (free) or Hetzner VPS (production)  
Frontend: Expo Go (dev) → EAS Build (beta) → App Stores (prod)  
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

---

## 📝 License

MIT

---

## 🤝 Contributing

When contributing:
1. Follow the design system
2. Write tests for new features
3. Update documentation
4. Follow code style (ESLint + Prettier)

---

## 💬 Support

**Documentation:**
- Backend: [backend/README_COMPLETE.md](backend/README_COMPLETE.md)
- Frontend: [frontend/README.md](frontend/README.md)
- API: [docs/API_IMPLEMENTED.md](docs/API_IMPLEMENTED.md)

**Setup Help:**
- Backend Setup: See backend README
- Frontend Setup: [FRONTEND_SETUP.md](FRONTEND_SETUP.md)

---

## 🎉 Success!

If you can start backend (health check), start frontend (login screen), and browse tournaments → You're all set!

---

## 🗺️ Roadmap

**Phase 1:** ✅ Backend API complete  
**Phase 2:** ⏳ Frontend in progress  
**Phase 3:** Advanced features (real-time, notifications, admin)  
**Phase 4:** Additional game modules, enhanced features

---

**Version:** 2.1.0
**Status:** ✅ Backend Complete; Frontend in Progress
**Last Updated:** October 2025

---

**🏆 Built for the Warmachine Tournament Community 🏆**
