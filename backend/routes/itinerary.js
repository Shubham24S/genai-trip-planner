const express = require('express');
const router  = express.Router();
const { generateItinerary } = require('../services/groqService');

// ── POST /api/generate-itinerary ───────────────────────────────────────────
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, duration, budget, interests, groupSize, travelStyle } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────
    const missing = [];
    if (!destination) missing.push('destination');
    if (!duration)    missing.push('duration');
    if (!budget)      missing.push('budget');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const parsedDuration = parseInt(duration);
    const parsedBudget   = parseInt(budget);

    if (isNaN(parsedDuration) || parsedDuration < 1 || parsedDuration > 30) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be a number between 1 and 30 days',
      });
    }

    if (isNaN(parsedBudget) || parsedBudget < 5000) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be at least ₹5,000',
      });
    }

    // ── Build preferences object ───────────────────────────────────────────
    const preferences = {
      destination: destination.trim(),
      duration:    parsedDuration,
      budget:      parsedBudget,
      interests:   Array.isArray(interests) && interests.length > 0
                     ? interests
                     : ['sightseeing', 'culture'],
      groupSize:   parseInt(groupSize) || 2,
      travelStyle: travelStyle || 'balanced',
    };

    console.log('📋 Generating itinerary for:', preferences);

    const result = await generateItinerary(preferences);

    return res.json({
      success:     true,
      message:     'Itinerary generated successfully',
      data:        result.data,
      generatedAt: new Date().toISOString(),
      preferences: preferences,
      ...(result.note && { note: result.note }),
    });

  } catch (error) {
    console.error('❌ Route error /generate-itinerary:', error.message);
    return res.status(500).json({
      success: false,
      error:   'Failed to generate itinerary',
      message: error.message,
    });
  }
});

// ── GET /api/popular-destinations ─────────────────────────────────────────
router.get('/popular-destinations', (req, res) => {
  const destinations = [
    { name: 'Goa',               category: 'Beach',    popularity: 95 },
    { name: 'Rajasthan',         category: 'Heritage', popularity: 92 },
    { name: 'Kerala',            category: 'Nature',   popularity: 90 },
    { name: 'Ladakh',            category: 'Adventure',popularity: 89 },
    { name: 'Himachal Pradesh',  category: 'Adventure',popularity: 88 },
    { name: 'Agra',              category: 'Heritage', popularity: 87 },
    { name: 'Mumbai',            category: 'City',     popularity: 85 },
    { name: 'Rishikesh',         category: 'Spiritual',popularity: 82 },
  ];

  return res.json({ success: true, data: destinations });
});

module.exports = router;