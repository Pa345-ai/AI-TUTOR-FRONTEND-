"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  MessageCircle, 
  BookOpen, 
  Target, 
  Heart, 
  Zap, 
  Award,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Clock,
  Star,
  Activity,
  Users,
  Book,
  Calculator,
  Globe,
  Music,
  Palette,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TutorPersonality {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  characteristics: string[];
  teachingStyle: string;
  responsePatterns: string[];
  emotionalTone: 'warm' | 'neutral' | 'strict' | 'enthusiastic';
  difficultyAdjustment: 'adaptive' | 'fixed' | 'progressive';
  interactionStyle: 'conversational' | 'questioning' | 'directive' | 'supportive';
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
  personality?: string;
  emotion?: string;
  confidence?: number;
}

interface LearningSession {
  id: string;
  personality: string;
  startTime: Date;
  endTime?: Date;
  messages: ConversationMessage[];
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  userSatisfaction?: number;
  learningOutcomes: string[];
}

interface PersonalityStats {
  personality: string;
  totalSessions: number;
  averageRating: number;
  totalMessages: number;
  topicsCovered: number;
  lastUsed: Date;
  effectiveness: number;
  userPreference: number;
}

export function AITutorPersonalities() {
  const [activePersonality, setActivePersonality] = useState<string>('socratic');
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<PersonalityStats[]>([]);
  const [learningContext, setLearningContext] = useState({
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    userLevel: 'intermediate'
  });

  // Define tutor personalities
  const personalities: TutorPersonality[] = [
    {
      id: 'socratic',
      name: 'Socrates',
      description: 'Guides you through questions to discover answers yourself',
      icon: <MessageCircle className="h-6 w-6" />,
      color: 'text-blue-600 bg-blue-100',
      characteristics: ['Question-based learning', 'Critical thinking focus', 'Patient guidance', 'Self-discovery'],
      teachingStyle: 'Uses the Socratic method to guide students through questioning rather than direct instruction',
      responsePatterns: [
        'What do you think about...?',
        'How would you approach this problem?',
        'What if we tried a different angle?',
        'Can you explain your reasoning?'
      ],
      emotionalTone: 'neutral',
      difficultyAdjustment: 'adaptive',
      interactionStyle: 'questioning'
    },
    {
      id: 'exam',
      name: 'Professor Strict',
      description: 'Strict testing mode with formal assessment approach',
      icon: <Target className="h-6 w-6" />,
      color: 'text-red-600 bg-red-100',
      characteristics: ['Formal assessment', 'High standards', 'Direct feedback', 'Rigorous testing'],
      teachingStyle: 'Maintains high academic standards with formal testing and direct evaluation',
      responsePatterns: [
        'Let\'s test your knowledge on...',
        'This is incorrect. The proper answer is...',
        'You need to demonstrate mastery of...',
        'Your performance indicates...'
      ],
      emotionalTone: 'strict',
      difficultyAdjustment: 'fixed',
      interactionStyle: 'directive'
    },
    {
      id: 'friendly',
      name: 'Buddy',
      description: 'Gentle, encouraging explanations with emotional support',
      icon: <Heart className="h-6 w-6" />,
      color: 'text-green-600 bg-green-100',
      characteristics: ['Emotional support', 'Gentle explanations', 'Encouraging feedback', 'Patient guidance'],
      teachingStyle: 'Provides warm, supportive learning environment with gentle explanations and encouragement',
      responsePatterns: [
        'Don\'t worry, let\'s work through this together!',
        'You\'re doing great! Let me explain...',
        'I believe in you! Try thinking about it this way...',
        'That\'s a good start! Here\'s how we can improve...'
      ],
      emotionalTone: 'warm',
      difficultyAdjustment: 'adaptive',
      interactionStyle: 'supportive'
    },
    {
      id: 'motivational',
      name: 'Coach',
      description: 'High-energy motivational coaching with emotional encouragement',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-orange-600 bg-orange-100',
      characteristics: ['High energy', 'Motivational coaching', 'Goal-oriented', 'Achievement focus'],
      teachingStyle: 'Uses high-energy motivational techniques to inspire and drive learning achievement',
      responsePatterns: [
        'You\'ve got this! Let\'s crush this problem!',
        'Every expert was once a beginner. Keep pushing!',
        'I see potential in you! Let\'s unlock it!',
        'Success is the sum of small efforts repeated!'
      ],
      emotionalTone: 'enthusiastic',
      difficultyAdjustment: 'progressive',
      interactionStyle: 'conversational'
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    initializePersonalities();
  }, []);

  const initializePersonalities = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleStats: PersonalityStats[] = personalities.map(personality => ({
      personality: personality.name,
      totalSessions: Math.floor(Math.random() * 20) + 5,
      averageRating: Math.random() * 2 + 3, // 3-5
      totalMessages: Math.floor(Math.random() * 500) + 100,
      topicsCovered: Math.floor(Math.random() * 15) + 5,
      lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      effectiveness: Math.random() * 40 + 60, // 60-100
      userPreference: Math.random() * 30 + 70 // 70-100
    }));
    
    setStats(sampleStats);
  }, [personalities]);

  const startSession = useCallback(() => {
    const personality = personalities.find(p => p.id === activePersonality);
    if (!personality) return;
    
    const session: LearningSession = {
      id: `session-${Date.now()}`,
      personality: personality.name,
      startTime: new Date(),
      messages: [],
      topics: [learningContext.topic],
      difficulty: learningContext.difficulty,
      learningOutcomes: []
    };
    
    setCurrentSession(session);
    setIsActive(true);
    
    // Add welcome message
    const welcomeMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      type: 'tutor',
      content: getWelcomeMessage(personality),
      timestamp: new Date(),
      personality: personality.name,
      emotion: 'positive'
    };
    
    setConversation([welcomeMessage]);
  }, [activePersonality, learningContext, personalities]);

  const endSession = useCallback(() => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      endTime: new Date(),
      userSatisfaction: Math.floor(Math.random() * 3) + 3 // 3-5
    };
    
    setCurrentSession(updatedSession);
    setIsActive(false);
    setConversation([]);
  }, [currentSession]);

  const getWelcomeMessage = (personality: TutorPersonality): string => {
    const welcomeMessages = {
      socratic: `Hello! I'm ${personality.name}. I believe the best way to learn is through questioning and discovery. What would you like to explore about ${learningContext.topic}?`,
      exam: `Good day. I'm ${personality.name}. I'll be assessing your knowledge of ${learningContext.topic} today. Are you ready to demonstrate your understanding?`,
      friendly: `Hi there! I'm ${personality.name}, your friendly learning companion. I'm here to help you understand ${learningContext.topic} in a comfortable, supportive way. What would you like to know?`,
      motivational: `Hey there, champion! I'm ${personality.name}, your learning coach! We're going to master ${learningContext.topic} together and unlock your full potential! What's our first challenge?`
    };
    
    return welcomeMessages[personality.id as keyof typeof welcomeMessages] || `Hello! I'm ${personality.name}. How can I help you with ${learningContext.topic}?`;
  };

  const sendMessage = useCallback(async () => {
    if (!userInput.trim() || !currentSession) return;
    
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const personality = personalities.find(p => p.id === activePersonality);
    if (!personality) return;
    
    const tutorResponse = generateTutorResponse(userInput, personality);
    const tutorMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      type: 'tutor',
      content: tutorResponse,
      timestamp: new Date(),
      personality: personality.name,
      emotion: 'positive',
      confidence: Math.random() * 0.3 + 0.7
    };
    
    setConversation(prev => [...prev, tutorMessage]);
  }, [userInput, currentSession, activePersonality, personalities]);

  const generateTutorResponse = (userInput: string, personality: TutorPersonality): string => {
    const responses = {
      socratic: [
        `That's an interesting perspective. What makes you think that about ${learningContext.topic}?`,
        `I see you're thinking about this. What if we considered it from a different angle?`,
        `Good observation! Now, what do you think would happen if we changed this variable?`,
        `You're on the right track. Can you explain your reasoning step by step?`,
        `Interesting approach. How does this relate to what we learned earlier?`
      ],
      exam: [
        `Your answer shows some understanding, but it's not complete. The correct approach is...`,
        `This demonstrates basic knowledge. However, for full credit, you need to consider...`,
        `Partially correct. You've identified the right concept but missed the application.`,
        `Good attempt, but this doesn't meet the standard. Let me show you the proper method.`,
        `Your reasoning has merit, but the answer requires more precision. Here's how...`
      ],
      friendly: [
        `I love how you're thinking about this! Let me help you understand it better...`,
        `That's a great question! Don't worry if it seems confusing - let's work through it together.`,
        `You're doing wonderfully! Here's a gentle way to think about this concept...`,
        `I can see you're trying hard, and that's what matters! Let me explain this step by step...`,
        `What a thoughtful approach! I'm proud of your effort. Here's how we can build on that...`
      ],
      motivational: [
        `YES! That's the spirit! You're thinking like a champion! Let's take this to the next level!`,
        `I love your energy! You're absolutely crushing this! Here's how we can go even further!`,
        `That's what I'm talking about! You've got the right mindset! Let's push through to mastery!`,
        `BOOM! That's the kind of thinking that leads to success! Keep that momentum going!`,
        `You're on fire! I can see your potential shining through! Let's unlock even more!`
      ]
    };
    
    const personalityResponses = responses[personality.id as keyof typeof responses] || responses.socratic;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  };

  const getPersonalityIcon = (personalityId: string) => {
    const personality = personalities.find(p => p.id === personalityId);
    return personality?.icon || <Brain className="h-6 w-6" />;
  };

  const getPersonalityColor = (personalityId: string) => {
    const personality = personalities.find(p => p.id === personalityId);
    return personality?.color || 'text-gray-600 bg-gray-100';
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      case 'neutral': return <Meh className="h-4 w-4 text-gray-500" />;
      default: return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Tutor Personalities
          </h1>
          <p className="text-gray-600">Choose your perfect learning companion</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {isActive && (
            <Button
              onClick={endSession}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Pause className="h-4 w-4 mr-2" />
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* Personality Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              activePersonality === personality.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setActivePersonality(personality.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full ${personality.color}`}>
                {personality.icon}
              </div>
              <div>
                <h3 className="font-semibold">{personality.name}</h3>
                <p className="text-sm text-gray-600">{personality.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Style: </span>
                <span className="text-gray-600">{personality.teachingStyle}</span>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Tone: </span>
                <span className="text-gray-600 capitalize">{personality.emotionalTone}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {personality.characteristics.slice(0, 2).map((char, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Context */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={learningContext.subject}
              onChange={(e) => setLearningContext(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Language">Language</option>
              <option value="History">History</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input
              type="text"
              value={learningContext.topic}
              onChange={(e) => setLearningContext(prev => ({ ...prev, topic: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter topic"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={learningContext.difficulty}
              onChange={(e) => setLearningContext(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your Level</label>
            <select
              value={learningContext.userLevel}
              onChange={(e) => setLearningContext(prev => ({ ...prev, userLevel: e.target.value }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Learning Session</h3>
            <p className="text-gray-600">
              {isActive ? 'Session in progress' : 'Ready to start learning'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isActive ? (
              <Button onClick={startSession}>
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  Active with {personalities.find(p => p.id === activePersonality)?.name}
                </div>
                <Button onClick={endSession} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  End
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Interface */}
      {isActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {getPersonalityIcon(activePersonality)}
              Conversation with {personalities.find(p => p.id === activePersonality)?.name}
            </h3>
            
            <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-4">
              {conversation.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'tutor' && message.emotion && (
                        <div className="mt-1">
                          {getEmotionIcon(message.emotion)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.personality && (
                            <span className="text-xs opacity-70">
                              {message.personality}
                            </span>
                          )}
                          {message.confidence && (
                            <span className="text-xs opacity-70">
                              {Math.round(message.confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isSpeaking}
              />
              <Button
                onClick={sendMessage}
                disabled={!userInput.trim() || isSpeaking}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Session Info</h3>
            
            {currentSession && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Personality</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getPersonalityIcon(activePersonality)}
                    <span>{personalities.find(p => p.id === activePersonality)?.name}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Duration</div>
                  <div className="text-sm text-gray-800">
                    {Math.floor((Date.now() - currentSession.startTime.getTime()) / 60000)} minutes
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Messages</div>
                  <div className="text-sm text-gray-800">{conversation.length}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Topics</div>
                  <div className="text-sm text-gray-800">{currentSession.topics.join(', ')}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Difficulty</div>
                  <div className="text-sm text-gray-800 capitalize">{currentSession.difficulty}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personality Statistics */}
      {stats.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Personality Performance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getPersonalityIcon(personalities[index]?.id || '')}
                  <span className="font-medium">{stat.personality}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions:</span>
                    <span className="font-medium">{stat.totalSessions}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{stat.averageRating.toFixed(1)}/5</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effectiveness:</span>
                    <span className="font-medium">{Math.round(stat.effectiveness)}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preference:</span>
                    <span className="font-medium">{Math.round(stat.userPreference)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Personality Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Response Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Response Speed</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="fast">Fast (1-2 seconds)</option>
                    <option value="normal">Normal (2-3 seconds)</option>
                    <option value="slow">Slow (3-5 seconds)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Response Length</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="short">Short & Concise</option>
                    <option value="medium">Medium Detail</option>
                    <option value="long">Detailed & Comprehensive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Learning Preferences</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Adaptation Speed</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="slow">Slow Adaptation</option>
                    <option value="medium">Medium Adaptation</option>
                    <option value="fast">Fast Adaptation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Feedback Style</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option value="immediate">Immediate Feedback</option>
                    <option value="delayed">Delayed Feedback</option>
                    <option value="mixed">Mixed Approach</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
