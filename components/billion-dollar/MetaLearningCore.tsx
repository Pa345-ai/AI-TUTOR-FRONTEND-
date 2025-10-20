import React, { useState, useEffect } from 'react'

interface MetaLearningCoreProps {
  userId: string
}

interface TeachingOptimization {
  id: string
  teaching_method: string
  personality_type: string
  culture: string
  subject: string
  effectiveness_score: number
  success_rate: number
  engagement_metrics: any
  learning_outcomes: any
  created_at: string
}

interface CurriculumOptimization {
  id: string
  lesson_id: string
  subject: string
  topic: string
  difficulty_level: string
  global_performance_score: number
  completion_rate: number
  average_learning_time: number
  user_satisfaction: number
  improvement_suggestions: string[]
  auto_updated_content: any
  version: number
}

interface FederatedLearningModel {
  id: string
  model_name: string
  model_type: string
  global_accuracy: number
  local_contributions: number
  privacy_preserving_hash: string
  model_weights: any
  training_metadata: any
  is_active: boolean
  created_at: string
}

export const MetaLearningCore: React.FC<MetaLearningCoreProps> = ({ userId }) => {
  const [teachingOptimizations, setTeachingOptimizations] = useState<TeachingOptimization[]>([])
  const [curriculumOptimizations, setCurriculumOptimizations] = useState<CurriculumOptimization[]>([])
  const [federatedModels, setFederatedModels] = useState<FederatedLearningModel[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState('socratic')
  const [selectedPersonality, setSelectedPersonality] = useState('visual')
  const [selectedCulture, setSelectedCulture] = useState('global')
  const [selectedSubject, setSelectedSubject] = useState('mathematics')

  useEffect(() => {
    loadMetaLearningData()
  }, [])

  const loadMetaLearningData = async () => {
    try {
      // Load teaching optimizations
      const teachingResponse = await fetch('/api/ai/teaching_optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_all' })
      })
      const teachingData = await teachingResponse.json()
      if (teachingData.success) {
        setTeachingOptimizations(teachingData.data || [])
      }

      // Load curriculum optimizations
      const curriculumResponse = await fetch('/api/ai/curriculum_optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_all' })
      })
      const curriculumData = await curriculumResponse.json()
      if (curriculumData.success) {
        setCurriculumOptimizations(curriculumData.data || [])
      }

      // Load federated learning models
      const federatedResponse = await fetch('/api/ai/federated_learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_models' })
      })
      const federatedData = await federatedResponse.json()
      if (federatedData.success) {
        setFederatedModels(federatedData.data || [])
      }
    } catch (error) {
      console.error('Error loading meta-learning data:', error)
    }
  }

  const runTeachingOptimization = async () => {
    setIsOptimizing(true)
    try {
      const response = await fetch('/api/ai/meta_learning_optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          teaching_method: selectedMethod,
          personality_type: selectedPersonality,
          culture: selectedCulture,
          subject: selectedSubject,
          interaction_data: {
            duration: 30,
            engagement_score: 0.8,
            comprehension_score: 0.75,
            satisfaction_rating: 0.85,
            learning_outcomes: ['concept_understanding', 'problem_solving']
          },
          learning_goals: ['master_fundamentals', 'apply_concepts'],
          current_performance: 0.7
        })
      })

      const result = await response.json()
      if (result.success) {
        setOptimizationResult(result.optimization_result)
        await loadMetaLearningData() // Refresh data
      }
    } catch (error) {
      console.error('Error running optimization:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const getEffectivenessColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600'
    if (accuracy >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🧠 Meta-Learning Core</h2>
        <p className="text-purple-100">AI that learns how to teach itself by analyzing millions of interactions</p>
      </div>

      {/* Teaching Optimization Engine */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🎯 Teaching Optimization Engine</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Optimization Controls */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Run Optimization Analysis</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="socratic">Socratic</option>
                  <option value="friendly">Friendly</option>
                  <option value="exam">Exam Mode</option>
                  <option value="motivational">Motivational</option>
                  <option value="technical">Technical</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                  <option value="reading">Reading/Writing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Culture</label>
                <select
                  value={selectedCulture}
                  onChange={(e) => setSelectedCulture(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="global">Global</option>
                  <option value="western">Western</option>
                  <option value="eastern">Eastern</option>
                  <option value="latin">Latin</option>
                  <option value="african">African</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="language">Language</option>
                  <option value="history">History</option>
                  <option value="art">Art</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={runTeachingOptimization}
              disabled={isOptimizing}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? '🤖 AI is optimizing...' : '🚀 Run Optimization Analysis'}
            </button>
          </div>

          {/* Optimization Results */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Latest Optimization Results</h4>
            
            {optimizationResult ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">Optimized Method</h5>
                  <p className="text-green-700">{optimizationResult.optimized_method}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(optimizationResult.effectiveness_score * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Effectiveness</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      +{Math.round(optimizationResult.predicted_improvement * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Improvement</div>
                  </div>
                </div>
                
                <div>
                  <h6 className="font-medium text-gray-800 mb-2">Recommended Adaptations</h6>
                  <ul className="space-y-1">
                    {optimizationResult.recommended_adaptations?.map((adaptation: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {adaptation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>Run an optimization analysis to see AI-powered teaching recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Self-Improving Curriculum AI */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📚 Self-Improving Curriculum AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculumOptimizations.map((curriculum) => (
            <div key={curriculum.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{curriculum.subject}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  v{curriculum.version}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{curriculum.topic}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance:</span>
                  <span className={`font-medium ${getEffectivenessColor(curriculum.global_performance_score)}`}>
                    {Math.round(curriculum.global_performance_score * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-medium text-gray-800">
                    {Math.round(curriculum.completion_rate * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Satisfaction:</span>
                  <span className="font-medium text-gray-800">
                    {Math.round(curriculum.user_satisfaction * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <h6 className="text-xs font-medium text-gray-600 mb-1">Improvements:</h6>
                <div className="text-xs text-gray-500">
                  {curriculum.improvement_suggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index}>• {suggestion}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Federated Learning Network */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🌐 Federated Learning Network</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {federatedModels.map((model) => (
            <div key={model.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{model.model_name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  model.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {model.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 capitalize">{model.model_type} Model</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className={`font-medium ${getAccuracyColor(model.global_accuracy)}`}>
                    {Math.round(model.global_accuracy * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contributions:</span>
                  <span className="font-medium text-gray-800">
                    {model.local_contributions.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Privacy Hash:</span>
                  <span className="font-mono text-xs text-gray-500">
                    {model.privacy_preserving_hash.substring(0, 8)}...
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Created: {new Date(model.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">🔍 Global Learning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {teachingOptimizations.length}
            </div>
            <div className="text-indigo-700">Teaching Methods Analyzed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {curriculumOptimizations.length}
            </div>
            <div className="text-purple-700">Curriculum Modules Optimized</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {federatedModels.filter(m => m.is_active).length}
            </div>
            <div className="text-blue-700">Active Learning Models</div>
          </div>
        </div>
      </div>

      {/* Value Impact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">💰 Billion-Dollar Value Impact</h3>
        <div className="space-y-2 text-green-700">
          <p>• <strong>Teaching Optimization Engine:</strong> Analyzes millions of interactions to discover optimal teaching methods</p>
          <p>• <strong>Self-Improving Curriculum:</strong> Continuously updates lessons based on global performance data</p>
          <p>• <strong>Federated Learning Network:</strong> Each user's AI learns locally and anonymously improves the global model</p>
          <p>• <strong>Valuation Potential:</strong> $500M–$1B+ as foundation for AGI-style education AI</p>
        </div>
      </div>
    </div>
  )
}