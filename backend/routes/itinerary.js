const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../services/geminiService');

// Generate itinerary route
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, duration, budget, interests, groupSize, travelStyle } = req.body;
    
    // Validation
    if (!destination || !duration || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: destination, duration, and budget are required'
      });
    }
    
    if (duration < 1 || duration > 30) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be between 1 and 30 days'
      });
    }
    
    if (budget < 5000) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be at least ₹5,000'
      });
    }
    
    const preferences = {
      destination: destination.trim(),
      duration: parseInt(duration),
      budget: parseInt(budget),
      interests: interests || ['sightseeing', 'culture'],
      groupSize: parseInt(groupSize) || 2,
      travelStyle: travelStyle || 'balanced'
    };
    
    console.log('Generating itinerary for:', preferences);
    
    const result = await generateItinerary(preferences);
    
    res.json({
      success: true,
      message: 'Itinerary generated successfully',
      data: result.data,
      generatedAt: new Date().toISOString(),
      preferences: preferences
    });
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary',
      message: error.message
    });
  }
});

// Get popular destinations
router.get('/popular-destinations', (req, res) => {
  const destinations = [
    { name: 'Goa', category: 'Beach', popularity: 95 },
    { name: 'Rajasthan', category: 'Heritage', popularity: 92 },
    { name: 'Kerala', category: 'Nature', popularity: 90 },
    { name: 'Himachal Pradesh', category: 'Adventure', popularity: 88 },
    { name: 'Mumbai', category: 'City', popularity: 85 },
    { name: 'Agra', category: 'Heritage', popularity: 87 },
    { name: 'Rishikesh', category: 'Spiritual', popularity: 82 },
    { name: 'Ladakh', category: 'Adventure', popularity: 89 }
  ];
  
  res.json({
    success: true,
    data: destinations
  });
});

module.exports = router;