// aiService.js — powered by Groq (llama-3.3-70b) via OpenAI-compatible API

const generateItinerary = async (preferences) => {

  // ── API key check ──────────────────────────────────────────────────────────
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set. Check your .env file.');
  }

  // ── Sanitise inputs ────────────────────────────────────────────────────────
  const dest      = preferences.destination.replace(/["`]/g, "'");
  const interests = (preferences.interests || []).join(', ') || 'sightseeing, culture';
  const style     = preferences.travelStyle || 'balanced';
  const group     = parseInt(preferences.groupSize) || 2;
  const budget    = parseInt(preferences.budget);
  const duration  = parseInt(preferences.duration);

  // ── Prompt ─────────────────────────────────────────────────────────────────
  const prompt = `You are an expert travel planner for India. Create a detailed ${duration}-day travel itinerary for "${dest}".

Traveller details:
- Budget: INR ${budget} total
- Group size: ${group} people
- Interests: ${interests}
- Travel style: ${style}

Respond with ONLY valid JSON — no markdown fences, no extra text, nothing before or after the JSON object.

Use this exact structure:
{
  "destination": "string",
  "duration": number,
  "totalBudget": number,
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
          "type": "breakfast",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "cost": 300
        }
      ],
      "dailyCost": 2000
    }
  ],
  "accommodation": {
    "name": "Hotel name",
    "type": "3-star",
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
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "localTips": ["tip 1", "tip 2", "tip 3"],
  "emergencyInfo": {
    "hospitals": "Nearby hospital names",
    "police": "Police station contact",
    "helpline": "Tourist helpline number"
  }
}

Use realistic Indian Rupee prices and real locations in ${dest}.`;

  // ── Call Groq API ──────────────────────────────────────────────────────────
  try {
    console.log(`⏳ Calling Groq for: ${dest}, ${duration} days, ₹${budget}`);

    const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 8192,
      })
    });

    const apiData = await apiResponse.json();

    if (!apiResponse.ok) {
      const errMsg = apiData?.error?.message || `API error ${apiResponse.status}`;
      console.error('❌ Groq API error:', errMsg);

      if (apiResponse.status === 429) {
        throw new Error('Groq API quota exceeded. Please try again in a moment.');
      }
      if (apiResponse.status === 401 || apiResponse.status === 403) {
        throw new Error('Invalid or missing Groq API key. Check your .env file.');
      }

      throw new Error(errMsg);
    }

    const text = apiData.choices?.[0]?.message?.content || '';

    if (!text) {
      console.warn('⚠️ Empty response from Groq — using fallback');
      return { success: true, data: createFallbackItinerary(preferences), note: 'fallback: empty response' };
    }

    console.log('📝 Groq raw response (first 200 chars):', text.slice(0, 200));

    // ── Parse JSON ─────────────────────────────────────────────────────────
    try {
      const cleaned   = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('✅ Itinerary generated successfully');
        return { success: true, data: jsonData };
      }

      console.warn('⚠️ No JSON object found in Groq response — using fallback');
      return { success: true, data: createFallbackItinerary(preferences), note: 'fallback: no JSON in response' };

    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Raw text that failed to parse:', text.slice(0, 500));
      return { success: true, data: createFallbackItinerary(preferences), note: 'fallback: JSON parse error' };
    }

  } catch (error) {
    if (
      error.message.includes('quota') ||
      error.message.includes('API key') ||
      error.message.includes('model not found')
    ) {
      throw error;
    }

    console.error('❌ Unexpected error:', error.message);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

// ── Fallback itinerary ─────────────────────────────────────────────────────
const createFallbackItinerary = (preferences) => {
  const budget     = parseInt(preferences.budget);
  const duration   = parseInt(preferences.duration);
  const costPerDay = Math.floor(budget / duration);

  return {
    destination:    preferences.destination,
    duration:       duration,
    totalBudget:    budget,
    dailyItinerary: Array.from({ length: duration }, (_, i) => ({
      day:  i + 1,
      date: `Day ${i + 1}`,
      activities: [{
        time:        '9:00 AM',
        activity:    `Explore ${preferences.destination}`,
        location:    `Popular area in ${preferences.destination}`,
        duration:    '3 hours',
        cost:        Math.floor(costPerDay * 0.3),
        description: `Discover the best of ${preferences.destination} based on your interests: ${(preferences.interests || []).join(', ')}`,
      }],
      meals: [{
        type:       'lunch',
        restaurant: 'Local Restaurant',
        cuisine:    'Regional',
        cost:       Math.floor(costPerDay * 0.2),
      }],
      dailyCost: costPerDay,
    })),
    accommodation: {
      name:          `Recommended Hotel in ${preferences.destination}`,
      type:          '3-star',
      pricePerNight: Math.floor(costPerDay * 0.4),
      totalCost:     Math.floor(costPerDay * 0.4 * duration),
      amenities:     ['wifi', 'room service'],
    },
    transportation: {
      local:         'Auto-rickshaw / app cab recommended',
      intercity:     'Train or bus for best value',
      estimatedCost: Math.floor(budget * 0.15),
    },
    budgetBreakdown: {
      accommodation:  Math.floor(budget * 0.35),
      food:           Math.floor(budget * 0.20),
      activities:     Math.floor(budget * 0.20),
      transportation: Math.floor(budget * 0.15),
      shopping:       Math.floor(budget * 0.07),
      miscellaneous:  Math.floor(budget * 0.03),
      total:          budget,
    },
    highlights: [
      `Top attraction in ${preferences.destination}`,
      'Local cultural experience',
      'Scenic viewpoint',
    ],
    localTips: [
      'Carry cash for local vendors',
      'Bargain at local markets',
      'Try street food for authentic experience',
    ],
    emergencyInfo: {
      hospitals: 'Search nearest hospital on Google Maps',
      police:    '100',
      helpline:  '1363 (India Tourist Helpline)',
    },
  };
};

module.exports = { generateItinerary };