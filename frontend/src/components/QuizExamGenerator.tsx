"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  FileText, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Award, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Download, 
  Share, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw, 
  Zap, 
  BookOpen, 
  Calculator, 
  Globe, 
  Music, 
  Palette, 
  Image, 
  Video, 
  Mic, 
  Volume2, 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  SkipForward, 
  SkipBack, 
  Flag, 
  Bookmark, 
  Users, 
  Activity, 
  Timer, 
  Calendar, 
  Send, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Smile, 
  Frown, 
  Meh
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'matching' | 'ordering' | 'drag-drop';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
  timeLimit?: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    alt?: string;
  };
  hints?: string[];
  tags: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  totalPoints: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  attempts: number;
  averageScore: number;
  tags: string[];
}

interface Exam extends Quiz {
  isExam: true;
  passingScore: number;
  maxAttempts: number;
  proctoringEnabled: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResults: 'immediate' | 'after-completion' | 'manual';
}

interface GenerationRequest {
  source: 'topic' | 'file' | 'text' | 'url';
  content: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionTypes: Question['type'][];
  timeLimit?: number;
  subject: string;
  topic: string;
  includeMedia: boolean;
  includeHints: boolean;
  language: string;
}

interface QuizStats {
  totalQuizzes: number;
  totalExams: number;
  totalQuestions: number;
  averageScore: number;
  totalAttempts: number;
  completionRate: number;
  mostPopularTopic: string;
  recentActivity: Array<{
    id: string;
    type: 'quiz' | 'exam';
    title: string;
    score?: number;
    timestamp: Date;
  }>;
}

export function QuizExamGenerator() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationRequest, setGenerationRequest] = useState<GenerationRequest>({
    source: 'topic',
    content: '',
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false'],
    timeLimit: 30,
    subject: 'Mathematics',
    topic: 'Algebra',
    includeMedia: false,
    includeHints: true,
    language: 'en'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'exams' | 'generator' | 'analytics'>('quizzes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleQuizzes: Quiz[] = [
      {
        id: 'quiz-1',
        title: 'Basic Algebra Fundamentals',
        description: 'Test your understanding of basic algebraic concepts',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'What is the value of x in the equation 2x + 5 = 13?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '4',
            explanation: 'To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
            difficulty: 'easy',
            topic: 'Linear Equations',
            points: 10,
            timeLimit: 60,
            tags: ['algebra', 'linear equations', 'solving']
          }
        ],
        totalPoints: 10,
        timeLimit: 30,
        difficulty: 'easy',
        subject: 'Mathematics',
        topic: 'Algebra',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPublished: true,
        attempts: 45,
        averageScore: 78,
        tags: ['algebra', 'mathematics', 'fundamentals']
      }
    ];
    
    const sampleStats: QuizStats = {
      totalQuizzes: 12,
      totalExams: 5,
      totalQuestions: 156,
      averageScore: 75,
      totalAttempts: 234,
      completionRate: 87,
      mostPopularTopic: 'Algebra',
      recentActivity: [
        {
          id: 'a1',
          type: 'quiz',
          title: 'Basic Algebra Fundamentals',
          score: 85,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    };
    
    setQuizzes(sampleQuizzes);
    setStats(sampleStats);
  }, []);

  const generateQuiz = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedQuestions: Question[] = generateQuestions(generationRequest);
      
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: `${generationRequest.topic} Quiz`,
        description: `Generated quiz covering ${generationRequest.topic} topics`,
        questions: generatedQuestions,
        totalPoints: generatedQuestions.reduce((sum, q) => sum + q.points, 0),
        timeLimit: generationRequest.timeLimit || 30,
        difficulty: generationRequest.difficulty === 'mixed' ? 'medium' : generationRequest.difficulty,
        subject: generationRequest.subject,
        topic: generationRequest.topic,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
        attempts: 0,
        averageScore: 0,
        tags: [generationRequest.topic.toLowerCase(), generationRequest.subject.toLowerCase()]
      };
      
      setQuizzes(prev => [newQuiz, ...prev]);
      setActiveTab('quizzes');
      
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generationRequest]);

  const generateQuestions = (request: GenerationRequest): Question[] => {
    const questions: Question[] = [];
    const questionTypes = request.questionTypes;
    
    for (let i = 0; i < request.questionCount; i++) {
      const type = questionTypes[i % questionTypes.length];
      const difficulty = request.difficulty === 'mixed' 
        ? ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard'
        : request.difficulty;
      
      const question = createQuestion(type, difficulty, request.topic, i + 1);
      questions.push(question);
    }
    
    return questions;
  };

  const createQuestion = (type: Question['type'], difficulty: string, topic: string, index: number): Question => {
    const baseQuestion = {
      id: `q${index}`,
      type,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      topic,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15,
      timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 90,
      tags: [topic.toLowerCase()],
      explanation: `This question tests your understanding of ${topic} concepts.`
    };

    switch (type) {
      case 'multiple-choice':
        return {
          ...baseQuestion,
          question: `What is the correct answer for this ${topic} problem?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option B'
        };
      
      case 'true-false':
        return {
          ...baseQuestion,
          question: `True or False: This statement about ${topic} is correct.`,
          correctAnswer: 'true'
        };
      
      case 'fill-blank':
        return {
          ...baseQuestion,
          question: `Complete the following: The main concept in ${topic} is _____.`,
          correctAnswer: 'fundamental principle'
        };
      
      case 'essay':
        return {
          ...baseQuestion,
          question: `Explain the key concepts of ${topic} and provide examples.`,
          correctAnswer: 'Student should explain key concepts with examples',
          points: 20
        };
      
      default:
        return {
          ...baseQuestion,
          type: 'multiple-choice',
          question: `What is the correct answer for this ${topic} problem?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option B'
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Quiz & Exam Generator
          </h1>
          <p className="text-gray-600">AI-powered automatic quiz and exam generation</p>
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
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalQuizzes}</div>
            <div className="text-gray-600">Total Quizzes</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalExams}</div>
            <div className="text-gray-600">Total Exams</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalQuestions}</div>
            <div className="text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageScore}%</div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'quizzes', label: 'Quizzes', icon: <FileText className="h-4 w-4" /> },
          { id: 'exams', label: 'Exams', icon: <Award className="h-4 w-4" /> },
          { id: 'generator', label: 'Generator', icon: <Zap className="h-4 w-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Generator */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI Quiz Generator
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generation Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Type</label>
                <select
                  value={generationRequest.source}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="topic">Topic/Subject</option>
                  <option value="file">Upload File</option>
                  <option value="text">Paste Text</option>
                  <option value="url">Website URL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select
                  value={generationRequest.subject}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, subject: e.target.value }))}
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
                  value={generationRequest.topic}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter topic or subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={generationRequest.questionCount}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <select
                  value={generationRequest.difficulty}
                  onChange={(e) => setGenerationRequest(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
            
            {/* Content Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                {generationRequest.source === 'file' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Upload files (PDF, DOC, TXT)</p>
                    <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.txt" />
                  </div>
                ) : (
                  <textarea
                    value={generationRequest.content}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-32 p-3 border rounded-lg"
                    placeholder="Enter content, paste text, or describe what you want to test..."
                  />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={generationRequest.timeLimit || 30}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={generationRequest.language}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationRequest.includeMedia}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeMedia: e.target.checked }))}
                  />
                  <span className="text-sm">Include media (images, videos)</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationRequest.includeHints}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeHints: e.target.checked }))}
                  />
                  <span className="text-sm">Include hints for questions</span>
                </label>
              </div>
              
              <Button
                onClick={generateQuiz}
                disabled={isGenerating || !generationRequest.topic.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Language">Language</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes
              .filter(quiz => 
                (searchQuery === '' || quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (filterDifficulty === 'all' || quiz.difficulty === filterDifficulty) &&
                (filterSubject === 'all' || quiz.subject === filterSubject)
              )
              .map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <p className="text-gray-600 text-sm">{quiz.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.subject} - {quiz.topic}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4" />
                      <span>{quiz.totalPoints} points</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {quiz.attempts} attempts • {quiz.averageScore}% avg
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-600">
                        {activity.timestamp.toLocaleDateString()} • Score: {activity.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium">{stats.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-medium">{stats.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Attempts</span>
                  <span className="font-medium">{stats.totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Most Popular Topic</span>
                  <span className="font-medium">{stats.mostPopularTopic}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">Question Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Multiple Choice</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>True/False</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Fill in Blank</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Essay</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
