"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Brain, 
  FileText, 
  Upload, 
  Download, 
  Share, 
  Edit, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Clock, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send, 
  Plus, 
  Minus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  Target, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  Globe, 
  Settings, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
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
  Activity as ActivityIcon, 
  Zap, 
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

interface HomeworkSubmission {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'essay' | 'homework' | 'assignment' | 'project' | 'report' | 'presentation' | 'lab' | 'quiz' | 'exam' | 'other';
  content: string;
  fileUrl?: string;
  submittedAt: Date;
  dueDate?: Date;
  status: 'submitted' | 'processing' | 'reviewed' | 'graded' | 'returned';
  student: {
    name: string;
    grade: string;
    class: string;
  };
  rubric?: Rubric;
  feedback: AIFeedback;
  grade?: Grade;
  analytics: SubmissionAnalytics;
}

interface Rubric {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterion[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
  levels: RubricLevel[];
}

interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
  examples: string[];
}

interface AIFeedback {
  id: string;
  overallScore: number;
  overallComment: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  detailedFeedback: DetailedFeedback[];
  grammarCheck: GrammarCheck;
  plagiarismCheck: PlagiarismCheck;
  readabilityScore: number;
  wordCount: number;
  estimatedTimeToRead: number;
  gradeLevel: string;
  confidence: number;
  generatedAt: Date;
}

interface DetailedFeedback {
  id: string;
  section: string;
  score: number;
  comment: string;
  suggestions: string[];
  examples: string[];
  rubricCriterion?: string;
}

interface GrammarCheck {
  totalErrors: number;
  errors: GrammarError[];
  suggestions: string[];
  readabilityScore: number;
}

interface GrammarError {
  id: string;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style' | 'clarity' | 'tone';
  message: string;
  suggestion: string;
  position: {
    start: number;
    end: number;
  };
  severity: 'low' | 'medium' | 'high';
  confidence: number;
}

interface PlagiarismCheck {
  score: number;
  sources: PlagiarismSource[];
  originalContent: number;
  flaggedContent: number;
  recommendations: string[];
}

interface PlagiarismSource {
  id: string;
  url: string;
  title: string;
  similarity: number;
  matchedText: string;
  position: {
    start: number;
    end: number;
  };
}

interface Grade {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  rubricScores: { [criterionId: string]: number };
  comments: string[];
  gradedAt: Date;
  gradedBy: string;
}

interface SubmissionAnalytics {
  timeSpent: number;
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  readabilityScore: number;
  gradeLevel: string;
  complexityScore: number;
  vocabularyDiversity: number;
  commonWords: string[];
  writingPatterns: string[];
  improvementAreas: string[];
  strengths: string[];
}

interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  type: string;
  criteria: string[];
  defaultComments: { [key: string]: string };
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FeedbackSettings {
  enableGrammarCheck: boolean;
  enablePlagiarismCheck: boolean;
  enableReadabilityAnalysis: boolean;
  enableDetailedFeedback: boolean;
  enableRubricGrading: boolean;
  enablePeerReview: boolean;
  enableSelfAssessment: boolean;
  feedbackLanguage: string;
  feedbackTone: 'encouraging' | 'constructive' | 'critical' | 'neutral';
  autoGrade: boolean;
  requireHumanReview: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface FeedbackStats {
  totalSubmissions: number;
  averageScore: number;
  averageFeedbackTime: number;
  commonIssues: { [key: string]: number };
  improvementTrends: { [key: string]: number };
  studentSatisfaction: number;
  teacherEfficiency: number;
  timeSaved: number;
  accuracyRate: number;
}

export function AIHomeworkFeedback() {
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'feedback' | 'templates' | 'settings' | 'analytics'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [feedbackSettings, setFeedbackSettings] = useState<FeedbackSettings>({
    enableGrammarCheck: true,
    enablePlagiarismCheck: true,
    enableReadabilityAnalysis: true,
    enableDetailedFeedback: true,
    enableRubricGrading: true,
    enablePeerReview: false,
    enableSelfAssessment: false,
    feedbackLanguage: 'en',
    feedbackTone: 'constructive',
    autoGrade: false,
    requireHumanReview: true,
    notificationSettings: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    type: 'essay' as HomeworkSubmission['type'],
    content: '',
    dueDate: ''
  });
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleSubmissions: HomeworkSubmission[] = [
      {
        id: 'sub-1',
        title: 'The Impact of Climate Change on Marine Ecosystems',
        description: 'Research essay on climate change effects on ocean life',
        subject: 'Environmental Science',
        type: 'essay',
        content: 'Climate change is one of the most pressing issues of our time, affecting every aspect of life on Earth. Marine ecosystems are particularly vulnerable to these changes, as they are directly influenced by temperature, acidity, and sea level changes. This essay will explore the various ways climate change impacts marine ecosystems and discuss potential solutions.\n\nOne of the most significant impacts of climate change on marine ecosystems is ocean acidification. As carbon dioxide levels in the atmosphere increase, more CO2 is absorbed by the oceans, leading to a decrease in pH levels. This acidification has devastating effects on marine organisms, particularly those with calcium carbonate shells or skeletons, such as corals, mollusks, and some plankton species.\n\nAnother major concern is the rising sea temperatures. Warmer waters can cause coral bleaching, where corals expel their symbiotic algae, leading to their death. This not only affects the corals themselves but also the entire ecosystem that depends on them, including fish, crustaceans, and other marine life.\n\nSea level rise is another consequence of climate change that affects marine ecosystems. As ice caps and glaciers melt, sea levels rise, which can lead to the loss of coastal habitats such as mangroves, salt marshes, and seagrass beds. These habitats are crucial for many marine species and provide important ecosystem services.\n\nIn conclusion, climate change poses significant threats to marine ecosystems through ocean acidification, rising temperatures, and sea level rise. It is crucial that we take immediate action to reduce greenhouse gas emissions and implement conservation strategies to protect these vital ecosystems.',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'reviewed',
        student: {
          name: 'Sarah Johnson',
          grade: '11th',
          class: 'Environmental Science'
        },
        feedback: {
          id: 'feedback-1',
          overallScore: 85,
          overallComment: 'This is a well-structured essay that demonstrates good understanding of the topic. The student has clearly researched the subject and presents a logical argument. However, there are areas for improvement in terms of depth of analysis and specific examples.',
          strengths: [
            'Clear thesis statement and well-organized structure',
            'Good use of scientific terminology',
            'Comprehensive coverage of the main impacts of climate change on marine ecosystems',
            'Strong conclusion that ties everything together'
          ],
          areasForImprovement: [
            'Could include more specific examples and case studies',
            'Some claims need more supporting evidence',
            'Could benefit from more detailed analysis of the interconnectedness of these impacts',
            'Consider discussing potential solutions in more depth'
          ],
          suggestions: [
            'Add specific examples of coral bleaching events and their impacts',
            'Include data on ocean acidification rates and their effects on specific species',
            'Discuss the economic and social implications of marine ecosystem degradation',
            'Consider adding a section on adaptation strategies for marine ecosystems'
          ],
          detailedFeedback: [
            {
              id: 'detail-1',
              section: 'Introduction',
              score: 8,
              comment: 'Good introduction that clearly states the topic and its importance. Could be more engaging with a hook.',
              suggestions: ['Start with a compelling statistic or anecdote', 'Consider using a rhetorical question'],
              examples: ['"Did you know that coral reefs support 25% of all marine life?"']
            },
            {
              id: 'detail-2',
              section: 'Body Paragraphs',
              score: 8,
              comment: 'Well-organized paragraphs with clear topic sentences. Good use of transitions.',
              suggestions: ['Add more specific examples and data', 'Include counterarguments and refutations'],
              examples: ['Include specific coral bleaching events like the Great Barrier Reef bleaching']
            }
          ],
          grammarCheck: {
            totalErrors: 3,
            errors: [
              {
                id: 'grammar-1',
                type: 'grammar',
                message: 'Subject-verb disagreement',
                suggestion: 'Change "impacts" to "impact"',
                position: { start: 45, end: 52 },
                severity: 'medium',
                confidence: 0.85
              }
            ],
            suggestions: [
              'Consider varying sentence structure for better flow',
              'Some sentences are quite long and could be broken down'
            ],
            readabilityScore: 12
          },
          plagiarismCheck: {
            score: 95,
            sources: [],
            originalContent: 95,
            flaggedContent: 5,
            recommendations: [
              'The content appears to be original with minimal similarity to other sources',
              'Consider adding more citations to support claims'
            ]
          },
          readabilityScore: 12,
          wordCount: 487,
          estimatedTimeToRead: 2,
          gradeLevel: '11th Grade',
          confidence: 0.92,
          generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        grade: {
          id: 'grade-1',
          score: 85,
          maxScore: 100,
          percentage: 85,
          letterGrade: 'B+',
          rubricScores: {
            'content': 8,
            'organization': 9,
            'writing': 8,
            'research': 7
          },
          comments: ['Good work overall', 'Consider adding more specific examples'],
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          gradedBy: 'AI Tutor'
        },
        analytics: {
          timeSpent: 120,
          wordCount: 487,
          characterCount: 2847,
          paragraphCount: 6,
          sentenceCount: 23,
          averageWordsPerSentence: 21.2,
          readabilityScore: 12,
          gradeLevel: '11th Grade',
          complexityScore: 7.5,
          vocabularyDiversity: 0.73,
          commonWords: ['climate', 'change', 'marine', 'ecosystems', 'ocean'],
          writingPatterns: ['cause and effect', 'problem-solution', 'comparison'],
          improvementAreas: ['specific examples', 'data integration', 'analysis depth'],
          strengths: ['organization', 'clarity', 'scientific accuracy']
        }
      }
    ];
    
    const sampleStats: FeedbackStats = {
      totalSubmissions: 156,
      averageScore: 78,
      averageFeedbackTime: 45,
      commonIssues: {
        'grammar': 45,
        'organization': 32,
        'evidence': 28,
        'clarity': 25
      },
      improvementTrends: {
        'grammar': 15,
        'organization': 8,
        'evidence': 12,
        'clarity': 6
      },
      studentSatisfaction: 4.2,
      teacherEfficiency: 3.8,
      timeSaved: 65,
      accuracyRate: 89
    };
    
    setSubmissions(sampleSubmissions);
    setStats(sampleStats);
  }, []);

  const processSubmission = useCallback(async (submission: HomeworkSubmission) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI processing
      const updatedSubmission = {
        ...submission,
        status: 'reviewed' as const,
        feedback: {
          id: `feedback-${Date.now()}`,
          overallScore: Math.floor(Math.random() * 40) + 60,
          overallComment: 'AI-generated feedback based on content analysis...',
          strengths: ['Good structure', 'Clear arguments', 'Relevant content'],
          areasForImprovement: ['Grammar', 'Evidence', 'Analysis'],
          suggestions: ['Add more examples', 'Improve transitions', 'Strengthen conclusion'],
          detailedFeedback: [],
          grammarCheck: {
            totalErrors: Math.floor(Math.random() * 10),
            errors: [],
            suggestions: [],
            readabilityScore: Math.floor(Math.random() * 10) + 8
          },
          plagiarismCheck: {
            score: Math.floor(Math.random() * 20) + 80,
            sources: [],
            originalContent: Math.floor(Math.random() * 20) + 80,
            flaggedContent: Math.floor(Math.random() * 10),
            recommendations: []
          },
          readabilityScore: Math.floor(Math.random() * 10) + 8,
          wordCount: submission.content.split(' ').length,
          estimatedTimeToRead: Math.ceil(submission.content.split(' ').length / 200),
          gradeLevel: '11th Grade',
          confidence: 0.85 + Math.random() * 0.15,
          generatedAt: new Date()
        }
      };
      
      setSubmissions(prev => prev.map(s => s.id === submission.id ? updatedSubmission : s));
      
    } catch (error) {
      console.error('Error processing submission:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const createSubmission = useCallback(async () => {
    setIsCreatingSubmission(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const submission: HomeworkSubmission = {
        id: `sub-${Date.now()}`,
        title: newSubmission.title,
        description: newSubmission.description,
        subject: newSubmission.subject,
        type: newSubmission.type,
        content: newSubmission.content,
        submittedAt: new Date(),
        dueDate: newSubmission.dueDate ? new Date(newSubmission.dueDate) : undefined,
        status: 'submitted',
        student: {
          name: 'Current Student',
          grade: '11th',
          class: newSubmission.subject
        },
        feedback: {
          id: '',
          overallScore: 0,
          overallComment: '',
          strengths: [],
          areasForImprovement: [],
          suggestions: [],
          detailedFeedback: [],
          grammarCheck: {
            totalErrors: 0,
            errors: [],
            suggestions: [],
            readabilityScore: 0
          },
          plagiarismCheck: {
            score: 0,
            sources: [],
            originalContent: 0,
            flaggedContent: 0,
            recommendations: []
          },
          readabilityScore: 0,
          wordCount: 0,
          estimatedTimeToRead: 0,
          gradeLevel: '',
          confidence: 0,
          generatedAt: new Date()
        },
        analytics: {
          timeSpent: 0,
          wordCount: 0,
          characterCount: 0,
          paragraphCount: 0,
          sentenceCount: 0,
          averageWordsPerSentence: 0,
          readabilityScore: 0,
          gradeLevel: '',
          complexityScore: 0,
          vocabularyDiversity: 0,
          commonWords: [],
          writingPatterns: [],
          improvementAreas: [],
          strengths: []
        }
      };
      
      setSubmissions(prev => [submission, ...prev]);
      setNewSubmission({
        title: '',
        description: '',
        subject: 'Mathematics',
        type: 'essay',
        content: '',
        dueDate: ''
      });
      
    } catch (error) {
      console.error('Error creating submission:', error);
    } finally {
      setIsCreatingSubmission(false);
    }
  }, [newSubmission]);

  const filteredSubmissions = submissions.filter(submission => 
    (searchQuery === '' || submission.title.toLowerCase().includes(searchQuery.toLowerCase()) || submission.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterSubject === 'all' || submission.subject === filterSubject) &&
    (filterType === 'all' || submission.type === filterType) &&
    (filterStatus === 'all' || submission.status === filterStatus)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-purple-600 bg-purple-100';
      case 'returned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
      case 'A-': return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
      case 'B-': return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C':
      case 'C-': return 'text-yellow-600 bg-yellow-100';
      case 'D+':
      case 'D':
      case 'D-': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
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
            AI Homework & Essay Feedback
          </h1>
          <p className="text-gray-600">Get instant, detailed feedback on your homework and essays</p>
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'submissions', label: 'Submissions', icon: <FileText className="h-4 w-4" /> },
          { id: 'feedback', label: 'Feedback', icon: <MessageCircle className="h-4 w-4" /> },
          { id: 'templates', label: 'Templates', icon: <Edit className="h-4 w-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
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

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
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
                  <option value="Environmental Science">Environmental Science</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="essay">Essay</option>
                  <option value="homework">Homework</option>
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="processing">Processing</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{submission.title}</h3>
                    <p className="text-gray-600 text-sm">{submission.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{submission.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Submitted: {submission.submittedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{submission.content.split(' ').length} words</span>
                  </div>
                  {submission.grade && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getGradeColor(submission.grade.letterGrade)}`}>
                        {submission.grade.letterGrade} ({submission.grade.percentage}%)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {submission.student.name}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(submission)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {submission.status === 'submitted' && (
                      <Button size="sm" onClick={() => processSubmission(submission)} disabled={isProcessing}>
                        <Brain className="h-4 w-4 mr-1" />
                        Analyze
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && selectedSubmission && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedSubmission.title}</h2>
                <p className="text-gray-600">{selectedSubmission.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedSubmission.grade && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedSubmission.grade.letterGrade)}`}>
                    {selectedSubmission.grade.letterGrade} ({selectedSubmission.grade.percentage}%)
                  </div>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Overall Feedback */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Overall Feedback</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedSubmission.feedback.overallComment}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedSubmission.feedback.overallScore}/100
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(selectedSubmission.feedback.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3 text-green-700">Strengths</h4>
                <ul className="space-y-2">
                  {selectedSubmission.feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-orange-700">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {selectedSubmission.feedback.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Suggestions */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {selectedSubmission.feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Grammar Check */}
            {selectedSubmission.feedback.grammarCheck.totalErrors > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Grammar Check</h4>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700 mb-2">
                    Found {selectedSubmission.feedback.grammarCheck.totalErrors} errors
                  </p>
                  <ul className="space-y-1">
                    {selectedSubmission.feedback.grammarCheck.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">
                        • {error.message}: {error.suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Plagiarism Check */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Plagiarism Check</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Originality Score: {selectedSubmission.feedback.plagiarismCheck.score}%
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {selectedSubmission.feedback.plagiarismCheck.originalContent}% original content
                </p>
              </div>
            </div>
            
            {/* Readability Analysis */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Readability Analysis</h4>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Readability Score:</span>
                    <div className="font-medium">{selectedSubmission.feedback.readabilityScore}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade Level:</span>
                    <div className="font-medium">{selectedSubmission.feedback.gradeLevel}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Word Count:</span>
                    <div className="font-medium">{selectedSubmission.feedback.wordCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Reading Time:</span>
                    <div className="font-medium">{selectedSubmission.feedback.estimatedTimeToRead} min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSubmissions}</div>
              <div className="text-gray-600">Total Submissions</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageScore}</div>
              <div className="text-gray-600">Average Score</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageFeedbackTime}m</div>
              <div className="text-gray-600">Avg Feedback Time</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.timeSaved}%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}