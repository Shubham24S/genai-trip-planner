import React from 'react';

const ItineraryDisplay = ({ itinerary }) => {
  if (!itinerary) return null;

  return (
    <div className="itinerary-display">
      <h2>Your Trip to {itinerary.destination}</h2>
      {/* Render minimal details */}
      <div>
        {itinerary.dailyItinerary.map((day) => (
          <div key={day.day}>
            <h3>Day {day.day}</h3>
            <ul>
              {day.activities.map((act, i) => (
                <li key={i}>
                  {act.time}: {act.activity} — ₹{act.cost}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;