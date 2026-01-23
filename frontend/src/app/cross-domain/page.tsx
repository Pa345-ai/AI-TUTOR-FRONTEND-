'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Code, Briefcase, BarChart3, Settings, RefreshCw, Plus, Zap, Target, BookOpen, Lightbulb, TrendingUp, Users, Award, Star, Activity, Brain, Building, Globe } from 'lucide-react'
import OmniMindHealth from '@/components/cross-domain/OmniMindHealth'
import OmniMindCode from '@/components/cross-domain/OmniMindCode'
import OmniMindBusiness from '@/components/cross-domain/OmniMindBusiness'

interface CrossDomainStats {
  totalUsers: number
  healthUsers: number
  codeUsers: number
  businessUsers: number
  averageHealthScore: number
  averageCodeQuality: number
  averageBusinessPerformance: number
  totalSessions: number
  totalModules: number
  totalCoachingSessions: number
  userSatisfaction: number
  platformGrowth: number
}

export default function CrossDomainPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'code' | 'business'>('overview')
  const [stats, setStats] = useState<CrossDomainStats>({
    totalUsers: 0,
    healthUsers: 0,
    codeUsers: 0,
    businessUsers: 0,
    averageHealthScore: 0,
    averageCodeQuality: 0,
    averageBusinessPerformance: 0,
    totalSessions: 0,
    totalModules: 0,
    totalCoachingSessions: 0,
    userSatisfaction: 0,
    platformGrowth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCrossDomainStats()
  }, [])

  const loadCrossDomainStats = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockStats: CrossDomainStats = {
        totalUsers: 15420,
        healthUsers: 8934,
        codeUsers: 6789,
        businessUsers: 4567,
        averageHealthScore: 84.2,
        averageCodeQuality: 87.5,
        averageBusinessPerformance: 82.8,
        totalSessions: 45678,
        totalModules: 234,
        totalCoachingSessions: 12345,
        userSatisfaction: 4.6,
        platformGrowth: 23.4
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading cross-domain stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'health', label: 'OmniMind Health', icon: Heart },
    { id: 'code', label: 'OmniMind Code', icon: Code },
    { id: 'business', label: 'OmniMind Business', icon: Briefcase }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'health':
        return <OmniMindHealth userId="current-user" />
      case 'code':
        return <OmniMindCode userId="current-user" />
      case 'business':
        return <OmniMindBusiness userId="current-user" />
      default:
        return <OverviewTab stats={stats} isLoading={isLoading} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Globe className="w-10 h-10 text-blue-500 mr-4" />
                Cross-Domain OmniMind Applications
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Make OmniMind useful beyond education - Health, Code, and Business domains
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadCrossDomainStats}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
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
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  )
}

function OverviewTab({ stats, isLoading }: { stats: CrossDomainStats, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading cross-domain statistics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Across all domains
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Sessions</h3>
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.totalSessions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Therapy, mentorship & coaching
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Satisfaction</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {stats.userSatisfaction}/5.0
          </div>
          <div className="text-sm text-gray-600">
            Average rating
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            +{stats.platformGrowth}%
          </div>
          <div className="text-sm text-gray-600">
            This quarter
          </div>
        </div>
      </div>

      {/* Domain Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* OmniMind Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              OmniMind Health
            </h3>
            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {stats.healthUsers.toLocaleString()} users
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Personalized health & emotional therapy tutor
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Health Score:</span>
              <span className="font-semibold text-green-600">{stats.averageHealthScore}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Therapy Sessions:</span>
              <span className="font-semibold">{Math.floor(stats.totalSessions * 0.4).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Wellness Goals:</span>
              <span className="font-semibold">{Math.floor(stats.healthUsers * 2.3).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Mental Health</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Emotional Therapy</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Wellness Goals</span>
            </div>
          </div>
        </div>

        {/* OmniMind Code */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Code className="w-6 h-6 text-blue-500 mr-2" />
              OmniMind Code
            </h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {stats.codeUsers.toLocaleString()} users
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            AI coding mentor for developers
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Code Quality:</span>
              <span className="font-semibold text-blue-600">{stats.averageCodeQuality}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mentorship Sessions:</span>
              <span className="font-semibold">{Math.floor(stats.totalSessions * 0.35).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Code Projects:</span>
              <span className="font-semibold">{Math.floor(stats.codeUsers * 1.8).toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Code Review</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Mentorship</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Projects</span>
            </div>
          </div>
        </div>

        {/* OmniMind Business */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-6 h-6 text-green-500 mr-2" />
              OmniMind Business
            </h3>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {stats.businessUsers.toLocaleString()} users
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Corporate AI training + productivity modules
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Performance:</span>
              <span className="font-semibold text-green-600">{stats.averageBusinessPerformance}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coaching Sessions:</span>
              <span className="font-semibold">{Math.floor(stats.totalSessions * 0.25).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Training Modules:</span>
              <span className="font-semibold">{stats.totalModules}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Leadership</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Productivity</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Coaching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity Across Domains</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <Heart className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">New Health Therapy Session</div>
              <div className="text-sm text-gray-600">Sarah completed a 30-minute mindfulness session with 8/10 effectiveness</div>
            </div>
            <div className="text-sm text-gray-500">2 hours ago</div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Code className="w-5 h-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Code Review Session</div>
              <div className="text-sm text-gray-600">Alex received AI feedback on React component optimization</div>
            </div>
            <div className="text-sm text-gray-500">4 hours ago</div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-green-500 mr-3" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Leadership Coaching</div>
              <div className="text-sm text-gray-600">Maria completed advanced leadership strategies training module</div>
            </div>
            <div className="text-sm text-gray-500">6 hours ago</div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <Award className="w-5 h-5 text-purple-500 mr-3" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Achievement Unlocked</div>
              <div className="text-sm text-gray-600">John earned "Data Analytics Master" certification in Business domain</div>
            </div>
            <div className="text-sm text-gray-500">1 day ago</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-gray-900">Schedule Health Session</span>
            </div>
            <p className="text-sm text-gray-600">Book a therapy or wellness session</p>
          </button>

          <button className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <div className="flex items-center mb-2">
              <Code className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-semibold text-gray-900">Start Code Review</span>
            </div>
            <p className="text-sm text-gray-600">Get AI feedback on your code</p>
          </button>

          <button className="p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-900">Begin Training</span>
            </div>
            <p className="text-sm text-gray-600">Start a new business training module</p>
          </button>
        </div>
      </div>
    </div>
  )
}