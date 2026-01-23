'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Target, BarChart3, RefreshCw, AlertTriangle, CheckCircle, Clock, Zap, Brain, BookOpen, Users } from 'lucide-react'

interface LearningPrediction {
  id: string
  predictionType: 'performance' | 'retention' | 'difficulty' | 'engagement'
  subjectArea: string
  timeHorizon: string
  predictedValue: number
  confidenceLevel: number
  predictionFactors: any
  modelVersion: string
  actualValue?: number
  predictionAccuracy?: number
  validatedAt?: string
  createdAt: string
  expiresAt: string
}

interface PerformanceForecast {
  timeHorizon: string
  predictedScore: number
  confidenceLevel: number
  factors: string[]
  recommendations: string[]
}

interface PredictiveLearningEngineProps {
  twinId?: string
}

export default function PredictiveLearningEngine({ twinId }: PredictiveLearningEngineProps) {
  const [predictions, setPredictions] = useState<LearningPrediction[]>([])
  const [performanceForecasts, setPerformanceForecasts] = useState<PerformanceForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'retention' | 'difficulty' | 'engagement'>('overview')
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('3_months')

  useEffect(() => {
    loadPredictiveData()
  }, [twinId])

  const loadPredictiveData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock predictions data
      const mockPredictions: LearningPrediction[] = [
        {
          id: 'pred-1',
          predictionType: 'performance',
          subjectArea: 'mathematics',
          timeHorizon: '1_month',
          predictedValue: 89.2,
          confidenceLevel: 0.87,
          predictionFactors: {
            currentPerformance: 87.5,
            studyConsistency: 0.92,
            difficultyTrend: 'decreasing',
            engagementLevel: 0.88
          },
          modelVersion: 'v2.1',
          createdAt: '2024-01-20T10:00:00Z',
          expiresAt: '2024-02-20T10:00:00Z'
        },
        {
          id: 'pred-2',
          predictionType: 'retention',
          subjectArea: 'programming',
          timeHorizon: '3_months',
          predictedValue: 85.7,
          confidenceLevel: 0.82,
          predictionFactors: {
            reviewFrequency: 0.78,
            practiceTime: 120,
            conceptComplexity: 0.65,
            previousRetention: 0.83
          },
          modelVersion: 'v2.1',
          actualValue: 87.3,
          predictionAccuracy: 0.94,
          validatedAt: '2024-01-15T14:30:00Z',
          createdAt: '2024-01-10T10:00:00Z',
          expiresAt: '2024-04-10T10:00:00Z'
        },
        {
          id: 'pred-3',
          predictionType: 'difficulty',
          subjectArea: 'science',
          timeHorizon: '6_months',
          predictedValue: 7.2,
          confidenceLevel: 0.79,
          predictionFactors: {
            currentDifficulty: 6.8,
            learningVelocity: 0.15,
            conceptPrerequisites: 0.72,
            cognitiveLoad: 0.68
          },
          modelVersion: 'v2.1',
          createdAt: '2024-01-18T09:00:00Z',
          expiresAt: '2024-07-18T09:00:00Z'
        },
        {
          id: 'pred-4',
          predictionType: 'engagement',
          subjectArea: 'history',
          timeHorizon: '1_year',
          predictedValue: 92.1,
          confidenceLevel: 0.91,
          predictionFactors: {
            interestLevel: 0.94,
            learningStyle: 'visual',
            contentRelevance: 0.89,
            socialLearning: 0.76
          },
          modelVersion: 'v2.1',
          createdAt: '2024-01-19T11:00:00Z',
          expiresAt: '2025-01-19T11:00:00Z'
        }
      ]

      // Mock performance forecasts
      const mockForecasts: PerformanceForecast[] = [
        {
          timeHorizon: '1_month',
          predictedScore: 89.2,
          confidenceLevel: 0.87,
          factors: ['Consistent study habits', 'Strong foundation', 'Active engagement'],
          recommendations: ['Maintain current pace', 'Focus on weak areas', 'Practice problem-solving']
        },
        {
          timeHorizon: '3_months',
          predictedScore: 91.5,
          confidenceLevel: 0.82,
          factors: ['Learning acceleration', 'Skill consolidation', 'Pattern recognition'],
          recommendations: ['Increase complexity gradually', 'Teach others', 'Explore advanced topics']
        },
        {
          timeHorizon: '6_months',
          predictedScore: 94.8,
          confidenceLevel: 0.76,
          factors: ['Mastery development', 'Cross-domain connections', 'Creative application'],
          recommendations: ['Pursue advanced projects', 'Mentor others', 'Explore research opportunities']
        },
        {
          timeHorizon: '1_year',
          predictedScore: 97.2,
          confidenceLevel: 0.71,
          factors: ['Expert-level proficiency', 'Innovation capability', 'Teaching expertise'],
          recommendations: ['Lead study groups', 'Contribute to community', 'Pursue advanced certifications']
        }
      ]

      setPredictions(mockPredictions)
      setPerformanceForecasts(mockForecasts)
    } catch (error) {
      console.error('Failed to load predictive data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPredictionTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <BarChart3 className="w-5 h-5" />
      case 'retention': return <Brain className="w-5 h-5" />
      case 'difficulty': return <AlertTriangle className="w-5 h-5" />
      case 'engagement': return <Zap className="w-5 h-5" />
      default: return <Target className="w-5 h-5" />
    }
  }

  const getPredictionTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'retention': return 'text-green-600 bg-green-50 border-green-200'
      case 'difficulty': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'engagement': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTimeHorizonLabel = (horizon: string) => {
    switch (horizon) {
      case '1_week': return '1 Week'
      case '1_month': return '1 Month'
      case '3_months': return '3 Months'
      case '6_months': return '6 Months'
      case '1_year': return '1 Year'
      default: return horizon
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.8) return 'text-blue-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-gray-500'
    if (accuracy >= 0.9) return 'text-green-600'
    if (accuracy >= 0.8) return 'text-blue-600'
    if (accuracy >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading predictive insights...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Predictive Learning Engine</h1>
            <p className="text-gray-600">AI-powered performance forecasting and learning optimization</p>
          </div>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Forecast Period:</span>
          <select
            value={selectedTimeHorizon}
            onChange={(e) => setSelectedTimeHorizon(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="1_year">1 Year</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'retention', label: 'Retention', icon: Brain },
              { id: 'difficulty', label: 'Difficulty', icon: AlertTriangle },
              { id: 'engagement', label: 'Engagement', icon: Zap }
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
          {/* Performance Forecast Timeline */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Forecast Timeline</h2>
            <div className="space-y-4">
              {performanceForecasts.map((forecast, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{getTimeHorizonLabel(forecast.timeHorizon)}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{forecast.predictedScore}%</span>
                        <span className={`text-sm font-medium ${getConfidenceColor(forecast.confidenceLevel)}`}>
                          {Math.round(forecast.confidenceLevel * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Key Factors</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {forecast.factors.map((factor, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {forecast.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <Target className="w-3 h-3 text-blue-500" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'performance', label: 'Performance Predictions', count: predictions.filter(p => p.predictionType === 'performance').length },
              { type: 'retention', label: 'Retention Predictions', count: predictions.filter(p => p.predictionType === 'retention').length },
              { type: 'difficulty', label: 'Difficulty Predictions', count: predictions.filter(p => p.predictionType === 'difficulty').length },
              { type: 'engagement', label: 'Engagement Predictions', count: predictions.filter(p => p.predictionType === 'engagement').length }
            ].map((summary) => (
              <div key={summary.type} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">{summary.label}</h3>
                  {getPredictionTypeIcon(summary.type)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{summary.count}</div>
                <div className="text-sm text-green-600">Active predictions</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Performance Predictions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {predictions.filter(p => p.predictionType === 'performance').map((prediction) => (
              <div key={prediction.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPredictionTypeColor(prediction.predictionType)}`}>
                      {getPredictionTypeIcon(prediction.predictionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{prediction.subjectArea}</h3>
                      <p className="text-sm text-gray-600">{getTimeHorizonLabel(prediction.timeHorizon)} forecast</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{prediction.predictedValue}%</div>
                    <div className={`text-sm font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prediction Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(prediction.predictionFactors).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Model Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model Version</span>
                        <span className="font-medium">{prediction.modelVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created</span>
                        <span className="font-medium">{new Date(prediction.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires</span>
                        <span className="font-medium">{new Date(prediction.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {prediction.actualValue && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Prediction Validated</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Actual Value: </span>
                        <span className="font-medium">{prediction.actualValue}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Accuracy: </span>
                        <span className={`font-medium ${getAccuracyColor(prediction.predictionAccuracy)}`}>
                          {Math.round((prediction.predictionAccuracy || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'retention' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Retention Predictions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {predictions.filter(p => p.predictionType === 'retention').map((prediction) => (
              <div key={prediction.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPredictionTypeColor(prediction.predictionType)}`}>
                      {getPredictionTypeIcon(prediction.predictionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{prediction.subjectArea}</h3>
                      <p className="text-sm text-gray-600">Knowledge retention forecast</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{prediction.predictedValue}%</div>
                    <div className={`text-sm font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.predictedValue}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Expected knowledge retention rate for {getTimeHorizonLabel(prediction.timeHorizon)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Retention Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(prediction.predictionFactors).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>Review every {Math.round(24 / (prediction.predictionFactors.reviewFrequency || 1))} hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <BookOpen className="w-3 h-3 text-green-500" />
                        <span>Practice for {Math.round((prediction.predictionFactors.practiceTime || 60) / 60)} hours weekly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span>Teach others to reinforce learning</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'difficulty' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Difficulty Predictions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {predictions.filter(p => p.predictionType === 'difficulty').map((prediction) => (
              <div key={prediction.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPredictionTypeColor(prediction.predictionType)}`}>
                      {getPredictionTypeIcon(prediction.predictionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{prediction.subjectArea}</h3>
                      <p className="text-sm text-gray-600">Expected difficulty level</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{prediction.predictedValue}/10</div>
                    <div className={`text-sm font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Difficulty Level</span>
                    <span className="text-sm font-medium">{prediction.predictedValue}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        prediction.predictedValue >= 8 ? 'bg-red-500' :
                        prediction.predictedValue >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(prediction.predictedValue / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(prediction.predictionFactors).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preparation Strategy</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span>Review prerequisites thoroughly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>Allocate extra study time</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span>Seek help from peers or tutors</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Engagement Predictions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {predictions.filter(p => p.predictionType === 'engagement').map((prediction) => (
              <div key={prediction.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPredictionTypeColor(prediction.predictionType)}`}>
                      {getPredictionTypeIcon(prediction.predictionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{prediction.subjectArea}</h3>
                      <p className="text-sm text-gray-600">Predicted engagement level</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{prediction.predictedValue}%</div>
                    <div className={`text-sm font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                      {Math.round(prediction.confidenceLevel * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.predictedValue}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Expected engagement level for {getTimeHorizonLabel(prediction.timeHorizon)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(prediction.predictionFactors).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement Boosters</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>Use interactive learning methods</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>Join study groups or forums</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-green-500" />
                        <span>Set clear learning goals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}