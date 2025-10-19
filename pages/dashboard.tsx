import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useOmniMind } from '../hooks/useOmniMind'
import { EmotionalTutor } from '../components/ai/EmotionalTutor'
import { QuizGenerator } from '../components/ai/QuizGenerator'
import { LearningPaths } from '../components/features/LearningPaths'
import { KnowledgeGraph } from '../components/features/KnowledgeGraph'
import { Gamification } from '../components/features/Gamification'
import { VREnvironments } from '../components/features/VREnvironments'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const userId = '550e8400-e29b-41d4-a716-446655440001' // Demo user ID
  
  const {
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
    loading,
    error
  } = useOmniMind(userId)

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'ai-tutor', name: 'AI Tutor', icon: '🤖' },
    { id: 'knowledge', name: 'Knowledge', icon: '🧩' },
    { id: 'gamification', name: 'Gamification', icon: '🎮' },
    { id: 'vr', name: 'VR Learning', icon: '🥽' },
    { id: 'tokens', name: 'Tokens', icon: '💰' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'developer', name: 'Developer', icon: '🛠️' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OmniMind AI Tutor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - OmniMind AI Tutor</title>
        <meta name="description" content="Your personalized AI learning dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">🧠 OmniMind AI Tutor</h1>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                All Systems Active
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Learner!</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="text-3xl text-blue-600">📚</div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{learningPaths.length}</div>
                      <div className="text-sm text-gray-600">Learning Paths</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="text-3xl text-green-600">🤖</div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{aiSessions.length}</div>
                      <div className="text-sm text-gray-600">AI Sessions</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="text-3xl text-purple-600">🎮</div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{gamification?.level || 0}</div>
                      <div className="text-sm text-gray-600">Current Level</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="text-3xl text-orange-600">💰</div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{tokens.length}</div>
                      <div className="text-sm text-gray-600">Token Transactions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">🚀 Recent AI Sessions</h3>
                  {aiSessions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSessions.slice(0, 3).map((session, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-800 line-clamp-2">{session.user_input}</p>
                              <p className="text-xs text-gray-500 mt-1">{session.subject} • {session.session_type}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(session.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No AI sessions yet</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">🔒 Security Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Status</span>
                      <span className="text-sm text-green-600 font-medium">Secure</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Audit Logs</span>
                      <span className="text-sm text-blue-600 font-medium">{auditLogs.length} entries</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Security Events</span>
                      <span className="text-sm text-orange-600 font-medium">{securityEvents.length} events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">RLS Policies</span>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('ai-tutor')}
                    className="bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">🤖</div>
                    <div className="text-sm font-medium">AI Tutor</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('learning')}
                    className="bg-white text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">📚</div>
                    <div className="text-sm font-medium">Learning Paths</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('knowledge')}
                    className="bg-white text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">🧩</div>
                    <div className="text-sm font-medium">Knowledge Graph</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('vr')}
                    className="bg-white text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">🥽</div>
                    <div className="text-sm font-medium">VR Learning</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && <LearningPaths userId={userId} />}
          {activeTab === 'ai-tutor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmotionalTutor userId={userId} />
              <QuizGenerator userId={userId} />
            </div>
          )}
          {activeTab === 'knowledge' && <KnowledgeGraph userId={userId} />}
          {activeTab === 'gamification' && <Gamification userId={userId} />}
          {activeTab === 'vr' && <VREnvironments userId={userId} />}
          
          {activeTab === 'tokens' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">💰 Token Economy</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Learn-to-Earn System</h4>
                <p className="text-gray-600 mb-4">Earn tokens for learning achievements and spend them on premium features!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-medium">Earn Tokens</div>
                    <div className="text-sm text-gray-600">Complete lessons, quizzes, and challenges</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="font-medium">Spend Tokens</div>
                    <div className="text-sm text-gray-600">Unlock premium content and features</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="font-medium">Trade Tokens</div>
                    <div className="text-sm text-gray-600">Exchange with other learners</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🔒 Security & Privacy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Security Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✅ Row Level Security (RLS) enabled</li>
                      <li>✅ End-to-end encryption</li>
                      <li>✅ GDPR compliance</li>
                      <li>✅ Audit logging</li>
                      <li>✅ Threat detection</li>
                      <li>✅ Data anonymization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Privacy Controls</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✅ Data export rights</li>
                      <li>✅ Right to deletion</li>
                      <li>✅ Consent management</li>
                      <li>✅ Transparent AI reasoning</li>
                      <li>✅ Fairness monitoring</li>
                      <li>✅ Zero-knowledge learning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🛠️ Developer Tools</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛠️</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Developer API & SDK</h4>
                <p className="text-gray-600 mb-4">Build amazing learning applications with our comprehensive API!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔌</div>
                    <div className="font-medium">REST API</div>
                    <div className="text-sm text-gray-600">Full access to all features</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-medium">Mobile SDK</div>
                    <div className="text-sm text-gray-600">iOS and Android support</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📊 Learning Analytics</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics Dashboard</h4>
                <p className="text-gray-600 mb-4">Track your learning progress with detailed insights and recommendations!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-medium">Progress Tracking</div>
                    <div className="text-sm text-gray-600">Visualize your learning journey</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-medium">Performance Insights</div>
                    <div className="text-sm text-gray-600">AI-powered recommendations</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔮</div>
                    <div className="font-medium">Predictive Analytics</div>
                    <div className="text-sm text-gray-600">Forecast learning outcomes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
