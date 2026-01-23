"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload,
  BookOpen,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Filter,
  Search,
  Settings,
  Eye,
  EyeOff,
  Shuffle,
  BarChart3,
  TrendingUp,
  Award,
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Save,
  FileText,
  Image,
  Code,
  Calculator,
  Globe,
  Music,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'text' | 'image' | 'code' | 'formula' | 'definition' | 'example';
  tags: string[];
  createdAt: Date;
  lastReviewed: Date;
  reviewCount: number;
  mastery: number; // 0-100
  source?: string;
  notes?: string;
  mediaUrl?: string;
  isGenerated: boolean;
  generationMethod: 'ai' | 'manual' | 'import';
}

interface GenerationRequest {
  content: string;
  subject: string;
  topic: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mixed' | 'text' | 'image' | 'code' | 'formula';
  language: string;
  includeExamples: boolean;
  includeDefinitions: boolean;
  includeFormulas: boolean;
}

interface StudySession {
  id: string;
  flashcards: Flashcard[];
  currentIndex: number;
  correct: number;
  incorrect: number;
  skipped: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  new: number;
  dueToday: number;
  averageMastery: number;
  streak: number;
  lastStudyDate: Date;
}

export function AIGeneratedFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [masteryFilter, setMasteryFilter] = useState('');
  
  // Generation form
  const [generationRequest, setGenerationRequest] = useState<GenerationRequest>({
    content: '',
    subject: '',
    topic: '',
    count: 10,
    difficulty: 'medium',
    type: 'mixed',
    language: 'en',
    includeExamples: true,
    includeDefinitions: true,
    includeFormulas: false
  });

  // Initialize with sample data
  useEffect(() => {
    initializeFlashcards();
  }, []);

  // Filter flashcards based on search and filters
  useEffect(() => {
    let filtered = flashcards;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query) ||
        card.topic.toLowerCase().includes(query) ||
        card.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (subjectFilter) {
      filtered = filtered.filter(card => card.subject === subjectFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(card => card.difficulty === difficultyFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(card => card.type === typeFilter);
    }

    if (masteryFilter) {
      switch (masteryFilter) {
        case 'new':
          filtered = filtered.filter(card => card.mastery === 0);
          break;
        case 'learning':
          filtered = filtered.filter(card => card.mastery > 0 && card.mastery < 80);
          break;
        case 'mastered':
          filtered = filtered.filter(card => card.mastery >= 80);
          break;
      }
    }

    setFilteredCards(filtered);
  }, [flashcards, searchQuery, subjectFilter, difficultyFilter, typeFilter, masteryFilter]);

  const initializeFlashcards = useCallback(async () => {
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleFlashcards: Flashcard[] = [
      {
        id: 'card-1',
        front: 'What is the quadratic formula?',
        back: 'x = (-b ± √(b² - 4ac)) / 2a',
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'medium',
        type: 'formula',
        tags: ['algebra', 'quadratic', 'formula'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reviewCount: 8,
        mastery: 85,
        source: 'AI Generated from Algebra Notes',
        isGenerated: true,
        generationMethod: 'ai'
      },
      {
        id: 'card-2',
        front: 'Define photosynthesis',
        back: 'The process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.',
        subject: 'Biology',
        topic: 'Plant Biology',
        difficulty: 'easy',
        type: 'definition',
        tags: ['biology', 'photosynthesis', 'plants'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        reviewCount: 5,
        mastery: 92,
        source: 'AI Generated from Biology Textbook',
        isGenerated: true,
        generationMethod: 'ai'
      },
      {
        id: 'card-3',
        front: 'What does this Python code do?\n\n```python\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)\n```',
        back: 'This function calculates the factorial of a number using recursion. It returns 1 for n ≤ 1, otherwise it multiplies n by the factorial of n-1.',
        subject: 'Computer Science',
        topic: 'Python Programming',
        difficulty: 'hard',
        type: 'code',
        tags: ['python', 'recursion', 'factorial', 'programming'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reviewCount: 3,
        mastery: 45,
        source: 'AI Generated from Code Examples',
        isGenerated: true,
        generationMethod: 'ai'
      },
      {
        id: 'card-4',
        front: 'What is the derivative of x²?',
        back: '2x',
        subject: 'Mathematics',
        topic: 'Calculus',
        difficulty: 'easy',
        type: 'formula',
        tags: ['calculus', 'derivative', 'power-rule'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reviewCount: 12,
        mastery: 95,
        source: 'AI Generated from Calculus Notes',
        isGenerated: true,
        generationMethod: 'ai'
      },
      {
        id: 'card-5',
        front: 'Explain the water cycle',
        back: 'The continuous movement of water through evaporation, condensation, and precipitation. Water evaporates from oceans, forms clouds, and falls as rain or snow.',
        subject: 'Science',
        topic: 'Earth Science',
        difficulty: 'medium',
        type: 'definition',
        tags: ['earth-science', 'water-cycle', 'weather'],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reviewCount: 6,
        mastery: 78,
        source: 'AI Generated from Science Textbook',
        isGenerated: true,
        generationMethod: 'ai'
      }
    ];

    const sampleStats: FlashcardStats = {
      total: sampleFlashcards.length,
      mastered: sampleFlashcards.filter(c => c.mastery >= 80).length,
      learning: sampleFlashcards.filter(c => c.mastery > 0 && c.mastery < 80).length,
      new: sampleFlashcards.filter(c => c.mastery === 0).length,
      dueToday: sampleFlashcards.filter(c => {
        const daysSinceReview = Math.floor((Date.now() - c.lastReviewed.getTime()) / (24 * 60 * 60 * 1000));
        return daysSinceReview >= 1;
      }).length,
      averageMastery: Math.round(sampleFlashcards.reduce((sum, c) => sum + c.mastery, 0) / sampleFlashcards.length),
      streak: 7,
      lastStudyDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };

    setFlashcards(sampleFlashcards);
    setStats(sampleStats);
  }, []);

  const generateFlashcards = async () => {
    if (!generationRequest.content.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedCards: Flashcard[] = Array.from({ length: generationRequest.count }, (_, i) => {
      const topics = ['Basic Concepts', 'Advanced Topics', 'Examples', 'Formulas', 'Definitions'];
      const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
      const types: ('text' | 'image' | 'code' | 'formula' | 'definition' | 'example')[] = ['text', 'definition', 'example'];
      
      return {
        id: `generated-${Date.now()}-${i}`,
        front: `Generated Question ${i + 1} about ${generationRequest.topic}`,
        back: `Generated Answer ${i + 1} with detailed explanation`,
        subject: generationRequest.subject,
        topic: generationRequest.topic,
        difficulty: generationRequest.difficulty,
        type: types[Math.floor(Math.random() * types.length)],
        tags: [generationRequest.topic.toLowerCase(), 'ai-generated'],
        createdAt: new Date(),
        lastReviewed: new Date(),
        reviewCount: 0,
        mastery: 0,
        source: `AI Generated from: ${generationRequest.content.substring(0, 50)}...`,
        isGenerated: true,
        generationMethod: 'ai'
      };
    });

    setFlashcards(prev => [...generatedCards, ...prev]);
    setIsGenerating(false);
    
    // Reset form
    setGenerationRequest(prev => ({ ...prev, content: '' }));
  };

  const startStudySession = (cards: Flashcard[]) => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      flashcards: cards,
      currentIndex: 0,
      correct: 0,
      incorrect: 0,
      skipped: 0,
      startTime: new Date(),
      isActive: true
    };
    
    setStudySession(session);
    setCurrentCard(cards[0]);
    setShowAnswer(false);
    setIsStudying(true);
  };

  const endStudySession = () => {
    if (!studySession) return;
    
    const updatedSession = {
      ...studySession,
      endTime: new Date(),
      isActive: false
    };
    
    setStudySession(updatedSession);
    setIsStudying(false);
    setCurrentCard(null);
    setShowAnswer(false);
  };

  const reviewCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!studySession || !currentCard) return;
    
    const ratingScores = { again: 0, hard: 3, good: 4, easy: 5 };
    const score = ratingScores[rating];
    
    // Update card mastery based on rating
    const updatedCard = {
      ...currentCard,
      mastery: Math.min(100, currentCard.mastery + (score * 10)),
      reviewCount: currentCard.reviewCount + 1,
      lastReviewed: new Date()
    };
    
    // Update flashcards array
    setFlashcards(prev => prev.map(card => 
      card.id === currentCard.id ? updatedCard : card
    ));
    
    // Update session stats
    const updatedSession = {
      ...studySession,
      correct: rating === 'good' || rating === 'easy' ? studySession.correct + 1 : studySession.correct,
      incorrect: rating === 'again' || rating === 'hard' ? studySession.incorrect + 1 : studySession.incorrect,
      currentIndex: studySession.currentIndex + 1
    };
    
    setStudySession(updatedSession);
    
    // Move to next card or end session
    if (updatedSession.currentIndex >= updatedSession.flashcards.length) {
      endStudySession();
    } else {
      setCurrentCard(updatedSession.flashcards[updatedSession.currentIndex]);
      setShowAnswer(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      case 'formula': return <Calculator className="h-4 w-4" />;
      case 'definition': return <BookOpen className="h-4 w-4" />;
      case 'example': return <Lightbulb className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600 bg-green-100';
    if (mastery >= 50) return 'text-yellow-600 bg-yellow-100';
    if (mastery > 0) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          AI-Generated Flashcards
        </h1>
        <p className="text-gray-600">Intelligent flashcard generation and spaced repetition learning</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-gray-600">Total Cards</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.mastered}</div>
            <div className="text-gray-600">Mastered</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.learning}</div>
            <div className="text-gray-600">Learning</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.dueToday}</div>
            <div className="text-gray-600">Due Today</div>
          </div>
        </div>
      )}

      {/* AI Generation Form */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          AI Flashcard Generator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Content to Generate From</label>
            <textarea
              value={generationRequest.content}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Paste your notes, textbook content, or any text to generate flashcards from..."
              className="w-full h-32 p-3 border rounded-lg resize-none"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={generationRequest.subject}
                onChange={(e) => setGenerationRequest(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Mathematics, Biology"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={generationRequest.topic}
                onChange={(e) => setGenerationRequest(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Algebra, Photosynthesis"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Cards</label>
            <input
              type="number"
              min="1"
              max="50"
              value={generationRequest.count}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, count: parseInt(e.target.value) }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={generationRequest.difficulty}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={generationRequest.type}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="mixed">Mixed</option>
              <option value="text">Text Only</option>
              <option value="image">With Images</option>
              <option value="code">Code Examples</option>
              <option value="formula">Formulas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={generationRequest.language}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-3 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={generationRequest.includeExamples}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeExamples: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Include Examples</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={generationRequest.includeDefinitions}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeDefinitions: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Include Definitions</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={generationRequest.includeFormulas}
              onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeFormulas: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Include Formulas</span>
          </label>
        </div>

        <Button
          onClick={generateFlashcards}
          disabled={!generationRequest.content.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating {generationRequest.count} flashcards...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>

      {/* Study Session */}
      {isStudying && studySession && currentCard && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Study Session</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Card {studySession.currentIndex + 1} of {studySession.flashcards.length}
              </span>
              <Button variant="outline" size="sm" onClick={endStudySession}>
                End Session
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <Progress 
              value={((studySession.currentIndex + 1) / studySession.flashcards.length) * 100} 
              className="h-2" 
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <h4 className="font-medium text-gray-600 mb-2">Question:</h4>
              <div className="text-lg whitespace-pre-wrap">{currentCard.front}</div>
            </div>

            {showAnswer && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-600 mb-2">Answer:</h4>
                <div className="text-lg whitespace-pre-wrap">{currentCard.back}</div>
              </div>
            )}

            {!showAnswer && (
              <Button onClick={() => setShowAnswer(true)} className="mt-4">
                Show Answer
              </Button>
            )}
          </div>

          {showAnswer && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => reviewCard('again')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Again
              </Button>
              <Button
                variant="outline"
                onClick={() => reviewCard('hard')}
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                Hard
              </Button>
              <Button
                onClick={() => reviewCard('good')}
                className="text-green-600 bg-green-50 hover:bg-green-100"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Good
              </Button>
              <Button
                variant="outline"
                onClick={() => reviewCard('easy')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Easy
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Session Results */}
      {studySession && !studySession.isActive && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Study Session Complete!</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{studySession.correct}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{studySession.incorrect}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((studySession.correct / studySession.flashcards.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={masteryFilter}
            onChange={(e) => setMasteryFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Mastery Levels</option>
            <option value="new">New (0%)</option>
            <option value="learning">Learning (1-79%)</option>
            <option value="mastered">Mastered (80%+)</option>
          </select>

          <Button
            onClick={() => startStudySession(filteredCards)}
            disabled={filteredCards.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Study ({filteredCards.length})
          </Button>
        </div>
      </div>

      {/* Flashcard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(card.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                  {card.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(card.mastery)}`}>
                  {card.mastery}%
                </span>
                {card.isGenerated && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    AI
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1">{card.topic}</h4>
              <p className="text-xs text-gray-600">{card.subject}</p>
            </div>

            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Front:</div>
              <div className="text-sm text-gray-600 line-clamp-2">{card.front}</div>
            </div>

            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Back:</div>
              <div className="text-sm text-gray-600 line-clamp-2">{card.back}</div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Reviews: {card.reviewCount}</span>
              <span>Last: {new Date(card.lastReviewed).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {card.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => startStudySession([card])}
                className="flex-1"
              >
                <Play className="h-3 w-3 mr-1" />
                Study
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No flashcards found</h3>
          <p className="text-gray-500">Try adjusting your filters or generate new flashcards</p>
        </div>
      )}
    </div>
  );
}
