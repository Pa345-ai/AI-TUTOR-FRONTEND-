import React, { useState, useEffect, useRef } from 'react'

interface VoiceTutorProps {
  userId: string
}

interface VoiceMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isVoice?: boolean
  audioUrl?: string
}

export const VoiceTutor: React.FC<VoiceTutorProps> = ({ userId }) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'alloy',
    speed: 1.0,
    pitch: 1.0
  })
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setCurrentTranscript('')
      }

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setCurrentTranscript(interimTranscript)
        
        if (finalTranscript) {
          handleUserMessage(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      // Set up voice options
      const voices = speechSynthesis.getVoices()
      console.log('Available voices:', voices)
    }

    // Add welcome message
    addMessage({
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI voice tutor. You can speak to me naturally, and I'll respond with both text and voice. Try asking me a question!",
      timestamp: new Date()
    })

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (message: Omit<VoiceMessage, 'id'>) => {
    const newMessage: VoiceMessage = {
      ...message,
      id: Date.now().toString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleUserMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    addMessage({
      type: 'user',
      content,
      timestamp: new Date(),
      isVoice: true
    })

    setCurrentTranscript('')
    setIsProcessing(true)

    try {
      // Simulate AI processing and response
      const aiResponse = await generateAIResponse(content)
      
      // Add AI response
      addMessage({
        type: 'ai',
        content: aiResponse.text,
        timestamp: new Date()
      })

      // Speak the response
      speakText(aiResponse.text)
      
    } catch (error) {
      console.error('Error processing message:', error)
      addMessage({
        type: 'ai',
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        timestamp: new Date()
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = async (userInput: string): Promise<{ text: string }> => {
    // Simulate API call to AI tutor
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me explain that concept step by step...",
          "I understand what you're asking. Here's how I would approach this problem...",
          "Excellent! You're thinking about this correctly. Let me add some additional insights...",
          "That's a common question. The key is to remember that...",
          "I can see you're working through this systematically. Here's what I think..."
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        resolve({ text: randomResponse })
      }, 1500)
    })
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel() // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = voiceSettings.speed
      utterance.pitch = voiceSettings.pitch
      
      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(voiceSettings.voice) ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('natural')
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        setIsSpeaking(false)
      }
      
      synthesisRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    addMessage({
      type: 'ai',
      content: "Conversation cleared! How can I help you learn today?",
      timestamp: new Date()
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎙️ AI Voice Tutor</h2>
        <p className="text-green-100">Speak naturally with your AI tutor - no typing required!</p>
      </div>

      {/* Voice Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🎛️ Voice Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
            <select
              value={voiceSettings.voice}
              onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alloy">Alloy (Neutral)</option>
              <option value="echo">Echo (Male)</option>
              <option value="fable">Fable (Female)</option>
              <option value="onyx">Onyx (Male)</option>
              <option value="nova">Nova (Female)</option>
              <option value="shimmer">Shimmer (Female)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speed: {voiceSettings.speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.speed}
              onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pitch: {voiceSettings.pitch}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseFloat(e.target.value)})}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
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
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.type === 'user' ? 'You' : 'AI Tutor'}
                  </span>
                  {message.isVoice && (
                    <span className="text-xs opacity-75">🎤</span>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {/* Current transcript */}
          {currentTranscript && (
            <div className="flex justify-end">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-100 text-blue-800">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">You</span>
                  <span className="text-xs opacity-75">🎤 Listening...</span>
                </div>
                <p className="text-sm italic">{currentTranscript}</p>
              </div>
            </div>
          )}
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="border-t p-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? '🛑 Stop Listening' : '🎤 Start Speaking'}
              </button>
              
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  🔇 Stop Speaking
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearConversation}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              {isListening ? 'Speak now...' : 'Click the microphone to start speaking'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">💡 Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Explain this concept",
            "Give me an example",
            "Help me solve this",
            "What should I study next?",
            "I'm confused about...",
            "Show me the steps",
            "Test my knowledge",
            "Give me a hint"
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => handleUserMessage(action)}
              disabled={isListening || isProcessing}
              className="p-3 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Status */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">🎵 Voice Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700">
              {isListening ? 'Listening...' : 'Not listening'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700">
              {isSpeaking ? 'Speaking...' : 'Not speaking'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700">
              {isProcessing ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}