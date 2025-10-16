"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Lightbulb, 
  GraduationCap, 
  ToggleLeft, 
  ToggleRight, 
  MessageSquare, 
  BookOpen, 
  Target, 
  Zap, 
  Settings, 
  History, 
  Star, 
  Clock, 
  BarChart3, 
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ExplanationMode {
  id: 'eli5' | 'expert';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  characteristics: string[];
  complexity: 'simple' | 'intermediate' | 'advanced';
  targetAudience: string;
  exampleResponse: string;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  mode: 'eli5' | 'expert';
  timestamp: Date;
  rating?: number;
  feedback?: 'positive' | 'negative' | 'neutral';
  metadata?: {
    complexity?: string;
    keywords?: string[];
    concepts?: string[];
    confidence?: number;
  };
}

interface ExplanationStats {
  totalExplanations: number;
  eli5Count: number;
  expertCount: number;
  averageRating: number;
  totalTime: number;
  mostUsedMode: 'eli5' | 'expert';
  recentActivity: Array<{
    id: string;
    mode: 'eli5' | 'expert';
    topic: string;
    rating: number;
    timestamp: Date;
  }>;
}

interface LearningContext {
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  currentKnowledge: string[];
  preferredMode: 'eli5' | 'expert' | 'auto';
}

export function ELI5ExpertToggle() {
  const [activeMode, setActiveMode] = useState<'eli5' | 'expert'>('eli5');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningContext, setLearningContext] = useState<LearningContext>({
    subject: 'General',
    topic: '',
    difficulty: 'beginner',
    learningGoals: [],
    currentKnowledge: [],
    preferredMode: 'auto'
  });
  const [stats, setStats] = useState<ExplanationStats | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'analytics'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');

  const explanationModes: ExplanationMode[] = [
    {
      id: 'eli5',
      name: 'ELI5 (Explain Like I\'m 5)',
      description: 'Simple, easy-to-understand explanations using everyday language and analogies',
      icon: <Lightbulb className="h-6 w-6" />,
      color: 'text-yellow-600 bg-yellow-100',
      characteristics: [
        'Uses simple analogies',
        'Avoids technical jargon',
        'Focuses on core concepts',
        'Visual and relatable examples',
        'Step-by-step breakdown'
      ],
      complexity: 'simple',
      targetAudience: 'Beginners, children, general audience',
      exampleResponse: 'Think of a computer like a very smart calculator that can remember things and follow instructions really fast!'
    },
    {
      id: 'expert',
      name: 'Expert Mode',
      description: 'Detailed, technical explanations with advanced concepts and terminology',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'text-blue-600 bg-blue-100',
      characteristics: [
        'Technical terminology',
        'Detailed explanations',
        'Advanced concepts',
        'Research citations',
        'Comprehensive coverage'
      ],
      complexity: 'advanced',
      targetAudience: 'Professionals, students, researchers',
      exampleResponse: 'The computational architecture employs parallel processing algorithms with quantum-enhanced optimization protocols...'
    }
  ];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleStats: ExplanationStats = {
      totalExplanations: 156,
      eli5Count: 89,
      expertCount: 67,
      averageRating: 4.2,
      totalTime: 2340,
      mostUsedMode: 'eli5',
      recentActivity: [
        {
          id: 'a1',
          mode: 'eli5',
          topic: 'Machine Learning',
          rating: 4.5,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'a2',
          mode: 'expert',
          topic: 'Quantum Computing',
          rating: 4.0,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]
    };
    
    setStats(sampleStats);
  }, []);

  const generateExplanation = useCallback(async (input: string, mode: 'eli5' | 'expert') => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const explanation = mode === 'eli5' 
        ? generateELI5Explanation(input)
        : generateExpertExplanation(input);
      
      const newMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: explanation,
        mode,
        timestamp: new Date(),
        metadata: {
          complexity: mode === 'eli5' ? 'simple' : 'advanced',
          keywords: extractKeywords(input),
          concepts: extractConcepts(input),
          confidence: 0.85
        }
      };
      
      setConversation(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateELI5Explanation = (input: string): string => {
    const eli5Responses = [
      `Let me explain ${input} like you're 5 years old! Imagine it's like...`,
      `Think of ${input} as if it were a toy or game. Here's how it works:`,
      `Picture ${input} like a story with characters and adventures...`,
      `Imagine ${input} is like building with blocks - you start simple and add more pieces...`,
      `Let's pretend ${input} is like cooking - you need ingredients and follow steps...`
    ];
    
    return eli5Responses[Math.floor(Math.random() * eli5Responses.length)] + 
      `\n\n${input} is basically like a really cool puzzle that helps us understand how things work. It's like having a superpower that lets us see patterns and solve problems!`;
  };

  const generateExpertExplanation = (input: string): string => {
    const expertResponses = [
      `From a technical perspective, ${input} involves several key components and methodologies...`,
      `The theoretical framework underlying ${input} encompasses multiple disciplines and approaches...`,
      `In the context of ${input}, we can analyze the underlying mechanisms and principles...`,
      `The implementation of ${input} requires consideration of various factors and constraints...`,
      `Research in ${input} has demonstrated significant advances in recent years...`
    ];
    
    return expertResponses[Math.floor(Math.random() * expertResponses.length)] + 
      `\n\nThis involves complex interactions between multiple systems, requiring deep understanding of the underlying principles and methodologies.`;
  };

  const extractKeywords = (text: string): string[] => {
    return text.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 5);
  };

  const extractConcepts = (text: string): string[] => {
    return ['concept1', 'concept2', 'concept3'];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isGenerating) return;
    
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: userInput,
      mode: activeMode,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    generateExplanation(userInput, activeMode);
    setUserInput('');
  };

  const toggleMode = () => {
    setActiveMode(prev => prev === 'eli5' ? 'expert' : 'eli5');
  };

  const getModeColor = (mode: 'eli5' | 'expert') => {
    return mode === 'eli5' ? 'text-yellow-600 bg-yellow-100' : 'text-blue-600 bg-blue-100';
  };

  const getModeIcon = (mode: 'eli5' | 'expert') => {
    return mode === 'eli5' ? <Lightbulb className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            ELI5 + Expert Toggle
          </h1>
          <p className="text-gray-600">Switch between simple and expert explanations instantly</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalExplanations}</div>
            <div className="text-gray-600">Total Explanations</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.eli5Count}</div>
            <div className="text-gray-600">ELI5 Mode</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.expertCount}</div>
            <div className="text-gray-600">Expert Mode</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageRating.toFixed(1)}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Explanation Mode</h3>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${activeMode === 'eli5' ? 'text-yellow-600' : 'text-gray-500'}`}>
              ELI5
            </span>
            <button
              onClick={toggleMode}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  activeMode === 'expert' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${activeMode === 'expert' ? 'text-blue-600' : 'text-gray-500'}`}>
              Expert
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {explanationModes.map((mode) => (
            <div
              key={mode.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                activeMode === mode.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveMode(mode.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${mode.color}`}>
                  {mode.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{mode.name}</h4>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Target Audience:</span> {mode.targetAudience}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Complexity:</span> {mode.complexity}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Example:</span> {mode.exampleResponse}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Ask Anything</h3>
            <div className={`ml-auto px-3 py-1 rounded-full text-sm ${getModeColor(activeMode)}`}>
              {getModeIcon(activeMode)}
              <span className="ml-1">{activeMode.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.type === 'assistant' && (
                    <div className={`px-2 py-1 rounded-full text-xs ${getModeColor(message.mode)}`}>
                      {getModeIcon(message.mode)}
                      <span className="ml-1">{message.mode.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mt-3">
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      <Bookmark className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating {activeMode.toUpperCase()} explanation...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`Ask anything in ${activeMode.toUpperCase()} mode...`}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isGenerating}
            />
            <Button type="submit" disabled={isGenerating || !userInput.trim()}>
              <Zap className="h-4 w-4 mr-2" />
              Ask
            </Button>
          </div>
        </form>
      </div>

      {/* Learning Context Settings */}
      {showSettings && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Learning Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={learningContext.subject}
                onChange={(e) => setLearningContext(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="General">General</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Language">Language</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={learningContext.difficulty}
                onChange={(e) => setLearningContext(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Mode</label>
              <select
                value={learningContext.preferredMode}
                onChange={(e) => setLearningContext(prev => ({ ...prev, preferredMode: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="auto">Auto (Based on context)</option>
                <option value="eli5">ELI5</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Current Topic</label>
              <input
                type="text"
                value={learningContext.topic}
                onChange={(e) => setLearningContext(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="What are you learning about?"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
