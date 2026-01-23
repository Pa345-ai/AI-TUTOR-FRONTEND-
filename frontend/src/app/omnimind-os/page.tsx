'use client'

import React, { useState, useEffect } from 'react'
import { Cpu, Plug, Cloud, Code, BarChart3, Settings, RefreshCw, Plus, Globe, Users, Zap, Brain } from 'lucide-react'
import AIPluginEcosystem from '@/components/omnimind/AIPluginEcosystem'
import OpenAPIHub from '@/components/omnimind/OpenAPIHub'
import NeuroCloudWorkspace from '@/components/omnimind/NeuroCloudWorkspace'
import DeveloperTools from '@/components/omnimind/DeveloperTools'
import OmniMindAnalytics from '@/components/omnimind/OmniMindAnalytics'

interface OmniMindStats {
  totalPlugins: number
  activeIntegrations: number
  aiWorkspaces: number
  developerCount: number
  apiCallsToday: number
  revenueThisMonth: number
  platformGrowth: number
  ecosystemHealth: number
}

export default function OmniMindOSPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plugins' | 'api_hub' | 'neurocloud' | 'developer_tools' | 'analytics'>('overview')
  const [stats, setStats] = useState<OmniMindStats>({
    totalPlugins: 0,
    activeIntegrations: 0,
    aiWorkspaces: 0,
    developerCount: 0,
    apiCallsToday: 0,
    revenueThisMonth: 0,
    platformGrowth: 0,
    ecosystemHealth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOmniMindStats()
  }, [])

  const loadOmniMindStats = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalPlugins: 1247,
        activeIntegrations: 89,
        aiWorkspaces: 156,
        developerCount: 2340,
        apiCallsToday: 125000,
        revenueThisMonth: 45000,
        platformGrowth: 23.5,
        ecosystemHealth: 94.2
      })
    } catch (error) {
      console.error('Failed to load OmniMind stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'plugins', label: 'Plugin Ecosystem', icon: Plug },
    { id: 'api_hub', label: 'Open API Hub', icon: Globe },
    { id: 'neurocloud', label: 'NeuroCloud Workspace', icon: Cloud },
    { id: 'developer_tools', label: 'Developer Tools', icon: Code },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plugins':
        return <AIPluginEcosystem />
      case 'api_hub':
        return <OpenAPIHub />
      case 'neurocloud':
        return <NeuroCloudWorkspace />
      case 'developer_tools':
        return <DeveloperTools />
      case 'analytics':
        return <OmniMindAnalytics />
      default:
        return <OverviewTab stats={stats} isLoading={isLoading} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">OmniMind OS</h1>
              <p className="text-gray-600">AI Ecosystem Infrastructure - Transform from product → platform</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-indigo-900">Platform Transformation</h2>
            </div>
            <p className="text-indigo-700">
              OmniMind OS transforms our AI tutoring platform into a comprehensive ecosystem where developers, 
              institutions, and third-party platforms can build, integrate, and scale AI-powered learning solutions.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ stats, isLoading }: { stats: OmniMindStats, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-gray-600">Loading OmniMind OS data...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'AI Plugins',
      value: stats.totalPlugins.toLocaleString(),
      icon: Plug,
      color: 'blue',
      description: 'Learning modules in ecosystem',
      growth: '+12% this month'
    },
    {
      title: 'Active Integrations',
      value: stats.activeIntegrations,
      icon: Globe,
      color: 'green',
      description: 'Third-party platforms connected',
      growth: '+5 new this week'
    },
    {
      title: 'AI Workspaces',
      value: stats.aiWorkspaces,
      icon: Cloud,
      color: 'purple',
      description: 'Institutional AI environments',
      growth: '+8% this month'
    },
    {
      title: 'Developers',
      value: stats.developerCount.toLocaleString(),
      icon: Users,
      color: 'orange',
      description: 'Active developers building',
      growth: '+15% this month'
    },
    {
      title: 'API Calls Today',
      value: stats.apiCallsToday.toLocaleString(),
      icon: Zap,
      color: 'indigo',
      description: 'Platform API usage',
      growth: '+23% vs yesterday'
    },
    {
      title: 'Revenue This Month',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: BarChart3,
      color: 'pink',
      description: 'Ecosystem revenue',
      growth: '+18% vs last month'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">OmniMind OS Overview</h2>
        <p className="text-gray-600">
          Comprehensive AI ecosystem infrastructure powering the future of education technology.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            green: 'bg-green-50 text-green-600 border-green-200',
            purple: 'bg-purple-50 text-purple-600 border-purple-200',
            orange: 'bg-orange-50 text-orange-600 border-orange-200',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
            pink: 'bg-pink-50 text-pink-600 border-pink-200'
          }
          
          return (
            <div key={index} className={`p-6 rounded-lg border ${colorClasses[card.color as keyof typeof colorClasses]}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="text-sm opacity-75">{card.growth}</div>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
              <p className="text-sm opacity-75">{card.description}</p>
            </div>
          )
        })}
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-green-900">Ecosystem Health</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.ecosystemHealth}%</div>
          <p className="text-green-700 text-sm mb-4">
            Overall platform health based on uptime, performance, and user satisfaction.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>API Uptime</span>
              <span className="font-semibold">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Plugin Success Rate</span>
              <span className="font-semibold">96.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Developer Satisfaction</span>
              <span className="font-semibold">4.8/5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-blue-900">Platform Growth</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">+{stats.platformGrowth}%</div>
          <p className="text-blue-700 text-sm mb-4">
            Month-over-month growth in platform adoption and usage.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>New Developers</span>
              <span className="font-semibold">+{Math.round(stats.developerCount * 0.15)}</span>
            </div>
            <div className="flex justify-between">
              <span>Plugin Downloads</span>
              <span className="font-semibold">+{Math.round(stats.totalPlugins * 0.12)}</span>
            </div>
            <div className="flex justify-between">
              <span>API Usage</span>
              <span className="font-semibold">+{Math.round(stats.apiCallsToday * 0.23)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Plug className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">AI Plugin Ecosystem</h3>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            Let developers build their own learning modules powered by OmniMind. 
            Complete SDK and marketplace for AI-powered educational tools.
          </p>
          <div className="text-xs text-purple-600">
            • SDK for Python, JavaScript, Java, C#<br/>
            • Plugin marketplace with 1,247+ modules<br/>
            • Revenue sharing for developers<br/>
            • Real-time plugin analytics
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Open API Hub</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Other ed-tech, HR, or corporate learning platforms can integrate your intelligence core. 
            Seamless API integration with 89+ active platforms.
          </p>
          <div className="text-xs text-green-600">
            • RESTful APIs with comprehensive documentation<br/>
            • Webhook support for real-time updates<br/>
            • OAuth2 and API key authentication<br/>
            • Rate limiting and usage analytics
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">NeuroCloud AI Workspace</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            A cloud environment where institutions can train their own tutors on private data. 
            Secure, scalable AI training infrastructure.
          </p>
          <div className="text-xs text-blue-600">
            • Private data training environments<br/>
            • Custom AI model development<br/>
            • 156+ active institutional workspaces<br/>
            • Enterprise-grade security and compliance
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <Code className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Start Building Plugin</div>
              <div className="text-sm text-gray-500">Download SDK and begin development</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
            <Globe className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Integrate Platform</div>
              <div className="text-sm text-gray-500">Connect your platform via API</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            <Cloud className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Create AI Workspace</div>
              <div className="text-sm text-gray-500">Set up private AI training environment</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}