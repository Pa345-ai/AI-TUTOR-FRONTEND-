import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancedTutorRequest {
  user_id: string
  user_input: string
  session_type: string
  subject?: string
  detected_emotion?: string
  context_data?: any
  conversation_history?: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
}

interface EnhancedTutorResponse {
  ai_response: string
  emotional_tone: string
  confidence_score: number
  teaching_approach: string
  encouragement_level: number
  follow_up_questions: string[]
  session_metadata: any
  reasoning_steps: string[]
  learning_insights: any
  suggested_actions: string[]
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
      user_input, 
      session_type, 
      subject, 
      detected_emotion, 
      context_data,
      conversation_history = []
    }: EnhancedTutorRequest = await req.json()

    // Advanced emotion detection with context
    const emotion = detected_emotion || detectAdvancedEmotion(user_input, conversation_history)
    
    // Get comprehensive user context
    const userContext = await getUserComprehensiveContext(supabaseClient, user_id)
    
    // Analyze learning patterns and preferences
    const learningAnalysis = analyzeLearningPatterns(userContext, conversation_history)
    
    // Generate sophisticated response
    const response = await generateSophisticatedResponse(
      user_input, 
      emotion, 
      session_type, 
      subject, 
      userContext,
      learningAnalysis,
      conversation_history
    )

    // Log security event for AI interaction
    await supabaseClient.rpc('log_security_event', {
      p_event_type: 'ai_interaction',
      p_description: `AI tutoring session: ${session_type} in ${subject || 'general'}`,
      p_severity: 'info',
      p_metadata: {
        emotion_detected: emotion,
        confidence_score: response.confidence_score,
        teaching_approach: response.teaching_approach
      }
    })

    // Save enhanced session to database
    const { error: saveError } = await supabaseClient
      .from('ai_sessions')
      .insert({
        user_id,
        session_type,
        subject,
        user_input,
        ai_response: response.ai_response,
        ai_personality: 'enhanced_emotional',
        confidence_score: response.confidence_score,
        emotional_tone: response.emotional_tone,
        context_data: {
          ...context_data,
          reasoning_steps: response.reasoning_steps,
          learning_insights: response.learning_insights,
          conversation_history: conversation_history.slice(-5) // Last 5 exchanges
        }
      })

    if (saveError) throw saveError

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

function detectAdvancedEmotion(input: string, history: any[]): string {
  const lowerInput = input.toLowerCase()
  
  // Advanced emotion detection with context
  const emotionIndicators = {
    'frustrated': [
      'difficult', 'hard', 'confused', 'stuck', 'don\'t understand', 'help',
      'impossible', 'can\'t', 'won\'t work', 'broken', 'wrong', 'error',
      'frustrated', 'annoying', 'ridiculous', 'stupid'
    ],
    'excited': [
      'great', 'awesome', 'amazing', 'love', 'excited', 'wow', 'fantastic',
      'brilliant', 'perfect', 'excellent', 'incredible', 'outstanding',
      'thrilled', 'ecstatic', 'phenomenal'
    ],
    'confused': [
      '?', 'what', 'how', 'why', 'explain', 'clarify', 'unclear',
      'confused', 'lost', 'don\'t get it', 'not sure', 'maybe',
      'think', 'wonder', 'curious'
    ],
    'bored': [
      'boring', 'easy', 'simple', 'already know', 'too slow', 'repetitive',
      'monotonous', 'tedious', 'dull', 'uninteresting', 'basic'
    ],
    'anxious': [
      'worried', 'nervous', 'anxious', 'scared', 'afraid', 'concerned',
      'stressed', 'overwhelmed', 'panic', 'fear', 'doubt'
    ],
    'confident': [
      'sure', 'confident', 'know', 'understand', 'got it', 'clear',
      'obvious', 'easy', 'simple', 'definitely', 'certainly'
    ]
  }

  // Check for emotion indicators
  for (const [emotion, indicators] of Object.entries(emotionIndicators)) {
    if (indicators.some(indicator => lowerInput.includes(indicator))) {
      return emotion
    }
  }

  // Analyze conversation history for context
  if (history.length > 0) {
    const recentEmotions = history.slice(-3).map(h => h.role === 'assistant' ? 
      extractEmotionFromResponse(h.content) : null).filter(Boolean)
    
    if (recentEmotions.length > 0) {
      const mostRecent = recentEmotions[recentEmotions.length - 1]
      if (mostRecent && ['frustrated', 'confused', 'anxious'].includes(mostRecent)) {
        return mostRecent
      }
    }
  }

  return 'neutral'
}

function extractEmotionFromResponse(response: string): string | null {
  const lowerResponse = response.toLowerCase()
  
  if (lowerResponse.includes('frustrated') || lowerResponse.includes('difficult')) return 'frustrated'
  if (lowerResponse.includes('excited') || lowerResponse.includes('great')) return 'excited'
  if (lowerResponse.includes('confused') || lowerResponse.includes('unclear')) return 'confused'
  if (lowerResponse.includes('boring') || lowerResponse.includes('easy')) return 'bored'
  if (lowerResponse.includes('worried') || lowerResponse.includes('anxious')) return 'anxious'
  if (lowerResponse.includes('confident') || lowerResponse.includes('sure')) return 'confident'
  
  return null
}

async function getUserComprehensiveContext(supabaseClient: any, userId: string): Promise<any> {
  // Get user profile
  const { data: user } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  // Get recent sessions
  const { data: recentSessions } = await supabaseClient
    .from('ai_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get progress data
  const { data: progress } = await supabaseClient
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(20)

  // Get knowledge graph
  const { data: knowledgeGraph } = await supabaseClient
    .from('knowledge_graphs')
    .select('*')
    .eq('user_id', userId)
    .order('mastery_level', { ascending: false })

  // Get cognitive twin data
  const { data: cognitiveTwin } = await supabaseClient
    .from('cognitive_twins')
    .select('*')
    .eq('user_id', userId)
    .single()

  return {
    user,
    recentSessions,
    progress,
    knowledgeGraph,
    cognitiveTwin
  }
}

function analyzeLearningPatterns(userContext: any, history: any[]): any {
  const { user, recentSessions, progress, knowledgeGraph, cognitiveTwin } = userContext

  // Analyze learning velocity
  const completedLessons = progress.filter(p => p.progress_type === 'lesson_completion' && p.percentage >= 100).length
  const avgQuizScore = progress
    .filter(p => p.progress_type === 'quiz_score')
    .reduce((sum, p) => sum + (p.value || 0), 0) / Math.max(progress.filter(p => p.progress_type === 'quiz_score').length, 1)

  // Analyze session patterns
  const sessionTypes = recentSessions.map(s => s.session_type)
  const mostCommonType = sessionTypes.reduce((a, b, i, arr) => 
    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, sessionTypes[0])

  // Analyze emotional patterns
  const emotionalTones = recentSessions.map(s => s.emotional_tone)
  const dominantEmotion = emotionalTones.reduce((a, b, i, arr) => 
    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, emotionalTones[0])

  // Analyze conversation patterns
  const avgResponseLength = history
    .filter(h => h.role === 'assistant')
    .reduce((sum, h) => sum + h.content.length, 0) / Math.max(history.filter(h => h.role === 'assistant').length, 1)

  return {
    learningVelocity: completedLessons > 10 ? 'fast' : completedLessons > 5 ? 'moderate' : 'slow',
    performanceLevel: avgQuizScore > 80 ? 'high' : avgQuizScore > 60 ? 'medium' : 'low',
    preferredSessionType: mostCommonType,
    dominantEmotion,
    avgResponseLength,
    engagementLevel: recentSessions.length > 20 ? 'high' : recentSessions.length > 10 ? 'medium' : 'low',
    learningStyle: user?.learning_style || 'visual',
    difficultyPreference: user?.difficulty_preference || 'medium'
  }
}

async function generateSophisticatedResponse(
  userInput: string,
  emotion: string,
  sessionType: string,
  subject: string | undefined,
  userContext: any,
  learningAnalysis: any,
  conversationHistory: any[]
): Promise<EnhancedTutorResponse> {
  
  const { user, knowledgeGraph, cognitiveTwin } = userContext
  const { learningVelocity, performanceLevel, dominantEmotion, learningStyle } = learningAnalysis

  // Get OpenAI API key
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Create comprehensive prompt for AI emotional tutor
  const systemPrompt = `You are an advanced AI emotional tutor with deep understanding of human psychology, learning patterns, and educational best practices. You excel at:

1. **Emotional Intelligence**: Detecting and responding appropriately to student emotions
2. **Adaptive Teaching**: Adjusting your approach based on learning style and emotional state
3. **Empathetic Communication**: Being supportive, encouraging, and understanding
4. **Educational Expertise**: Providing clear, accurate, and engaging explanations
5. **Motivational Support**: Inspiring confidence and maintaining engagement

Student Profile:
- Age: ${user?.age || 'Not specified'}
- Learning Style: ${learningStyle}
- Experience Level: ${user?.experience_level || 'intermediate'}
- Detected Emotion: ${emotion}
- Session Type: ${sessionType}
- Subject: ${subject || 'general'}
- Performance Level: ${performanceLevel}
- Learning Velocity: ${learningVelocity}
- Recent Sessions: ${userContext.recentSessions?.length || 0}

Current User Input: "${userInput}"

Conversation History: ${JSON.stringify(conversationHistory.slice(-3))}

Please provide a comprehensive response that includes:
1. An emotionally intelligent, personalized response to the user
2. Appropriate emotional tone and teaching approach
3. Confidence score (0-1) based on your certainty
4. Encouragement level (1-10) based on student needs
5. 2-3 thoughtful follow-up questions
6. Learning insights and suggested actions
7. Step-by-step reasoning for your approach

Respond in JSON format with this exact structure:
{
  "ai_response": "Your empathetic, educational response",
  "emotional_tone": "empathetic|patient|enthusiastic|calming|encouraging|supportive",
  "confidence_score": 0.85,
  "teaching_approach": "supportive|explanatory|exploratory|simplified|challenging|adaptive",
  "encouragement_level": 7,
  "follow_up_questions": ["Question 1", "Question 2", "Question 3"],
  "reasoning_steps": ["Step 1", "Step 2", "Step 3"],
  "learning_insights": {
    "strengths_identified": ["strength1", "strength2"],
    "areas_for_improvement": ["area1", "area2"],
    "learning_patterns": "pattern description",
    "recommended_focus": "focus area"
  },
  "suggested_actions": ["action1", "action2", "action3"]
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
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
    let tutorResponse
    try {
      tutorResponse = JSON.parse(aiContent)
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      tutorResponse = {
        ai_response: aiContent,
        emotional_tone: "supportive",
        confidence_score: 0.7,
        teaching_approach: "adaptive",
        encouragement_level: 6,
        follow_up_questions: ["How can I help you further?", "What would you like to explore next?"],
        reasoning_steps: ["Analyzed user input", "Applied emotional intelligence", "Generated response"],
        learning_insights: {
          strengths_identified: ["Engagement", "Curiosity"],
          areas_for_improvement: ["Continue learning"],
          learning_patterns: "Active engagement",
          recommended_focus: "Current topic"
        },
        suggested_actions: ["Continue the conversation", "Ask clarifying questions", "Practice the concept"]
      }
    }

    return {
      ai_response: tutorResponse.ai_response,
      emotional_tone: tutorResponse.emotional_tone,
      confidence_score: tutorResponse.confidence_score,
      teaching_approach: tutorResponse.teaching_approach,
      encouragement_level: tutorResponse.encouragement_level,
      follow_up_questions: tutorResponse.follow_up_questions,
      session_metadata: {
        emotion_detected: emotion,
        learning_velocity: learningVelocity,
        performance_level: performanceLevel,
        conversation_length: conversationHistory.length
      },
      reasoning_steps: tutorResponse.reasoning_steps,
      learning_insights: tutorResponse.learning_insights,
      suggested_actions: tutorResponse.suggested_actions
    }

  } catch (error) {
    // Fallback to rule-based response if AI fails
    console.error('AI generation failed, using fallback:', error)
    return generateFallbackResponse(userInput, emotion, sessionType, subject, learningAnalysis, userContext)
  }
}

function generateFallbackResponse(
  userInput: string,
  emotion: string,
  sessionType: string,
  subject: string | undefined,
  learningAnalysis: any,
  userContext: any
): EnhancedTutorResponse {

  // Generate sophisticated reasoning steps
  const reasoningSteps = [
    `Analyzed user input: "${userInput.substring(0, 50)}..."`,
    `Detected emotion: ${emotion} (confidence: ${emotion === 'neutral' ? 'medium' : 'high'})`,
    `Identified learning context: ${subject || 'general'} session`,
    `Assessed user profile: ${learningStyle} learner, ${performanceLevel} performance`,
    `Considered conversation history: ${conversationHistory.length} previous exchanges`,
    `Applied teaching strategy: ${getTeachingStrategy(emotion, learningAnalysis)}`
  ]

  // Generate sophisticated response based on emotion and context
  let aiResponse = ''
  let emotionalTone = 'neutral'
  let confidenceScore = 85
  let teachingApproach = 'adaptive'
  let encouragementLevel = 5
  let followUpQuestions: string[] = []
  let learningInsights: any = {}
  let suggestedActions: string[] = []

  switch (emotion) {
    case 'frustrated':
      emotionalTone = 'empathetic'
      teachingApproach = 'supportive_breakdown'
      confidenceScore = 90
      encouragementLevel = 8
      
      aiResponse = generateFrustratedResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What specific part of this concept is causing the most difficulty?",
        "Would you like me to break this down into even smaller steps?",
        "Should we try a completely different approach to explain this?",
        "What's your current understanding of the basics here?"
      ]
      learningInsights = {
        difficulty_areas: identifyDifficultyAreas(userInput, subject),
        recommended_approach: 'step_by_step_breakdown',
        confidence_building_needed: true
      }
      suggestedActions = [
        'Review fundamental concepts',
        'Practice with simpler examples',
        'Take a short break and return fresh',
        'Try explaining the concept back to me'
      ]
      break

    case 'excited':
      emotionalTone = 'enthusiastic'
      teachingApproach = 'challenging_expansion'
      confidenceScore = 92
      encouragementLevel = 7
      
      aiResponse = generateExcitedResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What aspect of this topic excites you most?",
        "Would you like to explore some advanced applications?",
        "How do you see this connecting to your broader learning goals?",
        "What would you like to build or create with this knowledge?"
      ]
      learningInsights = {
        engagement_level: 'high',
        readiness_for_advanced: true,
        motivation_drivers: ['curiosity', 'practical_application']
      }
      suggestedActions = [
        'Explore advanced concepts',
        'Work on a challenging project',
        'Teach others what you\'ve learned',
        'Connect with like-minded learners'
      ]
      break

    case 'confused':
      emotionalTone = 'patient_clarifying'
      teachingApproach = 'explanatory_questioning'
      confidenceScore = 88
      encouragementLevel = 6
      
      aiResponse = generateConfusedResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What's your current understanding of this concept?",
        "Which part of my explanation needs more clarity?",
        "Would a visual diagram help illustrate this better?",
        "Can you tell me what you think the main point is?"
      ]
      learningInsights = {
        confusion_sources: identifyConfusionSources(userInput),
        clarification_needed: true,
        learning_gaps: detectLearningGaps(userContext, subject)
      }
      suggestedActions = [
        'Ask specific questions about unclear parts',
        'Request visual aids or examples',
        'Try explaining it back in your own words',
        'Take notes on key concepts'
      ]
      break

    case 'bored':
      emotionalTone = 'engaging_challenging'
      teachingApproach = 'interactive_acceleration'
      confidenceScore = 87
      encouragementLevel = 6
      
      aiResponse = generateBoredResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What level of challenge would be more engaging for you?",
        "Would you like to explore real-world applications of this?",
        "What kind of projects or problems interest you most?",
        "Should we dive into some advanced concepts?"
      ]
      learningInsights = {
        current_level_too_easy: true,
        readiness_for_challenge: true,
        engagement_triggers: ['complexity', 'real_world_relevance']
      }
      suggestedActions = [
        'Try advanced problems',
        'Explore practical applications',
        'Work on a complex project',
        'Mentor other learners'
      ]
      break

    case 'anxious':
      emotionalTone = 'calming_reassuring'
      teachingApproach = 'supportive_confidence_building'
      confidenceScore = 89
      encouragementLevel = 9
      
      aiResponse = generateAnxiousResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What specifically is making you feel anxious about this?",
        "What would help you feel more confident?",
        "Would breaking this into smaller steps help?",
        "What support do you need to feel comfortable proceeding?"
      ]
      learningInsights = {
        anxiety_sources: identifyAnxietySources(userInput, userContext),
        confidence_building_priority: true,
        support_needed: true
      }
      suggestedActions = [
        'Start with easier concepts',
        'Practice in a low-pressure environment',
        'Set small, achievable goals',
        'Take breaks when needed'
      ]
      break

    case 'confident':
      emotionalTone = 'encouraging_challenging'
      teachingApproach = 'advanced_application'
      confidenceScore = 94
      encouragementLevel = 6
      
      aiResponse = generateConfidentResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "How would you apply this knowledge in a real-world scenario?",
        "What advanced concepts would you like to explore next?",
        "Would you like to help others understand this topic?",
        "What challenges or projects interest you most?"
      ]
      learningInsights = {
        mastery_level: 'high',
        readiness_for_advanced: true,
        teaching_potential: true
      }
      suggestedActions = [
        'Explore advanced applications',
        'Mentor other learners',
        'Work on complex projects',
        'Teach others what you know'
      ]
      break

    default:
      emotionalTone = 'friendly_adaptive'
      teachingApproach = 'conversational_guidance'
      confidenceScore = 85
      encouragementLevel = 5
      
      aiResponse = generateNeutralResponse(userInput, subject, learningAnalysis, userContext)
      followUpQuestions = [
        "What would you like to explore or learn about?",
        "How can I help you achieve your learning goals?",
        "What topics or concepts interest you most?",
        "What's your preferred way of learning new things?"
      ]
      learningInsights = {
        engagement_level: 'moderate',
        learning_preferences: learningAnalysis.learningStyle,
        exploration_ready: true
      }
      suggestedActions = [
        'Explore different learning approaches',
        'Set specific learning goals',
        'Try interactive exercises',
        'Connect with the learning community'
      ]
  }

  // Adjust confidence based on user's performance history
  if (performanceLevel === 'high') {
    confidenceScore = Math.min(confidenceScore + 5, 100)
  } else if (performanceLevel === 'low') {
    confidenceScore = Math.max(confidenceScore - 5, 70)
  }

  return {
    ai_response: aiResponse,
    emotional_tone: emotionalTone,
    confidence_score: confidenceScore,
    teaching_approach: teachingApproach,
    encouragement_level: encouragementLevel,
    follow_up_questions: followUpQuestions,
    session_metadata: {
      emotion_detected: emotion,
      user_performance_history: performanceLevel,
      session_count: userContext.recentSessions.length,
      adaptive_approach: teachingApproach,
      learning_velocity: learningVelocity,
      dominant_emotion: dominantEmotion
    },
    reasoning_steps: reasoningSteps,
    learning_insights: learningInsights,
    suggested_actions: suggestedActions
  }
}

function getTeachingStrategy(emotion: string, learningAnalysis: any): string {
  const strategies = {
    'frustrated': 'supportive_breakdown',
    'excited': 'challenging_expansion',
    'confused': 'explanatory_questioning',
    'bored': 'interactive_acceleration',
    'anxious': 'supportive_confidence_building',
    'confident': 'advanced_application',
    'neutral': 'conversational_guidance'
  }
  return strategies[emotion] || 'adaptive_teaching'
}

function generateFrustratedResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  const encouragement = getEncouragementPhrase(analysis.performanceLevel)
  
  return `I can absolutely understand your frustration, and I want you to know that what you're feeling is completely normal when tackling challenging concepts. ${encouragement}

Let's take a step back and approach this systematically. ${subjectContext.frustrated_approach}

Here's what I suggest we do:
1. First, let's identify exactly where the confusion is occurring
2. Then, we'll break this down into the smallest possible pieces
3. Finally, we'll build your understanding step by step

Remember, every expert was once a beginner, and every breakthrough comes after moments of struggle. You're not alone in this, and together we'll work through it. What specific part is causing the most difficulty right now?`
}

function generateExcitedResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `I absolutely love your enthusiasm! Your excitement is infectious and shows that you're truly engaged with the material. ${subjectContext.excited_approach}

This kind of passion is what drives real learning and innovation. Let's channel that energy into something amazing!

Here are some exciting directions we could explore:
• Advanced applications and real-world implementations
• Cutting-edge developments in this field
• Creative projects that showcase your understanding
• Connections to other fascinating topics

What aspect of this topic is sparking your curiosity the most? I'd love to dive deeper into whatever excites you!`
}

function generateConfusedResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `It's wonderful that you're asking questions - that's exactly how deep learning happens! Confusion is often the first step toward true understanding. ${subjectContext.confused_approach}

Let me help clarify this step by step. I'll start with the fundamentals and build up your understanding gradually.

Here's my approach:
1. First, let's establish what you already know
2. Then, I'll explain the core concept in simple terms
3. We'll work through examples together
4. Finally, you can try explaining it back to me

The fact that you're confused means you're thinking critically about the material, which is excellent. What's your current understanding of the basic concepts here?`
}

function generateBoredResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `I can see that you're ready for something more challenging! Your boredom is actually a sign that you've mastered the basics and are ready to level up. ${subjectContext.bored_approach}

Let's make this much more interesting and engaging:

• Advanced problem-solving scenarios
• Real-world applications and case studies
• Creative projects that push your boundaries
• Connections to cutting-edge research
• Collaborative challenges with other learners

What kind of challenge would really get you excited? I want to find something that matches your skill level and interests perfectly.`
}

function generateAnxiousResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `I completely understand your anxiety, and I want you to know that it's okay to feel this way. Learning can sometimes feel overwhelming, but you're not alone in this journey. ${subjectContext.anxious_approach}

Let's work together to build your confidence step by step:

• We'll start with concepts you're comfortable with
• We'll move at a pace that feels right for you
• We'll celebrate every small victory along the way
• We'll take breaks whenever you need them

Remember, there's no pressure here. Learning is a process, not a race. What would help you feel more comfortable and confident right now?`
}

function generateConfidentResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `Your confidence is inspiring! It's clear that you have a solid foundation and are ready to take on more advanced challenges. ${subjectContext.confident_approach}

This is the perfect time to:
• Explore advanced applications and real-world implementations
• Tackle complex problems that stretch your abilities
• Mentor others who are just starting their journey
• Connect concepts across different domains
• Work on projects that showcase your expertise

What advanced concepts or challenging problems would you like to explore? I'm excited to see where your confidence and knowledge will take us!`
}

function generateNeutralResponse(input: string, subject: string | undefined, analysis: any, context: any): string {
  const subjectContext = getSubjectContext(subject)
  
  return `Thank you for sharing that with me! I'm here to help you learn and grow in whatever way works best for you. ${subjectContext.neutral_approach}

I'd love to understand more about:
• What you're hoping to learn or achieve
• How you prefer to approach new concepts
• What topics or skills interest you most
• What challenges you'd like to tackle

Every learner is unique, and I want to tailor our approach to what works best for you. What would you like to explore together?`
}

function getSubjectContext(subject: string | undefined): any {
  const contexts = {
    'mathematics': {
      frustrated_approach: "Math can be challenging, but every concept builds on previous ones. Let's find the foundation you need.",
      excited_approach: "Math is beautiful when you see the patterns! Let's explore some fascinating applications.",
      confused_approach: "Math requires careful step-by-step thinking. Let's work through this methodically.",
      bored_approach: "Let's tackle some advanced mathematical concepts that will really challenge your thinking!",
      anxious_approach: "Math anxiety is common, but we'll work through it together at your own pace.",
      confident_approach: "Your mathematical confidence is great! Let's explore some advanced applications.",
      neutral_approach: "Math is a powerful tool for understanding the world. Let's find what interests you most."
    },
    'programming': {
      frustrated_approach: "Coding can be frustrating, but every bug you solve makes you a better programmer.",
      excited_approach: "Programming is like digital magic! Let's build something amazing together.",
      confused_approach: "Programming requires logical thinking. Let's break down the concepts step by step.",
      bored_approach: "Let's work on some complex algorithms and data structures that will challenge you!",
      anxious_approach: "Programming can feel overwhelming, but we'll start with the basics and build up.",
      confident_approach: "Your programming confidence is excellent! Let's tackle some advanced projects.",
      neutral_approach: "Programming opens up endless possibilities. Let's find what excites you most."
    },
    'science': {
      frustrated_approach: "Science requires patience and curiosity. Let's explore the concepts systematically.",
      excited_approach: "Science is about discovery! Let's explore some fascinating phenomena together.",
      confused_approach: "Scientific thinking takes practice. Let's work through the concepts methodically.",
      bored_approach: "Let's dive into some cutting-edge research and advanced scientific concepts!",
      anxious_approach: "Science can seem complex, but we'll start with the fundamentals and build up.",
      confident_approach: "Your scientific confidence is great! Let's explore some advanced applications.",
      neutral_approach: "Science helps us understand the world around us. Let's find what fascinates you most."
    },
    'default': {
      frustrated_approach: "Learning can be challenging, but every step forward is progress. Let's work through this together.",
      excited_approach: "Your enthusiasm is wonderful! Let's channel that energy into amazing learning.",
      confused_approach: "Confusion is part of learning. Let's clarify the concepts step by step.",
      bored_approach: "Let's find something more challenging and engaging for you to work on!",
      anxious_approach: "It's okay to feel anxious about learning. We'll take this at your own pace.",
      confident_approach: "Your confidence is inspiring! Let's tackle some advanced challenges together.",
      neutral_approach: "Learning is a journey, and I'm here to help you find what works best for you."
    }
  }
  
  return contexts[subject as keyof typeof contexts] || contexts.default
}

function getEncouragementPhrase(performanceLevel: string): string {
  const encouragements = {
    'high': "Your track record shows you're capable of mastering challenging concepts.",
    'medium': "You've shown steady progress and have the foundation to succeed here.",
    'low': "Every expert was once a beginner, and you're taking the right steps forward."
  }
  return encouragements[performanceLevel] || encouragements.medium
}

function identifyDifficultyAreas(input: string, subject: string | undefined): string[] {
  // Analyze input for specific difficulty indicators
  const difficultyKeywords = {
    'mathematics': ['equation', 'formula', 'calculation', 'problem', 'solve'],
    'programming': ['code', 'function', 'variable', 'error', 'debug'],
    'science': ['concept', 'theory', 'experiment', 'hypothesis', 'analysis'],
    'default': ['understand', 'learn', 'know', 'figure out', 'get']
  }
  
  const keywords = difficultyKeywords[subject as keyof typeof difficultyKeywords] || difficultyKeywords.default
  return keywords.filter(keyword => input.toLowerCase().includes(keyword))
}

function identifyConfusionSources(input: string): string[] {
  const confusionIndicators = [
    'unclear', 'confusing', 'don\'t get', 'not sure', 'maybe', 'think',
    'wonder', 'curious', 'explain', 'clarify', 'what', 'how', 'why'
  ]
  
  return confusionIndicators.filter(indicator => input.toLowerCase().includes(indicator))
}

function detectLearningGaps(context: any, subject: string | undefined): string[] {
  const { knowledgeGraph } = context
  const gaps = []
  
  if (knowledgeGraph && knowledgeGraph.length > 0) {
    const lowMasteryTopics = knowledgeGraph
      .filter(kg => kg.mastery_level < 70)
      .map(kg => kg.topic)
    
    gaps.push(...lowMasteryTopics)
  }
  
  return gaps
}

function identifyAnxietySources(input: string, context: any): string[] {
  const anxietyIndicators = [
    'worried', 'nervous', 'anxious', 'scared', 'afraid', 'concerned',
    'stressed', 'overwhelmed', 'panic', 'fear', 'doubt', 'can\'t do',
    'too hard', 'impossible', 'never understand'
  ]
  
  return anxietyIndicators.filter(indicator => input.toLowerCase().includes(indicator))
}
