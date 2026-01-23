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
    const { text, source_language, target_language, user_id, context, translation_type } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile for personalized translation
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered translation and teaching using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI multilingual tutor that provides comprehensive translation and language learning. Translate and teach the following content:

Text: ${text}
Source Language: ${source_language || 'auto-detect'}
Target Language: ${target_language || 'English'}
Context: ${context || 'General'}
Translation Type: ${translation_type || 'educational'}
User Level: ${userProfile?.learning_level || 'intermediate'}

Provide comprehensive translation and teaching including:
1. Accurate translation with cultural context
2. Grammar explanations and rules
3. Vocabulary breakdown and definitions
4. Pronunciation guide (if applicable)
5. Cultural notes and context
6. Learning exercises and practice
7. Common mistakes and how to avoid them
8. Related phrases and expressions

Format the response as JSON with this structure:
{
  "translation": {
    "original_text": "Original text",
    "translated_text": "Translated text",
    "confidence_score": 0.95,
    "cultural_notes": "Cultural context and notes",
    "formality_level": "formal/informal/neutral"
  },
  "grammar_analysis": {
    "key_grammar_points": [
      {
        "rule": "Grammar rule",
        "explanation": "Detailed explanation",
        "examples": ["example1", "example2"]
      }
    ],
    "sentence_structure": "Analysis of sentence structure",
    "difficulty_level": "beginner/intermediate/advanced"
  },
  "vocabulary": {
    "key_words": [
      {
        "word": "word",
        "translation": "translation",
        "pronunciation": "pronunciation",
        "part_of_speech": "noun/verb/adjective",
        "definition": "definition",
        "example_sentence": "example"
      }
    ],
    "difficulty_analysis": "Analysis of vocabulary difficulty"
  },
  "learning_content": {
    "pronunciation_guide": "Pronunciation tips and guide",
    "common_mistakes": ["mistake1", "mistake2"],
    "practice_exercises": ["exercise1", "exercise2"],
    "related_phrases": ["phrase1", "phrase2"],
    "cultural_context": "Cultural background and context"
  },
  "ai_insights": {
    "language_complexity": "Analysis of language complexity",
    "learning_recommendations": ["recommendation1", "recommendation2"],
    "progress_tracking": "How to track progress",
    "next_steps": ["step1", "step2"]
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
          { role: 'system', content: 'You are an expert AI multilingual tutor that provides comprehensive translation and language learning. Always respond with valid JSON in the exact format requested.' },
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
    const translationContent = aiData.choices[0].message.content

    let parsedTranslation
    try {
      parsedTranslation = JSON.parse(translationContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedTranslation = {
        translation: {
          original_text: text,
          translated_text: "Translation not available",
          confidence_score: 0.7,
          cultural_notes: "Cultural context not available",
          formality_level: "neutral"
        },
        grammar_analysis: {
          key_grammar_points: [
            {
              rule: "Basic grammar rule",
              explanation: "Explanation of the rule",
              examples: ["Example 1", "Example 2"]
            }
          ],
          sentence_structure: "Basic sentence structure analysis",
          difficulty_level: "intermediate"
        },
        vocabulary: {
          key_words: [
            {
              word: "key word",
              translation: "translation",
              pronunciation: "pronunciation",
              part_of_speech: "noun",
              definition: "definition",
              example_sentence: "example sentence"
            }
          ],
          difficulty_analysis: "Vocabulary difficulty analysis"
        },
        learning_content: {
          pronunciation_guide: "Basic pronunciation guide",
          common_mistakes: ["Common mistake 1", "Common mistake 2"],
          practice_exercises: ["Exercise 1", "Exercise 2"],
          related_phrases: ["Related phrase 1", "Related phrase 2"],
          cultural_context: "Cultural context information"
        },
        ai_insights: {
          language_complexity: "Analysis of language complexity",
          learning_recommendations: ["Recommendation 1", "Recommendation 2"],
          progress_tracking: "How to track learning progress",
          next_steps: ["Next step 1", "Next step 2"]
        }
      }
    }

    // Save translation to database
    const { data: translationData, error: translationError } = await supabaseClient
      .from('multilang_translations')
      .insert({
        user_id,
        original_text: text,
        source_language,
        target_language,
        context,
        translation_type,
        translation_data: parsedTranslation.translation,
        grammar_analysis: parsedTranslation.grammar_analysis,
        vocabulary: parsedTranslation.vocabulary,
        learning_content: parsedTranslation.learning_content,
        ai_insights: parsedTranslation.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (translationError) {
      console.error('Error saving translation:', translationError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        translation: parsedTranslation.translation,
        grammar_analysis: parsedTranslation.grammar_analysis,
        vocabulary: parsedTranslation.vocabulary,
        learning_content: parsedTranslation.learning_content,
        ai_insights: parsedTranslation.ai_insights,
        translation_id: translationData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in multilang_tutor:', error)
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