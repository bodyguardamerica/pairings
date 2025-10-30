# Pairings Frontend - React Native (Expo)

Tournament management mobile app for Warmachine and other tabletop games.

## Quick Start

### Prerequisites
- Node.js v18+
- Expo Go app on your phone (iOS/Android)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure API URL**

Edit `src/services/api.js` and update the `API_BASE_URL`:

For local development with physical device:
```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

For iOS Simulator:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

For Android Emulator:
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

3. **Start the Development Server**
```bash
npm start
```

4. **Open on Your Device**
- Scan the QR code with Expo Go app (iOS/Android)
- Or press `i` for iOS Simulator, `a` for Android Emulator

## Project Structure

```
frontend/
├── App.js                          # Main app entry
├── src/
│   ├── components/
│   │   ├── common/                 # Reusable components
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── Badge.js
│   │   ├── tournament/            # Tournament-specific components
│   │   │   └── TournamentCard.js
│   │   └── profile/               # Profile components
│   ├── screens/
│   │   ├── auth/                  # Login, Register
│   │   ├── tournaments/           # Tournament screens
│   │   └── profile/               # Profile screen
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation setup
│   ├── services/
│   │   └── api.js                 # API client
│   ├── utils/
│   │   └── auth.js                # Auth helpers
│   └── constants/
│       ├── colors.js              # Color palette
│       ├── typography.js          # Font sizes/weights
│       └── spacing.js             # Spacing scale
└── assets/
    └── images/
```

## Features Implemented

### Phase 1 - MVP ✅
- [x] User authentication (Login/Register)
- [x] Tournament list with search and filters
- [x] Tournament details (Info, Players, Standings tabs)
- [x] User profile with statistics
- [x] Responsive design
- [x] API integration
- [x] Token-based authentication

### Phase 2 - Enhancements (TODO)
- [ ] Tournament registration flow
- [ ] Submit match results screen
- [ ] Create tournament (TO only)
- [ ] Create round (TO only)
- [ ] Real-time updates
- [ ] Push notifications
- [ ] Image uploads

## Design System

The app follows the design system in [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md):

**Colors:**
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)

**Components:**
- PrimaryButton - Gradient background
- SecondaryButton - Solid color
- OutlineButton - Bordered
- Input - With label and error states
- Card - Elevated with shadow
- Badge - Status indicators

## API Integration

The app connects to the backend API at `http://localhost:3000/api`

**Endpoints Used:**
- POST `/auth/register` - Create account
- POST `/auth/login` - Login
- GET `/auth/profile` - Get user profile
- GET `/tournaments` - List tournaments
- GET `/tournaments/:id` - Tournament details
- GET `/tournaments/:id/players` - Players list
- GET `/tournaments/:id/standings` - Live standings
- GET `/tournaments/players/:id/statistics` - Player stats

See [../docs/API_IMPLEMENTED.md](../docs/API_IMPLEMENTED.md) for complete API documentation.

## Development

### Running the App

```bash
npm start
```

### Available Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Open Android app
- `npm run ios` - Open iOS app
- `npm run web` - Open in web browser

### Debugging

- Shake device to open Dev Menu
- Enable Remote Debugging in Dev Menu
- Use React Native Debugger for better experience

## Common Issues

### Cannot connect to backend

**Solution:** Update API_BASE_URL in `src/services/api.js`

For physical device, use your computer's IP address:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Then update to: `http://YOUR_IP:3000/api`

### Module not found errors

```bash
npm install
```

### Expo Go connection issues

Make sure your phone and computer are on the same Wi-Fi network.

## Testing

### Test Users (if backend has seed data)

```
Username: player1
Password: Password123

Username: organizer
Password: Password123
```

### Test Flow

1. Register a new account
2. Browse tournaments
3. View tournament details
4. Check profile and stats
5. Logout and login again

## Deployment

### Build for Production

**iOS:**
```bash
expo build:ios
```

**Android:**
```bash
expo build:android
```

### Publish Update

```bash
expo publish
```

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **LinearGradient** - Gradient backgrounds

## Contributing

When adding new screens:
1. Follow the design system in DESIGN-SYSTEM.md
2. Use existing components from `src/components/common/`
3. Connect to API using `src/services/api.js`
4. Handle loading/error states
5. Test on both iOS and Android

## Next Steps

1. Implement tournament registration modal
2. Add submit match result screen
3. Create tournament creation flow (TO)
4. Add round creation (TO)
5. Implement real-time standings updates
6. Add player statistics graphs
7. Implement push notifications

## License

MIT

## Support

For issues with the backend, see [../backend/README_COMPLETE.md](../backend/README_COMPLETE.md)

For API questions, see [../docs/API_IMPLEMENTED.md](../docs/API_IMPLEMENTED.md)

---

**Version:** 1.0.0
**Status:** MVP Complete
**Last Updated:** October 2025
