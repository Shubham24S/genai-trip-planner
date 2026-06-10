import React from 'react';

/**
 * ItineraryDisplay
 * Standalone component — receives a structured itinerary object and renders it.
 * Used independently from TripPlannerForm when you need to display
 * a pre-fetched or cached itinerary elsewhere in the app.
 */
const ItineraryDisplay = ({ itinerary }) => {
  if (!itinerary) return null;

  return (
    <div className="ir-wrapper">

      {/* Header */}
      <div className="ir-hero">
        <div className="ir-hero-badge">✓ Your Itinerary</div>
        <h2 className="ir-hero-title">Your trip to {itinerary.destination} 🗺️</h2>
        {itinerary.duration && (
          <p className="ir-hero-meta">{itinerary.duration} days</p>
        )}
      </div>

      {/* Day-by-day */}
      {itinerary.dailyItinerary?.length > 0 && (
        <div className="ir-card">
          <h3 className="ir-section-title">📅 Day-by-Day Itinerary</h3>
          <div className="ir-days">
            {itinerary.dailyItinerary.map((day) => (
              <div key={day.day} className="ir-day">

                <div className="ir-day-header">
                  <div className="ir-day-number">Day {day.day}</div>
                  {day.dailyCost != null && (
                    <div className="ir-day-cost">₹{Number(day.dailyCost).toLocaleString()} today</div>
                  )}
                </div>

                {day.activities?.length > 0 && (
                  <div className="ir-day-section">
                    <div className="ir-day-section-label">🎯 Activities</div>
                    <div className="ir-activities">
                      {day.activities.map((act, i) => (
                        <div key={i} className="ir-activity">
                          <div className="ir-activity-time">{act.time}</div>
                          <div className="ir-activity-body">
                            <div className="ir-activity-name">{act.activity}</div>
                            {act.location && (
                              <div className="ir-activity-loc">📍 {act.location}</div>
                            )}
                          </div>
                          <div className="ir-activity-cost">₹{act.cost}</div>
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

    </div>
  );
};

export default ItineraryDisplay;