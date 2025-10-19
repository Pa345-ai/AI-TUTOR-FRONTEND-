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

    // Mock AI-generated learning path based on user preferences
    const mockLearningPaths = {
      'mathematics': {
        'beginner': {
          title: 'Mathematics Fundamentals for Beginners',
          description: 'A comprehensive introduction to basic mathematical concepts and problem-solving techniques.',
          estimated_duration_hours: 40,
          learning_objectives: [
            'Master basic arithmetic operations',
            'Understand fractions and decimals',
            'Learn basic geometry concepts',
            'Develop problem-solving skills'
          ],
          lessons: [
            {
              title: 'Introduction to Numbers',
              content: 'Learn about natural numbers, whole numbers, integers, and their properties.',
              lesson_type: 'interactive',
              duration_minutes: 30,
              order_index: 1,
              learning_objectives: ['Identify different types of numbers', 'Understand number properties']
            },
            {
              title: 'Basic Operations',
              content: 'Master addition, subtraction, multiplication, and division with practical examples.',
              lesson_type: 'video',
              duration_minutes: 45,
              order_index: 2,
              learning_objectives: ['Perform basic arithmetic operations', 'Solve word problems']
            },
            {
              title: 'Fractions and Decimals',
              content: 'Understanding fractions, decimals, and their conversions.',
              lesson_type: 'interactive',
              duration_minutes: 50,
              order_index: 3,
              learning_objectives: ['Convert between fractions and decimals', 'Perform operations with fractions']
            }
          ]
        },
        'intermediate': {
          title: 'Intermediate Mathematics Mastery',
          description: 'Advanced mathematical concepts including algebra, geometry, and statistics.',
          estimated_duration_hours: 60,
          learning_objectives: [
            'Master algebraic concepts',
            'Understand geometric principles',
            'Learn statistical analysis',
            'Apply mathematics to real-world problems'
          ],
          lessons: [
            {
              title: 'Algebraic Expressions',
              content: 'Working with variables, expressions, and equations.',
              lesson_type: 'interactive',
              duration_minutes: 40,
              order_index: 1,
              learning_objectives: ['Simplify algebraic expressions', 'Solve linear equations']
            },
            {
              title: 'Geometry Fundamentals',
              content: 'Understanding shapes, angles, and spatial relationships.',
              lesson_type: 'video',
              duration_minutes: 55,
              order_index: 2,
              learning_objectives: ['Calculate area and perimeter', 'Understand angle relationships']
            }
          ]
        }
      },
      'programming': {
        'beginner': {
          title: 'Programming Fundamentals with Python',
          description: 'Learn programming from scratch using Python as your first language.',
          estimated_duration_hours: 50,
          learning_objectives: [
            'Understand programming concepts',
            'Master Python syntax',
            'Build simple applications',
            'Develop problem-solving skills'
          ],
          lessons: [
            {
              title: 'Introduction to Programming',
              content: 'What is programming? Understanding algorithms and logic.',
              lesson_type: 'video',
              duration_minutes: 25,
              order_index: 1,
              learning_objectives: ['Understand programming concepts', 'Learn algorithmic thinking']
            },
            {
              title: 'Python Basics',
              content: 'Variables, data types, and basic operations in Python.',
              lesson_type: 'interactive',
              duration_minutes: 45,
              order_index: 2,
              learning_objectives: ['Write basic Python code', 'Understand data types']
            }
          ]
        }
      }
    }

    const pathData = mockLearningPaths[subject]?.[difficulty_level] || mockLearningPaths['mathematics']['beginner']
    
    // Generate AI insights based on user profile
    const ai_insights = {
      personalized_approach: learning_style === 'visual' 
        ? 'This path emphasizes visual learning with diagrams, charts, and interactive visualizations.'
        : learning_style === 'auditory'
        ? 'This path includes audio explanations and verbal problem-solving techniques.'
        : 'This path combines multiple learning styles for comprehensive understanding.',
      recommended_pace: difficulty_level === 'beginner' 
        ? 'Take your time with each concept. Spend 2-3 hours per week for steady progress.'
        : 'You can move at a faster pace. Aim for 4-5 hours per week to maintain momentum.',
      key_focus_areas: learning_goals.slice(0, 3),
      potential_challenges: [
        'Mathematical notation and symbols',
        'Abstract thinking concepts',
        'Problem-solving under time pressure'
      ]
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
