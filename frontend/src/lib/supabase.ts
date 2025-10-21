import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Real-time subscriptions
export const subscribeToChannel = (channel: string, callback: (payload: any) => void) => {
  return supabase
    .channel(channel)
    .on('postgres_changes', { event: '*', schema: 'public', table: channel }, callback)
    .subscribe()
}

// Database helpers
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

export const fetchStudyRooms = async () => {
  const { data, error } = await supabase
    .from('study_rooms')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createStudyRoom = async (roomData: any) => {
  const { data, error } = await supabase
    .from('study_rooms')
    .insert(roomData)
    .select()
    .single()
  return { data, error }
}

export const joinStudyRoom = async (roomId: string, userId: string) => {
  const { data, error } = await supabase
    .from('study_room_participants')
    .insert({
      room_id: roomId,
      user_id: userId,
      role: 'participant'
    })
  return { data, error }
}

export const fetchStudyRoomMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('study_room_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
  return { data, error }
}

export const sendStudyRoomMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('study_room_messages')
    .insert(messageData)
    .select()
    .single()
  return { data, error }
}

export const fetchUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const fetchUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (*)
    `)
    .eq('user_id', userId)
  return { data, error }
}

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const markNotificationRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
  return { data, error }
}

export const fetchLessons = async (subject?: string, topic?: string) => {
  let query = supabase
    .from('lessons')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (subject) {
    query = query.eq('subject', subject)
  }
  if (topic) {
    query = query.eq('topic', topic)
  }

  const { data, error } = await query
  return { data, error }
}

export const fetchQuizzes = async (subject?: string, topic?: string) => {
  let query = supabase
    .from('quizzes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (subject) {
    query = query.eq('subject', subject)
  }
  if (topic) {
    query = query.eq('topic', topic)
  }

  const { data, error } = await query
  return { data, error }
}

export const fetchQuestions = async (quizId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true })
  return { data, error }
}

export const submitQuizAttempt = async (attemptData: any) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert(attemptData)
    .select()
    .single()
  return { data, error }
}

export const fetchCareerProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from('career_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createCareerProfile = async (profileData: any) => {
  const { data, error } = await supabase
    .from('career_profiles')
    .insert(profileData)
    .select()
    .single()
  return { data, error }
}

export const fetchUserGoals = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createUserGoal = async (goalData: any) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert(goalData)
    .select()
    .single()
  return { data, error }
}

export const updateUserGoal = async (goalId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update(updates)
    .eq('id', goalId)
  return { data, error }
}

export const fetchHomeworkSubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('homework_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
  return { data, error }
}

export const submitHomework = async (submissionData: any) => {
  const { data, error } = await supabase
    .from('homework_submissions')
    .insert(submissionData)
    .select()
    .single()
  return { data, error }
}

export const fetchIntegrations = async (userId: string) => {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createIntegration = async (integrationData: any) => {
  const { data, error } = await supabase
    .from('integrations')
    .insert(integrationData)
    .select()
    .single()
  return { data, error }
}

export const updateIntegration = async (integrationId: string, updates: any) => {
  const { data, error } = await supabase
    .from('integrations')
    .update(updates)
    .eq('id', integrationId)
  return { data, error }
}

export const fetchAIInteractions = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { data, error }
}

export const logAIInteraction = async (interactionData: any) => {
  const { data, error } = await supabase
    .from('ai_interactions')
    .insert(interactionData)
    .select()
    .single()
  return { data, error }
}

export const fetchEmotionTracking = async (userId: string) => {
  const { data, error } = await supabase
    .from('emotion_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  return { data, error }
}

export const logEmotion = async (emotionData: any) => {
  const { data, error } = await supabase
    .from('emotion_tracking')
    .insert(emotionData)
    .select()
    .single()
  return { data, error }
}

export const fetchFileUploads = async (userId: string) => {
  const { data, error } = await supabase
    .from('file_uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const uploadFile = async (file: File, userId: string, metadata?: any) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file)

  if (error) return { data: null, error }

  const { data: fileData, error: fileError } = await supabase
    .from('file_uploads')
    .insert({
      user_id: userId,
      file_name: file.name,
      file_type: fileExt,
      file_size: file.size,
      file_url: data.path,
      storage_path: data.path,
      mime_type: file.type,
      metadata: metadata || {}
    })
    .select()
    .single()

  return { data: fileData, error: fileError }
}

// Storage helpers
export const getFileUrl = (path: string) => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .remove([path])
  return { data, error }
}