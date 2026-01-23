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
    const { user_id, interests, skills, goals, current_level, experience } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile and learning history
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    const { data: learningHistory } = await supabaseClient
      .from('learning_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Generate AI-powered career advice using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI career advisor with deep knowledge of career paths, industries, and educational requirements. Provide comprehensive career guidance based on the following profile:

User Profile:
- Age: ${userProfile?.age || 'Not specified'}
- Current Level: ${current_level || 'Student'}
- Interests: ${interests || 'Not specified'}
- Skills: ${skills || 'Not specified'}
- Goals: ${goals || 'Not specified'}
- Experience: ${experience || 'Not specified'}
- Learning History: ${JSON.stringify(learningHistory || [])}

Provide comprehensive career advice including:
1. Recommended career paths based on interests and skills
2. Required education and certifications
3. Skill development roadmap
4. Industry insights and trends
5. Salary expectations and growth potential
6. Networking and professional development opportunities
7. Actionable next steps

Format the response as JSON with this structure:
{
  "career_analysis": {
    "recommended_careers": [
      {
        "title": "Career Title",
        "description": "Career description",
        "match_score": 0.85,
        "required_education": "Education requirements",
        "required_skills": ["skill1", "skill2"],
        "salary_range": "$50,000 - $80,000",
        "growth_outlook": "Strong growth expected",
        "industries": ["industry1", "industry2"]
      }
    ],
    "skill_gaps": [
      {
        "skill": "Missing skill",
        "importance": "high",
        "development_path": "How to develop this skill",
        "resources": ["resource1", "resource2"]
      }
    ],
    "education_recommendations": [
      {
        "type": "Degree/Certification",
        "title": "Program title",
        "duration": "2 years",
        "cost_estimate": "$10,000",
        "institutions": ["institution1", "institution2"],
        "online_options": true
      }
    ]
  },
  "action_plan": {
    "immediate_steps": ["step1", "step2"],
    "short_term_goals": ["goal1", "goal2"],
    "long_term_goals": ["goal1", "goal2"],
    "timeline": "6-12 months for short-term goals"
  },
  "ai_insights": {
    "personality_analysis": "Analysis of user's profile",
    "market_trends": "Relevant market trends",
    "success_probability": 0.8,
    "risk_factors": ["risk1", "risk2"],
    "opportunities": ["opportunity1", "opportunity2"]
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
          { role: 'system', content: 'You are an expert AI career advisor with deep knowledge of career paths, industries, and educational requirements. Always respond with valid JSON in the exact format requested.' },
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
    const careerContent = aiData.choices[0].message.content

    let parsedCareer
    try {
      parsedCareer = JSON.parse(careerContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedCareer = {
        career_analysis: {
          recommended_careers: [
            {
              title: "General Professional",
              description: "A versatile career path based on your interests",
              match_score: 0.7,
              required_education: "Bachelor's degree recommended",
              required_skills: ["Communication", "Problem-solving"],
              salary_range: "$40,000 - $70,000",
              growth_outlook: "Steady growth expected",
              industries: ["Technology", "Business"]
            }
          ],
          skill_gaps: [
            {
              skill: "Technical skills",
              importance: "high",
              development_path: "Take online courses and practice",
              resources: ["Online courses", "Tutorials"]
            }
          ],
          education_recommendations: [
            {
              type: "Bachelor's Degree",
              title: "Relevant degree program",
              duration: "4 years",
              cost_estimate: "$20,000",
              institutions: ["Local universities"],
              online_options: true
            }
          ]
        },
        action_plan: {
          immediate_steps: ["Assess current skills", "Research career options"],
          short_term_goals: ["Develop key skills", "Gain experience"],
          long_term_goals: ["Advance in chosen career", "Achieve financial goals"],
          timeline: "6-12 months for short-term goals"
        },
        ai_insights: {
          personality_analysis: "Analysis based on provided information",
          market_trends: "Current market trends in relevant fields",
          success_probability: 0.7,
          risk_factors: ["Market changes", "Competition"],
          opportunities: ["Growing fields", "Remote work options"]
        }
      }
    }

    // Save career advice to database
    const { data: careerData, error: careerError } = await supabaseClient
      .from('career_advice')
      .insert({
        user_id,
        interests,
        skills,
        goals,
        current_level,
        experience,
        career_analysis: parsedCareer.career_analysis,
        action_plan: parsedCareer.action_plan,
        ai_insights: parsedCareer.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (careerError) {
      console.error('Error saving career advice:', careerError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        career_analysis: parsedCareer.career_analysis,
        action_plan: parsedCareer.action_plan,
        ai_insights: parsedCareer.ai_insights,
        career_id: careerData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in career_advisor:', error)
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