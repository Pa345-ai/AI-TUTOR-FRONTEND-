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
      submissionId, 
      content, 
      subject, 
      submissionType = 'essay',
      rubric = null,
      settings = {}
    } = req.body;

    if (!userId || !content) {
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

    // Analyze content for feedback
    const analysis = await analyzeContent(content, subject, submissionType, settings);

    // Generate AI feedback
    const feedback = await generateFeedback(content, analysis, rubric, settings);

    // Save submission and feedback
    const { data: submission } = await supabase
      .from('homework_submissions')
      .insert({
        user_id: userId,
        title: `AI Feedback - ${subject}`,
        description: `AI-generated feedback for ${submissionType}`,
        subject: subject,
        submission_type: submissionType,
        content: content,
        status: 'reviewed',
        ai_feedback: feedback,
        analytics: analysis.analytics
      })
      .select()
      .single();

    res.status(200).json({
      success: true,
      submissionId: submission.id,
      feedback: feedback,
      analysis: analysis,
      recommendations: feedback.suggestions
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function analyzeContent(content, subject, submissionType, settings) {
  const analysis = {
    wordCount: content.split(/\s+/).length,
    characterCount: content.length,
    paragraphCount: content.split(/\n\s*\n/).length,
    sentenceCount: content.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    readabilityScore: 0,
    gradeLevel: '',
    complexityScore: 0,
    vocabularyDiversity: 0,
    commonWords: [],
    writingPatterns: [],
    improvementAreas: [],
    strengths: [],
    grammarErrors: [],
    plagiarismScore: 0
  };

  // Calculate readability score (simplified Flesch-Kincaid)
  const avgWordsPerSentence = analysis.wordCount / analysis.sentenceCount;
  const avgSyllablesPerWord = estimateSyllables(content) / analysis.wordCount;
  analysis.readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  analysis.gradeLevel = calculateGradeLevel(analysis.readabilityScore);

  // Calculate complexity score
  analysis.complexityScore = calculateComplexityScore(content);

  // Calculate vocabulary diversity
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  analysis.vocabularyDiversity = uniqueWords.size / words.length;

  // Find common words
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  analysis.commonWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // Identify writing patterns
  analysis.writingPatterns = identifyWritingPatterns(content);

  // Grammar check (simplified)
  analysis.grammarErrors = await checkGrammar(content);

  // Plagiarism check (mock - in production, use actual service)
  analysis.plagiarismScore = Math.random() * 20; // 0-20% similarity

  // Generate improvement areas and strengths
  analysis.improvementAreas = generateImprovementAreas(analysis);
  analysis.strengths = generateStrengths(analysis);

  return analysis;
}

async function generateFeedback(content, analysis, rubric, settings) {
  const systemPrompt = `You are an AI tutor providing detailed feedback on student work. 
  Analyze the content and provide constructive, specific feedback that helps the student improve.
  
  Content Analysis:
  - Word Count: ${analysis.wordCount}
  - Readability Score: ${analysis.readabilityScore.toFixed(1)}
  - Grade Level: ${analysis.gradeLevel}
  - Complexity Score: ${analysis.complexityScore.toFixed(1)}
  - Vocabulary Diversity: ${(analysis.vocabularyDiversity * 100).toFixed(1)}%
  
  Provide feedback in the following format:
  1. Overall Score (0-100)
  2. Overall Comment
  3. Strengths (3-5 specific points)
  4. Areas for Improvement (3-5 specific points)
  5. Detailed Suggestions (actionable advice)
  6. Grammar and Style Notes
  7. Next Steps`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please provide feedback on this ${settings.submissionType || 'essay'}:\n\n${content}` }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });

  const aiResponse = completion.choices[0].message.content;

  // Parse AI response into structured feedback
  const feedback = parseFeedbackResponse(aiResponse, analysis);

  return feedback;
}

function parseFeedbackResponse(aiResponse, analysis) {
  // Parse the AI response into structured feedback
  const lines = aiResponse.split('\n');
  
  const feedback = {
    overallScore: 75, // Default score
    overallComment: '',
    strengths: [],
    areasForImprovement: [],
    suggestions: [],
    grammarCheck: {
      totalErrors: analysis.grammarErrors.length,
      errors: analysis.grammarErrors,
      suggestions: [],
      readabilityScore: analysis.readabilityScore
    },
    plagiarismCheck: {
      score: analysis.plagiarismScore,
      sources: [],
      originalContent: 100 - analysis.plagiarismScore,
      flaggedContent: analysis.plagiarismScore,
      recommendations: []
    },
    readabilityScore: analysis.readabilityScore,
    wordCount: analysis.wordCount,
    estimatedTimeToRead: Math.ceil(analysis.wordCount / 200),
    gradeLevel: analysis.gradeLevel,
    confidence: 0.85,
    generatedAt: new Date().toISOString()
  };

  // Extract overall comment
  const commentMatch = aiResponse.match(/Overall Comment[:\-\s]*(.+?)(?=\n|$)/i);
  if (commentMatch) {
    feedback.overallComment = commentMatch[1].trim();
  }

  // Extract strengths
  const strengthsMatch = aiResponse.match(/Strengths[:\-\s]*(.+?)(?=Areas for Improvement|$)/is);
  if (strengthsMatch) {
    feedback.strengths = strengthsMatch[1]
      .split(/[•\-\*]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Extract areas for improvement
  const improvementMatch = aiResponse.match(/Areas for Improvement[:\-\s]*(.+?)(?=Detailed Suggestions|$)/is);
  if (improvementMatch) {
    feedback.areasForImprovement = improvementMatch[1]
      .split(/[•\-\*]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Extract suggestions
  const suggestionsMatch = aiResponse.match(/Detailed Suggestions[:\-\s]*(.+?)(?=Grammar|Next Steps|$)/is);
  if (suggestionsMatch) {
    feedback.suggestions = suggestionsMatch[1]
      .split(/[•\-\*]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  return feedback;
}

function estimateSyllables(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  return words.reduce((total, word) => {
    return total + countSyllables(word);
  }, 0);
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }
  
  if (word.endsWith('e')) syllableCount--;
  if (syllableCount === 0) syllableCount = 1;
  
  return syllableCount;
}

function calculateGradeLevel(readabilityScore) {
  if (readabilityScore >= 90) return '5th Grade';
  if (readabilityScore >= 80) return '6th Grade';
  if (readabilityScore >= 70) return '7th Grade';
  if (readabilityScore >= 60) return '8th-9th Grade';
  if (readabilityScore >= 50) return '10th-12th Grade';
  if (readabilityScore >= 30) return 'College';
  return 'Graduate';
}

function calculateComplexityScore(content) {
  const words = content.split(/\s+/);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const avgWordsPerSentence = words.length / sentences.length;
  const longWords = words.filter(word => word.length > 6).length;
  const complexWords = words.filter(word => word.length > 10).length;
  
  return Math.min(10, (avgWordsPerSentence / 20) + (longWords / words.length * 10) + (complexWords / words.length * 20));
}

function identifyWritingPatterns(content) {
  const patterns = [];
  
  if (content.includes('because') || content.includes('therefore') || content.includes('thus')) {
    patterns.push('cause and effect');
  }
  if (content.includes('first') || content.includes('second') || content.includes('finally')) {
    patterns.push('sequential');
  }
  if (content.includes('however') || content.includes('although') || content.includes('but')) {
    patterns.push('comparison and contrast');
  }
  if (content.includes('for example') || content.includes('such as') || content.includes('including')) {
    patterns.push('exemplification');
  }
  
  return patterns;
}

async function checkGrammar(content) {
  // Simplified grammar check - in production, use actual grammar checking service
  const errors = [];
  
  // Check for common errors
  if (content.includes(' its ') && !content.includes(" it's ")) {
    errors.push({
      type: 'grammar',
      message: 'Check usage of "its" vs "it\'s"',
      suggestion: 'Use "it\'s" for "it is" and "its" for possession',
      position: { start: 0, end: 0 },
      severity: 'medium',
      confidence: 0.8
    });
  }
  
  if (content.includes(' there ') && content.includes(' their ')) {
    errors.push({
      type: 'grammar',
      message: 'Check usage of "there" vs "their"',
      suggestion: 'Use "there" for location and "their" for possession',
      position: { start: 0, end: 0 },
      severity: 'medium',
      confidence: 0.8
    });
  }
  
  return errors;
}

function generateImprovementAreas(analysis) {
  const areas = [];
  
  if (analysis.vocabularyDiversity < 0.5) {
    areas.push('vocabulary diversity');
  }
  if (analysis.sentenceCount > 0 && analysis.wordCount / analysis.sentenceCount > 25) {
    areas.push('sentence length');
  }
  if (analysis.paragraphCount > 0 && analysis.wordCount / analysis.paragraphCount < 50) {
    areas.push('paragraph development');
  }
  if (analysis.readabilityScore < 60) {
    areas.push('clarity and readability');
  }
  
  return areas;
}

function generateStrengths(analysis) {
  const strengths = [];
  
  if (analysis.vocabularyDiversity > 0.7) {
    strengths.push('rich vocabulary');
  }
  if (analysis.sentenceCount > 0 && analysis.wordCount / analysis.sentenceCount < 20) {
    strengths.push('concise writing');
  }
  if (analysis.paragraphCount > 0 && analysis.wordCount / analysis.paragraphCount > 100) {
    strengths.push('well-developed paragraphs');
  }
  if (analysis.readabilityScore > 70) {
    strengths.push('clear and readable');
  }
  
  return strengths;
}