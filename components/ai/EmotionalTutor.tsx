import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Smile, Frown, Meh, MessageCircle, Send } from 'lucide-react'

interface EmotionalTutorProps {
  onEmotionDetected?: (emotion: string) => void
  onResponse?: (response: string) => void
}

export default function EmotionalTutor({ onEmotionDetected, onResponse }: EmotionalTutorProps) {
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral')
  const [message, setMessage] = useState('')
  const [responses, setResponses] = useState<Array<{ type: 'user' | 'ai', content: string, emotion?: string }>>([])
  const [isTyping, setIsTyping] = useState(false)

  const emotions = [
    { id: 'happy', icon: Smile, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    { id: 'sad', icon: Frown, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { id: 'neutral', icon: Meh, color: 'text-gray-400', bg: 'bg-gray-400/20' },
    { id: 'excited', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/20' }
  ]

  const handleEmotionSelect = (emotion: string) => {
    setCurrentEmotion(emotion)
    onEmotionDetected?.(emotion)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { type: 'user' as const, content: message, emotion: currentEmotion }
    setResponses(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    try {
      // Simulate AI response based on emotion
      const response = await generateEmotionalResponse(message, currentEmotion)
      const aiMessage = { type: 'ai' as const, content: response, emotion: currentEmotion }
      
      setTimeout(() => {
        setResponses(prev => [...prev, aiMessage])
        setIsTyping(false)
        onResponse?.(response)
      }, 1500)
    } catch (error) {
      console.error('Error generating response:', error)
      setIsTyping(false)
    }
  }

  const generateEmotionalResponse = async (message: string, emotion: string): Promise<string> => {
    // This would typically call your AI API
    const responses = {
      happy: [
        "I'm so glad you're feeling positive! Let's keep that energy going! 🌟",
        "Your enthusiasm is contagious! What would you like to learn about next?",
        "That's wonderful! I love seeing students excited about learning!"
      ],
      sad: [
        "I understand you might be feeling down. Learning can be challenging, but I'm here to help! 💙",
        "Don't worry, we all have tough days. Let's take it one step at a time.",
        "I'm here to support you. What specific topic would you like to work on together?"
      ],
      neutral: [
        "I'm here to help you learn! What would you like to explore today?",
        "Let's dive into some interesting content together. What catches your interest?",
        "Ready to learn something new? I'm excited to help you grow!"
      ],
      excited: [
        "I love your excitement! Let's channel that energy into some amazing learning! 🚀",
        "Your passion is inspiring! What topic are you most excited to explore?",
        "That's the spirit! Let's make this learning session incredible!"
      ]
    }

    const emotionResponses = responses[emotion as keyof typeof responses] || responses.neutral
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Emotional AI Tutor</h3>
          <p className="text-gray-400">I understand your feelings and adapt to help you learn</p>
        </div>
      </div>

      {/* Emotion Selector */}
      <div className="mb-6">
        <p className="text-white font-medium mb-3">How are you feeling today?</p>
        <div className="flex space-x-3">
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                currentEmotion === emotion.id
                  ? `${emotion.bg} ${emotion.color} border-2 border-current`
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              <emotion.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="space-y-4 mb-6">
        <div className="h-64 overflow-y-auto space-y-3">
          {responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${response.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs p-3 rounded-2xl ${
                response.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/20 text-white'
              }`}>
                <p className="text-sm">{response.content}</p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/20 text-white p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about your learning..."
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isTyping}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}