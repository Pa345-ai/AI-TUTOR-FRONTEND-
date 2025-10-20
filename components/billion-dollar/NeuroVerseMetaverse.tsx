import React, { useState, useEffect } from 'react'

interface NeuroVerseMetaverseProps {
  userId: string
}

interface NeuroVerseEnvironment {
  id: string
  name: string
  description: string
  environment_type: string
  subject: string
  difficulty_level: string
  vr_required: boolean
  ar_supported: boolean
  max_participants: number
  environment_data: any
  physics_settings: any
  interactive_objects: any[]
  ai_avatars: any[]
  created_at: string
}

interface AICompanion {
  id: string
  name: string
  personality_type: string
  appearance_data: any
  emotional_state: any
  learning_preferences: any
  relationship_level: number
  motivational_style: string
  is_active: boolean
}

interface MixedRealityLab {
  id: string
  lab_name: string
  subject: string
  experiment_type: string
  difficulty_level: string
  lab_environment: any
  experiment_procedures: string[]
  safety_guidelines: string[]
  expected_outcomes: string[]
  real_world_physics: boolean
  vr_equipment_required: string[]
}

export const NeuroVerseMetaverse: React.FC<NeuroVerseMetaverseProps> = ({ userId }) => {
  const [environments, setEnvironments] = useState<NeuroVerseEnvironment[]>([])
  const [aiCompanion, setAICompanion] = useState<AICompanion | null>(null)
  const [mixedRealityLabs, setMixedRealityLabs] = useState<MixedRealityLab[]>([])
  const [currentEnvironment, setCurrentEnvironment] = useState<NeuroVerseEnvironment | null>(null)
  const [isEntering, setIsEntering] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newEnvironment, setNewEnvironment] = useState({
    name: '',
    description: '',
    environment_type: 'classroom',
    subject: 'mathematics',
    difficulty_level: 'intermediate',
    vr_required: false,
    ar_supported: false,
    max_participants: 20
  })

  useEffect(() => {
    loadNeuroVerseData()
  }, [])

  const loadNeuroVerseData = async () => {
    try {
      // Load environments
      const envResponse = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_environments' })
      })
      const envData = await envResponse.json()
      if (envData.success) {
        setEnvironments(envData.environments || [])
      }

      // Load AI companion
      const companionResponse = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_companion' })
      })
      const companionData = await companionResponse.json()
      if (companionData.success) {
        setAICompanion(companionData.companion)
      }

      // Load mixed reality labs
      const labsResponse = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, action: 'get_labs' })
      })
      const labsData = await labsResponse.json()
      if (labsData.success) {
        setMixedRealityLabs(labsData.labs || [])
      }
    } catch (error) {
      console.error('Error loading NeuroVerse data:', error)
    }
  }

  const enterEnvironment = async (environmentId: string) => {
    setIsEntering(true)
    try {
      const response = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'enter_environment',
          environment_id: environmentId
        })
      })

      const result = await response.json()
      if (result.success) {
        setCurrentEnvironment(result.environment)
        if (result.ai_companion) {
          setAICompanion(result.ai_companion)
        }
      }
    } catch (error) {
      console.error('Error entering environment:', error)
    } finally {
      setIsEntering(false)
    }
  }

  const createEnvironment = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'create_environment',
          ...newEnvironment
        })
      })

      const result = await response.json()
      if (result.success) {
        setEnvironments(prev => [result.environment, ...prev])
        setNewEnvironment({
          name: '',
          description: '',
          environment_type: 'classroom',
          subject: 'mathematics',
          difficulty_level: 'intermediate',
          vr_required: false,
          ar_supported: false,
          max_participants: 20
        })
      }
    } catch (error) {
      console.error('Error creating environment:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const interactWithCompanion = async (interactionType: string) => {
    if (!aiCompanion) return

    try {
      const response = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'interact_with_avatar',
          interaction_data: {
            avatar_id: aiCompanion.id,
            interaction_type: interactionType,
            duration: 5,
            emotional_response: 'positive'
          }
        })
      })

      const result = await response.json()
      if (result.success && result.ai_companion) {
        setAICompanion(result.ai_companion)
      }
    } catch (error) {
      console.error('Error interacting with companion:', error)
    }
  }

  const startExperiment = async (labId: string) => {
    try {
      const response = await fetch('/api/ai/neuroverse_metaverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'start_experiment',
          experiment_data: {
            lab_id: labId,
            experiment_type: 'physics_simulation',
            parameters: { gravity: 9.81, air_resistance: 0.1 }
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        // Handle experiment start
        console.log('Experiment started:', result.experiment)
      }
    } catch (error) {
      console.error('Error starting experiment:', error)
    }
  }

  const getEnvironmentIcon = (type: string) => {
    const icons = {
      'classroom': '🏫',
      'lab': '🧪',
      'historical': '🏛️',
      'space': '🚀',
      'underwater': '🐠',
      'forest': '🌲',
      'desert': '🏜️',
      'arctic': '❄️'
    }
    return icons[type] || '🌍'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRelationshipLevel = (level: number) => {
    if (level >= 8) return { text: 'Best Friends', color: 'text-purple-600' }
    if (level >= 6) return { text: 'Close Friends', color: 'text-blue-600' }
    if (level >= 4) return { text: 'Friends', color: 'text-green-600' }
    if (level >= 2) return { text: 'Acquaintances', color: 'text-yellow-600' }
    return { text: 'Strangers', color: 'text-gray-600' }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🌍 NeuroVerse - Global Learning Metaverse</h2>
        <p className="text-cyan-100">Immersive 3D learning environments with AI avatars and mixed-reality experiences</p>
      </div>

      {/* Current Environment */}
      {currentEnvironment && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {getEnvironmentIcon(currentEnvironment.environment_type)} {currentEnvironment.name}
              </h3>
              <p className="text-gray-600">{currentEnvironment.description}</p>
            </div>
            <button
              onClick={() => setCurrentEnvironment(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Exit Environment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Environment Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Type: {currentEnvironment.environment_type}</div>
                <div>Subject: {currentEnvironment.subject}</div>
                <div>Difficulty: {currentEnvironment.difficulty_level}</div>
                <div>Max Participants: {currentEnvironment.max_participants}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Technology</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>VR Required: {currentEnvironment.vr_required ? 'Yes' : 'No'}</div>
                <div>AR Supported: {currentEnvironment.ar_supported ? 'Yes' : 'No'}</div>
                <div>Interactive Objects: {currentEnvironment.interactive_objects.length}</div>
                <div>AI Avatars: {currentEnvironment.ai_avatars.length}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">AI Avatars</h4>
              <div className="space-y-2">
                {currentEnvironment.ai_avatars.map((avatar, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-lg">🤖</span>
                    <div>
                      <div className="text-sm font-medium">{avatar.name}</div>
                      <div className="text-xs text-gray-500">{avatar.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Companion */}
      {aiCompanion && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🤖 AI Class Companion</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{aiCompanion.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{aiCompanion.personality_type} • {aiCompanion.motivational_style}</p>
                  <p className={`text-sm font-medium ${getRelationshipLevel(aiCompanion.relationship_level).color}`}>
                    {getRelationshipLevel(aiCompanion.relationship_level).text} (Level {Math.round(aiCompanion.relationship_level)})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Emotional State</h5>
                  <div className="space-y-1">
                    {Object.entries(aiCompanion.emotional_state).map(([emotion, value]) => (
                      <div key={emotion} className="flex justify-between text-sm">
                        <span className="capitalize">{emotion}:</span>
                        <span className="font-medium">{Math.round(value * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Learning Preferences</h5>
                  <div className="space-y-1">
                    {Object.entries(aiCompanion.learning_preferences).map(([preference, value]) => (
                      <div key={preference} className="flex justify-between text-sm">
                        <span className="capitalize">{preference}:</span>
                        <span className="font-medium">{Math.round(value * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => interactWithCompanion('question')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Ask Question
                </button>
                <button
                  onClick={() => interactWithCompanion('celebration')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Celebrate
                </button>
                <button
                  onClick={() => interactWithCompanion('confusion')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Need Help
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-3">Companion Stats</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Interactions:</span>
                  <span className="font-medium">{aiCompanion.total_interaction_time || 0} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Relationship Level:</span>
                  <span className="font-medium">{Math.round(aiCompanion.relationship_level)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${aiCompanion.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                    {aiCompanion.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environments Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🌍 Virtual Learning Environments</h3>
          <button
            onClick={() => setNewEnvironment({...newEnvironment, name: 'New Environment'})}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Create Environment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {environments.map((environment) => (
            <div key={environment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getEnvironmentIcon(environment.environment_type)}</span>
                <div>
                  <h4 className="font-medium text-gray-800">{environment.name}</h4>
                  <p className="text-sm text-gray-600">{environment.subject}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{environment.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{environment.environment_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(environment.difficulty_level)}`}>
                    {environment.difficulty_level}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{environment.max_participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Technology:</span>
                  <div className="flex space-x-1">
                    {environment.vr_required && <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">VR</span>}
                    {environment.ar_supported && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">AR</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => enterEnvironment(environment.id)}
                disabled={isEntering}
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEntering ? 'Entering...' : 'Enter Environment'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mixed Reality Labs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🧪 Mixed Reality Labs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mixedRealityLabs.map((lab) => (
            <div key={lab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <h4 className="font-medium text-gray-800">{lab.lab_name}</h4>
                  <p className="text-sm text-gray-600">{lab.subject} • {lab.experiment_type}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lab.difficulty_level)}`}>
                    {lab.difficulty_level}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Physics:</span>
                  <span className={`font-medium ${lab.real_world_physics ? 'text-green-600' : 'text-gray-600'}`}>
                    {lab.real_world_physics ? 'Real World' : 'Simulated'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Equipment:</span>
                  <span className="font-medium">{lab.vr_equipment_required.length} items</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-800 mb-1">Safety Guidelines:</h5>
                <div className="text-xs text-gray-600">
                  {lab.safety_guidelines.slice(0, 2).map((guideline, index) => (
                    <div key={index}>• {guideline}</div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => startExperiment(lab.id)}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200"
              >
                Start Experiment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Value Impact */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
        <h3 className="text-lg font-semibold text-cyan-800 mb-3">💰 Billion-Dollar Value Impact</h3>
        <div className="space-y-2 text-cyan-700">
          <p>• <strong>Immersive 3D Classrooms:</strong> AI avatars teach in virtual labs, classrooms, and historical worlds</p>
          <p>• <strong>AI Class Companion Avatars:</strong> Personal AI friends that follow students through subjects</p>
          <p>• <strong>Mixed-Reality Labs:</strong> Virtual experiments with real-world physics for STEM education</p>
          <p>• <strong>Valuation Potential:</strong> $1B+ category with hardware partnerships (Meta, Apple Vision Pro)</p>
        </div>
      </div>
    </div>
  )
}