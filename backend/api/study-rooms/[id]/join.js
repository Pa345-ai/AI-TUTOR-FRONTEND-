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
    const { userId, password = null } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from('study_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      return res.status(404).json({ error: 'Study room not found' });
    }

    // Check if room is full
    if (room.current_participants >= room.max_participants) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Check if room is private and password is correct
    if (room.is_private) {
      if (!password) {
        return res.status(400).json({ error: 'Password required for private room' });
      }
      
      const passwordHash = Buffer.from(password).toString('base64');
      if (room.password_hash !== passwordHash) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
    }

    // Check if user is already in the room
    const { data: existingParticipant } = await supabase
      .from('study_room_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (existingParticipant) {
      return res.status(400).json({ error: 'User already in room' });
    }

    // Add user to room
    const { data: participant, error: participantError } = await supabase
      .from('study_room_participants')
      .insert({
        room_id: roomId,
        user_id: userId,
        role: 'participant',
        permissions: {
          canShareScreen: true,
          canShareFiles: true,
          canMuteOthers: false,
          canRemoveOthers: false,
          canModerateChat: false,
          canControlAI: false
        }
      })
      .select()
      .single();

    if (participantError) {
      throw participantError;
    }

    // Add join message
    await supabase
      .from('study_room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message_text: 'joined the room',
        message_type: 'system'
      });

    res.status(200).json({
      success: true,
      participant,
      message: 'Successfully joined study room'
    });

  } catch (error) {
    console.error('Join study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}