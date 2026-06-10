import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripPlannerForm from './components/TripPlannerForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">

        {/* ── Header ───────────────────────────────────────── */}
        <header className="app-header">
          <div className="header-inner">
            <div className="header-eyebrow">
              ✦ AI-Powered
            </div>
            <h1 className="header-title">
              Plan your perfect<br />
              <span>Indian adventure</span>
            </h1>
            <p className="header-sub">
              Describe your dream trip — our AI builds a personalised day-by-day itinerary in seconds.
            </p>
          </div>
        </header>

        {/* ── Main ─────────────────────────────────────────── */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TripPlannerForm />} />
          </Routes>
        </main>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="app-footer">
          © 2026 AI Travel Planner — powered by <span>Groq</span>
        </footer>

      </div>
    </Router>
  );
}

export default App;