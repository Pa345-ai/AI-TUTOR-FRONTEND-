// Supabase API integration for AI Tutoring App
import { supabase } from './supabase'

// Override the existing API functions to use Supabase instead of mock data
export const SUPABASE_BACKEND = true

// Chat API with Supabase
export async function chatWithSupabase(request: any): Promise<{ reply: string }> {
  try {
    // Call your existing Supabase edge function
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({
        userId: request.userId,
        message: request.message,
        language: request.language || 'en',
        mode: request.mode,
        level: request.level,
        subject: request.subject,
        grade: request.grade,
        curriculum: request.curriculum,
        personaSocratic: request.personaSocratic,
        personaStrictness: request.personaStrictness,
        personaEncouragement: request.personaEncouragement
      })
    })

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`)
    }

    const data = await response.json()
    return { reply: data.reply || data.message || 'No response received' }
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
}

// Progress API with Supabase
export async function fetchProgressWithSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    // Calculate overall progress
    const totalTimeSpent = data?.reduce((sum, item) => sum + (item.time_spent || 0), 0) || 0
    const totalQuestions = data?.reduce((sum, item) => sum + (item.questions_answered || 0), 0) || 0
    const totalCorrect = data?.reduce((sum, item) => sum + (item.correct_answers || 0), 0) || 0
    const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0

    // Get learning streak
    const { data: streakData } = await supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single()

    return {
      xp: Math.floor(totalTimeSpent / 60) * 10, // 10 XP per minute
      level: Math.floor(Math.sqrt(totalTimeSpent / 3600)) + 1, // Level based on hours
      streak: streakData?.current_streak || 0,
      totalAssignmentsCompleted: data?.length || 0,
      totalQuizzesCompleted: 0, // Will be calculated from quiz_attempts
      averageScore: Math.round(averageScore)
    }
  } catch (error) {
    console.error('Progress fetch error:', error)
    throw error
  }
}

// Achievements API with Supabase
export async function fetchAchievementsWithSupabase() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false })

    if (error) throw error

    return data?.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon_url,
      points: achievement.points,
      rarity: achievement.rarity
    })) || []
  } catch (error) {
    console.error('Achievements fetch error:', error)
    throw error
  }
}

// Study Rooms API with Supabase
export async function fetchStudyRoomsWithSupabase() {
  try {
    const { data, error } = await supabase
      .from('study_rooms')
      .select(`
        *,
        study_room_participants (
          user_id,
          role,
          joined_at
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      subject: room.subject,
      topic: room.topic,
      maxParticipants: room.max_participants,
      currentParticipants: room.current_participants,
      isPrivate: room.is_private,
      createdBy: room.created_by,
      createdAt: room.created_at,
      participants: room.study_room_participants || []
    })) || []
  } catch (error) {
    console.error('Study rooms fetch error:', error)
    throw error
  }
}

// Leaderboard API with Supabase
export async function fetchLeaderboardWithSupabase(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        users (
          full_name,
          avatar_url
        )
      `)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data?.map(entry => ({
      userId: entry.user_id,
      name: entry.users?.full_name || 'Anonymous',
      xp: entry.score,
      level: Math.floor(Math.sqrt(entry.score / 1000)) + 1
    })) || []
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    throw error
  }
}

// Flashcards API with Supabase
export async function fetchFlashcardsWithSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)
      .eq('file_type', 'flashcard')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(card => ({
      id: card.id,
      front: card.metadata?.front || '',
      back: card.metadata?.back || '',
      subject: card.metadata?.subject,
      deckId: card.metadata?.deck_id,
      tags: card.metadata?.tags || []
    })) || []
  } catch (error) {
    console.error('Flashcards fetch error:', error)
    throw error
  }
}

// Learning Paths API with Supabase
export async function fetchLearningPathsWithSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(path => ({
      id: path.id,
      subject: path.subject,
      currentTopic: path.title,
      completedTopics: [], // Will be calculated from learning objectives
      recommendedResources: [] // Will be populated from knowledge nodes
    })) || []
  } catch (error) {
    console.error('Learning paths fetch error:', error)
    throw error
  }
}

// Notifications API with Supabase
export async function fetchNotificationsWithSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return data?.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.is_read,
      relatedId: notification.action_url,
      createdAt: notification.created_at
    })) || []
  } catch (error) {
    console.error('Notifications fetch error:', error)
    throw error
  }
}

// Voice API with Supabase
export async function processVoiceWithSupabase(audioBlob: Blob, userId: string) {
  try {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.wav')
    formData.append('userId', userId)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/voice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Voice API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Voice processing error:', error)
    throw error
  }
}

// Emotion Recognition API with Supabase
export async function processEmotionWithSupabase(imageBlob: Blob, userId: string) {
  try {
    const formData = new FormData()
    formData.append('image', imageBlob, 'emotion.jpg')
    formData.append('userId', userId)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/emotion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Emotion API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Emotion processing error:', error)
    throw error
  }
}

// Quiz Generation API with Supabase
export async function generateQuizWithSupabase(params: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/quiz-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      throw new Error(`Quiz generation error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Quiz generation error:', error)
    throw error
  }
}

// Career Advice API with Supabase
export async function getCareerAdviceWithSupabase(params: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/career-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      throw new Error(`Career advice error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Career advice error:', error)
    throw error
  }
}

// Homework Feedback API with Supabase
export async function getHomeworkFeedbackWithSupabase(params: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      throw new Error(`Homework feedback error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Homework feedback error:', error)
    throw error
  }
}

// Real-time subscriptions
export const subscribeToStudyRoomMessages = (roomId: string, callback: (message: any) => void) => {
  return supabase
    .channel(`study_room_messages_${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'study_room_messages',
      filter: `room_id=eq.${roomId}`
    }, callback)
    .subscribe()
}

export const subscribeToNotifications = (userId: string, callback: (notification: any) => void) => {
  return supabase
    .channel(`notifications_${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}

export const subscribeToAIInteractions = (userId: string, callback: (interaction: any) => void) => {
  return supabase
    .channel(`ai_interactions_${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'ai_interactions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}