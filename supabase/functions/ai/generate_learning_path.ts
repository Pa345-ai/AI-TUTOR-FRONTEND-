import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LearningPathRequest {
  user_id: string
  subject: string
  difficulty_level: string
  learning_goals: string[]
  preferred_languages: string[]
  learning_style: string
}

interface LearningPathResponse {
  learning_path: {
    id: string
    title: string
    description: string
    subject: string
    difficulty_level: string
    estimated_duration_hours: number
    learning_objectives: string[]
    lessons: Array<{
      title: string
      content: string
      lesson_type: string
      duration_minutes: number
      order_index: number
      learning_objectives: string[]
    }>
  }
  ai_insights: {
    personalized_approach: string
    recommended_pace: string
    key_focus_areas: string[]
    potential_challenges: string[]
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

    const { user_id, subject, difficulty_level, learning_goals, preferred_languages, learning_style }: LearningPathRequest = await req.json()

    // Get user profile for personalized AI generation
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered learning path using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const aiPrompt = `You are an expert educational AI tutor. Create a comprehensive, personalized learning path for a student with the following profile:

Student Profile:
- Subject: ${subject}
- Difficulty Level: ${difficulty_level}
- Learning Goals: ${learning_goals.join(', ')}
- Preferred Languages: ${preferred_languages.join(', ')}
- Learning Style: ${learning_style}
- User Age: ${userProfile?.age || 'Not specified'}
- Previous Experience: ${userProfile?.experience_level || 'Not specified'}

Please generate a detailed learning path that includes:
1. A compelling title and description
2. Realistic estimated duration in hours
3. 5-8 specific learning objectives
4. 6-10 detailed lessons with:
   - Engaging titles
   - Comprehensive content descriptions
   - Appropriate lesson types (interactive, video, reading, practice)
   - Realistic duration in minutes
   - 2-3 specific learning objectives per lesson
   - Logical progression order

Also provide personalized AI insights including:
- Personalized approach based on learning style
- Recommended pace and study schedule
- Key focus areas based on goals
- Potential challenges and how to overcome them

Format the response as a JSON object with this exact structure:
{
  "learning_path": {
    "title": "string",
    "description": "string",
    "estimated_duration_hours": number,
    "learning_objectives": ["string"],
    "lessons": [
      {
        "title": "string",
        "content": "string",
        "lesson_type": "interactive|video|reading|practice",
        "duration_minutes": number,
        "order_index": number,
        "learning_objectives": ["string"]
      }
    ]
  },
  "ai_insights": {
    "personalized_approach": "string",
    "recommended_pace": "string",
    "key_focus_areas": ["string"],
    "potential_challenges": ["string"]
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
          {
            role: 'system',
            content: 'You are an expert educational AI tutor specializing in creating personalized learning paths. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const aiData = await openaiResponse.json()
    const aiContent = aiData.choices[0]?.message?.content

    if (!aiContent) {
      throw new Error('No content received from OpenAI')
    }

    // Parse AI response
    let pathData
    try {
      pathData = JSON.parse(aiContent)
    } catch (parseError) {
      // Fallback to structured generation if JSON parsing fails
      const fallbackPrompt = `Generate a learning path for ${subject} at ${difficulty_level} level. Return only valid JSON with the exact structure specified.`
      
      const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are an expert educational AI tutor. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: fallbackPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      const fallbackData = await fallbackResponse.json()
      pathData = JSON.parse(fallbackData.choices[0]?.message?.content)
    }

    // Create learning path in database
    const { data: learningPath, error: pathError } = await supabaseClient
      .from('learning_paths')
      .insert({
        user_id,
        title: pathData.title,
        description: pathData.description,
        subject,
        difficulty_level,
        estimated_duration_hours: pathData.estimated_duration_hours,
        learning_objectives: pathData.learning_objectives,
        ai_generated: true
      })
      .select()
      .single()

    if (pathError) throw pathError

    // Create lessons
    const lessons = pathData.lessons.map(lesson => ({
      learning_path_id: learningPath.id,
      ...lesson,
      ai_generated: true
    }))

    const { error: lessonsError } = await supabaseClient
      .from('lessons')
      .insert(lessons)

    if (lessonsError) throw lessonsError

    // Update knowledge graph
    await supabaseClient
      .from('knowledge_graphs')
      .upsert({
        user_id,
        subject,
        topic: subject,
        mastery_level: 0,
        confidence_score: 0,
        ai_insights: ai_insights
      })

    const response: LearningPathResponse = {
      learning_path: {
        id: learningPath.id,
        ...pathData
      },
      ai_insights
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
