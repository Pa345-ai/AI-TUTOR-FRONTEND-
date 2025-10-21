'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Brain, Activity, Moon, Utensils, Dumbbell, Target, TrendingUp, Calendar, Plus, Settings, Eye, Edit3, Trash2, CheckCircle, AlertTriangle, Clock, Users, Zap, BookOpen, BarChart3, RefreshCw } from 'lucide-react'

interface OmniMindHealthProps {
  userId: string
}

interface HealthProfile {
  id: string
  mentalHealthScore: number
  physicalHealthScore: number
  emotionalWellnessScore: number
  overallHealthScore: number
  emotionalState: {
    currentMood: string
    stressLevel: number
    anxietyLevel: number
    energyLevel: number
  }
  wellnessGoals: WellnessGoal[]
  therapySessions: TherapySession[]
  healthMetrics: {
    sleepQuality: number
    exerciseFrequency: number
    nutritionScore: number
    hydrationLevel: number
  }
  aiInsights: {
    strengths: string[]
    areasForImprovement: string[]
    recommendations: string[]
    moodPatterns: string[]
  }
}

interface WellnessGoal {
  id: string
  goalType: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  targetDate: string
  progressPercentage: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
}

interface TherapySession {
  id: string
  sessionType: string
  title: string
  description: string
  durationMinutes: number
  sessionDate: string
  effectivenessScore: number
  emotionalStateBefore: {
    mood: string
    stress: number
    energy: number
  }
  emotionalStateAfter: {
    mood: string
    stress: number
    energy: number
  }
  aiAnalysis: {
    keyInsights: string[]
    improvements: string[]
    recommendations: string[]
  }
}

export default function OmniMindHealth({ userId }: OmniMindHealthProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'therapy' | 'goals' | 'metrics' | 'insights'>('overview')
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [showNewSessionModal, setShowNewSessionModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null)

  useEffect(() => {
    loadHealthProfile()
  }, [userId])

  const loadHealthProfile = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockHealthProfile: HealthProfile = {
        id: 'health-1',
        mentalHealthScore: 85,
        physicalHealthScore: 78,
        emotionalWellnessScore: 82,
        overallHealthScore: 81,
        emotionalState: {
          currentMood: 'calm',
          stressLevel: 3,
          anxietyLevel: 2,
          energyLevel: 7
        },
        wellnessGoals: [
          {
            id: 'goal-1',
            goalType: 'mental_health',
            title: 'Daily Mindfulness Practice',
            description: 'Practice 10 minutes of mindfulness meditation daily',
            targetValue: 30,
            currentValue: 18,
            unit: 'days',
            targetDate: '2024-02-15',
            progressPercentage: 60,
            status: 'active'
          },
          {
            id: 'goal-2',
            goalType: 'physical_fitness',
            title: 'Exercise 3x per week',
            description: 'Complete 30 minutes of moderate exercise',
            targetValue: 12,
            currentValue: 8,
            unit: 'sessions',
            targetDate: '2024-02-20',
            progressPercentage: 67,
            status: 'active'
          }
        ],
        therapySessions: [
          {
            id: 'session-1',
            sessionType: 'mindfulness',
            title: 'Morning Mindfulness Session',
            description: 'Guided meditation for stress reduction',
            durationMinutes: 30,
            sessionDate: '2024-01-15T09:00:00Z',
            effectivenessScore: 8,
            emotionalStateBefore: { mood: 'anxious', stress: 6, energy: 4 },
            emotionalStateAfter: { mood: 'calm', stress: 3, energy: 7 },
            aiAnalysis: {
              keyInsights: ['Significant stress reduction achieved', 'Energy levels improved by 75%'],
              improvements: ['Consider longer sessions for deeper relaxation', 'Try breathing exercises before meditation'],
              recommendations: ['Schedule morning sessions consistently', 'Track mood patterns over time']
            }
          },
          {
            id: 'session-2',
            sessionType: 'emotional_support',
            title: 'Emotional Processing Session',
            description: 'Working through recent challenges and emotions',
            durationMinutes: 45,
            sessionDate: '2024-01-12T14:00:00Z',
            effectivenessScore: 7,
            emotionalStateBefore: { mood: 'overwhelmed', stress: 8, energy: 3 },
            emotionalStateAfter: { mood: 'hopeful', stress: 5, energy: 6 },
            aiAnalysis: {
              keyInsights: ['Emotional processing was effective', 'Identified key stress triggers'],
              improvements: ['Focus on specific coping strategies', 'Practice emotional regulation techniques'],
              recommendations: ['Schedule follow-up session in 3 days', 'Implement identified coping strategies']
            }
          }
        ],
        healthMetrics: {
          sleepQuality: 7.5,
          exerciseFrequency: 3,
          nutritionScore: 8.2,
          hydrationLevel: 6.8
        },
        aiInsights: {
          strengths: ['Consistent mindfulness practice', 'Good sleep hygiene', 'Positive attitude'],
          areasForImprovement: ['Stress management during work hours', 'Exercise consistency', 'Nutrition planning'],
          recommendations: ['Try progressive muscle relaxation', 'Schedule exercise at consistent times', 'Meal prep on weekends'],
          moodPatterns: ['Mornings are most productive', 'Stress peaks mid-week', 'Weekends show better mood stability']
        }
      }
      
      setHealthProfile(mockHealthProfile)
    } catch (error) {
      console.error('Error loading health profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      'calm': '😌',
      'anxious': '😰',
      'overwhelmed': '😵',
      'hopeful': '😊',
      'energetic': '⚡',
      'tired': '😴'
    }
    return moodMap[mood] || '😐'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'therapy', label: 'Therapy Sessions', icon: Brain },
    { id: 'goals', label: 'Wellness Goals', icon: Target },
    { id: 'metrics', label: 'Health Metrics', icon: Activity },
    { id: 'insights', label: 'AI Insights', icon: TrendingUp }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading health profile...</span>
      </div>
    )
  }

  if (!healthProfile) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Profile Found</h3>
        <p className="text-gray-600 mb-4">Create your OmniMind Health profile to get started.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Health Profile
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              OmniMind Health
            </h1>
            <p className="text-gray-600 mt-2">Personalized health & emotional therapy tutor</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </button>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mental Health</h3>
            <Brain className="w-6 h-6 text-purple-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(healthProfile.mentalHealthScore)}`}>
            {healthProfile.mentalHealthScore}%
          </div>
          <div className={`text-sm ${getScoreColor(healthProfile.mentalHealthScore)}`}>
            {healthProfile.mentalHealthScore >= 80 ? 'Excellent' : healthProfile.mentalHealthScore >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Physical Health</h3>
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(healthProfile.physicalHealthScore)}`}>
            {healthProfile.physicalHealthScore}%
          </div>
          <div className={`text-sm ${getScoreColor(healthProfile.physicalHealthScore)}`}>
            {healthProfile.physicalHealthScore >= 80 ? 'Excellent' : healthProfile.physicalHealthScore >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Emotional Wellness</h3>
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(healthProfile.emotionalWellnessScore)}`}>
            {healthProfile.emotionalWellnessScore}%
          </div>
          <div className={`text-sm ${getScoreColor(healthProfile.emotionalWellnessScore)}`}>
            {healthProfile.emotionalWellnessScore >= 80 ? 'Excellent' : healthProfile.emotionalWellnessScore >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Health</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(healthProfile.overallHealthScore)}`}>
            {healthProfile.overallHealthScore}%
          </div>
          <div className={`text-sm ${getScoreColor(healthProfile.overallHealthScore)}`}>
            {healthProfile.overallHealthScore >= 80 ? 'Excellent' : healthProfile.overallHealthScore >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </div>
      </div>

      {/* Current Emotional State */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-6 h-6 text-purple-500 mr-2" />
          Current Emotional State
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{getMoodEmoji(healthProfile.emotionalState.currentMood)}</div>
            <div className="text-sm text-gray-600">Mood</div>
            <div className="font-semibold capitalize">{healthProfile.emotionalState.currentMood}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{healthProfile.emotionalState.stressLevel}/10</div>
            <div className="text-sm text-gray-600">Stress Level</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${(healthProfile.emotionalState.stressLevel / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{healthProfile.emotionalState.anxietyLevel}/10</div>
            <div className="text-sm text-gray-600">Anxiety Level</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(healthProfile.emotionalState.anxietyLevel / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{healthProfile.emotionalState.energyLevel}/10</div>
            <div className="text-sm text-gray-600">Energy Level</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(healthProfile.emotionalState.energyLevel / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Therapy Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Therapy Sessions</h3>
            <div className="space-y-4">
              {healthProfile.therapySessions.slice(0, 3).map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <span className="text-sm text-gray-500">{new Date(session.sessionDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.durationMinutes} min
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {session.effectivenessScore}/10
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Wellness Goals */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Wellness Goals</h3>
            <div className="space-y-4">
              {healthProfile.wellnessGoals.filter(goal => goal.status === 'active').map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-gray-500">{goal.progressPercentage}%</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${goal.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'therapy' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Therapy Sessions</h3>
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthProfile.therapySessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{session.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {session.sessionType}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span>{session.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Effectiveness:</span>
                    <span className="font-semibold">{session.effectivenessScore}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Wellness Goals</h3>
            <button
              onClick={() => setShowNewGoalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthProfile.wellnessGoals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    goal.status === 'active' ? 'bg-green-100 text-green-800' :
                    goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{goal.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${goal.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span>{goal.currentValue} {goal.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span>{goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Date:</span>
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Health Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Sleep Quality</h4>
                <Moon className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {healthProfile.healthMetrics.sleepQuality}/10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full" 
                  style={{ width: `${(healthProfile.healthMetrics.sleepQuality / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Exercise Frequency</h4>
                <Dumbbell className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {healthProfile.healthMetrics.exerciseFrequency}/week
              </div>
              <div className="text-sm text-gray-600">Target: 3-5 sessions per week</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Nutrition Score</h4>
                <Utensils className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {healthProfile.healthMetrics.nutritionScore}/10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${(healthProfile.healthMetrics.nutritionScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Hydration Level</h4>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {healthProfile.healthMetrics.hydrationLevel}/10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(healthProfile.healthMetrics.hydrationLevel / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {healthProfile.aiInsights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {healthProfile.aiInsights.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {healthProfile.aiInsights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <Zap className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                Mood Patterns
              </h4>
              <ul className="space-y-2">
                {healthProfile.aiInsights.moodPatterns.map((pattern, index) => (
                  <li key={index} className="flex items-start">
                    <TrendingUp className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedSession.title}</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Session Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{selectedSession.sessionType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{selectedSession.durationMinutes} minutes</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedSession.sessionDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Effectiveness:</span>
                      <span className="ml-2 font-medium">{selectedSession.effectivenessScore}/10</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedSession.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emotional State Changes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Before Session</h5>
                      <div className="space-y-1 text-sm">
                        <div>Mood: {selectedSession.emotionalStateBefore.mood}</div>
                        <div>Stress: {selectedSession.emotionalStateBefore.stress}/10</div>
                        <div>Energy: {selectedSession.emotionalStateBefore.energy}/10</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">After Session</h5>
                      <div className="space-y-1 text-sm">
                        <div>Mood: {selectedSession.emotionalStateAfter.mood}</div>
                        <div>Stress: {selectedSession.emotionalStateAfter.stress}/10</div>
                        <div>Energy: {selectedSession.emotionalStateAfter.energy}/10</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Key Insights</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiAnalysis.keyInsights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedSession.aiAnalysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <Zap className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}