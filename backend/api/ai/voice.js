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
      audioData, 
      sessionId, 
      action = 'transcribe_and_respond',
      language = 'en'
    } = req.body;

    if (!userId || !audioData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: {
        name: 'audio.wav',
        data: audioBuffer
      },
      model: 'whisper-1',
      language: language,
      response_format: 'json'
    });

    const transcribedText = transcription.text;

    if (!transcribedText.trim()) {
      return res.status(400).json({ error: 'No speech detected' });
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

    // Generate AI response based on transcribed text
    const systemPrompt = `You are an AI tutor for NeuroLearn. Respond to the student's voice input in a conversational, helpful manner. 
    Keep responses concise since they will be converted to speech. Be encouraging and educational.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcribedText }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Generate speech from AI response
    const speechResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // or 'echo', 'fable', 'onyx', 'nova', 'shimmer'
      input: aiResponse,
      response_format: 'mp3'
    });

    const audioBufferResponse = await speechResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBufferResponse).toString('base64');

    // Save interaction to database
    await supabase
      .from('ai_interactions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        interaction_type: 'voice',
        input_audio_url: null, // Store in file storage if needed
        ai_response: aiResponse,
        ai_response_audio_url: null, // Store in file storage if needed
        context: {
          language,
          action,
          transcribed_text: transcribedText
        }
      });

    // Update user's last active time
    await supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);

    res.status(200).json({
      success: true,
      transcribedText,
      aiResponse,
      audioResponse: audioBase64,
      context: {
        language,
        action
      }
    });

  } catch (error) {
    console.error('Voice API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}