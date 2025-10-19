import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MemoryRequest {
  user_id: string
  current_input: string
  session_type: string
  subject?: string
  context_limit?: number
}

interface MemoryResponse {
  relevant_memories: Array<{
    id: string
    user_input: string
    ai_response: string
    session_type: string
    subject: string
    created_at: string
    relevance_score: number
  }>
  context_summary: {
    learning_progress: string
    common_patterns: string[]
    user_preferences: any
    suggested_approach: string
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

    const { user_id, current_input, session_type, subject, context_limit = 10 }: MemoryRequest = await req.json()

    // Get recent AI sessions for context
    let query = supabaseClient
      .from('ai_sessions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(context_limit)

    if (subject) {
      query = query.eq('subject', subject)
    }

    const { data: sessions, error: sessionsError } = await query

    if (sessionsError) throw sessionsError

    // Mock AI relevance scoring based on content similarity
    const relevantMemories = sessions.map(session => {
      const relevanceScore = calculateRelevanceScore(current_input, session.user_input, session.ai_response)
      return {
        id: session.id,
        user_input: session.user_input,
        ai_response: session.ai_response,
        session_type: session.session_type,
        subject: session.subject,
        created_at: session.created_at,
        relevance_score: relevanceScore
      }
    }).filter(memory => memory.relevance_score > 0.3)
     .sort((a, b) => b.relevance_score - a.relevance_score)
     .slice(0, 5)

    // Get user's learning progress
    const { data: progress, error: progressError } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', user_id)
      .order('timestamp', { ascending: false })
      .limit(20)

    if (progressError) throw progressError

    // Get knowledge graph insights
    const { data: knowledgeGraph, error: kgError } = await supabaseClient
      .from('knowledge_graphs')
      .select('*')
      .eq('user_id', user_id)
      .order('mastery_level', { ascending: false })

    if (kgError) throw kgError

    // Generate context summary
    const contextSummary = generateContextSummary(sessions, progress, knowledgeGraph, current_input)

    const response: MemoryResponse = {
      relevant_memories: relevantMemories,
      context_summary: contextSummary
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

function calculateRelevanceScore(currentInput: string, pastInput: string, pastResponse: string): number {
  // Simple keyword-based relevance scoring
  const currentWords = currentInput.toLowerCase().split(/\s+/)
  const pastWords = (pastInput + ' ' + pastResponse).toLowerCase().split(/\s+/)
  
  const commonWords = currentWords.filter(word => 
    word.length > 3 && pastWords.includes(word)
  )
  
  const relevanceScore = commonWords.length / Math.max(currentWords.length, pastWords.length)
  return Math.min(relevanceScore, 1.0)
}

function generateContextSummary(sessions: any[], progress: any[], knowledgeGraph: any[], currentInput: string) {
  // Analyze learning progress
  const completedLessons = progress.filter(p => p.progress_type === 'lesson_completion' && p.percentage >= 100).length
  const averageQuizScore = progress
    .filter(p => p.progress_type === 'quiz_score')
    .reduce((sum, p) => sum + (p.value || 0), 0) / Math.max(progress.filter(p => p.progress_type === 'quiz_score').length, 1)

  const learningProgress = completedLessons > 10 
    ? 'Advanced learner with strong foundation'
    : completedLessons > 5
    ? 'Intermediate learner making good progress'
    : 'Beginner learner building fundamentals'

  // Identify common patterns
  const commonPatterns = []
  const sessionTypes = sessions.map(s => s.session_type)
  const mostCommonType = sessionTypes.reduce((a, b, i, arr) => 
    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, sessionTypes[0])

  if (mostCommonType) {
    commonPatterns.push(`Frequently engages in ${mostCommonType} sessions`)
  }

  if (averageQuizScore > 80) {
    commonPatterns.push('Consistently high performance on assessments')
  } else if (averageQuizScore < 60) {
    commonPatterns.push('May benefit from additional practice')
  }

  // Extract user preferences
  const userPreferences = {
    preferred_session_type: mostCommonType,
    average_performance: Math.round(averageQuizScore),
    learning_velocity: completedLessons > 10 ? 'fast' : 'moderate',
    strong_subjects: knowledgeGraph
      .filter(kg => kg.mastery_level > 80)
      .map(kg => kg.subject)
      .slice(0, 3)
  }

  // Generate suggested approach
  let suggestedApproach = 'Continue with current learning approach'
  
  if (averageQuizScore < 60) {
    suggestedApproach = 'Focus on foundational concepts and practice problems'
  } else if (completedLessons > 15 && averageQuizScore > 85) {
    suggestedApproach = 'Ready for advanced topics and challenging projects'
  } else if (sessions.length > 20) {
    suggestedApproach = 'Consider teaching others to reinforce learning'
  }

  return {
    learning_progress: learningProgress,
    common_patterns: commonPatterns,
    user_preferences: userPreferences,
    suggested_approach: suggestedApproach
  }
}
