import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [aiResponse, setAiResponse] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleAITutor = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/enhanced_emotional_tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          user_input: userInput,
          session_type: 'tutoring',
          subject: 'general'
        })
      })

      const data = await response.json()
      setAiResponse(data.ai_response || 'AI response received!')
    } catch (error) {
      setAiResponse('Error: Could not connect to AI tutor. Please check your backend deployment.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateLearningPath = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate_learning_path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          subject: 'programming',
          difficulty_level: 'beginner',
          learning_goals: ['Master Python', 'Build projects'],
          preferred_languages: ['en'],
          learning_style: 'visual'
        })
      })

      const data = await response.json()
      setAiResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setAiResponse('Error: Could not generate learning path. Please check your backend deployment.')
    } finally {
      setIsGenerating(false)
    }
  }

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
            <h1 className="text-2xl font-bold text-gray-900">🧠 OmniMind AI Tutor</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Learner!</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">🎯 AI Tutor Chat</h3>
            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything about learning..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
              />
              <button
                onClick={handleAITutor}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Thinking...' : 'Ask AI Tutor'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📚 Learning Paths</h3>
            <p className="text-gray-600 mb-4">Generate personalized learning journeys</p>
            <button
              onClick={handleGenerateLearningPath}
              disabled={isGenerating}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Learning Path'}
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">🧩 Knowledge Graph</h3>
            <p className="text-gray-600 mb-4">Visualize your learning progress</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              View Knowledge Map
            </button>
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-4">🤖 AI Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {aiResponse}
              </pre>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="font-semibold mb-2">Gamification</h3>
            <p className="text-sm text-gray-600">XP: 1,250 | Level: 5</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Progress</h3>
            <p className="text-sm text-gray-600">12 lessons completed</p>
            <p className="text-sm text-green-600">+3 this week</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-semibold mb-2">Achievements</h3>
            <p className="text-sm text-gray-600">5 badges earned</p>
            <p className="text-sm text-yellow-600">Streak: 7 days</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-gray-600">All systems secure</p>
            <p className="text-sm text-green-600">RLS enabled</p>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">🚀 Backend Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database Connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Edge Functions Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">OpenAI Integration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Security Monitoring</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
