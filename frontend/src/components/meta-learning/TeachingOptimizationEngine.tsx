'use client'

import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Users, Brain, BarChart3, RefreshCw, Play, Pause, Settings } from 'lucide-react'

interface TeachingStrategy {
  id: string
  name: string
  description: string
  category: string
  effectivenessScore: number
  usageCount: number
  successRate: number
  parameters: any
  isActive: boolean
}

interface EffectivenessData {
  personalityType: string
  learningStyle: string
  culturalContext: string
  ageGroup: string
  subjectArea: string
  difficultyLevel: string
  effectivenessScore: number
  sampleSize: number
  confidenceLevel: number
}

export default function TeachingOptimizationEngine() {
  const [strategies, setStrategies] = useState<TeachingStrategy[]>([])
  const [effectivenessData, setEffectivenessData] = useState<EffectivenessData[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'strategies' | 'effectiveness' | 'optimization'>('strategies')

  useEffect(() => {
    loadTeachingStrategies()
    loadEffectivenessData()
  }, [])

  const loadTeachingStrategies = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockStrategies: TeachingStrategy[] = [
        {
          id: '1',
          name: 'Socratic Questioning',
          description: 'Guide students through questions to discover answers themselves',
          category: 'socratic',
          effectivenessScore: 0.85,
          usageCount: 1250,
          successRate: 78.5,
          parameters: { questionTypes: ['clarifying', 'probing', 'challenging'], waitTime: 3 },
          isActive: true
        },
        {
          id: '2',
          name: 'Visual Learning',
          description: 'Use diagrams, charts, and visual aids to explain concepts',
          category: 'visual',
          effectivenessScore: 0.78,
          usageCount: 980,
          successRate: 72.3,
          parameters: { visualTypes: ['diagrams', 'charts', 'infographics'], colorCoding: true },
          isActive: true
        },
        {
          id: '3',
          name: 'Gamified Learning',
          description: 'Turn learning into a game with points, levels, and rewards',
          category: 'gamified',
          effectivenessScore: 0.82,
          usageCount: 1150,
          successRate: 75.8,
          parameters: { pointsPerQuestion: 10, levelThresholds: [100, 500, 1000], badges: true },
          isActive: true
        },
        {
          id: '4',
          name: 'Adaptive Difficulty',
          description: 'Adjust difficulty based on student performance',
          category: 'adaptive',
          effectivenessScore: 0.88,
          usageCount: 2100,
          successRate: 82.1,
          parameters: { difficultySteps: 5, performanceThreshold: 0.7, adjustmentRate: 0.1 },
          isActive: true
        },
        {
          id: '5',
          name: 'Peer Learning',
          description: 'Students learn from and teach each other',
          category: 'collaborative',
          effectivenessScore: 0.75,
          usageCount: 650,
          successRate: 68.9,
          parameters: { groupSize: 4, rotationFrequency: 15, peerEvaluation: true },
          isActive: true
        }
      ]
      
      setStrategies(mockStrategies)
    } catch (error) {
      console.error('Failed to load teaching strategies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadEffectivenessData = async () => {
    try {
      // Simulate API call - replace with actual Supabase calls
      const mockData: EffectivenessData[] = [
        {
          personalityType: 'visual',
          learningStyle: 'sequential',
          culturalContext: 'western',
          ageGroup: 'teen',
          subjectArea: 'mathematics',
          difficultyLevel: 'intermediate',
          effectivenessScore: 0.89,
          sampleSize: 450,
          confidenceLevel: 0.92
        },
        {
          personalityType: 'auditory',
          learningStyle: 'global',
          culturalContext: 'eastern',
          ageGroup: 'adult',
          subjectArea: 'language',
          difficultyLevel: 'beginner',
          effectivenessScore: 0.76,
          sampleSize: 320,
          confidenceLevel: 0.85
        },
        {
          personalityType: 'kinesthetic',
          learningStyle: 'active',
          culturalContext: 'western',
          ageGroup: 'child',
          subjectArea: 'science',
          difficultyLevel: 'beginner',
          effectivenessScore: 0.82,
          sampleSize: 280,
          confidenceLevel: 0.88
        }
      ]
      
      setEffectivenessData(mockData)
    } catch (error) {
      console.error('Failed to load effectiveness data:', error)
    }
  }

  const startOptimization = async () => {
    setIsOptimizing(true)
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsOptimizing(false)
    // Reload data after optimization
    loadTeachingStrategies()
    loadEffectivenessData()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      socratic: 'bg-blue-100 text-blue-800',
      visual: 'bg-green-100 text-green-800',
      gamified: 'bg-purple-100 text-purple-800',
      adaptive: 'bg-orange-100 text-orange-800',
      collaborative: 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEffectivenessColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading teaching optimization data...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Teaching Optimization Engine</h2>
            <p className="text-gray-600">
              Analyzes millions of interactions to discover what teaching methods work best for each personality type and culture.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={startOptimization}
              disabled={isOptimizing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isOptimizing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isOptimizing ? 'Optimizing...' : 'Start Optimization'}</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'strategies', label: 'Teaching Strategies', icon: Target },
              { id: 'effectiveness', label: 'Effectiveness Analysis', icon: BarChart3 },
              { id: 'optimization', label: 'Optimization Engine', icon: Brain }
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
      {activeTab === 'strategies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedStrategy === strategy.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{strategy.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(strategy.category)}`}>
                        {strategy.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getEffectivenessColor(strategy.effectivenessScore)}`}>
                      {Math.round(strategy.effectivenessScore * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Effectiveness</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Usage Count</div>
                    <div className="font-semibold">{strategy.usageCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Success Rate</div>
                    <div className="font-semibold">{strategy.successRate}%</div>
                  </div>
                </div>

                {selectedStrategy === strategy.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2">Parameters:</h4>
                    <div className="text-sm text-gray-600">
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(strategy.parameters, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'effectiveness' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Effectiveness by User Profile</h3>
              <p className="text-sm text-gray-600">How different teaching strategies perform across various user profiles</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {effectivenessData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{data.personalityType}</div>
                        <div className="text-sm text-gray-500">{data.learningStyle} • {data.ageGroup}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{data.subjectArea}</div>
                        <div className="text-sm text-gray-500">{data.difficultyLevel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${getEffectivenessColor(data.effectivenessScore)}`}>
                          {Math.round(data.effectivenessScore * 100)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.sampleSize.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{Math.round(data.confidenceLevel * 100)}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'optimization' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Optimization Engine Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">47</div>
                <div className="text-sm text-purple-700">Active Strategies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">2.3M</div>
                <div className="text-sm text-purple-700">Interactions Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">23.5%</div>
                <div className="text-sm text-purple-700">Average Improvement</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Recent Optimizations</h4>
              <div className="space-y-3">
                {[
                  { strategy: 'Visual Learning', improvement: '+12%', metric: 'Retention Rate' },
                  { strategy: 'Socratic Questioning', improvement: '+8%', metric: 'Engagement' },
                  { strategy: 'Adaptive Difficulty', improvement: '+15%', metric: 'Completion Rate' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.strategy}</div>
                      <div className="text-sm text-gray-500">{item.metric}</div>
                    </div>
                    <div className="text-green-600 font-semibold">{item.improvement}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Optimization Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Frequency
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Sample Size
                  </label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Threshold
                  </label>
                  <input
                    type="number"
                    defaultValue="0.85"
                    step="0.05"
                    min="0"
                    max="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}