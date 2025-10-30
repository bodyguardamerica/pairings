# Quick Start Checklist

Use this checklist to track your progress setting up the project.

## Phase 1: Software Installation

- [ ] Node.js installed (v18+)
  - Test: Open Command Prompt, run `node --version`
- [ ] npm installed (comes with Node.js)
  - Test: Run `npm --version`
- [ ] Git installed (optional)
  - Test: Run `git --version`
- [ ] VS Code installed
- [ ] VS Code extensions installed:
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Thunder Client
  - [ ] GitLens

## Phase 2: Supabase Setup

- [ ] Created Supabase account at supabase.com
- [ ] Created new project named "pairings-db"
- [ ] Saved database password securely
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Copied service_role key
- [ ] Copied database connection string
- [ ] Replaced [YOUR-PASSWORD] in connection string

## Phase 3: Project Setup

- [ ] Downloaded/cloned project files
- [ ] Opened project in VS Code
- [ ] Navigated to backend folder: `cd backend`
- [ ] Installed dependencies: `npm install`
- [ ] Created .env file from .env.example
- [ ] Pasted Supabase credentials into .env file
- [ ] Changed JWT_SECRET to something random
- [ ] Saved .env file

## Phase 4: Start Backend

- [ ] Ran `npm run dev` in backend folder
- [ ] Saw success message with 🚀 emoji
- [ ] Tested http://localhost:3000/health in browser
- [ ] Received JSON response with "status": "ok"

## ✅ Backend Setup Complete!

## Phase 5: Next Steps (Coming Soon)

- [ ] Set up frontend
- [ ] Create database tables
- [ ] Implement authentication
- [ ] Build tournament features

---

## Quick Commands Reference

**Start backend:**
```cmd
cd backend
npm run dev
```

**Stop backend:**
- Press Ctrl + C in terminal

**Restart backend:**
- Stop it (Ctrl + C)
- Run `npm run dev` again

**Install new package:**
```cmd
npm install package-name
```

**Check for errors:**
- Look at terminal output
- Check .env file has correct values
- Make sure Supabase project is active

---

## File Locations

- Backend code: `backend/src/`
- Environment variables: `backend/.env`
- Dependencies: `backend/package.json`
- Detailed setup guide: `WINDOWS-SETUP.md`
- Main readme: `README.md`

---

**Estimated Setup Time:** 30-45 minutes  
**Current Phase:** Phase 0 - Foundation  
**Status:** Backend ✅ | Frontend ⏳ | Database ⏳
