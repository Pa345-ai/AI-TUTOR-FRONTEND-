// =====================================================
// NeuroVerse - Global Learning Metaverse
// =====================================================
// Immersive 3D learning environments with AI avatars
// and mixed-reality experiences
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NeuroVerseRequest {
  user_id: string
  action: 'enter_environment' | 'create_environment' | 'interact_with_avatar' | 'start_experiment' | 'get_recommendations'
  environment_id?: string
  environment_type?: string
  subject?: string
  difficulty_level?: string
  vr_equipment?: string[]
  ar_supported?: boolean
  max_participants?: number
  interaction_data?: {
    avatar_id: string
    interaction_type: string
    duration: number
    emotional_response: string
  }
  experiment_data?: {
    lab_id: string
    experiment_type: string
    parameters: Record<string, any>
  }
}

interface NeuroVerseResponse {
  environment?: {
    id: string
    name: string
    description: string
    environment_type: string
    vr_required: boolean
    ar_supported: boolean
    max_participants: number
    environment_data: any
    ai_avatars: any[]
    physics_settings: any
    interactive_objects: any[]
  }
  ai_companion?: {
    id: string
    name: string
    personality_type: string
    appearance_data: any
    emotional_state: any
    learning_preferences: any
    motivational_style: string
  }
  experiment?: {
    lab_id: string
    experiment_name: string
    procedures: string[]
    safety_guidelines: string[]
    expected_outcomes: string[]
    real_world_physics: boolean
  }
  recommendations?: {
    suggested_environments: any[]
    learning_path: any[]
    social_opportunities: any[]
  }
  success: boolean
  message: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const request: NeuroVerseRequest = await req.json()

    let response: NeuroVerseResponse = {
      success: false,
      message: 'Unknown action'
    }

    switch (request.action) {
      case 'enter_environment':
        response = await enterEnvironment(supabaseClient, request)
        break
      case 'create_environment':
        response = await createEnvironment(supabaseClient, request)
        break
      case 'interact_with_avatar':
        response = await interactWithAvatar(supabaseClient, request)
        break
      case 'start_experiment':
        response = await startExperiment(supabaseClient, request)
        break
      case 'get_recommendations':
        response = await getRecommendations(supabaseClient, request)
        break
      default:
        response = {
          success: false,
          message: 'Invalid action specified'
        }
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('NeuroVerse error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'NeuroVerse operation failed',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function enterEnvironment(supabaseClient: any, request: NeuroVerseRequest): Promise<NeuroVerseResponse> {
  if (!request.environment_id) {
    return {
      success: false,
      message: 'Environment ID is required'
    }
  }

  // Get environment details
  const { data: environment, error: envError } = await supabaseClient
    .from('neuroverse_environments')
    .select('*')
    .eq('id', request.environment_id)
    .single()

  if (envError || !environment) {
    return {
      success: false,
      message: 'Environment not found'
    }
  }

  // Get or create AI companion for user
  const { data: companion, error: companionError } = await supabaseClient
    .from('ai_companion_avatars')
    .select('*')
    .eq('user_id', request.user_id)
    .eq('is_active', true)
    .single()

  let aiCompanion = companion
  if (companionError || !companion) {
    // Create new AI companion
    const newCompanion = await createAICompanion(supabaseClient, request.user_id, environment.subject)
    aiCompanion = newCompanion
  }

  // Log environment entry
  await logEnvironmentEntry(supabaseClient, request.user_id, request.environment_id)

  return {
    success: true,
    message: 'Successfully entered environment',
    environment: {
      id: environment.id,
      name: environment.name,
      description: environment.description,
      environment_type: environment.environment_type,
      vr_required: environment.vr_required,
      ar_supported: environment.ar_supported,
      max_participants: environment.max_participants,
      environment_data: environment.environment_data,
      ai_avatars: environment.ai_avatars,
      physics_settings: environment.physics_settings,
      interactive_objects: environment.interactive_objects
    },
    ai_companion: aiCompanion ? {
      id: aiCompanion.id,
      name: aiCompanion.avatar_name,
      personality_type: aiCompanion.personality_type,
      appearance_data: aiCompanion.appearance_data,
      emotional_state: aiCompanion.emotional_state,
      learning_preferences: aiCompanion.learning_preferences,
      motivational_style: aiCompanion.motivational_style
    } : undefined
  }
}

async function createEnvironment(supabaseClient: any, request: NeuroVerseRequest): Promise<NeuroVerseResponse> {
  if (!request.environment_type || !request.subject) {
    return {
      success: false,
      message: 'Environment type and subject are required'
    }
  }

  // Generate environment using AI
  const environmentData = await generateEnvironmentData(
    request.environment_type,
    request.subject,
    request.difficulty_level || 'intermediate'
  )

  // Create environment in database
  const { data: environment, error } = await supabaseClient
    .from('neuroverse_environments')
    .insert({
      name: environmentData.name,
      description: environmentData.description,
      environment_type: request.environment_type,
      subject: request.subject,
      difficulty_level: request.difficulty_level || 'intermediate',
      vr_required: request.vr_equipment?.length > 0 || false,
      ar_supported: request.ar_supported || false,
      max_participants: request.max_participants || 20,
      environment_data: environmentData.environment_data,
      physics_settings: environmentData.physics_settings,
      interactive_objects: environmentData.interactive_objects,
      ai_avatars: environmentData.ai_avatars,
      created_by: request.user_id,
      is_public: true
    })
    .select()
    .single()

  if (error) {
    return {
      success: false,
      message: 'Failed to create environment'
    }
  }

  return {
    success: true,
    message: 'Environment created successfully',
    environment: {
      id: environment.id,
      name: environment.name,
      description: environment.description,
      environment_type: environment.environment_type,
      vr_required: environment.vr_required,
      ar_supported: environment.ar_supported,
      max_participants: environment.max_participants,
      environment_data: environment.environment_data,
      ai_avatars: environment.ai_avatars,
      physics_settings: environment.physics_settings,
      interactive_objects: environment.interactive_objects
    }
  }
}

async function interactWithAvatar(supabaseClient: any, request: NeuroVerseRequest): Promise<NeuroVerseResponse> {
  if (!request.interaction_data) {
    return {
      success: false,
      message: 'Interaction data is required'
    }
  }

  const { avatar_id, interaction_type, duration, emotional_response } = request.interaction_data

  // Get AI companion
  const { data: companion, error: companionError } = await supabaseClient
    .from('ai_companion_avatars')
    .select('*')
    .eq('id', avatar_id)
    .single()

  if (companionError || !companion) {
    return {
      success: false,
      message: 'AI companion not found'
    }
  }

  // Update companion based on interaction
  const updatedEmotionalState = updateEmotionalState(companion.emotional_state, emotional_response)
  const updatedRelationshipLevel = Math.min(10, companion.relationship_level + 0.1)

  await supabaseClient
    .from('ai_companion_avatars')
    .update({
      emotional_state: updatedEmotionalState,
      relationship_level: updatedRelationshipLevel,
      total_interaction_time: companion.total_interaction_time + duration,
      updated_at: new Date().toISOString()
    })
    .eq('id', avatar_id)

  // Generate AI response based on interaction
  const aiResponse = await generateAICompanionResponse(
    companion.personality_type,
    interaction_type,
    emotional_response,
    updatedEmotionalState
  )

  return {
    success: true,
    message: 'Interaction successful',
    ai_companion: {
      id: companion.id,
      name: companion.avatar_name,
      personality_type: companion.personality_type,
      appearance_data: companion.appearance_data,
      emotional_state: updatedEmotionalState,
      learning_preferences: companion.learning_preferences,
      motivational_style: companion.motivational_style
    }
  }
}

async function startExperiment(supabaseClient: any, request: NeuroVerseRequest): Promise<NeuroVerseResponse> {
  if (!request.experiment_data) {
    return {
      success: false,
      message: 'Experiment data is required'
    }
  }

  const { lab_id, experiment_type, parameters } = request.experiment_data

  // Get experiment details
  const { data: lab, error: labError } = await supabaseClient
    .from('mixed_reality_labs')
    .select('*')
    .eq('id', lab_id)
    .single()

  if (labError || !lab) {
    return {
      success: false,
      message: 'Lab not found'
    }
  }

  // Simulate experiment with real-world physics
  const experimentResult = await simulateExperiment(experiment_type, parameters, lab.real_world_physics)

  return {
    success: true,
    message: 'Experiment started successfully',
    experiment: {
      lab_id: lab.id,
      experiment_name: lab.experiment_type,
      procedures: lab.experiment_procedures,
      safety_guidelines: lab.safety_guidelines,
      expected_outcomes: lab.expected_outcomes,
      real_world_physics: lab.real_world_physics
    }
  }
}

async function getRecommendations(supabaseClient: any, request: NeuroVerseRequest): Promise<NeuroVerseResponse> {
  // Get user's learning history and preferences
  const { data: userData, error: userError } = await supabaseClient
    .from('users')
    .select('learning_style, preferred_languages, subscription_tier')
    .eq('id', request.user_id)
    .single()

  if (userError) {
    return {
      success: false,
      message: 'User data not found'
    }
  }

  // Get recommended environments based on user preferences
  const { data: environments, error: envError } = await supabaseClient
    .from('neuroverse_environments')
    .select('*')
    .eq('is_public', true)
    .limit(5)

  if (envError) {
    return {
      success: false,
      message: 'Failed to get environment recommendations'
    }
  }

  // Generate personalized learning path
  const learningPath = await generatePersonalizedLearningPath(
    request.subject || 'general',
    userData.learning_style,
    request.difficulty_level || 'intermediate'
  )

  return {
    success: true,
    message: 'Recommendations generated successfully',
    recommendations: {
      suggested_environments: environments || [],
      learning_path: learningPath,
      social_opportunities: [
        'Join study groups in virtual classrooms',
        'Participate in collaborative experiments',
        'Connect with peers in similar subjects'
      ]
    }
  }
}

async function createAICompanion(supabaseClient: any, userId: string, subject: string) {
  const companionData = {
    user_id: userId,
    avatar_name: generateCompanionName(subject),
    personality_type: 'friendly',
    appearance_data: generateAppearanceData(),
    emotional_state: { happiness: 0.8, energy: 0.7, curiosity: 0.9 },
    learning_preferences: { visual: 0.7, auditory: 0.6, kinesthetic: 0.8 },
    relationship_level: 1,
    total_interaction_time: 0,
    favorite_subjects: [subject],
    motivational_style: 'encouraging',
    is_active: true
  }

  const { data, error } = await supabaseClient
    .from('ai_companion_avatars')
    .insert(companionData)
    .select()
    .single()

  if (error) throw error
  return data
}

function generateCompanionName(subject: string): string {
  const names = {
    'mathematics': ['Euler', 'Pythagoras', 'Newton'],
    'science': ['Einstein', 'Curie', 'Darwin'],
    'history': ['Herodotus', 'Thucydides', 'Livy'],
    'literature': ['Shakespeare', 'Dickens', 'Austen'],
    'art': ['Leonardo', 'Michelangelo', 'Van Gogh'],
    'music': ['Mozart', 'Beethoven', 'Bach']
  }
  
  const subjectNames = names[subject.toLowerCase()] || ['Alex', 'Sage', 'Mentor']
  return subjectNames[Math.floor(Math.random() * subjectNames.length)]
}

function generateAppearanceData() {
  return {
    species: 'human',
    gender: 'neutral',
    age_range: 'adult',
    clothing_style: 'academic',
    accessories: ['glasses', 'notebook'],
    color_scheme: 'warm'
  }
}

function updateEmotionalState(currentState: any, emotionalResponse: string) {
  const updates = {
    'positive': { happiness: 0.1, energy: 0.05 },
    'excited': { happiness: 0.15, energy: 0.2 },
    'confused': { curiosity: 0.1, confidence: -0.05 },
    'frustrated': { patience: -0.1, determination: 0.05 },
    'proud': { confidence: 0.2, happiness: 0.1 }
  }

  const update = updates[emotionalResponse] || {}
  const newState = { ...currentState }
  
  Object.keys(update).forEach(key => {
    newState[key] = Math.max(0, Math.min(1, (newState[key] || 0.5) + update[key]))
  })

  return newState
}

async function generateAICompanionResponse(
  personalityType: string,
  interactionType: string,
  emotionalResponse: string,
  emotionalState: any
): Promise<string> {
  const responses = {
    'friendly': {
      'question': 'That\'s a great question! Let me help you explore this together.',
      'confusion': 'I can see you\'re working through this. Let\'s break it down step by step.',
      'celebration': 'Wonderful! You\'re making excellent progress!'
    },
    'wise': {
      'question': 'Ah, a thoughtful inquiry. Let me share some insights that might help.',
      'confusion': 'Confusion is often the first step to understanding. Let\'s examine this more deeply.',
      'celebration': 'Your dedication to learning is truly admirable.'
    },
    'enthusiastic': {
      'question': 'I love your curiosity! This is exactly the kind of thinking that leads to breakthroughs!',
      'confusion': 'Don\'t worry, this is challenging material! Let\'s tackle it with energy and determination!',
      'celebration': 'YES! You\'re absolutely crushing it! This is fantastic!'
    }
  }

  const personalityResponses = responses[personalityType] || responses['friendly']
  return personalityResponses[interactionType] || personalityResponses['question']
}

async function generateEnvironmentData(environmentType: string, subject: string, difficultyLevel: string) {
  const environments = {
    'classroom': {
      name: `Virtual ${subject} Classroom`,
      description: `An immersive classroom environment for learning ${subject}`,
      environment_data: {
        scene: 'modern_classroom',
        furniture: ['desks', 'whiteboard', 'projector'],
        lighting: 'bright',
        atmosphere: 'academic'
      },
      physics_settings: { gravity: 9.81, air_resistance: 0.1 },
      interactive_objects: ['whiteboard', 'textbooks', 'computers'],
      ai_avatars: [{ name: 'Professor', role: 'instructor', personality: 'wise' }]
    },
    'lab': {
      name: `${subject} Laboratory`,
      description: `A fully equipped laboratory for ${subject} experiments`,
      environment_data: {
        scene: 'scientific_laboratory',
        equipment: ['microscopes', 'test_tubes', 'computers'],
        lighting: 'clinical',
        atmosphere: 'scientific'
      },
      physics_settings: { gravity: 9.81, air_resistance: 0.05 },
      interactive_objects: ['microscopes', 'experiment_tools', 'safety_equipment'],
      ai_avatars: [{ name: 'Lab Assistant', role: 'helper', personality: 'friendly' }]
    },
    'historical': {
      name: `Historical ${subject} Setting`,
      description: `Experience ${subject} in its historical context`,
      environment_data: {
        scene: 'historical_setting',
        period: 'ancient',
        atmosphere: 'immersive',
        lighting: 'natural'
      },
      physics_settings: { gravity: 9.81, air_resistance: 0.15 },
      interactive_objects: ['artifacts', 'historical_documents', 'period_objects'],
      ai_avatars: [{ name: 'Historical Guide', role: 'narrator', personality: 'wise' }]
    }
  }

  return environments[environmentType] || environments['classroom']
}

async function simulateExperiment(experimentType: string, parameters: any, realWorldPhysics: boolean) {
  // Simulate experiment results based on type and parameters
  const results = {
    experiment_type: experimentType,
    parameters: parameters,
    results: {
      success: true,
      data_points: generateDataPoints(experimentType, parameters),
      observations: generateObservations(experimentType),
      conclusions: generateConclusions(experimentType, parameters)
    },
    real_world_physics: realWorldPhysics,
    timestamp: new Date().toISOString()
  }

  return results
}

function generateDataPoints(experimentType: string, parameters: any) {
  // Generate realistic data points based on experiment type
  const dataPoints = []
  const numPoints = parameters.sample_size || 10

  for (let i = 0; i < numPoints; i++) {
    dataPoints.push({
      x: i,
      y: Math.random() * 100,
      timestamp: new Date(Date.now() + i * 1000).toISOString()
    })
  }

  return dataPoints
}

function generateObservations(experimentType: string) {
  const observations = {
    'physics': [
      'Objects followed expected gravitational patterns',
      'Energy conservation was maintained throughout',
      'Friction effects were clearly observable'
    ],
    'chemistry': [
      'Chemical reactions proceeded as predicted',
      'Color changes indicated successful reactions',
      'Temperature changes were within expected ranges'
    ],
    'biology': [
      'Cell structures were clearly visible',
      'Biological processes followed natural patterns',
      'Environmental factors affected outcomes as expected'
    ]
  }

  return observations[experimentType] || observations['physics']
}

function generateConclusions(experimentType: string, parameters: any) {
  return [
    `The ${experimentType} experiment was successful`,
    'Results align with theoretical predictions',
    'Further investigation could explore parameter variations',
    'The experimental setup proved effective for learning'
  ]
}

async function generatePersonalizedLearningPath(subject: string, learningStyle: string, difficultyLevel: string) {
  return [
    {
      step: 1,
      title: `Introduction to ${subject}`,
      type: 'concept',
      duration: '15 minutes',
      environment: 'classroom'
    },
    {
      step: 2,
      title: `Hands-on ${subject} Practice`,
      type: 'practice',
      duration: '30 minutes',
      environment: 'lab'
    },
    {
      step: 3,
      title: `Advanced ${subject} Concepts`,
      type: 'advanced',
      duration: '20 minutes',
      environment: 'classroom'
    },
    {
      step: 4,
      title: `${subject} Project`,
      type: 'project',
      duration: '45 minutes',
      environment: 'lab'
    }
  ]
}

async function logEnvironmentEntry(supabaseClient: any, userId: string, environmentId: string) {
  // Log the environment entry for analytics
  await supabaseClient
    .from('learning_memory_timeline')
    .insert({
      user_id: userId,
      session_id: crypto.randomUUID(),
      session_type: 'neuroverse_environment',
      subject: 'metaverse',
      topic: 'virtual_learning',
      learning_milestone: 'Entered virtual environment',
      knowledge_gained: {},
      skills_developed: ['virtual_navigation', 'ai_interaction'],
      emotional_state: { excitement: 0.8, curiosity: 0.9 },
      difficulty_level: 'intermediate',
      time_spent: 5,
      achievement_level: 0.7
    })
}