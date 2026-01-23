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
      return getStudyRoom(req, res, roomId);
    case 'PUT':
      return updateStudyRoom(req, res, roomId);
    case 'DELETE':
      return deleteStudyRoom(req, res, roomId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getStudyRoom(req, res, roomId) {
  try {
    const { userId } = req.query;

    const { data: room, error } = await supabase
      .from('study_rooms')
      .select(`
        *,
        study_room_participants (
          id,
          user_id,
          role,
          joined_at,
          is_online,
          is_muted,
          is_video_on,
          is_screen_sharing,
          permissions,
          stats,
          user:users!study_room_participants_user_id_fkey (
            full_name,
            avatar_url
          )
        ),
        study_room_messages (
          id,
          user_id,
          message_text,
          message_type,
          attachments,
          reactions,
          mentions,
          is_edited,
          is_deleted,
          created_at,
          user:users!study_room_messages_user_id_fkey (
            full_name,
            avatar_url
          )
        ),
        study_room_resources (
          id,
          name,
          file_type,
          file_url,
          file_size,
          description,
          tags,
          is_public,
          download_count,
          view_count,
          rating,
          created_at,
          uploaded_by_user:users!study_room_resources_uploaded_by_fkey (
            full_name,
            avatar_url
          )
        ),
        created_by_user:users!study_rooms_created_by_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('id', roomId)
      .single();

    if (error) {
      throw error;
    }

    if (!room) {
      return res.status(404).json({ error: 'Study room not found' });
    }

    // Check if user has access to the room
    const hasAccess = room.created_by === userId || 
      room.study_room_participants.some(p => p.user_id === userId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      room
    });

  } catch (error) {
    console.error('Get study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateStudyRoom(req, res, roomId) {
  try {
    const { userId } = req.body;
    const updateData = { ...req.body };
    delete updateData.userId;

    // Check if user is the room creator
    const { data: room } = await supabase
      .from('study_rooms')
      .select('created_by')
      .eq('id', roomId)
      .single();

    if (!room || room.created_by !== userId) {
      return res.status(403).json({ error: 'Only room creator can update' });
    }

    const { data: updatedRoom, error } = await supabase
      .from('study_rooms')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      room: updatedRoom
    });

  } catch (error) {
    console.error('Update study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteStudyRoom(req, res, roomId) {
  try {
    const { userId } = req.body;

    // Check if user is the room creator
    const { data: room } = await supabase
      .from('study_rooms')
      .select('created_by')
      .eq('id', roomId)
      .single();

    if (!room || room.created_by !== userId) {
      return res.status(403).json({ error: 'Only room creator can delete' });
    }

    // Delete room (cascade will handle related records)
    const { error } = await supabase
      .from('study_rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Study room deleted successfully'
    });

  } catch (error) {
    console.error('Delete study room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}