import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: roomId } = req.query;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user is in the room
    const { data: participant } = await supabase
      .from('study_room_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!participant) {
      return res.status(400).json({ error: 'User not in room' });
    }

    // Remove user from room
    const { error: leaveError } = await supabase
      .from('study_room_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (leaveError) {
      throw leaveError;
    }

    // Add leave message
    await supabase
      .from('study_room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message_text: 'left the room',
        message_type: 'system'
      });

    // Check if room is empty and close if needed
    const { data: remainingParticipants } = await supabase
      .from('study_room_participants')
      .select('id')
      .eq('room_id', roomId);

    if (remainingParticipants.length === 0) {
      await supabase
        .from('study_rooms')
        .update({ status: 'ended' })
        .eq('id', roomId);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully left study room'
    });

  } catch (error) {
    console.error('Leave study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}