'use client'

import React, { useState, useEffect } from 'react'
import { Play, Users, Clock, Eye, Hand, Globe, Settings, Filter, Search, BarChart3, Zap, RefreshCw, Pause, Square } from 'lucide-react'

interface VRARSession {
  id: string
  userId: string
  sessionType: string
  deviceType: string
  environmentId: string
  environmentName: string
  sceneId: string
  sceneName: string
  sessionData: any
  performanceMetrics: any
  comfortMetrics: any
  startedAt: string
  endedAt: string | null
  durationMinutes: number
  status: 'active' | 'completed' | 'paused'
}

interface CollaborativeSession {
  id: string
  sessionName: string
  environmentId: string
  environmentName: string
  sceneId: string
  sceneName: string
  maxParticipants: number
  currentParticipants: number
  sessionType: string
  privacyLevel: string
  startedAt: string
  endedAt: string | null
  createdBy: string
  createdByName: string
}

export default function VRARSessions() {
  const [sessions, setSessions] = useState<VRARSession[]>([])
  const [collaborativeSessions, setCollaborativeSessions] = useState<CollaborativeSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my_sessions' | 'collaborative' | 'analytics'>('my_sessions')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isStartingSession, setIsStartingSession] = useState(false)

  useEffect(() => {
    loadVRARSessions()
  }, [])

  const loadVRARSessions = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockSessions: VRARSession[] = [
        {
          id: '1',
          userId: 'user1',
          sessionType: 'vr',
          deviceType: 'oculus',
          environmentId: 'env1',
          environmentName: 'Physics Lab - Space Station',
          sceneId: 'scene1',
          sceneName: 'Gravity Experiment',
          sessionData: {
            headsetPosition: { x: 0, y: 1.6, z: 0 },
            handPositions: { left: { x: -0.3, y: 1.2, z: 0.5 }, right: { x: 0.3, y: 1.2, z: 0.5 } },
            interactions: ['grab_object', 'teleport', 'menu_open']
          },
          performanceMetrics: {
            fps: 90,
            latency: 12,
            trackingAccuracy: 0.98
          },
          comfortMetrics: {
            motionSickness: 0.1,
            eyeStrain: 0.2,
            fatigue: 0.3
          },
          startedAt: '2024-01-15T10:00:00Z',
          endedAt: null,
          durationMinutes: 25,
          status: 'active'
        },
        {
          id: '2',
          userId: 'user1',
          sessionType: 'ar',
          deviceType: 'hololens',
          environmentId: 'env2',
          environmentName: 'Chemistry Lab - Molecular World',
          sceneId: 'scene2',
          sceneName: 'Molecular Bonding',
          sessionData: {
            headsetPosition: { x: 0, y: 1.6, z: 0 },
            handPositions: { left: { x: -0.3, y: 1.2, z: 0.5 }, right: { x: 0.3, y: 1.2, z: 0.5 } },
            interactions: ['manipulate_molecule', 'zoom_in', 'rotate_view']
          },
          performanceMetrics: {
            fps: 60,
            latency: 18,
            trackingAccuracy: 0.95
          },
          comfortMetrics: {
            motionSickness: 0.05,
            eyeStrain: 0.15,
            fatigue: 0.25
          },
          startedAt: '2024-01-15T08:30:00Z',
          endedAt: '2024-01-15T09:45:00Z',
          durationMinutes: 75,
          status: 'completed'
        },
        {
          id: '3',
          userId: 'user1',
          sessionType: 'web',
          deviceType: 'desktop',
          environmentId: 'env3',
          environmentName: 'Historical Classroom - Ancient Rome',
          sceneId: 'scene3',
          sceneName: 'Roman History Lesson',
          sessionData: {
            mousePosition: { x: 500, y: 300 },
            keyboardInput: ['w', 'a', 's', 'd'],
            interactions: ['click_object', 'scroll_view', 'keyboard_input']
          },
          performanceMetrics: {
            fps: 60,
            latency: 25,
            trackingAccuracy: 1.0
          },
          comfortMetrics: {
            motionSickness: 0.0,
            eyeStrain: 0.1,
            fatigue: 0.2
          },
          startedAt: '2024-01-14T14:00:00Z',
          endedAt: '2024-01-14T15:30:00Z',
          durationMinutes: 90,
          status: 'completed'
        }
      ]

      const mockCollaborativeSessions: CollaborativeSession[] = [
        {
          id: '1',
          sessionName: 'Physics Study Group',
          environmentId: 'env1',
          environmentName: 'Physics Lab - Space Station',
          sceneId: 'scene1',
          sceneName: 'Gravity Experiment',
          maxParticipants: 8,
          currentParticipants: 5,
          sessionType: 'study_group',
          privacyLevel: 'private',
          startedAt: '2024-01-15T11:00:00Z',
          endedAt: null,
          createdBy: 'user2',
          createdByName: 'Sarah Johnson'
        },
        {
          id: '2',
          sessionName: 'Chemistry Collaboration',
          environmentId: 'env2',
          environmentName: 'Chemistry Lab - Molecular World',
          sceneId: 'scene2',
          sceneName: 'Molecular Bonding',
          maxParticipants: 6,
          currentParticipants: 4,
          sessionType: 'project_collaboration',
          privacyLevel: 'invite_only',
          startedAt: '2024-01-15T09:00:00Z',
          endedAt: null,
          createdBy: 'user3',
          createdByName: 'Mike Chen'
        },
        {
          id: '3',
          sessionName: 'Math Competition',
          environmentId: 'env5',
          environmentName: 'Mathematics Garden - Fractal Universe',
          sceneId: 'scene5',
          sceneName: 'Fractal Geometry',
          maxParticipants: 20,
          currentParticipants: 12,
          sessionType: 'competition',
          privacyLevel: 'public',
          startedAt: '2024-01-15T13:00:00Z',
          endedAt: null,
          createdBy: 'user4',
          createdByName: 'Dr. Smith'
        }
      ]

      setSessions(mockSessions)
      setCollaborativeSessions(mockCollaborativeSessions)
    } catch (error) {
      console.error('Failed to load VR/AR sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewSession = async () => {
    setIsStartingSession(true)
    // Simulate session startup
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsStartingSession(false)
    // In real implementation, this would launch the VR/AR session
    console.log('Starting new session')
  }

  const joinCollaborativeSession = async (sessionId: string) => {
    // Simulate joining a collaborative session
    console.log('Joining collaborative session:', sessionId)
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'vr':
        return Eye
      case 'ar':
        return Hand
      case 'web':
        return Globe
      default:
        return Play
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'vr':
        return 'bg-purple-100 text-purple-800'
      case 'ar':
        return 'bg-blue-100 text-blue-800'
      case 'web':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800'
      case 'private':
        return 'bg-red-100 text-red-800'
      case 'invite_only':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionTypeIconForCollaborative = (type: string) => {
    switch (type) {
      case 'study_group':
        return Users
      case 'project_collaboration':
        return Hand
      case 'peer_teaching':
        return Globe
      case 'competition':
        return Zap
      default:
        return Play
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesType = filterType === 'all' || session.sessionType === filterType
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      session.environmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.sceneName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading VR/AR sessions...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">VR/AR Sessions</h2>
            <p className="text-gray-600">
              Manage your immersive learning sessions and join collaborative experiences.
            </p>
          </div>
          <button
            onClick={startNewSession}
            disabled={isStartingSession}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStartingSession ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isStartingSession ? 'Starting...' : 'Start New Session'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'my_sessions', label: 'My Sessions', icon: Play },
              { id: 'collaborative', label: 'Collaborative', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'my_sessions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="vr">VR</option>
                    <option value="ar">AR</option>
                    <option value="web">Web</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const SessionIcon = getSessionTypeIcon(session.sessionType)
              
              return (
                <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <SessionIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{session.environmentName}</h3>
                        <p className="text-gray-600">{session.sceneName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(session.sessionType)}`}>
                            {session.sessionType.toUpperCase()}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <span className="text-xs text-gray-500">{session.deviceType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {session.durationMinutes} min
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.endedAt ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Performance</div>
                      <div className="text-sm text-gray-600">
                        {session.performanceMetrics.fps} FPS • {session.performanceMetrics.latency}ms latency
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Comfort</div>
                      <div className="text-sm text-gray-600">
                        Motion Sickness: {Math.round(session.comfortMetrics.motionSickness * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Tracking</div>
                      <div className="text-sm text-gray-600">
                        Accuracy: {Math.round(session.performanceMetrics.trackingAccuracy * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Solo Session</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.status === 'active' && (
                        <>
                          <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors">
                            <Square className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'collaborative' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collaborativeSessions.map((session) => {
              const SessionIcon = getSessionTypeIconForCollaborative(session.sessionType)
              
              return (
                <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <SessionIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{session.sessionName}</h3>
                        <p className="text-gray-600">{session.environmentName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPrivacyColor(session.privacyLevel)}`}>
                            {session.privacyLevel}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{session.sessionType.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {session.currentParticipants}/{session.maxParticipants}
                      </div>
                      <div className="text-xs text-gray-500">Participants</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created by</span>
                      <span className="font-semibold">{session.createdByName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Scene</span>
                      <span className="font-semibold">{session.sceneName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Started</span>
                      <span className="font-semibold">{new Date(session.startedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => joinCollaborativeSession(session.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Join Session</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{sessions.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(sessions.reduce((total, session) => total + session.durationMinutes, 0) / sessions.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Duration (min)</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(sessions.reduce((total, session) => total + session.performanceMetrics.fps, 0) / sessions.length)}
              </div>
              <div className="text-sm text-gray-600">Avg FPS</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.round(sessions.reduce((total, session) => total + session.comfortMetrics.motionSickness, 0) / sessions.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Motion Sickness</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Session Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Performance charts would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}