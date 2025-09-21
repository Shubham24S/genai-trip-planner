# easemytrip-genai-trip-planner
AI-Powered Personalized Trip Planner for EaseMyTrip - Google Gen AI Hackathon 2025

🚀 Quick Start Guide
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18.0 or higher)
npm (comes with Node.js)
Git - Download Here
Google Account (for API keys)

1. Clone the Repository
bash
git clone https://github.com/Shubham24S/easemytrip-genai-trip-planner.git
cd easemytrip-genai-trip-planner
2. Get Required API Keys
Google Gemini API Key (FREE)
Visit Google AI Studio

Sign in with your Google account

Click "Get API Key" → "Create API key in new project"
Copy the generated API key (starts with AIzaSy...)
Google Maps API Key (FREE with $300 credit)
Visit Google Cloud Console

Create a new project or select existing
Enable "Maps JavaScript API"
Go to Credentials → Create API Key
Copy the generated API key

3. Backend Setup
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env

# Add your API keys to .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env
echo "GOOGLE_MAPS_API_KEY=your_maps_api_key_here" >> .env  
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start the backend server
npm start
Expected Output:

text
🚀 Server running on port 5000
🔗 API Health: http://localhost:5000/api/health
4. Frontend Setup
bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies  
npm install

# Start the frontend development server
npm start
Expected Output:

text
Starting the development server...
Local:            http://localhost:3000
5. Test the Application
Open Browser: Navigate to http://localhost:3000

Fill Out Form:

Destination: "Goa"

Duration: 3 days

Budget: ₹25,000

Select interests: Heritage, Food

Group size: 2

Click: "🚀 Create My AI Trip Plan"

Wait: 30-60 seconds for AI generation

View Results: Beautiful, detailed itinerary appears below

🧪 API Testing
Health Check
bash
curl http://localhost:5000/api/health
Popular Destinations
bash
curl http://localhost:5000/api/popular-destinations
Generate Itinerary
bash
curl -X POST http://localhost:5000/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Goa",
    "duration": 3,
    "budget": 25000,
    "interests": ["heritage", "food"],
    "groupSize": 2,
    "travelStyle": "balanced"
  }'
📁 Project Structure
text
easemytrip-genai-trip-planner/
├── backend/
│   ├── routes/
│   │   └── itinerary.js          # API routes for itinerary generation
│   ├── services/
│   │   └── geminiService.js      # Google Gemini AI integration
│   ├── .env                      # Environment variables (API keys)
│   ├── server.js                 # Express server configuration
│   └── package.json              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripPlannerForm.js    # Main form component
│   │   │   └── ItineraryDisplay.js   # Results display component
│   │   ├── App.js                    # Main application component
│   │   ├── App.css                   # Application styles
│   │   └── index.js                  # React entry point
│   ├── public/
│   │   └── index.html               # HTML template
│   └── package.json                 # Frontend dependencies
├── docs/                           # Documentation files
├── demo/                          # Demo assets and screenshots
└── README.md                      # This file
🔧 Configuration
Environment Variables
Create .env file in the backend/ directory:

text
# Required - Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Google Maps API Key (for future map features)  
GOOGLE_MAPS_API_KEY=your_maps_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
Frontend Configuration
The frontend automatically connects to the backend via the proxy configuration in package.json:

json
{
  "proxy": "http://localhost:5000"
}
