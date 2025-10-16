"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Meh,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  GripVertical,
  Layers,
  Link,
  Unlink,
  MousePointer,
  Hand,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Grid,
  Layout,
  Maximize2,
  Minimize2,
  RotateCcw as Undo,
  Redo,
  Copy,
  Scissors,
  Clipboard,
  Lock,
  Unlock,
  Shield,
  CheckSquare,
  Square,
  Circle,
  Dot,
  Hash,
  Percent,
  DollarSign,
  Euro,
  Bitcoin,
  CreditCard,
  Banknote,
  Coins,
  TrendingDown,
  Activity as Pulse,
  Zap as Lightning,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Waves,
  Mountain,
  TreePine,
  Trees,
  Flower,
  Leaf,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Squirrel,
  Turtle,
  Octopus,
  Butterfly,
  Bee,
  Spider,
  Ant,
  Ladybug,
  Dragonfly,
  Snail,
  Frog,
  Lizard,
  Snake,
  Crocodile,
  Penguin,
  Owl,
  Eagle,
  Parrot,
  Peacock,
  Flamingo,
  Toucan,
  Hummingbird,
  Robin,
  Cardinal,
  Bluebird,
  Canary,
  Finch,
  Sparrow,
  Crow,
  Raven,
  Magpie,
  Jay,
  Woodpecker,
  Kingfisher,
  Heron,
  Stork,
  Crane,
  Swan,
  Duck,
  Goose,
  Chicken,
  Rooster,
  Turkey,
  Pheasant,
  Quail,
  Partridge,
  Grouse,
  Ptarmigan,
  Sandpiper,
  Plover,
  Lapwing,
  Curlew,
  Snipe,
  Woodcock,
  Sanderling,
  Dunlin,
  Knot,
  Turnstone,
  Oystercatcher,
  Avocet,
  Stilt,
  Godwit,
  Redshank,
  Greenshank,
  Yellowlegs,
  Willet,
  Dowitcher,
  Phalarope,
  Jaeger,
  Skua,
  Gull,
  Tern,
  Noddy,
  Booby,
  Gannet,
  Cormorant,
  Shag,
  Pelican,
  Frigatebird,
  Albatross,
  Petrel,
  Shearwater,
  Fulmar,
  StormPetrel,
  DivingPetrel,
  Prion,
  Puffin,
  Auk,
  Guillemot,
  Razorbill,
  Murre,
  Murrelet,
  Auklet,
  Dovekie,
  Gyrfalcon,
  Peregrine,
  Merlin,
  Kestrel,
  Hobby,
  Saker,
  Lanner,
  Goshawk,
  Sparrowhawk,
  Buzzard,
  Harrier,
  Kite,
  Osprey,
  Vulture,
  Condor,
  Caracara,
  Falcon,
  Hawk,
  Accipiter,
  Buteo,
  Circus,
  Milvus,
  Haliaeetus,
  Aquila,
  Hieraaetus,
  Spizaetus,
  Lophaetus,
  Polemaetus,
  Stephanoaetus,
  Morphnus,
  Harpia,
  Harpyopsis,
  Pithecophaga,
  Spilornis,
  Gypaetus,
  Neophron,
  Gyps,
  Aegypius,
  Sarcogyps,
  Trigonoceps,
  Necrosyrtes,
  Torgos,
  Terathopius,
  Circaetus,
  Dryotriorchis,
  Eutriorchis,
  Leptodon,
  Chondrohierax,
  Elanoides,
  Gampsonyx,
  Chelictinia,
  Elanus,
  Machaerhamphus,
  Rostrhamus,
  Helicolestes,
  Ictinia,
  Busarellus,
  Geranospiza,
  Leucopternis,
  Buteogallus,
  Parabuteo,
  Geranoaetus,
  Harpyhaliaetus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface AdvancedQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'matching' | 'ordering' | 'drag-drop' | 'hotspot' | 'cloze' | 'numerical' | 'short-answer' | 'code-completion' | 'diagram-labeling' | 'audio-response' | 'video-analysis' | 'simulation' | 'case-study' | 'scenario' | 'problem-solving' | 'critical-thinking';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number | { [key: string]: string };
  explanation: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
  topic: string;
  points: number;
  timeLimit?: number;
  media?: {
    type: 'image' | 'video' | 'audio' | 'interactive' | '3d' | 'ar' | 'vr';
    url: string;
    alt?: string;
    caption?: string;
    interactive?: boolean;
  };
  hints?: string[];
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  cognitiveLoad: 'low' | 'medium' | 'high';
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    largeText: boolean;
    audioDescription: boolean;
  };
  adaptiveProperties: {
    difficultyAdjustment: boolean;
    hintProgression: boolean;
    timeAdjustment: boolean;
    contentPersonalization: boolean;
  };
  analytics: {
    attempts: number;
    successRate: number;
    averageTime: number;
    commonMistakes: string[];
    learningPath: string[];
  };
}

interface AdvancedQuiz {
  id: string;
  title: string;
  description: string;
  questions: AdvancedQuestion[];
  totalPoints: number;
  timeLimit: number;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'adaptive';
  subject: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  attempts: number;
  averageScore: number;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  language: string;
  version: string;
  author: string;
  license: string;
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    largeText: boolean;
    audioDescription: boolean;
  };
  adaptiveSettings: {
    difficultyAdjustment: boolean;
    hintProgression: boolean;
    timeAdjustment: boolean;
    contentPersonalization: boolean;
    learningPathOptimization: boolean;
  };
  analytics: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
    difficultyDistribution: { [key: string]: number };
    questionPerformance: { [key: string]: number };
    learningOutcomes: { [key: string]: number };
  };
  metadata: {
    fileSize?: number;
    pageCount?: number;
    wordCount?: number;
    readingLevel: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    estimatedTime: number;
  };
}

interface AdvancedExam extends AdvancedQuiz {
  isExam: true;
  passingScore: number;
  maxAttempts: number;
  proctoringEnabled: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResults: 'immediate' | 'after-completion' | 'manual' | 'scheduled';
  timeRestrictions: {
    startDate?: Date;
    endDate?: Date;
    timeWindows: { start: string; end: string; days: string[] }[];
  };
  security: {
    browserLock: boolean;
    fullScreen: boolean;
    copyPasteDisabled: boolean;
    rightClickDisabled: boolean;
    printDisabled: boolean;
    screenshotDisabled: boolean;
  };
  grading: {
    autoGrade: boolean;
    manualReview: boolean;
    partialCredit: boolean;
    rubricBased: boolean;
    peerReview: boolean;
  };
}

interface FileUpload {
  file: File;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'image' | 'video' | 'audio' | 'presentation' | 'spreadsheet';
  progress: number;
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  error?: string;
  extractedContent?: string;
  metadata?: any;
}

interface GenerationRequest {
  source: 'topic' | 'file' | 'text' | 'url' | 'ai-generated' | 'curriculum' | 'learning-path';
  content: string;
  questionCount: number;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'adaptive' | 'mixed';
  questionTypes: AdvancedQuestion['type'][];
  timeLimit?: number;
  subject: string;
  topic: string;
  includeMedia: boolean;
  includeHints: boolean;
  language: string;
  learningObjectives: string[];
  targetAudience: string[];
  bloomLevels: AdvancedQuestion['bloomLevel'][];
  adaptiveMode: boolean;
  accessibilityLevel: 'A' | 'AA' | 'AAA';
  proctoringEnabled: boolean;
  securityLevel: 'basic' | 'standard' | 'high' | 'maximum';
  gradingMode: 'auto' | 'manual' | 'hybrid';
  feedbackMode: 'immediate' | 'delayed' | 'scheduled' | 'on-demand';
  analyticsEnabled: boolean;
  personalizationEnabled: boolean;
  collaborationEnabled: boolean;
  offlineMode: boolean;
  mobileOptimized: boolean;
  vrSupported: boolean;
  arSupported: boolean;
}

interface AdvancedQuizStats {
  totalQuizzes: number;
  totalExams: number;
  totalQuestions: number;
  averageScore: number;
  totalAttempts: number;
  completionRate: number;
  mostPopularTopic: string;
  difficultyDistribution: { [key: string]: number };
  questionTypeDistribution: { [key: string]: number };
  performanceTrends: Array<{
    date: Date;
    score: number;
    attempts: number;
    completionRate: number;
  }>;
  learningOutcomes: { [key: string]: number };
  userEngagement: {
    averageSessionTime: number;
    returnRate: number;
    completionRate: number;
    satisfactionScore: number;
  };
  accessibilityMetrics: {
    screenReaderUsage: number;
    keyboardNavigationUsage: number;
    highContrastUsage: number;
    largeTextUsage: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'quiz' | 'exam' | 'question' | 'file';
    title: string;
    score?: number;
    timestamp: Date;
    status: 'completed' | 'in-progress' | 'failed' | 'abandoned';
  }>;
}

export function AdvancedQuizExamGenerator() {
  const [quizzes, setQuizzes] = useState<AdvancedQuiz[]>([]);
  const [exams, setExams] = useState<AdvancedExam[]>([]);
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
    language: 'en',
    learningObjectives: [],
    targetAudience: ['students'],
    bloomLevels: ['understand', 'apply'],
    adaptiveMode: false,
    accessibilityLevel: 'AA',
    proctoringEnabled: false,
    securityLevel: 'standard',
    gradingMode: 'auto',
    feedbackMode: 'immediate',
    analyticsEnabled: true,
    personalizationEnabled: false,
    collaborationEnabled: false,
    offlineMode: false,
    mobileOptimized: true,
    vrSupported: false,
    arSupported: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<AdvancedQuizStats | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'exams' | 'generator' | 'analytics' | 'question-bank' | 'files'>('quizzes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<AdvancedQuestion | null>(null);
  const [questionBank, setQuestionBank] = useState<AdvancedQuestion[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit' | 'duplicate'>('create');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleQuestions: AdvancedQuestion[] = [
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
        tags: ['algebra', 'linear equations', 'solving'],
        learningObjectives: ['Solve linear equations', 'Apply algebraic principles'],
        prerequisites: ['Basic arithmetic', 'Understanding of variables'],
        bloomLevel: 'apply',
        cognitiveLoad: 'medium',
        accessibility: {
          screenReader: true,
          keyboardNavigation: true,
          highContrast: true,
          largeText: true,
          audioDescription: false
        },
        adaptiveProperties: {
          difficultyAdjustment: true,
          hintProgression: true,
          timeAdjustment: true,
          contentPersonalization: false
        },
        analytics: {
          attempts: 45,
          successRate: 78,
          averageTime: 45,
          commonMistakes: ['Forgot to subtract 5', 'Divided by 2 incorrectly'],
          learningPath: ['Basic arithmetic', 'Linear equations', 'Advanced algebra']
        }
      },
      {
        id: 'q2',
        type: 'drag-drop',
        question: 'Arrange the following steps in the correct order to solve a quadratic equation:',
        options: ['Identify coefficients', 'Apply quadratic formula', 'Simplify the result', 'Check the answer'],
        correctAnswer: ['Identify coefficients', 'Apply quadratic formula', 'Simplify the result', 'Check the answer'],
        explanation: 'The correct order is: 1) Identify coefficients, 2) Apply quadratic formula, 3) Simplify the result, 4) Check the answer',
        difficulty: 'medium',
        topic: 'Quadratic Equations',
        points: 15,
        timeLimit: 90,
        tags: ['algebra', 'quadratic equations', 'problem solving'],
        learningObjectives: ['Solve quadratic equations', 'Apply problem-solving strategies'],
        prerequisites: ['Linear equations', 'Quadratic formula'],
        bloomLevel: 'apply',
        cognitiveLoad: 'high',
        accessibility: {
          screenReader: true,
          keyboardNavigation: true,
          highContrast: true,
          largeText: true,
          audioDescription: true
        },
        adaptiveProperties: {
          difficultyAdjustment: true,
          hintProgression: true,
          timeAdjustment: true,
          contentPersonalization: true
        },
        analytics: {
          attempts: 32,
          successRate: 65,
          averageTime: 78,
          commonMistakes: ['Wrong order of steps', 'Missing coefficient identification'],
          learningPath: ['Linear equations', 'Quadratic equations', 'Advanced problem solving']
        }
      }
    ];

    const sampleQuizzes: AdvancedQuiz[] = [
      {
        id: 'quiz-1',
        title: 'Advanced Algebra Fundamentals',
        description: 'Comprehensive test covering algebraic concepts with adaptive difficulty',
        questions: sampleQuestions,
        totalPoints: 25,
        timeLimit: 30,
        difficulty: 'medium',
        subject: 'Mathematics',
        topic: 'Algebra',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPublished: true,
        attempts: 45,
        averageScore: 78,
        tags: ['algebra', 'mathematics', 'fundamentals'],
        learningObjectives: ['Solve linear equations', 'Apply algebraic principles', 'Solve quadratic equations'],
        prerequisites: ['Basic arithmetic', 'Understanding of variables'],
        targetAudience: ['high school students', 'college students'],
        language: 'en',
        version: '1.0',
        author: 'AI Tutor',
        license: 'Educational',
        accessibility: {
          wcagLevel: 'AA',
          screenReader: true,
          keyboardNavigation: true,
          highContrast: true,
          largeText: true,
          audioDescription: true
        },
        adaptiveSettings: {
          difficultyAdjustment: true,
          hintProgression: true,
          timeAdjustment: true,
          contentPersonalization: true,
          learningPathOptimization: true
        },
        analytics: {
          totalAttempts: 45,
          averageScore: 78,
          completionRate: 87,
          averageTime: 25,
          difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
          questionPerformance: { 'q1': 78, 'q2': 65 },
          learningOutcomes: { 'algebra': 80, 'problem-solving': 75 }
        },
        metadata: {
          readingLevel: 'high',
          complexity: 'moderate',
          estimatedTime: 30
        }
      }
    ];
    
    const sampleStats: AdvancedQuizStats = {
      totalQuizzes: 12,
      totalExams: 5,
      totalQuestions: 156,
      averageScore: 75,
      totalAttempts: 234,
      completionRate: 87,
      mostPopularTopic: 'Algebra',
      difficultyDistribution: { beginner: 20, easy: 30, medium: 35, hard: 15 },
      questionTypeDistribution: { 'multiple-choice': 45, 'true-false': 25, 'fill-blank': 20, 'essay': 10 },
      performanceTrends: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: 72, attempts: 45, completionRate: 85 },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), score: 75, attempts: 52, completionRate: 88 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 78, attempts: 48, completionRate: 90 }
      ],
      learningOutcomes: { 'algebra': 80, 'problem-solving': 75, 'critical-thinking': 70 },
      userEngagement: {
        averageSessionTime: 25,
        returnRate: 85,
        completionRate: 87,
        satisfactionScore: 4.2
      },
      accessibilityMetrics: {
        screenReaderUsage: 15,
        keyboardNavigationUsage: 25,
        highContrastUsage: 10,
        largeTextUsage: 20
      },
      recentActivity: [
        {
          id: 'a1',
          type: 'quiz',
          title: 'Advanced Algebra Fundamentals',
          score: 85,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'completed'
        }
      ]
    };
    
    setQuizzes(sampleQuizzes);
    setQuestionBank(sampleQuestions);
    setStats(sampleStats);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const processFiles = async (files: File[]) => {
    const newFiles: FileUpload[] = files.map(file => ({
      file,
      type: getFileType(file),
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (const fileUpload of newFiles) {
      await processFile(fileUpload);
    }
  };

  const getFileType = (file: File): FileUpload['type'] => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.includes('word') || file.type.includes('document')) return 'doc';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('presentation')) return 'presentation';
    if (file.type.includes('spreadsheet')) return 'spreadsheet';
    return 'txt';
  };

  const processFile = async (fileUpload: FileUpload) => {
    try {
      const stages = [
        { progress: 20, status: 'uploading' as const },
        { progress: 50, status: 'processing' as const },
        { progress: 80, status: 'analyzing' as const },
        { progress: 100, status: 'completed' as const }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUploadedFiles(prev => prev.map(f => 
          f.file === fileUpload.file 
            ? { ...f, progress: stage.progress, status: stage.status }
            : f
        ));
      }

      // Extract content from file
      const extractedContent = await extractFileContent(fileUpload.file);
      setUploadedFiles(prev => prev.map(f => 
        f.file === fileUpload.file 
          ? { ...f, extractedContent }
          : f
      ));
      
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.file === fileUpload.file 
          ? { ...f, status: 'error', error: 'Processing failed' }
          : f
      ));
    }
  };

  const extractFileContent = async (file: File): Promise<string> => {
    // Simulate file content extraction
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Extracted content from ${file.name}: This is a sample of the content that would be extracted from the uploaded file. It contains the text, images, and other media that can be used to generate quiz questions.`;
  };

  const generateQuiz = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedQuestions: AdvancedQuestion[] = generateAdvancedQuestions(generationRequest);
      
      const newQuiz: AdvancedQuiz = {
        id: `quiz-${Date.now()}`,
        title: `${generationRequest.topic} Advanced Quiz`,
        description: `AI-generated quiz covering ${generationRequest.topic} with advanced question types`,
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
        tags: [generationRequest.topic.toLowerCase(), generationRequest.subject.toLowerCase()],
        learningObjectives: generationRequest.learningObjectives,
        prerequisites: [],
        targetAudience: generationRequest.targetAudience,
        language: generationRequest.language,
        version: '1.0',
        author: 'AI Tutor',
        license: 'Educational',
        accessibility: {
          wcagLevel: generationRequest.accessibilityLevel,
          screenReader: true,
          keyboardNavigation: true,
          highContrast: true,
          largeText: true,
          audioDescription: true
        },
        adaptiveSettings: {
          difficultyAdjustment: generationRequest.adaptiveMode,
          hintProgression: true,
          timeAdjustment: true,
          contentPersonalization: generationRequest.personalizationEnabled,
          learningPathOptimization: true
        },
        analytics: {
          totalAttempts: 0,
          averageScore: 0,
          completionRate: 0,
          averageTime: 0,
          difficultyDistribution: {},
          questionPerformance: {},
          learningOutcomes: {}
        },
        metadata: {
          readingLevel: 'college',
          complexity: 'moderate',
          estimatedTime: generationRequest.timeLimit || 30
        }
      };
      
      setQuizzes(prev => [newQuiz, ...prev]);
      setActiveTab('quizzes');
      
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generationRequest]);

  const generateAdvancedQuestions = (request: GenerationRequest): AdvancedQuestion[] => {
    const questions: AdvancedQuestion[] = [];
    const questionTypes = request.questionTypes;
    
    for (let i = 0; i < request.questionCount; i++) {
      const type = questionTypes[i % questionTypes.length];
      const difficulty = request.difficulty === 'mixed' 
        ? ['beginner', 'easy', 'medium', 'hard', 'expert'][i % 5] as AdvancedQuestion['difficulty']
        : request.difficulty;
      
      const question = createAdvancedQuestion(type, difficulty, request.topic, i + 1, request);
      questions.push(question);
    }
    
    return questions;
  };

  const createAdvancedQuestion = (type: AdvancedQuestion['type'], difficulty: string, topic: string, index: number, request: GenerationRequest): AdvancedQuestion => {
    const baseQuestion = {
      id: `q${index}`,
      type,
      difficulty: difficulty as AdvancedQuestion['difficulty'],
      topic,
      points: getPointsForDifficulty(difficulty),
      timeLimit: getTimeLimitForDifficulty(difficulty),
      tags: [topic.toLowerCase()],
      explanation: `This question tests your understanding of ${topic} concepts.`,
      learningObjectives: request.learningObjectives,
      prerequisites: [],
      bloomLevel: request.bloomLevels[index % request.bloomLevels.length],
      cognitiveLoad: getCognitiveLoadForDifficulty(difficulty),
      accessibility: {
        screenReader: true,
        keyboardNavigation: true,
        highContrast: true,
        largeText: true,
        audioDescription: request.accessibilityLevel === 'AAA'
      },
      adaptiveProperties: {
        difficultyAdjustment: request.adaptiveMode,
        hintProgression: true,
        timeAdjustment: true,
        contentPersonalization: request.personalizationEnabled
      },
      analytics: {
        attempts: 0,
        successRate: 0,
        averageTime: 0,
        commonMistakes: [],
        learningPath: []
      }
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
      
      case 'matching':
        return {
          ...baseQuestion,
          question: `Match the following ${topic} terms with their definitions:`,
          options: ['Term A', 'Term B', 'Term C', 'Term D'],
          correctAnswer: { 'Term A': 'Definition A', 'Term B': 'Definition B', 'Term C': 'Definition C', 'Term D': 'Definition D' }
        };
      
      case 'ordering':
        return {
          ...baseQuestion,
          question: `Arrange the following steps in the correct order for ${topic}:`,
          options: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
          correctAnswer: ['Step 1', 'Step 2', 'Step 3', 'Step 4']
        };
      
      case 'drag-drop':
        return {
          ...baseQuestion,
          question: `Drag and drop the correct answers to complete this ${topic} problem:`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: ['Option A', 'Option C']
        };
      
      case 'hotspot':
        return {
          ...baseQuestion,
          question: `Click on the correct area in this ${topic} diagram:`,
          correctAnswer: 'Area 2',
          media: {
            type: 'image',
            url: '/placeholder-diagram.png',
            alt: `${topic} diagram`,
            interactive: true
          }
        };
      
      case 'cloze':
        return {
          ...baseQuestion,
          question: `Fill in the blanks: The process of ${topic} involves _____ and _____.`,
          correctAnswer: ['step1', 'step2']
        };
      
      case 'numerical':
        return {
          ...baseQuestion,
          question: `What is the numerical value of x in this ${topic} equation?`,
          correctAnswer: 42
        };
      
      case 'short-answer':
        return {
          ...baseQuestion,
          question: `Briefly explain the main concept of ${topic}.`,
          correctAnswer: 'Brief explanation of the main concept'
        };
      
      case 'code-completion':
        return {
          ...baseQuestion,
          question: `Complete the following code for ${topic}:`,
          correctAnswer: 'def function_name(): return result',
          media: {
            type: 'interactive',
            url: '/code-editor.html',
            alt: 'Code editor',
            interactive: true
          }
        };
      
      case 'diagram-labeling':
        return {
          ...baseQuestion,
          question: `Label the parts of this ${topic} diagram:`,
          correctAnswer: { 'Part A': 'Label A', 'Part B': 'Label B', 'Part C': 'Label C' },
          media: {
            type: 'image',
            url: '/placeholder-diagram.png',
            alt: `${topic} diagram`,
            interactive: true
          }
        };
      
      case 'audio-response':
        return {
          ...baseQuestion,
          question: `Record your answer to this ${topic} question:`,
          correctAnswer: 'Audio response required',
          media: {
            type: 'audio',
            url: '/audio-recorder.html',
            alt: 'Audio recorder',
            interactive: true
          }
        };
      
      case 'video-analysis':
        return {
          ...baseQuestion,
          question: `Analyze this ${topic} video and answer the following:`,
          correctAnswer: 'Analysis of the video content',
          media: {
            type: 'video',
            url: '/sample-video.mp4',
            alt: `${topic} video`,
            interactive: true
          }
        };
      
      case 'simulation':
        return {
          ...baseQuestion,
          question: `Use this ${topic} simulation to solve the problem:`,
          correctAnswer: 'Simulation-based solution',
          media: {
            type: 'interactive',
            url: '/simulation.html',
            alt: `${topic} simulation`,
            interactive: true
          }
        };
      
      case 'case-study':
        return {
          ...baseQuestion,
          question: `Analyze this ${topic} case study and provide your solution:`,
          correctAnswer: 'Case study analysis and solution',
          points: 25
        };
      
      case 'scenario':
        return {
          ...baseQuestion,
          question: `Given this ${topic} scenario, what would you do?`,
          correctAnswer: 'Scenario-based response',
          points: 20
        };
      
      case 'problem-solving':
        return {
          ...baseQuestion,
          question: `Solve this complex ${topic} problem step by step:`,
          correctAnswer: 'Step-by-step solution',
          points: 30
        };
      
      case 'critical-thinking':
        return {
          ...baseQuestion,
          question: `Critically analyze this ${topic} situation and provide your assessment:`,
          correctAnswer: 'Critical analysis and assessment',
          points: 25
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

  const getPointsForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'beginner': return 5;
      case 'easy': return 10;
      case 'medium': return 15;
      case 'hard': return 20;
      case 'expert': return 25;
      default: return 10;
    }
  };

  const getTimeLimitForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'beginner': return 30;
      case 'easy': return 45;
      case 'medium': return 60;
      case 'hard': return 90;
      case 'expert': return 120;
      default: return 60;
    }
  };

  const getCognitiveLoadForDifficulty = (difficulty: string): 'low' | 'medium' | 'high' => {
    switch (difficulty) {
      case 'beginner': return 'low';
      case 'easy': return 'low';
      case 'medium': return 'medium';
      case 'hard': return 'high';
      case 'expert': return 'high';
      default: return 'medium';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getQuestionTypeIcon = (type: AdvancedQuestion['type']) => {
    switch (type) {
      case 'multiple-choice': return <CheckSquare className="h-4 w-4" />;
      case 'true-false': return <Circle className="h-4 w-4" />;
      case 'fill-blank': return <Type className="h-4 w-4" />;
      case 'essay': return <FileText className="h-4 w-4" />;
      case 'matching': return <Link className="h-4 w-4" />;
      case 'ordering': return <ArrowUp className="h-4 w-4" />;
      case 'drag-drop': return <Move className="h-4 w-4" />;
      case 'hotspot': return <MousePointer className="h-4 w-4" />;
      case 'cloze': return <AlignLeft className="h-4 w-4" />;
      case 'numerical': return <Calculator className="h-4 w-4" />;
      case 'short-answer': return <Type className="h-4 w-4" />;
      case 'code-completion': return <Code className="h-4 w-4" />;
      case 'diagram-labeling': return <Image className="h-4 w-4" />;
      case 'audio-response': return <Mic className="h-4 w-4" />;
      case 'video-analysis': return <Video className="h-4 w-4" />;
      case 'simulation': return <Zap className="h-4 w-4" />;
      case 'case-study': return <BookOpen className="h-4 w-4" />;
      case 'scenario': return <Lightbulb className="h-4 w-4" />;
      case 'problem-solving': return <Target className="h-4 w-4" />;
      case 'critical-thinking': return <Brain className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    (searchQuery === '' || quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterDifficulty === 'all' || quiz.difficulty === filterDifficulty) &&
    (filterSubject === 'all' || quiz.subject === filterSubject)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Advanced Quiz & Exam Generator
          </h1>
          <p className="text-gray-600">AI-powered automatic quiz and exam generation with advanced question types</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Basic View' : 'Advanced View'}
          </Button>
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
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'quizzes', label: 'Quizzes', icon: <FileText className="h-4 w-4" /> },
          { id: 'exams', label: 'Exams', icon: <Award className="h-4 w-4" /> },
          { id: 'generator', label: 'Generator', icon: <Zap className="h-4 w-4" /> },
          { id: 'question-bank', label: 'Question Bank', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'files', label: 'Files', icon: <Upload className="h-4 w-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
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

      {/* Advanced Quiz Generator */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Advanced AI Quiz Generator
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
                  <option value="ai-generated">AI Generated Content</option>
                  <option value="curriculum">Curriculum Based</option>
                  <option value="learning-path">Learning Path</option>
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
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Social Studies">Social Studies</option>
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
                  max="100"
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
                  <option value="beginner">Beginner</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                  <option value="adaptive">Adaptive</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {showAdvanced && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Types</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'multiple-choice', 'true-false', 'fill-blank', 'essay',
                        'matching', 'ordering', 'drag-drop', 'hotspot',
                        'cloze', 'numerical', 'short-answer', 'code-completion',
                        'diagram-labeling', 'audio-response', 'video-analysis',
                        'simulation', 'case-study', 'scenario', 'problem-solving', 'critical-thinking'
                      ].map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={generationRequest.questionTypes.includes(type as any)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  questionTypes: [...prev.questionTypes, type as any]
                                }));
                              } else {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  questionTypes: prev.questionTypes.filter(t => t !== type)
                                }));
                              }
                            }}
                          />
                          <span className="capitalize">{type.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bloom's Taxonomy Levels</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'].map(level => (
                        <label key={level} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={generationRequest.bloomLevels.includes(level as any)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  bloomLevels: [...prev.bloomLevels, level as any]
                                }));
                              } else {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  bloomLevels: prev.bloomLevels.filter(l => l !== level)
                                }));
                              }
                            }}
                          />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['students', 'professionals', 'teachers', 'researchers', 'general public'].map(audience => (
                        <label key={audience} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={generationRequest.targetAudience.includes(audience)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  targetAudience: [...prev.targetAudience, audience]
                                }));
                              } else {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  targetAudience: prev.targetAudience.filter(a => a !== audience)
                                }));
                              }
                            }}
                          />
                          <span className="capitalize">{audience}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Content Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                {generationRequest.source === 'file' ? (
                  <div 
                    ref={dropZoneRef}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Upload files (PDF, DOC, TXT, Images, Videos, Audio)</p>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.avi,.mp3,.wav"
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                      variant="outline"
                    >
                      Choose Files
                    </Button>
                  </div>
                ) : (
                  <Textarea
                    value={generationRequest.content}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-32"
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
                    max="300"
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
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ar">Arabic</option>
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
                  <span className="text-sm">Include media (images, videos, audio)</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationRequest.includeHints}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, includeHints: e.target.checked }))}
                  />
                  <span className="text-sm">Include hints for questions</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationRequest.adaptiveMode}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, adaptiveMode: e.target.checked }))}
                  />
                  <span className="text-sm">Enable adaptive difficulty</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generationRequest.personalizationEnabled}
                    onChange={(e) => setGenerationRequest(prev => ({ ...prev, personalizationEnabled: e.target.checked }))}
                  />
                  <span className="text-sm">Enable personalization</span>
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
                    Generate Advanced Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-600" />
              File Management
            </h3>
            
            {uploadedFiles.length > 0 ? (
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{file.file.name}</span>
                        <span className="text-sm text-gray-500">{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="mt-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {file.status === 'uploading' && 'Uploading...'}
                        {file.status === 'processing' && 'Processing...'}
                        {file.status === 'analyzing' && 'AI is analyzing...'}
                        {file.status === 'completed' && 'Completed!'}
                        {file.status === 'error' && `Error: ${file.error}`}
                      </div>
                      {file.extractedContent && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Extracted Content:</strong>
                          <p className="mt-1 text-gray-600">{file.extractedContent.substring(0, 200)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No files uploaded</h3>
                <p className="text-gray-500">Upload files to generate quizzes from their content</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Bank Tab */}
      {activeTab === 'question-bank' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Question Bank
              </h3>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questionBank.map((question) => (
                <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getQuestionTypeIcon(question.type)}
                      <span className="text-sm font-medium capitalize">{question.type.replace('-', ' ')}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{question.question}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{question.points} pts</span>
                    <span>{question.topic}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(question)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
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
                  <option value="beginner">Beginner</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
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
            {filteredQuizzes.map((quiz) => (
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
              <h3 className="font-semibold mb-4">Question Type Distribution</h3>
              <div className="space-y-2">
                {Object.entries(stats.questionTypeDistribution).map(([type, percentage]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{type.replace('-', ' ')}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}