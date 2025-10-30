@echo off
echo =====================================
echo Pairings Project - Setup Script
echo =====================================
echo.

echo Step 1: Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
    node --version
)
echo.

echo Step 2: Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
) else (
    echo [OK] npm is installed
    npm --version
)
echo.

echo Step 3: Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Git is not installed
    echo You can download it from: https://git-scm.com/download/win
) else (
    echo [OK] Git is installed
    git --version
)
echo.

echo Step 4: Installing backend dependencies...
cd backend
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [ACTION REQUIRED] Please edit backend/.env with your Supabase credentials!
)
echo Installing npm packages (this may take a few minutes)...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo NEXT STEPS:
echo 1. Create a Supabase account at https://supabase.com
echo 2. Create a new project
echo 3. Edit backend/.env with your Supabase credentials
echo 4. Run: cd backend
echo 5. Run: npm run dev
echo 6. Visit: http://localhost:3000/health
echo.
echo For detailed instructions, see README.md
echo.
pause
