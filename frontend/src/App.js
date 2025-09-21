import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripPlannerForm from './components/TripPlannerForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center py-4">
              🚀 EaseMyTrip AI Travel Planner
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Powered by Google Gemini AI - Create your perfect Indian adventure
            </p>
          </div>
        </header>
        
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <Routes>
            <Route path="/" element={<TripPlannerForm />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2025 EaseMyTrip AI Planner - Google Gen AI Hackathon</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;