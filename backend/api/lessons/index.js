import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getLessons(req, res);
    case 'POST':
      return createLesson(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getLessons(req, res) {
  try {
    const { 
      userId, 
      subject = null, 
      topic = null, 
      difficulty = null,
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = supabase
      .from('lessons')
      .select(`
        *,
        created_by_user:users!lessons_created_by_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (topic) {
      query = query.eq('topic', topic);
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    const { data: lessons, error } = await query;

    if (error) {
      throw error;
    }

    // Get user progress for each lesson if userId provided
    let lessonsWithProgress = lessons;
    if (userId) {
      const { data: sessions } = await supabase
        .from('lesson_sessions')
        .select('lesson_id, progress_percentage, is_completed, score')
        .eq('user_id', userId)
        .in('lesson_id', lessons.map(l => l.id));

      lessonsWithProgress = lessons.map(lesson => {
        const session = sessions?.find(s => s.lesson_id === lesson.id);
        return {
          ...lesson,
          userProgress: session || null
        };
      });
    }

    res.status(200).json({
      success: true,
      lessons: lessonsWithProgress,
      total: lessons.length
    });

  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createLesson(req, res) {
  try {
    const {
      userId,
      title,
      description,
      subject,
      topic,
      difficultyLevel = 'intermediate',
      contentType = 'text',
      content,
      learningObjectives = [],
      prerequisites = [],
      estimatedDuration = 30,
      isPublished = false
    } = req.body;

    if (!userId || !title || !subject || !topic || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        title,
        description,
        subject,
        topic,
        difficulty_level: difficultyLevel,
        content_type: contentType,
        content,
        learning_objectives: learningObjectives,
        prerequisites,
        estimated_duration: estimatedDuration,
        is_published: isPublished,
        created_by: userId
      })
      .select(`
        *,
        created_by_user:users!lessons_created_by_fkey (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      lesson
    });

  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}