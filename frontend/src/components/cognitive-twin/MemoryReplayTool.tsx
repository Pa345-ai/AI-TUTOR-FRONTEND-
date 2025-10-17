'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, Target, BookOpen, Zap, Brain, Calendar, Filter, Search, RefreshCw, Eye, BarChart3, TrendingUp, Users, Lightbulb } from 'lucide-react'

interface MemoryReplaySession {
  id: string
  sessionName: string
  originalSessionId?: string
  sessionType: 'study' | 'quiz' | 'lesson' | 'practice' | 'review'
  subjectArea: string
  topic: string
  durationMinutes: number
  contentSummary: string
  keyConcepts: string[]
  learningObjectives: string[]
  materialsUsed: string[]
  performanceScore: number
  engagementLevel: number
  difficultyRating: number
  comprehensionLevel: number
  attentionPatterns: any
  cognitiveLoad: number
  memoryEncodingStrength: number
  learningStyleUsed: any
  sessionTimeline: any
  milestones: any[]
  breakthroughs: any[]
  struggles: any[]
  aiInsights: any
  improvementSuggestions: string[]
  knowledgeGaps: string[]
  startedAt: string
  completedAt: string
  createdAt: string
}

interface TimelineEvent {
  timestamp: number
  event: string
  description: string
  type: 'milestone' | 'breakthrough' | 'struggle' | 'activity'
  importance: number
}

interface MemoryReplayToolProps {
  twinId?: string
}

export default function MemoryReplayTool({ twinId }: MemoryReplayToolProps) {
  const [sessions, setSessions] = useState<MemoryReplaySession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<MemoryReplaySession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'sessions' | 'insights'>('timeline')
  const [selectedSession, setSelectedSession] = useState<MemoryReplaySession | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSubject, setFilterSubject] = useState<string>('all')

  useEffect(() => {
    loadMemoryReplayData()
  }, [twinId])

  useEffect(() => {
    filterSessions()
  }, [sessions, searchTerm, filterType, filterSubject])

  const loadMemoryReplayData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock sessions data
      const mockSessions: MemoryReplaySession[] = [
        {
          id: 'session-1',
          sessionName: 'Algebra Mastery Session',
          sessionType: 'study',
          subjectArea: 'mathematics',
          topic: 'quadratic equations',
          durationMinutes: 45,
          contentSummary: 'Deep dive into solving quadratic equations using multiple methods including factoring, completing the square, and the quadratic formula.',
          keyConcepts: ['quadratic formula', 'factoring', 'completing the square', 'discriminant'],
          learningObjectives: ['Solve quadratic equations', 'Understand different methods', 'Apply to real problems'],
          materialsUsed: ['textbook', 'online calculator', 'practice problems'],
          performanceScore: 88.5,
          engagementLevel: 92.3,
          difficultyRating: 7.2,
          comprehensionLevel: 89.7,
          attentionPatterns: {
            focusPeaks: [5, 15, 25, 35],
            attentionDrops: [10, 20, 30],
            averageFocus: 0.87
          },
          cognitiveLoad: 0.75,
          memoryEncodingStrength: 0.89,
          learningStyleUsed: {
            visual: 0.85,
            auditory: 0.45,
            kinesthetic: 0.60
          },
          sessionTimeline: {
            events: [
              { timestamp: 0, event: 'Session Start', description: 'Began reviewing quadratic equations', type: 'activity', importance: 1 },
              { timestamp: 5, event: 'Breakthrough', description: 'Understood the quadratic formula derivation', type: 'breakthrough', importance: 3 },
              { timestamp: 15, event: 'Milestone', description: 'Solved first complex problem independently', type: 'milestone', importance: 2 },
              { timestamp: 25, event: 'Struggle', description: 'Difficulty with completing the square method', type: 'struggle', importance: 2 },
              { timestamp: 35, event: 'Breakthrough', description: 'Mastered completing the square technique', type: 'breakthrough', importance: 3 },
              { timestamp: 40, event: 'Milestone', description: 'Completed all practice problems', type: 'milestone', importance: 2 },
              { timestamp: 45, event: 'Session End', description: 'Session completed successfully', type: 'activity', importance: 1 }
            ]
          },
          milestones: [
            { timestamp: 15, description: 'Solved first complex problem independently', impact: 'high' },
            { timestamp: 40, description: 'Completed all practice problems', impact: 'medium' }
          ],
          breakthroughs: [
            { timestamp: 5, description: 'Understood the quadratic formula derivation', impact: 'high' },
            { timestamp: 35, description: 'Mastered completing the square technique', impact: 'high' }
          ],
          struggles: [
            { timestamp: 25, description: 'Difficulty with completing the square method', impact: 'medium' }
          ],
          aiInsights: {
            learningPattern: 'Visual learner with strong pattern recognition',
            strengths: ['Mathematical reasoning', 'Visual problem solving'],
            weaknesses: ['Sequential processing', 'Detail orientation'],
            recommendations: ['Use more visual aids', 'Practice step-by-step methods']
          },
          improvementSuggestions: [
            'Practice more completing the square problems',
            'Use visual diagrams for complex equations',
            'Review prerequisite algebra concepts'
          ],
          knowledgeGaps: [
            'Advanced factoring techniques',
            'Graphing quadratic functions'
          ],
          startedAt: '2024-01-20T10:00:00Z',
          completedAt: '2024-01-20T10:45:00Z',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 'session-2',
          sessionName: 'History Deep Dive',
          sessionType: 'lesson',
          subjectArea: 'history',
          topic: 'World War II',
          durationMinutes: 60,
          contentSummary: 'Comprehensive study of World War II covering major events, key figures, and historical significance.',
          keyConcepts: ['Nazi Germany', 'Allied powers', 'Holocaust', 'Pearl Harbor', 'D-Day'],
          learningObjectives: ['Understand major events', 'Identify key figures', 'Analyze historical impact'],
          materialsUsed: ['documentary', 'textbook', 'timeline', 'maps'],
          performanceScore: 91.2,
          engagementLevel: 87.8,
          difficultyRating: 6.5,
          comprehensionLevel: 93.1,
          attentionPatterns: {
            focusPeaks: [10, 25, 40, 55],
            attentionDrops: [15, 35, 50],
            averageFocus: 0.82
          },
          cognitiveLoad: 0.68,
          memoryEncodingStrength: 0.94,
          learningStyleUsed: {
            visual: 0.90,
            auditory: 0.70,
            kinesthetic: 0.30
          },
          sessionTimeline: {
            events: [
              { timestamp: 0, event: 'Session Start', description: 'Began World War II overview', type: 'activity', importance: 1 },
              { timestamp: 10, event: 'Breakthrough', description: 'Connected causes to previous war', type: 'breakthrough', importance: 3 },
              { timestamp: 25, event: 'Milestone', description: 'Mastered timeline of major events', type: 'milestone', importance: 2 },
              { timestamp: 40, event: 'Breakthrough', description: 'Understood Holocaust significance', type: 'breakthrough', importance: 3 },
              { timestamp: 55, event: 'Milestone', description: 'Analyzed war consequences', type: 'milestone', importance: 2 },
              { timestamp: 60, event: 'Session End', description: 'Session completed with high comprehension', type: 'activity', importance: 1 }
            ]
          },
          milestones: [
            { timestamp: 25, description: 'Mastered timeline of major events', impact: 'high' },
            { timestamp: 55, description: 'Analyzed war consequences', impact: 'medium' }
          ],
          breakthroughs: [
            { timestamp: 10, description: 'Connected causes to previous war', type: 'breakthrough', importance: 3 },
            { timestamp: 40, description: 'Understood Holocaust significance', type: 'breakthrough', importance: 3 }
          ],
          struggles: [],
          aiInsights: {
            learningPattern: 'Visual and auditory learner with strong analytical skills',
            strengths: ['Historical analysis', 'Pattern recognition', 'Critical thinking'],
            weaknesses: ['Memorization', 'Date recall'],
            recommendations: ['Use visual timelines', 'Create memory aids', 'Practice chronological ordering']
          },
          improvementSuggestions: [
            'Create visual timeline for better retention',
            'Practice memorizing key dates',
            'Connect events to broader historical themes'
          ],
          knowledgeGaps: [
            'Specific battle details',
            'Economic impact analysis'
          ],
          startedAt: '2024-01-19T14:00:00Z',
          completedAt: '2024-01-19T15:00:00Z',
          createdAt: '2024-01-19T14:00:00Z'
        },
        {
          id: 'session-3',
          sessionName: 'Science Lab Practice',
          sessionType: 'practice',
          subjectArea: 'science',
          topic: 'lab safety',
          durationMinutes: 30,
          contentSummary: 'Hands-on practice with laboratory safety procedures and equipment handling.',
          keyConcepts: ['safety protocols', 'equipment handling', 'emergency procedures', 'chemical storage'],
          learningObjectives: ['Master safety procedures', 'Handle equipment properly', 'Respond to emergencies'],
          materialsUsed: ['safety manual', 'lab equipment', 'practice scenarios'],
          performanceScore: 94.8,
          engagementLevel: 95.2,
          difficultyRating: 4.2,
          comprehensionLevel: 96.1,
          attentionPatterns: {
            focusPeaks: [5, 15, 25],
            attentionDrops: [10, 20],
            averageFocus: 0.95
          },
          cognitiveLoad: 0.45,
          memoryEncodingStrength: 0.97,
          learningStyleUsed: {
            visual: 0.60,
            auditory: 0.40,
            kinesthetic: 0.95
          },
          sessionTimeline: {
            events: [
              { timestamp: 0, event: 'Session Start', description: 'Began safety protocol review', type: 'activity', importance: 1 },
              { timestamp: 5, event: 'Milestone', description: 'Mastered basic safety procedures', type: 'milestone', importance: 2 },
              { timestamp: 15, event: 'Breakthrough', description: 'Confidently handled all equipment', type: 'breakthrough', importance: 3 },
              { timestamp: 25, event: 'Milestone', description: 'Completed emergency drill perfectly', type: 'milestone', importance: 2 },
              { timestamp: 30, event: 'Session End', description: 'Achieved perfect safety score', type: 'activity', importance: 1 }
            ]
          },
          milestones: [
            { timestamp: 5, description: 'Mastered basic safety procedures', impact: 'high' },
            { timestamp: 25, description: 'Completed emergency drill perfectly', impact: 'high' }
          ],
          breakthroughs: [
            { timestamp: 15, description: 'Confidently handled all equipment', impact: 'high' }
          ],
          struggles: [],
          aiInsights: {
            learningPattern: 'Kinesthetic learner with excellent practical skills',
            strengths: ['Hands-on learning', 'Safety awareness', 'Attention to detail'],
            weaknesses: ['Theoretical understanding', 'Written procedures'],
            recommendations: ['Combine theory with practice', 'Use visual checklists', 'Practice written procedures']
          },
          improvementSuggestions: [
            'Review written safety protocols',
            'Practice emergency response procedures',
            'Study chemical properties and hazards'
          ],
          knowledgeGaps: [
            'Chemical reaction theory',
            'Advanced equipment operation'
          ],
          startedAt: '2024-01-18T16:00:00Z',
          completedAt: '2024-01-18T16:30:00Z',
          createdAt: '2024-01-18T16:00:00Z'
        }
      ]

      setSessions(mockSessions)
    } catch (error) {
      console.error('Failed to load memory replay data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSessions = () => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subjectArea.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(session => session.sessionType === filterType)
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(session => session.subjectArea === filterSubject)
    }

    setFilteredSessions(filtered)
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="w-5 h-5" />
      case 'quiz': return <Target className="w-5 h-5" />
      case 'lesson': return <Brain className="w-5 h-5" />
      case 'practice': return <Zap className="w-5 h-5" />
      case 'review': return <RefreshCw className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'quiz': return 'text-green-600 bg-green-50 border-green-200'
      case 'lesson': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'practice': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'review': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-4 h-4 text-green-600" />
      case 'breakthrough': return <Lightbulb className="w-4 h-4 text-yellow-600" />
      case 'struggle': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'activity': return <Clock className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60)
    const seconds = timestamp % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading memory replay sessions...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
            <Play className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Memory Replay Tool</h1>
            <p className="text-gray-600">Revisit any past learning session as a timeline of growth</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="study">Study</option>
            <option value="quiz">Quiz</option>
            <option value="lesson">Lesson</option>
            <option value="practice">Practice</option>
            <option value="review">Review</option>
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="history">History</option>
            <option value="science">Science</option>
            <option value="programming">Programming</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'timeline', label: 'Learning Timeline', icon: Calendar },
              { id: 'sessions', label: 'All Sessions', icon: Play },
              { id: 'insights', label: 'Growth Insights', icon: TrendingUp }
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
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Learning Timeline</h2>
          
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {filteredSessions.map((session, index) => (
              <div key={session.id} className="relative flex items-start space-x-4 mb-8">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                     onClick={() => setSelectedSession(session)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.sessionName}</h3>
                      <p className="text-sm text-gray-600">{session.subjectArea} • {session.topic}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{new Date(session.startedAt).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{formatDuration(session.durationMinutes)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{session.performanceScore}%</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{session.engagementLevel}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{session.comprehensionLevel}%</div>
                      <div className="text-xs text-gray-500">Comprehension</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{session.difficultyRating}/10</div>
                      <div className="text-xs text-gray-500">Difficulty</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{session.milestones.length} milestones</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Lightbulb className="w-4 h-4" />
                        <span>{session.breakthroughs.length} breakthroughs</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{session.struggles.length} struggles</span>
                      </span>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Replay Session →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">All Sessions ({filteredSessions.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div key={session.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                   onClick={() => setSelectedSession(session)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${getSessionTypeColor(session.sessionType)}`}>
                      {getSessionTypeIcon(session.sessionType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.sessionName}</h3>
                      <p className="text-sm text-gray-600 capitalize">{session.sessionType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{formatDuration(session.durationMinutes)}</div>
                    <div className="text-sm text-gray-500">{new Date(session.startedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{session.contentSummary}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Performance</span>
                    <span className="font-medium text-green-600">{session.performanceScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Engagement</span>
                    <span className="font-medium text-blue-600">{session.engagementLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Comprehension</span>
                    <span className="font-medium text-purple-600">{session.comprehensionLevel}%</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{session.subjectArea}</span>
                    <span>{session.topic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Growth Insights</h2>
          
          {/* Learning Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Patterns</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average Focus Duration</span>
                    <span className="font-medium">42 minutes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Peak Learning Time</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Preferred Learning Style</span>
                    <span className="font-medium">Visual (85%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average Performance</span>
                    <span className="font-medium text-green-600">91.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '91.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Engagement Level</span>
                    <span className="font-medium text-blue-600">92.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92.1%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Comprehension Rate</span>
                    <span className="font-medium text-purple-600">93.0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '93.0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['mathematics', 'history', 'science', 'programming'].map((subject) => {
                const subjectSessions = sessions.filter(s => s.subjectArea === subject)
                const avgPerformance = subjectSessions.length > 0 
                  ? subjectSessions.reduce((sum, s) => sum + s.performanceScore, 0) / subjectSessions.length 
                  : 0
                
                return (
                  <div key={subject} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{avgPerformance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600 capitalize">{subject}</div>
                    <div className="text-xs text-gray-500">{subjectSessions.length} sessions</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSession.sessionName}</h2>
                  <p className="text-gray-600">{selectedSession.subjectArea} • {selectedSession.topic}</p>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>

              {/* Session Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedSession.performanceScore}%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedSession.engagementLevel}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedSession.comprehensionLevel}%</div>
                  <div className="text-sm text-gray-600">Comprehension</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedSession.difficultyRating}/10</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Timeline</h3>
                <div className="space-y-3">
                  {selectedSession.sessionTimeline.events.map((event: TimelineEvent, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{event.event}</span>
                          <span className="text-sm text-gray-500">{formatTimestamp(event.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Concepts and Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.keyConcepts.map((concept, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Learning Pattern: </span>
                      <span className="text-gray-600">{selectedSession.aiInsights.learningPattern}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Strengths: </span>
                      <span className="text-gray-600">{selectedSession.aiInsights.strengths.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Weaknesses: </span>
                      <span className="text-gray-600">{selectedSession.aiInsights.weaknesses.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {selectedSession.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-blue-500 mt-1" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}