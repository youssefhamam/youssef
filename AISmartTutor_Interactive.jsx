import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AISmartTutor = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI tutor. What topic would you like to learn today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [exercises, setExercises] = useState([]);
  const [studentData, setStudentData] = useState({
    name: 'Alex Johnson',
    level: 'intermediate',
    totalXP: 2450,
    streak: 12,
    averageScore: 78.5,
    hoursLearned: 45,
    exercisesCompleted: 156,
    subjects: ['Mathematics', 'Physics', 'Chemistry']
  });

  const [progressData] = useState([
    { week: 'Week 1', score: 65, exercises: 12 },
    { week: 'Week 2', score: 72, exercises: 15 },
    { week: 'Week 3', score: 78, exercises: 18 },
    { week: 'Week 4', score: 82, exercises: 22 },
    { week: 'Week 5', score: 85, exercises: 25 },
  ]);

  const [subjectStrengths] = useState([
    { subject: 'Math', strength: 85 },
    { subject: 'Physics', strength: 78 },
    { subject: 'Chemistry', strength: 72 },
    { subject: 'Biology', strength: 88 },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulated login
  const handleLogin = (e) => {
    e.preventDefault();
    setCurrentUser({ name: 'Alex Johnson', email: 'alex@example.com' });
  };

  // Chat with AI Tutor
  const sendMessage = async () => {
    if (chatInput.trim()) {
      // Add user message
      const userMessage = { role: 'user', content: chatInput };
      setChatMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "Great question! Let me break this down into steps...",
          "That's an excellent point. Let me explain the concept with an example...",
          "Good thinking! This is related to the principle of...",
          "Let me provide you with a step-by-step solution...",
          "That's a common misconception. Here's the correct understanding..."
        ];
        const aiMessage = {
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)]
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }, 500);

      setChatInput('');
    }
  };

  // Generate exercises
  const generateExercises = () => {
    const newExercises = [
      {
        id: 1,
        type: 'multiple-choice',
        difficulty: 'intermediate',
        subject: 'Mathematics',
        question: 'What is the derivative of x³ + 2x²?',
        options: ['3x² + 4x', '2x³ + 4x', '3x + 4', 'x² + 2x'],
        correct: 0,
        answered: false,
        userAnswer: null
      },
      {
        id: 2,
        type: 'short-answer',
        difficulty: 'intermediate',
        subject: 'Physics',
        question: 'Define the concept of momentum and explain its conservation.',
        answered: false,
        userAnswer: null
      },
      {
        id: 3,
        type: 'multiple-choice',
        difficulty: 'advanced',
        subject: 'Chemistry',
        question: 'Which of the following is an example of a redox reaction?',
        options: ['HCl + NaOH → NaCl + H₂O', 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag', 'AgNO₃ + NaCl → AgCl + NaNO₃', 'All of the above'],
        correct: 1,
        answered: false,
        userAnswer: null
      }
    ];
    setExercises(newExercises);
  };

  // Handle exercise answer
  const answerExercise = (exerciseId, answer) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, userAnswer: answer, answered: true } : ex
    ));
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🧠</span>
            <h1 style={styles.logoText}>AI Smart Tutor</h1>
          </div>
          
          <nav style={styles.nav}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'tutor', label: 'AI Tutor', icon: '🤖' },
              { id: 'exercises', label: 'Exercises', icon: '📝' },
              { id: 'progress', label: 'Progress', icon: '📈' },
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.navButton,
                  ...(activeTab === tab.id && styles.navButtonActive)
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>

          <div style={styles.headerActions}>
            <span style={styles.xpBadge}>⭐ {studentData.totalXP} XP</span>
            <button onClick={() => setCurrentUser(null)} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={styles.dashboardGrid}>
            <h2 style={styles.pageTitle}>Welcome back, {studentData.name}! 👋</h2>
            
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🔥</div>
                <h3 style={styles.statLabel}>Learning Streak</h3>
                <p style={styles.statValue}>{studentData.streak} Days</p>
                <p style={styles.statDesc}>Keep it up!</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>⭐</div>
                <h3 style={styles.statLabel}>Average Score</h3>
                <p style={styles.statValue}>{studentData.averageScore}%</p>
                <p style={styles.statDesc}>Excellent progress</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>⏱️</div>
                <h3 style={styles.statLabel}>Hours Learned</h3>
                <p style={styles.statValue}>{studentData.hoursLearned}h</p>
                <p style={styles.statDesc}>Keep growing</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <h3 style={styles.statLabel}>Exercises Done</h3>
                <p style={styles.statValue}>{studentData.exercisesCompleted}</p>
                <p style={styles.statDesc}>Stay consistent</p>
              </div>
            </div>

            {/* Charts */}
            <div style={styles.chartsGrid}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Weekly Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} name="Score %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Subject Strength</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectStrengths}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="strength" fill="#7c3aed" name="Mastery %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
              <div style={styles.actionButtons}>
                <button onClick={() => setActiveTab('tutor')} style={styles.actionBtn}>
                  📚 Start Learning
                </button>
                <button onClick={() => { setActiveTab('exercises'); generateExercises(); }} style={styles.actionBtn}>
                  🎯 Practice Exercises
                </button>
                <button onClick={() => setActiveTab('progress')} style={styles.actionBtn}>
                  📊 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Tutor Tab */}
        {activeTab === 'tutor' && (
          <div style={styles.tutorContainer}>
            <h2 style={styles.pageTitle}>🤖 AI Tutor Assistant</h2>
            
            <div style={styles.tutorWrapper}>
              {/* Topics Sidebar */}
              <aside style={styles.topicsSidebar}>
                <h3 style={styles.sidebarTitle}>Topics</h3>
                {studentData.subjects.map((subject, idx) => (
                  <button key={idx} style={styles.topicButton}>
                    {subject}
                  </button>
                ))}
                <hr style={styles.divider} />
                <h3 style={styles.sidebarTitle}>Quick Concepts</h3>
                {['Calculus', 'Algebra', 'Geometry', 'Statistics'].map((concept, idx) => (
                  <button key={idx} style={styles.topicButton}>
                    {concept}
                  </button>
                ))}
              </aside>

              {/* Chat Interface */}
              <div style={styles.chatContainer}>
                <div style={styles.chatHistory}>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.chatMessage,
                        ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                      }}
                    >
                      <span style={styles.messageRole}>
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </span>
                      <p style={styles.messageText}>{msg.content}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div style={styles.chatInputWrapper}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask a question or request a lesson..."
                    style={styles.chatInput}
                  />
                  <button onClick={sendMessage} style={styles.sendButton}>
                    Send ➤
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div style={styles.exercisesContainer}>
            <h2 style={styles.pageTitle}>📝 Practice Exercises</h2>
            
            {exercises.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>📚</p>
                <p style={styles.emptyText}>No exercises yet. Generate some to start practicing!</p>
                <button onClick={generateExercises} style={styles.generateBtn}>
                  Generate Exercises
                </button>
              </div>
            ) : (
              <div style={styles.exercisesList}>
                {exercises.map((exercise, idx) => (
                  <div key={exercise.id} style={styles.exerciseCard}>
                    <div style={styles.exerciseHeader}>
                      <span style={styles.exerciseType}>{exercise.type.replace('-', ' ').toUpperCase()}</span>
                      <span style={{
                        ...styles.difficultygBadge,
                        ...(exercise.difficulty === 'beginner' && styles.diffBeginner),
                        ...(exercise.difficulty === 'intermediate' && styles.diffIntermediate),
                        ...(exercise.difficulty === 'advanced' && styles.diffAdvanced)
                      }}>
                        {exercise.difficulty.toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 style={styles.exerciseQuestion}>{exercise.question}</h3>

                    {exercise.type === 'multiple-choice' && (
                      <div style={styles.optionsGrid}>
                        {exercise.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => answerExercise(exercise.id, optIdx)}
                            style={{
                              ...styles.optionButton,
                              ...(exercise.userAnswer === optIdx && styles.optionSelected),
                              ...(exercise.answered && optIdx === exercise.correct && styles.optionCorrect),
                              ...(exercise.answered && exercise.userAnswer === optIdx && exercise.userAnswer !== exercise.correct && styles.optionWrong)
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {exercise.type === 'short-answer' && (
                      <textarea
                        placeholder="Type your answer here..."
                        style={styles.answerTextarea}
                        onChange={(e) => answerExercise(exercise.id, e.target.value)}
                        value={exercise.userAnswer || ''}
                      />
                    )}

                    {exercise.answered && (
                      <div style={{
                        ...styles.feedback,
                        ...(exercise.userAnswer === exercise.correct ? styles.feedbackCorrect : styles.feedbackWrong)
                      }}>
                        <p>{exercise.userAnswer === exercise.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
                        <p style={styles.feedbackDetail}>
                          {exercise.userAnswer === exercise.correct 
                            ? 'Excellent work! You understood this concept well.'
                            : 'Great effort! Let\'s review this concept. The correct answer is: ' + exercise.options[exercise.correct]
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={generateExercises} style={styles.generateMoreBtn}>
                  Generate More Exercises
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div style={styles.progressContainer}>
            <h2 style={styles.pageTitle}>📈 Progress Analytics</h2>
            
            <div style={styles.analyticsGrid}>
              <div style={styles.analyticsCard}>
                <h3 style={styles.chartTitle}>Learning Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} name="Score %" />
                    <Line type="monotone" dataKey="exercises" stroke="#06b6d4" strokeWidth={3} name="Exercises Count" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.analyticsCard}>
                <h3 style={styles.chartTitle}>Mastery by Subject</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={subjectStrengths}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.subject}: ${entry.strength}%`}
                      outerRadius={100}
                      fill="#7c3aed"
                      dataKey="strength"
                    >
                      {subjectStrengths.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.recommendationsCard}>
              <h3 style={styles.sectionTitle}>📌 Personalized Recommendations</h3>
              <div style={styles.recommendationsList}>
                <div style={styles.recommendation}>
                  <span style={styles.recommendationIcon}>⚠️</span>
                  <div>
                    <p style={styles.recommendationTitle}>Focus on Physics</p>
                    <p style={styles.recommendationDesc}>Your Physics score (78%) could be improved with more practice on Thermodynamics</p>
                  </div>
                </div>
                <div style={styles.recommendation}>
                  <span style={styles.recommendationIcon}>🎯</span>
                  <div>
                    <p style={styles.recommendationTitle}>Keep Practicing Mathematics</p>
                    <p style={styles.recommendationDesc}>Your Math skills are strong! Continue with advanced calculus problems</p>
                  </div>
                </div>
                <div style={styles.recommendation}>
                  <span style={styles.recommendationIcon}>🚀</span>
                  <div>
                    <p style={styles.recommendationTitle}>Challenge Yourself</p>
                    <p style={styles.recommendationDesc}>Try advanced-level exercises to accelerate your learning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={styles.profileContainer}>
            <h2 style={styles.pageTitle}>👤 Student Profile</h2>
            
            <div style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatarLarge}>👨‍🎓</div>
                <div style={styles.profileInfo}>
                  <h3 style={styles.profileName}>{studentData.name}</h3>
                  <p style={styles.profileLevel}>Level: <strong>{studentData.level.toUpperCase()}</strong></p>
                  <p style={styles.profileStats}>Member since 2024 • Active learner</p>
                </div>
              </div>

              <hr style={styles.divider} />

              <div style={styles.profileSections}>
                <div style={styles.profileSection}>
                  <h4 style={styles.sectionTitle}>Learning Subjects</h4>
                  <div style={styles.subjectTags}>
                    {studentData.subjects.map((subject, idx) => (
                      <span key={idx} style={styles.tag}>{subject}</span>
                    ))}
                  </div>
                </div>

                <div style={styles.profileSection}>
                  <h4 style={styles.sectionTitle}>Achievements</h4>
                  <div style={styles.achievements}>
                    <div style={styles.achievement}>
                      <span style={styles.achievementIcon}>🏆</span>
                      <p>12-Day Streak</p>
                    </div>
                    <div style={styles.achievement}>
                      <span style={styles.achievementIcon}>⭐</span>
                      <p>150+ Exercises</p>
                    </div>
                    <div style={styles.achievement}>
                      <span style={styles.achievementIcon}>🎯</span>
                      <p>75%+ Accuracy</p>
                    </div>
                    <div style={styles.achievement}>
                      <span style={styles.achievementIcon}>🚀</span>
                      <p>45 Hours</p>
                    </div>
                  </div>
                </div>

                <div style={styles.profileSection}>
                  <h4 style={styles.sectionTitle}>Settings</h4>
                  <div style={styles.settings}>
                    <label style={styles.settingItem}>
                      <input type="checkbox" defaultChecked style={styles.checkbox} />
                      <span>Email notifications</span>
                    </label>
                    <label style={styles.settingItem}>
                      <input type="checkbox" defaultChecked style={styles.checkbox} />
                      <span>Daily reminders</span>
                    </label>
                    <label style={styles.settingItem}>
                      <input type="checkbox" style={styles.checkbox} />
                      <span>Dark mode</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 AI Smart Tutor. Transform your learning with AI 🚀</p>
      </footer>
    </div>
  );
};

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <div style={styles.loginLogo}>🧠</div>
          <h1 style={styles.loginTitle}>AI Smart Tutor</h1>
          <p style={styles.loginSubtitle}>Transform Learning with Artificial Intelligence</p>
        </div>

        <form onSubmit={onLogin} style={styles.loginForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginButton}>
            Sign In & Start Learning
          </button>
        </form>

        <div style={styles.loginDivider}>OR</div>

        <button
          onClick={() => onLogin({ preventDefault: () => {} })}
          style={styles.demoButton}
        >
          Try Demo Mode
        </button>

        <p style={styles.loginFooter}>
          Don't have an account? <a href="#signup" style={styles.signupLink}>Sign up now</a>
        </p>
      </div>

      <div style={styles.loginSidebar}>
        <h2 style={styles.sidebarHeading}>Welcome to AI Smart Tutor</h2>
        <div style={styles.featureList}>
          {[
            { icon: '🤖', title: 'AI-Powered Learning', desc: 'Personalized tutoring adapted to your style' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Real-time insights into your journey' },
            { icon: '⚡', title: 'Smart Exercises', desc: 'Dynamic problems that adapt to your level' },
            { icon: '🎯', title: 'Personalized Paths', desc: 'Adaptive content based on your goals' }
          ].map((feature, idx) => (
            <div key={idx} style={styles.feature}>
              <span style={styles.featureIcon}>{feature.icon}</span>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Styles Object
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8f7ff',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    color: '#1f2937'
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    sticky: 'top',
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px'
  },
  logoIcon: {
    fontSize: '2rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1
  },
  navButton: {
    padding: '0.625rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap'
  },
  navButtonActive: {
    backgroundColor: '#7c3aed',
    color: '#ffffff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  xpBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  logoutBtn: {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  main: {
    flex: 1,
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem',
    overflowY: 'auto'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '2rem',
    color: '#1f2937'
  },
  // Dashboard styles
  dashboardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.5rem 0 0 0'
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#7c3aed',
    margin: '0.5rem 0'
  },
  statDesc: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  quickActions: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  actionBtn: {
    padding: '1rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  // Tutor styles
  tutorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  tutorWrapper: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '1.5rem',
    height: '600px'
  },
  topicsSidebar: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    overflow: 'auto'
  },
  sidebarTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
    margin: '1rem 0 0.75rem 0'
  },
  topicButton: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e5e7eb',
    margin: '1rem 0'
  },
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatHistory: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  chatMessage: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    maxWidth: '80%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#7c3aed',
    color: 'white'
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: '#1f2937'
  },
  messageRole: {
    fontSize: '1.25rem',
    flexShrink: 0
  },
  messageText: {
    margin: 0,
    fontSize: '0.875rem'
  },
  chatInputWrapper: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  chatInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  sendButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  // Exercises styles
  exercisesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '3rem',
    margin: 0
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '1rem'
  },
  generateBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  exercisesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  exerciseCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  exerciseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  exerciseType: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase'
  },
  difficultygBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  diffBeginner: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  diffIntermediate: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  diffAdvanced: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  exerciseQuestion: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  optionsGrid: {
    display: 'grid',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  optionButton: {
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.875rem',
    transition: 'all 0.2s'
  },
  optionSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#0284c7'
  },
  optionCorrect: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a'
  },
  optionWrong: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626'
  },
  answerTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    minHeight: '100px',
    resize: 'vertical'
  },
  feedback: {
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontSize: '0.875rem'
  },
  feedbackCorrect: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderLeft: '4px solid #16a34a'
  },
  feedbackWrong: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderLeft: '4px solid #dc2626'
  },
  feedbackDetail: {
    margin: '0.5rem 0 0 0'
  },
  generateMoreBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%'
  },
  // Progress styles
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '1.5rem'
  },
  analyticsCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  recommendationsCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  recommendation: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem'
  },
  recommendationIcon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  recommendationTitle: {
    fontWeight: '600',
    margin: '0 0 0.25rem 0',
    color: '#1f2937'
  },
  recommendationDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  // Profile styles
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem'
  },
  avatarLarge: {
    fontSize: '4rem',
    minWidth: '100px'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    color: '#1f2937'
  },
  profileLevel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.25rem 0'
  },
  profileStats: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: '0.25rem 0'
  },
  profileSections: {
    padding: '1.5rem'
  },
  profileSection: {
    marginBottom: '2rem'
  },
  subjectTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  tag: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  achievements: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem'
  },
  achievement: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    textAlign: 'center'
  },
  achievementIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.5rem'
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer'
  },
  checkbox: {
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  // Login styles
  loginContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },
  loginCard: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  loginLogo: {
    fontSize: '3.5rem',
    marginBottom: '1rem'
  },
  loginTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  loginSubtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: 0
  },
  loginForm: {
    marginBottom: '1.5rem'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '0.875rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  loginButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  loginDivider: {
    textAlign: 'center',
    color: '#d1d5db',
    marginBottom: '1.5rem',
    fontSize: '0.875rem'
  },
  demoButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.5rem'
  },
  loginFooter: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  signupLink: {
    color: '#7c3aed',
    textDecoration: 'none',
    fontWeight: '600'
  },
  loginSidebar: {
    backgroundColor: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white'
  },
  sidebarHeading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '2rem',
    margin: 0
  },
  featureList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  },
  feature: {
    padding: '1.25rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
    backdropFilter: 'blur(10px)'
  },
  featureIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.75rem'
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0'
  },
  featureDesc: {
    fontSize: '0.875rem',
    opacity: 0.9,
    margin: 0
  }
};

export default AISmartTutor;
