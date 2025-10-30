# Quick Start - Get the App Running in 10 Minutes! ⚡

Follow these steps to get both the backend and frontend running.

---

## ⚙️ Step 1: Set Up Backend (5 minutes)

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

Wait ~2-3 minutes for installation to complete.

### 1.2 Create Database (Supabase - Free)

1. Go to **[supabase.com](https://supabase.com)** and sign up (free)
2. Click **"New Project"**
3. Enter:
   - Name: `pairings-db`
   - Password: (choose a strong password - save it!)
   - Region: (choose closest to you)
4. Click **"Create new project"** (~2 minutes to provision)

### 1.3 Get Database Credentials

In Supabase:

1. **Settings** → **Database**
   - Copy **Connection Pooling** → **Transaction** mode URL
   - It looks like: `postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

2. **Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key
   - Copy **service_role** key

### 1.4 Configure Environment

```bash
cd backend
copy .env.example .env
```

Open `.env` in VS Code and paste your credentials:

```env
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
JWT_SECRET=change-this-to-something-random-like-abc123xyz789
NODE_ENV=development
PORT=3000
```

### 1.5 Run Database Migrations

```bash
npm run migrate
```

You should see:
```
✅ Migration 001_create_users.sql executed successfully
✅ Migration 002_create_tournaments.sql executed successfully
```

### 1.6 Start Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📍 Environment: development
🏥 Health check: http://localhost:3000/health
```

**✅ Backend is running!**

Keep this terminal window open.

---

## 📱 Step 2: Set Up Frontend (5 minutes)

### 2.1 Open New Terminal Window

Open a **new** terminal (don't close the backend terminal!)

### 2.2 Install Dependencies

```bash
cd frontend
npm install
```

Wait ~2-3 minutes for installation.

### 2.3 Configure API URL

#### Option A: Testing on Your Phone (Recommended)

1. **Find your computer's IP address:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your Wi-Fi adapter.
Example: `192.168.1.100`

**Mac:**
```bash
ifconfig | grep "inet "
```
Look for something like `192.168.1.100`

2. **Edit the API configuration:**

Open `frontend/src/services/api.js` in VS Code.

**Change line 4** from:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

To (using YOUR IP address):
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

#### Option B: Testing on iOS Simulator

Keep the default:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

#### Option C: Testing on Android Emulator

Change to:
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

### 2.4 Start Frontend

```bash
npm start
```

You should see:
```
 › Metro waiting on exp://192.168.1.100:8081
 › Scan the QR code above with Expo Go
```

### 2.5 Open on Your Phone

1. **Install Expo Go:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Scan QR Code:**
   - **iOS:** Use Camera app → Point at QR code → Tap notification
   - **Android:** Open Expo Go app → Tap "Scan QR Code" → Scan

3. **Wait for app to load** (~30-60 seconds first time)

**✅ Frontend is running!**

---

## 🎉 Step 3: Test the App

### 3.1 Register an Account

1. You should see the login screen
2. Tap **"Register"** at the bottom
3. Fill in the form:
   - **Email:** `test@example.com`
   - **Username:** `testuser`
   - **Password:** `Password123` (needs uppercase, lowercase, number)
   - **First/Last Name:** (optional)
4. Tap **"Register"**

### 3.2 Explore

You're now logged in! Try:
- **Browse tournaments** - See the list (may be empty)
- **Search** - Use the search bar
- **Filter** - Tap filter chips (All, Registration, Active, Completed)
- **Profile** - Tap the profile icon at bottom
- **Logout** - Button in profile

---

## ✅ Success Checklist

You're all set if:
- [x] Backend shows "Server running on port 3000"
- [x] Frontend shows QR code and "Metro waiting..."
- [x] App opened on your phone
- [x] You can see the login screen
- [x] You registered a new account
- [x] You can browse tournaments

**🎉 Congratulations! The app is working!**

---

## 🐛 Common Issues

### "Cannot connect to API"

**Fix 1:** Check backend is running
- Look for "Server running" message in backend terminal
- Visit `http://localhost:3000/health` in browser
- Should see: `{"status":"ok",...}`

**Fix 2:** Check IP address
- Make sure you used the right IP in `api.js`
- Phone and computer must be on **same Wi-Fi network**

**Fix 3:** Check firewall
- Windows Firewall might block Node.js
- Temporarily disable or add Node.js to allowed apps

### "Module not found" errors

```bash
# In the appropriate directory:
npm install
```

### "Expo Go won't scan QR code"

**Solutions:**
1. Make sure phone camera has permission
2. Try typing the URL manually in Expo Go
3. Use tunnel mode: `npm start --tunnel`

### Backend won't start

**Check:**
1. Port 3000 is not in use (change in .env if needed)
2. Database credentials are correct
3. Migrations ran successfully

---

## 📝 Next Steps

Now that everything is working:

1. **Explore the code:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Read documentation:**
   - [Backend README](backend/README_COMPLETE.md)
   - [Frontend README](frontend/README.md)
   - [API Docs](docs/API_IMPLEMENTED.md)

3. **Start developing:**
   - Add features
   - Create tournaments
   - Test the pairing system

---

## 🛟 Need Help?

**Documentation:**
- [Complete Setup Guide](FRONTEND_SETUP.md)
- [Backend Setup](backend/README_COMPLETE.md)
- [API Reference](docs/API_IMPLEMENTED.md)
- [Troubleshooting](FRONTEND_SETUP.md#troubleshooting)

**Common Commands:**

```bash
# Backend
cd backend
npm run dev              # Start backend
npm run migrate          # Run migrations

# Frontend
cd frontend
npm start                # Start frontend
npm run android          # Open Android
npm run ios              # Open iOS
```

---

**Ready to build the next great tournament app! 🚀**

**Last Updated:** October 2025
