import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, file_url, user_id, subject, summary_type } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile for personalized summarization
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered summary using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI tutor that creates comprehensive, personalized summaries. Analyze the following content and create a detailed summary:

Content: ${text || 'File URL: ' + file_url}
Subject: ${subject || 'General'}
Summary Type: ${summary_type || 'comprehensive'}
User Level: ${userProfile?.learning_level || 'intermediate'}
User Learning Style: ${userProfile?.learning_style || 'visual'}

Create a summary that includes:
1. Key concepts and main ideas
2. Important details and examples
3. Learning objectives
4. Key takeaways
5. Suggested next steps for learning
6. Questions for self-assessment

Format the response as JSON with this structure:
{
  "summary": {
    "title": "Summary Title",
    "overview": "Brief overview",
    "key_concepts": ["concept1", "concept2"],
    "main_points": ["point1", "point2"],
    "examples": ["example1", "example2"],
    "learning_objectives": ["objective1", "objective2"],
    "key_takeaways": ["takeaway1", "takeaway2"],
    "next_steps": ["step1", "step2"],
    "self_assessment_questions": ["question1", "question2"]
  },
  "ai_insights": {
    "difficulty_level": "intermediate",
    "estimated_reading_time": "5 minutes",
    "prerequisites": ["prerequisite1", "prerequisite2"],
    "related_topics": ["topic1", "topic2"],
    "confidence_score": 0.95
  }
}`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert AI tutor that creates comprehensive, personalized summaries. Always respond with valid JSON in the exact format requested.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const aiData = await openaiResponse.json()
    const summaryContent = aiData.choices[0].message.content

    let parsedSummary
    try {
      parsedSummary = JSON.parse(summaryContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedSummary = {
        summary: {
          title: "AI-Generated Summary",
          overview: summaryContent,
          key_concepts: ["Key concepts extracted from content"],
          main_points: ["Main points from the content"],
          examples: ["Examples from the content"],
          learning_objectives: ["Understand the main concepts"],
          key_takeaways: ["Key insights from the content"],
          next_steps: ["Review and practice the concepts"],
          self_assessment_questions: ["What did you learn from this content?"]
        },
        ai_insights: {
          difficulty_level: "intermediate",
          estimated_reading_time: "5 minutes",
          prerequisites: [],
          related_topics: [],
          confidence_score: 0.8
        }
      }
    }

    // Save summary to database
    const { data: summaryData, error: summaryError } = await supabaseClient
      .from('ai_summaries')
      .insert({
        user_id,
        content: text || file_url,
        subject,
        summary_type,
        summary_data: parsedSummary.summary,
        ai_insights: parsedSummary.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (summaryError) {
      console.error('Error saving summary:', summaryError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: parsedSummary.summary,
        ai_insights: parsedSummary.ai_insights,
        summary_id: summaryData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in summarize_notes:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})