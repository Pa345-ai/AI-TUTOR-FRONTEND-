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
  connectionType: 'prerequisite' | 'related' | 'applies_to' | 'contradicts' | 'builds_on'
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
  patternType: 'learning_style' | 'attention_pattern' | 'memory_pattern' | 'problem_solving'
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
  metricType: 'knowledge_growth' | 'skill_development' | 'cognitive_health' | 'learning_efficiency'
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

// Create a new cognitive twin
export async function createCognitiveTwin(
  userId: string,
  twinName: string,
  cognitiveStyle: string = 'mixed',
  learningPace: string = 'moderate'
): Promise<string> {
  const { data, error } = await supabase
    .from('cognitive_twins')
    .insert({
      user_id: userId,
      twin_name: twinName,
      cognitive_style: cognitiveStyle,
      learning_pace: learningPace,
      knowledge_graph: {},
      skill_levels: {},
      learning_preferences: {},
      cognitive_biases: {},
      ai_insights: {},
      predicted_performance: {},
      recommended_strategies: []
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Get cognitive twin by user ID
export async function getCognitiveTwin(userId: string): Promise<CognitiveTwin | null> {
  const { data, error } = await supabase
    .from('cognitive_twins')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

// Update cognitive twin
export async function updateCognitiveTwin(
  twinId: string,
  updates: Partial<CognitiveTwin>
): Promise<void> {
  const { error } = await supabase
    .from('cognitive_twins')
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('id', twinId)

  if (error) throw error
}

// Update cognitive performance metrics
export async function updateCognitivePerformance(
  twinId: string,
  cognitiveScore: number,
  memoryRetention: number,
  learningEfficiency: number,
  problemSolving: number
): Promise<void> {
  const { error } = await supabase
    .from('cognitive_twins')
    .update({
      overall_cognitive_score: cognitiveScore,
      memory_retention_rate: memoryRetention,
      learning_efficiency: learningEfficiency,
      problem_solving_ability: problemSolving,
      last_updated: new Date().toISOString()
    })
    .eq('id', twinId)

  if (error) throw error
}

// =====================================================
// KNOWLEDGE NODE FUNCTIONS
// =====================================================

// Add a knowledge node
export async function addKnowledgeNode(
  twinId: string,
  nodeType: string,
  subjectArea: string,
  topic: string,
  content: string,
  difficultyLevel: number = 5
): Promise<string> {
  const { data, error } = await supabase
    .from('knowledge_nodes')
    .insert({
      twin_id: twinId,
      node_type: nodeType,
      subject_area: subjectArea,
      topic: topic,
      content: content,
      difficulty_level: difficultyLevel,
      first_learned_at: new Date().toISOString(),
      last_reviewed_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Get knowledge nodes for a twin
export async function getKnowledgeNodes(twinId: string): Promise<KnowledgeNode[]> {
  const { data, error } = await supabase
    .from('knowledge_nodes')
    .select('*')
    .eq('twin_id', twinId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Update knowledge node
export async function updateKnowledgeNode(
  nodeId: string,
  updates: Partial<KnowledgeNode>
): Promise<void> {
  const { error } = await supabase
    .from('knowledge_nodes')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', nodeId)

  if (error) throw error
}

// Delete knowledge node
export async function deleteKnowledgeNode(nodeId: string): Promise<void> {
  const { error } = await supabase
    .from('knowledge_nodes')
    .delete()
    .eq('id', nodeId)

  if (error) throw error
}

// =====================================================
// KNOWLEDGE CONNECTION FUNCTIONS
// =====================================================

// Add knowledge connection
export async function addKnowledgeConnection(
  twinId: string,
  sourceNodeId: string,
  targetNodeId: string,
  connectionType: string,
  strength: number = 0.5,
  confidence: number = 0.5
): Promise<string> {
  const { data, error } = await supabase
    .from('knowledge_connections')
    .insert({
      twin_id: twinId,
      source_node_id: sourceNodeId,
      target_node_id: targetNodeId,
      connection_type: connectionType,
      strength: strength,
      confidence: confidence
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Get knowledge connections for a twin
export async function getKnowledgeConnections(twinId: string): Promise<KnowledgeConnection[]> {
  const { data, error } = await supabase
    .from('knowledge_connections')
    .select('*')
    .eq('twin_id', twinId)

  if (error) throw error
  return data || []
}

// =====================================================
// LEARNING PREDICTION FUNCTIONS
// =====================================================

// Create learning prediction
export async function createLearningPrediction(
  twinId: string,
  predictionType: string,
  subjectArea: string,
  timeHorizon: string,
  predictedValue: number,
  confidenceLevel: number,
  predictionFactors: any,
  modelVersion: string = 'v2.1.3'
): Promise<string> {
  const expiresAt = new Date()
  const timeHorizonDays = {
    '1_week': 7,
    '1_month': 30,
    '3_months': 90,
    '6_months': 180,
    '1_year': 365
  }[timeHorizon] || 30
  
  expiresAt.setDate(expiresAt.getDate() + timeHorizonDays)

  const { data, error } = await supabase
    .from('learning_predictions')
    .insert({
      twin_id: twinId,
      prediction_type: predictionType,
      subject_area: subjectArea,
      time_horizon: timeHorizon,
      predicted_value: predictedValue,
      confidence_level: confidenceLevel,
      prediction_factors: predictionFactors,
      model_version: modelVersion,
      expires_at: expiresAt.toISOString()
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Get learning predictions for a twin
export async function getLearningPredictions(twinId: string): Promise<LearningPrediction[]> {
  const { data, error } = await supabase
    .from('learning_predictions')
    .select('*')
    .eq('twin_id', twinId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Update prediction with actual value
export async function updatePredictionWithActual(
  predictionId: string,
  actualValue: number
): Promise<void> {
  const { data: prediction, error: fetchError } = await supabase
    .from('learning_predictions')
    .select('predicted_value')
    .eq('id', predictionId)
    .single()

  if (fetchError) throw fetchError

  const predictionAccuracy = 1 - Math.abs(prediction.predicted_value - actualValue) / 100

  const { error } = await supabase
    .from('learning_predictions')
    .update({
      actual_value: actualValue,
      prediction_accuracy: predictionAccuracy,
      validated_at: new Date().toISOString()
    })
    .eq('id', predictionId)

  if (error) throw error
}

// =====================================================
// MEMORY REPLAY SESSION FUNCTIONS
// =====================================================

// Create memory replay session
export async function createMemoryReplaySession(
  twinId: string,
  sessionName: string,
  sessionType: string,
  subjectArea: string,
  topic: string,
  durationMinutes: number,
  performanceScore: number,
  sessionData: any
): Promise<string> {
  const { data, error } = await supabase
    .from('memory_replay_sessions')
    .insert({
      twin_id: twinId,
      session_name: sessionName,
      session_type: sessionType,
      subject_area: subjectArea,
      topic: topic,
      duration_minutes: durationMinutes,
      performance_score: performanceScore,
      ...sessionData,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// Get memory replay sessions for a twin
export async function getMemoryReplaySessions(twinId: string): Promise<MemoryReplaySession[]> {
  const { data, error } = await supabase
    .from('memory_replay_sessions')
    .select('*')
    .eq('twin_id', twinId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get memory replay session by ID
export async function getMemoryReplaySession(sessionId: string): Promise<MemoryReplaySession | null> {
  const { data, error } = await supabase
    .from('memory_replay_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

// =====================================================
// COGNITIVE PATTERN FUNCTIONS
// =====================================================

// Get cognitive patterns for a twin
export async function getCognitivePatterns(twinId: string): Promise<CognitivePattern[]> {
  const { data, error } = await supabase
    .from('cognitive_patterns')
    .select('*')
    .eq('twin_id', twinId)
    .eq('is_active', true)
    .order('discovered_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Create cognitive pattern
export async function createCognitivePattern(
  twinId: string,
  patternType: string,
  patternName: string,
  patternDescription: string,
  patternData: any,
  frequency: number,
  strength: number,
  impactScore: number
): Promise<string> {
  const { data, error } = await supabase
    .from('cognitive_patterns')
    .insert({
      twin_id: twinId,
      pattern_type: patternType,
      pattern_name: patternName,
      pattern_description: patternDescription,
      pattern_data: patternData,
      frequency: frequency,
      strength: strength,
      impact_score: impactScore,
      discovered_at: new Date().toISOString(),
      last_observed_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// =====================================================
// ANALYTICS FUNCTIONS
// =====================================================

// Get cognitive twin analytics
export async function getCognitiveTwinAnalytics(twinId: string): Promise<CognitiveTwinAnalytics[]> {
  const { data, error } = await supabase
    .from('cognitive_twin_analytics')
    .select('*')
    .eq('twin_id', twinId)
    .order('measurement_date', { ascending: false })

  if (error) throw error
  return data || []
}

// Create analytics entry
export async function createAnalyticsEntry(
  twinId: string,
  metricType: string,
  metricName: string,
  metricValue: number,
  metricUnit: string,
  measurementDate: string,
  timePeriod: string,
  additionalData: any = {}
): Promise<string> {
  const { data, error } = await supabase
    .from('cognitive_twin_analytics')
    .insert({
      twin_id: twinId,
      metric_type: metricType,
      metric_name: metricName,
      metric_value: metricValue,
      metric_unit: metricUnit,
      measurement_date: measurementDate,
      time_period: timePeriod,
      ...additionalData
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Get cognitive twin insights
export async function getCognitiveTwinInsights(twinId: string): Promise<any> {
  const { data, error } = await supabase
    .rpc('get_cognitive_twin_insights', { p_twin_id: twinId })

  if (error) throw error
  return data
}

// Get all cognitive twins for a user
export async function getAllCognitiveTwins(userId: string): Promise<CognitiveTwin[]> {
  const { data, error } = await supabase
    .from('cognitive_twins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

// Subscribe to cognitive twin changes
export const subscribeToCognitiveTwin = (userId: string, callback: (twin: CognitiveTwin) => void) => {
  return supabase
    .channel('cognitive_twin_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cognitive_twins',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as CognitiveTwin)
    })
    .subscribe()
}

// Subscribe to knowledge node changes
export const subscribeToKnowledgeNodes = (twinId: string, callback: (node: KnowledgeNode) => void) => {
  return supabase
    .channel('knowledge_nodes_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'knowledge_nodes',
      filter: `twin_id=eq.${twinId}`
    }, (payload) => {
      callback(payload.new as KnowledgeNode)
    })
    .subscribe()
}

// Subscribe to learning prediction changes
export const subscribeToLearningPredictions = (twinId: string, callback: (prediction: LearningPrediction) => void) => {
  return supabase
    .channel('learning_predictions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'learning_predictions',
      filter: `twin_id=eq.${twinId}`
    }, (payload) => {
      callback(payload.new as LearningPrediction)
    })
    .subscribe()
}

// Subscribe to memory replay session changes
export const subscribeToMemoryReplaySessions = (twinId: string, callback: (session: MemoryReplaySession) => void) => {
  return supabase
    .channel('memory_replay_sessions_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'memory_replay_sessions',
      filter: `twin_id=eq.${twinId}`
    }, (payload) => {
      callback(payload.new as MemoryReplaySession)
    })
    .subscribe()
}