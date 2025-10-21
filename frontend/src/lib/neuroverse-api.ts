// NeuroVerse - Global Learning Metaverse API functions
import { supabase } from './supabase'

// =====================================================
// VIRTUAL ENVIRONMENTS API
// =====================================================

export interface VirtualEnvironment {
  id: string
  name: string
  description: string
  environmentType: string
  subjectArea: string
  difficultyLevel: string
  vrSupported: boolean
  arSupported: boolean
  webSupported: boolean
  maxCapacity: number
  environmentData: any
  physicsSettings: any
  audioSettings: any
  lightingSettings: any
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface VirtualObject {
  id: string
  environmentId: string
  name: string
  objectType: string
  category: string
  position: any
  rotation: any
  scale: any
  meshData: any
  interactionData: any
  physicsProperties: any
  createdAt: string
  updatedAt: string
}

export interface VirtualScene {
  id: string
  environmentId: string
  sceneName: string
  sceneType: string
  description: string
  learningObjectives: string[]
  sceneData: any
  durationMinutes: number
  difficultyLevel: string
  prerequisites: any
  createdAt: string
  updatedAt: string
}

// Fetch all virtual environments
export async function fetchVirtualEnvironments(
  environmentType?: string,
  subjectArea?: string
): Promise<VirtualEnvironment[]> {
  try {
    let query = supabase
      .from('virtual_environments')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (environmentType) {
      query = query.eq('environment_type', environmentType)
    }
    if (subjectArea) {
      query = query.eq('subject_area', subjectArea)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch virtual environments:', error)
    throw error
  }
}

// Fetch virtual objects for an environment
export async function fetchVirtualObjects(environmentId: string): Promise<VirtualObject[]> {
  try {
    const { data, error } = await supabase
      .from('virtual_objects')
      .select('*')
      .eq('environment_id', environmentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch virtual objects:', error)
    throw error
  }
}

// Fetch virtual scenes for an environment
export async function fetchVirtualScenes(environmentId: string): Promise<VirtualScene[]> {
  try {
    const { data, error } = await supabase
      .from('virtual_scenes')
      .select('*')
      .eq('environment_id', environmentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch virtual scenes:', error)
    throw error
  }
}

// =====================================================
// AI AVATAR SYSTEM API
// =====================================================

export interface AITeacherAvatar {
  id: string
  name: string
  personalityType: string
  teachingStyle: string
  appearanceData: any
  voiceSettings: any
  gestureLibrary: any
  knowledgeDomains: string[]
  emotionalIntelligence: any
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AICompanionAvatar {
  id: string
  userId: string
  companionName: string
  personalityType: string
  companionType: string
  appearanceData: any
  voiceSettings: any
  behaviorPatterns: any
  emotionalSupport: any
  learningPreferences: any
  relationshipLevel: number
  experiencePoints: number
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AvatarInteraction {
  id: string
  userId: string
  avatarId: string
  avatarType: string
  interactionType: string
  content: string
  context: any
  emotionalTone: string
  userResponse: string
  userEmotion: string
  effectivenessScore: number
  createdAt: string
}

// Fetch AI teacher avatars
export async function fetchAITeacherAvatars(): Promise<AITeacherAvatar[]> {
  try {
    const { data, error } = await supabase
      .from('ai_teacher_avatars')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch AI teacher avatars:', error)
    throw error
  }
}

// Fetch user's AI companion avatars
export async function fetchAICompanionAvatars(userId: string): Promise<AICompanionAvatar[]> {
  try {
    const { data, error } = await supabase
      .from('ai_companion_avatars')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch AI companion avatars:', error)
    throw error
  }
}

// Create a new AI companion avatar
export async function createAICompanionAvatar(
  userId: string,
  companionData: Omit<AICompanionAvatar, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<AICompanionAvatar> {
  try {
    const { data, error } = await supabase
      .from('ai_companion_avatars')
      .insert({ ...companionData, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create AI companion avatar:', error)
    throw error
  }
}

// Log avatar interaction
export async function logAvatarInteraction(interaction: Omit<AvatarInteraction, 'id' | 'createdAt'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('avatar_interactions')
      .insert(interaction)

    if (error) throw error
  } catch (error) {
    console.error('Failed to log avatar interaction:', error)
    throw error
  }
}

// =====================================================
// MIXED REALITY LABS API
// =====================================================

export interface VirtualExperiment {
  id: string
  name: string
  subjectArea: string
  experimentType: string
  difficultyLevel: string
  description: string
  learningObjectives: string[]
  equipmentRequired: string[]
  procedureSteps: any[]
  expectedOutcomes: any
  variables: any
  safetyNotes: string[]
  simulationData: any
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface ExperimentSession {
  id: string
  userId: string
  experimentId: string
  environmentId: string
  sessionData: any
  results: any
  accuracyScore: number
  safetyScore: number
  learningOutcomes: string[]
  durationMinutes: number
  completedAt: string | null
  createdAt: string
}

export interface VirtualLabEquipment {
  id: string
  name: string
  equipmentType: string
  subjectArea: string
  functionality: any
  physicsProperties: any
  safetyProtocols: string[]
  usageInstructions: any
  meshData: any
  createdAt: string
  updatedAt: string
}

// Fetch virtual experiments
export async function fetchVirtualExperiments(
  subjectArea?: string,
  difficultyLevel?: string
): Promise<VirtualExperiment[]> {
  try {
    let query = supabase
      .from('virtual_experiments')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (subjectArea) {
      query = query.eq('subject_area', subjectArea)
    }
    if (difficultyLevel) {
      query = query.eq('difficulty_level', difficultyLevel)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch virtual experiments:', error)
    throw error
  }
}

// Start an experiment session
export async function startExperimentSession(
  userId: string,
  experimentId: string,
  environmentId: string
): Promise<ExperimentSession> {
  try {
    const { data, error } = await supabase
      .from('experiment_sessions')
      .insert({
        user_id: userId,
        experiment_id: experimentId,
        environment_id: environmentId,
        session_data: {},
        results: {},
        accuracy_score: 0,
        safety_score: 0,
        learning_outcomes: [],
        duration_minutes: 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to start experiment session:', error)
    throw error
  }
}

// Update experiment session
export async function updateExperimentSession(
  sessionId: string,
  updates: Partial<ExperimentSession>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('experiment_sessions')
      .update(updates)
      .eq('id', sessionId)

    if (error) throw error
  } catch (error) {
    console.error('Failed to update experiment session:', error)
    throw error
  }
}

// Fetch virtual lab equipment
export async function fetchVirtualLabEquipment(subjectArea?: string): Promise<VirtualLabEquipment[]> {
  try {
    let query = supabase
      .from('virtual_lab_equipment')
      .select('*')
      .order('created_at', { ascending: false })

    if (subjectArea) {
      query = query.eq('subject_area', subjectArea)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch virtual lab equipment:', error)
    throw error
  }
}

// =====================================================
// VR/AR SESSION MANAGEMENT API
// =====================================================

export interface VRARSession {
  id: string
  userId: string
  sessionType: string
  deviceType: string
  environmentId: string
  sceneId: string
  sessionData: any
  performanceMetrics: any
  comfortMetrics: any
  startedAt: string
  endedAt: string | null
  durationMinutes: number
}

export interface CollaborativeSession {
  id: string
  sessionName: string
  environmentId: string
  sceneId: string
  maxParticipants: number
  currentParticipants: number
  sessionType: string
  privacyLevel: string
  sessionData: any
  startedAt: string
  endedAt: string | null
  createdBy: string
}

export interface SessionParticipant {
  id: string
  sessionId: string
  userId: string
  avatarId: string
  role: string
  permissions: any
  joinedAt: string
  leftAt: string | null
  participationData: any
}

// Start a VR/AR session
export async function startVRARSession(
  userId: string,
  sessionType: string,
  deviceType: string,
  environmentId: string,
  sceneId: string
): Promise<VRARSession> {
  try {
    const { data, error } = await supabase
      .from('vr_ar_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        device_type: deviceType,
        environment_id: environmentId,
        scene_id: sceneId,
        session_data: {},
        performance_metrics: {},
        comfort_metrics: {}
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to start VR/AR session:', error)
    throw error
  }
}

// Update VR/AR session
export async function updateVRARSession(
  sessionId: string,
  updates: Partial<VRARSession>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('vr_ar_sessions')
      .update(updates)
      .eq('id', sessionId)

    if (error) throw error
  } catch (error) {
    console.error('Failed to update VR/AR session:', error)
    throw error
  }
}

// Fetch user's VR/AR sessions
export async function fetchVRARSessions(userId: string): Promise<VRARSession[]> {
  try {
    const { data, error } = await supabase
      .from('vr_ar_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch VR/AR sessions:', error)
    throw error
  }
}

// Fetch collaborative sessions
export async function fetchCollaborativeSessions(): Promise<CollaborativeSession[]> {
  try {
    const { data, error } = await supabase
      .from('collaborative_sessions')
      .select('*')
      .is('ended_at', null)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch collaborative sessions:', error)
    throw error
  }
}

// Join collaborative session
export async function joinCollaborativeSession(
  sessionId: string,
  userId: string,
  avatarId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('session_participants')
      .insert({
        session_id: sessionId,
        user_id: userId,
        avatar_id: avatarId,
        role: 'participant',
        permissions: {}
      })

    if (error) throw error
  } catch (error) {
    console.error('Failed to join collaborative session:', error)
    throw error
  }
}

// =====================================================
// NEUROVERSE ANALYTICS API
// =====================================================

export interface NeuroVerseAnalytics {
  totalEnvironments: number
  activeSessions: number
  totalUsers: number
  experimentsCompleted: number
  companionAvatars: number
  averageSessionTime: number
  vrSessions: number
  arSessions: number
  webSessions: number
  performanceTrends: Array<{
    date: string
    sessions: number
    users: number
    experiments: number
    satisfaction: number
  }>
  environmentPopularity: Array<{
    environmentName: string
    visits: number
    averageTime: number
    satisfaction: number
  }>
  companionEffectiveness: Array<{
    companionName: string
    personalityType: string
    effectivenessScore: number
    userSatisfaction: number
    interactions: number
  }>
  experimentSuccess: Array<{
    experimentName: string
    subjectArea: string
    successRate: number
    averageTime: number
    difficultyLevel: string
  }>
  deviceUsage: Array<{
    deviceType: string
    usageCount: number
    averagePerformance: number
    comfortScore: number
  }>
}

// Fetch NeuroVerse analytics
export async function fetchNeuroVerseAnalytics(timeRange: string = '30d'): Promise<NeuroVerseAnalytics> {
  try {
    // This would typically involve complex queries and aggregations
    // For now, we'll return a mock structure
    const { data: environments } = await supabase
      .from('virtual_environments')
      .select('count', { count: 'exact' })
      .eq('is_active', true)

    const { data: sessions } = await supabase
      .from('vr_ar_sessions')
      .select('count', { count: 'exact' })

    const { data: experiments } = await supabase
      .from('experiment_sessions')
      .select('count', { count: 'exact' })

    const { data: companions } = await supabase
      .from('ai_companion_avatars')
      .select('count', { count: 'exact' })

    return {
      totalEnvironments: environments?.length || 0,
      activeSessions: sessions?.length || 0,
      totalUsers: 12500, // This would be calculated from actual data
      experimentsCompleted: experiments?.length || 0,
      companionAvatars: companions?.length || 0,
      averageSessionTime: 45, // This would be calculated from actual data
      vrSessions: 1200, // This would be calculated from actual data
      arSessions: 800, // This would be calculated from actual data
      webSessions: 340, // This would be calculated from actual data
      performanceTrends: [], // This would be calculated from actual data
      environmentPopularity: [], // This would be calculated from actual data
      companionEffectiveness: [], // This would be calculated from actual data
      experimentSuccess: [], // This would be calculated from actual data
      deviceUsage: [] // This would be calculated from actual data
    }
  } catch (error) {
    console.error('Failed to fetch NeuroVerse analytics:', error)
    throw error
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

// Subscribe to VR/AR session updates
export const subscribeToVRARSessions = (userId: string, callback: (session: VRARSession) => void) => {
  return supabase
    .channel('vr_ar_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'vr_ar_sessions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}

// Subscribe to collaborative session updates
export const subscribeToCollaborativeSessions = (callback: (session: CollaborativeSession) => void) => {
  return supabase
    .channel('collaborative_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'collaborative_sessions'
    }, callback)
    .subscribe()
}

// Subscribe to avatar interaction updates
export const subscribeToAvatarInteractions = (userId: string, callback: (interaction: AvatarInteraction) => void) => {
  return supabase
    .channel('avatar_interactions_changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'avatar_interactions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}

// Subscribe to experiment session updates
export const subscribeToExperimentSessions = (userId: string, callback: (session: ExperimentSession) => void) => {
  return supabase
    .channel('experiment_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'experiment_sessions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}