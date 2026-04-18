# AI Smart Tutor - Complete Platform Architecture

## Project Structure

```
ai-smart-tutor/
├── frontend/                      # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatTutor.jsx
│   │   │   ├── ExerciseGenerator.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   └── AdaptiveContent.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Learning.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── aiTutor.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── backend/                       # Node.js API Server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── tutorController.js
│   │   │   ├── exerciseController.js
│   │   │   ├── progressController.js
│   │   │   └── contentController.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── exerciseService.js
│   │   │   ├── feedbackService.js
│   │   │   └── adaptiveService.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Progress.js
│   │   │   ├── Exercise.js
│   │   │   └── LearningPath.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tutor.js
│   │   │   ├── exercises.js
│   │   │   ├── progress.js
│   │   │   └── content.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── schema.sql
│   └── firebase-config.js
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   └── ARCHITECTURE.md
│
└── README.md
```

## Technology Stack

### Frontend
- **React 18+** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Socket.io-client** - Real-time communication

### Backend
- **Node.js + Express** - Server framework
- **JWT** - Authentication
- **Firebase/MongoDB** - Database
- **Anthropic Claude API** - AI integration
- **Dotenv** - Environment variables
- **Cors** - Cross-origin support

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD

## Key Features Implementation

### 1. Personalized Learning Paths
- Student level assessment on signup
- Dynamic content recommendations
- Learning preferences (visual, textual, interactive)
- Personalized pacing

### 2. AI Chatbot Tutor
- Context-aware conversation
- Step-by-step explanations
- Real-time response generation
- Multi-language support

### 3. Exercise Generation
- Topic-based automatic generation
- Multiple difficulty levels (Beginner, Intermediate, Advanced)
- Diverse question types (MCQ, Short Answer, Essay)
- Time estimates per exercise

### 4. Auto Correction System
- Answer evaluation using AI
- Detailed feedback generation
- Concept mastery scoring
- Plagiarism detection for essays

### 5. Progress Dashboard
- Real-time performance metrics
- Strength/weakness analysis
- Learning streak tracking
- Personalized recommendations

### 6. Adaptive System
- Difficulty adjustment based on performance
- Content re-prioritization
- Smart content bundling
- Concept prerequisite checking

## Database Schema

### Users Table
```
users
├── id (UUID)
├── email (String, unique)
├── password (Hashed)
├── fullName (String)
├── learningLevel (enum: beginner, intermediate, advanced)
├── preferredSubjects (Array)
├── createdAt (Timestamp)
└── lastLogin (Timestamp)
```

### Progress Table
```
progress
├── id (UUID)
├── userId (FK)
├── topicId (String)
├── exerciseCount (Integer)
├── correctAnswers (Integer)
├── averageScore (Float)
├── timeSpent (Integer - minutes)
├── lastAttempt (Timestamp)
├── mastered (Boolean)
└── confidence (Float 0-1)
```

### Exercises Table
```
exercises
├── id (UUID)
├── topicId (String)
├── difficulty (enum)
├── type (MCQ, ShortAnswer, Essay)
├── question (Text)
├── options (Array)
├── correctAnswer (String)
├── explanation (Text)
├── createdAt (Timestamp)
└── aiGenerated (Boolean)
```

### Learning Sessions Table
```
sessions
├── id (UUID)
├── userId (FK)
├── startTime (Timestamp)
├── endTime (Timestamp)
├── topicsLearned (Array)
├── exercisesCompleted (Integer)
├── score (Float)
├── feedback (Text)
└── isAdaptivelyAdjusted (Boolean)
```

## Integration Points

### Claude AI API
- Content generation
- Exercise creation
- Answer evaluation
- Personalized feedback
- Chatbot responses
- Content adaptation

### Authentication
- JWT tokens
- Refresh token rotation
- Session management
- Role-based access (Student, Teacher, Admin)

### Real-time Features
- Live chat with tutor
- Progress notifications
- Real-time exercise updates
- Live leaderboards

## Security Considerations
- Password hashing (bcrypt)
- JWT token validation
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS only
- CORS properly configured
- SQL injection prevention
- XSS protection

## Performance Optimization
- Frontend lazy loading
- API caching strategies
- Database indexing
- CDN for static assets
- Compression (gzip)
- Database query optimization
- Batch processing for exercises
