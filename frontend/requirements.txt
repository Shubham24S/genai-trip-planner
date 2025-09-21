# 📦 EaseMyTrip AI Travel Planner - Complete Setup Guide

## 🚨 QUICK SETUP FOR TEAMMATES (5 minutes)

### 1. Prerequisites Installation

#### For Windows:
1. **Download and install Node.js**: https://nodejs.org/en/download/
   - Choose "Windows Installer (.msi)" for 64-bit
   - During installation, check "Automatically install the necessary tools"
   
2. **Verify installation** (open PowerShell/CMD):
   ```bash
   node --version  # Should show v18.0.0 or higher
   npm --version   # Should show 9.0.0 or higher
   ```

#### For Mac:
1. **Install Node.js**: https://nodejs.org/en/download/
   - Choose "macOS Installer (.pkg)"
   
2. **Or use Homebrew** (if you have it):
   ```bash
   brew install node
   ```

#### For Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/yourusername/easemytrip-genai-trip-planner.git
cd easemytrip-genai-trip-planner

# Install root dependencies (if any)
npm install
```

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Install ALL backend dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env
# OR create manually:
touch .env
```

**Add to backend/.env file:**
```env
GEMINI_API_KEY=AIzaSyExample_Replace_With_Your_Key
GOOGLE_MAPS_API_KEY=AIzaSyExample_Replace_With_Your_Maps_Key
PORT=5000
NODE_ENV=development
```

**Start backend:**
```bash
npm start
# Should show: 🚀 Server running on port 5000
```

### 4. Frontend Setup

```bash
# Open NEW terminal/command prompt
cd frontend

# Install ALL frontend dependencies
npm install --legacy-peer-deps

# Start frontend
npm start
# Should open browser to http://localhost:3000
```

## 📋 Exact Package Versions (For Troubleshooting)

### Backend Dependencies (`backend/package.json`):
```json
{
  "name": "easemytrip-backend",
  "version": "1.0.0",
  "description": "Backend for EaseMyTrip AI Travel Planner",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@google/generative-ai": "^0.15.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.1.4",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  },
  "keywords": ["travel", "ai", "hackathon"],
  "author": "Your Team",
  "license": "MIT"
}
```

### Frontend Dependencies (`frontend/package.json`):
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@google/generative-ai": "^0.15.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  },
  "proxy": "http://localhost:5000"
}
```

## 🔧 Common Issues & Solutions

### ❌ "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
# OR on Windows:
rd /s /q node_modules & del package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

### ❌ "react-scripts not found"
```bash
cd frontend
npm install react-scripts@5.0.1 --save
npm start
```

### ❌ "Cannot find module '@google/generative-ai'"
```bash
cd backend
npm install @google/generative-ai --save
```

### ❌ "Port 3000/5000 already in use"
```bash
# Kill processes on ports
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### ❌ Backend not responding
1. Check `.env` file exists in `backend/` folder
2. Verify Gemini API key is correct (starts with `AIzaSy`)
3. Restart backend server (`Ctrl+C` then `npm start`)

## 🚀 One-Command Setup Script

Create this file as `setup.sh` (Mac/Linux) or `setup.bat` (Windows):

### setup.sh (Mac/Linux):
```bash
#!/bin/bash
echo "🚀 Setting up EaseMyTrip AI Travel Planner..."

# Backend setup
cd backend
echo "📦 Installing backend dependencies..."
npm install --legacy-peer-deps

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file - PLEASE ADD YOUR API KEYS!"
    echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
    echo "GOOGLE_MAPS_API_KEY=your_maps_api_key_here" >> .env
    echo "PORT=5000" >> .env
    echo "NODE_ENV=development" >> .env
fi

# Frontend setup
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install --legacy-peer-deps

echo "✅ Setup complete!"
echo "🔑 Don't forget to add your API keys to backend/.env"
echo "🚀 Start backend: cd backend && npm start"
echo "🎨 Start frontend: cd frontend && npm start"
```

### setup.bat (Windows):
```batch
@echo off
echo 🚀 Setting up EaseMyTrip AI Travel Planner...

rem Backend setup
cd backend
echo 📦 Installing backend dependencies...
npm install --legacy-peer-deps

rem Check if .env exists
if not exist ".env" (
    echo ⚠️  Creating .env file - PLEASE ADD YOUR API KEYS!
    echo GEMINI_API_KEY=your_gemini_api_key_here > .env
    echo GOOGLE_MAPS_API_KEY=your_maps_api_key_here >> .env
    echo PORT=5000 >> .env
    echo NODE_ENV=development >> .env
)

rem Frontend setup
cd ..\frontend
echo 📦 Installing frontend dependencies...
npm install --legacy-peer-deps

echo ✅ Setup complete!
echo 🔑 Don't forget to add your API keys to backend\.env
echo 🚀 Start backend: cd backend && npm start
echo 🎨 Start frontend: cd frontend && npm start
pause
```

## 📱 Testing Instructions

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"message":"EaseMyTrip AI Backend is running!","timestamp":"...","status":"healthy"}
```

### 2. Test Frontend
1. Open browser to `http://localhost:3000`
2. You should see the EaseMyTrip AI Travel Planner form
3. Fill in sample data:
   - Destination: "Goa"
   - Duration: 3
   - Budget: 25000
   - Select some interests
4. Click "🚀 Create My AI Trip Plan"
5. Wait 30-60 seconds for AI response

### 3. Test Full Integration
- Backend running on port 5000 ✅
- Frontend running on port 3000 ✅  
- Form submits successfully ✅
- AI generates itinerary ✅
- Results display properly ✅

## 🆘 Emergency Contact

If teammates still face issues:
1. **Check Node.js version**: Must be v18.0+
2. **Use `--legacy-peer-deps`** flag for all npm installs
3. **Clear browser cache** (Ctrl+Shift+R)
4. **Restart both servers** after any changes
5. **Share error screenshots** in team chat

## 🔗 Quick Links

- **Node.js Download**: https://nodejs.org/
- **VS Code**: https://code.visualstudio.com/
- **Gemini API**: https://aistudio.google.com/
- **Maps API**: https://console.cloud.google.com/

---

**⏰ Time-Saving Tip**: Run the setup script first, then ask for help if specific errors occur!