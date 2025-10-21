import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TutorPersonaRequest {
  user_id: string
  user_input: string
  persona_type: 'socratic' | 'friendly' | 'exam' | 'motivational'
  subject?: string
  session_type?: string
}

interface TutorPersonaResponse {
  ai_response: string
  persona_characteristics: {
    tone: string
    teaching_style: string
    response_pattern: string
    encouragement_level: number
  }
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

    const { user_id, user_input, persona_type, subject, session_type = 'tutoring' }: TutorPersonaRequest = await req.json()

    // Get persona configuration from database
    const { data: persona, error: personaError } = await supabaseClient
      .from('tutor_personas')
      .select('*')
      .eq('personality_type', persona_type)
      .eq('is_active', true)
      .single()

    if (personaError) throw personaError

    // Get user's learning context
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    if (userError) throw userError

    // Generate response based on persona
    const response = generatePersonaResponse(
      user_input, 
      persona_type, 
      subject, 
      user.learning_style,
      persona
    )

    // Save session
    const { error: saveError } = await supabaseClient
      .from('ai_sessions')
      .insert({
        user_id,
        session_type,
        subject,
        user_input,
        ai_response: response.ai_response,
        ai_personality: persona_type,
        confidence_score: 85,
        emotional_tone: response.persona_characteristics.tone,
        context_data: {
          persona_used: persona_type,
          teaching_style: response.persona_characteristics.teaching_style
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

function generatePersonaResponse(
  userInput: string, 
  personaType: string, 
  subject: string | undefined,
  learningStyle: string,
  persona: any
): TutorPersonaResponse {
  
  let aiResponse = ''
  let tone = 'neutral'
  let teachingStyle = 'standard'
  let responsePattern = 'direct'
  let encouragementLevel = 5
  let followUpQuestions: string[] = []

  switch (personaType) {
    case 'socratic':
      tone = 'inquisitive'
      teachingStyle = 'questioning'
      responsePattern = 'socratic_method'
      encouragementLevel = 6
      
      aiResponse = generateSocraticResponse(userInput, subject)
      followUpQuestions = [
        "What do you think would happen if...?",
        "How does this relate to what you already know?",
        "What evidence supports your conclusion?"
      ]
      break

    case 'friendly':
      tone = 'warm'
      teachingStyle = 'conversational'
      responsePattern = 'encouraging'
      encouragementLevel = 8
      
      aiResponse = generateFriendlyResponse(userInput, subject)
      followUpQuestions = [
        "What would you like to explore next?",
        "Is there anything else you're curious about?",
        "How can I make this more interesting for you?"
      ]
      break

    case 'exam':
      tone = 'focused'
      teachingStyle = 'assessment_driven'
      responsePattern = 'structured'
      encouragementLevel = 4
      
      aiResponse = generateExamResponse(userInput, subject)
      followUpQuestions = [
        "Can you explain your reasoning?",
        "What's the key concept here?",
        "How would you apply this in a test situation?"
      ]
      break

    case 'motivational':
      tone = 'inspiring'
      teachingStyle = 'encouraging'
      responsePattern = 'uplifting'
      encouragementLevel = 9
      
      aiResponse = generateMotivationalResponse(userInput, subject)
      followUpQuestions = [
        "What's your next learning goal?",
        "How can we celebrate your progress?",
        "What would make you feel proud of your learning?"
      ]
      break

    default:
      tone = 'neutral'
      teachingStyle = 'adaptive'
      responsePattern = 'balanced'
      encouragementLevel = 5
      
      aiResponse = generateDefaultResponse(userInput, subject)
      followUpQuestions = [
        "What would you like to focus on?",
        "How can I help you learn better?",
        "What's your learning objective?"
      ]
  }

  return {
    ai_response: aiResponse,
    persona_characteristics: {
      tone,
      teaching_style: teachingStyle,
      response_pattern: responsePattern,
      encouragement_level: encouragementLevel
    },
    follow_up_questions: followUpQuestions,
    session_metadata: {
      persona_type: personaType,
      learning_style_adapted: learningStyle,
      response_generated: new Date().toISOString()
    }
  }
}

function generateSocraticResponse(userInput: string, subject: string | undefined): string {
  const responses = {
    'mathematics': `That's an interesting approach! Let me ask you this: what patterns do you notice in this problem? Can you think of a simpler version that might help you understand the concept better?`,
    'programming': `Great question! Before I give you the answer, what do you think would happen if you tried a different approach? What assumptions are you making about the problem?`,
    'science': `Fascinating observation! What evidence would you need to support that hypothesis? How might you test your idea?`,
    'language': `That's a thoughtful response! What makes you think that? Can you find examples in the text that support your interpretation?`,
    'default': `That's a great start! What makes you think that? Can you walk me through your reasoning step by step?`
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}

function generateFriendlyResponse(userInput: string, subject: string | undefined): string {
  const responses = {
    'mathematics': `I love how you're thinking about this! Math can be so much fun when you see the patterns. Let's work through this together step by step. What's your favorite part about this problem?`,
    'programming': `Awesome! I can see you're really getting into coding! Programming is like solving puzzles - each solution teaches you something new. What would you like to build with this concept?`,
    'science': `That's such a cool question! Science is all about curiosity and discovery. I love how you're thinking like a scientist! What other questions does this make you wonder about?`,
    'language': `I really enjoy our conversations! Language is such a beautiful way to express ideas. What's the most interesting thing you've learned about this topic?`,
    'default': `I'm so glad you're here learning with me! Every question you ask shows how much you care about understanding. What excites you most about this subject?`
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}

function generateExamResponse(userInput: string, subject: string | undefined): string {
  const responses = {
    'mathematics': `Let's focus on the key concepts that will help you succeed. This type of problem tests your understanding of [concept]. What's the most efficient way to approach this?`,
    'programming': `This is a common pattern in technical interviews. Let's break down the algorithm step by step. What's the time complexity of your approach?`,
    'science': `This concept is frequently tested. Let's make sure you understand the fundamental principles. What's the scientific method you'd use to verify this?`,
    'language': `This is an important literary device. Let's analyze the text systematically. What's the author's main argument and how do they support it?`,
    'default': `Let's focus on the essential knowledge you need to master. What are the key points you should remember for assessment?`
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}

function generateMotivationalResponse(userInput: string, subject: string | undefined): string {
  const responses = {
    'mathematics': `You're doing amazing! Every problem you solve makes you stronger! Math is building your logical thinking muscles, and I can see them getting stronger every day! 🌟`,
    'programming': `You're becoming a coding champion! Every line of code you write is a step toward creating something incredible! I believe in your ability to build amazing things! 🚀`,
    'science': `Your curiosity is your superpower! Every question you ask brings you closer to understanding the mysteries of the universe! Keep exploring, future scientist! 🔬`,
    'language': `Your words have power! Every sentence you craft is making you a better communicator! I can see the writer and thinker you're becoming! ✨`,
    'default': `You're absolutely crushing it! Every moment you spend learning is an investment in your amazing future! I'm so proud of your dedication and growth! 🎉`
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}

function generateDefaultResponse(userInput: string, subject: string | undefined): string {
  const responses = {
    'mathematics': `Let's work through this together. I'll help you understand the concepts step by step.`,
    'programming': `That's a good question about programming. Let me explain the concepts and help you understand how to apply them.`,
    'science': `Interesting question! Let's explore the scientific concepts behind this and see how they apply.`,
    'language': `Great question about language! Let's examine the linguistic elements and their meanings.`,
    'default': `Thanks for your question! Let me help you understand this concept and how it applies to your learning.`
  }
  
  return responses[subject as keyof typeof responses] || responses.default
}
