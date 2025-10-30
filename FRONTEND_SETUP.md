# Frontend Setup Guide - Pairings Project

## Complete Setup Instructions

### Prerequisites

Before starting, ensure you have:
- [x] Node.js v18+ installed
- [x] Backend running on `http://localhost:3000`
- [ ] Expo Go app on your phone (download from App Store or Google Play)

---

## Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

---

## Step 2: Install Dependencies (Already Done!)

Dependencies have been installed. If you need to reinstall:

```bash
npm install
```

---

## Step 3: Configure API URL

The API URL needs to be configured based on how you're running the app:

### Option A: Testing on Physical Device (Recommended)

1. Find your computer's IP address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (something like `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```
Look for your local network IP (something like `192.168.1.100`)

2. Edit `src/services/api.js`:

Change line 4 to:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
```

For example:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

### Option B: Testing on iOS Simulator

Keep the default:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Option C: Testing on Android Emulator

Change to:
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

---

## Step 4: Start the Development Server

```bash
npm start
```

You should see:
```
 › Metro waiting on exp://192.168.1.100:8081
 › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

## Step 5: Open the App

### On Physical Device (Recommended)

1. **Install Expo Go:**
   - iOS: Download from App Store
   - Android: Download from Google Play

2. **Scan QR Code:**
   - iOS: Use Camera app to scan QR code
   - Android: Open Expo Go app and scan QR code

3. **Wait for app to load:**
   - First time may take 1-2 minutes
   - You'll see "Opening on..." then the app will start

### On iOS Simulator

Press `i` in the terminal where `npm start` is running

### On Android Emulator

Press `a` in the terminal where `npm start` is running

---

## Step 6: Test the App

### Create a New Account

1. On the login screen, tap "Register"
2. Fill in the form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `Password123` (must have uppercase, lowercase, and number)
   - First Name: (optional)
   - Last Name: (optional)
3. Tap "Register"

### Explore the App

- **Tournaments Tab:** Browse tournaments
- **Profile Tab:** View your profile and statistics
- **Search:** Use the search bar to find tournaments
- **Filters:** Filter by status (All, Registration, Active, Completed)

---

## Troubleshooting

### Issue: "Cannot connect to API"

**Solution:** Check your API_BASE_URL configuration

1. Make sure backend is running:
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `🚀 Server running on port 3000`

2. Make sure your phone and computer are on the **same Wi-Fi network**

3. Update `src/services/api.js` with correct IP address

### Issue: "Network request failed"

**Cause:** Backend is not accessible

**Solutions:**
1. Check backend is running
2. Check firewall settings (Windows Firewall might block connections)
3. Temporarily disable firewall for testing:
   - Windows: Settings → Windows Security → Firewall → Allow an app
   - Add Node.js to allowed apps

### Issue: "Module not found"

**Solution:**
```bash
npm install
```

### Issue: "Expo Go won't connect"

**Solutions:**
1. Make sure phone and computer on same Wi-Fi
2. Restart Expo server (Ctrl+C then `npm start`)
3. Restart Expo Go app on phone
4. Try tunnel mode: `npm start --tunnel`

### Issue: "White screen / App crashes"

**Solutions:**
1. Shake device to open dev menu
2. Tap "Reload"
3. Check backend is running
4. Check for errors in terminal

---

## Development Tips

### Hot Reload

The app automatically reloads when you save files. No need to restart!

### Dev Menu

Shake your device or press:
- iOS Simulator: Cmd+D
- Android Emulator: Cmd+M (Mac) or Ctrl+M (Windows)

Options:
- Reload - Refresh the app
- Debug - Open debugger
- Show Inspector - Inspect elements
- Toggle Performance Monitor - See FPS

### Viewing Logs

All console.log() statements appear in the terminal where you ran `npm start`

---

## Project Structure

```
frontend/
├── App.js                          # Main entry point
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── common/                 # Buttons, Inputs, Cards
│   │   ├── tournament/             # Tournament cards
│   │   └── profile/                # Profile components
│   ├── screens/                    # App screens
│   │   ├── auth/                   # Login, Register
│   │   ├── tournaments/            # Tournament screens
│   │   └── profile/                # Profile screen
│   ├── navigation/                 # Navigation config
│   ├── services/                   # API client
│   ├── utils/                      # Helper functions
│   └── constants/                  # Colors, spacing, typography
└── assets/                         # Images, fonts
```

---

## Features Implemented

### Authentication ✅
- [x] Login with email/username and password
- [x] Registration with validation
- [x] JWT token storage
- [x] Auto-logout on token expiry

### Tournaments ✅
- [x] Browse all tournaments
- [x] Search tournaments by name
- [x] Filter by status (Draft, Registration, Active, Completed)
- [x] View tournament details
- [x] View registered players
- [x] View live standings
- [x] Refresh data with pull-to-refresh

### Profile ✅
- [x] View user profile
- [x] Display statistics (tournaments played, matches, win rate)
- [x] Show averages (CP, AP)
- [x] Display faction usage
- [x] Logout functionality

### UI/UX ✅
- [x] Purple gradient design system
- [x] Responsive layouts
- [x] Loading states
- [x] Error handling
- [x] Status badges
- [x] Bottom tab navigation

---

## Next Steps (TODO)

These features are planned but not yet implemented:

1. **Tournament Registration**
   - Modal to select faction
   - Submit registration

2. **Match Result Submission**
   - Full Warmachine scoring form
   - Scenario selection
   - CP/AP entry

3. **Tournament Creation (TO Only)**
   - Create new tournaments
   - Set max players, rounds, etc.

4. **Round Management (TO Only)**
   - Create new rounds
   - View pairings
   - Manage matches

5. **Enhancements**
   - Real-time updates
   - Push notifications
   - Image uploads for army lists
   - Offline mode

---

## Testing Checklist

- [ ] Register a new account
- [ ] Login with credentials
- [ ] View tournament list
- [ ] Search for tournaments
- [ ] Filter tournaments by status
- [ ] Tap on a tournament to view details
- [ ] Switch between Info, Players, Standings tabs
- [ ] Pull to refresh data
- [ ] View your profile
- [ ] Check statistics display
- [ ] Logout
- [ ] Login again

---

## Common Development Tasks

### Adding a New Screen

1. Create screen file in `src/screens/`
2. Add to navigation in `src/navigation/AppNavigator.js`
3. Follow design system in `DESIGN-SYSTEM.md`

### Adding a New Component

1. Create component in `src/components/common/`
2. Use constants from `src/constants/`
3. Make it reusable

### Calling a New API Endpoint

1. Add function to `src/services/api.js`
2. Use in screen with async/await
3. Handle loading and error states

---

## Performance Tips

- Use FlatList for long lists (already implemented)
- Avoid inline styles (we use StyleSheet)
- Optimize images before adding
- Use memo for expensive components
- Profile with Performance Monitor

---

## Getting Help

### Backend Issues
See [backend/README_COMPLETE.md](../backend/README_COMPLETE.md)

### API Questions
See [docs/API_IMPLEMENTED.md](../docs/API_IMPLEMENTED.md)

### Design Questions
See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)

### Expo Issues
- Official docs: https://docs.expo.dev/
- Forums: https://forums.expo.dev/

---

## Success! 🎉

If you can see the login screen and register a new account, you're all set!

The frontend is now connected to your backend and ready for development.

---

**Last Updated:** October 2025
**Status:** MVP Complete
**Version:** 1.0.0
