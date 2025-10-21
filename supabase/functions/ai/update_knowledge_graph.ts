import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KnowledgeGraphUpdate {
  user_id: string
  subject: string
  topic: string
  performance_data: {
    quiz_score?: number
    time_spent?: number
    attempts?: number
    difficulty_level: string
  }
  learning_objective?: string
}

interface KnowledgeGraphResponse {
  updated_graph: {
    topic: string
    mastery_level: number
    confidence_score: number
    strengths: string[]
    weaknesses: string[]
    related_topics: string[]
    ai_insights: any
  }
  recommendations: {
    next_topics: string[]
    study_methods: string[]
    practice_suggestions: string[]
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

    const { user_id, subject, topic, performance_data, learning_objective }: KnowledgeGraphUpdate = await req.json()

    // Calculate mastery level based on performance
    let masteryLevel = 0
    let confidenceScore = 0

    if (performance_data.quiz_score !== undefined) {
      masteryLevel = Math.min(performance_data.quiz_score, 100)
      confidenceScore = performance_data.quiz_score
    }

    // Adjust based on time spent and attempts
    if (performance_data.time_spent && performance_data.attempts) {
      const efficiency = performance_data.quiz_score / (performance_data.time_spent / 60) // score per minute
      const attemptPenalty = Math.max(0, (performance_data.attempts - 1) * 5)
      masteryLevel = Math.max(0, masteryLevel - attemptPenalty)
    }

    // Mock AI analysis of strengths and weaknesses
    const strengths = []
    const weaknesses = []
    const relatedTopics = []

    if (masteryLevel >= 80) {
      strengths.push('Strong conceptual understanding')
      strengths.push('Good problem-solving skills')
      if (performance_data.quiz_score >= 90) {
        strengths.push('Excellent accuracy')
      }
    } else if (masteryLevel >= 60) {
      strengths.push('Basic understanding achieved')
      if (performance_data.quiz_score >= 70) {
        strengths.push('Good foundation')
      }
    }

    if (masteryLevel < 70) {
      weaknesses.push('Needs more practice')
      if (performance_data.quiz_score < 60) {
        weaknesses.push('Fundamental concepts unclear')
      }
    }

    if (masteryLevel < 50) {
      weaknesses.push('Requires additional support')
      weaknesses.push('Consider prerequisite review')
    }

    // Generate related topics based on subject
    const relatedTopicsMap = {
      'mathematics': ['algebra', 'geometry', 'statistics', 'calculus'],
      'programming': ['data structures', 'algorithms', 'software engineering', 'databases'],
      'science': ['physics', 'chemistry', 'biology', 'environmental science'],
      'language': ['grammar', 'vocabulary', 'literature', 'writing']
    }

    relatedTopics.push(...(relatedTopicsMap[subject] || []))

    // Generate AI insights
    const aiInsights = {
      learning_velocity: masteryLevel > 80 ? 'fast' : masteryLevel > 60 ? 'moderate' : 'slow',
      recommended_focus: masteryLevel < 70 ? 'foundational concepts' : 'advanced applications',
      optimal_study_time: performance_data.time_spent < 30 ? 'morning' : 'evening',
      learning_style_effectiveness: masteryLevel > 75 ? 'high' : 'needs_adaptation'
    }

    // Update or create knowledge graph entry
    const { data: existingGraph, error: fetchError } = await supabaseClient
      .from('knowledge_graphs')
      .select('*')
      .eq('user_id', user_id)
      .eq('subject', subject)
      .eq('topic', topic)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const updateData = {
      user_id,
      subject,
      topic,
      mastery_level: Math.max(existingGraph?.mastery_level || 0, masteryLevel),
      confidence_score: Math.max(existingGraph?.confidence_score || 0, confidenceScore),
      last_practiced: new Date().toISOString(),
      practice_count: (existingGraph?.practice_count || 0) + 1,
      strengths: [...new Set([...(existingGraph?.strengths || []), ...strengths])],
      weaknesses: [...new Set([...(existingGraph?.weaknesses || []), ...weaknesses])],
      related_topics: relatedTopics,
      ai_insights: { ...(existingGraph?.ai_insights || {}), ...aiInsights }
    }

    const { data: updatedGraph, error: upsertError } = await supabaseClient
      .from('knowledge_graphs')
      .upsert(updateData)
      .select()
      .single()

    if (upsertError) throw upsertError

    // Generate recommendations
    const recommendations = {
      next_topics: relatedTopics.slice(0, 3),
      study_methods: masteryLevel < 70 
        ? ['Review fundamental concepts', 'Practice with simpler problems', 'Seek additional help']
        : masteryLevel < 90
        ? ['Practice advanced problems', 'Apply concepts to real-world scenarios', 'Teach others']
        : ['Explore advanced topics', 'Mentor other learners', 'Take on challenging projects'],
      practice_suggestions: [
        'Complete 5 practice problems daily',
        'Review previous lessons weekly',
        'Join study groups for peer learning'
      ]
    }

    const response: KnowledgeGraphResponse = {
      updated_graph: {
        topic: updatedGraph.topic,
        mastery_level: updatedGraph.mastery_level,
        confidence_score: updatedGraph.confidence_score,
        strengths: updatedGraph.strengths,
        weaknesses: updatedGraph.weaknesses,
        related_topics: updatedGraph.related_topics,
        ai_insights: updatedGraph.ai_insights
      },
      recommendations
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
