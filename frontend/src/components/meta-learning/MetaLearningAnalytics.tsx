'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Target, Brain, RefreshCw, Download, Filter, Calendar } from 'lucide-react'

interface AnalyticsData {
  totalInsights: number
  activeExperiments: number
  globalImprovement: number
  federatedParticipants: number
  teachingStrategies: number
  curriculumUpdates: number
  performanceTrends: Array<{
    date: string
    improvement: number
    insights: number
    experiments: number
  }>
  topInsights: Array<{
    id: string
    finding: string
    impact: number
    confidence: number
  }>
  experimentResults: Array<{
    name: string
    successRate: number
    participants: number
    duration: number
  }>
  userEngagement: Array<{
    segment: string
    engagement: number
    improvement: number
  }>
}

export default function MetaLearningAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'experiments' | 'performance' | 'engagement'>('overview')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: AnalyticsData = {
        totalInsights: 156,
        activeExperiments: 12,
        globalImprovement: 23.5,
        federatedParticipants: 12500,
        teachingStrategies: 47,
        curriculumUpdates: 89,
        performanceTrends: [
          { date: '2024-01-01', improvement: 18.2, insights: 12, experiments: 3 },
          { date: '2024-01-02', improvement: 19.1, insights: 15, experiments: 4 },
          { date: '2024-01-03', improvement: 20.3, insights: 18, experiments: 5 },
          { date: '2024-01-04', improvement: 21.7, insights: 22, experiments: 6 },
          { date: '2024-01-05', improvement: 22.1, insights: 25, experiments: 7 },
          { date: '2024-01-06', improvement: 22.8, insights: 28, experiments: 8 },
          { date: '2024-01-07', improvement: 23.2, insights: 31, experiments: 9 },
          { date: '2024-01-08', improvement: 23.5, insights: 34, experiments: 10 },
          { date: '2024-01-09', improvement: 23.8, insights: 37, experiments: 11 },
          { date: '2024-01-10', improvement: 24.1, insights: 40, experiments: 12 },
          { date: '2024-01-11', improvement: 24.3, insights: 43, experiments: 13 },
          { date: '2024-01-12', improvement: 24.6, insights: 46, experiments: 14 },
          { date: '2024-01-13', improvement: 24.8, insights: 49, experiments: 15 },
          { date: '2024-01-14', improvement: 25.1, insights: 52, experiments: 16 },
          { date: '2024-01-15', improvement: 25.3, insights: 55, experiments: 17 }
        ],
        topInsights: [
          {
            id: '1',
            finding: 'Visual learners perform 23% better with diagram-based explanations',
            impact: 0.89,
            confidence: 0.92
          },
          {
            id: '2',
            finding: 'Micro-learning sessions improve completion rates by 34%',
            impact: 0.85,
            confidence: 0.88
          },
          {
            id: '3',
            finding: 'Immediate feedback reduces anxiety by 31% in anxious learners',
            impact: 0.82,
            confidence: 0.91
          },
          {
            id: '4',
            finding: 'Socratic questioning increases critical thinking by 27%',
            impact: 0.78,
            confidence: 0.85
          },
          {
            id: '5',
            finding: 'Peer learning improves retention by 22% in collaborative subjects',
            impact: 0.75,
            confidence: 0.87
          }
        ],
        experimentResults: [
          {
            name: 'Visual vs Text Explanations',
            successRate: 0.89,
            participants: 2500,
            duration: 14
          },
          {
            name: 'Adaptive Difficulty Timing',
            successRate: 0.82,
            participants: 1800,
            duration: 21
          },
          {
            name: 'Peer Learning Effectiveness',
            successRate: 0.85,
            participants: 3200,
            duration: 28
          },
          {
            name: 'Gamification Impact',
            successRate: 0.78,
            participants: 1500,
            duration: 10
          },
          {
            name: 'Feedback Frequency Study',
            successRate: 0.91,
            participants: 2100,
            duration: 18
          }
        ],
        userEngagement: [
          {
            segment: 'Visual Learners',
            engagement: 0.89,
            improvement: 0.23
          },
          {
            segment: 'Auditory Learners',
            engagement: 0.76,
            improvement: 0.18
          },
          {
            segment: 'Kinesthetic Learners',
            engagement: 0.82,
            improvement: 0.21
          },
          {
            segment: 'Mixed Learning Styles',
            engagement: 0.85,
            improvement: 0.19
          },
          {
            segment: 'High Anxiety Students',
            engagement: 0.71,
            improvement: 0.31
          },
          {
            segment: 'Advanced Learners',
            engagement: 0.93,
            improvement: 0.27
          }
        ]
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `meta-learning-analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading analytics data...</p>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meta-Learning Analytics</h2>
            <p className="text-gray-600">
              Comprehensive analytics on how our AI is continuously improving its teaching capabilities.
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
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={loadAnalyticsData}
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
              { id: 'insights', label: 'Insights Analytics', icon: Brain },
              { id: 'experiments', label: 'Experiment Results', icon: Target },
              { id: 'performance', label: 'Performance Trends', icon: TrendingUp },
              { id: 'engagement', label: 'User Engagement', icon: Users }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analyticsData.totalInsights}</div>
              <div className="text-sm text-gray-600">Total Insights Generated</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.activeExperiments}</div>
              <div className="text-sm text-gray-600">Active Experiments</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.globalImprovement}%</div>
              <div className="text-sm text-gray-600">Global Improvement</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analyticsData.federatedParticipants.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Federated Participants</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{analyticsData.teachingStrategies}</div>
              <div className="text-sm text-gray-600">Teaching Strategies</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{analyticsData.curriculumUpdates}</div>
              <div className="text-sm text-gray-600">Curriculum Updates</div>
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Performance trend chart would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Insights by Impact</h3>
            <div className="space-y-4">
              {analyticsData.topInsights.map((insight, index) => (
                <div key={insight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{insight.finding}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Impact: {Math.round(insight.impact * 100)}%</span>
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(insight.impact * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Impact Score</div>
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
            <h3 className="text-lg font-semibold mb-4">Experiment Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (days)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analyticsData.experimentResults.map((experiment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {experiment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${experiment.successRate * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">
                            {Math.round(experiment.successRate * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experiment.participants.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experiment.duration} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Performance trend chart would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Key Performance Indicators</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Improvement Rate</span>
                  <span className="text-sm font-semibold text-green-600">+2.1% per day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Insight Generation Rate</span>
                  <span className="text-sm font-semibold text-blue-600">3.7 per day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Experiment Success Rate</span>
                  <span className="text-sm font-semibold text-purple-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model Convergence Time</span>
                  <span className="text-sm font-semibold text-orange-600">2.3 days</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Recent Performance Data</h4>
              <div className="space-y-2">
                {analyticsData.performanceTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{trend.date}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-semibold">+{trend.improvement.toFixed(1)}%</span>
                      <span className="text-blue-600">{trend.insights} insights</span>
                      <span className="text-purple-600">{trend.experiments} experiments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Engagement by Segment</h3>
            <div className="space-y-4">
              {analyticsData.userEngagement.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                      {Math.round(segment.engagement * 100)}%
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{segment.segment}</p>
                      <p className="text-sm text-gray-500">
                        Engagement: {Math.round(segment.engagement * 100)}% • 
                        Improvement: +{Math.round(segment.improvement * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      +{Math.round(segment.improvement * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Improvement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Engagement Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Engagement</span>
                  <span className="text-sm font-semibold text-blue-600">82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Highest Engagement</span>
                  <span className="text-sm font-semibold text-green-600">93% (Advanced Learners)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lowest Engagement</span>
                  <span className="text-sm font-semibold text-yellow-600">71% (High Anxiety Students)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Growth</span>
                  <span className="text-sm font-semibold text-purple-600">+15% this month</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Improvement by Segment</h4>
              <div className="space-y-3">
                {analyticsData.userEngagement
                  .sort((a, b) => b.improvement - a.improvement)
                  .slice(0, 4)
                  .map((segment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{segment.segment}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${segment.improvement * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          +{Math.round(segment.improvement * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}