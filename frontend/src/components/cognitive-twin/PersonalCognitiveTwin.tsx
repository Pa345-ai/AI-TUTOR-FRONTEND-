'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Network, Target, TrendingUp, Zap, BookOpen, Lightbulb, BarChart3, RefreshCw, Plus, Settings, Eye, Edit3, Trash2 } from 'lucide-react'

interface KnowledgeNode {
  id: string
  nodeType: 'concept' | 'skill' | 'fact' | 'procedure' | 'principle'
  subjectArea: string
  topic: string
  content: string
  difficultyLevel: number
  masteryLevel: number
  confidenceLevel: number
  firstLearnedAt: string
  lastReviewedAt: string
  reviewCount: number
  learningTimeMinutes: number
  prerequisites: string[]
  relatedConcepts: string[]
  applications: string[]
  learningDifficulty: number
  retentionProbability: number
  optimalReviewInterval: number
}

interface CognitiveTwin {
  id: string
  twinName: string
  cognitiveStyle: string
  learningPace: string
  attentionSpan: number
  memoryType: string
  processingSpeed: number
  overallCognitiveScore: number
  memoryRetentionRate: number
  learningEfficiency: number
  problemSolvingAbility: number
  knowledgeGraph: any
  skillLevels: any
  learningPreferences: any
  cognitiveBiases: any
  aiInsights: any
  predictedPerformance: any
  recommendedStrategies: any
  cognitiveHealthScore: number
  lastUpdated: string
}

interface PersonalCognitiveTwinProps {
  userId?: string
}

export default function PersonalCognitiveTwin({ userId }: PersonalCognitiveTwinProps) {
  const [cognitiveTwin, setCognitiveTwin] = useState<CognitiveTwin | null>(null)
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge_graph' | 'patterns' | 'insights'>('overview')
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [showAddNode, setShowAddNode] = useState(false)

  useEffect(() => {
    loadCognitiveTwinData()
  }, [userId])

  const loadCognitiveTwinData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockTwin: CognitiveTwin = {
        id: 'twin-1',
        twinName: 'Alex Cognitive Twin',
        cognitiveStyle: 'visual',
        learningPace: 'fast',
        attentionSpan: 45,
        memoryType: 'episodic',
        processingSpeed: 87.5,
        overallCognitiveScore: 87.5,
        memoryRetentionRate: 92.3,
        learningEfficiency: 89.1,
        problemSolvingAbility: 85.7,
        knowledgeGraph: {
          nodes: 47,
          connections: 156,
          complexity: 'high'
        },
        skillLevels: {
          mathematics: 0.85,
          programming: 0.78,
          science: 0.72,
          language: 0.91
        },
        learningPreferences: {
          visual: 0.92,
          auditory: 0.65,
          kinesthetic: 0.78,
          reading: 0.88
        },
        cognitiveBiases: {
          confirmation_bias: 0.23,
          anchoring_bias: 0.18,
          availability_heuristic: 0.31
        },
        aiInsights: {
          strengths: ['Visual learning', 'Pattern recognition', 'Creative problem solving'],
          weaknesses: ['Sequential processing', 'Detail orientation'],
          recommendations: ['Use more visual aids', 'Break complex tasks into smaller steps']
        },
        predictedPerformance: {
          nextMonth: 89.2,
          nextQuarter: 91.5,
          nextYear: 94.8
        },
        recommendedStrategies: [
          'Use mind maps for complex topics',
          'Practice spaced repetition',
          'Engage in peer teaching'
        ],
        cognitiveHealthScore: 94.2,
        lastUpdated: new Date().toISOString()
      }

      const mockNodes: KnowledgeNode[] = [
        {
          id: 'node-1',
          nodeType: 'concept',
          subjectArea: 'mathematics',
          topic: 'quadratic equations',
          content: 'Understanding how to solve quadratic equations using various methods',
          difficultyLevel: 7,
          masteryLevel: 0.85,
          confidenceLevel: 0.92,
          firstLearnedAt: '2024-01-15T10:00:00Z',
          lastReviewedAt: '2024-01-20T14:30:00Z',
          reviewCount: 12,
          learningTimeMinutes: 180,
          prerequisites: ['algebra basics', 'factoring'],
          relatedConcepts: ['polynomials', 'graphing', 'discriminant'],
          applications: ['physics problems', 'engineering calculations'],
          learningDifficulty: 6.8,
          retentionProbability: 0.89,
          optimalReviewInterval: 7
        },
        {
          id: 'node-2',
          nodeType: 'skill',
          subjectArea: 'programming',
          topic: 'Python functions',
          content: 'Ability to write and debug Python functions',
          difficultyLevel: 6,
          masteryLevel: 0.78,
          confidenceLevel: 0.88,
          firstLearnedAt: '2024-01-10T09:00:00Z',
          lastReviewedAt: '2024-01-19T16:45:00Z',
          reviewCount: 8,
          learningTimeMinutes: 240,
          prerequisites: ['Python basics', 'variables', 'control structures'],
          relatedConcepts: ['classes', 'modules', 'decorators'],
          applications: ['web development', 'data analysis', 'automation'],
          learningDifficulty: 5.9,
          retentionProbability: 0.82,
          optimalReviewInterval: 5
        },
        {
          id: 'node-3',
          nodeType: 'fact',
          subjectArea: 'history',
          topic: 'World War II',
          content: 'Key facts and dates about World War II',
          difficultyLevel: 5,
          masteryLevel: 0.92,
          confidenceLevel: 0.95,
          firstLearnedAt: '2024-01-05T11:00:00Z',
          lastReviewedAt: '2024-01-18T13:20:00Z',
          reviewCount: 15,
          learningTimeMinutes: 120,
          prerequisites: ['World War I', 'interwar period'],
          relatedConcepts: ['Nazi Germany', 'Allied powers', 'Holocaust'],
          applications: ['historical analysis', 'political science'],
          learningDifficulty: 4.2,
          retentionProbability: 0.94,
          optimalReviewInterval: 3
        }
      ]

      setCognitiveTwin(mockTwin)
      setKnowledgeNodes(mockNodes)
    } catch (error) {
      console.error('Failed to load cognitive twin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNodeTypeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'concept': return <Lightbulb className="w-4 h-4" />
      case 'skill': return <Zap className="w-4 h-4" />
      case 'fact': return <BookOpen className="w-4 h-4" />
      case 'procedure': return <Target className="w-4 h-4" />
      case 'principle': return <Brain className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 0.8) return 'text-green-600 bg-green-50'
    if (mastery >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 8) return 'text-red-600 bg-red-50'
    if (difficulty >= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading your cognitive twin...</p>
      </div>
    )
  }

  if (!cognitiveTwin) {
    return (
      <div className="p-8 text-center">
        <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cognitive Twin Found</h3>
        <p className="text-gray-600 mb-4">Create your digital brain clone to start tracking your learning patterns.</p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Create Cognitive Twin
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{cognitiveTwin.twinName}</h1>
              <p className="text-gray-600">Your Digital Brain Clone</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cognitive Health Score */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-900">Cognitive Health Score</h2>
            <div className="text-3xl font-bold text-purple-600">{cognitiveTwin.cognitiveHealthScore}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${cognitiveTwin.cognitiveHealthScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-purple-700 mt-2">
            Excellent cognitive health! Your digital twin is performing optimally.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Network },
              { id: 'patterns', label: 'Learning Patterns', icon: TrendingUp },
              { id: 'insights', label: 'AI Insights', icon: Lightbulb }
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
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Overall Score</h3>
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cognitiveTwin.overallCognitiveScore}</div>
              <div className="text-sm text-green-600">+2.3% from last week</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Memory Retention</h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cognitiveTwin.memoryRetentionRate}%</div>
              <div className="text-sm text-green-600">+1.8% from last week</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Learning Efficiency</h3>
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cognitiveTwin.learningEfficiency}%</div>
              <div className="text-sm text-green-600">+3.1% from last week</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Problem Solving</h3>
                <Lightbulb className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cognitiveTwin.problemSolvingAbility}%</div>
              <div className="text-sm text-green-600">+1.5% from last week</div>
            </div>
          </div>

          {/* Learning Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cognitive Style</span>
                  <span className="font-medium capitalize">{cognitiveTwin.cognitiveStyle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Learning Pace</span>
                  <span className="font-medium capitalize">{cognitiveTwin.learningPace}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attention Span</span>
                  <span className="font-medium">{cognitiveTwin.attentionSpan} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory Type</span>
                  <span className="font-medium capitalize">{cognitiveTwin.memoryType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Processing Speed</span>
                  <span className="font-medium">{cognitiveTwin.processingSpeed}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Levels</h3>
              <div className="space-y-3">
                {Object.entries(cognitiveTwin.skillLevels).map(([skill, level]) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{skill}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(level as number) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">
                        {Math.round((level as number) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Predicted Performance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Predicted Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{cognitiveTwin.predictedPerformance.nextMonth}%</div>
                <div className="text-sm text-blue-700">Next Month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{cognitiveTwin.predictedPerformance.nextQuarter}%</div>
                <div className="text-sm text-green-700">Next Quarter</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{cognitiveTwin.predictedPerformance.nextYear}%</div>
                <div className="text-sm text-purple-700">Next Year</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'knowledge_graph' && (
        <div className="space-y-6">
          {/* Knowledge Graph Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Knowledge Graph</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowAddNode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Node</span>
              </button>
            </div>
          </div>

          {/* Knowledge Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeNodes.map((node) => (
              <div 
                key={node.id} 
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getNodeTypeIcon(node.nodeType)}
                    <span className="text-sm font-medium text-gray-500 capitalize">{node.nodeType}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{node.topic}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{node.content}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Mastery</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getMasteryColor(node.masteryLevel)}`}>
                      {Math.round(node.masteryLevel * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Difficulty</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(node.difficultyLevel)}`}>
                      {node.difficultyLevel}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Reviews</span>
                    <span className="text-xs text-gray-600">{node.reviewCount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last reviewed: {new Date(node.lastReviewedAt).toLocaleDateString()}</span>
                    <span>{node.learningTimeMinutes}min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Learning Patterns</h2>
          
          {/* Learning Preferences */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h3>
            <div className="space-y-3">
              {Object.entries(cognitiveTwin.learningPreferences).map(([style, preference]) => (
                <div key={style} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{style}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(preference as number) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {Math.round((preference as number) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Biases */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cognitive Biases</h3>
            <div className="space-y-3">
              {Object.entries(cognitiveTwin.cognitiveBiases).map(([bias, level]) => (
                <div key={bias} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{bias.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                        style={{ width: `${(level as number) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {Math.round((level as number) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
          
          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Strengths</h3>
              <ul className="space-y-2">
                {cognitiveTwin.aiInsights.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Areas for Improvement</h3>
              <ul className="space-y-2">
                {cognitiveTwin.aiInsights.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Strategies */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Learning Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cognitiveTwin.recommendedStrategies.map((strategy: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedNode.topic}</h3>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                  <p className="text-gray-700">{selectedNode.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.prerequisites.map((prereq, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Related Concepts</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.relatedConcepts.map((concept, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Applications</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.applications.map((app, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}