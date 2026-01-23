'use client'

import React, { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, Target, Users, Brain, RefreshCw, Filter, Search, Star, AlertCircle } from 'lucide-react'

interface Insight {
  id: string
  insightType: string
  insightData: any
  confidenceScore: number
  impactScore: number
  sampleSize: number
  createdAt: string
  expiresAt?: string
  tags: string[]
}

interface Experiment {
  id: string
  experimentName: string
  description: string
  hypothesis: string
  status: string
  results: any
  startDate: string
  endDate?: string
}

export default function MetaLearningInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'insights' | 'experiments' | 'discoveries'>('insights')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadInsightsData()
  }, [])

  const loadInsightsData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockInsights: Insight[] = [
        {
          id: '1',
          insightType: 'teaching_optimization',
          insightData: {
            finding: 'Visual learners perform 23% better with diagram-based explanations',
            strategy: 'visual',
            improvement: 0.23,
            context: 'mathematics',
            personalityType: 'visual'
          },
          confidenceScore: 0.89,
          impactScore: 0.75,
          sampleSize: 5000,
          createdAt: '2024-01-15T10:30:00Z',
          tags: ['visual-learning', 'mathematics', 'teaching-strategy']
        },
        {
          id: '2',
          insightType: 'curriculum_improvement',
          insightData: {
            finding: 'Adding 5-minute practice exercises between theory and application improves retention by 18%',
            recommendation: 'add_practice_exercises',
            improvement: 0.18,
            context: 'all_subjects',
            implementation: 'easy'
          },
          confidenceScore: 0.82,
          impactScore: 0.68,
          sampleSize: 3500,
          createdAt: '2024-01-14T15:45:00Z',
          tags: ['curriculum', 'retention', 'practice', 'universal']
        },
        {
          id: '3',
          insightType: 'personalization',
          insightData: {
            finding: 'Students with high anxiety benefit from immediate positive feedback',
            strategy: 'immediate_feedback',
            improvement: 0.31,
            context: 'all_subjects',
            personalityType: 'anxious'
          },
          confidenceScore: 0.91,
          impactScore: 0.82,
          sampleSize: 2800,
          createdAt: '2024-01-14T09:20:00Z',
          tags: ['personalization', 'anxiety', 'feedback', 'mental-health']
        },
        {
          id: '4',
          insightType: 'teaching_optimization',
          insightData: {
            finding: 'Socratic questioning increases critical thinking by 27% in advanced learners',
            strategy: 'socratic',
            improvement: 0.27,
            context: 'advanced_topics',
            learningStyle: 'analytical'
          },
          confidenceScore: 0.85,
          impactScore: 0.71,
          sampleSize: 1800,
          createdAt: '2024-01-13T14:15:00Z',
          tags: ['socratic-method', 'critical-thinking', 'advanced', 'questioning']
        },
        {
          id: '5',
          insightType: 'curriculum_improvement',
          insightData: {
            finding: 'Micro-learning sessions (5-10 minutes) improve completion rates by 34%',
            recommendation: 'micro_learning',
            improvement: 0.34,
            context: 'online_learning',
            implementation: 'moderate'
          },
          confidenceScore: 0.88,
          impactScore: 0.79,
          sampleSize: 4200,
          createdAt: '2024-01-13T11:30:00Z',
          tags: ['micro-learning', 'completion-rates', 'online', 'engagement']
        }
      ]

      const mockExperiments: Experiment[] = [
        {
          id: '1',
          experimentName: 'Visual vs Text Explanations',
          description: 'Comparing effectiveness of visual diagrams vs text explanations for mathematical concepts',
          hypothesis: 'Visual learners will perform better with diagram-based explanations',
          status: 'completed',
          results: {
            visualGroup: { accuracy: 0.78, satisfaction: 4.2 },
            textGroup: { accuracy: 0.65, satisfaction: 3.8 },
            improvement: 0.20,
            significance: 0.95
          },
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-14T23:59:59Z'
        },
        {
          id: '2',
          experimentName: 'Adaptive Difficulty Timing',
          description: 'Testing optimal timing for difficulty adjustments in adaptive learning',
          hypothesis: 'Immediate difficulty adjustment leads to better learning outcomes',
          status: 'running',
          results: null,
          startDate: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          experimentName: 'Peer Learning Effectiveness',
          description: 'Measuring impact of peer collaboration on learning outcomes',
          hypothesis: 'Structured peer learning improves retention and engagement',
          status: 'completed',
          results: {
            peerGroup: { retention: 0.82, engagement: 4.5 },
            soloGroup: { retention: 0.71, engagement: 3.9 },
            improvement: 0.15,
            significance: 0.88
          },
          startDate: '2023-12-15T00:00:00Z',
          endDate: '2024-01-05T23:59:59Z'
        }
      ]

      setInsights(mockInsights)
      setExperiments(mockExperiments)
    } catch (error) {
      console.error('Failed to load insights data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'teaching_optimization':
        return 'bg-blue-100 text-blue-800'
      case 'curriculum_improvement':
        return 'bg-green-100 text-green-800'
      case 'personalization':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInsights = insights.filter(insight => {
    const matchesType = filterType === 'all' || insight.insightType === filterType
    const matchesSearch = searchQuery === '' || 
      insight.insightData.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading insights data...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meta-Learning Insights</h2>
            <p className="text-gray-600">
              AI-discovered patterns and insights that continuously improve teaching effectiveness.
            </p>
          </div>
          <button
            onClick={loadInsightsData}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'insights', label: 'AI Insights', icon: Lightbulb },
              { id: 'experiments', label: 'Experiments', icon: Target },
              { id: 'discoveries', label: 'Discoveries', icon: Brain }
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
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="teaching_optimization">Teaching Optimization</option>
                    <option value="curriculum_improvement">Curriculum Improvement</option>
                    <option value="personalization">Personalization</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {insight.insightData.finding}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getInsightTypeColor(insight.insightType)}`}>
                          {insight.insightType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(insight.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      {Math.round(insight.impactScore * 100)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Confidence</div>
                      <div className={`font-semibold ${getConfidenceColor(insight.confidenceScore)}`}>
                        {Math.round(insight.confidenceScore * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Impact</div>
                      <div className={`font-semibold ${getImpactColor(insight.impactScore)}`}>
                        {Math.round(insight.impactScore * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Sample Size</div>
                      <div className="font-semibold">{insight.sampleSize.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Improvement</div>
                      <div className="font-semibold text-green-600">
                        +{Math.round(insight.insightData.improvement * 100)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {insight.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {insight.insightData.context && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">Context</div>
                      <div className="text-sm text-blue-700">
                        {insight.insightData.context}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'experiments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiments.map((experiment) => (
              <div key={experiment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{experiment.experimentName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment.status)}`}>
                        {experiment.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(experiment.startDate).toLocaleDateString()}
                        {experiment.endDate && ` - ${new Date(experiment.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
                    <p className="text-sm text-gray-600">{experiment.description}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Hypothesis</div>
                    <p className="text-sm text-gray-600 italic">"{experiment.hypothesis}"</p>
                  </div>

                  {experiment.results && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-900 mb-2">Results</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-green-700">Improvement</div>
                          <div className="font-semibold text-green-800">
                            +{Math.round(experiment.results.improvement * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-green-700">Significance</div>
                          <div className="font-semibold text-green-800">
                            {Math.round(experiment.results.significance * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {experiment.status === 'running' && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-blue-700">Experiment in progress...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'discoveries' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">AI Discoveries</h3>
            </div>
            <p className="text-purple-700 mb-6">
              Our AI has discovered fascinating patterns in how humans learn. These insights are continuously 
              improving our teaching methods and helping students learn more effectively.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Learning Pattern Discovery</h4>
                <p className="text-sm text-purple-700 mb-3">
                  AI identified that students learn 40% faster when concepts are introduced in reverse chronological order.
                </p>
                <div className="text-xs text-purple-600">
                  Confidence: 94% • Sample: 15,000 students
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Cultural Learning Insights</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Discovered that collaborative learning is 25% more effective in collectivist cultures.
                </p>
                <div className="text-xs text-purple-600">
                  Confidence: 89% • Sample: 8,500 students
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Discovery Timeline</h3>
            <div className="space-y-4">
              {[
                {
                  date: '2024-01-15',
                  discovery: 'Visual learners perform 23% better with diagram-based explanations',
                  impact: 'High',
                  category: 'Teaching Method'
                },
                {
                  date: '2024-01-14',
                  discovery: 'Micro-learning sessions improve completion rates by 34%',
                  impact: 'High',
                  category: 'Curriculum Design'
                },
                {
                  date: '2024-01-13',
                  discovery: 'Immediate feedback reduces anxiety by 31% in anxious learners',
                  impact: 'Medium',
                  category: 'Personalization'
                },
                {
                  date: '2024-01-12',
                  discovery: 'Socratic questioning increases critical thinking by 27%',
                  impact: 'Medium',
                  category: 'Teaching Method'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.discovery}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.impact === 'High' ? 'bg-red-100 text-red-800' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.date} • {item.category}
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