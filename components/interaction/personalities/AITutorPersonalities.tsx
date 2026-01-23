import React, { useState } from 'react'

interface AITutorPersonalitiesProps {
  userId: string
}

interface Personality {
  id: string
  name: string
  description: string
  icon: string
  color: string
  characteristics: string[]
  exampleResponses: string[]
  teachingStyle: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  personality: string
}

export const AITutorPersonalities: React.FC<AITutorPersonalitiesProps> = ({ userId }) => {
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const personalities: Personality[] = [
    {
      id: 'socratic',
      name: 'Socrates',
      description: 'Asks guiding questions to help you discover answers yourself',
      icon: '🤔',
      color: 'blue',
      characteristics: [
        'Asks thought-provoking questions',
        'Guides you to find your own answers',
        'Challenges your assumptions',
        'Encourages critical thinking'
      ],
      exampleResponses: [
        "What do you think would happen if...?",
        "Why do you believe that to be true?",
        "Can you think of an example where this might not apply?",
        "What evidence supports your conclusion?"
      ],
      teachingStyle: 'Question-based learning that encourages self-discovery'
    },
    {
      id: 'friendly',
      name: 'Friendly Mentor',
      description: 'Warm, encouraging, and patient with gentle explanations',
      icon: '😊',
      color: 'green',
      characteristics: [
        'Warm and encouraging tone',
        'Patient with mistakes',
        'Uses simple explanations',
        'Celebrates small victories'
      ],
      exampleResponses: [
        "That's a great start! Let me help you understand this better...",
        "Don't worry, everyone finds this challenging at first!",
        "You're doing really well! Let's build on what you know...",
        "I'm proud of your progress! Keep going!"
      ],
      teachingStyle: 'Supportive and encouraging with gentle guidance'
    },
    {
      id: 'exam',
      name: 'Exam Coach',
      description: 'Strict, focused, and prepares you for high-stakes testing',
      icon: '📝',
      color: 'red',
      characteristics: [
        'Direct and to the point',
        'Focuses on exam techniques',
        'Emphasizes accuracy and speed',
        'Provides structured practice'
      ],
      exampleResponses: [
        "This is a common exam question. Here's the systematic approach...",
        "Time management is crucial. You have 2 minutes per question.",
        "Let's practice this type of problem until it's automatic.",
        "Remember the key formulas and apply them consistently."
      ],
      teachingStyle: 'Rigorous preparation focused on exam success'
    },
    {
      id: 'motivational',
      name: 'Motivational Coach',
      description: 'Inspiring and energetic, focuses on building confidence',
      icon: '💪',
      color: 'purple',
      characteristics: [
        'High energy and enthusiasm',
        'Focuses on building confidence',
        'Uses motivational language',
        'Celebrates achievements'
      ],
      exampleResponses: [
        "You've got this! I believe in your ability to master this!",
        "Every expert was once a beginner. You're on the right path!",
        "That's the spirit! Keep pushing forward!",
        "You're not just learning, you're growing stronger every day!"
      ],
      teachingStyle: 'High-energy motivation that builds confidence and persistence'
    },
    {
      id: 'technical',
      name: 'Technical Expert',
      description: 'Precise, detailed, and focuses on accuracy and depth',
      icon: '🔬',
      color: 'indigo',
      characteristics: [
        'Provides detailed explanations',
        'Uses precise terminology',
        'Focuses on accuracy',
        'Explains underlying principles'
      ],
      exampleResponses: [
        "Let me break down the mathematical principles behind this...",
        "The technical term for this concept is...",
        "Here's the precise methodology you should follow...",
        "Let's examine the underlying mechanism in detail..."
      ],
      teachingStyle: 'Detailed technical explanations with precision and depth'
    },
    {
      id: 'creative',
      name: 'Creative Guide',
      description: 'Uses analogies, stories, and creative approaches to explain concepts',
      icon: '🎨',
      color: 'pink',
      characteristics: [
        'Uses creative analogies',
        'Tells engaging stories',
        'Makes learning fun',
        'Connects to real-world examples'
      ],
      exampleResponses: [
        "Imagine this concept as a recipe...",
        "Let me tell you a story that illustrates this idea...",
        "Think of it like building with LEGO blocks...",
        "Here's a fun way to remember this..."
      ],
      teachingStyle: 'Creative and engaging explanations using analogies and stories'
    }
  ]

  const handlePersonalitySelect = (personality: Personality) => {
    setSelectedPersonality(personality)
    setMessages([])
    
    // Add welcome message from selected personality
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: getPersonalityWelcome(personality),
      timestamp: new Date(),
      personality: personality.name
    }
    setMessages([welcomeMessage])
  }

  const getPersonalityWelcome = (personality: Personality): string => {
    const welcomes = {
      socratic: "Hello! I'm Socrates, and I believe the best learning happens when you discover answers yourself. What would you like to explore today?",
      friendly: "Hi there! I'm your friendly mentor, and I'm here to support you every step of the way. What can I help you learn today?",
      exam: "Greetings. I'm your exam coach, and I'm here to prepare you for success. What subject would you like to master?",
      motivational: "Hey there, champion! I'm your motivational coach, and I'm here to help you achieve greatness! What's your learning goal today?",
      technical: "Good day. I'm your technical expert, and I'm here to provide you with precise, detailed explanations. What technical concept shall we explore?",
      creative: "Hello, creative learner! I'm your creative guide, and I love making learning fun and memorable. What adventure shall we embark on today?"
    }
    return welcomes[personality.id as keyof typeof welcomes] || "Hello! How can I help you learn today?"
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || !selectedPersonality) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date(),
      personality: selectedPersonality.name
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsTyping(true)

    // Simulate AI response based on personality
    setTimeout(() => {
      const aiResponse = generatePersonalityResponse(userInput, selectedPersonality)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        personality: selectedPersonality.name
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generatePersonalityResponse = (userInput: string, personality: Personality): string => {
    // Simple response generation based on personality
    const responses = {
      socratic: [
        "That's an interesting perspective. What makes you think that?",
        "Let me ask you this: what if the opposite were true?",
        "Can you think of a situation where this might not work?",
        "What evidence would convince you otherwise?",
        "How would you test this hypothesis?"
      ],
      friendly: [
        "That's a wonderful question! Let me help you understand this step by step...",
        "I love your curiosity! Here's what I think you should know...",
        "Great thinking! You're on the right track. Let me add...",
        "Don't worry if this seems confusing at first. Here's a simpler way to look at it...",
        "You're doing so well! Let's build on what you already know..."
      ],
      exam: [
        "This is a critical concept for your exam. Here's the systematic approach...",
        "For exam purposes, you need to remember these key points...",
        "Let's practice this until it becomes second nature...",
        "Time is crucial in exams. Here's the fastest way to solve this...",
        "This type of question appears frequently. Here's the pattern to recognize..."
      ],
      motivational: [
        "You're absolutely crushing it! Here's how to take it to the next level...",
        "That's the kind of thinking that leads to success! Let me show you more...",
        "You're not just learning, you're becoming unstoppable! Here's what's next...",
        "I'm so proud of your progress! Let's keep this momentum going...",
        "You've got the power to master anything! Here's your next challenge..."
      ],
      technical: [
        "From a technical standpoint, the precise definition is...",
        "The underlying mechanism involves several key components...",
        "Let me provide you with the exact specifications...",
        "The mathematical foundation of this concept is...",
        "Here's the detailed methodology you should follow..."
      ],
      creative: [
        "Let me paint you a picture of this concept...",
        "Imagine this as a magical journey where...",
        "Here's a fun story that will help you remember...",
        "Think of it like a recipe for success...",
        "Let's turn this into an adventure where you're the hero..."
      ]
    }

    const personalityResponses = responses[personality.id as keyof typeof responses] || responses.friendly
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)]
  }

  const getPersonalityColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600'
    }
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getPersonalityBorderColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200',
      green: 'border-green-200',
      red: 'border-red-200',
      purple: 'border-purple-200',
      indigo: 'border-indigo-200',
      pink: 'border-pink-200'
    }
    return colors[color as keyof typeof colors] || 'border-gray-200'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎭 AI Tutor Personalities</h2>
        <p className="text-purple-100">Choose your perfect learning companion - each with a unique teaching style!</p>
      </div>

      {/* Personality Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Your AI Tutor Personality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalities.map((personality) => (
            <button
              key={personality.id}
              onClick={() => handlePersonalitySelect(personality)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-lg ${
                selectedPersonality?.id === personality.id
                  ? `border-${personality.color}-500 bg-${personality.color}-50`
                  : `border-gray-200 hover:border-${personality.color}-300`
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{personality.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{personality.name}</h4>
                  <p className="text-sm text-gray-600">{personality.description}</p>
                </div>
              </div>
              <div className="space-y-1">
                {personality.characteristics.slice(0, 2).map((char, index) => (
                  <p key={index} className="text-xs text-gray-600">• {char}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Personality Details */}
      {selectedPersonality && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl">{selectedPersonality.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{selectedPersonality.name}</h3>
              <p className="text-gray-600">{selectedPersonality.teachingStyle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Characteristics</h4>
              <ul className="space-y-1">
                {selectedPersonality.characteristics.map((char, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Example Responses</h4>
              <div className="space-y-2">
                {selectedPersonality.exampleResponses.slice(0, 3).map((response, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    "{response}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {selectedPersonality && (
        <div className="bg-white rounded-lg shadow-lg">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : `bg-${selectedPersonality.color}-100 text-${selectedPersonality.color}-800`
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.type === 'user' ? 'You' : selectedPersonality.name}
                    </span>
                    {message.type === 'ai' && (
                      <span className="text-xs opacity-75">{selectedPersonality.icon}</span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-${selectedPersonality.color}-100 text-${selectedPersonality.color}-800`}>
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">{selectedPersonality.name} is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-gray-50 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask ${selectedPersonality.name} anything...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isTyping}
                className={`px-4 py-2 bg-gradient-to-r ${getPersonalityColor(selectedPersonality.color)} text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Examples */}
      {selectedPersonality && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">💡 Try These Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Explain this concept to me",
              "I'm struggling with this topic",
              "Give me a practice problem",
              "How can I improve my understanding?",
              "What should I focus on next?",
              "Can you give me an example?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserInput(question)
                  handleSendMessage()
                }}
                disabled={isTyping}
                className={`p-3 text-sm bg-${selectedPersonality.color}-50 text-${selectedPersonality.color}-700 rounded-lg hover:bg-${selectedPersonality.color}-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}