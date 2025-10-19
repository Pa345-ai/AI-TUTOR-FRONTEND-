import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      category: "🧠 Ultra-Intelligent Learning Engine",
      items: [
        { name: "Personalized Learning Paths", desc: "AI generates custom learning journeys", icon: "🎯" },
        { name: "Adaptive Difficulty", desc: "Adjusts based on your performance", icon: "⚡" },
        { name: "Knowledge Graph Mapping", desc: "Visual mapping of your strengths/weaknesses", icon: "🧩" },
        { name: "Real-Time Multi-Modal Support", desc: "Text, voice, drawing, and code learning", icon: "🎨" },
        { name: "Memory & Long-Term Context", desc: "Remembers your learning history", icon: "🧠" }
      ]
    },
    {
      category: "💝 Human-Like Interaction Layer",
      items: [
        { name: "AI Voice Tutor", desc: "Speech + text tutoring with emotion", icon: "🎙️" },
        { name: "Emotion Recognition", desc: "Detects and reacts to your feelings", icon: "😊" },
        { name: "Tutor Personalities", desc: "Socratic, Friendly, Exam, Motivational", icon: "👨‍🏫" },
        { name: "ChatGPT-Quality Responses", desc: "Sophisticated, context-aware AI", icon: "✨" }
      ]
    },
    {
      category: "📚 Immersive Learning Tools",
      items: [
        { name: "Note Summarizer", desc: "Summarizes PDFs and text files", icon: "📝" },
        { name: "Quiz Generator", desc: "Creates intelligent assessments", icon: "🧩" },
        { name: "Lesson Builder", desc: "Builds structured learning content", icon: "📖" },
        { name: "Flashcard Creator", desc: "AI-powered spaced repetition", icon: "🃏" },
        { name: "Gamification", desc: "XP, badges, streaks, leaderboards", icon: "🎮" }
      ]
    },
    {
      category: "💎 Premium Differentiators",
      items: [
        { name: "Offline Mode", desc: "AI works with cached results", icon: "📱" },
        { name: "Collaborative Rooms", desc: "Group sessions with AI", icon: "👥" },
        { name: "ELI5 / Expert Toggle", desc: "Adjustable explanation depth", icon: "🎚️" },
        { name: "Career & Goal Advisor", desc: "Suggests subjects and careers", icon: "🎯" },
        { name: "Homework Feedback", desc: "Evaluates essays and answers", icon: "📝" },
        { name: "Multi-Language Tutor", desc: "Real-time translation support", icon: "🌍" }
      ]
    },
    {
      category: "🧩 Billion-Dollar Ecosystem Features",
      items: [
        { name: "Meta-Learning Core", desc: "Self-teaching AI that improves", icon: "🚀" },
        { name: "NeuroVerse", desc: "VR/AR environment with AI avatars", icon: "🥽" },
        { name: "AI Ecosystem SDK", desc: "Developer plugin architecture", icon: "🛠️" },
        { name: "Cognitive Digital Twin", desc: "Predictive model per learner", icon: "👤" },
        { name: "Cross-Domain Apps", desc: "Code, Health, Business tutors", icon: "🌐" },
        { name: "Tokenized Learning", desc: "Learn-to-Earn credits system", icon: "💰" },
        { name: "Ethical AI Layer", desc: "Transparent AI reasoning logs", icon: "🔒" }
      ]
    }
  ]

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
        <div className="text-center mb-20">
          <h1 className="text-7xl font-bold text-gray-900 mb-6">
            🧠 OmniMind AI Tutor
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Super-Intelligent AI tutoring platform with <strong>30+ advanced features</strong> that adapts to your learning style, 
            understands your emotions, and creates personalized learning journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-lg">
                Start Learning Now
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg text-xl border-2 border-blue-600 transition-colors shadow-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((feature, featureIndex) => (
                  <div key={featureIndex} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.name}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Backend Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">🚀 Backend Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✅</div>
              <p className="font-medium text-lg">Database Schema</p>
              <p className="text-sm text-gray-600">18+ tables with RLS</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✅</div>
              <p className="font-medium text-lg">Edge Functions</p>
              <p className="text-sm text-gray-600">8 AI functions deployed</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✅</div>
              <p className="font-medium text-lg">Security</p>
              <p className="text-sm text-gray-600">Audit logs & monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✅</div>
              <p className="font-medium text-lg">AI Integration</p>
              <p className="text-sm text-gray-600">OpenAI GPT models</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-16 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">🛠️ Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">⚛️</div>
              <div className="font-semibold">Next.js + React</div>
              <div className="text-sm opacity-90">Frontend Framework</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🗄️</div>
              <div className="font-semibold">Supabase</div>
              <div className="text-sm opacity-90">Database & Auth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <div className="font-semibold">OpenAI GPT</div>
              <div className="text-sm opacity-90">AI Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-semibold">Vercel</div>
              <div className="text-sm opacity-90">Deployment</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-12 text-white mt-16">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners using AI-powered education to achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors shadow-lg">
                Get Started Now
              </button>
            </Link>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-white hover:text-green-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl font-bold mb-4">🧠 OmniMind AI Tutor</div>
          <p className="text-gray-400 mb-6">
            Super-Intelligent AI tutoring platform with 30+ advanced features
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>Powered by Next.js</span>
            <span>•</span>
            <span>Supabase</span>
            <span>•</span>
            <span>OpenAI</span>
            <span>•</span>
            <span>Vercel</span>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            &copy; 2024 OmniMind AI Tutor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
