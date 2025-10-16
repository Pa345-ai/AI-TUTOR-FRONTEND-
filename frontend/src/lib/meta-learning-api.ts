// Meta-Learning Core API functions
import { supabase } from './supabase'

// =====================================================
// TEACHING OPTIMIZATION ENGINE API
// =====================================================

export interface TeachingStrategy {
  id: string
  name: string
  description: string
  category: string
  parameters: any
  effectivenessScore: number
  usageCount: number
  successRate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EffectivenessData {
  id: string
  strategyId: string
  userProfileHash: string
  personalityType: string
  learningStyle: string
  culturalContext: string
  ageGroup: string
  subjectArea: string
  difficultyLevel: string
  effectivenessScore: number
  sampleSize: number
  confidenceLevel: number
  lastUpdated: string
}

export interface TeachingInteraction {
  id: string
  userId: string
  strategyId: string
  interactionType: string
  contentHash: string
  userResponseType: string
  responseTimeMs: number
  userSatisfaction: number
  learningOutcome: string
  contextData: any
  createdAt: string
}

// Fetch all teaching strategies
export async function fetchTeachingStrategies(): Promise<TeachingStrategy[]> {
  try {
    const { data, error } = await supabase
      .from('teaching_strategies')
      .select('*')
      .eq('is_active', true)
      .order('effectiveness_score', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch teaching strategies:', error)
    throw error
  }
}

// Fetch effectiveness data for a specific strategy
export async function fetchStrategyEffectiveness(strategyId: string): Promise<EffectivenessData[]> {
  try {
    const { data, error } = await supabase
      .from('teaching_effectiveness')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('effectiveness_score', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch strategy effectiveness:', error)
    throw error
  }
}

// Log a teaching interaction
export async function logTeachingInteraction(interaction: Omit<TeachingInteraction, 'id' | 'createdAt'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('teaching_interactions')
      .insert(interaction)

    if (error) throw error
  } catch (error) {
    console.error('Failed to log teaching interaction:', error)
    throw error
  }
}

// Get personalized teaching strategy recommendations
export async function getPersonalizedStrategies(
  userProfileHash: string,
  subject: string,
  difficulty: string
): Promise<TeachingStrategy[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_personalized_teaching_strategy', {
        p_user_profile_hash: userProfileHash,
        p_subject: subject,
        p_difficulty: difficulty
      })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to get personalized strategies:', error)
    throw error
  }
}

// =====================================================
// SELF-IMPROVING CURRICULUM AI API
// =====================================================

export interface CurriculumPerformance {
  id: string
  topic: string
  subject: string
  difficultyLevel: string
  learningObjective: string
  globalSuccessRate: number
  averageCompletionTime: number
  dropoutRate: number
  userSatisfaction: number
  sampleSize: number
  lastAnalyzed: string
  createdAt: string
  updatedAt: string
}

export interface CurriculumRule {
  id: string
  ruleName: string
  conditionType: string
  conditionValue: number
  actionType: string
  actionParameters: any
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LearningPathOptimization {
  id: string
  userProfileHash: string
  subject: string
  originalPath: any
  optimizedPath: any
  optimizationReason: string
  performanceImprovement: number
  confidenceScore: number
  appliedAt: string
  createdAt: string
}

// Fetch curriculum performance data
export async function fetchCurriculumPerformance(
  subject?: string,
  difficulty?: string
): Promise<CurriculumPerformance[]> {
  try {
    let query = supabase
      .from('curriculum_performance')
      .select('*')
      .order('global_success_rate', { ascending: false })

    if (subject) {
      query = query.eq('subject', subject)
    }
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch curriculum performance:', error)
    throw error
  }
}

// Fetch curriculum adaptation rules
export async function fetchCurriculumRules(): Promise<CurriculumRule[]> {
  try {
    const { data, error } = await supabase
      .from('curriculum_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch curriculum rules:', error)
    throw error
  }
}

// Create a new curriculum rule
export async function createCurriculumRule(rule: Omit<CurriculumRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<CurriculumRule> {
  try {
    const { data, error } = await supabase
      .from('curriculum_rules')
      .insert(rule)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create curriculum rule:', error)
    throw error
  }
}

// Fetch learning path optimizations
export async function fetchLearningPathOptimizations(
  userProfileHash?: string,
  subject?: string
): Promise<LearningPathOptimization[]> {
  try {
    let query = supabase
      .from('learning_path_optimizations')
      .select('*')
      .order('applied_at', { ascending: false })

    if (userProfileHash) {
      query = query.eq('user_profile_hash', userProfileHash)
    }
    if (subject) {
      query = query.eq('subject', subject)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch learning path optimizations:', error)
    throw error
  }
}

// Calculate curriculum performance metrics
export async function calculateCurriculumPerformance(
  topic: string,
  subject: string,
  difficulty: string
): Promise<any> {
  try {
    const { data, error } = await supabase
      .rpc('calculate_curriculum_performance', {
        p_topic: topic,
        p_subject: subject,
        p_difficulty: difficulty
      })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to calculate curriculum performance:', error)
    throw error
  }
}

// =====================================================
// FEDERATED LEARNING NETWORK API
// =====================================================

export interface FederatedModel {
  id: string
  modelName: string
  modelType: string
  version: string
  modelMetadata: any
  performanceMetrics: any
  trainingSamples: number
  lastUpdated: string
  isActive: boolean
  createdAt: string
}

export interface FederatedRound {
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

export interface LocalUpdate {
  id: string
  modelId: string
  userHash: string
  updateMetadata: any
  performanceImprovement: number
  privacyBudget: number
  createdAt: string
}

// Fetch federated learning models
export async function fetchFederatedModels(): Promise<FederatedModel[]> {
  try {
    const { data, error } = await supabase
      .from('federated_models')
      .select('*')
      .eq('is_active', true)
      .order('last_updated', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch federated models:', error)
    throw error
  }
}

// Fetch federated learning rounds
export async function fetchFederatedRounds(modelId?: string): Promise<FederatedRound[]> {
  try {
    let query = supabase
      .from('federated_rounds')
      .select('*')
      .order('started_at', { ascending: false })

    if (modelId) {
      query = query.eq('model_id', modelId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch federated rounds:', error)
    throw error
  }
}

// Submit local model update
export async function submitLocalUpdate(update: Omit<LocalUpdate, 'id' | 'createdAt'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('local_model_updates')
      .insert(update)

    if (error) throw error
  } catch (error) {
    console.error('Failed to submit local update:', error)
    throw error
  }
}

// =====================================================
// META-LEARNING INSIGHTS API
// =====================================================

export interface MetaLearningInsight {
  id: string
  insightType: string
  insightData: any
  confidenceScore: number
  impactScore: number
  sampleSize: number
  createdAt: string
  expiresAt: string | null
}

export interface MetaLearningExperiment {
  id: string
  experimentName: string
  description: string
  hypothesis: string
  controlGroupConfig: any
  treatmentGroupConfig: any
  successMetrics: any
  startDate: string
  endDate: string | null
  status: string
  results: any
  createdAt: string
}

// Fetch meta-learning insights
export async function fetchMetaLearningInsights(
  insightType?: string,
  limit: number = 50
): Promise<MetaLearningInsight[]> {
  try {
    let query = supabase
      .from('meta_learning_insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (insightType) {
      query = query.eq('insight_type', insightType)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch meta-learning insights:', error)
    throw error
  }
}

// Fetch meta-learning experiments
export async function fetchMetaLearningExperiments(): Promise<MetaLearningExperiment[]> {
  try {
    const { data, error } = await supabase
      .from('meta_learning_experiments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch meta-learning experiments:', error)
    throw error
  }
}

// Create a new meta-learning experiment
export async function createMetaLearningExperiment(
  experiment: Omit<MetaLearningExperiment, 'id' | 'createdAt'>
): Promise<MetaLearningExperiment> {
  try {
    const { data, error } = await supabase
      .from('meta_learning_experiments')
      .insert(experiment)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create meta-learning experiment:', error)
    throw error
  }
}

// =====================================================
// ANALYTICS API
// =====================================================

export interface MetaLearningAnalytics {
  totalInsights: number
  activeExperiments: number
  globalImprovement: number
  federatedParticipants: number
  teachingStrategies: number
  curriculumUpdates: number
  performanceTrends: Array<{
    date: string
    improvement: number
    insights: number
    experiments: number
  }>
}

// Fetch meta-learning analytics
export async function fetchMetaLearningAnalytics(
  timeRange: string = '30d'
): Promise<MetaLearningAnalytics> {
  try {
    // This would typically involve complex queries and aggregations
    // For now, we'll return a mock structure
    const { data: insights } = await supabase
      .from('meta_learning_insights')
      .select('count', { count: 'exact' })

    const { data: experiments } = await supabase
      .from('meta_learning_experiments')
      .select('count', { count: 'exact' })
      .eq('status', 'running')

    const { data: strategies } = await supabase
      .from('teaching_strategies')
      .select('count', { count: 'exact' })
      .eq('is_active', true)

    return {
      totalInsights: insights?.length || 0,
      activeExperiments: experiments?.length || 0,
      globalImprovement: 23.5, // This would be calculated from actual data
      federatedParticipants: 12500, // This would be calculated from actual data
      teachingStrategies: strategies?.length || 0,
      curriculumUpdates: 89, // This would be calculated from actual data
      performanceTrends: [] // This would be calculated from actual data
    }
  } catch (error) {
    console.error('Failed to fetch meta-learning analytics:', error)
    throw error
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

// Subscribe to teaching strategy updates
export const subscribeToTeachingStrategies = (callback: (strategy: TeachingStrategy) => void) => {
  return supabase
    .channel('teaching_strategies_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'teaching_strategies'
    }, callback)
    .subscribe()
}

// Subscribe to curriculum performance updates
export const subscribeToCurriculumPerformance = (callback: (performance: CurriculumPerformance) => void) => {
  return supabase
    .channel('curriculum_performance_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'curriculum_performance'
    }, callback)
    .subscribe()
}

// Subscribe to meta-learning insights
export const subscribeToMetaLearningInsights = (callback: (insight: MetaLearningInsight) => void) => {
  return supabase
    .channel('meta_learning_insights_changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'meta_learning_insights'
    }, callback)
    .subscribe()
}

// Subscribe to federated learning rounds
export const subscribeToFederatedRounds = (callback: (round: FederatedRound) => void) => {
  return supabase
    .channel('federated_rounds_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'federated_rounds'
    }, callback)
    .subscribe()
}