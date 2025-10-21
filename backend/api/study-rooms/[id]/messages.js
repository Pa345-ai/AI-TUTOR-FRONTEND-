import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;
  const { id: roomId } = req.query;

  switch (method) {
    case 'GET':
      return getMessages(req, res, roomId);
    case 'POST':
      return sendMessage(req, res, roomId);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getMessages(req, res, roomId) {
  try {
    const { 
      userId, 
      limit = 50, 
      offset = 0 
    } = req.query;

    // Check if user is in the room
    const { data: participant } = await supabase
      .from('study_room_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: messages, error } = await supabase
      .from('study_room_messages')
      .select(`
        *,
        user:users!study_room_messages_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      messages: messages.reverse() // Return in chronological order
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendMessage(req, res, roomId) {
  try {
    const {
      userId,
      messageText,
      messageType = 'text',
      attachments = [],
      mentions = [],
      replyTo = null
    } = req.body;

    if (!userId || !messageText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user is in the room
    const { data: participant } = await supabase
      .from('study_room_participants')
      .select('id, role')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create message
    const { data: message, error } = await supabase
      .from('study_room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message_text: messageText,
        message_type: messageType,
        attachments,
        mentions,
        reply_to: replyTo
      })
      .select(`
        *,
        user:users!study_room_messages_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Update room's last activity
    await supabase
      .from('study_rooms')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', roomId);

    res.status(201).json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}