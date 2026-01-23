'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Download, RefreshCw, Filter, Calendar, Globe, Zap, Brain, Code, Cloud } from 'lucide-react'

interface OmniMindAnalytics {
  totalPlugins: number
  totalIntegrations: number
  activeWorkspaces: number
  developerCount: number
  apiCallsToday: number
  revenueThisMonth: number
  platformGrowth: number
  ecosystemHealth: number
  pluginStats: {
    totalDownloads: number
    averageRating: number
    activePlugins: number
    newThisMonth: number
  }
  integrationStats: {
    totalConnections: number
    successfulSyncs: number
    errorRate: number
    newThisMonth: number
  }
  workspaceStats: {
    totalModels: number
    trainingJobs: number
    deployedModels: number
    dataProcessed: number
  }
  developerStats: {
    activeDevelopers: number
    newThisMonth: number
    averagePluginsPerDeveloper: number
    topContributors: number
  }
  revenueBreakdown: {
    pluginSales: number
    apiUsage: number
    workspaceSubscriptions: number
    enterpriseLicenses: number
  }
  performanceMetrics: {
    apiUptime: number
    averageResponseTime: number
    errorRate: number
    userSatisfaction: number
  }
  growthTrends: Array<{
    date: string
    plugins: number
    integrations: number
    developers: number
    revenue: number
  }>
}

export default function OmniMindAnalytics() {
  const [analytics, setAnalytics] = useState<OmniMindAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'plugins' | 'integrations' | 'workspaces' | 'developers' | 'revenue'>('overview')

  useEffect(() => {
    loadOmniMindAnalytics()
  }, [timeRange])

  const loadOmniMindAnalytics = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAnalytics: OmniMindAnalytics = {
        totalPlugins: 1247,
        totalIntegrations: 89,
        activeWorkspaces: 156,
        developerCount: 2340,
        apiCallsToday: 125000,
        revenueThisMonth: 45000,
        platformGrowth: 23.5,
        ecosystemHealth: 94.2,
        pluginStats: {
          totalDownloads: 125000,
          averageRating: 4.6,
          activePlugins: 1180,
          newThisMonth: 45
        },
        integrationStats: {
          totalConnections: 89,
          successfulSyncs: 98.5,
          errorRate: 1.5,
          newThisMonth: 8
        },
        workspaceStats: {
          totalModels: 234,
          trainingJobs: 45,
          deployedModels: 189,
          dataProcessed: 1250
        },
        developerStats: {
          activeDevelopers: 1890,
          newThisMonth: 156,
          averagePluginsPerDeveloper: 2.3,
          topContributors: 25
        },
        revenueBreakdown: {
          pluginSales: 18000,
          apiUsage: 12000,
          workspaceSubscriptions: 10000,
          enterpriseLicenses: 5000
        },
        performanceMetrics: {
          apiUptime: 99.9,
          averageResponseTime: 145,
          errorRate: 0.1,
          userSatisfaction: 4.7
        },
        growthTrends: [
          { date: '2024-01-01', plugins: 1200, integrations: 81, developers: 2184, revenue: 38000 },
          { date: '2024-01-02', plugins: 1205, integrations: 82, developers: 2190, revenue: 38500 },
          { date: '2024-01-03', plugins: 1210, integrations: 83, developers: 2195, revenue: 39000 },
          { date: '2024-01-04', plugins: 1215, integrations: 84, developers: 2200, revenue: 39500 },
          { date: '2024-01-05', plugins: 1220, integrations: 85, developers: 2205, revenue: 40000 },
          { date: '2024-01-06', plugins: 1225, integrations: 86, developers: 2210, revenue: 40500 },
          { date: '2024-01-07', plugins: 1230, integrations: 87, developers: 2215, revenue: 41000 },
          { date: '2024-01-08', plugins: 1235, integrations: 88, developers: 2220, revenue: 41500 },
          { date: '2024-01-09', plugins: 1240, integrations: 89, developers: 2225, revenue: 42000 },
          { date: '2024-01-10', plugins: 1245, integrations: 89, developers: 2230, revenue: 42500 },
          { date: '2024-01-11', plugins: 1247, integrations: 89, developers: 2235, revenue: 43000 },
          { date: '2024-01-12', plugins: 1247, integrations: 89, developers: 2240, revenue: 43500 },
          { date: '2024-01-13', plugins: 1247, integrations: 89, developers: 2245, revenue: 44000 },
          { date: '2024-01-14', plugins: 1247, integrations: 89, developers: 2330, revenue: 44500 },
          { date: '2024-01-15', plugins: 1247, integrations: 89, developers: 2340, revenue: 45000 }
        ]
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Failed to load OmniMind analytics:', error)
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
    link.download = `omnimind-analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading OmniMind analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">Failed to load analytics data</div>
        <button
          onClick={loadOmniMindAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OmniMind Analytics</h2>
            <p className="text-gray-600">
              Comprehensive analytics on platform usage, developer engagement, and ecosystem health.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              onClick={loadOmniMindAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
              { id: 'plugins', label: 'Plugins', icon: Code },
              { id: 'integrations', label: 'Integrations', icon: Globe },
              { id: 'workspaces', label: 'Workspaces', icon: Cloud },
              { id: 'developers', label: 'Developers', icon: Users },
              { id: 'revenue', label: 'Revenue', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
              <div className="text-3xl font-bold text-indigo-600 mb-2">{analytics.totalPlugins}</div>
              <div className="text-sm text-gray-600">Total Plugins</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.totalIntegrations}</div>
              <div className="text-sm text-gray-600">Active Integrations</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.activeWorkspaces}</div>
              <div className="text-sm text-gray-600">AI Workspaces</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.developerCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Developers</div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ecosystem Health</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${analytics.ecosystemHealth}%` }}
                      />
                    </div>
                    <span className="font-semibold">{analytics.ecosystemHealth}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Uptime</span>
                  <span className="font-semibold text-green-600">{analytics.performanceMetrics.apiUptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User Satisfaction</span>
                  <span className="font-semibold text-blue-600">{analytics.performanceMetrics.userSatisfaction}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-semibold text-red-600">{analytics.performanceMetrics.errorRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Growth Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Growth</span>
                  <span className="font-semibold text-green-600">+{analytics.platformGrowth}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Calls Today</span>
                  <span className="font-semibold">{analytics.apiCallsToday.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue This Month</span>
                  <span className="font-semibold">${analytics.revenueThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="font-semibold">{analytics.performanceMetrics.averageResponseTime}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Trends Chart Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Growth trend charts would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{analytics.pluginStats.totalDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.pluginStats.averageRating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.pluginStats.activePlugins}</div>
              <div className="text-sm text-gray-600">Active Plugins</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.pluginStats.newThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Plugin Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Mathematics</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-sm font-semibold">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Science</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }} />
                  </div>
                  <span className="text-sm font-semibold">28%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Language</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-semibold">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Technology</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '17%' }} />
                  </div>
                  <span className="text-sm font-semibold">17%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.integrationStats.totalConnections}</div>
              <div className="text-sm text-gray-600">Total Connections</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.integrationStats.successfulSyncs}%</div>
              <div className="text-sm text-gray-600">Successful Syncs</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{analytics.integrationStats.errorRate}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.integrationStats.newThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Integration Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">LMS Platforms</span>
                <span className="text-sm font-semibold">45 connections</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">HR Systems</span>
                <span className="text-sm font-semibold">23 connections</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Corporate Training</span>
                <span className="text-sm font-semibold">15 connections</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">EdTech Platforms</span>
                <span className="text-sm font-semibold">6 connections</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.workspaceStats.totalModels}</div>
              <div className="text-sm text-gray-600">Total Models</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.workspaceStats.trainingJobs}</div>
              <div className="text-sm text-gray-600">Training Jobs</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.workspaceStats.deployedModels}</div>
              <div className="text-sm text-gray-600">Deployed Models</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.workspaceStats.dataProcessed}TB</div>
              <div className="text-sm text-gray-600">Data Processed</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Workspace Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Institutional</span>
                <span className="text-sm font-semibold">89 workspaces</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Departmental</span>
                <span className="text-sm font-semibold">45 workspaces</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Research</span>
                <span className="text-sm font-semibold">22 workspaces</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'developers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.developerStats.activeDevelopers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Developers</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.developerStats.newThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.developerStats.averagePluginsPerDeveloper}</div>
              <div className="text-sm text-gray-600">Avg Plugins/Developer</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.developerStats.topContributors}</div>
              <div className="text-sm text-gray-600">Top Contributors</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Developer Organizations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Startups</span>
                <span className="text-sm font-semibold">1,234 developers</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Educational Institutions</span>
                <span className="text-sm font-semibold">567 developers</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Enterprises</span>
                <span className="text-sm font-semibold">345 developers</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Individual Developers</span>
                <span className="text-sm font-semibold">194 developers</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">${analytics.revenueBreakdown.pluginSales.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Plugin Sales</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">${analytics.revenueBreakdown.apiUsage.toLocaleString()}</div>
              <div className="text-sm text-gray-600">API Usage</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">${analytics.revenueBreakdown.workspaceSubscriptions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Workspace Subscriptions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">${analytics.revenueBreakdown.enterpriseLicenses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Enterprise Licenses</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Plugin Sales</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-sm font-semibold">40%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">API Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '27%' }} />
                  </div>
                  <span className="text-sm font-semibold">27%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Workspace Subscriptions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '22%' }} />
                  </div>
                  <span className="text-sm font-semibold">22%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Enterprise Licenses</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '11%' }} />
                  </div>
                  <span className="text-sm font-semibold">11%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}