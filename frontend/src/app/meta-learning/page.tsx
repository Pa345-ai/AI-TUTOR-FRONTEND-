'use client'

import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, BookOpen, Network, BarChart3, Lightbulb, Target, Users, Zap, RefreshCw } from 'lucide-react'
import TeachingOptimizationEngine from '@/components/meta-learning/TeachingOptimizationEngine'
import SelfImprovingCurriculum from '@/components/meta-learning/SelfImprovingCurriculum'
import FederatedLearningNetwork from '@/components/meta-learning/FederatedLearningNetwork'
import MetaLearningInsights from '@/components/meta-learning/MetaLearningInsights'
import MetaLearningAnalytics from '@/components/meta-learning/MetaLearningAnalytics'

interface MetaLearningStats {
  totalStrategies: number
  activeExperiments: number
  globalImprovement: number
  federatedParticipants: number
  insightsGenerated: number
  curriculumUpdates: number
}

export default function MetaLearningPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'teaching' | 'curriculum' | 'federated' | 'insights' | 'analytics'>('overview')
  const [stats, setStats] = useState<MetaLearningStats>({
    totalStrategies: 0,
    activeExperiments: 0,
    globalImprovement: 0,
    federatedParticipants: 0,
    insightsGenerated: 0,
    curriculumUpdates: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMetaLearningStats()
  }, [])

  const loadMetaLearningStats = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalStrategies: 47,
        activeExperiments: 12,
        globalImprovement: 23.5,
        federatedParticipants: 12500,
        insightsGenerated: 156,
        curriculumUpdates: 89
      })
    } catch (error) {
      console.error('Failed to load meta-learning stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'teaching', label: 'Teaching Engine', icon: Target },
    { id: 'curriculum', label: 'Curriculum AI', icon: BookOpen },
    { id: 'federated', label: 'Federated Learning', icon: Network },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'teaching':
        return <TeachingOptimizationEngine />
      case 'curriculum':
        return <SelfImprovingCurriculum />
      case 'federated':
        return <FederatedLearningNetwork />
      case 'insights':
        return <MetaLearningInsights />
      case 'analytics':
        return <MetaLearningAnalytics />
      default:
        return <OverviewTab stats={stats} isLoading={isLoading} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meta-Learning Core</h1>
              <p className="text-gray-600">AI that learns how to teach itself</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900">Self-Improving AI Tutor</h2>
            </div>
            <p className="text-purple-700">
              Our AI continuously analyzes millions of learning interactions to discover the most effective 
              teaching methods for each student, creating a truly personalized and adaptive learning experience.
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

function OverviewTab({ stats, isLoading }: { stats: MetaLearningStats, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading meta-learning data...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Teaching Strategies',
      value: stats.totalStrategies,
      icon: Target,
      color: 'blue',
      description: 'Optimized teaching methods'
    },
    {
      title: 'Active Experiments',
      value: stats.activeExperiments,
      icon: Lightbulb,
      color: 'green',
      description: 'A/B tests running'
    },
    {
      title: 'Global Improvement',
      value: `${stats.globalImprovement}%`,
      icon: TrendingUp,
      color: 'purple',
      description: 'Average learning improvement'
    },
    {
      title: 'Federated Participants',
      value: stats.federatedParticipants.toLocaleString(),
      icon: Users,
      color: 'orange',
      description: 'Anonymous contributors'
    },
    {
      title: 'Insights Generated',
      value: stats.insightsGenerated,
      icon: Brain,
      color: 'indigo',
      description: 'AI discoveries this month'
    },
    {
      title: 'Curriculum Updates',
      value: stats.curriculumUpdates,
      icon: BookOpen,
      color: 'pink',
      description: 'Auto-improved lessons'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meta-Learning Overview</h2>
        <p className="text-gray-600">
          Real-time insights into how our AI is continuously improving its teaching capabilities
        </p>
      </div>

      {/* Stats Grid */}
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
                <div className="text-3xl font-bold">{card.value}</div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
              <p className="text-sm opacity-75">{card.description}</p>
            </div>
          )
        })}
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Teaching Optimization Engine</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Analyzes millions of interactions to discover what teaching methods work best for each personality type and culture.
          </p>
          <div className="text-xs text-blue-600">
            • Real-time strategy optimization<br/>
            • Personality-based adaptation<br/>
            • Cultural context awareness
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Self-Improving Curriculum AI</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Continuously updates lessons based on global performance data, creating a living textbook that evolves.
          </p>
          <div className="text-xs text-green-600">
            • Dynamic curriculum adaptation<br/>
            • Performance-based optimization<br/>
            • Living textbook concept
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Network className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Federated Learning Network</h3>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            Each user's AI learns locally and anonymously improves the global model, so your data grows in value exponentially.
          </p>
          <div className="text-xs text-purple-600">
            • Privacy-preserving learning<br/>
            • Global model improvement<br/>
            • Exponential data value growth
          </div>
        </div>
      </div>
    </div>
  )
}