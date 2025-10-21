import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;
  const { id: lessonId } = req.query;

  switch (method) {
    case 'GET':
      return getLessonSession(req, res, lessonId);
    case 'POST':
      return startLessonSession(req, res, lessonId);
    case 'PUT':
      return updateLessonSession(req, res, lessonId);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getLessonSession(req, res, lessonId) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const { data: session, error } = await supabase
      .from('lesson_sessions')
      .select(`
        *,
        lesson:lessons!lesson_sessions_lesson_id_fkey (
          title,
          description,
          subject,
          topic,
          content,
          learning_objectives,
          estimated_duration
        )
      `)
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.status(200).json({
      success: true,
      session: session || null
    });

  } catch (error) {
    console.error('Get lesson session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function startLessonSession(req, res, lessonId) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if lesson exists
    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .eq('is_published', true)
      .single();

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('lesson_sessions')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .single();

    if (existingSession) {
      return res.status(200).json({
        success: true,
        session: existingSession,
        message: 'Session already exists'
      });
    }

    // Create new session
    const { data: session, error } = await supabase
      .from('lesson_sessions')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        started_at: new Date().toISOString()
      })
      .select(`
        *,
        lesson:lessons!lesson_sessions_lesson_id_fkey (
          title,
          description,
          subject,
          topic,
          content,
          learning_objectives,
          estimated_duration
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Start lesson session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateLessonSession(req, res, lessonId) {
  try {
    const { 
      userId, 
      progressPercentage, 
      isCompleted = false, 
      score = null,
      timeSpent = 0,
      feedback = {}
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateData = {
      progress_percentage: progressPercentage,
      is_completed: isCompleted,
      time_spent: timeSpent,
      feedback,
      updated_at: new Date().toISOString()
    };

    if (isCompleted) {
      updateData.completed_at = new Date().toISOString();
    }

    if (score !== null) {
      updateData.score = score;
    }

    const { data: session, error } = await supabase
      .from('lesson_sessions')
      .update(updateData)
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .select(`
        *,
        lesson:lessons!lesson_sessions_lesson_id_fkey (
          title,
          description,
          subject,
          topic,
          content,
          learning_objectives,
          estimated_duration
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Update user progress
    if (isCompleted) {
      await updateUserProgress(userId, session.lesson.subject, session.lesson.topic);
    }

    res.status(200).json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Update lesson session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserProgress(userId, subject, topic) {
  try {
    // Get or create user progress record
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)
      .eq('topic', topic)
      .single();

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from('user_progress')
        .update({
          time_spent: existingProgress.time_spent + 1,
          last_studied_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress record
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          subject,
          topic,
          time_spent: 1,
          last_studied_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Update user progress error:', error);
  }
}