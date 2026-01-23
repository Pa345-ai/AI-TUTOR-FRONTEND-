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
      subject, 
      topic, 
      questionCount = 10,
      difficulty = 'medium',
      questionTypes = ['multiple_choice', 'true_false'],
      timeLimit = 30,
      content = null,
      learningObjectives = [],
      bloomLevels = ['understand', 'apply'],
      targetAudience = ['students'],
      language = 'en',
      includeMedia = false,
      includeHints = true,
      adaptiveMode = false
    } = req.body;

    if (!userId || !subject || !topic) {
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

    // Generate quiz using AI
    const quizData = await generateQuiz({
      subject,
      topic,
      questionCount,
      difficulty,
      questionTypes,
      timeLimit,
      content,
      learningObjectives,
      bloomLevels,
      targetAudience,
      language,
      includeMedia,
      includeHints,
      adaptiveMode
    });

    // Save quiz to database
    const { data: quiz } = await supabase
      .from('quizzes')
      .insert({
        title: `${topic} Quiz - ${subject}`,
        description: `AI-generated quiz covering ${topic} in ${subject}`,
        subject: subject,
        topic: topic,
        difficulty_level: difficulty,
        question_count: questionCount,
        time_limit: timeLimit,
        total_points: quizData.questions.reduce((sum, q) => sum + q.points, 0),
        is_published: true,
        is_adaptive: adaptiveMode,
        settings: {
          questionTypes,
          learningObjectives,
          bloomLevels,
          targetAudience,
          language,
          includeMedia,
          includeHints
        },
        created_by: userId
      })
      .select()
      .single();

    // Save questions to database
    const questions = quizData.questions.map((q, index) => ({
      quiz_id: quiz.id,
      question_text: q.question,
      question_type: q.type,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points,
      difficulty_level: q.difficulty,
      bloom_taxonomy_level: q.bloomLevel,
      media_url: q.media?.url,
      hints: q.hints,
      order_index: index + 1
    }));

    await supabase
      .from('questions')
      .insert(questions);

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        topic: quiz.topic,
        difficulty: quiz.difficulty_level,
        questionCount: quiz.question_count,
        timeLimit: quiz.time_limit,
        totalPoints: quiz.total_points,
        questions: quizData.questions
      },
      analytics: quizData.analytics
    });

  } catch (error) {
    console.error('Quiz generation API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function generateQuiz(params) {
  const {
    subject,
    topic,
    questionCount,
    difficulty,
    questionTypes,
    timeLimit,
    content,
    learningObjectives,
    bloomLevels,
    targetAudience,
    language,
    includeMedia,
    includeHints,
    adaptiveMode
  } = params;

  const systemPrompt = `You are an AI quiz generator for an educational platform. Generate a comprehensive quiz based on the given parameters.

  Subject: ${subject}
  Topic: ${topic}
  Question Count: ${questionCount}
  Difficulty: ${difficulty}
  Question Types: ${questionTypes.join(', ')}
  Time Limit: ${timeLimit} minutes
  Learning Objectives: ${learningObjectives.join(', ')}
  Bloom's Taxonomy Levels: ${bloomLevels.join(', ')}
  Target Audience: ${targetAudience.join(', ')}
  Language: ${language}
  Include Media: ${includeMedia}
  Include Hints: ${includeHints}
  Adaptive Mode: ${adaptiveMode}

  ${content ? `Content to base questions on:\n${content}\n` : ''}

  Generate questions that are:
  - Educationally valuable and aligned with learning objectives
  - Appropriate for the specified difficulty level
  - Varied in question types as requested
  - Clear and unambiguous
  - Include explanations for correct answers
  - Include hints if requested
  - Follow Bloom's taxonomy levels specified

  Return the response as a JSON object with this structure:
  {
    "questions": [
      {
        "type": "question_type",
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Correct answer",
        "explanation": "Explanation of the answer",
        "points": 10,
        "difficulty": "difficulty_level",
        "bloomLevel": "bloom_taxonomy_level",
        "hints": ["Hint 1", "Hint 2"],
        "media": {
          "type": "image|video|audio",
          "url": "media_url",
          "alt": "alt_text"
        }
      }
    ],
    "analytics": {
      "difficultyDistribution": {"easy": 20, "medium": 60, "hard": 20},
      "questionTypeDistribution": {"multiple_choice": 50, "true_false": 30, "essay": 20},
      "bloomLevelDistribution": {"remember": 20, "understand": 40, "apply": 40}
    }
  }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a quiz about ${topic} in ${subject}` }
    ],
    max_tokens: 4000,
    temperature: 0.7
  });

  const response = completion.choices[0].message.content;
  
  try {
    const quizData = JSON.parse(response);
    return quizData;
  } catch (error) {
    // Fallback if JSON parsing fails
    return generateFallbackQuiz(params);
  }
}

function generateFallbackQuiz(params) {
  const { subject, topic, questionCount, difficulty, questionTypes } = params;
  
  const questions = [];
  const questionTypesArray = Array.isArray(questionTypes) ? questionTypes : ['multiple_choice'];
  
  for (let i = 0; i < questionCount; i++) {
    const questionType = questionTypesArray[i % questionTypesArray.length];
    const question = generateQuestion(questionType, subject, topic, difficulty, i + 1);
    questions.push(question);
  }
  
  return {
    questions,
    analytics: {
      difficultyDistribution: { [difficulty]: 100 },
      questionTypeDistribution: questionTypesArray.reduce((acc, type) => {
        acc[type] = (100 / questionTypesArray.length);
        return acc;
      }, {}),
      bloomLevelDistribution: { understand: 50, apply: 50 }
    }
  };
}

function generateQuestion(type, subject, topic, difficulty, index) {
  const baseQuestion = {
    type,
    question: `Question ${index}: What is the correct answer for this ${topic} problem?`,
    points: getPointsForDifficulty(difficulty),
    difficulty,
    bloomLevel: 'understand',
    hints: ['Think about the key concepts', 'Consider the context'],
    explanation: `This question tests your understanding of ${topic} concepts.`
  };

  switch (type) {
    case 'multiple_choice':
      return {
        ...baseQuestion,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option B'
      };
    
    case 'true_false':
      return {
        ...baseQuestion,
        question: `True or False: This statement about ${topic} is correct.`,
        correctAnswer: 'true'
      };
    
    case 'fill_blank':
      return {
        ...baseQuestion,
        question: `Complete the following: The main concept in ${topic} is _____.`,
        correctAnswer: 'fundamental principle'
      };
    
    case 'essay':
      return {
        ...baseQuestion,
        question: `Explain the key concepts of ${topic} and provide examples.`,
        correctAnswer: 'Student should explain key concepts with examples',
        points: 20
      };
    
    case 'matching':
      return {
        ...baseQuestion,
        question: `Match the following ${topic} terms with their definitions:`,
        options: ['Term A', 'Term B', 'Term C', 'Term D'],
        correctAnswer: { 'Term A': 'Definition A', 'Term B': 'Definition B', 'Term C': 'Definition C', 'Term D': 'Definition D' }
      };
    
    case 'ordering':
      return {
        ...baseQuestion,
        question: `Arrange the following steps in the correct order for ${topic}:`,
        options: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        correctAnswer: ['Step 1', 'Step 2', 'Step 3', 'Step 4']
      };
    
    case 'drag_drop':
      return {
        ...baseQuestion,
        question: `Drag and drop the correct answers to complete this ${topic} problem:`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: ['Option A', 'Option C']
      };
    
    case 'numerical':
      return {
        ...baseQuestion,
        question: `What is the numerical value of x in this ${topic} equation?`,
        correctAnswer: 42
      };
    
    case 'short_answer':
      return {
        ...baseQuestion,
        question: `Briefly explain the main concept of ${topic}.`,
        correctAnswer: 'Brief explanation of the main concept'
      };
    
    default:
      return {
        ...baseQuestion,
        type: 'multiple_choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option B'
      };
  }
}

function getPointsForDifficulty(difficulty) {
  switch (difficulty) {
    case 'beginner': return 5;
    case 'easy': return 10;
    case 'medium': return 15;
    case 'hard': return 20;
    case 'expert': return 25;
    default: return 10;
  }
}