# ✈️ AI Travel Planner

An intelligent travel planning web app that uses AI to generate personalised, day-by-day trip itineraries for destinations across India — based on your budget, interests, group size, and travel style.

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=vercel)](https://your-frontend-url.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=node.js)](https://your-backend-url.vercel.app/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Shubham24S/ai-travel-planner)
[![Setup Guide](https://img.shields.io/badge/Setup-Guide-orange?style=for-the-badge&logo=gitbook)](SETUP-GUIDE.md)

---

## 🎯 What it does

You fill in a short form — destination, duration, budget, group size, travel style, and interests — and the AI builds a complete itinerary including:

- Day-by-day activities with timings, locations, and costs
- Meal recommendations for each day
- Accommodation suggestions that fit your budget
- Full budget breakdown across all categories
- Local tips and trip highlights

---

## 🤖 How it works

The frontend (React) sends your preferences to a Node.js/Express backend. The backend calls the **Groq API** (using the `llama-3.3-70b-versatile` model) with a structured prompt and returns a complete JSON itinerary. The UI renders this into a readable, card-based layout.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express |
| AI | Groq API — Llama 3.3 70B |
| Styling | Custom CSS (no Tailwind dependency) |
| Deployment | Vercel (frontend + backend) |

---

## 🚀 Getting Started

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for full installation instructions.

**Quick version:**

```bash
# 1. Clone
git clone https://github.com/Shubham24S/ai-travel-planner.git
cd ai-travel-planner

# 2. Backend
cd backend
npm install
# Add GROQ_API_KEY to backend/.env  (get one free at console.groq.com)
npm start

# 3. Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## 🔑 API Keys needed

| Key | Where to get it | Free? |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | ✅ Yes |

No credit card required. Groq's free tier is generous enough for development and personal use.

---

## 📁 Project Structure

```
ai-travel-planner/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── itinerary.js
│   ├── services/
│   │   └── groqService.js
│   └── .env               ← you create this (see SETUP-GUIDE.md)
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   └── components/
    │       ├── TripPlannerForm.js
    │       └── ItineraryDisplay.js
    └── package.json
```

---