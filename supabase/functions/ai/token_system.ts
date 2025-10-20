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
    const { action, user_id, token_amount, transaction_type, learning_activity } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile and token balance
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    const { data: tokenBalance } = await supabaseClient
      .from('user_tokens')
      .select('*')
      .eq('user_id', user_id)
      .single()

    // Generate AI-powered token economy management using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI token economy manager that manages a learn-to-earn educational platform. Handle the following request:

Action: ${action}
User ID: ${user_id}
Token Amount: ${token_amount || 0}
Transaction Type: ${transaction_type || 'earning'}
Learning Activity: ${learning_activity || 'general'}
Current Balance: ${tokenBalance?.balance || 0}
User Level: ${userProfile?.learning_level || 'intermediate'}

Provide comprehensive token economy management including:
1. Token earning calculations and rewards
2. Spending recommendations and marketplace
3. Achievement tracking and milestones
4. Gamification elements and incentives
5. Economic balance and sustainability
6. User engagement strategies
7. Reward distribution algorithms
8. Long-term value proposition

Format the response as JSON with this structure:
{
  "token_economy": {
    "current_balance": 1000,
    "transaction_details": {
      "amount": 50,
      "type": "earning/spending",
      "activity": "Completed quiz",
      "multiplier": 1.5,
      "bonus_reasons": ["First time", "Perfect score"]
    },
    "earning_opportunities": [
      {
        "activity": "Complete lesson",
        "base_reward": 10,
        "multiplier": 1.2,
        "requirements": "Complete 80% of lesson",
        "frequency": "daily"
      }
    ],
    "spending_options": [
      {
        "item": "Premium content",
        "cost": 100,
        "description": "Access to advanced materials",
        "value": "high"
      }
    ]
  },
  "achievements": {
    "unlocked_achievements": [
      {
        "name": "First Steps",
        "description": "Complete your first lesson",
        "reward": 50,
        "unlocked_at": "2024-01-01"
      }
    ],
    "upcoming_milestones": [
      {
        "name": "Knowledge Seeker",
        "description": "Complete 10 lessons",
        "progress": "7/10",
        "reward": 200
      }
    ]
  },
  "gamification": {
    "level": 5,
    "xp": 1250,
    "next_level_xp": 1500,
    "streak_days": 7,
    "badges": ["Early Bird", "Consistent Learner"],
    "leaderboard_position": 15
  },
  "economic_insights": {
    "market_value": "Analysis of token value",
    "inflation_rate": "2% monthly",
    "sustainability_score": 0.85,
    "user_engagement": "High engagement detected",
    "recommendations": ["Increase daily rewards", "Add new activities"]
  },
  "ai_insights": {
    "learning_patterns": "Analysis of user learning patterns",
    "motivation_factors": ["Achievement", "Progress"],
    "optimization_suggestions": ["suggestion1", "suggestion2"],
    "success_probability": 0.9,
    "engagement_prediction": "High engagement expected"
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
          { role: 'system', content: 'You are an expert AI token economy manager that manages a learn-to-earn educational platform. Always respond with valid JSON in the exact format requested.' },
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
    const tokenContent = aiData.choices[0].message.content

    let parsedToken
    try {
      parsedToken = JSON.parse(tokenContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedToken = {
        token_economy: {
          current_balance: tokenBalance?.balance || 0,
          transaction_details: {
            amount: token_amount || 0,
            type: transaction_type || 'earning',
            activity: learning_activity || 'general',
            multiplier: 1.0,
            bonus_reasons: []
          },
          earning_opportunities: [
            {
              activity: "Complete lesson",
              base_reward: 10,
              multiplier: 1.0,
              requirements: "Complete lesson",
              frequency: "daily"
            }
          ],
          spending_options: [
            {
              item: "Premium content",
              cost: 100,
              description: "Access to advanced materials",
              value: "high"
            }
          ]
        },
        achievements: {
          unlocked_achievements: [],
          upcoming_milestones: [
            {
              name: "First Achievement",
              description: "Complete your first activity",
              progress: "0/1",
              reward: 50
            }
          ]
        },
        gamification: {
          level: 1,
          xp: 0,
          next_level_xp: 100,
          streak_days: 0,
          badges: [],
          leaderboard_position: 0
        },
        economic_insights: {
          market_value: "Stable token economy",
          inflation_rate: "2% monthly",
          sustainability_score: 0.8,
          user_engagement: "Moderate engagement",
          recommendations: ["Increase rewards", "Add new activities"]
        },
        ai_insights: {
          learning_patterns: "New user patterns",
          motivation_factors: ["Achievement", "Progress"],
          optimization_suggestions: ["Increase engagement", "Add gamification"],
          success_probability: 0.8,
          engagement_prediction: "Moderate engagement expected"
        }
      }
    }

    // Update token balance
    const newBalance = (tokenBalance?.balance || 0) + (token_amount || 0)
    const { error: updateError } = await supabaseClient
      .from('user_tokens')
      .upsert({
        user_id,
        balance: newBalance,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      console.error('Error updating token balance:', updateError)
    }

    // Save token transaction
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('token_transactions')
      .insert({
        user_id,
        amount: token_amount || 0,
        transaction_type: transaction_type || 'earning',
        learning_activity: learning_activity || 'general',
        balance_after: newBalance,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Error saving transaction:', transactionError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        token_economy: parsedToken.token_economy,
        achievements: parsedToken.achievements,
        gamification: parsedToken.gamification,
        economic_insights: parsedToken.economic_insights,
        ai_insights: parsedToken.ai_insights,
        transaction_id: transactionData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in token_system:', error)
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