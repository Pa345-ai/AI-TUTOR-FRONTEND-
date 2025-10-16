// Mock API for testing when backend is not available
export const MOCK_BACKEND = true;

export interface MockResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Mock chat response
export async function mockChat(request: any): Promise<{ reply: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const responses = [
    "Hello! I'm your AI tutor. How can I help you learn today?",
    "That's a great question! Let me explain this concept step by step.",
    "I understand you're working on this topic. Here's what you need to know...",
    "Excellent progress! You're mastering this subject well.",
    "Let me break this down into simpler terms for you.",
    "This is a challenging concept, but I believe you can understand it!",
    "Great question! This relates to what we discussed earlier about...",
    "I can see you're thinking critically about this. Here's my analysis...",
    "Perfect! You've got the right idea. Let me add some additional context...",
    "This is exactly the kind of thinking that will help you succeed!"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return { reply: randomResponse };
}

// Mock progress data
export function mockProgress() {
  return {
    xp: Math.floor(Math.random() * 5000) + 1000,
    level: Math.floor(Math.random() * 20) + 1,
    streak: Math.floor(Math.random() * 30) + 1,
    totalAssignmentsCompleted: Math.floor(Math.random() * 50) + 10,
    totalQuizzesCompleted: Math.floor(Math.random() * 30) + 5,
    averageScore: Math.floor(Math.random() * 30) + 70
  };
}

// Mock achievements
export function mockAchievements() {
  return [
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
    { id: '2', name: 'Streak Master', description: 'Maintain a 7-day learning streak', icon: '🔥' },
    { id: '3', name: 'Quiz Champion', description: 'Score 100% on 5 quizzes', icon: '🏆' },
    { id: '4', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '📚' },
    { id: '5', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '⭐' }
  ];
}

// Mock flashcards
export function mockFlashcards() {
  return [
    { id: '1', front: 'What is photosynthesis?', back: 'The process by which plants convert light energy into chemical energy', subject: 'Biology', deckId: 'biology-1', tags: ['plants', 'energy'] },
    { id: '2', front: 'What is the capital of France?', back: 'Paris', subject: 'Geography', deckId: 'geography-1', tags: ['cities', 'europe'] },
    { id: '3', front: 'What is 2 + 2?', back: '4', subject: 'Mathematics', deckId: 'math-1', tags: ['arithmetic', 'basic'] }
  ];
}

// Mock learning paths
export function mockLearningPaths() {
  return [
    { id: '1', subject: 'Mathematics', currentTopic: 'Algebra', completedTopics: ['Arithmetic', 'Fractions'], recommendedResources: [
      { title: 'Algebra Basics', url: '#', type: 'video' },
      { title: 'Practice Problems', url: '#', type: 'exercise' }
    ]},
    { id: '2', subject: 'Science', currentTopic: 'Physics', completedTopics: ['Chemistry'], recommendedResources: [
      { title: 'Physics Fundamentals', url: '#', type: 'video' },
      { title: 'Lab Experiments', url: '#', type: 'interactive' }
    ]}
  ];
}

// Mock notifications
export function mockNotifications() {
  return [
    { id: '1', userId: 'user1', type: 'achievement', title: 'Achievement Unlocked!', message: 'You earned the "First Steps" badge', isRead: false, createdAt: new Date().toISOString() },
    { id: '2', userId: 'user1', type: 'reminder', title: 'Study Reminder', message: 'Time for your daily math practice', isRead: false, createdAt: new Date().toISOString() },
    { id: '3', userId: 'user1', type: 'progress', title: 'Great Progress!', message: 'You completed 5 lessons this week', isRead: true, createdAt: new Date().toISOString() }
  ];
}

// Mock study rooms
export function mockStudyRooms() {
  return [
    { id: '1', name: 'Math Study Group', topic: 'Algebra' },
    { id: '2', name: 'Science Lab', topic: 'Physics' },
    { id: '3', name: 'Language Learning', topic: 'English' }
  ];
}

// Mock leaderboard
export function mockLeaderboard() {
  return [
    { userId: 'user1', name: 'Alice Johnson', xp: 2500, level: 15 },
    { userId: 'user2', name: 'Bob Smith', xp: 2300, level: 14 },
    { userId: 'user3', name: 'Carol Davis', xp: 2100, level: 13 },
    { userId: 'user4', name: 'David Wilson', xp: 1900, level: 12 },
    { userId: 'user5', name: 'Eva Brown', xp: 1700, level: 11 }
  ];
}