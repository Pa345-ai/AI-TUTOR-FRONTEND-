import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get user progress data
    const [
      { data: progressData },
      { data: streakData },
      { data: recentSessions },
      { data: achievements },
      { data: leaderboardData }
    ] = await Promise.all([
      // User progress by subject/topic
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_studied_at', { ascending: false }),

      // Learning streak
      supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', userId)
        .single(),

      // Recent lesson sessions
      supabase
        .from('lesson_sessions')
        .select(`
          id,
          progress_percentage,
          is_completed,
          score,
          time_spent,
          created_at,
          lesson:lessons!lesson_sessions_lesson_id_fkey (
            title,
            subject,
            topic
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),

      // User achievements
      supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievement:achievements!user_achievements_achievement_id_fkey (
            name,
            description,
            icon_url,
            points,
            rarity
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(10),

      // Leaderboard position
      supabase
        .from('leaderboard_entries')
        .select(`
          rank,
          score,
          leaderboard:leaderboards!leaderboard_entries_leaderboard_id_fkey (
            name,
            category
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Calculate overall statistics
    const totalTimeSpent = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
    const completedLessons = recentSessions?.filter(s => s.is_completed).length || 0;
    const averageScore = recentSessions?.length > 0 
      ? recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length 
      : 0;

    // Calculate mastery levels
    const masteryLevels = progressData?.map(p => ({
      subject: p.subject,
      topic: p.topic,
      masteryLevel: p.mastery_level,
      timeSpent: p.time_spent,
      lastStudied: p.last_studied_at
    })) || [];

    // Calculate learning patterns
    const learningPatterns = {
      mostStudiedSubject: getMostStudiedSubject(progressData),
      strongestTopic: getStrongestTopic(progressData),
      recentActivity: recentSessions?.slice(0, 5) || [],
      weeklyGoal: calculateWeeklyGoal(progressData, recentSessions)
    };

    // Calculate achievements progress
    const achievementsProgress = achievements?.map(a => ({
      name: a.achievement.name,
      description: a.achievement.description,
      iconUrl: a.achievement.icon_url,
      points: a.achievement.points,
      rarity: a.achievement.rarity,
      earnedAt: a.earned_at
    })) || [];

    const response = {
      success: true,
      progress: {
        userId,
        totalTimeSpent,
        completedLessons,
        averageScore,
        currentStreak: streakData?.current_streak || 0,
        longestStreak: streakData?.longest_streak || 0,
        masteryLevels,
        learningPatterns,
        achievements: achievementsProgress,
        leaderboardPositions: leaderboardData || [],
        lastUpdated: new Date().toISOString()
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMostStudiedSubject(progressData) {
  if (!progressData || progressData.length === 0) return null;
  
  const subjectTime = {};
  progressData.forEach(p => {
    subjectTime[p.subject] = (subjectTime[p.subject] || 0) + (p.time_spent || 0);
  });
  
  return Object.entries(subjectTime)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
}

function getStrongestTopic(progressData) {
  if (!progressData || progressData.length === 0) return null;
  
  const sortedByMastery = progressData
    .sort((a, b) => (b.mastery_level || 0) - (a.mastery_level || 0));
  
  const strongest = sortedByMastery[0];
  return strongest ? {
    subject: strongest.subject,
    topic: strongest.topic,
    masteryLevel: strongest.mastery_level
  } : null;
}

function calculateWeeklyGoal(progressData, recentSessions) {
  // Calculate based on recent activity
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const recentActivity = recentSessions?.filter(s => 
    new Date(s.created_at) >= lastWeek
  ) || [];
  
  const timeThisWeek = recentActivity.reduce((sum, s) => sum + (s.time_spent || 0), 0);
  
  return {
    targetTime: Math.max(300, timeThisWeek + 60), // At least 5 minutes more than last week
    currentTime: timeThisWeek,
    progress: Math.min(100, (timeThisWeek / Math.max(300, timeThisWeek + 60)) * 100)
  };
}