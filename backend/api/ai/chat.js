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
      message, 
      sessionId, 
      context = {}, 
      personality = 'friendly',
      subject = null,
      topic = null 
    } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user context and learning history
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent learning context
    const { data: recentSessions } = await supabase
      .from('lesson_sessions')
      .select(`
        lessons (title, subject, topic),
        progress_percentage,
        is_completed
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get user's knowledge mastery
    const { data: mastery } = await supabase
      .from('user_knowledge_mastery')
      .select(`
        mastery_level,
        knowledge_nodes (title, subject, topic)
      `)
      .eq('user_id', userId)
      .order('mastery_level', { ascending: false })
      .limit(10);

    // Build context for AI
    const systemPrompt = buildSystemPrompt(user, recentSessions, mastery, personality, subject, topic);
    
    // Get conversation history
    const { data: chatHistory } = await supabase
      .from('ai_interactions')
      .select('input_text, ai_response, created_at')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.reverse().map(msg => [
        { role: 'user', content: msg.input_text },
        { role: 'assistant', content: msg.ai_response }
      ]).flat(),
      { role: 'user', content: message }
    ];

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0].message.content;

    // Save interaction to database
    await supabase
      .from('ai_interactions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        interaction_type: 'chat',
        input_text: message,
        ai_response: aiResponse,
        context: {
          personality,
          subject,
          topic,
          ...context
        }
      });

    // Update user's last active time
    await supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);

    res.status(200).json({
      success: true,
      response: aiResponse,
      context: {
        personality,
        subject,
        topic
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

function buildSystemPrompt(user, recentSessions, mastery, personality, subject, topic) {
  const basePrompt = `You are an AI tutor for NeuroLearn, a personalized learning platform. 
  You are helping ${user.full_name || 'a student'} learn and grow.`;

  const personalityPrompts = {
    friendly: "Be warm, encouraging, and supportive. Use a conversational tone and show enthusiasm for learning.",
    socratic: "Ask thought-provoking questions to guide the student to discover answers themselves. Be patient and methodical.",
    exam: "Be direct, focused, and test-oriented. Emphasize accuracy and preparation for assessments.",
    motivational: "Be inspiring and encouraging. Use positive reinforcement and help build confidence."
  };

  const personalityPrompt = personalityPrompts[personality] || personalityPrompts.friendly;

  let contextPrompt = '';
  
  if (recentSessions && recentSessions.length > 0) {
    contextPrompt += `\n\nRecent learning activity:\n`;
    recentSessions.forEach(session => {
      const lesson = session.lessons;
      if (lesson) {
        contextPrompt += `- ${lesson.title} (${lesson.subject}/${lesson.topic}) - ${session.progress_percentage}% complete\n`;
      }
    });
  }

  if (mastery && mastery.length > 0) {
    contextPrompt += `\n\nStudent's strong areas:\n`;
    mastery.slice(0, 5).forEach(item => {
      const node = item.knowledge_nodes;
      if (node) {
        contextPrompt += `- ${node.title} (${node.subject}/${node.topic}) - ${Math.round(item.mastery_level * 100)}% mastery\n`;
      }
    });
  }

  if (subject && topic) {
    contextPrompt += `\n\nCurrent focus: ${subject} - ${topic}`;
  }

  const guidelines = `
  
  Guidelines:
  - Always be helpful and educational
  - Adapt explanations to the student's level
  - Use examples and analogies when helpful
  - Encourage questions and exploration
  - Provide step-by-step guidance for complex topics
  - Celebrate progress and achievements
  - If you don't know something, admit it and suggest resources
  - Keep responses concise but comprehensive
  - Use appropriate academic language for the subject level`;

  return basePrompt + personalityPrompt + contextPrompt + guidelines;
}