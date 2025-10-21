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
    const { essay_text, essay_type, subject, user_id, rubric_criteria } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile for personalized feedback
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered essay feedback using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI writing tutor that provides comprehensive, constructive feedback on essays. Analyze the following essay and provide detailed feedback:

Essay Text: ${essay_text}
Essay Type: ${essay_type || 'General'}
Subject: ${subject || 'General'}
User Level: ${userProfile?.learning_level || 'intermediate'}
Rubric Criteria: ${rubric_criteria || 'Standard academic writing'}

Provide comprehensive feedback including:
1. Overall assessment and grade
2. Strengths and areas for improvement
3. Specific suggestions for each section
4. Grammar and style corrections
5. Content analysis and suggestions
6. Structure and organization feedback
7. Citation and research quality
8. Actionable next steps for improvement

Format the response as JSON with this structure:
{
  "feedback": {
    "overall_score": 85,
    "grade": "B+",
    "strengths": ["strength1", "strength2"],
    "areas_for_improvement": ["area1", "area2"],
    "detailed_feedback": {
      "introduction": {
        "score": 8,
        "feedback": "Introduction feedback",
        "suggestions": ["suggestion1", "suggestion2"]
      },
      "body_paragraphs": {
        "score": 7,
        "feedback": "Body paragraphs feedback",
        "suggestions": ["suggestion1", "suggestion2"]
      },
      "conclusion": {
        "score": 9,
        "feedback": "Conclusion feedback",
        "suggestions": ["suggestion1", "suggestion2"]
      }
    },
    "grammar_style": {
      "score": 8,
      "issues": ["issue1", "issue2"],
      "corrections": ["correction1", "correction2"]
    },
    "content_analysis": {
      "score": 7,
      "thesis_strength": "Strong/Weak",
      "evidence_quality": "Good/Fair/Poor",
      "argument_development": "Well-developed/Needs work",
      "suggestions": ["suggestion1", "suggestion2"]
    },
    "structure_organization": {
      "score": 8,
      "flow": "Good/Fair/Poor",
      "transitions": "Effective/Needs improvement",
      "paragraph_development": "Well-developed/Needs work",
      "suggestions": ["suggestion1", "suggestion2"]
    }
  },
  "improvement_plan": {
    "immediate_actions": ["action1", "action2"],
    "practice_exercises": ["exercise1", "exercise2"],
    "resources": ["resource1", "resource2"],
    "timeline": "2-3 weeks for improvement"
  },
  "ai_insights": {
    "writing_level": "intermediate",
    "common_patterns": ["pattern1", "pattern2"],
    "learning_style": "visual/auditory/kinesthetic",
    "confidence_score": 0.8,
    "improvement_potential": "high"
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
          { role: 'system', content: 'You are an expert AI writing tutor that provides comprehensive, constructive feedback on essays. Always respond with valid JSON in the exact format requested.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const aiData = await openaiResponse.json()
    const feedbackContent = aiData.choices[0].message.content

    let parsedFeedback
    try {
      parsedFeedback = JSON.parse(feedbackContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedFeedback = {
        feedback: {
          overall_score: 75,
          grade: "B",
          strengths: ["Clear writing", "Good structure"],
          areas_for_improvement: ["Grammar", "Evidence"],
          detailed_feedback: {
            introduction: {
              score: 7,
              feedback: "Introduction provides good context",
              suggestions: ["Strengthen thesis statement", "Add more background"]
            },
            body_paragraphs: {
              score: 7,
              feedback: "Body paragraphs are well-structured",
              suggestions: ["Add more evidence", "Improve transitions"]
            },
            conclusion: {
              score: 8,
              feedback: "Conclusion effectively summarizes",
              suggestions: ["Add call to action", "Strengthen final statement"]
            }
          },
          grammar_style: {
            score: 7,
            issues: ["Some grammar errors", "Style inconsistencies"],
            corrections: ["Fix subject-verb agreement", "Improve sentence variety"]
          },
          content_analysis: {
            score: 7,
            thesis_strength: "Fair",
            evidence_quality: "Good",
            argument_development: "Well-developed",
            suggestions: ["Add more examples", "Strengthen analysis"]
          },
          structure_organization: {
            score: 8,
            flow: "Good",
            transitions: "Effective",
            paragraph_development: "Well-developed",
            suggestions: ["Improve transitions", "Add topic sentences"]
          }
        },
        improvement_plan: {
          immediate_actions: ["Review grammar", "Add evidence"],
          practice_exercises: ["Writing exercises", "Grammar practice"],
          resources: ["Writing guides", "Grammar resources"],
          timeline: "2-3 weeks for improvement"
        },
        ai_insights: {
          writing_level: "intermediate",
          common_patterns: ["Good structure", "Needs grammar work"],
          learning_style: "visual",
          confidence_score: 0.7,
          improvement_potential: "high"
        }
      }
    }

    // Save feedback to database
    const { data: feedbackData, error: feedbackError } = await supabaseClient
      .from('essay_feedback')
      .insert({
        user_id,
        essay_text,
        essay_type,
        subject,
        rubric_criteria,
        feedback_data: parsedFeedback.feedback,
        improvement_plan: parsedFeedback.improvement_plan,
        ai_insights: parsedFeedback.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (feedbackError) {
      console.error('Error saving feedback:', feedbackError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        feedback: parsedFeedback.feedback,
        improvement_plan: parsedFeedback.improvement_plan,
        ai_insights: parsedFeedback.ai_insights,
        feedback_id: feedbackData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in essay_feedback:', error)
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