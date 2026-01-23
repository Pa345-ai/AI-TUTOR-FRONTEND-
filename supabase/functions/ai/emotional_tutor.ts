import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmotionalTutorRequest {
  user_id: string
  user_input: string
  session_type: string
  subject?: string
  detected_emotion?: string
  context_data?: any
}

interface EmotionalTutorResponse {
  ai_response: string
  emotional_tone: string
  confidence_score: number
  teaching_approach: string
  encouragement_level: number
  follow_up_questions: string[]
  session_metadata: any
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

    const { user_id, user_input, session_type, subject, detected_emotion, context_data }: EmotionalTutorRequest = await req.json()

    // Detect emotion from input if not provided
    const emotion = detected_emotion || detectEmotion(user_input)
    
    // Get user's learning history for context
    const { data: recentSessions, error: sessionsError } = await supabaseClient
      .from('ai_sessions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (sessionsError) throw sessionsError

    // Get user's progress data
    const { data: progress, error: progressError } = await supabaseClient
      .from('progress')
      .select('*')
      .eq('user_id', user_id)
      .order('timestamp', { ascending: false })
      .limit(10)

    if (progressError) throw progressError

    // Generate appropriate response based on emotion and context
    const response = generateEmotionalResponse(
      user_input, 
      emotion, 
      session_type, 
      subject, 
      recentSessions, 
      progress,
      context_data
    )

    // Save session to database
    const { error: saveError } = await supabaseClient
      .from('ai_sessions')
      .insert({
        user_id,
        session_type,
        subject,
        user_input,
        ai_response: response.ai_response,
        confidence_score: response.confidence_score,
        emotional_tone: response.emotional_tone,
        context_data: context_data || {},
        session_duration_seconds: 0 // Will be updated by client
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

function detectEmotion(input: string): string {
  const lowerInput = input.toLowerCase()
  
  // Frustration indicators
  if (lowerInput.includes('difficult') || lowerInput.includes('hard') || 
      lowerInput.includes('confused') || lowerInput.includes('stuck') ||
      lowerInput.includes('don\'t understand') || lowerInput.includes('help')) {
    return 'frustrated'
  }
  
  // Excitement indicators
  if (lowerInput.includes('great') || lowerInput.includes('awesome') || 
      lowerInput.includes('amazing') || lowerInput.includes('love') ||
      lowerInput.includes('excited') || lowerInput.includes('wow')) {
    return 'excited'
  }
  
  // Confusion indicators
  if (lowerInput.includes('?') || lowerInput.includes('what') || 
      lowerInput.includes('how') || lowerInput.includes('why') ||
      lowerInput.includes('explain') || lowerInput.includes('clarify')) {
    return 'confused'
  }
  
  // Boredom indicators
  if (lowerInput.includes('boring') || lowerInput.includes('easy') || 
      lowerInput.includes('simple') || lowerInput.includes('already know') ||
      lowerInput.includes('too slow')) {
    return 'bored'
  }
  
  return 'neutral'
}

function generateEmotionalResponse(
  userInput: string, 
  emotion: string, 
  sessionType: string, 
  subject: string | undefined,
  recentSessions: any[], 
  progress: any[],
  contextData: any
): EmotionalTutorResponse {
  
  const averageScore = progress
    .filter(p => p.progress_type === 'quiz_score')
    .reduce((sum, p) => sum + (p.value || 0), 0) / Math.max(progress.filter(p => p.progress_type === 'quiz_score').length, 1)

  let aiResponse = ''
  let emotionalTone = 'neutral'
  let confidenceScore = 85
  let teachingApproach = 'standard'
  let encouragementLevel = 5
  let followUpQuestions: string[] = []

  switch (emotion) {
    case 'frustrated':
      emotionalTone = 'empathetic'
      teachingApproach = 'supportive'
      encouragementLevel = 8
      
      aiResponse = `I can see you're feeling frustrated, and that's completely normal when learning something challenging! Let's break this down into smaller, manageable steps. ${getSubjectSpecificEncouragement(subject)}`
      
      followUpQuestions = [
        "Would you like me to explain this concept in a different way?",
        "Should we try some easier practice problems first?",
        "What specific part is causing the most confusion?"
      ]
      break

    case 'excited':
      emotionalTone = 'enthusiastic'
      teachingApproach = 'challenging'
      encouragementLevel = 7
      
      aiResponse = `I love your enthusiasm! Your excitement for learning is contagious! ${getSubjectSpecificEncouragement(subject)} Let's channel that energy into some advanced concepts.`
      
      followUpQuestions = [
        "Ready to tackle something more challenging?",
        "Would you like to explore some advanced applications?",
        "What aspect of this topic interests you most?"
      ]
      break

    case 'confused':
      emotionalTone = 'patient'
      teachingApproach = 'explanatory'
      encouragementLevel = 6
      
      aiResponse = `It's great that you're asking questions - that's how deep learning happens! Let me explain this step by step. ${getSubjectSpecificExplanation(subject, userInput)}`
      
      followUpQuestions = [
        "Does this explanation make sense so far?",
        "Would you like me to use a different analogy?",
        "Should we work through an example together?"
      ]
      break

    case 'bored':
      emotionalTone = 'engaging'
      teachingApproach = 'interactive'
      encouragementLevel = 6
      
      aiResponse = `I understand you might find this too easy! Let's make it more interesting. ${getSubjectSpecificChallenge(subject)}`
      
      followUpQuestions = [
        "Ready for a more challenging problem?",
        "Would you like to explore real-world applications?",
        "Should we dive into some advanced concepts?"
      ]
      break

    default:
      emotionalTone = 'friendly'
      teachingApproach = 'adaptive'
      encouragementLevel = 5
      
      aiResponse = `Thanks for sharing that with me! ${getSubjectSpecificResponse(subject, userInput)}`
      
      followUpQuestions = [
        "What would you like to explore next?",
        "Is there anything specific you'd like to practice?",
        "How can I help you learn more effectively?"
      ]
  }

  // Adjust confidence based on user's performance history
  if (averageScore > 80) {
    confidenceScore = 90
  } else if (averageScore < 60) {
    confidenceScore = 75
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
      user_performance_history: averageScore,
      session_count: recentSessions.length,
      adaptive_approach: teachingApproach
    }
  }
}

function getSubjectSpecificEncouragement(subject: string | undefined): string {
  const encouragements = {
    'mathematics': "Math can be tricky, but every mathematician started exactly where you are now. You've got this!",
    'programming': "Coding challenges are like puzzles - frustrating at first, but incredibly satisfying when solved!",
    'science': "Science is about asking questions and exploring. Your curiosity is your greatest asset!",
    'language': "Language learning is a journey, not a race. Every mistake is a step forward!",
    'default': "Learning is a process, and you're making progress every day!"
  }
  
  return encouragements[subject as keyof typeof encouragements] || encouragements.default
}

function getSubjectSpecificExplanation(subject: string | undefined, userInput: string): string {
  const explanations = {
    'mathematics': "Let's start with the basics and build up your understanding step by step.",
    'programming': "Think of programming like giving instructions to a very literal friend - we need to be very specific!",
    'science': "Science is all about observation and reasoning. Let's look at this from a different angle.",
    'language': "Language is about communication. Let's focus on the meaning behind the words.",
    'default': "Let me break this down into simpler concepts that build on each other."
  }
  
  return explanations[subject as keyof typeof explanations] || explanations.default
}

function getSubjectSpecificChallenge(subject: string | undefined): string {
  const challenges = {
    'mathematics': "Let's try some advanced problems that will really test your understanding!",
    'programming': "Ready for some complex algorithms and data structures?",
    'science': "How about we explore some cutting-edge research in this field?",
    'language': "Let's dive into some advanced literature and complex grammar structures!",
    'default': "Let's explore some advanced concepts that will challenge your thinking!"
  }
  
  return challenges[subject as keyof typeof challenges] || challenges.default
}

function getSubjectSpecificResponse(subject: string | undefined, userInput: string): string {
  const responses = {
    'mathematics': "Math is beautiful when you see the patterns. Let's explore this together!",
    'programming': "Coding is like building with digital LEGO blocks. What would you like to create?",
    'science': "Science is about discovery. What questions are you curious about?",
    'language': "Language opens doors to new worlds. What would you like to explore?",
    'default': "Learning is an adventure. What would you like to discover today?"
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}
