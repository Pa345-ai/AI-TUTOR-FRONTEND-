import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancedQuizRequest {
  user_id: string
  subject: string
  topic: string
  difficulty_level: string
  question_count: number
  quiz_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay' | 'interactive'
  learning_objectives?: string[]
  user_learning_style?: string
  previous_performance?: number
  time_constraints?: number
}

interface EnhancedQuizResponse {
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
      hints: string[]
      reasoning_steps: string[]
      real_world_application: string
      common_mistakes: string[]
    }>
    time_limit_minutes: number
    passing_score: number
    adaptive_difficulty: boolean
    personalized_feedback: boolean
  }
  ai_insights: {
    recommended_approach: string
    key_concepts: string[]
    common_mistakes: string[]
    study_tips: string[]
    learning_path_suggestions: string[]
    confidence_building_strategies: string[]
  }
  personalization: {
    difficulty_adjustment: string
    learning_style_adaptation: string
    performance_prediction: number
    engagement_optimization: string[]
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
      learning_objectives = [],
      user_learning_style = 'visual',
      previous_performance = 75,
      time_constraints = 30
    }: EnhancedQuizRequest = await req.json()

    // Get comprehensive user context
    const userContext = await getUserQuizContext(supabaseClient, user_id)
    
    // Analyze user's learning patterns and preferences
    const learningAnalysis = analyzeUserLearningPatterns(userContext, previous_performance)
    
    // Generate sophisticated quiz content
    const quizData = await generateSophisticatedQuizContent(
      subject, 
      topic, 
      difficulty_level, 
      question_count, 
      quiz_type,
      learning_objectives,
      learningAnalysis,
      userContext
    )
    
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

    // Create enhanced quiz in database
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
        ai_generated: true,
        metadata: {
          adaptive_difficulty: quizData.adaptive_difficulty,
          personalized_feedback: quizData.personalized_feedback,
          learning_style_adapted: user_learning_style,
          performance_prediction: learningAnalysis.performancePrediction
        }
      })
      .select()
      .single()

    if (quizError) throw quizError

    // Generate comprehensive AI insights
    const aiInsights = generateComprehensiveInsights(subject, topic, difficulty_level, quizData.questions, learningAnalysis)
    
    // Generate personalization recommendations
    const personalization = generatePersonalizationRecommendations(learningAnalysis, user_learning_style, previous_performance)

    // Log quiz generation event
    await supabaseClient.rpc('log_security_event', {
      p_event_type: 'quiz_generation',
      p_description: `Generated ${quiz_type} quiz for ${subject} - ${topic}`,
      p_severity: 'info',
      p_metadata: {
        question_count,
        difficulty_level,
        learning_style: user_learning_style,
        performance_prediction: learningAnalysis.performancePrediction
      }
    })

    const response: EnhancedQuizResponse = {
      quiz: {
        id: quiz.id,
        ...quizData
      },
      ai_insights: aiInsights,
      personalization
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

async function getUserQuizContext(supabaseClient: any, userId: string): Promise<any> {
  // Get user profile
  const { data: user } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  // Get recent quiz attempts
  const { data: quizAttempts } = await supabaseClient
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(20)

  // Get knowledge graph
  const { data: knowledgeGraph } = await supabaseClient
    .from('knowledge_graphs')
    .select('*')
    .eq('user_id', userId)
    .order('mastery_level', { ascending: false })

  // Get progress data
  const { data: progress } = await supabaseClient
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(30)

  // Get cognitive twin data
  const { data: cognitiveTwin } = await supabaseClient
    .from('cognitive_twins')
    .select('*')
    .eq('user_id', userId)
    .single()

  return {
    user,
    quizAttempts,
    knowledgeGraph,
    progress,
    cognitiveTwin
  }
}

function analyzeUserLearningPatterns(userContext: any, previousPerformance: number): any {
  const { user, quizAttempts, knowledgeGraph, progress, cognitiveTwin } = userContext

  // Analyze quiz performance patterns
  const avgQuizScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / Math.max(quizAttempts.length, 1)
  const performanceTrend = calculatePerformanceTrend(quizAttempts)
  
  // Analyze learning velocity
  const completedLessons = progress.filter(p => p.progress_type === 'lesson_completion' && p.percentage >= 100).length
  const learningVelocity = completedLessons > 15 ? 'fast' : completedLessons > 8 ? 'moderate' : 'slow'
  
  // Analyze knowledge gaps
  const knowledgeGaps = knowledgeGraph
    .filter(kg => kg.mastery_level < 70)
    .map(kg => kg.topic)
  
  // Analyze cognitive patterns
  const cognitiveProfile = cognitiveTwin?.learning_style_profile || {}
  const optimalSessionLength = cognitiveTwin?.learning_patterns?.preferred_session_length || 45
  
  // Predict performance
  const performancePrediction = calculatePerformancePrediction(
    avgQuizScore, 
    performanceTrend, 
    learningVelocity, 
    knowledgeGaps.length
  )

  return {
    avgQuizScore,
    performanceTrend,
    learningVelocity,
    knowledgeGaps,
    cognitiveProfile,
    optimalSessionLength,
    performancePrediction,
    learningStyle: user?.learning_style || 'visual',
    difficultyPreference: user?.difficulty_preference || 'medium'
  }
}

function calculatePerformanceTrend(quizAttempts: any[]): string {
  if (quizAttempts.length < 3) return 'insufficient_data'
  
  const recentScores = quizAttempts.slice(0, 5).map(attempt => attempt.score || 0)
  const olderScores = quizAttempts.slice(5, 10).map(attempt => attempt.score || 0)
  
  const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
  const olderAvg = olderScores.length > 0 ? 
    olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length : recentAvg
  
  if (recentAvg > olderAvg + 5) return 'improving'
  if (recentAvg < olderAvg - 5) return 'declining'
  return 'stable'
}

function calculatePerformancePrediction(
  avgScore: number, 
  trend: string, 
  velocity: string, 
  knowledgeGaps: number
): number {
  let prediction = avgScore
  
  // Adjust based on trend
  if (trend === 'improving') prediction += 5
  else if (trend === 'declining') prediction -= 5
  
  // Adjust based on learning velocity
  if (velocity === 'fast') prediction += 3
  else if (velocity === 'slow') prediction -= 3
  
  // Adjust based on knowledge gaps
  prediction -= knowledgeGaps * 2
  
  return Math.max(0, Math.min(100, prediction))
}

async function generateSophisticatedQuizContent(
  subject: string,
  topic: string,
  difficulty: string,
  questionCount: number,
  quizType: string,
  learningObjectives: string[],
  learningAnalysis: any,
  userContext: any
): Promise<any> {
  
  const { performancePrediction, learningStyle, knowledgeGaps } = learningAnalysis
  
  // Get OpenAI API key
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Generate AI-powered quiz using OpenAI
  const quizPrompt = `You are an expert educational AI that creates comprehensive, engaging quizzes. Generate a quiz with the following specifications:

Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty}
Number of Questions: ${questionCount}
Quiz Type: ${quizType}
Learning Objectives: ${learningObjectives.join(', ')}
User Learning Style: ${learningStyle}
Performance Prediction: ${performancePrediction}%
Knowledge Gaps: ${knowledgeGaps.join(', ')}

Create a quiz that:
1. Tests understanding at the appropriate difficulty level
2. Includes diverse question types based on quizType
3. Provides clear explanations for each answer
4. Includes hints and reasoning steps
5. Connects to real-world applications
6. Identifies common mistakes
7. Adapts to the user's learning style and knowledge gaps

Format the response as JSON with this exact structure:
{
  "quiz": {
    "title": "Quiz title",
    "description": "Quiz description",
    "questions": [
      {
        "id": "q1",
        "question": "Question text",
        "question_type": "multiple_choice|true_false|fill_blank|essay|interactive",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Correct answer or array of correct answers",
        "explanation": "Detailed explanation of the answer",
        "difficulty": "beginner|intermediate|advanced",
        "learning_objective": "What this question tests",
        "hints": ["Hint 1", "Hint 2"],
        "reasoning_steps": ["Step 1", "Step 2", "Step 3"],
        "real_world_application": "How this applies in real life",
        "common_mistakes": ["Common mistake 1", "Common mistake 2"]
      }
    ],
    "time_limit_minutes": 30,
    "passing_score": 70,
    "adaptive_difficulty": true,
    "personalized_feedback": true
  },
  "ai_insights": {
    "recommended_approach": "How to approach this quiz",
    "key_concepts": ["Concept 1", "Concept 2"],
    "common_mistakes": ["Mistake 1", "Mistake 2"],
    "study_tips": ["Tip 1", "Tip 2"],
    "difficulty_analysis": "Analysis of difficulty level",
    "learning_recommendations": ["Recommendation 1", "Recommendation 2"]
  }
}`

  try {
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
            content: 'You are an expert educational AI that creates comprehensive, engaging quizzes. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: quizPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
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
    let quizData
    try {
      quizData = JSON.parse(aiContent)
    } catch (parseError) {
      // Fallback to rule-based generation if JSON parsing fails
      quizData = generateFallbackQuiz(subject, topic, difficulty, questionCount, quizType, learningObjectives, learningAnalysis, userContext)
    }

    return quizData

  } catch (error) {
    console.error('AI quiz generation failed, using fallback:', error)
    return generateFallbackQuiz(subject, topic, difficulty, questionCount, quizType, learningObjectives, learningAnalysis, userContext)
  }
}

function generateFallbackQuiz(
  subject: string,
  topic: string,
  difficulty: string,
  questionCount: number,
  quizType: string,
  learningObjectives: string[],
  learningAnalysis: any,
  userContext: any
): any {
  // Fallback quiz generation logic
  const enhancedQuestions = Array.from({ length: questionCount }, (_, index) => {
    return enhanceQuestionForUser(question, learningStyle, knowledgeGaps, index + 1)
  })
  
  // Generate additional questions if needed
  while (enhancedQuestions.length < questionCount) {
    const newQuestion = generateAdaptiveQuestion(
      subject, 
      topic, 
      difficulty, 
      quizType, 
      learningObjectives,
      learningAnalysis,
      enhancedQuestions.length + 1
    )
    enhancedQuestions.push(newQuestion)
  }
  
  // Adjust difficulty based on user performance prediction
  const adjustedDifficulty = adjustDifficultyForUser(difficulty, performancePrediction)
  
  // Set time limit based on user's optimal session length
  const timeLimit = Math.min(learningAnalysis.optimalSessionLength, 60)
  
  return {
    title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} - ${topic.charAt(0).toUpperCase() + topic.slice(1)} Mastery Quiz`,
    description: `A comprehensive assessment designed to evaluate your understanding of ${topic} in ${subject}. This quiz adapts to your learning style and provides detailed feedback to help you improve.`,
    questions: enhancedQuestions,
    time_limit_minutes: timeLimit,
    passing_score: performancePrediction > 80 ? 85 : performancePrediction > 60 ? 75 : 70,
    adaptive_difficulty: true,
    personalized_feedback: true
  }
}

function getEnhancedQuizTemplates(subject: string, topic: string, difficulty: string): any {
  return {
    'mathematics': {
      'algebra': {
        'beginner': {
          questions: [
            {
              id: '1',
              question: 'What is the value of x in the equation 2x + 5 = 13?',
              question_type: 'multiple_choice',
              options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
              correct_answer: 'x = 4',
              explanation: 'To solve: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4. This demonstrates the fundamental principle of isolating the variable by performing inverse operations.',
              difficulty: 'beginner',
              learning_objective: 'Solve linear equations with one variable',
              hints: [
                'Remember to perform the same operation on both sides of the equation',
                'Start by isolating the term with the variable',
                'Use inverse operations: addition/subtraction, multiplication/division'
              ],
              reasoning_steps: [
                'Identify the equation: 2x + 5 = 13',
                'Subtract 5 from both sides: 2x = 8',
                'Divide both sides by 2: x = 4',
                'Verify: 2(4) + 5 = 8 + 5 = 13 ✓'
              ],
              real_world_application: 'This skill is essential for calculating costs, solving problems in physics, and understanding relationships between variables in real-world scenarios.',
              common_mistakes: [
                'Forgetting to perform operations on both sides',
                'Making arithmetic errors during calculation',
                'Not verifying the solution by substitution'
              ]
            },
            {
              id: '2',
              question: 'Simplify the expression: 3(x + 2) - 2x',
              question_type: 'multiple_choice',
              options: ['x + 6', '5x + 6', 'x + 2', '3x + 4'],
              correct_answer: 'x + 6',
              explanation: 'Distribute: 3(x + 2) - 2x = 3x + 6 - 2x = x + 6. This demonstrates the distributive property and combining like terms.',
              difficulty: 'beginner',
              learning_objective: 'Apply distributive property and combine like terms',
              hints: [
                'Use the distributive property: a(b + c) = ab + ac',
                'Combine like terms by adding coefficients',
                'Be careful with signs when combining terms'
              ],
              reasoning_steps: [
                'Apply distributive property: 3(x + 2) = 3x + 6',
                'Rewrite expression: 3x + 6 - 2x',
                'Combine like terms: 3x - 2x = x',
                'Final result: x + 6'
              ],
              real_world_application: 'This skill is used in calculating areas, simplifying formulas in science and engineering, and solving optimization problems.',
              common_mistakes: [
                'Incorrectly applying the distributive property',
                'Forgetting to distribute to all terms inside parentheses',
                'Making sign errors when combining like terms'
              ]
            }
          ]
        },
        'intermediate': {
          questions: [
            {
              id: '1',
              question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
              question_type: 'multiple_choice',
              options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 0, x = 5'],
              correct_answer: 'x = 2, x = 3',
              explanation: 'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3. This demonstrates factoring quadratic equations and the zero product property.',
              difficulty: 'intermediate',
              learning_objective: 'Solve quadratic equations by factoring',
              hints: [
                'Look for two numbers that multiply to 6 and add to -5',
                'Use the zero product property: if ab = 0, then a = 0 or b = 0',
                'Check your solutions by substituting back into the original equation'
              ],
              reasoning_steps: [
                'Identify the quadratic equation: x² - 5x + 6 = 0',
                'Find factors of 6 that add to -5: -2 and -3',
                'Factor: (x - 2)(x - 3) = 0',
                'Apply zero product property: x - 2 = 0 or x - 3 = 0',
                'Solve: x = 2 or x = 3'
              ],
              real_world_application: 'Quadratic equations model projectile motion, optimization problems, and many phenomena in physics and engineering.',
              common_mistakes: [
                'Incorrectly identifying factors',
                'Forgetting to set each factor equal to zero',
                'Making sign errors when factoring'
              ]
            }
          ]
        }
      }
    },
    'programming': {
      'python': {
        'beginner': {
          questions: [
            {
              id: '1',
              question: 'What is the output of: print(3 + 2 * 4)',
              question_type: 'multiple_choice',
              options: ['20', '11', '14', 'Error'],
              correct_answer: '11',
              explanation: 'Order of operations: multiplication first (2*4=8), then addition (3+8=11). Python follows PEMDAS/BODMAS rules for operator precedence.',
              difficulty: 'beginner',
              learning_objective: 'Understand operator precedence in Python',
              hints: [
                'Remember PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction',
                'Multiplication and division have higher precedence than addition and subtraction',
                'Operations with the same precedence are evaluated left to right'
              ],
              reasoning_steps: [
                'Identify the expression: 3 + 2 * 4',
                'Apply operator precedence: multiplication first',
                'Calculate 2 * 4 = 8',
                'Then addition: 3 + 8 = 11',
                'Print the result: 11'
              ],
              real_world_application: 'Understanding operator precedence is crucial for writing correct mathematical expressions in programming and avoiding bugs.',
              common_mistakes: [
                'Evaluating operations left to right without considering precedence',
                'Forgetting that multiplication comes before addition',
                'Not using parentheses when needed for clarity'
              ]
            }
          ]
        }
      }
    }
  }
}

function enhanceQuestionForUser(question: any, learningStyle: string, knowledgeGaps: string[], questionNumber: number): any {
  // Add learning style specific enhancements
  const enhancedQuestion = { ...question }
  
  if (learningStyle === 'visual') {
    enhancedQuestion.hints = [
      ...enhancedQuestion.hints,
      'Try drawing a diagram or flowchart to visualize this problem',
      'Consider using a visual representation to organize your thoughts'
    ]
  } else if (learningStyle === 'auditory') {
    enhancedQuestion.hints = [
      ...enhancedQuestion.hints,
      'Try explaining the problem out loud to yourself',
      'Consider discussing this with a study partner'
    ]
  } else if (learningStyle === 'kinesthetic') {
    enhancedQuestion.hints = [
      ...enhancedQuestion.hints,
      'Try working through this step by step on paper',
      'Consider using physical objects or manipulatives if applicable'
    ]
  }
  
  // Add personalized hints based on knowledge gaps
  if (knowledgeGaps.includes(question.learning_objective.toLowerCase())) {
    enhancedQuestion.hints = [
      ...enhancedQuestion.hints,
      'This question focuses on a concept you might want to review',
      'Take your time and don\'t hesitate to ask for clarification'
    ]
  }
  
  return enhancedQuestion
}

function generateAdaptiveQuestion(
  subject: string,
  topic: string,
  difficulty: string,
  quizType: string,
  learningObjectives: string[],
  learningAnalysis: any,
  questionNumber: number
): any {
  // Generate a new question based on the subject, topic, and difficulty
  const questionTemplates = {
    'mathematics': {
      'algebra': {
        'beginner': [
          {
            question: `Solve for x: ${generateRandomEquation()}`,
            learning_objective: 'Solve linear equations with one variable',
            explanation: 'This demonstrates solving linear equations using inverse operations.'
          }
        ]
      }
    },
    'programming': {
      'python': {
        'beginner': [
          {
            question: `What will this code output: ${generateRandomCodeSnippet()}`,
            learning_objective: 'Understand Python syntax and execution',
            explanation: 'This tests your understanding of Python code execution and syntax.'
          }
        ]
      }
    }
  }
  
  const template = questionTemplates[subject]?.[topic]?.[difficulty]?.[0] || {
    question: `Sample question ${questionNumber} about ${topic}?`,
    learning_objective: `Master ${topic} concepts`,
    explanation: `This question tests your understanding of ${topic}.`
  }
  
  return {
    id: questionNumber.toString(),
    question: template.question,
    question_type: quizType,
    options: quizType === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
    correct_answer: 'Correct Answer',
    explanation: template.explanation,
    difficulty,
    learning_objective: template.learning_objective,
    hints: [
      'Read the question carefully',
      'Consider all options before choosing',
      'Use the process of elimination if unsure'
    ],
    reasoning_steps: [
      'Analyze the problem',
      'Apply relevant concepts',
      'Check your work',
      'Verify your answer'
    ],
    real_world_application: `This concept is important for understanding ${topic} in real-world applications.`,
    common_mistakes: [
      'Rushing through the problem',
      'Not reading all options',
      'Making calculation errors'
    ]
  }
}

function generateRandomEquation(): string {
  const a = Math.floor(Math.random() * 5) + 2
  const b = Math.floor(Math.random() * 10) + 1
  const c = Math.floor(Math.random() * 20) + 5
  return `${a}x + ${b} = ${c}`
}

function generateRandomCodeSnippet(): string {
  const snippets = [
    'print(2 + 3 * 4)',
    'x = 5\ny = x + 3\nprint(y)',
    'for i in range(3):\n    print(i)',
    'if True:\n    print("Hello")'
  ]
  return snippets[Math.floor(Math.random() * snippets.length)]
}

function adjustDifficultyForUser(difficulty: string, performancePrediction: number): string {
  if (performancePrediction > 85 && difficulty === 'beginner') return 'intermediate'
  if (performancePrediction < 60 && difficulty === 'intermediate') return 'beginner'
  return difficulty
}

function generateComprehensiveInsights(
  subject: string,
  topic: string,
  difficulty: string,
  questions: any[],
  learningAnalysis: any
): any {
  return {
    recommended_approach: difficulty === 'beginner' 
      ? 'Take your time and read each question carefully. Focus on understanding the concepts rather than speed. Use the hints provided to guide your thinking.'
      : 'Use your knowledge systematically. Eliminate obviously wrong answers first, then work through the remaining options methodically.',
    key_concepts: questions.map(q => q.learning_objective).slice(0, 5),
    common_mistakes: [
      'Rushing through questions without reading carefully',
      'Not using the provided hints and reasoning steps',
      'Guessing without eliminating options first',
      'Not checking work for simple arithmetic errors',
      'Skipping the explanation after answering incorrectly'
    ],
    study_tips: [
      'Review the fundamental concepts before taking the quiz',
      'Practice similar problems to build confidence',
      'Use the explanations to understand your mistakes',
      'Take notes on concepts you find challenging',
      'Create flashcards for key formulas and concepts'
    ],
    learning_path_suggestions: [
      'Complete the prerequisite lessons if you scored below 70%',
      'Move to advanced topics if you scored above 90%',
      'Focus on practice problems in your weak areas',
      'Consider working with a study group or tutor'
    ],
    confidence_building_strategies: [
      'Start with easier questions to build momentum',
      'Celebrate small victories and progress',
      'Remember that mistakes are part of the learning process',
      'Use the detailed explanations to improve understanding'
    ]
  }
}

function generatePersonalizationRecommendations(
  learningAnalysis: any,
  learningStyle: string,
  previousPerformance: number
): any {
  return {
    difficulty_adjustment: previousPerformance > 80 
      ? 'Consider increasing difficulty to maintain engagement'
      : previousPerformance < 60
      ? 'Focus on foundational concepts before advancing'
      : 'Current difficulty level appears appropriate',
    learning_style_adaptation: learningStyle === 'visual'
      ? 'Use diagrams, charts, and visual aids to enhance understanding'
      : learningStyle === 'auditory'
      ? 'Explain concepts out loud and discuss with others'
      : 'Use hands-on practice and step-by-step problem solving',
    performance_prediction: learningAnalysis.performancePrediction,
    engagement_optimization: [
      'Take breaks every 15-20 minutes to maintain focus',
      'Use the hints and explanations to deepen understanding',
      'Set small, achievable goals for each study session',
      'Track your progress to stay motivated'
    ]
  }
}
