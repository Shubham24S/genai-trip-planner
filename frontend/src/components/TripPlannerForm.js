import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TripPlannerForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    budget: 25000,
    interests: [],
    groupSize: 2,
    travelStyle: 'balanced'
  });
  
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);
  
  const interestOptions = [
    'heritage', 'adventure', 'nightlife', 'nature', 'culture', 
    'food', 'shopping', 'relaxation', 'photography', 'spiritual'
  ];
  
  const travelStyleOptions = [
    { value: 'budget', label: 'Budget Traveler' },
    { value: 'balanced', label: 'Balanced Experience' },
    { value: 'luxury', label: 'Luxury Travel' }
  ];

  // Fetch popular destinations on component mount
  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/popular-destinations`);
      if (response.data.success) {
        setPopularDestinations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
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
        // Scroll to results
        setTimeout(() => {
          const resultsSection = document.getElementById('results');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setError(response.data.error || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to generate itinerary. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Form Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ✨ Create Your Perfect Trip
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌍 Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., Goa, Rajasthan, Kerala..."
              className="form-input"
              required
            />
            
            {/* Popular Destinations */}
            {popularDestinations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Popular destinations:</p>
                <div className="flex flex-wrap gap-1">
                  {popularDestinations.slice(0, 6).map(dest => (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, destination: dest.name }))}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {dest.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Duration and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Budget (₹) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="5000"
                step="1000"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👥 Group Size
              </label>
              <input
                type="number"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="form-input"
              />
            </div>
          </div>
          
          {/* Travel Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Travel Style
            </label>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleInputChange}
              className="form-input"
            >
              {travelStyleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ❤️ Your Interests (select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {interestOptions.map(interest => (
                <label
                  key={interest}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium capitalize">{interest}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.destination || !formData.duration || !formData.budget}
            className="btn-primary w-full text-lg py-4 mt-8"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Generating Your Perfect Trip...
              </>
            ) : (
              '🚀 Create My AI Trip Plan'
            )}
          </button>
        </form>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center">
            <div className="text-red-500 mr-3">⚠️</div>
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Section */}
      {itinerary && (
        <div id="results">
          <ItineraryResults itinerary={itinerary} preferences={formData} />
        </div>
      )}
    </div>
  );
};

// Itinerary Results Component
const ItineraryResults = ({ itinerary, preferences }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Your Perfect Trip to {itinerary.destination}!
          </h2>
          <p className="text-gray-600">
            {itinerary.duration} days • ₹{itinerary.totalBudget.toLocaleString()} budget • 
            Generated by AI for {preferences.interests.join(', ')} lovers
          </p>
        </div>
      </div>
      
      {/* Budget Breakdown */}
      {itinerary.budgetBreakdown && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Budget Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(itinerary.budgetBreakdown).map(([category, amount]) => (
              <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  ₹{amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Daily Itinerary */}
      {itinerary.dailyItinerary && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Day-by-Day Itinerary</h3>
          <div className="space-y-4">
            {itinerary.dailyItinerary.map((day, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-bold text-lg text-blue-600 mb-3">
                  Day {day.day} - Daily Budget: ₹{day.dailyCost?.toLocaleString() || 'N/A'}
                </h4>
                
                {/* Activities */}
                {day.activities && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-700 mb-2">🎯 Activities:</h5>
                    {day.activities.map((activity, i) => (
                      <div key={i} className="ml-4 mb-2 p-2 bg-blue-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{activity.time}</span> - 
                            <span className="ml-1">{activity.activity}</span>
                            {activity.location && (
                              <div className="text-sm text-gray-600">📍 {activity.location}</div>
                            )}
                            {activity.description && (
                              <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                            )}
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            ₹{activity.cost}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Meals */}
                {day.meals && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">🍽️ Meals:</h5>
                    {day.meals.map((meal, i) => (
                      <div key={i} className="ml-4 mb-1 p-2 bg-orange-50 rounded text-sm">
                        <span className="capitalize font-medium">{meal.type}</span> at {meal.restaurant} 
                        - {meal.cuisine} cuisine - ₹{meal.cost}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Accommodation */}
      {itinerary.accommodation && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🏨 Accommodation</h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold">{itinerary.accommodation.name}</h4>
            <p className="text-gray-600">
              {itinerary.accommodation.type} • ₹{itinerary.accommodation.pricePerNight}/night • 
              Total: ₹{itinerary.accommodation.totalCost}
            </p>
            {itinerary.accommodation.amenities && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Amenities: </span>
                <span className="text-sm">{itinerary.accommodation.amenities.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Highlights & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itinerary.highlights && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⭐ Trip Highlights</h3>
            <ul className="space-y-2">
              {itinerary.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-2">✨</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {itinerary.localTips && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Local Tips</h3>
            <ul className="space-y-2">
              {itinerary.localTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Book Now Button */}
      <div className="card bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Book Your Trip?</h3>
        <button className="btn-primary text-lg px-8 py-3">
          🎫 Book Now with EaseMyTrip
        </button>
        <p className="text-sm text-gray-600 mt-2">
          One-click booking • Best prices • 24/7 support
        </p>
      </div>
    </div>
  );
};

export default TripPlannerForm;