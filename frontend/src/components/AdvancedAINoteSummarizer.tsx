"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Download, 
  Sparkles, 
  Brain, 
  FileImage, 
  FileVideo, 
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  Tag,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  Image,
  Video,
  Music,
  Archive,
  Share2,
  Copy,
  Edit3,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Bookmark,
  Heart,
  ThumbsUp,
  MessageSquare,
  Send,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface AdvancedSummarizedContent {
  id: string;
  title: string;
  originalFileName: string;
  fileType: 'pdf' | 'image' | 'video' | 'text' | 'audio';
  summary: string;
  detailedSummary: string;
  keyPoints: KeyPoint[];
  questions: StudyQuestion[];
  flashcards: Flashcard[];
  concepts: Concept[];
  timeline: TimelineEvent[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number; // in minutes
  subjects: string[];
  tags: string[];
  confidence: number; // 0-100
  createdAt: Date;
  lastModified: Date;
  wordCount: number;
  pageCount?: number;
  duration?: number; // for video/audio
  thumbnail?: string;
  metadata: DocumentMetadata;
  aiInsights: AIInsight[];
  relatedContent: RelatedContent[];
  exportFormats: string[];
  isPublic: boolean;
  isFavorite: boolean;
  views: number;
  rating: number;
  comments: Comment[];
}

interface KeyPoint {
  id: string;
  text: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  pageNumber?: number;
  timestamp?: number; // for video/audio
  relatedConcepts: string[];
  examples: string[];
  confidence: number;
}

interface StudyQuestion {
  id: string;
  question: string;
  answer: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  options?: string[];
  explanation: string;
  hints: string[];
  relatedConcepts: string[];
  pageNumber?: number;
  timestamp?: number;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  lastReviewed?: Date;
  reviewCount: number;
  successRate: number;
  pageNumber?: number;
  timestamp?: number;
}

interface Concept {
  id: string;
  name: string;
  definition: string;
  explanation: string;
  examples: string[];
  relatedConcepts: string[];
  importance: number;
  category: string;
  pageNumber?: number;
  timestamp?: number;
  visualizations: Visualization[];
}

interface Visualization {
  type: 'diagram' | 'chart' | 'graph' | 'image' | 'video';
  title: string;
  description: string;
  data?: any;
  url?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  type: 'concept' | 'example' | 'exercise' | 'break';
  duration: number;
  pageNumber?: number;
}

interface DocumentMetadata {
  author?: string;
  title?: string;
  subject?: string;
  keywords?: string[];
  language: string;
  createdDate?: Date;
  modifiedDate?: Date;
  fileSize: number;
  pageCount?: number;
  wordCount: number;
  readingLevel: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'warning' | 'achievement' | 'connection';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
  relatedContent: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface RelatedContent {
  id: string;
  title: string;
  type: 'document' | 'video' | 'article' | 'course';
  url?: string;
  similarity: number;
  sharedConcepts: string[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

interface FileUpload {
  file: File;
  type: 'pdf' | 'image' | 'video' | 'text' | 'audio';
  progress: number;
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  error?: string;
  extractedText?: string;
  pageCount?: number;
  duration?: number;
  thumbnail?: string;
}

interface SummarySettings {
  mode: 'overview' | 'detailed' | 'exam_prep' | 'research' | 'presentation' | 'flashcards';
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  focus: 'concepts' | 'examples' | 'applications' | 'theory' | 'practical' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'auto';
  includeImages: boolean;
  includeDiagrams: boolean;
  includeTimeline: boolean;
  includeQuestions: boolean;
  includeFlashcards: boolean;
  includeConcepts: boolean;
  customPrompt: string;
  language: string;
  outputFormat: 'text' | 'markdown' | 'html' | 'json';
}

export function AdvancedAINoteSummarizer() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [summarizedContent, setSummarizedContent] = useState<AdvancedSummarizedContent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<AdvancedSummarizedContent | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'difficulty' | 'rating' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'study' | 'export'>('overview');
  
  const [summarySettings, setSummarySettings] = useState<SummarySettings>({
    mode: 'overview',
    length: 'medium',
    focus: 'all',
    difficulty: 'auto',
    includeImages: true,
    includeDiagrams: true,
    includeTimeline: true,
    includeQuestions: true,
    includeFlashcards: true,
    includeConcepts: true,
    customPrompt: '',
    language: 'en',
    outputFormat: 'text'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleContent: AdvancedSummarizedContent[] = [
      {
        id: '1',
        title: 'Introduction to Machine Learning',
        originalFileName: 'ml_basics.pdf',
        fileType: 'pdf',
        summary: 'Comprehensive introduction to machine learning concepts, algorithms, and applications.',
        detailedSummary: 'This document provides a thorough introduction to machine learning, covering supervised and unsupervised learning, neural networks, and practical applications. It includes mathematical foundations, algorithm explanations, and real-world examples.',
        keyPoints: [
          {
            id: 'kp1',
            text: 'Machine learning is a subset of artificial intelligence that enables computers to learn without being explicitly programmed.',
            importance: 'critical',
            category: 'definition',
            pageNumber: 1,
            relatedConcepts: ['AI', 'algorithms'],
            examples: ['Email spam detection', 'Image recognition'],
            confidence: 95
          },
          {
            id: 'kp2',
            text: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs.',
            importance: 'high',
            category: 'types',
            pageNumber: 3,
            relatedConcepts: ['supervised learning', 'training data'],
            examples: ['Classification', 'Regression'],
            confidence: 90
          }
        ],
        questions: [
          {
            id: 'q1',
            question: 'What is the difference between supervised and unsupervised learning?',
            answer: 'Supervised learning uses labeled data to learn input-output mappings, while unsupervised learning finds patterns in unlabeled data.',
            type: 'short_answer',
            difficulty: 'medium',
            explanation: 'Supervised learning requires examples with known correct answers, while unsupervised learning discovers hidden patterns.',
            hints: ['Think about the data requirements', 'Consider the learning objective'],
            relatedConcepts: ['supervised learning', 'unsupervised learning'],
            pageNumber: 3
          }
        ],
        flashcards: [
          {
            id: 'fc1',
            front: 'What is machine learning?',
            back: 'A subset of AI that enables computers to learn without explicit programming.',
            category: 'definitions',
            difficulty: 'easy',
            tags: ['ML', 'AI'],
            reviewCount: 5,
            successRate: 85
          }
        ],
        concepts: [
          {
            id: 'c1',
            name: 'Supervised Learning',
            definition: 'Learning with labeled training data',
            explanation: 'Uses input-output pairs to learn a function that maps inputs to outputs.',
            examples: ['Email classification', 'Price prediction'],
            relatedConcepts: ['training data', 'labels'],
            importance: 9,
            category: 'learning types',
            pageNumber: 3,
            visualizations: [
              {
                type: 'diagram',
                title: 'Supervised Learning Process',
                description: 'Flow diagram showing input, model, and output',
                data: { nodes: [], edges: [] }
              }
            ]
          }
        ],
        timeline: [
          {
            id: 't1',
            title: 'Introduction to ML',
            description: 'Basic concepts and definitions',
            timestamp: 0,
            type: 'concept',
            duration: 10,
            pageNumber: 1
          }
        ],
        difficulty: 'intermediate',
        estimatedTime: 60,
        subjects: ['Computer Science', 'Artificial Intelligence'],
        tags: ['machine learning', 'AI', 'algorithms'],
        confidence: 92,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        wordCount: 5000,
        pageCount: 25,
        metadata: {
          author: 'Dr. Jane Smith',
          title: 'Introduction to Machine Learning',
          subject: 'Computer Science',
          keywords: ['machine learning', 'AI', 'algorithms'],
          language: 'en',
          createdDate: new Date('2024-01-15'),
          modifiedDate: new Date('2024-01-20'),
          fileSize: 2048000,
          pageCount: 25,
          wordCount: 5000,
          readingLevel: 'college',
          complexity: 'moderate'
        },
        aiInsights: [
          {
            id: 'ai1',
            type: 'recommendation',
            title: 'High Learning Value',
            description: 'This document contains high-value concepts suitable for intermediate learners.',
            confidence: 88,
            actionable: true,
            actionItems: ['Focus on supervised learning section', 'Practice with provided examples'],
            relatedContent: ['ml_practice.pdf'],
            priority: 'medium'
          }
        ],
        relatedContent: [
          {
            id: 'rc1',
            title: 'Advanced ML Algorithms',
            type: 'document',
            similarity: 85,
            sharedConcepts: ['neural networks', 'deep learning']
          }
        ],
        exportFormats: ['pdf', 'docx', 'anki', 'quizlet', 'html'],
        isPublic: false,
        isFavorite: true,
        views: 15,
        rating: 4.5,
        comments: []
      }
    ];
    
    setSummarizedContent(sampleContent);
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

    setFiles(prev => [...prev, ...newFiles]);

    for (const fileUpload of newFiles) {
      await processFile(fileUpload);
    }
  };

  const getFileType = (file: File): FileUpload['type'] => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'text';
  };

  const processFile = async (fileUpload: FileUpload) => {
    try {
      // Simulate file processing stages
      const stages = [
        { progress: 20, status: 'uploading' as const },
        { progress: 50, status: 'processing' as const },
        { progress: 80, status: 'analyzing' as const },
        { progress: 100, status: 'completed' as const }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFiles(prev => prev.map(f => 
          f.file === fileUpload.file 
            ? { ...f, progress: stage.progress, status: stage.status }
            : f
        ));
      }

      // Generate advanced AI summary
      const summary = await generateAdvancedAISummary(fileUpload.file, summarySettings);
      setSummarizedContent(prev => [...prev, summary]);
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.file === fileUpload.file 
          ? { ...f, status: 'error', error: 'Processing failed' }
          : f
      ));
    }
  };

  const generateAdvancedAISummary = async (file: File, settings: SummarySettings): Promise<AdvancedSummarizedContent> => {
    // Simulate advanced AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockSummary: AdvancedSummarizedContent = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      originalFileName: file.name,
      fileType: getFileType(file),
      summary: `Advanced AI-generated summary of ${file.name}. This comprehensive analysis provides deep insights, key concepts, and structured learning materials.`,
      detailedSummary: `This document has been thoroughly analyzed using advanced AI techniques. The content covers multiple topics with varying complexity levels. Key themes include fundamental concepts, practical applications, and advanced techniques. The analysis reveals important patterns and connections that enhance understanding and retention.`,
      keyPoints: [
        {
          id: 'kp1',
          text: 'Fundamental concepts explained with clear examples and practical applications.',
          importance: 'high',
          category: 'concepts',
          pageNumber: 1,
          relatedConcepts: ['basics', 'fundamentals'],
          examples: ['Real-world applications', 'Case studies'],
          confidence: 92
        },
        {
          id: 'kp2',
          text: 'Advanced techniques and methodologies for practical implementation.',
          importance: 'critical',
          category: 'advanced',
          pageNumber: 5,
          relatedConcepts: ['implementation', 'methodology'],
          examples: ['Code examples', 'Step-by-step guides'],
          confidence: 88
        }
      ],
      questions: [
        {
          id: 'q1',
          question: 'What are the main concepts covered in this document?',
          answer: 'The document covers fundamental concepts, practical applications, and advanced techniques.',
          type: 'short_answer',
          difficulty: 'medium',
          explanation: 'This question tests understanding of the overall content structure.',
          hints: ['Review the key points section', 'Look at the table of contents'],
          relatedConcepts: ['overview', 'structure'],
          pageNumber: 1
        }
      ],
      flashcards: [
        {
          id: 'fc1',
          front: 'What is the main topic?',
          back: 'The main topic covers fundamental concepts and their practical applications.',
          category: 'general',
          difficulty: 'easy',
          tags: ['basics'],
          reviewCount: 0,
          successRate: 0
        }
      ],
      concepts: [
        {
          id: 'c1',
          name: 'Core Concept',
          definition: 'The fundamental idea underlying the topic',
          explanation: 'Detailed explanation of the core concept with examples and applications.',
          examples: ['Example 1', 'Example 2'],
          relatedConcepts: ['related concept 1', 'related concept 2'],
          importance: 8,
          category: 'core',
          pageNumber: 2,
          visualizations: []
        }
      ],
      timeline: [
        {
          id: 't1',
          title: 'Introduction',
          description: 'Overview of the topic',
          timestamp: 0,
          type: 'concept',
          duration: 5,
          pageNumber: 1
        }
      ],
      difficulty: 'intermediate',
      estimatedTime: 45,
      subjects: ['General', 'Education'],
      tags: ['AI', 'learning', 'summary'],
      confidence: 85,
      createdAt: new Date(),
      lastModified: new Date(),
      wordCount: 2000,
      pageCount: 10,
      metadata: {
        author: 'AI Assistant',
        title: file.name,
        language: 'en',
        fileSize: file.size,
        wordCount: 2000,
        readingLevel: 'college',
        complexity: 'moderate'
      },
      aiInsights: [
        {
          id: 'ai1',
          type: 'recommendation',
          title: 'Learning Optimization',
          description: 'This content is well-structured for learning with clear progression.',
          confidence: 90,
          actionable: true,
          actionItems: ['Follow the suggested timeline', 'Use the flashcards for review'],
          relatedContent: [],
          priority: 'medium'
        }
      ],
      relatedContent: [],
      exportFormats: ['pdf', 'docx', 'anki', 'quizlet', 'html'],
      isPublic: false,
      isFavorite: false,
      views: 0,
      rating: 0,
      comments: []
    };

    return mockSummary;
  };

  const exportContent = (content: AdvancedSummarizedContent, format: string) => {
    console.log(`Exporting ${content.title} as ${format}`);
    // Export functionality would be implemented here
  };

  const deleteContent = (id: string) => {
    setSummarizedContent(prev => prev.filter(c => c.id !== id));
  };

  const getFileIcon = (type: FileUpload['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'image': return <Image className="h-5 w-5 text-green-500" />;
      case 'video': return <Video className="h-5 w-5 text-blue-500" />;
      case 'audio': return <Music className="h-5 w-5 text-purple-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredContent = summarizedContent
    .filter(content => 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      content.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(content => 
      filterTags.length === 0 || 
      filterTags.some(tag => content.tags.includes(tag))
    )
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'difficulty':
          aValue = a.difficulty;
          bValue = b.difficulty;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Advanced AI Note Summarizer
          </h1>
          <p className="text-gray-600">Upload any document and get comprehensive AI-powered summaries, insights, and study materials</p>
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Summary Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Summary Mode</label>
              <select
                value={summarySettings.mode}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, mode: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="exam_prep">Exam Prep</option>
                <option value="research">Research</option>
                <option value="presentation">Presentation</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Length</label>
              <select
                value={summarySettings.length}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, length: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Focus</label>
              <select
                value={summarySettings.focus}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, focus: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="concepts">Concepts</option>
                <option value="examples">Examples</option>
                <option value="applications">Applications</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="all">All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={summarySettings.difficulty}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={summarySettings.language}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <select
                value={summarySettings.outputFormat}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="text">Text</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Custom Instructions</label>
            <Textarea
              placeholder="e.g., Focus on mathematical concepts, explain for beginners, include practical examples..."
              value={summarySettings.customPrompt}
              onChange={(e) => setSummarySettings(prev => ({ ...prev, customPrompt: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeImages}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeImages: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Images</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeDiagrams}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeDiagrams: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Diagrams</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeTimeline}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeTimeline: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Timeline</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeQuestions}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeQuestions: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Questions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeFlashcards}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeFlashcards: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Flashcards</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={summarySettings.includeConcepts}
                onChange={(e) => setSummarySettings(prev => ({ ...prev, includeConcepts: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Include Concepts</span>
            </label>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div 
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.avi,.mp3,.wav"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload Documents
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, Word, Images, Videos, Audio, and Text files
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Drag and drop files here or click to browse
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search summaries, tags, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
            <option value="rating">Rating</option>
            <option value="views">Views</option>
          </select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="timeline">Timeline</option>
          </select>
        </div>
      </div>

      {/* File Processing Status */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processing Files</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              {getFileIcon(file.type)}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <Eye className="h-4 w-4" /> },
          { id: 'analysis', label: 'Analysis', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'study', label: 'Study', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'export', label: 'Export', icon: <Download className="h-4 w-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Display */}
      {filteredContent.length > 0 ? (
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}>
              {filteredContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold">{content.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(content.difficulty)}`}>
                          {content.difficulty}
                        </span>
                        <span>Time: {content.estimatedTime} min</span>
                        <span>Confidence: {content.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {content.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContent(content)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportContent(content, 'pdf')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteContent(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium mb-2">Summary</h5>
                      <p className="text-gray-700 text-sm">{content.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Key Points:</span> {content.keyPoints.length}
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {content.questions.length}
                      </div>
                      <div>
                        <span className="font-medium">Flashcards:</span> {content.flashcards.length}
                      </div>
                      <div>
                        <span className="font-medium">Concepts:</span> {content.concepts.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {filteredContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{content.title} - Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Key Points Analysis</h4>
                      <div className="space-y-2">
                        {content.keyPoints.map((point) => (
                          <div key={point.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{point.text}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getImportanceColor(point.importance)}`}>
                                {point.importance}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Confidence: {point.confidence}% | Category: {point.category}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">AI Insights</h4>
                      <div className="space-y-2">
                        {content.aiInsights.map((insight) => (
                          <div key={insight.id} className="p-3 bg-blue-50 rounded">
                            <div className="font-medium text-sm">{insight.title}</div>
                            <div className="text-xs text-gray-600 mt-1">{insight.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Confidence: {insight.confidence}% | Priority: {insight.priority}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Document Metadata</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Word Count:</span> {content.wordCount}</div>
                        <div><span className="font-medium">Pages:</span> {content.pageCount || 'N/A'}</div>
                        <div><span className="font-medium">Reading Level:</span> {content.metadata.readingLevel}</div>
                        <div><span className="font-medium">Complexity:</span> {content.metadata.complexity}</div>
                        <div><span className="font-medium">Language:</span> {content.metadata.language}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'study' && (
            <div className="space-y-6">
              {filteredContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{content.title} - Study Materials</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Study Questions</h4>
                      <div className="space-y-3">
                        {content.questions.map((question) => (
                          <div key={question.id} className="p-4 bg-gray-50 rounded">
                            <div className="font-medium mb-2">{question.question}</div>
                            <div className="text-sm text-gray-600 mb-2">{question.answer}</div>
                            <div className="text-xs text-gray-500">
                              Type: {question.type} | Difficulty: {question.difficulty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Flashcards</h4>
                      <div className="space-y-3">
                        {content.flashcards.map((card) => (
                          <div key={card.id} className="p-4 bg-blue-50 rounded">
                            <div className="font-medium mb-2">Q: {card.front}</div>
                            <div className="text-sm text-gray-600 mb-2">A: {card.back}</div>
                            <div className="text-xs text-gray-500">
                              Category: {card.category} | Difficulty: {card.difficulty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Concepts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.concepts.map((concept) => (
                        <div key={concept.id} className="p-4 bg-green-50 rounded">
                          <div className="font-medium mb-2">{concept.name}</div>
                          <div className="text-sm text-gray-600 mb-2">{concept.definition}</div>
                          <div className="text-xs text-gray-500">
                            Importance: {concept.importance}/10 | Category: {concept.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              {filteredContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">{content.title} - Export Options</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {content.exportFormats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        onClick={() => exportContent(content, format)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export as {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No summaries found</h3>
          <p className="text-gray-500">Upload some documents to get started with AI-powered summarization</p>
        </div>
      )}
    </div>
  );
}