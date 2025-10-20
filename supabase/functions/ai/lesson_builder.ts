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
    const { topic, subject, difficulty, user_id, lesson_type, learning_objectives } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile for personalized lesson creation
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered lesson using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert educational AI that creates comprehensive, engaging lessons. Create a detailed lesson with the following specifications:

Topic: ${topic}
Subject: ${subject}
Difficulty: ${difficulty}
Lesson Type: ${lesson_type || 'interactive'}
Learning Objectives: ${learning_objectives || 'Master the key concepts'}
User Level: ${userProfile?.learning_level || 'intermediate'}
User Learning Style: ${userProfile?.learning_style || 'visual'}
User Age: ${userProfile?.age || 'adult'}

Create a comprehensive lesson that includes:
1. Lesson overview and objectives
2. Prerequisites and preparation
3. Step-by-step content with explanations
4. Interactive activities and exercises
5. Visual aids and examples
6. Assessment questions
7. Summary and next steps
8. Additional resources

Format the response as JSON with this structure:
{
  "lesson": {
    "title": "Lesson Title",
    "overview": "Brief lesson overview",
    "objectives": ["objective1", "objective2"],
    "prerequisites": ["prerequisite1", "prerequisite2"],
    "estimated_duration": "45 minutes",
    "sections": [
      {
        "title": "Section Title",
        "content": "Detailed content",
        "activities": ["activity1", "activity2"],
        "examples": ["example1", "example2"],
        "visual_aids": ["diagram1", "chart1"]
      }
    ],
    "assessment": {
      "questions": [
        {
          "question": "Question text",
          "type": "multiple_choice",
          "options": ["option1", "option2", "option3", "option4"],
          "correct_answer": "option1",
          "explanation": "Why this is correct"
        }
      ]
    },
    "summary": "Key takeaways from the lesson",
    "next_steps": ["step1", "step2"],
    "additional_resources": ["resource1", "resource2"]
  },
  "ai_insights": {
    "difficulty_analysis": "Analysis of difficulty level",
    "learning_style_adaptation": "How the lesson adapts to learning style",
    "estimated_completion_time": "45 minutes",
    "success_probability": 0.85,
    "recommended_pace": "moderate"
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
          { role: 'system', content: 'You are an expert educational AI that creates comprehensive, engaging lessons. Always respond with valid JSON in the exact format requested.' },
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
    const lessonContent = aiData.choices[0].message.content

    let parsedLesson
    try {
      parsedLesson = JSON.parse(lessonContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedLesson = {
        lesson: {
          title: `AI-Generated Lesson: ${topic}`,
          overview: `A comprehensive lesson about ${topic}`,
          objectives: [`Understand ${topic}`, `Apply ${topic} concepts`],
          prerequisites: [],
          estimated_duration: "45 minutes",
          sections: [
            {
              title: "Introduction",
              content: `This lesson covers ${topic} in detail.`,
              activities: ["Read the content", "Complete exercises"],
              examples: ["Practical examples"],
              visual_aids: ["Diagrams and charts"]
            }
          ],
          assessment: {
            questions: [
              {
                question: `What is the main concept of ${topic}?`,
                type: "multiple_choice",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct_answer: "Option A",
                explanation: "This is the correct answer because..."
              }
            ]
          },
          summary: `Key takeaways about ${topic}`,
          next_steps: ["Practice the concepts", "Take the assessment"],
          additional_resources: ["Related materials"]
        },
        ai_insights: {
          difficulty_analysis: "Appropriate for the selected difficulty level",
          learning_style_adaptation: "Adapted to user's learning style",
          estimated_completion_time: "45 minutes",
          success_probability: 0.8,
          recommended_pace: "moderate"
        }
      }
    }

    // Save lesson to database
    const { data: lessonData, error: lessonError } = await supabaseClient
      .from('ai_lessons')
      .insert({
        user_id,
        topic,
        subject,
        difficulty,
        lesson_type,
        learning_objectives,
        lesson_data: parsedLesson.lesson,
        ai_insights: parsedLesson.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (lessonError) {
      console.error('Error saving lesson:', lessonError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        lesson: parsedLesson.lesson,
        ai_insights: parsedLesson.ai_insights,
        lesson_id: lessonData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in lesson_builder:', error)
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