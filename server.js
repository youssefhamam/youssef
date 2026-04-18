// server.js - Main backend server for AI Smart Tutor
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic Client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ============================================================
// DATABASE SIMULATION (Use Firebase/MongoDB in production)
// ============================================================
const users = new Map();
const studentProgress = new Map();
const exercises = new Map();
const sessions = new Map();

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, learningLevel, preferredSubjects } = req.body;

    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    users.set(email, {
      id: userId,
      email,
      password: hashedPassword,
      fullName,
      learningLevel: learningLevel || 'beginner',
      preferredSubjects: preferredSubjects || [],
      createdAt: new Date()
    });

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: '24h'
    });

    res.json({
      success: true,
      token,
      user: { id: userId, email, fullName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: '24h'
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// AI TUTOR ROUTES
// ============================================================

// Chat with AI Tutor
app.post('/api/tutor/chat', authMiddleware, async (req, res) => {
  try {
    const { message, topic, conversationHistory } = req.body;

    const systemPrompt = `You are an expert AI tutor. Your role is to:
1. Explain concepts clearly and simply
2. Break down complex topics into digestible parts
3. Provide relevant examples and analogies
4. Ask clarifying questions when needed
5. Encourage the student and celebrate progress
${topic ? `Current topic: ${topic}` : ''}

Always respond in a friendly, encouraging, and educational manner.`;

    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    });

    const tutorResponse = response.content[0].type === 'text' ? response.content[0].text : '';

    // Update or create session
    const sessionId = `session_${req.userId}_${Date.now()}`;
    sessions.set(sessionId, {
      userId: req.userId,
      topic,
      messages: [...messages, { role: 'assistant', content: tutorResponse }],
      createdAt: new Date()
    });

    res.json({
      success: true,
      response: tutorResponse,
      sessionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// EXERCISE GENERATION ROUTES
// ============================================================

// Generate exercises dynamically
app.post('/api/exercises/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty = 'intermediate', count = 3, type = 'mixed' } = req.body;

    const systemPrompt = `You are an expert educator. Generate ${count} high-quality exercises about "${topic}" at ${difficulty} level.
Format your response as valid JSON array with this structure:
[
  {
    "id": "unique_id",
    "question": "The question text",
    "type": "multiple-choice" | "short-answer" | "essay",
    "options": ["option1", "option2", ...], // Only for multiple-choice
    "correctAnswer": "The correct answer or answer explanation",
    "explanation": "Detailed explanation of the concept",
    "difficulty": "${difficulty}",
    "topic": "${topic}"
  }
]
Ensure questions are varied and test different levels of understanding.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Generate ${count} ${difficulty} exercises about ${topic}` }
      ]
    });

    let generatedExercises = [];
    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        generatedExercises = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse exercises:', parseError);
    }

    // Store exercises
    generatedExercises.forEach(exercise => {
      exercises.set(exercise.id, {
        ...exercise,
        userId: req.userId,
        createdAt: new Date(),
        aiGenerated: true
      });
    });

    res.json({
      success: true,
      exercises: generatedExercises
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// AUTO CORRECTION & FEEDBACK ROUTES
// ============================================================

// Evaluate student answer
app.post('/api/exercises/evaluate', authMiddleware, async (req, res) => {
  try {
    const { exerciseId, studentAnswer } = req.body;

    const exercise = exercises.get(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const systemPrompt = `You are an expert evaluator. Evaluate the student's answer to this exercise:

Question: ${exercise.question}
Correct Answer: ${exercise.correctAnswer}
Student Answer: ${studentAnswer}

Provide your evaluation in JSON format:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Detailed feedback about the answer",
  "explanation": "Full explanation of the concept",
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Evaluate this answer and provide detailed feedback` }
      ]
    });

    let evaluation = { isCorrect: false, score: 0, feedback: '' };
    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse evaluation:', parseError);
    }

    // Update progress
    const progressKey = `${req.userId}_${exercise.topic}`;
    const current = studentProgress.get(progressKey) || {
      userId: req.userId,
      topic: exercise.topic,
      exerciseCount: 0,
      correctAnswers: 0,
      totalScore: 0,
      attempts: []
    };

    current.exerciseCount += 1;
    if (evaluation.isCorrect) current.correctAnswers += 1;
    current.totalScore += evaluation.score;
    current.attempts.push({
      exerciseId,
      score: evaluation.score,
      timestamp: new Date()
    });

    studentProgress.set(progressKey, current);

    res.json({
      success: true,
      evaluation,
      progress: {
        averageScore: (current.totalScore / current.exerciseCount).toFixed(2),
        correctCount: current.correctAnswers,
        totalExercises: current.exerciseCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// PROGRESS TRACKING ROUTES
// ============================================================

// Get student progress
app.get('/api/progress/:topic', authMiddleware, (req, res) => {
  try {
    const { topic } = req.params;
    const progressKey = `${req.userId}_${topic}`;
    const progress = studentProgress.get(progressKey) || {
      userId: req.userId,
      topic,
      exerciseCount: 0,
      correctAnswers: 0,
      averageScore: 0,
      mastered: false
    };

    res.json({
      success: true,
      progress: {
        ...progress,
        averageScore: progress.exerciseCount > 0 
          ? (progress.totalScore / progress.exerciseCount).toFixed(2)
          : 0,
        mastered: progress.correctAnswers >= progress.exerciseCount * 0.8
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all progress
app.get('/api/progress', authMiddleware, (req, res) => {
  try {
    const userProgress = Array.from(studentProgress.values())
      .filter(p => p.userId === req.userId);

    const summary = {
      totalExercises: userProgress.reduce((sum, p) => sum + p.exerciseCount, 0),
      correctAnswers: userProgress.reduce((sum, p) => sum + (p.correctAnswers || 0), 0),
      averageScore: 0,
      topics: userProgress
    };

    if (summary.totalExercises > 0) {
      summary.averageScore = (
        (summary.correctAnswers / summary.totalExercises) * 100
      ).toFixed(2);
    }

    res.json({
      success: true,
      summary,
      details: userProgress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ADAPTIVE CONTENT ROUTES
// ============================================================

// Get adaptive recommendations
app.post('/api/adaptive/recommendations', authMiddleware, async (req, res) => {
  try {
    const userProgress = Array.from(studentProgress.values())
      .filter(p => p.userId === req.userId);

    const weakAreas = userProgress
      .filter(p => p.exerciseCount > 0)
      .map(p => ({
        topic: p.topic,
        averageScore: (p.totalScore / p.exerciseCount)
      }))
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);

    const systemPrompt = `You are an adaptive learning expert. Based on the student's weak areas, provide personalized learning recommendations.

Weak Areas: ${JSON.stringify(weakAreas)}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "topic": "topic name",
      "reason": "why focus on this",
      "difficulty": "next_difficulty_level",
      "estimatedTime": "time_in_hours"
    }
  ],
  "focusAreas": ["area1", "area2"],
  "suggestedPace": "daily_minutes"
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Based on my weak areas, what should I focus on?' }
      ]
    });

    let recommendations = { recommendations: [], focusAreas: [], suggestedPace: 30 };
    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse recommendations:', parseError);
    }

    res.json({
      success: true,
      recommendations,
      weakAreas
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// USER PROFILE ROUTES
// ============================================================

// Get user profile
app.get('/api/users/profile', authMiddleware, (req, res) => {
  try {
    // Find user by ID (in production, use database)
    let user = null;
    for (const [email, userData] of users) {
      if (userData.id === req.userId) {
        user = userData;
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userProfile } = user;

    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/users/profile', authMiddleware, (req, res) => {
  try {
    const { learningLevel, preferredSubjects } = req.body;

    // Find and update user
    for (const [email, user] of users) {
      if (user.id === req.userId) {
        if (learningLevel) user.learningLevel = learningLevel;
        if (preferredSubjects) user.preferredSubjects = preferredSubjects;
        
        users.set(email, user);

        res.json({
          success: true,
          user: { ...user, password: undefined }
        });
        return;
      }
    }

    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`🚀 AI Smart Tutor Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💾 Using in-memory database (switch to Firebase/MongoDB for production)`);
});

module.exports = app;
