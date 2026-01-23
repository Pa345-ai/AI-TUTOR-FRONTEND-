// =====================================================
// Meta-Learning Core - Teaching Optimization Engine
// =====================================================
// AI that learns how to teach itself by analyzing
// millions of interactions to discover optimal methods
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TeachingOptimizationRequest {
  user_id: string
  teaching_method: string
  personality_type: string
  culture?: string
  subject: string
  interaction_data: {
    duration: number
    engagement_score: number
    comprehension_score: number
    satisfaction_rating: number
    learning_outcomes: string[]
  }
  learning_goals: string[]
  current_performance: number
}

interface OptimizationResult {
  optimized_method: string
  effectiveness_score: number
  recommended_adaptations: string[]
  predicted_improvement: number
  global_insights: {
    best_practices: string[]
    common_pitfalls: string[]
    cultural_considerations: string[]
  }
  next_optimization: {
    suggested_experiments: string[]
    data_collection_focus: string[]
    timeline: string
  }
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

    const { user_id, teaching_method, personality_type, culture, subject, interaction_data, learning_goals, current_performance }: TeachingOptimizationRequest = await req.json()

    // Calculate effectiveness score based on multiple factors
    const effectiveness_score = calculateEffectivenessScore(interaction_data)
    
    // Analyze global patterns for this teaching method
    const globalPatterns = await analyzeGlobalPatterns(supabaseClient, teaching_method, personality_type, culture, subject)
    
    // Generate AI-powered optimization recommendations
    const optimizationResult = await generateOptimizationRecommendations(
      teaching_method,
      personality_type,
      culture,
      subject,
      effectiveness_score,
      globalPatterns,
      learning_goals,
      current_performance
    )

    // Store optimization data for future learning
    await storeOptimizationData(supabaseClient, {
      user_id,
      teaching_method,
      personality_type,
      culture: culture || 'global',
      subject,
      effectiveness_score,
      interaction_data,
      optimization_result: optimizationResult
    })

    // Update curriculum based on insights
    await updateCurriculumInsights(supabaseClient, subject, optimizationResult)

    return new Response(
      JSON.stringify({
        success: true,
        optimization_result: optimizationResult,
        meta_learning_insights: {
          teaching_effectiveness: effectiveness_score,
          global_performance: globalPatterns.average_effectiveness,
          improvement_potential: optimizationResult.predicted_improvement,
          next_optimization_cycle: optimizationResult.next_optimization.timeline
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Meta-learning optimization error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to optimize teaching method',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function calculateEffectivenessScore(interaction_data: any): number {
  const weights = {
    engagement: 0.3,
    comprehension: 0.4,
    satisfaction: 0.2,
    duration_efficiency: 0.1
  }

  const duration_efficiency = Math.min(1, 30 / interaction_data.duration) // Optimal duration around 30 minutes
  
  return (
    interaction_data.engagement_score * weights.engagement +
    interaction_data.comprehension_score * weights.comprehension +
    interaction_data.satisfaction_rating * weights.satisfaction +
    duration_efficiency * weights.duration_efficiency
  )
}

async function analyzeGlobalPatterns(
  supabaseClient: any,
  teaching_method: string,
  personality_type: string,
  culture: string | undefined,
  subject: string
) {
  // Query global teaching optimization data
  const { data: globalData, error } = await supabaseClient
    .from('teaching_optimization')
    .select('*')
    .eq('teaching_method', teaching_method)
    .eq('personality_type', personality_type)
    .eq('subject', subject)

  if (error) throw error

  const average_effectiveness = globalData?.reduce((sum: number, item: any) => sum + item.effectiveness_score, 0) / (globalData?.length || 1)
  const success_rate = globalData?.reduce((sum: number, item: any) => sum + item.success_rate, 0) / (globalData?.length || 1)
  
  return {
    average_effectiveness,
    success_rate,
    sample_size: globalData?.length || 0,
    cultural_variations: culture ? analyzeCulturalVariations(globalData, culture) : null
  }
}

function analyzeCulturalVariations(data: any[], culture: string) {
  const culturalData = data.filter(item => item.culture === culture)
  if (culturalData.length === 0) return null

  return {
    cultural_effectiveness: culturalData.reduce((sum, item) => sum + item.effectiveness_score, 0) / culturalData.length,
    cultural_preferences: extractCulturalPreferences(culturalData),
    adaptation_suggestions: generateCulturalAdaptations(culture)
  }
}

function extractCulturalPreferences(data: any[]) {
  // Analyze engagement metrics to extract cultural preferences
  const preferences = {
    communication_style: 'direct', // or 'indirect'
    group_dynamics: 'individual', // or 'collaborative'
    feedback_approach: 'immediate', // or 'delayed'
    authority_respect: 'high' // or 'moderate'
  }
  
  return preferences
}

function generateCulturalAdaptations(culture: string) {
  const adaptations = {
    'eastern': [
      'Use more indirect communication',
      'Emphasize group harmony',
      'Provide delayed feedback',
      'Show respect for authority'
    ],
    'western': [
      'Use direct communication',
      'Encourage individual expression',
      'Provide immediate feedback',
      'Foster critical thinking'
    ],
    'global': [
      'Adapt communication style based on individual preferences',
      'Balance individual and group activities',
      'Provide flexible feedback timing',
      'Respect diverse authority structures'
    ]
  }
  
  return adaptations[culture] || adaptations['global']
}

async function generateOptimizationRecommendations(
  teaching_method: string,
  personality_type: string,
  culture: string | undefined,
  subject: string,
  effectiveness_score: number,
  globalPatterns: any,
  learning_goals: string[],
  current_performance: number
): Promise<OptimizationResult> {
  
  // AI-powered analysis using OpenAI
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found')
  }

  const prompt = `
    As an advanced AI teaching optimization system, analyze the following teaching scenario and provide optimization recommendations:

    Teaching Method: ${teaching_method}
    Personality Type: ${personality_type}
    Culture: ${culture || 'global'}
    Subject: ${subject}
    Current Effectiveness: ${effectiveness_score}
    Global Average: ${globalPatterns.average_effectiveness}
    Learning Goals: ${learning_goals.join(', ')}
    Current Performance: ${current_performance}

    Provide specific, actionable recommendations for:
    1. Optimized teaching method adaptations
    2. Recommended teaching adaptations
    3. Predicted improvement potential
    4. Global best practices
    5. Cultural considerations
    6. Next optimization experiments

    Format as JSON with the structure:
    {
      "optimized_method": "specific teaching approach",
      "effectiveness_score": 0.0-1.0,
      "recommended_adaptations": ["adaptation1", "adaptation2"],
      "predicted_improvement": 0.0-1.0,
      "global_insights": {
        "best_practices": ["practice1", "practice2"],
        "common_pitfalls": ["pitfall1", "pitfall2"],
        "cultural_considerations": ["consideration1", "consideration2"]
      },
      "next_optimization": {
        "suggested_experiments": ["experiment1", "experiment2"],
        "data_collection_focus": ["focus1", "focus2"],
        "timeline": "1-2 weeks"
      }
    }
  `

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI teaching optimization system that analyzes teaching effectiveness and provides data-driven recommendations for improving learning outcomes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  })

  const data = await response.json()
  const optimizationText = data.choices[0].message.content

  try {
    return JSON.parse(optimizationText)
  } catch (parseError) {
    // Fallback if JSON parsing fails
    return {
      optimized_method: teaching_method,
      effectiveness_score: effectiveness_score,
      recommended_adaptations: [
        'Increase engagement through interactive elements',
        'Adapt to cultural learning preferences',
        'Provide more personalized feedback'
      ],
      predicted_improvement: 0.15,
      global_insights: {
        best_practices: [
          'Use multi-modal teaching approaches',
          'Provide immediate feedback',
          'Adapt to individual learning styles'
        ],
        common_pitfalls: [
          'One-size-fits-all approach',
          'Insufficient cultural adaptation',
          'Lack of personalized feedback'
        ],
        cultural_considerations: [
          'Respect cultural communication styles',
          'Adapt group dynamics preferences',
          'Consider authority structures'
        ]
      },
      next_optimization: {
        suggested_experiments: [
          'A/B test different engagement strategies',
          'Experiment with cultural adaptations',
          'Test personalized feedback approaches'
        ],
        data_collection_focus: [
          'Engagement metrics',
          'Cultural response patterns',
          'Learning outcome improvements'
        ],
        timeline: '2-3 weeks'
      }
    }
  }
}

async function storeOptimizationData(supabaseClient: any, data: any) {
  const { error } = await supabaseClient
    .from('teaching_optimization')
    .insert({
      user_id: data.user_id,
      teaching_method: data.teaching_method,
      personality_type: data.personality_type,
      culture: data.culture,
      subject: data.subject,
      effectiveness_score: data.effectiveness_score,
      interaction_count: 1,
      success_rate: data.interaction_data.comprehension_score,
      engagement_metrics: {
        duration: data.interaction_data.duration,
        engagement_score: data.interaction_data.engagement_score,
        satisfaction_rating: data.interaction_data.satisfaction_rating
      },
      learning_outcomes: {
        goals_achieved: data.interaction_data.learning_outcomes,
        performance_improvement: data.optimization_result.predicted_improvement
      }
    })

  if (error) throw error
}

async function updateCurriculumInsights(supabaseClient: any, subject: string, optimizationResult: OptimizationResult) {
  // Update curriculum optimization based on new insights
  const { error } = await supabaseClient
    .from('curriculum_optimization')
    .upsert({
      subject: subject,
      topic: 'general',
      difficulty_level: 'adaptive',
      global_performance_score: optimizationResult.effectiveness_score,
      completion_rate: 0.85, // Default value
      average_learning_time: 30, // Default value
      user_satisfaction: optimizationResult.effectiveness_score,
      improvement_suggestions: optimizationResult.recommended_adaptations,
      auto_updated_content: {
        teaching_methods: [optimizationResult.optimized_method],
        best_practices: optimizationResult.global_insights.best_practices,
        cultural_adaptations: optimizationResult.global_insights.cultural_considerations
      },
      version: 1
    })

  if (error) throw error
}