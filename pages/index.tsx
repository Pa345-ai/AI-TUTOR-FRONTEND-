import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>OmniMind AI Tutor - Super-Intelligent Learning Platform</title>
        <meta name="description" content="Transform education with AI-powered personalized learning, emotional intelligence, and immersive tutoring experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🧠 OmniMind AI Tutor
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Super-Intelligent AI tutoring platform that adapts to your learning style, 
            understands your emotions, and creates personalized learning journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                Start Learning
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg border-2 border-blue-600 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
            <p className="text-gray-600">
              AI generates custom learning paths based on your goals, learning style, and progress.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-semibold mb-2">Emotional Intelligence</h3>
            <p className="text-gray-600">
              ChatGPT-quality AI that understands your emotions and adapts its teaching approach.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold mb-2">Knowledge Graphs</h3>
            <p className="text-gray-600">
              Visual mapping of your knowledge with adaptive difficulty and gap identification.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Gamification</h3>
            <p className="text-gray-600">
              XP, badges, streaks, and leaderboards to make learning engaging and fun.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-gray-600">
              Row-level security, audit logging, and compliance with GDPR and privacy standards.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Meta-Learning</h3>
            <p className="text-gray-600">
              AI that learns and improves from every interaction, becoming smarter over time.
            </p>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center">🚀 Backend Status</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="font-medium">Database Schema</p>
              <p className="text-sm text-gray-600">18+ tables with RLS</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="font-medium">Edge Functions</p>
              <p className="text-sm text-gray-600">8 AI functions deployed</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="font-medium">Security</p>
              <p className="text-sm text-gray-600">Audit logs & monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="font-medium">AI Integration</p>
              <p className="text-sm text-gray-600">OpenAI GPT models</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-6">
            Join thousands of learners using AI-powered education to achieve their goals.
          </p>
          <Link href="/dashboard">
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 OmniMind AI Tutor. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by Next.js, Supabase, and OpenAI
          </p>
        </div>
      </footer>
    </div>
  )
}
