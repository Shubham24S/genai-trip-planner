# 📦 AI Travel Planner — Setup Guide

## Prerequisites

- **Node.js v18+** — [nodejs.org](https://nodejs.org/en/download/)
- **npm** (comes with Node.js)
- A free **Groq API key** — [console.groq.com](https://console.groq.com)

Verify Node is installed:
```bash
node --version   # should show v18.0.0 or higher
npm --version    # should show 9.0.0 or higher
```

---

## 1. Clone the repository

```bash
git clone https://github.com/Shubham24S/ai-travel-planner.git
cd ai-travel-planner
```

---

## 2. Get your Groq API key

1. Go to [console.groq.com](https://console.groq.com) and sign up / log in (free)
2. In the left sidebar click **API Keys**
3. Click **Create API Key**, give it a name (e.g. `travel-planner-dev`)
4. Copy the key — it starts with `gsk_...`

---

## 3. Backend setup

```bash
cd backend
npm install
```

Create the environment file:

```bash
# Mac / Linux
touch .env

# Windows (PowerShell)
New-Item .env
```

Open `backend/.env` and add:

```env
GROQ_API_KEY=gsk_your_actual_key_here
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
🤖 Groq API key: ✅ loaded
```

Verify it's running by opening [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser. You should see `"status": "healthy"` and `"groqKeyLoaded": true`.

---

## 4. Frontend setup

Open a **new terminal window**:

```bash
cd frontend
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## 5. Test it

1. Enter a destination (e.g. **Goa**)
2. Set duration, budget, group size
3. Pick travel style and interests
4. Click **Create My AI Trip Plan**
5. Wait ~5–15 seconds for the AI response

---

## Backend dependencies (`backend/package.json`)

```json
{
  "name": "ai-travel-planner-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "groq-sdk": "^0.9.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.1.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

> **Important:** The old `@google/generative-ai` package is no longer used.
> Run `npm install` in the backend folder to get `groq-sdk` installed.

---

## Frontend dependencies (`frontend/package.json`)

No changes needed — the frontend just calls your own backend API and doesn't use any AI SDK directly.

```json
{
  "name": "ai-travel-planner-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "proxy": "http://localhost:5000"
}
```

---

## Common issues

### ❌ "Cannot find module 'groq-sdk'"
```bash
cd backend
npm install groq-sdk --save
```

### ❌ "GROQ_API_KEY: ❌ MISSING"
- Make sure the file is named exactly `.env` (not `.env.txt`)
- Make sure it's inside the `backend/` folder, not the project root
- Restart the backend after editing `.env`

### ❌ Network Error in the browser
1. Make sure the backend is running (`npm start` in `backend/`)
2. Check [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser
3. Make sure `frontend/package.json` has `"proxy": "http://localhost:5000"`

### ❌ "Port 3000 / 5000 already in use"
```bash
# Mac / Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Quick links

- **Groq Console**: https://console.groq.com
- **Groq API Docs**: https://console.groq.com/docs/quickstart
- **Node.js**: https://nodejs.org
- **VS Code**: https://code.visualstudio.com