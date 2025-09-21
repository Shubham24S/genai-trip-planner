const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateItinerary = async (preferences) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert travel planner for India. Create a detailed ${preferences.duration}-day travel itinerary for ${preferences.destination} with these requirements:

**Budget**: ₹${preferences.budget}
**Interests**: ${preferences.interests.join(', ')}
**Group Size**: ${preferences.groupSize || 2} people
**Travel Style**: ${preferences.travelStyle || 'balanced'}

Please provide a comprehensive response in this JSON format:
{
  "destination": "${preferences.destination}",
  "duration": ${preferences.duration},
  "totalBudget": ${preferences.budget},
  "dailyItinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "location": "Location name",
          "duration": "2 hours",
          "cost": 500,
          "description": "Detailed description"
        }
      ],
      "meals": [
        {
          "type": "breakfast/lunch/dinner",
          "restaurant": "Name",
          "cuisine": "Type",
          "cost": 300
        }
      ],
      "dailyCost": 2000
    }
  ],
  "accommodation": {
    "name": "Hotel recommendation",
    "type": "3-star/4-star/budget",
    "pricePerNight": 2000,
    "totalCost": 6000,
    "amenities": ["wifi", "breakfast", "pool"]
  },
  "transportation": {
    "local": "Auto/Taxi/Metro recommendations",
    "intercity": "Flight/Train/Bus options",
    "estimatedCost": 5000
  },
  "budgetBreakdown": {
    "accommodation": 6000,
    "food": 4500,
    "activities": 8000,
    "transportation": 5000,
    "shopping": 2000,
    "miscellaneous": 1500,
    "total": 27000
  },
  "highlights": [
    "Must-visit attraction 1",
    "Local experience 2",
    "Hidden gem 3"
  ],
  "localTips": [
    "Best time to visit attractions",
    "Local customs and etiquette",
    "Weather considerations"
  ],
  "emergencyInfo": {
    "hospitals": "Nearby hospital names",
    "police": "Police station contact",
    "helpline": "Tourist helpline number"
  }
}

Make sure the response is valid JSON and includes realistic Indian prices and locations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch);
        return {
          success: true,
          data: jsonData,
          rawResponse: text
        };
      } else {
        // If no JSON found, return structured fallback
        return {
          success: true,
          data: createFallbackItinerary(preferences),
          rawResponse: text,
          note: "Used fallback structure due to parsing issues"
        };
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        success: true,
        data: createFallbackItinerary(preferences),
        rawResponse: text,
        note: "Used fallback structure due to JSON parsing error"
      };
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate itinerary with AI');
  }
};

// Fallback itinerary structure
const createFallbackItinerary = (preferences) => {
  const costPerDay = Math.floor(preferences.budget / preferences.duration);
  
  return {
    destination: preferences.destination,
    duration: preferences.duration,
    totalBudget: preferences.budget,
    dailyItinerary: Array.from({ length: preferences.duration }, (_, index) => ({
      day: index + 1,
      date: `Day ${index + 1}`,
      activities: [
        {
          time: "9:00 AM",
          activity: `Explore ${preferences.destination}`,
          location: `Popular area in ${preferences.destination}`,
          duration: "3 hours",
          cost: costPerDay * 0.3,
          description: `Discover the best of ${preferences.destination} based on your interests in ${preferences.interests.join(' and ')}`
        }
      ],
      meals: [
        {
          type: "lunch",
          restaurant: "Local Restaurant",
          cuisine: "Regional",
          cost: costPerDay * 0.2
        }
      ],
      dailyCost: costPerDay
    })),
    accommodation: {
      name: `Recommended Hotel in ${preferences.destination}`,
      type: "3-star",
      pricePerNight: costPerDay * 0.4,
      totalCost: costPerDay * 0.4 * preferences.duration
    },
    budgetBreakdown: {
      accommodation: preferences.budget * 0.35,
      food: preferences.budget * 0.25,
      activities: preferences.budget * 0.25,
      transportation: preferences.budget * 0.15,
      total: preferences.budget
    },
    highlights: [
      `Top attraction in ${preferences.destination}`,
      "Local cultural experience",
      "Scenic viewpoint"
    ]
  };
};

module.exports = {
  generateItinerary
};