'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Eye, Hand, Globe, RefreshCw, Download, Filter, Calendar, Target, Brain, Zap } from 'lucide-react'

interface NeuroVerseAnalytics {
  totalEnvironments: number
  activeSessions: number
  totalUsers: number
  experimentsCompleted: number
  companionAvatars: number
  averageSessionTime: number
  vrSessions: number
  arSessions: number
  webSessions: number
  performanceTrends: Array<{
    date: string
    sessions: number
    users: number
    experiments: number
    satisfaction: number
  }>
  environmentPopularity: Array<{
    environmentName: string
    visits: number
    averageTime: number
    satisfaction: number
  }>
  companionEffectiveness: Array<{
    companionName: string
    personalityType: string
    effectivenessScore: number
    userSatisfaction: number
    interactions: number
  }>
  experimentSuccess: Array<{
    experimentName: string
    subjectArea: string
    successRate: number
    averageTime: number
    difficultyLevel: string
  }>
  deviceUsage: Array<{
    deviceType: string
    usageCount: number
    averagePerformance: number
    comfortScore: number
  }>
}

export default function NeuroVerseAnalytics() {
  const [analytics, setAnalytics] = useState<NeuroVerseAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'environments' | 'companions' | 'experiments' | 'devices'>('overview')

  useEffect(() => {
    loadNeuroVerseAnalytics()
  }, [timeRange])

  const loadNeuroVerseAnalytics = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAnalytics: NeuroVerseAnalytics = {
        totalEnvironments: 25,
        activeSessions: 156,
        totalUsers: 12500,
        experimentsCompleted: 2340,
        companionAvatars: 8900,
        averageSessionTime: 45,
        vrSessions: 1200,
        arSessions: 800,
        webSessions: 340,
        performanceTrends: [
          { date: '2024-01-01', sessions: 45, users: 32, experiments: 12, satisfaction: 4.2 },
          { date: '2024-01-02', sessions: 52, users: 38, experiments: 15, satisfaction: 4.3 },
          { date: '2024-01-03', sessions: 48, users: 35, experiments: 13, satisfaction: 4.1 },
          { date: '2024-01-04', sessions: 61, users: 42, experiments: 18, satisfaction: 4.4 },
          { date: '2024-01-05', sessions: 58, users: 40, experiments: 16, satisfaction: 4.3 },
          { date: '2024-01-06', sessions: 67, users: 45, experiments: 20, satisfaction: 4.5 },
          { date: '2024-01-07', sessions: 72, users: 48, experiments: 22, satisfaction: 4.4 },
          { date: '2024-01-08', sessions: 69, users: 46, experiments: 21, satisfaction: 4.6 },
          { date: '2024-01-09', sessions: 75, users: 50, experiments: 24, satisfaction: 4.5 },
          { date: '2024-01-10', sessions: 82, users: 55, experiments: 26, satisfaction: 4.7 },
          { date: '2024-01-11', sessions: 78, users: 52, experiments: 25, satisfaction: 4.6 },
          { date: '2024-01-12', sessions: 85, users: 58, experiments: 28, satisfaction: 4.8 },
          { date: '2024-01-13', sessions: 91, users: 62, experiments: 30, satisfaction: 4.7 },
          { date: '2024-01-14', sessions: 88, users: 60, experiments: 29, satisfaction: 4.9 },
          { date: '2024-01-15', sessions: 95, users: 65, experiments: 32, satisfaction: 4.8 }
        ],
        environmentPopularity: [
          { environmentName: 'Physics Lab - Space Station', visits: 1250, averageTime: 45, satisfaction: 4.8 },
          { environmentName: 'Chemistry Lab - Molecular World', visits: 980, averageTime: 60, satisfaction: 4.6 },
          { environmentName: 'Biology Lab - Underwater Research', visits: 850, averageTime: 40, satisfaction: 4.7 },
          { environmentName: 'Mathematics Garden - Fractal Universe', visits: 720, averageTime: 35, satisfaction: 4.5 },
          { environmentName: 'Historical Classroom - Ancient Rome', visits: 650, averageTime: 50, satisfaction: 4.4 },
          { environmentName: 'Art Studio - Renaissance Workshop', visits: 580, averageTime: 55, satisfaction: 4.6 }
        ],
        companionEffectiveness: [
          { companionName: 'Luna', personalityType: 'creative', effectivenessScore: 0.95, userSatisfaction: 4.9, interactions: 1250 },
          { companionName: 'Alex', personalityType: 'encouraging', effectivenessScore: 0.92, userSatisfaction: 4.8, interactions: 1100 },
          { companionName: 'Dr. Quantum', personalityType: 'analytical', effectivenessScore: 0.88, userSatisfaction: 4.6, interactions: 950 },
          { companionName: 'Professor Bio', personalityType: 'patient', effectivenessScore: 0.85, userSatisfaction: 4.5, interactions: 800 },
          { companionName: 'Dr. Element', personalityType: 'supportive', effectivenessScore: 0.82, userSatisfaction: 4.4, interactions: 750 }
        ],
        experimentSuccess: [
          { experimentName: 'Gravity Simulation', subjectArea: 'physics', successRate: 0.92, averageTime: 35, difficultyLevel: 'beginner' },
          { experimentName: 'Molecular Bonding', subjectArea: 'chemistry', successRate: 0.88, averageTime: 60, difficultyLevel: 'intermediate' },
          { experimentName: 'Cell Division', subjectArea: 'biology', successRate: 0.85, averageTime: 40, difficultyLevel: 'intermediate' },
          { experimentName: 'Fractal Geometry', subjectArea: 'mathematics', successRate: 0.78, averageTime: 45, difficultyLevel: 'advanced' },
          { experimentName: 'Chemical Reactions', subjectArea: 'chemistry', successRate: 0.90, averageTime: 50, difficultyLevel: 'beginner' }
        ],
        deviceUsage: [
          { deviceType: 'Oculus Quest', usageCount: 450, averagePerformance: 0.92, comfortScore: 0.88 },
          { deviceType: 'HTC Vive', usageCount: 320, averagePerformance: 0.89, comfortScore: 0.85 },
          { deviceType: 'HoloLens', usageCount: 180, averagePerformance: 0.85, comfortScore: 0.90 },
          { deviceType: 'Desktop Web', usageCount: 340, averagePerformance: 0.95, comfortScore: 0.95 },
          { deviceType: 'Mobile AR', usageCount: 150, averagePerformance: 0.78, comfortScore: 0.82 }
        ]
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Failed to load NeuroVerse analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportAnalytics = () => {
    if (!analytics) return
    
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `neuroverse-analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading NeuroVerse analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">Failed to load analytics data</div>
        <button
          onClick={loadNeuroVerseAnalytics}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">NeuroVerse Analytics</h2>
            <p className="text-gray-600">
              Comprehensive analytics on immersive learning experiences and user engagement.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <button
              onClick={exportAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={loadNeuroVerseAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'environments', label: 'Environments', icon: Globe },
              { id: 'companions', label: 'Companions', icon: Brain },
              { id: 'experiments', label: 'Experiments', icon: Target },
              { id: 'devices', label: 'Devices', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.totalEnvironments}</div>
              <div className="text-sm text-gray-600">Virtual Environments</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.activeSessions}</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.experimentsCompleted.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Experiments Completed</div>
            </div>
          </div>

          {/* Session Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Session Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">VR Sessions</span>
                  </div>
                  <span className="font-semibold">{analytics.vrSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">AR Sessions</span>
                  </div>
                  <span className="font-semibold">{analytics.arSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Web Sessions</span>
                  </div>
                  <span className="font-semibold">{analytics.webSessions}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Trend chart would be displayed here</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">High Engagement</div>
                  <div className="text-green-700">Average session time increased by 23% this month</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">VR Popularity</div>
                  <div className="text-blue-700">VR sessions account for 60% of total usage</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">User Satisfaction</div>
                  <div className="text-purple-700">Average satisfaction score: 4.7/5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'environments' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Environment Popularity</h3>
            <div className="space-y-4">
              {analytics.environmentPopularity.map((env, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{env.environmentName}</div>
                      <div className="text-sm text-gray-500">
                        {env.visits} visits • {env.averageTime} min avg
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {env.satisfaction.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Satisfaction</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'companions' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Companion Effectiveness</h3>
            <div className="space-y-4">
              {analytics.companionEffectiveness.map((companion, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{companion.companionName}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {companion.personalityType} • {companion.interactions} interactions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(companion.effectivenessScore * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Effectiveness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {companion.userSatisfaction.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'experiments' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Experiment Success Rates</h3>
            <div className="space-y-4">
              {analytics.experimentSuccess.map((experiment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{experiment.experimentName}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {experiment.subjectArea} • {experiment.difficultyLevel} • {experiment.averageTime} min
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(experiment.successRate * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Device Usage & Performance</h3>
            <div className="space-y-4">
              {analytics.deviceUsage.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{device.deviceType}</div>
                      <div className="text-sm text-gray-500">
                        {device.usageCount} sessions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(device.averagePerformance * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(device.comfortScore * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Comfort</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}