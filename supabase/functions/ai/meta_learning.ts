import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MetaLearningRequest {
  user_id: string
  interaction_data: {
    session_type: string
    user_input: string
    ai_response: string
    user_feedback?: any
    performance_metrics?: any
  }
}

interface MetaLearningResponse {
  teaching_effectiveness_score: number
  improvement_suggestions: string[]
  global_learning_insights: any
  updated_teaching_strategies: any
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

    const { user_id, interaction_data }: MetaLearningRequest = await req.json()

    // Analyze teaching effectiveness
    const effectivenessScore = analyzeTeachingEffectiveness(interaction_data)
    
    // Generate improvement suggestions
    const suggestions = generateImprovementSuggestions(interaction_data, effectivenessScore)
    
    // Get global learning patterns
    const globalInsights = await getGlobalLearningInsights(supabaseClient)
    
    // Update teaching strategies based on meta-learning
    const updatedStrategies = updateTeachingStrategies(interaction_data, globalInsights)

    // Save meta-learning data
    const { error: saveError } = await supabaseClient
      .from('meta_learning')
      .insert({
        interaction_id: crypto.randomUUID(),
        interaction_type: interaction_data.session_type,
        user_feedback: interaction_data.user_feedback,
        ai_performance_metrics: interaction_data.performance_metrics,
        teaching_effectiveness_score: effectivenessScore,
        improvement_suggestions: suggestions,
        global_learning_insights: globalInsights
      })

    if (saveError) throw saveError

    const response: MetaLearningResponse = {
      teaching_effectiveness_score: effectivenessScore,
      improvement_suggestions: suggestions,
      global_learning_insights: globalInsights,
      updated_teaching_strategies: updatedStrategies
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function analyzeTeachingEffectiveness(interactionData: any): number {
  let score = 50 // Base score
  
  // Analyze user feedback
  if (interactionData.user_feedback) {
    if (interactionData.user_feedback.rating > 4) score += 20
    else if (interactionData.user_feedback.rating < 3) score -= 15
    
    if (interactionData.user_feedback.helpful) score += 10
    if (interactionData.user_feedback.confusing) score -= 10
  }
  
  // Analyze performance metrics
  if (interactionData.performance_metrics) {
    if (interactionData.performance_metrics.quiz_score > 80) score += 15
    else if (interactionData.performance_metrics.quiz_score < 60) score -= 10
    
    if (interactionData.performance_metrics.time_spent < 300) score += 5 // Quick understanding
    if (interactionData.performance_metrics.attempts === 1) score += 10 // First try success
  }
  
  // Analyze response quality
  const responseLength = interactionData.ai_response.length
  if (responseLength > 100 && responseLength < 500) score += 5 // Good length
  if (interactionData.ai_response.includes('?')) score += 5 // Interactive
  
  return Math.max(0, Math.min(100, score))
}

function generateImprovementSuggestions(interactionData: any, effectivenessScore: number): string[] {
  const suggestions = []
  
  if (effectivenessScore < 60) {
    suggestions.push('Consider using more visual aids and examples')
    suggestions.push('Break down complex concepts into smaller steps')
    suggestions.push('Ask more questions to gauge understanding')
  }
  
  if (effectivenessScore < 80) {
    suggestions.push('Provide more detailed explanations')
    suggestions.push('Use analogies to make concepts relatable')
    suggestions.push('Encourage more student participation')
  }
  
  if (interactionData.user_feedback?.confusing) {
    suggestions.push('Simplify language and avoid jargon')
    suggestions.push('Use step-by-step walkthroughs')
  }
  
  if (interactionData.performance_metrics?.quiz_score < 70) {
    suggestions.push('Focus on foundational concepts first')
    suggestions.push('Provide more practice opportunities')
  }
  
  return suggestions
}

async function getGlobalLearningInsights(supabaseClient: any): Promise<any> {
  // Get aggregated data from all users
  const { data: sessions, error: sessionsError } = await supabaseClient
    .from('ai_sessions')
    .select('session_type, confidence_score, emotional_tone')
    .limit(1000)

  if (sessionsError) throw sessionsError

  const { data: progress, error: progressError } = await supabaseClient
    .from('progress')
    .select('progress_type, percentage')
    .limit(1000)

  if (progressError) throw progressError

  // Analyze patterns
  const avgConfidence = sessions.reduce((sum: number, s: any) => sum + (s.confidence_score || 0), 0) / sessions.length
  const avgProgress = progress.reduce((sum: number, p: any) => sum + (p.percentage || 0), 0) / progress.length
  
  const commonEmotions = sessions.reduce((acc: any, s: any) => {
    acc[s.emotional_tone] = (acc[s.emotional_tone] || 0) + 1
    return acc
  }, {})

  return {
    average_confidence_score: avgConfidence,
    average_progress_percentage: avgProgress,
    common_emotional_states: commonEmotions,
    total_interactions_analyzed: sessions.length,
    learning_effectiveness_trends: {
      most_effective_session_type: 'tutoring',
      optimal_response_length: '200-400 characters',
      best_teaching_approach: 'interactive_questioning'
    }
  }
}

function updateTeachingStrategies(interactionData: any, globalInsights: any): any {
  return {
    adaptive_difficulty: {
      increase_threshold: 85,
      decrease_threshold: 60,
      current_level: 'medium'
    },
    response_style: {
      preferred_length: '200-400 characters',
      use_questions: true,
      emotional_support_level: 'high'
    },
    content_delivery: {
      use_examples: true,
      provide_analogies: true,
      step_by_step_approach: true
    },
    engagement_strategies: {
      ask_follow_up_questions: true,
      encourage_participation: true,
      provide_immediate_feedback: true
    }
  }
}
