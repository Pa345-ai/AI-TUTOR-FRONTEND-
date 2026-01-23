"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Brain, 
  BookOpen, 
  Zap, 
  BarChart3, 
  PieChart, 
  Activity,
  Flame,
  Star,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LearningSession {
  id: string;
  date: string;
  duration: number; // minutes
  subject: string;
  topic: string;
  score?: number;
  type: 'lesson' | 'quiz' | 'practice' | 'review';
  completed: boolean;
}

interface LearningStreak {
  current: number;
  longest: number;
  lastActivity: string;
  streakType: 'daily' | 'weekly' | 'monthly';
}

interface WeaknessAnalysis {
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  lastPracticed: string;
  improvement: number; // percentage change
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface LearningInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'warning' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'on-track' | 'behind' | 'completed' | 'overdue';
}

interface TimeDistribution {
  subject: string;
  timeSpent: number; // minutes
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export function EnhancedProgressDashboard() {
  const [userId, setUserId] = useState("123");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'insights'>('overview');
  
  // Data states
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [streaks, setStreaks] = useState<LearningStreak[]>([]);
  const [weaknesses, setWeaknesses] = useState<WeaknessAnalysis[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<TimeDistribution[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageSessionLength, setAverageSessionLength] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [improvementRate, setImprovementRate] = useState(0);

  // Initialize with sample data
  useEffect(() => {
    initializeDashboard();
  }, [timeRange]);

  const initializeDashboard = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate sample data based on time range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const now = new Date();
    
    // Sample learning sessions
    const sampleSessions: LearningSession[] = Array.from({ length: days * 2 }, (_, i) => {
      const date = new Date(now.getTime() - (days - Math.floor(i / 2)) * 24 * 60 * 60 * 1000);
      const subjects = ['Mathematics', 'Science', 'Language', 'History', 'Physics'];
      const topics = ['Algebra', 'Biology', 'Grammar', 'World War II', 'Mechanics'];
      const types: ('lesson' | 'quiz' | 'practice' | 'review')[] = ['lesson', 'quiz', 'practice', 'review'];
      
      return {
        id: `session-${i}`,
        date: date.toISOString(),
        duration: Math.floor(Math.random() * 120) + 15,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        topic: topics[Math.floor(Math.random() * topics.length)],
        score: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : undefined,
        type: types[Math.floor(Math.random() * types.length)],
        completed: Math.random() > 0.1
      };
    });

    // Sample streaks
    const sampleStreaks: LearningStreak[] = [
      {
        current: 12,
        longest: 45,
        lastActivity: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        streakType: 'daily'
      },
      {
        current: 3,
        longest: 8,
        lastActivity: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        streakType: 'weekly'
      }
    ];

    // Sample weaknesses
    const sampleWeaknesses: WeaknessAnalysis[] = [
      {
        topic: 'Quadratic Equations',
        subject: 'Mathematics',
        accuracy: 45,
        attempts: 23,
        lastPracticed: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        improvement: -5,
        priority: 'critical',
        recommendations: ['Review basic algebra concepts', 'Practice with simpler problems first', 'Use visual aids for understanding']
      },
      {
        topic: 'Photosynthesis',
        subject: 'Biology',
        accuracy: 62,
        attempts: 15,
        lastPracticed: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        improvement: 8,
        priority: 'high',
        recommendations: ['Focus on chemical equations', 'Create concept maps', 'Practice with diagrams']
      },
      {
        topic: 'Past Tense',
        subject: 'Language',
        accuracy: 78,
        attempts: 8,
        lastPracticed: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        improvement: 12,
        priority: 'medium',
        recommendations: ['Continue current practice routine', 'Try conversation practice']
      }
    ];

    // Sample insights
    const sampleInsights: LearningInsight[] = [
      {
        id: 'insight-1',
        type: 'pattern',
        title: 'Peak Learning Time',
        description: 'You perform best during morning sessions (9-11 AM) with 23% higher scores.',
        confidence: 87,
        actionable: true,
        actionItems: ['Schedule important topics in the morning', 'Use afternoons for review sessions']
      },
      {
        id: 'insight-2',
        type: 'achievement',
        title: 'Consistency Milestone',
        description: 'You\'ve maintained a 12-day learning streak! This is your longest in 3 months.',
        confidence: 100,
        actionable: false
      },
      {
        id: 'insight-3',
        type: 'warning',
        title: 'Attention Needed',
        description: 'Mathematics accuracy has dropped 15% this week. Consider adjusting study approach.',
        confidence: 92,
        actionable: true,
        actionItems: ['Review recent math concepts', 'Try different learning methods', 'Seek additional help']
      },
      {
        id: 'insight-4',
        type: 'recommendation',
        title: 'Study Optimization',
        description: 'Breaking study sessions into 25-minute chunks could improve retention by 18%.',
        confidence: 76,
        actionable: true,
        actionItems: ['Use Pomodoro technique', 'Set 25-minute timers', 'Take 5-minute breaks']
      }
    ];

    // Sample goals
    const sampleGoals: StudyGoal[] = [
      {
        id: 'goal-1',
        title: 'Master Algebra',
        description: 'Complete 50 algebra problems with 80% accuracy',
        target: 50,
        current: 32,
        unit: 'problems',
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'on-track'
      },
      {
        id: 'goal-2',
        title: 'Daily Study Streak',
        description: 'Study for at least 30 minutes every day',
        target: 30,
        current: 12,
        unit: 'days',
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'on-track'
      },
      {
        id: 'goal-3',
        title: 'Biology Exam Prep',
        description: 'Complete all biology chapters before exam',
        target: 15,
        current: 8,
        unit: 'chapters',
        deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'behind'
      }
    ];

    // Sample time distribution
    const sampleTimeDistribution: TimeDistribution[] = [
      { subject: 'Mathematics', timeSpent: 450, percentage: 35, trend: 'up', color: '#3b82f6' },
      { subject: 'Science', timeSpent: 320, percentage: 25, trend: 'stable', color: '#10b981' },
      { subject: 'Language', timeSpent: 280, percentage: 22, trend: 'up', color: '#f59e0b' },
      { subject: 'History', timeSpent: 180, percentage: 14, trend: 'down', color: '#ef4444' },
      { subject: 'Physics', timeSpent: 50, percentage: 4, trend: 'up', color: '#8b5cf6' }
    ];

    // Calculate metrics
    const totalTime = sampleSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedSessions = sampleSessions.filter(s => s.completed).length;
    const avgSessionLength = totalTime / sampleSessions.length;
    const completionRate = (completedSessions / sampleSessions.length) * 100;
    
    // Calculate improvement rate (simplified)
    const recentSessions = sampleSessions.slice(-7);
    const olderSessions = sampleSessions.slice(-14, -7);
    const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + (s.score || 0), 0) / olderSessions.length;
    const improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;

    setSessions(sampleSessions);
    setStreaks(sampleStreaks);
    setWeaknesses(sampleWeaknesses);
    setInsights(sampleInsights);
    setGoals(sampleGoals);
    setTimeDistribution(sampleTimeDistribution);
    setTotalStudyTime(totalTime);
    setAverageSessionLength(avgSessionLength);
    setCompletionRate(completionRate);
    setImprovementRate(improvementRate);
    setLoading(false);
  }, [timeRange]);

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
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600 bg-blue-100';
      case 'achievement': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-red-600 bg-red-100';
      case 'recommendation': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Enhanced Progress Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive learning analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={initializeDashboard}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'ghost'}
          onClick={() => setViewMode('overview')}
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={viewMode === 'detailed' ? 'default' : 'ghost'}
          onClick={() => setViewMode('detailed')}
          size="sm"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Detailed
        </Button>
        <Button
          variant={viewMode === 'insights' ? 'default' : 'ghost'}
          onClick={() => setViewMode('insights')}
          size="sm"
        >
          <Brain className="h-4 w-4 mr-2" />
          Insights
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold">{Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold">{streaks[0]?.current || 0} days</p>
            </div>
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-yellow-600">Best: {streaks[0]?.longest || 0} days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% improvement</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session</p>
              <p className="text-2xl font-bold">{Math.round(averageSessionLength)}m</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Minus className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600">Stable</span>
          </div>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Goals */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Study Goals
            </h3>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <div className="mt-2 text-xs text-gray-500">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Distribution */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Study Time Distribution
            </h3>
            <div className="space-y-3">
              {timeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                    {item.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                    {item.trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
                    {item.trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{session.topic}</p>
                    <p className="text-xs text-gray-600">{session.subject} • {session.duration}m</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.score && (
                      <span className="text-sm font-medium">{session.score}%</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              Quick Insights
            </h3>
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-full ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Mode */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {/* Weaknesses Analysis */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Weaknesses Analysis
            </h3>
            <div className="space-y-4">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{weakness.topic}</h4>
                      <p className="text-sm text-gray-600">{weakness.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(weakness.priority)}`}>
                        {weakness.priority}
                      </span>
                      <span className="text-sm font-medium">{weakness.accuracy}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Attempts:</span>
                      <span className="ml-1 font-medium">{weakness.attempts}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Improvement:</span>
                      <span className={`ml-1 font-medium ${weakness.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {weakness.improvement >= 0 ? '+' : ''}{weakness.improvement}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Practiced:</span>
                      <span className="ml-1 font-medium">
                        {new Date(weakness.lastPracticed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {weakness.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Sessions Timeline */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Study Sessions Timeline
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      session.type === 'lesson' ? 'bg-blue-500' :
                      session.type === 'quiz' ? 'bg-green-500' :
                      session.type === 'practice' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">{session.topic}</p>
                      <p className="text-xs text-gray-600">
                        {session.subject} • {new Date(session.date).toLocaleDateString()} • {session.duration}m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.score && (
                      <span className="text-sm font-medium">{session.score}%</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Mode */}
      {viewMode === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Learning Insights
            </h3>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                      </div>
                      <p className="text-gray-600 mb-3">{insight.description}</p>
                      {insight.actionable && insight.actionItems && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                          <ul className="space-y-1">
                            {insight.actionItems.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
