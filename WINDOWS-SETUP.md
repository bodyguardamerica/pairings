# Windows Setup Guide - Step by Step

This guide will walk you through setting up the Pairings Project on Windows.

---

## Part 1: Install Required Software (15-30 minutes)

### 1.1 Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Click **Next** through all steps (use default settings)
5. Click **Install**
6. Wait for installation to complete

**Verify Installation:**

Open **PowerShell** or **Command Prompt** (press Win + R, type `cmd`, press Enter)

```cmd
node --version
npm --version
```

You should see version numbers like:
```
v18.18.0
10.2.0
```

---

### 1.2 Install Git (Optional but Recommended)

1. Go to https://git-scm.com/download/win
2. Download the installer
3. Run the installer
4. Use **all default settings** (just keep clicking Next)
5. Click **Install**

**Verify Installation:**

```cmd
git --version
```

---

### 1.3 Install VS Code Extensions

Open VS Code, click the Extensions icon (or press Ctrl+Shift+X)

Install these extensions:
- **ESLint** (by Microsoft)
- **Prettier - Code formatter** (by Prettier)
- **Thunder Client** (by Thunder Client)
- **GitLens** (by GitKraken)

---

## Part 2: Set Up Supabase Database (10 minutes)

### 2.1 Create Supabase Account

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub, Google, or email
4. Confirm your email if needed

### 2.2 Create New Project

1. Click **New project**
2. Select your organization (or create one)
3. Fill in project details:
   - **Name:** `pairings-db` (or your choice)
   - **Database Password:** Create a strong password and **SAVE IT!**
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free (should be pre-selected)
4. Click **Create new project**
5. Wait ~2 minutes for setup

### 2.3 Get Your Credentials

**Get API Keys:**

1. In your project, go to **Settings** (gear icon on left sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this
   - **service_role** key - Copy this (click "Reveal" first)

Save these in a text file temporarily!

**Get Database Connection String:**

1. Still in Settings, click **Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the string (looks like `postgresql://postgres:[YOUR-PASSWORD]@...`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

---

## Part 3: Download and Set Up Project (10 minutes)

### 3.1 Download Project Files

**Option A - If you have Git:**

Open PowerShell or Command Prompt:

```cmd
cd C:\Users\YourUsername\Documents
git clone https://github.com/yourusername/pairings-project.git
cd pairings-project
```

**Option B - Without Git:**

1. Download the project as a ZIP file
2. Extract it to `C:\Users\YourUsername\Documents\pairings-project`
3. Open Command Prompt:
```cmd
cd C:\Users\YourUsername\Documents\pairings-project
```

### 3.2 Open in VS Code

```cmd
code .
```

This opens VS Code in the project folder.

---

## Part 4: Configure Backend (5 minutes)

### 4.1 Install Dependencies

In VS Code, open a **new terminal** (Terminal → New Terminal, or Ctrl + `)

```cmd
cd backend
npm install
```

This will take 2-3 minutes. You'll see a progress bar.

### 4.2 Create Environment File

In the terminal:

```cmd
copy .env.example .env
```

Or manually:
1. In VS Code file explorer, find `backend/.env.example`
2. Right-click → Copy
3. Right-click in the backend folder → Paste
4. Rename the copy to `.env` (remove `.example`)

### 4.3 Edit Environment File

1. Open `backend/.env` in VS Code
2. Replace the placeholders with your Supabase credentials from Part 2:

```env
# Replace these lines:
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-goes-here
SUPABASE_SERVICE_KEY=your-actual-service-key-goes-here

# Change this to something random:
JWT_SECRET=my-super-secret-key-change-this-12345
```

3. Save the file (Ctrl + S)

---

## Part 5: Start the Backend (2 minutes)

### 5.1 Run Development Server

In VS Code terminal (make sure you're in the `backend` folder):

```cmd
npm run dev
```

You should see:

```
🚀 Server running on port 3000
📍 Environment: development
🏥 Health check: http://localhost:3000/health
📚 API: http://localhost:3000/api
```

### 5.2 Test the Server

**Option A - Use Browser:**

1. Open your web browser
2. Go to: `http://localhost:3000/health`
3. You should see JSON response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "environment": "development",
  "version": "0.1.0"
}
```

**Option B - Use Thunder Client in VS Code:**

1. Click Thunder Client icon in VS Code sidebar
2. Click **New Request**
3. Enter URL: `http://localhost:3000/health`
4. Click **Send**
5. You should see the same JSON response

---

## ✅ Success! Backend is Running

You've successfully set up the backend! 

---

## Common Issues and Solutions

### Issue: "Port 3000 is already in use"

**Solution:** Change the port in `.env`:

```env
PORT=3001
```

Then restart: `npm run dev`

---

### Issue: "Cannot find module 'express'"

**Solution:** Re-install dependencies:

```cmd
cd backend
npm install
```

---

### Issue: "Database connection error"

**Solutions:**

1. Check your `.env` file has correct credentials
2. Verify your Supabase project is active (green status in Supabase dashboard)
3. Make sure you replaced `[YOUR-PASSWORD]` in the connection string
4. Try copying the connection string again from Supabase

---

### Issue: npm install is very slow

**Solution:** This is normal on first install. It's downloading all packages. Wait 3-5 minutes.

---

### Issue: "node is not recognized"

**Solution:** Node.js wasn't installed correctly. 

1. Restart your computer
2. Try opening a new Command Prompt
3. If still not working, reinstall Node.js

---

## What You've Accomplished

✅ Installed Node.js and npm  
✅ Set up Supabase database (free tier)  
✅ Downloaded and configured the backend  
✅ Successfully started the development server  
✅ Tested the health check endpoint  

---

## Next Steps

Now that the backend is running, you can:

1. **Set up the frontend** (React Native app)
2. **Create database tables** (migrations)
3. **Build authentication** (login/register)
4. **Implement tournament features**

We'll do these in the next sessions!

---

## Keeping Your Server Running

**To stop the server:**
- Press `Ctrl + C` in the terminal

**To start it again:**
```cmd
cd backend
npm run dev
```

**Multiple terminal windows:**
- You can have multiple terminals in VS Code
- Click the `+` icon in the terminal panel
- This lets you run backend and frontend simultaneously

---

## Getting Help

If you encounter any issues:

1. Check this guide first
2. Look at the error message carefully
3. Try the solutions in the "Common Issues" section
4. Check the main README.md file
5. Make sure all credentials in .env are correct

---

**Setup Time:** ~30-45 minutes total  
**Status:** Backend Ready ✅  
**Next:** Frontend Setup
