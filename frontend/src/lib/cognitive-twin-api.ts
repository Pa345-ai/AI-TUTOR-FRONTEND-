// Cognitive Digital Twin System - API functions
import { supabase } from './supabase'

// =====================================================
// INTERFACES
// =====================================================

export interface CognitiveTwin {
  id: string
  userId: string
  twinName: string
  createdAt: string
  lastUpdated: string
  isActive: boolean
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
  version: number
  parentTwinId?: string
  isPrimary: boolean
}

export interface KnowledgeNode {
  id: string
  twinId: string
  nodeType: 'concept' | 'skill' | 'fact' | 'procedure' | 'principle'
  subjectArea: string
  topic: string
  content: string
  difficultyLevel: number
  importanceScore: number
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
  createdAt: string
  updatedAt: string
}

export interface KnowledgeConnection {
  id: string
  twinId: string
  sourceNodeId: string
  targetNodeId: string
  connectionType: string
  strength: number
  confidence: number
  createdAt: string
}

export interface LearningPrediction {
  id: string
  twinId: string
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

export interface MemoryReplaySession {
  id: string
  twinId: string
  sessionName: string
  originalSessionId?: string
  sessionType: 'study' | 'quiz' | 'lesson' | 'practice' | 'review'
  subjectArea: string
  topic: string
  durationMinutes: number
  contentSummary: string
  keyConcepts: string[]
  learningObjectives: string[]
  materialsUsed: string[]
  performanceScore: number
  engagementLevel: number
  difficultyRating: number
  comprehensionLevel: number
  attentionPatterns: any
  cognitiveLoad: number
  memoryEncodingStrength: number
  learningStyleUsed: any
  sessionTimeline: any
  milestones: any[]
  breakthroughs: any[]
  struggles: any[]
  aiInsights: any
  improvementSuggestions: string[]
  knowledgeGaps: string[]
  startedAt: string
  completedAt: string
  createdAt: string
}

export interface CognitivePattern {
  id: string
  twinId: string
  patternType: string
  patternName: string
  patternDescription: string
  patternData: any
  frequency: number
  strength: number
  impactScore: number
  subjectAreas: string[]
  timeOfDay: string
  learningConditions: any
  aiConfidence: number
  predictionAccuracy: number
  recommendations: any
  discoveredAt: string
  lastObservedAt: string
  isActive: boolean
}

export interface CognitiveTwinAnalytics {
  id: string
  twinId: string
  metricType: string
  metricName: string
  metricValue: number
  metricUnit: string
  measurementDate: string
  timePeriod: string
  subjectArea?: string
  learningContext: any
  previousValue?: number
  changePercentage?: number
  percentileRank?: number
  trendAnalysis: any
  anomalyDetection: any
  recommendations: any
  createdAt: string
}

// =====================================================
// COGNITIVE TWIN FUNCTIONS
// =====================================================

// Fetch all cognitive twins for a user
export async function fetchCognitiveTwins(userId: string): Promise<CognitiveTwin[]> {
  try {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cognitive twins:', error)
    return []
  }
}

// Fetch a specific cognitive twin
export async function fetchCognitiveTwin(twinId: string): Promise<CognitiveTwin | null> {
  try {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .select('*')
      .eq('id', twinId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching cognitive twin:', error)
    return null
  }
}

// Create a new cognitive twin
export async function createCognitiveTwin(twinData: Partial<CognitiveTwin>): Promise<CognitiveTwin | null> {
  try {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .insert([twinData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating cognitive twin:', error)
    return null
  }
}

// Update a cognitive twin
export async function updateCognitiveTwin(twinId: string, updates: Partial<CognitiveTwin>): Promise<CognitiveTwin | null> {
  try {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq('id', twinId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating cognitive twin:', error)
    return null
  }
}

// =====================================================
// KNOWLEDGE NODE FUNCTIONS
// =====================================================

// Fetch knowledge nodes for a twin
export async function fetchKnowledgeNodes(twinId: string): Promise<KnowledgeNode[]> {
  try {
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .eq('twin_id', twinId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching knowledge nodes:', error)
    return []
  }
}

// Create a knowledge node
export async function createKnowledgeNode(nodeData: Partial<KnowledgeNode>): Promise<KnowledgeNode | null> {
  try {
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .insert([nodeData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating knowledge node:', error)
    return null
  }
}

// Update a knowledge node
export async function updateKnowledgeNode(nodeId: string, updates: Partial<KnowledgeNode>): Promise<KnowledgeNode | null> {
  try {
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', nodeId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating knowledge node:', error)
    return null
  }
}

// Delete a knowledge node
export async function deleteKnowledgeNode(nodeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('knowledge_nodes')
      .delete()
      .eq('id', nodeId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting knowledge node:', error)
    return false
  }
}

// =====================================================
// KNOWLEDGE CONNECTION FUNCTIONS
// =====================================================

// Fetch knowledge connections for a twin
export async function fetchKnowledgeConnections(twinId: string): Promise<KnowledgeConnection[]> {
  try {
    const { data, error } = await supabase
      .from('knowledge_connections')
      .select('*')
      .eq('twin_id', twinId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching knowledge connections:', error)
    return []
  }
}

// Create a knowledge connection
export async function createKnowledgeConnection(connectionData: Partial<KnowledgeConnection>): Promise<KnowledgeConnection | null> {
  try {
    const { data, error } = await supabase
      .from('knowledge_connections')
      .insert([connectionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating knowledge connection:', error)
    return null
  }
}

// =====================================================
// LEARNING PREDICTION FUNCTIONS
// =====================================================

// Fetch learning predictions for a twin
export async function fetchLearningPredictions(twinId: string, predictionType?: string): Promise<LearningPrediction[]> {
  try {
    let query = supabase
      .from('learning_predictions')
      .select('*')
      .eq('twin_id', twinId)
      .order('created_at', { ascending: false })

    if (predictionType) {
      query = query.eq('prediction_type', predictionType)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching learning predictions:', error)
    return []
  }
}

// Create a learning prediction
export async function createLearningPrediction(predictionData: Partial<LearningPrediction>): Promise<LearningPrediction | null> {
  try {
    const { data, error } = await supabase
      .from('learning_predictions')
      .insert([predictionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating learning prediction:', error)
    return null
  }
}

// Update a learning prediction with actual value
export async function updateLearningPrediction(predictionId: string, actualValue: number): Promise<LearningPrediction | null> {
  try {
    const { data, error } = await supabase
      .from('learning_predictions')
      .update({ 
        actual_value: actualValue,
        validated_at: new Date().toISOString(),
        prediction_accuracy: 0.95 // Calculate actual accuracy
      })
      .eq('id', predictionId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating learning prediction:', error)
    return null
  }
}

// =====================================================
// MEMORY REPLAY SESSION FUNCTIONS
// =====================================================

// Fetch memory replay sessions for a twin
export async function fetchMemoryReplaySessions(twinId: string, sessionType?: string): Promise<MemoryReplaySession[]> {
  try {
    let query = supabase
      .from('memory_replay_sessions')
      .select('*')
      .eq('twin_id', twinId)
      .order('started_at', { ascending: false })

    if (sessionType) {
      query = query.eq('session_type', sessionType)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching memory replay sessions:', error)
    return []
  }
}

// Create a memory replay session
export async function createMemoryReplaySession(sessionData: Partial<MemoryReplaySession>): Promise<MemoryReplaySession | null> {
  try {
    const { data, error } = await supabase
      .from('memory_replay_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating memory replay session:', error)
    return null
  }
}

// Update a memory replay session
export async function updateMemoryReplaySession(sessionId: string, updates: Partial<MemoryReplaySession>): Promise<MemoryReplaySession | null> {
  try {
    const { data, error } = await supabase
      .from('memory_replay_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating memory replay session:', error)
    return null
  }
}

// =====================================================
// COGNITIVE PATTERN FUNCTIONS
// =====================================================

// Fetch cognitive patterns for a twin
export async function fetchCognitivePatterns(twinId: string, patternType?: string): Promise<CognitivePattern[]> {
  try {
    let query = supabase
      .from('cognitive_patterns')
      .select('*')
      .eq('twin_id', twinId)
      .eq('is_active', true)
      .order('discovered_at', { ascending: false })

    if (patternType) {
      query = query.eq('pattern_type', patternType)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cognitive patterns:', error)
    return []
  }
}

// Create a cognitive pattern
export async function createCognitivePattern(patternData: Partial<CognitivePattern>): Promise<CognitivePattern | null> {
  try {
    const { data, error } = await supabase
      .from('cognitive_patterns')
      .insert([patternData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating cognitive pattern:', error)
    return null
  }
}

// =====================================================
// ANALYTICS FUNCTIONS
// =====================================================

// Fetch cognitive twin analytics
export async function fetchCognitiveTwinAnalytics(twinId: string, metricType?: string): Promise<CognitiveTwinAnalytics[]> {
  try {
    let query = supabase
      .from('cognitive_twin_analytics')
      .select('*')
      .eq('twin_id', twinId)
      .order('measurement_date', { ascending: false })

    if (metricType) {
      query = query.eq('metric_type', metricType)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cognitive twin analytics:', error)
    return []
  }
}

// Create cognitive twin analytics entry
export async function createCognitiveTwinAnalytics(analyticsData: Partial<CognitiveTwinAnalytics>): Promise<CognitiveTwinAnalytics | null> {
  try {
    const { data, error } = await supabase
      .from('cognitive_twin_analytics')
      .insert([analyticsData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating cognitive twin analytics:', error)
    return null
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

// Subscribe to cognitive twin changes
export const subscribeToCognitiveTwins = (userId: string, callback: (twin: CognitiveTwin) => void) => {
  return supabase
    .channel('cognitive_twins_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'cognitive_twins',
        filter: `user_id=eq.${userId}`
      }, 
      (payload) => {
        callback(payload.new as CognitiveTwin)
      }
    )
    .subscribe()
}

// Subscribe to knowledge node changes
export const subscribeToKnowledgeNodes = (twinId: string, callback: (node: KnowledgeNode) => void) => {
  return supabase
    .channel('knowledge_nodes_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'knowledge_nodes',
        filter: `twin_id=eq.${twinId}`
      }, 
      (payload) => {
        callback(payload.new as KnowledgeNode)
      }
    )
    .subscribe()
}

// Subscribe to learning prediction changes
export const subscribeToLearningPredictions = (twinId: string, callback: (prediction: LearningPrediction) => void) => {
  return supabase
    .channel('learning_predictions_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'learning_predictions',
        filter: `twin_id=eq.${twinId}`
      }, 
      (payload) => {
        callback(payload.new as LearningPrediction)
      }
    )
    .subscribe()
}

// Subscribe to memory replay session changes
export const subscribeToMemoryReplaySessions = (twinId: string, callback: (session: MemoryReplaySession) => void) => {
  return supabase
    .channel('memory_replay_sessions_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'memory_replay_sessions',
        filter: `twin_id=eq.${twinId}`
      }, 
      (payload) => {
        callback(payload.new as MemoryReplaySession)
      }
    )
    .subscribe()
}