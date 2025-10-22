"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Target, 
  Award, 
  TrendingUp, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Share, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Settings, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Users, 
  Globe, 
  Calendar, 
  Timer, 
  Zap, 
  Lightbulb, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Info, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Circle, 
  Dot, 
  Hash, 
  Percent, 
  Euro, 
  Bitcoin, 
  CreditCard, 
  Banknote, 
  Coins, 
  TrendingDown, 
  Activity as ActivityIcon, 
  Zap as ZapIcon, 
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
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Squirrel, 
  Turtle, 
  Triangle, 
  Hexagon, 
  Circle, 
  Square, 
  Triangle, 
  Hexagon, 
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

interface CareerProfile {
  id: string;
  name: string;
  description: string;
  category: 'technology' | 'healthcare' | 'business' | 'education' | 'arts' | 'science' | 'engineering' | 'law' | 'finance' | 'other';
  education: {
    level: 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctorate' | 'professional';
    field: string;
    institution?: string;
    gpa?: number;
    graduationYear?: number;
  };
  experience: {
    years: number;
    currentRole?: string;
    currentCompany?: string;
    previousRoles: string[];
    skills: string[];
    achievements: string[];
  };
  interests: string[];
  values: string[];
  personality: {
    type: string;
    traits: string[];
    strengths: string[];
    areasForImprovement: string[];
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
    careerAspirations: string[];
    salaryExpectations: {
      min: number;
      max: number;
      currency: string;
    };
    workLifeBalance: 'high' | 'medium' | 'low';
    locationPreferences: string[];
    industryPreferences: string[];
  };
  assessment: {
    completed: boolean;
    scores: { [key: string]: number };
    recommendations: string[];
    nextSteps: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: {
    min: number; // months
    max: number; // months
  };
  requirements: {
    education: string[];
    skills: string[];
    experience: string[];
    certifications: string[];
  };
  salary: {
    entry: number;
    mid: number;
    senior: number;
    currency: string;
  };
  jobMarket: {
    demand: 'high' | 'medium' | 'low';
    growth: number; // percentage
    competition: 'high' | 'medium' | 'low';
  };
  steps: CareerStep[];
  resources: CareerResource[];
  universities: University[];
  companies: Company[];
  successRate: number;
  satisfaction: number;
}

interface CareerStep {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number; // weeks
  prerequisites: string[];
  deliverables: string[];
  resources: string[];
  isCompleted: boolean;
  completedAt?: Date;
}

interface CareerResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'article' | 'video' | 'podcast' | 'tool' | 'certification' | 'workshop' | 'conference';
  url: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // hours
  cost: number;
  rating: number;
  provider: string;
  tags: string[];
}

interface University {
  id: string;
  name: string;
  location: string;
  ranking: number;
  programs: string[];
  tuition: {
    inState: number;
    outOfState: number;
    international: number;
  };
  acceptanceRate: number;
  averageGPA: number;
  requirements: string[];
  scholarships: string[];
  website: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  culture: string[];
  benefits: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  requirements: string[];
  applicationProcess: string[];
  website: string;
  rating: number;
}

interface CareerRecommendation {
  id: string;
  careerPath: CareerPath;
  matchScore: number;
  reasons: string[];
  pros: string[];
  cons: string[];
  timeline: string;
  investment: {
    time: number; // months
    cost: number;
    effort: 'low' | 'medium' | 'high';
  };
  alternatives: string[];
  nextSteps: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'education' | 'personal' | 'financial' | 'health' | 'relationship' | 'skill' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  deadline?: Date;
  progress: number; // percentage
  milestones: Milestone[];
  resources: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  isCompleted: boolean;
  completedAt?: Date;
  progress: number;
}

interface CareerAdvisorStats {
  totalProfiles: number;
  totalGoals: number;
  completedGoals: number;
  averageMatchScore: number;
  popularCareers: { [key: string]: number };
  popularGoals: { [key: string]: number };
  successRate: number;
  userSatisfaction: number;
  recommendationsGiven: number;
  resourcesShared: number;
}

export function AICareerGoalAdvisor() {
  const [careerProfile, setCareerProfile] = useState<CareerProfile | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'assessment' | 'careers' | 'goals' | 'resources' | 'analytics'>('profile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<CareerAdvisorStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'career' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    deadline: '',
    notes: ''
  });
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleProfile: CareerProfile = {
      id: 'profile-1',
      name: 'John Doe',
      description: 'Aspiring software engineer with passion for AI and machine learning',
      category: 'technology',
      education: {
        level: 'bachelor',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        gpa: 3.7,
        graduationYear: 2023
      },
      experience: {
        years: 2,
        currentRole: 'Junior Software Developer',
        currentCompany: 'TechCorp Inc.',
        previousRoles: ['Intern', 'Junior Developer'],
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'Data Analysis'],
        achievements: ['Led a team of 3 developers', 'Improved app performance by 40%', 'Completed AWS certification']
      },
      interests: ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Data Science', 'Open Source'],
      values: ['Innovation', 'Collaboration', 'Learning', 'Work-Life Balance', 'Social Impact'],
      personality: {
        type: 'INTJ',
        traits: ['Analytical', 'Creative', 'Independent', 'Strategic', 'Detail-oriented'],
        strengths: ['Problem-solving', 'Critical thinking', 'Technical skills', 'Leadership'],
        areasForImprovement: ['Public speaking', 'Networking', 'Time management']
      },
      goals: {
        shortTerm: ['Learn advanced ML algorithms', 'Get promoted to Senior Developer', 'Contribute to open source projects'],
        longTerm: ['Become a Machine Learning Engineer', 'Start a tech company', 'Mentor junior developers'],
        careerAspirations: ['Senior ML Engineer', 'Tech Lead', 'CTO', 'Entrepreneur'],
        salaryExpectations: {
          min: 80000,
          max: 150000,
          currency: 'USD'
        },
        workLifeBalance: 'medium',
        locationPreferences: ['San Francisco', 'Seattle', 'Remote'],
        industryPreferences: ['Technology', 'Healthcare', 'Finance', 'Education']
      },
      assessment: {
        completed: true,
        scores: {
          technical: 85,
          leadership: 70,
          communication: 65,
          creativity: 90,
          analytical: 95
        },
        recommendations: [
          'Focus on improving communication skills',
          'Consider taking leadership courses',
          'Build a strong portfolio of ML projects'
        ],
        nextSteps: [
          'Complete advanced ML certification',
          'Join professional networking groups',
          'Start a personal blog about AI'
        ]
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    const sampleCareerPaths: CareerPath[] = [
      {
        id: 'path-1',
        title: 'Machine Learning Engineer',
        description: 'Design and implement machine learning systems and algorithms',
        category: 'technology',
        difficulty: 'advanced',
        duration: { min: 12, max: 24 },
        requirements: {
          education: ['Bachelor\'s in Computer Science or related field', 'Master\'s preferred'],
          skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics', 'Linear Algebra'],
          experience: ['2+ years software development', 'ML project experience'],
          certifications: ['AWS ML Specialty', 'Google ML Engineer', 'Microsoft Azure ML']
        },
        salary: {
          entry: 90000,
          mid: 130000,
          senior: 180000,
          currency: 'USD'
        },
        jobMarket: {
          demand: 'high',
          growth: 15,
          competition: 'high'
        },
        steps: [
          {
            id: 'step-1',
            title: 'Learn Advanced Mathematics',
            description: 'Master linear algebra, calculus, and statistics',
            order: 1,
            duration: 8,
            prerequisites: ['Basic calculus', 'Statistics knowledge'],
            deliverables: ['Complete online courses', 'Pass assessments'],
            resources: ['Coursera ML Course', 'Khan Academy Math'],
            isCompleted: false
          },
          {
            id: 'step-2',
            title: 'Master ML Frameworks',
            description: 'Learn TensorFlow, PyTorch, and scikit-learn',
            order: 2,
            duration: 12,
            prerequisites: ['Python proficiency', 'Math foundation'],
            deliverables: ['Build 3 ML projects', 'Complete certifications'],
            resources: ['TensorFlow Tutorials', 'PyTorch Documentation'],
            isCompleted: false
          }
        ],
        resources: [
          {
            id: 'resource-1',
            title: 'Machine Learning Specialization',
            type: 'course',
            url: 'https://coursera.org/learn/machine-learning',
            description: 'Comprehensive ML course by Andrew Ng',
            difficulty: 'intermediate',
            duration: 40,
            cost: 49,
            rating: 4.8,
            provider: 'Coursera',
            tags: ['machine-learning', 'python', 'statistics']
          }
        ],
        universities: [
          {
            id: 'uni-1',
            name: 'Stanford University',
            location: 'Stanford, CA',
            ranking: 1,
            programs: ['Computer Science', 'AI', 'Data Science'],
            tuition: { inState: 0, outOfState: 0, international: 0 },
            acceptanceRate: 4.3,
            averageGPA: 3.96,
            requirements: ['High GPA', 'Strong GRE scores', 'Research experience'],
            scholarships: ['Merit-based', 'Need-based', 'Research assistantships'],
            website: 'https://stanford.edu'
          }
        ],
        companies: [
          {
            id: 'comp-1',
            name: 'Google',
            industry: 'Technology',
            size: 'large',
            location: 'Mountain View, CA',
            culture: ['Innovation', 'Collaboration', 'Work-life balance'],
            benefits: ['Health insurance', 'Stock options', 'Free meals'],
            salaryRange: { min: 120000, max: 250000 },
            requirements: ['Strong technical skills', 'ML experience', 'Problem-solving'],
            applicationProcess: ['Online application', 'Technical interview', 'System design'],
            website: 'https://careers.google.com',
            rating: 4.5
          }
        ],
        successRate: 78,
        satisfaction: 4.2
      }
    ];

    const sampleGoals: Goal[] = [
      {
        id: 'goal-1',
        title: 'Complete Machine Learning Certification',
        description: 'Earn AWS Machine Learning Specialty certification',
        category: 'career',
        priority: 'high',
        status: 'in_progress',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progress: 45,
        milestones: [
          {
            id: 'milestone-1',
            title: 'Complete online course',
            description: 'Finish the AWS ML course',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isCompleted: true,
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            progress: 100
          },
          {
            id: 'milestone-2',
            title: 'Pass practice exams',
            description: 'Score 80%+ on practice tests',
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            isCompleted: false,
            progress: 30
          }
        ],
        resources: ['AWS ML Course', 'Practice exams', 'Study group'],
        notes: 'Focus on hands-on labs and real-world applications',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    const sampleStats: CareerAdvisorStats = {
      totalProfiles: 1,
      totalGoals: 3,
      completedGoals: 1,
      averageMatchScore: 85,
      popularCareers: { 'machine-learning': 45, 'data-science': 30, 'software-engineering': 25 },
      popularGoals: { 'certification': 40, 'promotion': 30, 'skill-development': 30 },
      successRate: 75,
      userSatisfaction: 4.3,
      recommendationsGiven: 12,
      resourcesShared: 28
    };
    
    setCareerProfile(sampleProfile);
    setCareerPaths(sampleCareerPaths);
    setGoals(sampleGoals);
    setStats(sampleStats);
  }, []);

  const analyzeProfile = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI analysis and recommendations
      const sampleRecommendations: CareerRecommendation[] = [
        {
          id: 'rec-1',
          careerPath: careerPaths[0],
          matchScore: 92,
          reasons: [
            'Strong technical background in programming',
            'Experience with machine learning projects',
            'Analytical personality matches ML requirements',
            'Clear interest in AI and data science'
          ],
          pros: [
            'High salary potential',
            'Growing job market',
            'Aligns with your interests',
            'Good work-life balance'
          ],
          cons: [
            'Requires continuous learning',
            'High competition',
            'May need advanced degree'
          ],
          timeline: '12-18 months',
          investment: {
            time: 15,
            cost: 5000,
            effort: 'high'
          },
          alternatives: ['Data Scientist', 'AI Research Scientist', 'ML Product Manager'],
          nextSteps: [
            'Complete advanced ML courses',
            'Build portfolio projects',
            'Network with ML professionals',
            'Apply for ML internships'
          ]
        }
      ];
      
      setRecommendations(sampleRecommendations);
      
    } catch (error) {
      console.error('Error analyzing profile:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [careerPaths]);

  const createGoal = useCallback(async () => {
    setIsCreatingGoal(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const goal: Goal = {
        id: `goal-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        status: 'not_started',
        deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
        progress: 0,
        milestones: [],
        resources: [],
        notes: newGoal.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setGoals(prev => [goal, ...prev]);
      setNewGoal({
        title: '',
        description: '',
        category: 'career',
        priority: 'medium',
        deadline: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsCreatingGoal(false);
    }
  }, [newGoal]);

  const filteredCareerPaths = careerPaths.filter(path => 
    (searchQuery === '' || path.title.toLowerCase().includes(searchQuery.toLowerCase()) || path.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory === 'all' || path.category === filterCategory) &&
    (filterDifficulty === 'all' || path.difficulty === filterDifficulty)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Career & Goal Advisor
          </h1>
          <p className="text-gray-600">Get personalized career guidance and achieve your professional goals</p>
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
          { id: 'profile', label: 'Profile', icon: <Users className="h-4 w-4" /> },
          { id: 'assessment', label: 'Assessment', icon: <Target className="h-4 w-4" /> },
          { id: 'careers', label: 'Careers', icon: <Briefcase className="h-4 w-4" /> },
          { id: 'goals', label: 'Goals', icon: <Award className="h-4 w-4" /> },
          { id: 'resources', label: 'Resources', icon: <BookOpen className="h-4 w-4" /> },
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

      {/* Profile Tab */}
      {activeTab === 'profile' && careerProfile && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{careerProfile.name}</h2>
                <p className="text-gray-600">{careerProfile.description}</p>
              </div>
              <Button onClick={() => setActiveTab('assessment')}>
                <Target className="h-4 w-4 mr-2" />
                Take Assessment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Education</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{careerProfile.education.field}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span>{careerProfile.education.level.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  {careerProfile.education.institution && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{careerProfile.education.institution}</span>
                    </div>
                  )}
                  {careerProfile.education.gpa && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span>GPA: {careerProfile.education.gpa}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold">Experience</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{careerProfile.experience.years} years experience</span>
                  </div>
                  {careerProfile.experience.currentRole && (
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>{careerProfile.experience.currentRole} at {careerProfile.experience.currentCompany}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {careerProfile.experience.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Goals & Aspirations</h3>
                <div className="space-y-2">
                  <h4 className="font-medium">Short-term Goals</h4>
                  <ul className="space-y-1">
                    {careerProfile.goals.shortTerm.map((goal, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium">Long-term Goals</h4>
                  <ul className="space-y-1">
                    {careerProfile.goals.longTerm.map((goal, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h3 className="text-lg font-semibold">Values</h3>
                <div className="flex flex-wrap gap-2">
                  {careerProfile.values.map((value, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Tab */}
      {activeTab === 'assessment' && careerProfile && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Career Assessment Results
            </h3>
            
            {careerProfile.assessment.completed ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(careerProfile.assessment.scores).map(([skill, score]) => (
                    <div key={skill} className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{score}</div>
                      <div className="text-sm text-gray-600 capitalize">{skill}</div>
                      <Progress value={score} className="mt-2" />
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {careerProfile.assessment.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Next Steps</h4>
                    <ul className="space-y-2">
                      {careerProfile.assessment.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={analyzeProfile} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Get Career Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Complete Your Assessment</h3>
                <p className="text-gray-500 mb-4">Take our comprehensive career assessment to get personalized recommendations</p>
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Careers Tab */}
      {activeTab === 'careers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search career paths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCareerPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{path.title}</h3>
                    <p className="text-gray-600 text-sm">{path.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{path.duration.min}-{path.duration.max} months</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${path.salary.entry.toLocaleString()} - ${path.salary.senior.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{path.jobMarket.growth}% growth</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4" />
                    <span>{path.satisfaction}/5 satisfaction</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {path.steps.length} steps
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCareer(path)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Goals
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                My Goals
              </h3>
              <Button onClick={() => setShowSettings(!showSettings)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>
            
            {showSettings && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Create New Goal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter goal title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="career">Career</option>
                      <option value="education">Education</option>
                      <option value="personal">Personal</option>
                      <option value="financial">Financial</option>
                      <option value="health">Health</option>
                      <option value="skill">Skill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20"
                    placeholder="Describe your goal"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createGoal} disabled={isCreatingGoal || !newGoal.title.trim()}>
                    {isCreatingGoal ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Goal
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {goal.milestones.length} milestones
                      {goal.deadline && (
                        <span className="ml-2">
                          • Due: {goal.deadline.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalProfiles}</div>
              <div className="text-gray-600">Profiles Created</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalGoals}</div>
              <div className="text-gray-600">Goals Set</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.completedGoals}</div>
              <div className="text-gray-600">Goals Completed</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.averageMatchScore}%</div>
              <div className="text-gray-600">Avg Match Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}