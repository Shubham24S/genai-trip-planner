import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Interest config ────────────────────────────────────────────────────────
const INTEREST_OPTIONS = [
  { id: 'heritage',    label: 'Heritage',    icon: '🏛️' },
  { id: 'adventure',   label: 'Adventure',   icon: '🧗' },
  { id: 'nightlife',   label: 'Nightlife',   icon: '🌃' },
  { id: 'nature',      label: 'Nature',      icon: '🌿' },
  { id: 'culture',     label: 'Culture',     icon: '🎭' },
  { id: 'food',        label: 'Food',        icon: '🍛' },
  { id: 'shopping',    label: 'Shopping',    icon: '🛍️' },
  { id: 'relaxation',  label: 'Relaxation',  icon: '🧘' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'spiritual',   label: 'Spiritual',   icon: '🕌' },
];

const TRAVEL_STYLE_OPTIONS = [
  { value: 'budget',   label: 'Budget Traveler',     icon: '🎒' },
  { value: 'balanced', label: 'Balanced Experience', icon: '⚖️' },
  { value: 'luxury',   label: 'Luxury Travel',       icon: '✨' },
];

// ── Budget breakdown icons ─────────────────────────────────────────────────
const BUDGET_ICONS = {
  accommodation: '🏨',
  food: '🍽️',
  transport: '🚗',
  activities: '🎯',
  shopping: '🛍️',
  miscellaneous: '📦',
  misc: '📦',
};

// ── Main component ─────────────────────────────────────────────────────────
const TripPlannerForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    budget: 25000,
    interests: [],
    groupSize: 2,
    travelStyle: 'balanced',
  });

  const [itinerary, setItinerary]                 = useState(null);
  const [loading, setLoading]                     = useState(false);
  const [error, setError]                         = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);

  // ── Fetch popular destinations on mount (unchanged) ──────────────────────
  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/popular-destinations`);
      if (response.data.success) {
        setPopularDestinations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    }
  };

  // ── Handlers (unchanged logic) ───────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      const response = await axios.post(`${API_URL}/api/generate-itinerary`, formData);

      if (response.data.success) {
        setItinerary(response.data.data);
        setTimeout(() => {
          const resultsSection = document.getElementById('results');
          if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(response.data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to generate itinerary. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.destination.trim() && formData.duration && formData.budget;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="tp-wrapper">

      {/* ── Form card ──────────────────────────────────────────────────── */}
      <div className="tp-card">

        <div className="tp-card-header">
          <div className="tp-card-icon">🗺️</div>
          <div>
            <div className="tp-card-title">Plan your trip</div>
            <div className="tp-card-subtitle">Fill in your preferences — AI does the rest</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tp-form" noValidate>

          {/* ── Section: Where & When ─────────────────────────────────── */}
          <div className="tp-section-label">
            <span>Where &amp; When</span>
            <span className="tp-section-line" />
          </div>

          {/* Destination */}
          <div className="tp-field">
            <label className="tp-label">
              <span>📍</span> Destination <span className="tp-required">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., Goa, Rajasthan, Kerala, Ladakh…"
              className="tp-input"
              required
            />

            {/* Popular destinations quick-fill */}
            {popularDestinations.length > 0 && (
              <div className="tp-quick-picks">
                <span className="tp-quick-label">Popular:</span>
                {popularDestinations.slice(0, 6).map(dest => (
                  <button
                    key={dest.name}
                    type="button"
                    className={`tp-quick-btn${formData.destination === dest.name ? ' active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, destination: dest.name }))}
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration + Budget + Group size — 3 columns */}
          <div className="tp-row-3">
            <div className="tp-field">
              <label className="tp-label">
                <span>📅</span> Duration (days) <span className="tp-required">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="tp-input"
                required
              />
            </div>

            <div className="tp-field">
              <label className="tp-label">
                <span>💰</span> Budget (₹) <span className="tp-required">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="5000"
                step="1000"
                className="tp-input"
                required
              />
            </div>

            <div className="tp-field">
              <label className="tp-label"><span>👥</span> Group Size</label>
              <input
                type="number"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="tp-input"
              />
            </div>
          </div>

          {/* Travel Style — pill selector */}
          <div className="tp-field">
            <label className="tp-label"><span>🎯</span> Travel Style</label>
            <div className="tp-style-row">
              {TRAVEL_STYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`tp-style-pill${formData.travelStyle === opt.value ? ' active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, travelStyle: opt.value }))}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Section: Interests ────────────────────────────────────── */}
          <div className="tp-section-label">
            <span>Your Interests</span>
            <span className="tp-section-line" />
          </div>

          <div className="tp-field">
            <label className="tp-label"><span>❤️</span> Select everything that excites you</label>
            <div className="tp-interests-grid">
              {INTEREST_OPTIONS.map(({ id, label, icon }) => {
                const selected = formData.interests.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className={`tp-interest-pill${selected ? ' selected' : ''}`}
                    onClick={() => handleInterestToggle(id)}
                    aria-pressed={selected}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    {selected && <span className="tp-pill-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="tp-error" role="alert">
              <span>⚠️</span>
              <div>
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="tp-submit"
            disabled={loading || !isValid}
          >
            {loading ? (
              <>
                <span className="tp-spinner" />
                Building your itinerary…
              </>
            ) : (
              <>
                <span>✈️</span>
                Create My AI Trip Plan
              </>
            )}
          </button>

        </form>
      </div>

      {/* ── Results ────────────────────────────────────────────────────── */}
      {itinerary && (
        <div id="results">
          <ItineraryResults itinerary={itinerary} preferences={formData} />
        </div>
      )}

    </div>
  );
};

// ── ItineraryResults ───────────────────────────────────────────────────────
const ItineraryResults = ({ itinerary, preferences }) => {
  return (
    <div className="ir-wrapper">

      {/* ── Hero banner ──────────────────────────────────────────────── */}
      <div className="ir-hero">
        <div className="ir-hero-badge">✓ Itinerary Ready</div>
        <h2 className="ir-hero-title">Your trip to {itinerary.destination} 🎉</h2>
        <p className="ir-hero-meta">
          {itinerary.duration} days
          {itinerary.totalBudget ? ` · ₹${itinerary.totalBudget.toLocaleString()} total budget` : ''}
          {preferences.interests.length > 0 && ` · ${preferences.interests.join(', ')}`}
        </p>
      </div>

      {/* ── Budget breakdown ─────────────────────────────────────────── */}
      {itinerary.budgetBreakdown && (
        <div className="ir-card">
          <h3 className="ir-section-title">💰 Budget Breakdown</h3>
          <div className="ir-budget-grid">
            {Object.entries(itinerary.budgetBreakdown).map(([category, amount]) => (
              <div key={category} className="ir-budget-item">
                <div className="ir-budget-icon">
                  {BUDGET_ICONS[category.toLowerCase()] || '💸'}
                </div>
                <div className="ir-budget-amount">₹{Number(amount).toLocaleString()}</div>
                <div className="ir-budget-label">{category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Day-by-day ───────────────────────────────────────────────── */}
      {itinerary.dailyItinerary && (
        <div className="ir-card">
          <h3 className="ir-section-title">📅 Day-by-Day Itinerary</h3>
          <div className="ir-days">
            {itinerary.dailyItinerary.map((day, index) => (
              <div key={index} className="ir-day">

                {/* Day header */}
                <div className="ir-day-header">
                  <div className="ir-day-number">Day {day.day}</div>
                  {day.dailyCost != null && (
                    <div className="ir-day-cost">
                      ₹{day.dailyCost.toLocaleString()} today
                    </div>
                  )}
                </div>

                {/* Activities */}
                {day.activities?.length > 0 && (
                  <div className="ir-day-section">
                    <div className="ir-day-section-label">🎯 Activities</div>
                    <div className="ir-activities">
                      {day.activities.map((activity, i) => (
                        <div key={i} className="ir-activity">
                          <div className="ir-activity-time">{activity.time}</div>
                          <div className="ir-activity-body">
                            <div className="ir-activity-name">{activity.activity}</div>
                            {activity.location && (
                              <div className="ir-activity-loc">📍 {activity.location}</div>
                            )}
                            {activity.description && (
                              <div className="ir-activity-desc">{activity.description}</div>
                            )}
                          </div>
                          <div className="ir-activity-cost">₹{activity.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meals */}
                {day.meals?.length > 0 && (
                  <div className="ir-day-section">
                    <div className="ir-day-section-label">🍽️ Meals</div>
                    <div className="ir-meals">
                      {day.meals.map((meal, i) => (
                        <div key={i} className="ir-meal">
                          <span className="ir-meal-type">{meal.type}</span>
                          <span className="ir-meal-info">
                            {meal.restaurant} · {meal.cuisine} cuisine
                          </span>
                          <span className="ir-meal-cost">₹{meal.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Accommodation ────────────────────────────────────────────── */}
      {itinerary.accommodation && (
        <div className="ir-card">
          <h3 className="ir-section-title">🏨 Accommodation</h3>
          <div className="ir-hotel">
            <div className="ir-hotel-name">{itinerary.accommodation.name}</div>
            <div className="ir-hotel-meta">
              <span className="ir-hotel-tag">{itinerary.accommodation.type}</span>
              <span>₹{itinerary.accommodation.pricePerNight}/night</span>
              <span>Total ₹{itinerary.accommodation.totalCost}</span>
            </div>
            {itinerary.accommodation.amenities?.length > 0 && (
              <div className="ir-hotel-amenities">
                {itinerary.accommodation.amenities.map((a, i) => (
                  <span key={i} className="ir-amenity-tag">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Highlights + Tips ────────────────────────────────────────── */}
      {(itinerary.highlights || itinerary.localTips) && (
        <div className="ir-two-col">
          {itinerary.highlights && (
            <div className="ir-card">
              <h3 className="ir-section-title">⭐ Trip Highlights</h3>
              <ul className="ir-list">
                {itinerary.highlights.map((h, i) => (
                  <li key={i} className="ir-list-item">
                    <span className="ir-list-icon">✨</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {itinerary.localTips && (
            <div className="ir-card">
              <h3 className="ir-section-title">💡 Local Tips</h3>
              <ul className="ir-list">
                {itinerary.localTips.map((tip, i) => (
                  <li key={i} className="ir-list-item">
                    <span className="ir-list-icon" style={{ color: 'var(--indigo-lt)' }}>💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="ir-cta">
        <div className="ir-cta-text">
          <div className="ir-cta-title">Ready to make it official?</div>
          <div className="ir-cta-sub">One-click booking · Best prices · 24/7 support</div>
        </div>
        <button className="ir-cta-btn">🎫 Book Now with AI Trip Planner</button>
      </div>

    </div>
  );
};

export default TripPlannerForm;