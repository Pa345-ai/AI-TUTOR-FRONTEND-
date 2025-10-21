import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getStudyRooms(req, res);
    case 'POST':
      return createStudyRoom(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getStudyRooms(req, res) {
  try {
    const { 
      userId, 
      status = 'active', 
      subject = null, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = supabase
      .from('study_rooms')
      .select(`
        *,
        study_room_participants (
          user_id,
          role,
          joined_at,
          is_online
        ),
        created_by_user:users!study_rooms_created_by_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('status', status)
      .order('last_activity_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data: rooms, error } = await query;

    if (error) {
      throw error;
    }

    // Filter rooms user can access
    const accessibleRooms = rooms.filter(room => 
      !room.is_private || 
      room.created_by === userId ||
      room.study_room_participants.some(p => p.user_id === userId)
    );

    res.status(200).json({
      success: true,
      rooms: accessibleRooms,
      total: accessibleRooms.length
    });

  } catch (error) {
    console.error('Get study rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createStudyRoom(req, res) {
  try {
    const {
      userId,
      name,
      description,
      subject,
      topic,
      maxParticipants = 10,
      isPrivate = false,
      password = null,
      settings = {},
      aiModeratorSettings = {}
    } = req.body;

    if (!userId || !name || !subject || !topic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create study room
    const { data: room, error } = await supabase
      .from('study_rooms')
      .insert({
        name,
        description,
        subject,
        topic,
        max_participants: maxParticipants,
        is_private: isPrivate,
        password_hash: password ? await hashPassword(password) : null,
        created_by: userId,
        settings,
        ai_moderator_settings: aiModeratorSettings
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add creator as host participant
    await supabase
      .from('study_room_participants')
      .insert({
        room_id: room.id,
        user_id: userId,
        role: 'host',
        permissions: {
          canShareScreen: true,
          canShareFiles: true,
          canMuteOthers: true,
          canRemoveOthers: true,
          canModerateChat: true,
          canControlAI: true
        }
      });

    res.status(201).json({
      success: true,
      room
    });

  } catch (error) {
    console.error('Create study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function hashPassword(password) {
  // In production, use proper password hashing
  return Buffer.from(password).toString('base64');
}