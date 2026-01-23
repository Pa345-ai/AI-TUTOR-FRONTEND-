'use client'

import React, { useState, useEffect } from 'react'
import { Network, Users, Shield, TrendingUp, RefreshCw, Settings, Play, Pause, BarChart3, Lock, Globe } from 'lucide-react'

interface FederatedModel {
  id: string
  modelName: string
  modelType: string
  version: string
  performanceMetrics: any
  trainingSamples: number
  lastUpdated: string
  isActive: boolean
}

interface FederatedRound {
  id: string
  modelId: string
  roundNumber: number
  participantsCount: number
  aggregationMethod: string
  globalLoss: number
  globalAccuracy: number
  convergenceMetric: number
  startedAt: string
  completedAt: string | null
  status: string
}

interface LocalUpdate {
  id: string
  modelId: string
  userHash: string
  performanceImprovement: number
  privacyBudget: number
  createdAt: string
}

export default function FederatedLearningNetwork() {
  const [models, setModels] = useState<FederatedModel[]>([])
  const [rounds, setRounds] = useState<FederatedRound[]>([])
  const [localUpdates, setLocalUpdates] = useState<LocalUpdate[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'rounds' | 'privacy' | 'analytics'>('overview')

  useEffect(() => {
    loadFederatedData()
  }, [])

  const loadFederatedData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockModels: FederatedModel[] = [
        {
          id: '1',
          modelName: 'Teaching Strategy Optimizer',
          modelType: 'teaching_strategy',
          version: '2.1.3',
          performanceMetrics: {
            accuracy: 0.89,
            precision: 0.87,
            recall: 0.91,
            f1Score: 0.89
          },
          trainingSamples: 125000,
          lastUpdated: '2024-01-15T10:30:00Z',
          isActive: true
        },
        {
          id: '2',
          modelName: 'Curriculum Personalizer',
          modelType: 'curriculum_optimization',
          version: '1.8.2',
          performanceMetrics: {
            accuracy: 0.85,
            precision: 0.83,
            recall: 0.87,
            f1Score: 0.85
          },
          trainingSamples: 98000,
          lastUpdated: '2024-01-14T15:45:00Z',
          isActive: true
        },
        {
          id: '3',
          modelName: 'Learning Style Classifier',
          modelType: 'personalization',
          version: '3.0.1',
          performanceMetrics: {
            accuracy: 0.92,
            precision: 0.90,
            recall: 0.94,
            f1Score: 0.92
          },
          trainingSamples: 156000,
          lastUpdated: '2024-01-15T08:20:00Z',
          isActive: true
        }
      ]

      const mockRounds: FederatedRound[] = [
        {
          id: '1',
          modelId: '1',
          roundNumber: 47,
          participantsCount: 1250,
          aggregationMethod: 'fedavg',
          globalLoss: 0.234,
          globalAccuracy: 0.891,
          convergenceMetric: 0.012,
          startedAt: '2024-01-15T09:00:00Z',
          completedAt: '2024-01-15T09:45:00Z',
          status: 'completed'
        },
        {
          id: '2',
          modelId: '2',
          roundNumber: 23,
          participantsCount: 980,
          aggregationMethod: 'fedprox',
          globalLoss: 0.267,
          globalAccuracy: 0.847,
          convergenceMetric: 0.018,
          startedAt: '2024-01-15T10:00:00Z',
          completedAt: null,
          status: 'running'
        },
        {
          id: '3',
          modelId: '3',
          roundNumber: 12,
          participantsCount: 2100,
          aggregationMethod: 'scaffold',
          globalLoss: 0.198,
          globalAccuracy: 0.923,
          convergenceMetric: 0.008,
          startedAt: '2024-01-14T14:30:00Z',
          completedAt: '2024-01-14T15:15:00Z',
          status: 'completed'
        }
      ]

      const mockLocalUpdates: LocalUpdate[] = [
        {
          id: '1',
          modelId: '1',
          userHash: 'a1b2c3d4...',
          performanceImprovement: 0.15,
          privacyBudget: 0.85,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          modelId: '2',
          userHash: 'e5f6g7h8...',
          performanceImprovement: 0.23,
          privacyBudget: 0.78,
          createdAt: '2024-01-15T10:25:00Z'
        },
        {
          id: '3',
          modelId: '1',
          userHash: 'i9j0k1l2...',
          performanceImprovement: 0.18,
          privacyBudget: 0.92,
          createdAt: '2024-01-15T10:20:00Z'
        }
      ]

      setModels(mockModels)
      setRounds(mockRounds)
      setLocalUpdates(mockLocalUpdates)
    } catch (error) {
      console.error('Failed to load federated learning data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startTraining = async () => {
    setIsTraining(true)
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 10000))
    setIsTraining(false)
    // Reload data after training
    loadFederatedData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'teaching_strategy':
        return 'bg-purple-100 text-purple-800'
      case 'curriculum_optimization':
        return 'bg-green-100 text-green-800'
      case 'personalization':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading federated learning data...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Federated Learning Network</h2>
            <p className="text-gray-600">
              Each user's AI learns locally and anonymously improves the global model, so your data grows in value exponentially.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={startTraining}
              disabled={isTraining}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTraining ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isTraining ? 'Training...' : 'Start Training'}</span>
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
              { id: 'overview', label: 'Overview', icon: Network },
              { id: 'models', label: 'Models', icon: BarChart3 },
              { id: 'rounds', label: 'Training Rounds', icon: TrendingUp },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: Globe }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{models.length}</div>
              <div className="text-sm text-gray-600">Active Models</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">12,500</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">379,000</div>
              <div className="text-sm text-gray-600">Training Samples</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">47</div>
              <div className="text-sm text-gray-600">Completed Rounds</div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Privacy-First Learning</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-green-800 mb-2">Differential Privacy</h4>
                <p className="text-sm text-green-700">
                  All local updates are protected with differential privacy, ensuring individual data remains private.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Federated Averaging</h4>
                <p className="text-sm text-green-700">
                  Model updates are aggregated without exposing individual user data or learning patterns.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Secure Aggregation</h4>
                <p className="text-sm text-green-700">
                  Cryptographic protocols ensure that only aggregated model improvements are shared globally.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Model "Teaching Strategy Optimizer" completed round 47', time: '2 hours ago', type: 'success' },
                { action: '1,250 participants contributed to curriculum personalization', time: '4 hours ago', type: 'info' },
                { action: 'Privacy budget updated for learning style classifier', time: '6 hours ago', type: 'warning' },
                { action: 'New federated round started for personalization model', time: '8 hours ago', type: 'info' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'success' ? 'bg-green-500' :
                    item.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {models.map((model) => (
              <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{model.modelName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getModelTypeColor(model.modelType)}`}>
                        {model.modelType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">v{model.version}</span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${model.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Performance Metrics</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="text-sm">
                        <span className="text-gray-500">Accuracy:</span>
                        <span className="ml-1 font-semibold">{(model.performanceMetrics.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">F1 Score:</span>
                        <span className="ml-1 font-semibold">{(model.performanceMetrics.f1Score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Training Data</div>
                    <div className="text-sm text-gray-600">
                      {model.trainingSamples.toLocaleString()} samples
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700">Last Updated</div>
                    <div className="text-sm text-gray-600">
                      {new Date(model.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rounds' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Training Rounds</h3>
              <p className="text-sm text-gray-600">Federated learning training rounds and their performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rounds.map((round) => {
                    const model = models.find(m => m.id === round.modelId)
                    const duration = round.completedAt 
                      ? Math.round((new Date(round.completedAt).getTime() - new Date(round.startedAt).getTime()) / 60000)
                      : null
                    
                    return (
                      <tr key={round.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{round.roundNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {model?.modelName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.participantsCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.aggregationMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(round.globalAccuracy * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.globalLoss.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(round.status)}`}>
                            {round.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {duration ? `${duration} min` : 'Running...'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Privacy Protection</h3>
            </div>
            <p className="text-blue-700 mb-6">
              Your learning data never leaves your device. Only anonymized model improvements are shared to help everyone learn better.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Differential Privacy</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Mathematical guarantees that your individual data cannot be identified or reconstructed.
                </p>
                <div className="text-xs text-blue-600">
                  Privacy Budget: 0.85 (High Protection)
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Secure Aggregation</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Cryptographic protocols ensure only aggregated improvements are shared, never raw data.
                </p>
                <div className="text-xs text-blue-600">
                  Encryption: AES-256 + Homomorphic
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Budget (0.1 = High Privacy, 1.0 = Lower Privacy)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>High Privacy</span>
                  <span>Balanced</span>
                  <span>Lower Privacy</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention Period
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>7 days (Recommended)</option>
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>Never delete</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="anonymous" defaultChecked />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Participate anonymously in federated learning
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">23.5%</div>
              <div className="text-sm text-gray-600">Average Improvement</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">89.2%</div>
              <div className="text-sm text-gray-600">Model Accuracy</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0.15</div>
              <div className="text-sm text-gray-600">Convergence Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">2.3M</div>
              <div className="text-sm text-gray-600">Total Updates</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Performance charts would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}