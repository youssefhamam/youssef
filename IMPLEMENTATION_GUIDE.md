# AI Smart Tutor - Complete Implementation Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Testing & Demo](#testing--demo)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** v16+ (Download from nodejs.org)
- **npm** v8+ (Comes with Node.js)
- **Git** (For version control)
- **Anthropic API Key** (Get from https://console.anthropic.com)

### Recommended Tools
- **VSCode** - Code editor
- **Postman** - API testing
- **MongoDB Compass** - Database management (if using MongoDB)

---

## Project Setup

### Step 1: Create Project Directory

```bash
mkdir ai-smart-tutor
cd ai-smart-tutor

# Create subdirectories
mkdir backend frontend database docs
```

### Step 2: Initialize Backend

```bash
cd backend
npm init -y

# Install dependencies
npm install express cors dotenv jwt jsonwebtoken bcrypt @anthropic-ai/sdk

# Optional: Database
npm install mongodb firebase-admin
# OR
npm install mongoose

# Development tools
npm install --save-dev nodemon
```

### Step 3: Initialize Frontend

```bash
cd ../frontend

# Create React app
npx create-react-app . --template cra-template

# Install additional dependencies
npm install axios react-router-dom recharts socket.io-client

# Tailwind CSS (optional but recommended)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Backend Configuration

### Step 1: Create Backend File Structure

```bash
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tutorController.js
│   │   ├── exerciseController.js
│   │   └── progressController.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── exerciseService.js
│   │   ├── feedbackService.js
│   │   └── adaptiveService.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Progress.js
│   │   └── Exercise.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tutor.js
│   │   ├── exercises.js
│   │   ├── progress.js
│   │   └── content.js
│   └── app.js
├── server.js
├── package.json
└── .env
```

### Step 2: Create .env File

```bash
cd backend
cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database Configuration (choose one)
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-smart-tutor

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Logging
LOG_LEVEL=debug

# CORS Configuration
CLIENT_URL=http://localhost:3000
EOF
```

### Step 3: Create Controllers

#### authController.js
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthController {
  // Register user
  static async register(req, res, next) {
    try {
      const { email, password, fullName, learningLevel } = req.body;
      
      // Validate input
      if (!email || !password || !fullName) {
        return res.status(400).json({ 
          error: 'Email, password, and name are required' 
        });
      }

      // Check if user exists
      // const existingUser = await User.findOne({ email });
      // if (existingUser) {
      //   return res.status(400).json({ error: 'User already exists' });
      // }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      // const user = await User.create({
      //   email,
      //   password: hashedPassword,
      //   fullName,
      //   learningLevel: learningLevel || 'beginner'
      // });

      // Generate token
      const token = jwt.sign(
        { userId: 'user_id', email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        token,
        user: { id: 'user_id', email, fullName }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      // const user = await User.findOne({ email });
      // if (!user) {
      //   return res.status(401).json({ error: 'Invalid credentials' });
      // }

      // Verify password
      // const isValidPassword = await bcrypt.compare(password, user.password);
      // if (!isValidPassword) {
      //   return res.status(401).json({ error: 'Invalid credentials' });
      // }

      // Generate token
      const token = jwt.sign(
        { userId: 'user_id', email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        success: true,
        token,
        user: { id: 'user_id', email, fullName: 'User Name' }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
```

#### tutorController.js
```javascript
const Anthropic = require('@anthropic-ai/sdk');

class TutorController {
  static async chat(req, res, next) {
    try {
      const { message, topic, conversationHistory } = req.body;

      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const response = await client.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1000,
        system: `You are an expert AI tutor. Explain concepts clearly, provide examples, 
                 and encourage learning. ${topic ? `Current topic: ${topic}` : ''}`,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      });

      const tutorResponse = response.content[0].text;

      res.json({
        success: true,
        response: tutorResponse
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TutorController;
```

#### exerciseController.js
```javascript
const Anthropic = require('@anthropic-ai/sdk');

class ExerciseController {
  static async generateExercises(req, res, next) {
    try {
      const { topic, difficulty = 'intermediate', count = 3 } = req.body;

      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const response = await client.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        system: `Generate ${count} high-quality exercises about "${topic}" at ${difficulty} level.
                 Return valid JSON array with questions, options, and correct answers.`,
        messages: [
          {
            role: 'user',
            content: `Generate ${count} ${difficulty} exercises about ${topic}`
          }
        ]
      });

      const content = response.content[0].text;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const exercises = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      res.json({
        success: true,
        exercises
      });
    } catch (error) {
      next(error);
    }
  }

  static async evaluateAnswer(req, res, next) {
    try {
      const { question, studentAnswer, correctAnswer } = req.body;

      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const response = await client.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 500,
        system: `You are an expert evaluator. Evaluate the student's answer and provide feedback.
                 Return JSON with: isCorrect (boolean), score (0-100), feedback (string)`,
        messages: [
          {
            role: 'user',
            content: `Question: ${question}\nStudent Answer: ${studentAnswer}\nCorrect Answer: ${correctAnswer}`
          }
        ]
      });

      const content = response.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        isCorrect: false,
        score: 0,
        feedback: 'Unable to evaluate'
      };

      res.json({
        success: true,
        evaluation
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExerciseController;
```

---

## Frontend Configuration

### Step 1: Create Main App Component

```jsx
// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ChatTutor from './components/ChatTutor';
import ExerciseGenerator from './components/ExerciseGenerator';
import ProgressTracker from './components/ProgressTracker';
import './styles/App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <LoginPage setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        {/* Navigation */}
      </header>
      <main className="app-main">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'tutor' && <ChatTutor />}
        {currentTab === 'exercises' && <ExerciseGenerator />}
        {currentTab === 'progress' && <ProgressTracker />}
      </main>
    </div>
  );
}

export default App;
```

### Step 2: Create API Service

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => localStorage.removeItem('token')
};

export const tutor = {
  chat: (data) => apiClient.post('/tutor/chat', data)
};

export const exercises = {
  generate: (data) => apiClient.post('/exercises/generate', data),
  evaluate: (data) => apiClient.post('/exercises/evaluate', data)
};

export const progress = {
  getProgress: (topic) => apiClient.get(`/progress/${topic}`),
  getAllProgress: () => apiClient.get('/progress')
};

export const adaptive = {
  getRecommendations: () => apiClient.post('/adaptive/recommendations', {})
};

export default apiClient;
```

### Step 3: Create .env.local for Frontend

```bash
cd frontend
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
EOF
```

---

## Environment Variables

### Backend .env
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRE=24h
ANTHROPIC_API_KEY=sk-ant-v01-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MONGODB_URI=mongodb://localhost:27017/ai-smart-tutor
CLIENT_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Frontend .env.local
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_TITLE=AI Smart Tutor
```

---

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm install
# Create .env file with your API keys
node server.js

# OR use nodemon for development
npx nodemon server.js
```

Output should show:
```
🚀 AI Smart Tutor Server running on port 5000
📚 API Documentation: http://localhost:5000/api
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

Output should show:
```
Compiled successfully!
You can now view ai-smart-tutor in the browser.
Local: http://localhost:3000
```

### Terminal 3 (Optional): Start Database

```bash
# MongoDB (if using)
mongod

# OR Firebase (already in cloud, just configure)
```

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePassword123",
    "fullName": "John Doe",
    "learningLevel": "intermediate"
  }'
```

#### POST /api/auth/login
Login user
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePassword123"
  }'
```

### Tutor Endpoints

#### POST /api/tutor/chat
Chat with AI tutor
```bash
curl -X POST http://localhost:5000/api/tutor/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I solve quadratic equations?",
    "topic": "Mathematics",
    "conversationHistory": []
  }'
```

### Exercise Endpoints

#### POST /api/exercises/generate
Generate exercises
```bash
curl -X POST http://localhost:5000/api/exercises/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Calculus",
    "difficulty": "intermediate",
    "count": 5
  }'
```

#### POST /api/exercises/evaluate
Evaluate student answer
```bash
curl -X POST http://localhost:5000/api/exercises/evaluate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "exercise_123",
    "studentAnswer": "42"
  }'
```

### Progress Endpoints

#### GET /api/progress
Get all progress
```bash
curl -X GET http://localhost:5000/api/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### GET /api/progress/:topic
Get progress for specific topic
```bash
curl -X GET http://localhost:5000/api/progress/Mathematics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing & Demo

### Manual Testing with Postman

1. **Download Postman** from postman.com
2. **Create new requests** for each endpoint
3. **Test authentication flow**:
   - Register new user
   - Login and get token
   - Use token in subsequent requests
4. **Test exercise generation**:
   - Request exercises for different topics
   - Verify JSON response format
5. **Test AI chat**:
   - Send messages
   - Verify tutor responses
6. **Test evaluation**:
   - Submit answers
   - Check feedback generation

### Frontend Testing

```bash
# Navigate to http://localhost:3000
# Test login/registration
# Test each tab:
# - Dashboard: View stats and charts
# - AI Tutor: Chat with AI
# - Exercises: Generate and solve
# - Progress: View analytics
```

---

## Deployment

### Deploy Backend (Heroku/Railway)

```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Deploy to Heroku
heroku login
heroku create your-app-name
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)

```bash
cd frontend

# Build for production
npm run build

# Deploy to Vercel
npm i -g vercel
vercel

# OR Deploy to Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Environment Configuration for Production

Update .env files:
- Change NODE_ENV to production
- Update API URLs to deployed backend
- Use secure JWT secret (32+ characters)
- Enable HTTPS everywhere

---

## Troubleshooting

### Common Issues

**Issue: Port 5000 already in use**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Issue: CORS errors**
```javascript
// Ensure backend has CORS enabled
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Issue: API Key not working**
- Verify ANTHROPIC_API_KEY in .env
- Ensure it starts with `sk-ant-v01-`
- Check API key hasn't been revoked

**Issue: Database connection failed**
- Ensure MongoDB/Firebase is running
- Check connection string in .env
- Verify credentials

---

## Performance Optimization Tips

1. **Caching**: Use Redis for session caching
2. **Database Indexing**: Index frequently queried fields
3. **API Rate Limiting**: Implement rate limiting
4. **Lazy Loading**: Load components on demand
5. **Compression**: Enable gzip compression
6. **CDN**: Use CDN for static assets
7. **Code Splitting**: Split React bundles

---

## Next Steps

1. ✅ Set up project structure
2. ✅ Configure environment variables
3. ✅ Implement authentication
4. ✅ Integrate AI API
5. ✅ Build exercise system
6. ✅ Add progress tracking
7. 🔄 Add database (MongoDB/Firebase)
8. 🔄 Deploy to production
9. 🔄 Add real-time notifications
10. 🔄 Implement mobile app

---

For more help, check:
- Anthropic API Docs: https://docs.anthropic.com
- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev
- Community Forum: [Your support channel]
