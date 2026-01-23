'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Heart, Star, MessageCircle, Settings, Plus, RefreshCw, Zap, BookOpen, Target, Users, Smile } from 'lucide-react'

interface AICompanionAvatar {
  id: string
  companionName: string
  personalityType: string
  companionType: string
  appearanceData: any
  behaviorPatterns: any
  emotionalSupport: any
  relationshipLevel: number
  experiencePoints: number
  createdAt: string
  isActive: boolean
}

interface CompanionInteraction {
  id: string
  interactionType: string
  content: string
  emotionalTone: string
  userResponse: string
  userEmotion: string
  effectivenessScore: number
  createdAt: string
}

export default function AICompanionAvatars() {
  const [companions, setCompanions] = useState<AICompanionAvatar[]>([])
  const [interactions, setInteractions] = useState<CompanionInteraction[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCompanion, setNewCompanion] = useState({
    companionName: '',
    personalityType: 'encouraging',
    companionType: 'study_buddy'
  })

  useEffect(() => {
    loadCompanionAvatars()
    loadInteractions()
  }, [])

  const loadCompanionAvatars = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockCompanions: AICompanionAvatar[] = [
        {
          id: '1',
          companionName: 'Alex',
          personalityType: 'encouraging',
          companionType: 'study_buddy',
          appearanceData: {
            gender: 'non_binary',
            age: 'young_adult',
            clothing: 'casual',
            accessories: ['glasses', 'notebook'],
            colors: ['blue', 'green']
          },
          behaviorPatterns: {
            learningStyle: 'visual',
            communicationStyle: 'friendly',
            motivationLevel: 'high',
            patienceLevel: 'very_high'
          },
          emotionalSupport: {
            empathyLevel: 0.9,
            encouragementFrequency: 'high',
            stressRecognition: true,
            moodBoosting: true
          },
          relationshipLevel: 8,
          experiencePoints: 2450,
          createdAt: '2024-01-10T10:30:00Z',
          isActive: true
        },
        {
          id: '2',
          companionName: 'Dr. Quantum',
          personalityType: 'analytical',
          companionType: 'tutor',
          appearanceData: {
            gender: 'male',
            age: 'middle_aged',
            clothing: 'formal',
            accessories: ['lab_coat', 'calculator'],
            colors: ['purple', 'silver']
          },
          behaviorPatterns: {
            learningStyle: 'logical',
            communicationStyle: 'precise',
            motivationLevel: 'medium',
            patienceLevel: 'high'
          },
          emotionalSupport: {
            empathyLevel: 0.7,
            encouragementFrequency: 'medium',
            stressRecognition: true,
            moodBoosting: false
          },
          relationshipLevel: 6,
          experiencePoints: 1890,
          createdAt: '2024-01-08T14:20:00Z',
          isActive: true
        },
        {
          id: '3',
          companionName: 'Luna',
          personalityType: 'creative',
          companionType: 'mentor',
          appearanceData: {
            gender: 'female',
            age: 'young',
            clothing: 'artistic',
            accessories: ['paint_brush', 'sketchbook'],
            colors: ['pink', 'gold']
          },
          behaviorPatterns: {
            learningStyle: 'creative',
            communicationStyle: 'inspiring',
            motivationLevel: 'very_high',
            patienceLevel: 'high'
          },
          emotionalSupport: {
            empathyLevel: 0.95,
            encouragementFrequency: 'very_high',
            stressRecognition: true,
            moodBoosting: true
          },
          relationshipLevel: 9,
          experiencePoints: 3200,
          createdAt: '2024-01-05T09:15:00Z',
          isActive: true
        }
      ]

      setCompanions(mockCompanions)
    } catch (error) {
      console.error('Failed to load companion avatars:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadInteractions = async () => {
    try {
      // Simulate API call - replace with actual Supabase calls
      const mockInteractions: CompanionInteraction[] = [
        {
          id: '1',
          interactionType: 'encouragement',
          content: 'Great job on that math problem! You\'re really improving!',
          emotionalTone: 'positive',
          userResponse: 'Thank you! I was struggling with that concept.',
          userEmotion: 'grateful',
          effectivenessScore: 0.92,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          interactionType: 'explanation',
          content: 'Let me break down this physics concept step by step...',
          emotionalTone: 'patient',
          userResponse: 'That makes so much more sense now!',
          userEmotion: 'understanding',
          effectivenessScore: 0.88,
          createdAt: '2024-01-15T09:45:00Z'
        },
        {
          id: '3',
          interactionType: 'motivation',
          content: 'I believe in you! You\'ve overcome challenges before and you can do it again.',
          emotionalTone: 'encouraging',
          userResponse: 'You\'re right, I can do this!',
          userEmotion: 'motivated',
          effectivenessScore: 0.95,
          createdAt: '2024-01-15T08:20:00Z'
        }
      ]

      setInteractions(mockInteractions)
    } catch (error) {
      console.error('Failed to load interactions:', error)
    }
  }

  const createCompanion = async () => {
    try {
      const newCompanionData: AICompanionAvatar = {
        id: Date.now().toString(),
        companionName: newCompanion.companionName,
        personalityType: newCompanion.personalityType,
        companionType: newCompanion.companionType,
        appearanceData: {
          gender: 'non_binary',
          age: 'young_adult',
          clothing: 'casual',
          accessories: [],
          colors: ['blue', 'green']
        },
        behaviorPatterns: {
          learningStyle: 'visual',
          communicationStyle: 'friendly',
          motivationLevel: 'high',
          patienceLevel: 'high'
        },
        emotionalSupport: {
          empathyLevel: 0.8,
          encouragementFrequency: 'high',
          stressRecognition: true,
          moodBoosting: true
        },
        relationshipLevel: 1,
        experiencePoints: 0,
        createdAt: new Date().toISOString(),
        isActive: true
      }

      setCompanions([...companions, newCompanionData])
      setNewCompanion({ companionName: '', personalityType: 'encouraging', companionType: 'study_buddy' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create companion:', error)
    }
  }

  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'encouraging':
        return 'bg-green-100 text-green-800'
      case 'analytical':
        return 'bg-blue-100 text-blue-800'
      case 'creative':
        return 'bg-purple-100 text-purple-800'
      case 'supportive':
        return 'bg-pink-100 text-pink-800'
      case 'curious':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompanionTypeColor = (type: string) => {
    switch (type) {
      case 'study_buddy':
        return 'bg-blue-100 text-blue-800'
      case 'tutor':
        return 'bg-purple-100 text-purple-800'
      case 'mentor':
        return 'bg-green-100 text-green-800'
      case 'friend':
        return 'bg-pink-100 text-pink-800'
      case 'coach':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRelationshipLevel = (level: number) => {
    if (level >= 8) return { text: 'Best Friend', color: 'text-green-600' }
    if (level >= 6) return { text: 'Close Friend', color: 'text-blue-600' }
    if (level >= 4) return { text: 'Good Friend', color: 'text-yellow-600' }
    if (level >= 2) return { text: 'Acquaintance', color: 'text-orange-600' }
    return { text: 'New Friend', color: 'text-gray-600' }
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading AI companions...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Companion Avatars</h2>
            <p className="text-gray-600">
              Students have a personal AI friend that follows them through subjects, like an emotional learning partner.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Companion</span>
          </button>
        </div>
      </div>

      {/* Create Companion Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New AI Companion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Companion Name</label>
              <input
                type="text"
                value={newCompanion.companionName}
                onChange={(e) => setNewCompanion({ ...newCompanion, companionName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter companion name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
              <select
                value={newCompanion.personalityType}
                onChange={(e) => setNewCompanion({ ...newCompanion, personalityType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="encouraging">Encouraging</option>
                <option value="analytical">Analytical</option>
                <option value="creative">Creative</option>
                <option value="supportive">Supportive</option>
                <option value="curious">Curious</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Companion Type</label>
              <select
                value={newCompanion.companionType}
                onChange={(e) => setNewCompanion({ ...newCompanion, companionType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="study_buddy">Study Buddy</option>
                <option value="tutor">Tutor</option>
                <option value="mentor">Mentor</option>
                <option value="friend">Friend</option>
                <option value="coach">Coach</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createCompanion}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Companion
            </button>
          </div>
        </div>
      )}

      {/* Companions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {companions.map((companion) => {
          const relationship = getRelationshipLevel(companion.relationshipLevel)
          const companionInteractions = interactions.filter(interaction => 
            interaction.content.includes(companion.companionName)
          )
          
          return (
            <div
              key={companion.id}
              className={`bg-white border-2 rounded-lg p-6 transition-all cursor-pointer ${
                selectedCompanion === companion.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCompanion(selectedCompanion === companion.id ? null : companion.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{companion.companionName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPersonalityColor(companion.personalityType)}`}>
                        {companion.personalityType}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCompanionTypeColor(companion.companionType)}`}>
                        {companion.companionType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${relationship.color}`}>
                    {relationship.text}
                  </div>
                  <div className="text-xs text-gray-500">Level {companion.relationshipLevel}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Experience Points</span>
                  <span className="font-semibold">{companion.experiencePoints.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Empathy Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${companion.emotionalSupport.empathyLevel * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold">{Math.round(companion.emotionalSupport.empathyLevel * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Learning Style</div>
                    <div className="font-semibold capitalize">{companion.behaviorPatterns.learningStyle}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Communication</div>
                    <div className="font-semibold capitalize">{companion.behaviorPatterns.communicationStyle}</div>
                  </div>
                </div>
              </div>

              {selectedCompanion === companion.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-3">Recent Interactions ({companionInteractions.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {companionInteractions.slice(0, 3).map((interaction) => (
                      <div key={interaction.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{interaction.interactionType}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-500">
                              {Math.round(interaction.effectivenessScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{interaction.content}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded-full ${
                            interaction.emotionalTone === 'positive' ? 'bg-green-100 text-green-700' :
                            interaction.emotionalTone === 'encouraging' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {interaction.emotionalTone}
                          </span>
                          <span>{new Date(interaction.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Now</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {companions.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No AI companions yet</h3>
          <p className="text-gray-500 mb-4">Create your first AI learning partner</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Companion
          </button>
        </div>
      )}
    </div>
  )
}