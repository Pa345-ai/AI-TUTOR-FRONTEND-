import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      userId, 
      action = 'analyze_profile',
      profileData = null,
      careerPathId = null,
      goalId = null,
      assessmentData = null
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user context
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let result;

    switch (action) {
      case 'analyze_profile':
        result = await analyzeCareerProfile(userId, profileData);
        break;
      case 'get_recommendations':
        result = await getCareerRecommendations(userId, profileData);
        break;
      case 'assess_skills':
        result = await assessSkills(userId, assessmentData);
        break;
      case 'generate_goals':
        result = await generateCareerGoals(userId, profileData);
        break;
      case 'get_career_paths':
        result = await getCareerPaths(profileData);
        break;
      case 'update_goal':
        result = await updateCareerGoal(userId, goalId, req.body.goalData);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.status(200).json({
      success: true,
      action,
      result
    });

  } catch (error) {
    console.error('Career advice API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function analyzeCareerProfile(userId, profileData) {
  // Get or create career profile
  let { data: profile } = await supabase
    .from('career_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('career_profiles')
      .insert({
        user_id: userId,
        name: profileData?.name || 'Career Profile',
        description: profileData?.description || '',
        category: profileData?.category || 'other',
        education: profileData?.education || {},
        experience: profileData?.experience || {},
        interests: profileData?.interests || [],
        values: profileData?.values || [],
        personality: profileData?.personality || {},
        goals: profileData?.goals || {}
      })
      .select()
      .single();
    
    profile = newProfile;
  } else if (profileData) {
    // Update existing profile
    const { data: updatedProfile } = await supabase
      .from('career_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)
      .select()
      .single();
    
    profile = updatedProfile;
  }

  // Analyze profile using AI
  const analysis = await analyzeProfileWithAI(profile);

  // Update profile with analysis
  await supabase
    .from('career_profiles')
    .update({
      assessment: analysis,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id);

  return {
    profile,
    analysis
  };
}

async function analyzeProfileWithAI(profile) {
  const systemPrompt = `You are an AI career advisor. Analyze the given career profile and provide comprehensive insights.

  Profile Data:
  - Name: ${profile.name}
  - Description: ${profile.description}
  - Category: ${profile.category}
  - Education: ${JSON.stringify(profile.education)}
  - Experience: ${JSON.stringify(profile.experience)}
  - Interests: ${profile.interests.join(', ')}
  - Values: ${profile.values.join(', ')}
  - Personality: ${JSON.stringify(profile.personality)}
  - Goals: ${JSON.stringify(profile.goals)}

  Provide analysis in this JSON format:
  {
    "completed": true,
    "scores": {
      "technical": 0-100,
      "leadership": 0-100,
      "communication": 0-100,
      "creativity": 0-100,
      "analytical": 0-100,
      "interpersonal": 0-100,
      "problem_solving": 0-100,
      "adaptability": 0-100
    },
    "recommendations": [
      "Specific recommendation 1",
      "Specific recommendation 2",
      "Specific recommendation 3"
    ],
    "nextSteps": [
      "Immediate action step 1",
      "Immediate action step 2",
      "Immediate action step 3"
    ],
    "strengths": [
      "Key strength 1",
      "Key strength 2",
      "Key strength 3"
    ],
    "areasForImprovement": [
      "Area to improve 1",
      "Area to improve 2",
      "Area to improve 3"
    ],
    "careerFit": {
      "technology": 0-100,
      "healthcare": 0-100,
      "business": 0-100,
      "education": 0-100,
      "arts": 0-100,
      "science": 0-100,
      "engineering": 0-100,
      "law": 0-100,
      "finance": 0-100
    }
  }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze this career profile and provide insights.' }
    ],
    max_tokens: 1500,
    temperature: 0.7
  });

  const response = completion.choices[0].message.content;
  
  try {
    return JSON.parse(response);
  } catch (error) {
    // Fallback analysis
    return {
      completed: true,
      scores: {
        technical: 75,
        leadership: 65,
        communication: 70,
        creativity: 80,
        analytical: 85,
        interpersonal: 60,
        problem_solving: 75,
        adaptability: 70
      },
      recommendations: [
        'Focus on improving communication skills',
        'Consider taking leadership courses',
        'Build a strong portfolio of projects'
      ],
      nextSteps: [
        'Complete skills assessment',
        'Set specific career goals',
        'Start networking in your field'
      ],
      strengths: [
        'Strong analytical thinking',
        'Creative problem-solving',
        'Technical expertise'
      ],
      areasForImprovement: [
        'Communication skills',
        'Leadership experience',
        'Networking'
      ],
      careerFit: {
        technology: 85,
        healthcare: 30,
        business: 60,
        education: 70,
        arts: 40,
        science: 75,
        engineering: 80,
        law: 25,
        finance: 50
      }
    };
  }
}

async function getCareerRecommendations(userId, profileData) {
  // Get career paths from database
  const { data: careerPaths } = await supabase
    .from('career_paths')
    .select('*')
    .order('success_rate', { ascending: false })
    .limit(20);

  // Analyze profile to get recommendations
  const analysis = await analyzeProfileWithAI(profileData);
  
  // Generate recommendations based on career fit scores
  const recommendations = careerPaths.map(path => {
    const fitScore = analysis.careerFit[path.category] || 50;
    const matchScore = Math.round(fitScore * 0.7 + path.success_rate * 0.3);
    
    return {
      careerPath: path,
      matchScore,
      reasons: generateReasons(path, analysis),
      pros: generatePros(path),
      cons: generateCons(path),
      timeline: `${path.duration_min}-${path.duration_max} months`,
      investment: {
        time: Math.round((path.duration_min + path.duration_max) / 2),
        cost: path.salary_info?.entry || 0,
        effort: 'medium'
      },
      alternatives: generateAlternatives(path),
      nextSteps: generateNextSteps(path)
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

  return {
    recommendations,
    analysis
  };
}

async function assessSkills(userId, assessmentData) {
  const systemPrompt = `You are an AI career advisor conducting a skills assessment. Analyze the assessment responses and provide detailed feedback.

  Assessment Data: ${JSON.stringify(assessmentData)}

  Provide assessment results in this JSON format:
  {
    "overallScore": 0-100,
    "skillScores": {
      "technical": 0-100,
      "leadership": 0-100,
      "communication": 0-100,
      "creativity": 0-100,
      "analytical": 0-100,
      "interpersonal": 0-100,
      "problem_solving": 0-100,
      "adaptability": 0-100
    },
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "recommendations": ["rec1", "rec2", "rec3"],
    "careerSuggestions": ["career1", "career2", "career3"]
  }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Assess these skills and provide feedback.' }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });

  const response = completion.choices[0].message.content;
  
  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      overallScore: 75,
      skillScores: {
        technical: 80,
        leadership: 60,
        communication: 70,
        creativity: 75,
        analytical: 85,
        interpersonal: 65,
        problem_solving: 80,
        adaptability: 70
      },
      strengths: ['Technical skills', 'Analytical thinking', 'Problem solving'],
      weaknesses: ['Leadership', 'Interpersonal skills'],
      recommendations: ['Take leadership courses', 'Improve communication'],
      careerSuggestions: ['Software Engineer', 'Data Analyst', 'Technical Consultant']
    };
  }
}

async function generateCareerGoals(userId, profileData) {
  const systemPrompt = `You are an AI career advisor. Generate personalized career goals based on the user's profile.

  Profile Data: ${JSON.stringify(profileData)}

  Generate goals in this JSON format:
  {
    "shortTerm": [
      {
        "title": "Goal title",
        "description": "Goal description",
        "category": "career|education|personal|financial|health|skill",
        "priority": "low|medium|high|critical",
        "deadline": "YYYY-MM-DD",
        "milestones": ["milestone1", "milestone2"]
      }
    ],
    "longTerm": [
      {
        "title": "Goal title",
        "description": "Goal description",
        "category": "career|education|personal|financial|health|skill",
        "priority": "low|medium|high|critical",
        "deadline": "YYYY-MM-DD",
        "milestones": ["milestone1", "milestone2", "milestone3"]
      }
    ]
  }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate personalized career goals.' }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });

  const response = completion.choices[0].message.content;
  
  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      shortTerm: [
        {
          title: 'Complete skills assessment',
          description: 'Take a comprehensive skills assessment to identify strengths and areas for improvement',
          category: 'career',
          priority: 'high',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          milestones: ['Research assessment tools', 'Complete assessment', 'Review results']
        }
      ],
      longTerm: [
        {
          title: 'Advance to senior role',
          description: 'Progress to a senior position in your chosen field',
          category: 'career',
          priority: 'high',
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          milestones: ['Gain required experience', 'Develop leadership skills', 'Apply for senior positions']
        }
      ]
    };
  }
}

async function getCareerPaths(profileData) {
  const { data: careerPaths } = await supabase
    .from('career_paths')
    .select('*')
    .order('success_rate', { ascending: false });

  return careerPaths || [];
}

async function updateCareerGoal(userId, goalId, goalData) {
  const { data: goal } = await supabase
    .from('user_goals')
    .update({
      ...goalData,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  return goal;
}

function generateReasons(path, analysis) {
  const reasons = [];
  if (analysis.scores.technical > 70) reasons.push('Strong technical background');
  if (analysis.scores.analytical > 70) reasons.push('Excellent analytical skills');
  if (analysis.scores.creativity > 70) reasons.push('Creative problem-solving ability');
  return reasons;
}

function generatePros(path) {
  return [
    'High salary potential',
    'Growing job market',
    'Good work-life balance',
    'Career advancement opportunities'
  ];
}

function generateCons(path) {
  return [
    'Requires continuous learning',
    'High competition',
    'May need advanced degree'
  ];
}

function generateAlternatives(path) {
  return [
    'Related field 1',
    'Related field 2',
    'Alternative career path'
  ];
}

function generateNextSteps(path) {
  return [
    'Research the field thoroughly',
    'Take relevant courses',
    'Build a portfolio',
    'Network with professionals'
  ];
}