'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Network, TrendingUp, Play, BarChart3, Settings, RefreshCw, Plus, Zap, Target, Eye, Lightbulb } from 'lucide-react'
import PersonalCognitiveTwin from '@/components/cognitive-twin/PersonalCognitiveTwin'
import PredictiveLearningEngine from '@/components/cognitive-twin/PredictiveLearningEngine'
import MemoryReplayTool from '@/components/cognitive-twin/MemoryReplayTool'

interface CognitiveTwinStats {
  totalTwins: number
  activePredictions: number
  replaySessions: number
  knowledgeNodes: number
  cognitiveHealth: number
  learningEfficiency: number
  memoryRetention: number
  problemSolving: number
}

export default function CognitiveTwinPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'personal_twin' | 'predictive_engine' | 'memory_replay'>('overview')
  const [stats, setStats] = useState<CognitiveTwinStats>({
    totalTwins: 0,
    activePredictions: 0,
    replaySessions: 0,
    knowledgeNodes: 0,
    cognitiveHealth: 0,
    learningEfficiency: 0,
    memoryRetention: 0,
    problemSolving: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCognitiveTwinStats()
  }, [])

  const loadCognitiveTwinStats = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalTwins: 3,
        activePredictions: 12,
        replaySessions: 47,
        knowledgeNodes: 156,
        cognitiveHealth: 94.2,
        learningEfficiency: 89.1,
        memoryRetention: 92.3,
        problemSolving: 85.7
      })
    } catch (error) {
      console.error('Failed to load cognitive twin stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'personal_twin', label: 'Personal Cognitive Twin', icon: Brain },
    { id: 'predictive_engine', label: 'Predictive Learning Engine', icon: TrendingUp },
    { id: 'memory_replay', label: 'Memory Replay Tool', icon: Play }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal_twin':
        return <PersonalCognitiveTwin />
      case 'predictive_engine':
        return <PredictiveLearningEngine />
      case 'memory_replay':
        return <MemoryReplayTool />
      default:
        return <OverviewTab stats={stats} isLoading={isLoading} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cognitive Digital Twin System</h1>
              <p className="text-gray-600">Each student gets a "digital brain clone" with AI-powered cognitive mapping</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900">Digital Brain Clone</h2>
            </div>
            <p className="text-purple-700">
              The Cognitive Digital Twin System creates a comprehensive digital representation of each student's learning patterns, 
              knowledge graph, and cognitive abilities. This AI-powered system enables personalized learning optimization, 
              performance prediction, and memory replay capabilities.
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ stats, isLoading }: { stats: CognitiveTwinStats, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading cognitive twin data...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Cognitive Twins',
      value: stats.totalTwins,
      icon: Brain,
      color: 'purple',
      description: 'Digital brain clones created',
      growth: '+1 this month'
    },
    {
      title: 'Active Predictions',
      value: stats.activePredictions,
      icon: TrendingUp,
      color: 'blue',
      description: 'AI performance forecasts',
      growth: '+3 this week'
    },
    {
      title: 'Replay Sessions',
      value: stats.replaySessions,
      icon: Play,
      color: 'green',
      description: 'Learning sessions recorded',
      growth: '+8 this month'
    },
    {
      title: 'Knowledge Nodes',
      value: stats.knowledgeNodes,
      icon: Network,
      color: 'orange',
      description: 'Concepts in knowledge graph',
      growth: '+12 this week'
    }
  ]

  const cognitiveMetrics = [
    {
      title: 'Cognitive Health',
      value: stats.cognitiveHealth,
      icon: Brain,
      color: 'green',
      description: 'Overall cognitive well-being',
      trend: '+2.3%'
    },
    {
      title: 'Learning Efficiency',
      value: stats.learningEfficiency,
      icon: Zap,
      color: 'blue',
      description: 'Speed of knowledge acquisition',
      trend: '+1.8%'
    },
    {
      title: 'Memory Retention',
      value: stats.memoryRetention,
      icon: Target,
      color: 'purple',
      description: 'Information retention rate',
      trend: '+3.1%'
    },
    {
      title: 'Problem Solving',
      value: stats.problemSolving,
      icon: Lightbulb,
      color: 'orange',
      description: 'Analytical thinking ability',
      trend: '+1.5%'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cognitive Digital Twin Overview</h2>
        <p className="text-gray-600">
          Comprehensive AI-powered system that creates digital brain clones for personalized learning optimization.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          const colorClasses = {
            purple: 'bg-purple-50 text-purple-600 border-purple-200',
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            green: 'bg-green-50 text-green-600 border-green-200',
            orange: 'bg-orange-50 text-orange-600 border-orange-200'
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

      {/* Cognitive Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cognitiveMetrics.map((metric, index) => {
          const Icon = metric.icon
          const colorClasses = {
            green: 'bg-green-50 text-green-600 border-green-200',
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            purple: 'bg-purple-50 text-purple-600 border-purple-200',
            orange: 'bg-orange-50 text-orange-600 border-orange-200'
          }
          
          return (
            <div key={index} className={`p-6 rounded-lg border ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{metric.value}%</div>
                  <div className="text-sm opacity-75">{metric.trend}</div>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{metric.title}</h3>
              <p className="text-sm opacity-75">{metric.description}</p>
            </div>
          )
        })}
      </div>

      {/* Core Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Personal Cognitive Twin</h3>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            AI maps each learner's knowledge graph, memory retention, and thinking style. 
            Creates a comprehensive digital representation of cognitive abilities.
          </p>
          <div className="text-xs text-purple-600">
            • Knowledge graph mapping<br/>
            • Cognitive style analysis<br/>
            • Learning preference detection<br/>
            • Performance optimization
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Predictive Learning Engine</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Forecasts how a student will perform months ahead and adjusts learning path accordingly. 
            Uses advanced AI to predict learning outcomes and optimize strategies.
          </p>
          <div className="text-xs text-blue-600">
            • Performance forecasting<br/>
            • Learning path optimization<br/>
            • Difficulty prediction<br/>
            • Engagement analysis
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Play className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Memory Replay Tool</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Students can revisit any past learning session as a timeline of growth. 
            Provides detailed insights into learning patterns and breakthrough moments.
          </p>
          <div className="text-xs text-green-600">
            • Session timeline replay<br/>
            • Learning milestone tracking<br/>
            • Breakthrough moment analysis<br/>
            • Growth visualization
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <Brain className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Create Cognitive Twin</div>
              <div className="text-sm text-gray-500">Set up your digital brain clone</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">View Predictions</div>
              <div className="text-sm text-gray-500">Check performance forecasts</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
            <Play className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Replay Session</div>
              <div className="text-sm text-gray-500">Review past learning sessions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}