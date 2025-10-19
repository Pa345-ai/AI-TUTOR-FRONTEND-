import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuizGeneratorRequest {
  user_id: string
  subject: string
  topic: string
  difficulty_level: string
  question_count: number
  quiz_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay'
  learning_objectives?: string[]
}

interface QuizGeneratorResponse {
  quiz: {
    id: string
    title: string
    description: string
    questions: Array<{
      id: string
      question: string
      question_type: string
      options?: string[]
      correct_answer: string | string[]
      explanation: string
      difficulty: string
      learning_objective: string
    }>
    time_limit_minutes: number
    passing_score: number
  }
  ai_insights: {
    recommended_approach: string
    key_concepts: string[]
    common_mistakes: string[]
    study_tips: string[]
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

    const { 
      user_id, 
      subject, 
      topic, 
      difficulty_level, 
      question_count, 
      quiz_type, 
      learning_objectives = [] 
    }: QuizGeneratorRequest = await req.json()

    // Generate quiz based on subject and difficulty
    const quizData = generateQuizContent(subject, topic, difficulty_level, question_count, quiz_type)
    
    // Get user's learning path to associate quiz
    const { data: learningPath, error: pathError } = await supabaseClient
      .from('learning_paths')
      .select('id')
      .eq('user_id', user_id)
      .eq('subject', subject)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (pathError) throw pathError

    // Get lesson to associate quiz with
    const { data: lesson, error: lessonError } = await supabaseClient
      .from('lessons')
      .select('id')
      .eq('learning_path_id', learningPath.id)
      .ilike('title', `%${topic}%`)
      .limit(1)
      .single()

    if (lessonError) throw lessonError

    // Create quiz in database
    const { data: quiz, error: quizError } = await supabaseClient
      .from('quizzes')
      .insert({
        lesson_id: lesson.id,
        title: quizData.title,
        description: quizData.description,
        quiz_type,
        questions: quizData.questions,
        time_limit_minutes: quizData.time_limit_minutes,
        passing_score: quizData.passing_score,
        difficulty_level,
        ai_generated: true
      })
      .select()
      .single()

    if (quizError) throw quizError

    // Generate AI insights
    const aiInsights = generateAIInsights(subject, topic, difficulty_level, quizData.questions)

    const response: QuizGeneratorResponse = {
      quiz: {
        id: quiz.id,
        ...quizData
      },
      ai_insights: aiInsights
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

function generateQuizContent(
  subject: string, 
  topic: string, 
  difficulty: string, 
  questionCount: number, 
  quizType: string
): any {
  
  const quizTemplates = {
    'mathematics': {
      'algebra': {
        'beginner': {
          title: 'Basic Algebra Fundamentals',
          description: 'Test your understanding of basic algebraic concepts and operations.',
          time_limit_minutes: 30,
          passing_score: 70,
          questions: [
            {
              id: '1',
              question: 'What is the value of x in the equation 2x + 5 = 13?',
              question_type: 'multiple_choice',
              options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
              correct_answer: 'x = 4',
              explanation: 'To solve: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
              difficulty: 'beginner',
              learning_objective: 'Solve linear equations with one variable'
            },
            {
              id: '2',
              question: 'Simplify the expression: 3(x + 2) - 2x',
              question_type: 'multiple_choice',
              options: ['x + 6', '5x + 6', 'x + 2', '3x + 4'],
              correct_answer: 'x + 6',
              explanation: 'Distribute: 3x + 6 - 2x = x + 6',
              difficulty: 'beginner',
              learning_objective: 'Apply distributive property and combine like terms'
            }
          ]
        },
        'intermediate': {
          title: 'Intermediate Algebra Concepts',
          description: 'Advanced algebraic problem-solving and equation manipulation.',
          time_limit_minutes: 45,
          passing_score: 75,
          questions: [
            {
              id: '1',
              question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
              question_type: 'multiple_choice',
              options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 0, x = 5'],
              correct_answer: 'x = 2, x = 3',
              explanation: 'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
              difficulty: 'intermediate',
              learning_objective: 'Solve quadratic equations by factoring'
            }
          ]
        }
      }
    },
    'programming': {
      'python': {
        'beginner': {
          title: 'Python Fundamentals Quiz',
          description: 'Test your understanding of basic Python programming concepts.',
          time_limit_minutes: 25,
          passing_score: 70,
          questions: [
            {
              id: '1',
              question: 'What is the output of: print(3 + 2 * 4)',
              question_type: 'multiple_choice',
              options: ['20', '11', '14', 'Error'],
              correct_answer: '11',
              explanation: 'Order of operations: multiplication first (2*4=8), then addition (3+8=11)',
              difficulty: 'beginner',
              learning_objective: 'Understand operator precedence in Python'
            },
            {
              id: '2',
              question: 'Which keyword is used to define a function in Python?',
              question_type: 'multiple_choice',
              options: ['function', 'def', 'define', 'func'],
              correct_answer: 'def',
              explanation: 'The "def" keyword is used to define functions in Python',
              difficulty: 'beginner',
              learning_objective: 'Understand function definition syntax'
            }
          ]
        }
      }
    },
    'science': {
      'physics': {
        'beginner': {
          title: 'Basic Physics Concepts',
          description: 'Fundamental physics principles and calculations.',
          time_limit_minutes: 30,
          passing_score: 70,
          questions: [
            {
              id: '1',
              question: 'What is the formula for calculating velocity?',
              question_type: 'multiple_choice',
              options: ['v = d/t', 'v = t/d', 'v = d*t', 'v = d²/t'],
              correct_answer: 'v = d/t',
              explanation: 'Velocity equals distance divided by time',
              difficulty: 'beginner',
              learning_objective: 'Understand basic kinematic equations'
            }
          ]
        }
      }
    }
  }

  const subjectData = quizTemplates[subject]?.[topic]?.[difficulty] || {
    title: `${subject} - ${topic} Quiz`,
    description: `Test your knowledge of ${topic} in ${subject}`,
    time_limit_minutes: 30,
    passing_score: 70,
    questions: [
      {
        id: '1',
        question: `What is the main concept in ${topic}?`,
        question_type: 'multiple_choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: 'Option A',
        explanation: `This is the correct answer for ${topic}`,
        difficulty,
        learning_objective: `Understand ${topic} concepts`
      }
    ]
  }

  // Generate additional questions if needed
  while (subjectData.questions.length < questionCount) {
    const newQuestion = {
      id: (subjectData.questions.length + 1).toString(),
      question: `Sample question ${subjectData.questions.length + 1} about ${topic}?`,
      question_type: quizType,
      options: quizType === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correct_answer: 'Correct Answer',
      explanation: `Explanation for question ${subjectData.questions.length + 1}`,
      difficulty,
      learning_objective: `Master ${topic} concepts`
    }
    subjectData.questions.push(newQuestion)
  }

  return subjectData
}

function generateAIInsights(subject: string, topic: string, difficulty: string, questions: any[]): any {
  const insights = {
    recommended_approach: difficulty === 'beginner' 
      ? 'Take your time and read each question carefully. Focus on understanding the concepts rather than speed.'
      : 'Use your knowledge systematically. Eliminate obviously wrong answers first.',
    key_concepts: questions.map(q => q.learning_objective).slice(0, 3),
    common_mistakes: [
      'Rushing through questions without reading carefully',
      'Not showing work for calculation problems',
      'Guessing without eliminating options first'
    ],
    study_tips: [
      'Review the fundamental concepts before taking the quiz',
      'Practice similar problems to build confidence',
      'Use the explanations to understand your mistakes'
    ]
  }

  return insights
}
