'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, TrendingUp, RefreshCw, Settings, Play, Pause, BarChart3, Target, Users, Clock } from 'lucide-react'

interface CurriculumPerformance {
  id: string
  topic: string
  subject: string
  difficultyLevel: string
  learningObjective: string
  globalSuccessRate: number
  averageCompletionTime: number
  dropoutRate: number
  userSatisfaction: number
  sampleSize: number
  lastAnalyzed: string
}

interface CurriculumRule {
  id: string
  ruleName: string
  conditionType: string
  conditionValue: number
  actionType: string
  actionParameters: any
  priority: number
  isActive: boolean
}

interface LearningPathOptimization {
  id: string
  subject: string
  originalPath: string[]
  optimizedPath: string[]
  optimizationReason: string
  performanceImprovement: number
  confidenceScore: number
  appliedAt: string
}

export default function SelfImprovingCurriculum() {
  const [performanceData, setPerformanceData] = useState<CurriculumPerformance[]>([])
  const [rules, setRules] = useState<CurriculumRule[]>([])
  const [optimizations, setOptimizations] = useState<LearningPathOptimization[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'performance' | 'rules' | 'optimizations' | 'analytics'>('performance')

  useEffect(() => {
    loadCurriculumData()
  }, [])

  const loadCurriculumData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPerformance: CurriculumPerformance[] = [
        {
          id: '1',
          topic: 'Basic Algebra',
          subject: 'Mathematics',
          difficultyLevel: 'beginner',
          learningObjective: 'Solve linear equations with one variable',
          globalSuccessRate: 78.5,
          averageCompletionTime: 45,
          dropoutRate: 12.3,
          userSatisfaction: 4.2,
          sampleSize: 2500,
          lastAnalyzed: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          topic: 'Photosynthesis',
          subject: 'Biology',
          difficultyLevel: 'intermediate',
          learningObjective: 'Explain the process of photosynthesis',
          globalSuccessRate: 82.1,
          averageCompletionTime: 35,
          dropoutRate: 8.7,
          userSatisfaction: 4.4,
          sampleSize: 1800,
          lastAnalyzed: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          topic: 'World War II',
          subject: 'History',
          difficultyLevel: 'intermediate',
          learningObjective: 'Analyze causes and effects of World War II',
          globalSuccessRate: 75.8,
          averageCompletionTime: 60,
          dropoutRate: 15.2,
          userSatisfaction: 4.0,
          sampleSize: 1200,
          lastAnalyzed: '2024-01-15T08:45:00Z'
        },
        {
          id: '4',
          topic: 'Python Functions',
          subject: 'Computer Science',
          difficultyLevel: 'beginner',
          learningObjective: 'Write and use functions in Python',
          globalSuccessRate: 85.3,
          averageCompletionTime: 90,
          dropoutRate: 6.8,
          userSatisfaction: 4.6,
          sampleSize: 3200,
          lastAnalyzed: '2024-01-15T11:20:00Z'
        },
        {
          id: '5',
          topic: 'Chemical Bonding',
          subject: 'Chemistry',
          difficultyLevel: 'advanced',
          learningObjective: 'Understand ionic and covalent bonds',
          globalSuccessRate: 71.2,
          averageCompletionTime: 120,
          dropoutRate: 18.5,
          userSatisfaction: 3.8,
          sampleSize: 800,
          lastAnalyzed: '2024-01-15T07:30:00Z'
        }
      ]

      const mockRules: CurriculumRule[] = [
        {
          id: '1',
          ruleName: 'Low Success Rate Intervention',
          conditionType: 'performance_threshold',
          conditionValue: 70,
          actionType: 'adjust_difficulty',
          actionParameters: { reductionFactor: 0.1, addPrerequisites: true },
          priority: 1,
          isActive: true
        },
        {
          id: '2',
          ruleName: 'High Dropout Rate Response',
          conditionType: 'dropout_threshold',
          conditionValue: 15,
          actionType: 'add_practice',
          actionParameters: { practiceExercises: 3, breakFrequency: 10 },
          priority: 2,
          isActive: true
        },
        {
          id: '3',
          ruleName: 'Satisfaction Improvement',
          conditionType: 'satisfaction_threshold',
          conditionValue: 4.0,
          actionType: 'change_sequence',
          actionParameters: { reorderTopics: true, addVisuals: true },
          priority: 3,
          isActive: true
        }
      ]

      const mockOptimizations: LearningPathOptimization[] = [
        {
          id: '1',
          subject: 'Mathematics',
          originalPath: ['Arithmetic', 'Algebra', 'Geometry', 'Calculus'],
          optimizedPath: ['Arithmetic', 'Basic Algebra', 'Geometry', 'Advanced Algebra', 'Calculus'],
          optimizationReason: 'Students struggled with advanced algebra concepts without sufficient basic algebra foundation',
          performanceImprovement: 18.5,
          confidenceScore: 0.89,
          appliedAt: '2024-01-14T14:30:00Z'
        },
        {
          id: '2',
          subject: 'Computer Science',
          originalPath: ['Variables', 'Functions', 'Classes', 'Algorithms'],
          optimizedPath: ['Variables', 'Control Structures', 'Functions', 'Data Structures', 'Classes', 'Algorithms'],
          optimizationReason: 'Adding control structures and data structures improved understanding of object-oriented concepts',
          performanceImprovement: 22.3,
          confidenceScore: 0.92,
          appliedAt: '2024-01-13T16:45:00Z'
        }
      ]

      setPerformanceData(mockPerformance)
      setRules(mockRules)
      setOptimizations(mockOptimizations)
    } catch (error) {
      console.error('Failed to load curriculum data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 5000))
    setIsAnalyzing(false)
    // Reload data after analysis
    loadCurriculumData()
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading curriculum data...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Self-Improving Curriculum AI</h2>
            <p className="text-gray-600">
              Continuously updates lessons based on global performance data, creating a living textbook that evolves.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Start Analysis'}</span>
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
              { id: 'performance', label: 'Performance Data', icon: BarChart3 },
              { id: 'rules', label: 'Adaptation Rules', icon: Target },
              { id: 'optimizations', label: 'Path Optimizations', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
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
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Curriculum Performance Metrics</h3>
              <p className="text-sm text-gray-600">Real-time performance data for all curriculum topics</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropout Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {performanceData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.topic}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{item.learningObjective}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficultyLevel)}`}>
                          {item.difficultyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${getPerformanceColor(item.globalSuccessRate)}`}>
                          {item.globalSuccessRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.averageCompletionTime} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${item.dropoutRate > 15 ? 'text-red-600' : item.dropoutRate > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {item.dropoutRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.userSatisfaction}/5.0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sampleSize.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rule.ruleName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Condition</div>
                    <div className="text-sm text-gray-600">
                      {rule.conditionType.replace('_', ' ')} &gt; {rule.conditionValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Action</div>
                    <div className="text-sm text-gray-600">
                      {rule.actionType.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Parameters</div>
                    <div className="text-sm text-gray-600">
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(rule.actionParameters, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>performance_threshold</option>
                  <option>dropout_threshold</option>
                  <option>satisfaction_threshold</option>
                  <option>time_threshold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition Value</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter threshold value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>adjust_difficulty</option>
                  <option>add_prerequisite</option>
                  <option>change_sequence</option>
                  <option>add_practice</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'optimizations' && (
        <div className="space-y-6">
          {optimizations.map((optimization) => (
            <div key={optimization.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{optimization.subject} Learning Path</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-green-600 font-semibold">
                      +{optimization.performanceImprovement}% improvement
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(optimization.confidenceScore * 100)}% confidence
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied {new Date(optimization.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Original Path</h4>
                  <div className="flex flex-wrap gap-2">
                    {optimization.originalPath.map((step, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Optimized Path</h4>
                  <div className="flex flex-wrap gap-2">
                    {optimization.optimizedPath.map((step, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Optimization Reason</h4>
                <p className="text-sm text-blue-700">{optimization.optimizationReason}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">89</div>
              <div className="text-sm text-gray-600">Curriculum Updates This Month</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">23.5%</div>
              <div className="text-sm text-gray-600">Average Performance Improvement</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <div className="text-sm text-gray-600">Insights Generated</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Insights</h3>
            <div className="space-y-4">
              {[
                {
                  insight: "Adding 5-minute practice exercises between theory and application improves retention by 18%",
                  impact: "High",
                  confidence: 0.89
                },
                {
                  insight: "Visual learners perform 23% better with diagram-based explanations in mathematics",
                  impact: "High",
                  confidence: 0.92
                },
                {
                  insight: "Students with high anxiety benefit from immediate positive feedback",
                  impact: "Medium",
                  confidence: 0.85
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-700">{item.insight}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.impact === 'High' ? 'bg-red-100 text-red-800' :
                        item.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.impact} Impact
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
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