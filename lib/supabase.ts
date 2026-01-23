import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  learning_style: string
  preferred_languages: string[]
  subscription_tier: 'free' | 'premium' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface LearningPath {
  id: string
  user_id: string
  title: string
  description: string
  subject: string
  difficulty_level: string
  estimated_duration: number
  progress_percentage: number
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

export interface AISession {
  id: string
  user_id: string
  session_type: string
  subject: string
  user_input: string
  ai_response: string
  emotional_tone: string
  learning_insights: any
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  subject: string
  topic: string
  difficulty_level: string
  questions: any[]
  time_limit: number
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  learning_path_id: string
  lesson_id: string
  completion_percentage: number
  time_spent: number
  xp_earned: number
  created_at: string
}

export interface KnowledgeGraph {
  id: string
  user_id: string
  subject: string
  topic: string
  mastery_level: number
  connections: any[]
  last_updated: string
}

export interface Gamification {
  id: string
  user_id: string
  xp_total: number
  level: number
  badges: string[]
  streak_days: number
  last_activity: string
}

export interface CognitiveTwin {
  id: string
  user_id: string
  learning_patterns: any
  predicted_performance: any
  recommendations: any[]
  last_updated: string
}

export interface Token {
  id: string
  user_id: string
  token_type: string
  amount: number
  transaction_type: string
  description: string
  created_at: string
}

export interface VREnvironment {
  id: string
  name: string
  description: string
  environment_type: string
  settings: any
  created_at: string
}

export interface DeveloperApp {
  id: string
  name: string
  description: string
  api_key: string
  permissions: string[]
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  details: any
  created_at: string
}

export interface SecurityEvent {
  id: string
  user_id: string
  event_type: string
  severity: string
  description: string
  resolved: boolean
  created_at: string
}
