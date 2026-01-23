// API client for OmniMind AI Tutor
import { supabase } from './supabase'

export class OmniMindAPI {
  // AI Learning Path Generation
  static async generateLearningPath(data: {
    user_id: string
    subject: string
    difficulty_level: string
    learning_goals: string[]
    preferred_languages: string[]
    learning_style: string
  }) {
    const response = await fetch('/api/ai/generate_learning_path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Enhanced Emotional Tutor
  static async getEmotionalTutorResponse(data: {
    user_id: string
    user_input: string
    session_type: string
    subject: string
  }) {
    const response = await fetch('/api/ai/enhanced_emotional_tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Enhanced Quiz Generator
  static async generateQuiz(data: {
    user_id: string
    subject: string
    topic: string
    difficulty_level: string
    question_count: number
    quiz_type: string
  }) {
    const response = await fetch('/api/ai/enhanced_quiz_generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Database Operations
  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  static async getLearningPaths(userId: string) {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getAISessions(userId: string) {
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getProgress(userId: string) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getGamification(userId: string) {
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getCognitiveTwin(userId: string) {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getTokens(userId: string) {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getVREnvironments() {
    const { data, error } = await supabase
      .from('vr_environments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getDeveloperApps(userId: string) {
    const { data, error } = await supabase
      .from('developer_apps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getAuditLogs(userId: string) {
    const { data, error } = await supabase
      .from('audit_logs_enhanced')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data || []
  }

  static async getSecurityEvents(userId: string) {
    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    return data || []
  }

  // Knowledge Graph Update
  static async updateKnowledgeGraph(data: {
    user_id: string
    subject: string
    topic: string
    mastery_level: number
    connections: any[]
  }) {
    const response = await fetch('/api/ai/update_knowledge_graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Contextual Memory
  static async getContextualMemory(data: {
    user_id: string
    context: string
    session_id: string
  }) {
    const response = await fetch('/api/ai/contextual_memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Tutor Persona
  static async getTutorPersona(data: {
    user_id: string
    persona_type: string
    subject: string
    user_input: string
  }) {
    const response = await fetch('/api/ai/tutor_persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Meta Learning
  static async getMetaLearningInsights(data: {
    user_id: string
    learning_data: any
    global_insights: boolean
  }) {
    const response = await fetch('/api/ai/meta_learning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Security Monitor
  static async checkSecurityStatus(data: {
    user_id: string
    action_type: string
    resource_type: string
  }) {
    const response = await fetch('/api/ai/security_monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  // Database operations
  static async getLearningPaths(userId: string) {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }

  static async getAISessions(userId: string) {
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    return { data, error }
  }

  static async getProgress(userId: string) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }

  static async getKnowledgeGraph(userId: string) {
    const { data, error } = await supabase
      .from('knowledge_graphs')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  }

  static async getGamification(userId: string) {
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  }

  static async getCognitiveTwin(userId: string) {
    const { data, error } = await supabase
      .from('cognitive_twins')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  }

  static async getTokens(userId: string) {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }

  static async getVREnvironments() {
    const { data, error } = await supabase
      .from('mock_vr_environments')
      .select('*')
    return { data, error }
  }

  static async getDeveloperApps(userId: string) {
    const { data, error } = await supabase
      .from('developer_apps')
      .select('*')
      .eq('user_id', userId)
    return { data, error }
  }

  static async getAuditLogs(userId: string) {
    const { data, error } = await supabase
      .from('audit_logs_enhanced')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    return { data, error }
  }

  static async getSecurityEvents(userId: string) {
    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    return { data, error }
  }
}
