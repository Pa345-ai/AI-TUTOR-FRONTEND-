'use client'

import React, { useState, useEffect } from 'react'
import { Globe, Users, Zap, Brain, Eye, Hand, Play, Settings, RefreshCw, BarChart3, Target, BookOpen } from 'lucide-react'
import VirtualEnvironments from '@/components/neuroverse/VirtualEnvironments'
import AICompanionAvatars from '@/components/neuroverse/AICompanionAvatars'
import MixedRealityLabs from '@/components/neuroverse/MixedRealityLabs'
import NeuroVerseAnalytics from '@/components/neuroverse/NeuroVerseAnalytics'
import VRARSessions from '@/components/neuroverse/VRARSessions'

interface NeuroVerseStats {
  totalEnvironments: number
  activeSessions: number
  totalUsers: number
  experimentsCompleted: number
  companionAvatars: number
  averageSessionTime: number
}

export default function NeuroVersePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'environments' | 'companions' | 'labs' | 'sessions' | 'analytics'>('overview')
  const [stats, setStats] = useState<NeuroVerseStats>({
    totalEnvironments: 0,
    activeSessions: 0,
    totalUsers: 0,
    experimentsCompleted: 0,
    companionAvatars: 0,
    averageSessionTime: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [vrSupported, setVrSupported] = useState(false)
  const [arSupported, setArSupported] = useState(false)

  useEffect(() => {
    loadNeuroVerseStats()
    checkVRARSupport()
  }, [])

  const loadNeuroVerseStats = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalEnvironments: 25,
        activeSessions: 156,
        totalUsers: 12500,
        experimentsCompleted: 2340,
        companionAvatars: 8900,
        averageSessionTime: 45
      })
    } catch (error) {
      console.error('Failed to load NeuroVerse stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkVRARSupport = () => {
    // Check for VR support
    if ('xr' in navigator && navigator.xr) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then(setVrSupported)
    }
    
    // Check for AR support
    if ('xr' in navigator && navigator.xr) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then(setArSupported)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'environments', label: '3D Environments', icon: Eye },
    { id: 'companions', label: 'AI Companions', icon: Brain },
    { id: 'labs', label: 'Mixed Reality Labs', icon: Hand },
    { id: 'sessions', label: 'VR/AR Sessions', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'environments':
        return <VirtualEnvironments />
      case 'companions':
        return <AICompanionAvatars />
      case 'labs':
        return <MixedRealityLabs />
      case 'sessions':
        return <VRARSessions />
      case 'analytics':
        return <NeuroVerseAnalytics />
      default:
        return <OverviewTab stats={stats} isLoading={isLoading} vrSupported={vrSupported} arSupported={arSupported} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NeuroVerse</h1>
              <p className="text-gray-600">Global Learning Metaverse - Merge education, AI, and 3D environments</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900">Immersive Learning Experience</h2>
            </div>
            <p className="text-purple-700">
              Step into virtual worlds where AI avatars teach in 3D environments, conduct experiments in mixed reality labs, 
              and learn alongside your personal AI companion. The future of education is here.
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

function OverviewTab({ stats, isLoading, vrSupported, arSupported }: { 
  stats: NeuroVerseStats, 
  isLoading: boolean, 
  vrSupported: boolean, 
  arSupported: boolean 
}) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading NeuroVerse data...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Virtual Environments',
      value: stats.totalEnvironments,
      icon: Globe,
      color: 'blue',
      description: '3D learning worlds'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: Play,
      color: 'green',
      description: 'Users in VR/AR now'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'purple',
      description: 'Metaverse learners'
    },
    {
      title: 'Experiments',
      value: stats.experimentsCompleted.toLocaleString(),
      icon: Target,
      color: 'orange',
      description: 'Mixed reality labs'
    },
    {
      title: 'AI Companions',
      value: stats.companionAvatars.toLocaleString(),
      icon: Brain,
      color: 'indigo',
      description: 'Personal learning partners'
    },
    {
      title: 'Avg Session',
      value: `${stats.averageSessionTime} min`,
      icon: BookOpen,
      color: 'pink',
      description: 'Time per session'
    }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NeuroVerse Overview</h2>
        <p className="text-gray-600">
          Welcome to the future of education - where learning happens in immersive 3D worlds with AI companions.
        </p>
      </div>

      {/* VR/AR Support Status */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border-2 ${vrSupported ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${vrSupported ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-900">VR Support</h3>
                <p className="text-sm text-gray-600">
                  {vrSupported ? 'Virtual Reality ready' : 'VR headset required'}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${arSupported ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${arSupported ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-900">AR Support</h3>
                <p className="text-sm text-gray-600">
                  {arSupported ? 'Augmented Reality ready' : 'AR device required'}
                </p>
              </div>
            </div>
          </div>
        </div>
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
            <Eye className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Immersive 3D Classrooms</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            AI avatars teach in virtual labs, classrooms, or historical worlds. Learn physics inside a simulated planet!
          </p>
          <div className="text-xs text-blue-600">
            • VR/AR/Web support<br/>
            • Realistic physics simulation<br/>
            • Interactive 3D objects
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">AI Companion Avatars</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Students have a personal AI friend that follows them through subjects, like an emotional learning partner.
          </p>
          <div className="text-xs text-green-600">
            • Emotional intelligence<br/>
            • Personalized learning<br/>
            • 24/7 availability
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Hand className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Mixed Reality Labs</h3>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            For STEM, students can experiment virtually with real-world physics and chemistry in safe environments.
          </p>
          <div className="text-xs text-purple-600">
            • Realistic simulations<br/>
            • Safe experimentation<br/>
            • Instant feedback
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <Play className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Start VR Session</div>
              <div className="text-sm text-gray-500">Enter immersive learning</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
            <Brain className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Meet AI Companion</div>
              <div className="text-sm text-gray-500">Create your learning partner</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            <Target className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Try Mixed Reality Lab</div>
              <div className="text-sm text-gray-500">Experiment in virtual labs</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}