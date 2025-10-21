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
    const { action, user_id, app_data, integration_type, api_key } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user profile for personalized ecosystem management
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    // Generate AI-powered ecosystem management using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an expert AI ecosystem manager that helps developers integrate and manage AI-powered applications. Handle the following request:

Action: ${action}
User ID: ${user_id}
Integration Type: ${integration_type || 'general'}
App Data: ${JSON.stringify(app_data || {})}
User Level: ${userProfile?.learning_level || 'intermediate'}

Provide comprehensive ecosystem management including:
1. Integration recommendations and setup
2. API documentation and examples
3. Best practices and guidelines
4. Security considerations
5. Performance optimization
6. Monitoring and analytics
7. Troubleshooting and support
8. Future development roadmap

Format the response as JSON with this structure:
{
  "ecosystem_management": {
    "integration_status": "active/pending/failed",
    "recommended_integrations": [
      {
        "name": "Integration Name",
        "type": "API/Webhook/SDK",
        "description": "Integration description",
        "setup_difficulty": "easy/medium/hard",
        "documentation_url": "https://docs.example.com",
        "api_endpoints": ["endpoint1", "endpoint2"]
      }
    ],
    "api_management": {
      "rate_limits": "1000 requests/hour",
      "authentication": "API key required",
      "endpoints": [
        {
          "endpoint": "/api/endpoint",
          "method": "POST",
          "description": "Endpoint description",
          "parameters": ["param1", "param2"],
          "response_format": "JSON"
        }
      ]
    },
    "security_recommendations": [
      "Use HTTPS for all requests",
      "Implement rate limiting",
      "Validate all inputs"
    ]
  },
  "development_guidelines": {
    "best_practices": ["practice1", "practice2"],
    "code_examples": [
      {
        "language": "JavaScript",
        "code": "code example",
        "description": "What this code does"
      }
    ],
    "testing_recommendations": ["test1", "test2"],
    "deployment_guide": "Step-by-step deployment instructions"
  },
  "monitoring_analytics": {
    "metrics_to_track": ["metric1", "metric2"],
    "alerting_rules": ["rule1", "rule2"],
    "performance_benchmarks": "Expected performance levels",
    "analytics_dashboard": "Dashboard configuration"
  },
  "ai_insights": {
    "integration_complexity": "Analysis of integration complexity",
    "scalability_recommendations": ["recommendation1", "recommendation2"],
    "success_probability": 0.85,
    "risk_assessment": "Low/Medium/High risk",
    "optimization_opportunities": ["opportunity1", "opportunity2"]
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
          { role: 'system', content: 'You are an expert AI ecosystem manager that helps developers integrate and manage AI-powered applications. Always respond with valid JSON in the exact format requested.' },
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
    const ecosystemContent = aiData.choices[0].message.content

    let parsedEcosystem
    try {
      parsedEcosystem = JSON.parse(ecosystemContent)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedEcosystem = {
        ecosystem_management: {
          integration_status: "pending",
          recommended_integrations: [
            {
              name: "Basic API Integration",
              type: "API",
              description: "Standard API integration",
              setup_difficulty: "medium",
              documentation_url: "https://docs.example.com",
              api_endpoints: ["/api/endpoint1", "/api/endpoint2"]
            }
          ],
          api_management: {
            rate_limits: "1000 requests/hour",
            authentication: "API key required",
            endpoints: [
              {
                endpoint: "/api/endpoint",
                method: "POST",
                description: "Basic endpoint",
                parameters: ["param1", "param2"],
                response_format: "JSON"
              }
            ]
          },
          security_recommendations: [
            "Use HTTPS for all requests",
            "Implement rate limiting",
            "Validate all inputs"
          ]
        },
        development_guidelines: {
          best_practices: ["Follow REST conventions", "Use proper error handling"],
          code_examples: [
            {
              language: "JavaScript",
              code: "// Example code",
              description: "Basic integration example"
            }
          ],
          testing_recommendations: ["Unit tests", "Integration tests"],
          deployment_guide: "Standard deployment process"
        },
        monitoring_analytics: {
          metrics_to_track: ["Response time", "Error rate"],
          alerting_rules: ["High error rate", "Slow response"],
          performance_benchmarks: "Standard performance levels",
          analytics_dashboard: "Basic dashboard setup"
        },
        ai_insights: {
          integration_complexity: "Medium complexity",
          scalability_recommendations: ["Use caching", "Implement load balancing"],
          success_probability: 0.8,
          risk_assessment: "Medium risk",
          optimization_opportunities: ["Improve caching", "Optimize queries"]
        }
      }
    }

    // Save ecosystem data to database
    const { data: ecosystemData, error: ecosystemError } = await supabaseClient
      .from('ai_ecosystem')
      .insert({
        user_id,
        action,
        integration_type,
        app_data,
        ecosystem_management: parsedEcosystem.ecosystem_management,
        development_guidelines: parsedEcosystem.development_guidelines,
        monitoring_analytics: parsedEcosystem.monitoring_analytics,
        ai_insights: parsedEcosystem.ai_insights,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (ecosystemError) {
      console.error('Error saving ecosystem data:', ecosystemError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        ecosystem_management: parsedEcosystem.ecosystem_management,
        development_guidelines: parsedEcosystem.development_guidelines,
        monitoring_analytics: parsedEcosystem.monitoring_analytics,
        ai_insights: parsedEcosystem.ai_insights,
        ecosystem_id: ecosystemData?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in ai_ecosystem:', error)
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