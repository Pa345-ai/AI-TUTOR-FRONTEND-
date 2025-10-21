import { useState, useEffect } from 'react'
import { OmniMindAPI } from '../lib/api'
import { User, LearningPath, AISession, Progress, Gamification, CognitiveTwin, Token, VREnvironment, DeveloperApp, AuditLog, SecurityEvent } from '../lib/supabase'

export const useOmniMind = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [aiSessions, setAISessions] = useState<AISession[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [gamification, setGamification] = useState<Gamification | null>(null)
  const [cognitiveTwin, setCognitiveTwin] = useState<CognitiveTwin | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [vrEnvironments, setVREnvironments] = useState<VREnvironment[]>([])
  const [developerApps, setDeveloperApps] = useState<DeveloperApp[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadAllData()
    }
  }, [userId])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load user data first
      const userData = await OmniMindAPI.getUser(userId)
      setUser(userData)

      const [
        learningPathsData,
        aiSessionsData,
        progressData,
        gamificationData,
        cognitiveTwinData,
        tokensData,
        vrEnvironmentsData,
        developerAppsData,
        auditLogsData,
        securityEventsData
      ] = await Promise.all([
        OmniMindAPI.getLearningPaths(userId),
        OmniMindAPI.getAISessions(userId),
        OmniMindAPI.getProgress(userId),
        OmniMindAPI.getGamification(userId),
        OmniMindAPI.getCognitiveTwin(userId),
        OmniMindAPI.getTokens(userId),
        OmniMindAPI.getVREnvironments(),
        OmniMindAPI.getDeveloperApps(userId),
        OmniMindAPI.getAuditLogs(userId),
        OmniMindAPI.getSecurityEvents(userId)
      ])

      if (learningPathsData.data) setLearningPaths(learningPathsData.data)
      if (aiSessionsData.data) setAISessions(aiSessionsData.data)
      if (progressData.data) setProgress(progressData.data)
      if (gamificationData.data) setGamification(gamificationData.data)
      if (cognitiveTwinData.data) setCognitiveTwin(cognitiveTwinData.data)
      if (tokensData.data) setTokens(tokensData.data)
      if (vrEnvironmentsData.data) setVREnvironments(vrEnvironmentsData.data)
      if (developerAppsData.data) setDeveloperApps(developerAppsData.data)
      if (auditLogsData.data) setAuditLogs(auditLogsData.data)
      if (securityEventsData.data) setSecurityEvents(securityEventsData.data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const generateLearningPath = async (data: {
    subject: string
    difficulty_level: string
    learning_goals: string[]
    preferred_languages: string[]
    learning_style: string
  }) => {
    try {
      const result = await OmniMindAPI.generateLearningPath({
        user_id: userId,
        ...data
      })
      await loadAllData() // Refresh data
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate learning path')
      throw err
    }
  }

  const getEmotionalTutorResponse = async (data: {
    user_input: string
    session_type: string
    subject: string
  }) => {
    try {
      const result = await OmniMindAPI.getEmotionalTutorResponse({
        user_id: userId,
        ...data
      })
      await loadAllData() // Refresh data
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response')
      throw err
    }
  }

  const generateQuiz = async (data: {
    subject: string
    topic: string
    difficulty_level: string
    question_count: number
    quiz_type: string
  }) => {
    try {
      const result = await OmniMindAPI.generateQuiz({
        user_id: userId,
        ...data
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
      throw err
    }
  }

  const updateKnowledgeGraph = async (data: {
    subject: string
    topic: string
    mastery_level: number
    connections: any[]
  }) => {
    try {
      const result = await OmniMindAPI.updateKnowledgeGraph({
        user_id: userId,
        ...data
      })
      await loadAllData() // Refresh data
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update knowledge graph')
      throw err
    }
  }

  const getContextualMemory = async (data: {
    context: string
    session_id: string
  }) => {
    try {
      const result = await OmniMindAPI.getContextualMemory({
        user_id: userId,
        ...data
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get contextual memory')
      throw err
    }
  }

  const getTutorPersona = async (data: {
    persona_type: string
    subject: string
    user_input: string
  }) => {
    try {
      const result = await OmniMindAPI.getTutorPersona({
        user_id: userId,
        ...data
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get tutor persona')
      throw err
    }
  }

  const getMetaLearningInsights = async (data: {
    learning_data: any
    global_insights: boolean
  }) => {
    try {
      const result = await OmniMindAPI.getMetaLearningInsights({
        user_id: userId,
        ...data
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get meta learning insights')
      throw err
    }
  }

  const checkSecurityStatus = async (data: {
    action_type: string
    resource_type: string
  }) => {
    try {
      const result = await OmniMindAPI.checkSecurityStatus({
        user_id: userId,
        ...data
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check security status')
      throw err
    }
  }

  return {
    // Data
    user,
    learningPaths,
    aiSessions,
    progress,
    gamification,
    cognitiveTwin,
    tokens,
    vrEnvironments,
    developerApps,
    auditLogs,
    securityEvents,
    
    // State
    loading,
    error,
    
    // Actions
    generateLearningPath,
    getEmotionalTutorResponse,
    generateQuiz,
    updateKnowledgeGraph,
    getContextualMemory,
    getTutorPersona,
    getMetaLearningInsights,
    checkSecurityStatus,
    loadAllData
  }
}
