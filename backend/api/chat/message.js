import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, content, language = 'en', mode, level, subject, grade, curriculum } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create system prompt based on mode and level
    let systemPrompt = "You are an AI tutoring assistant. Help students learn effectively.";
    
    if (level === 'eli5') {
      systemPrompt = "You are an AI tutoring assistant. Explain concepts like the student is 5 years old. Use simple language, analogies, and examples.";
    } else if (level === 'expert') {
      systemPrompt = "You are an AI tutoring assistant. Provide detailed, expert-level explanations with technical depth and advanced concepts.";
    }

    if (mode === 'socratic') {
      systemPrompt += " Use the Socratic method - ask guiding questions to help students discover answers themselves.";
    } else if (mode === 'exam') {
      systemPrompt += " Be strict and focused on testing knowledge. Provide clear, direct answers.";
    } else if (mode === 'friendly') {
      systemPrompt += " Be warm, encouraging, and supportive. Use positive reinforcement.";
    } else if (mode === 'motivational') {
      systemPrompt += " Be enthusiastic and motivational. Encourage the student and celebrate their progress.";
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: content }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Save conversation to database
    const { error: insertError } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId,
          user_message: content,
          ai_response: reply,
          language: language,
          mode: mode,
          level: level,
          subject: subject,
          grade: grade,
          curriculum: curriculum,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error saving conversation:', insertError);
    }

    res.status(200).json({ 
      message: { content: reply },
      success: true 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
}