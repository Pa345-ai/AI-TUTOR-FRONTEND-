import React, { useState, useEffect } from 'react'

interface AIFlashcardsProps {
  userId: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  confidence: number
  lastReviewed: Date | null
  reviewCount: number
  correctCount: number
}

interface StudySession {
  id: string
  cardsStudied: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
}

export const AIFlashcards: React.FC<AIFlashcardsProps> = ({ userId }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState<'new' | 'review' | 'difficult'>('new')
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correctAnswers: 0,
    timeSpent: 0
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [studySessions, setStudySessions] = useState<StudySession[]>([])

  // Sample flashcards for demonstration
  const sampleFlashcards: Flashcard[] = [
    {
      id: '1',
      front: 'What is the capital of France?',
      back: 'Paris',
      category: 'Geography',
      difficulty: 'easy',
      confidence: 0.8,
      lastReviewed: null,
      reviewCount: 0,
      correctCount: 0
    },
    {
      id: '2',
      front: 'What is the derivative of x²?',
      back: '2x',
      category: 'Mathematics',
      difficulty: 'medium',
      confidence: 0.6,
      lastReviewed: null,
      reviewCount: 0,
      correctCount: 0
    },
    {
      id: '3',
      front: 'What is photosynthesis?',
      back: 'The process by which plants convert light energy into chemical energy',
      category: 'Biology',
      difficulty: 'hard',
      confidence: 0.4,
      lastReviewed: null,
      reviewCount: 0,
      correctCount: 0
    }
  ]

  useEffect(() => {
    setFlashcards(sampleFlashcards)
  }, [])

  const currentCard = flashcards[currentCardIndex]

  const generateFlashcards = async (topic: string, count: number) => {
    setIsGenerating(true)
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newCards: Flashcard[] = Array.from({ length: count }, (_, index) => ({
        id: `generated-${Date.now()}-${index}`,
        front: `What is ${topic} concept ${index + 1}?`,
        back: `This is the explanation for ${topic} concept ${index + 1}. It involves important principles and applications.`,
        category: topic,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
        confidence: 0.5,
        lastReviewed: null,
        reviewCount: 0,
        correctCount: 0
      }))
      
      setFlashcards(prev => [...newCards, ...prev])
    } catch (error) {
      console.error('Error generating flashcards:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const rateCard = (rating: 'correct' | 'incorrect') => {
    if (!currentCard) return

    const updatedCards = flashcards.map(card => {
      if (card.id === currentCard.id) {
        const newReviewCount = card.reviewCount + 1
        const newCorrectCount = rating === 'correct' ? card.correctCount + 1 : card.correctCount
        const newConfidence = newCorrectCount / newReviewCount
        
        return {
          ...card,
          confidence: newConfidence,
          lastReviewed: new Date(),
          reviewCount: newReviewCount,
          correctCount: newCorrectCount
        }
      }
      return card
    })

    setFlashcards(updatedCards)
    setSessionStats(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: rating === 'correct' ? prev.correctAnswers + 1 : prev.correctAnswers
    }))

    // Move to next card
    setTimeout(() => {
      nextCard()
    }, 1000)
  }

  const nextCard = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length)
  }

  const previousCard = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => prev === 0 ? flashcards.length - 1 : prev - 1)
  }

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const completeSession = () => {
    const session: StudySession = {
      id: Date.now().toString(),
      cardsStudied: sessionStats.cardsStudied,
      correctAnswers: sessionStats.correctAnswers,
      timeSpent: sessionStats.timeSpent,
      completedAt: new Date()
    }
    
    setStudySessions(prev => [session, ...prev.slice(0, 9)]) // Keep last 10
    setSessionStats({ cardsStudied: 0, correctAnswers: 0, timeSpent: 0 })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFilteredCards = () => {
    switch (studyMode) {
      case 'review':
        return flashcards.filter(card => card.reviewCount > 0)
      case 'difficult':
        return flashcards.filter(card => card.confidence < 0.6)
      default:
        return flashcards
    }
  }

  const filteredCards = getFilteredCards()
  const currentFilteredCard = filteredCards[currentCardIndex]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎴 AI Flashcards</h2>
        <p className="text-orange-100">Smart flashcards that adapt to your learning progress</p>
      </div>

      {/* Study Mode Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📚 Study Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setStudyMode('new')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              studyMode === 'new'
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🆕</div>
              <h4 className="font-semibold">New Cards</h4>
              <p className="text-sm text-gray-600">{flashcards.filter(c => c.reviewCount === 0).length} cards</p>
            </div>
          </button>
          
          <button
            onClick={() => setStudyMode('review')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              studyMode === 'review'
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-semibold">Review</h4>
              <p className="text-sm text-gray-600">{flashcards.filter(c => c.reviewCount > 0).length} cards</p>
            </div>
          </button>
          
          <button
            onClick={() => setStudyMode('difficult')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              studyMode === 'difficult'
                ? 'border-red-500 bg-red-50 text-red-800'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-semibold">Difficult</h4>
              <p className="text-sm text-gray-600">{flashcards.filter(c => c.confidence < 0.6).length} cards</p>
            </div>
          </button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{sessionStats.cardsStudied}</div>
          <div className="text-sm text-gray-600">Cards Studied</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {sessionStats.cardsStudied > 0 ? Math.round((sessionStats.correctAnswers / sessionStats.cardsStudied) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{sessionStats.timeSpent}m</div>
          <div className="text-sm text-gray-600">Time Spent</div>
        </div>
      </div>

      {/* Flashcard Display */}
      {filteredCards.length > 0 && currentFilteredCard ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Card {currentCardIndex + 1} of {filteredCards.length}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentFilteredCard.difficulty)}`}>
                {currentFilteredCard.difficulty.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(currentFilteredCard.confidence)}`}>
                {Math.round(currentFilteredCard.confidence * 100)}% confidence
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={shuffleCards}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
              >
                🔀 Shuffle
              </button>
              <button
                onClick={completeSession}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                ✅ Complete Session
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="relative">
            <div
              className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 min-h-64 flex items-center justify-center cursor-pointer transition-all duration-500 transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={flipCard}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎴</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isFlipped ? 'Answer' : 'Question'}
                </h3>
                <p className="text-lg text-gray-700">
                  {isFlipped ? currentFilteredCard.back : currentFilteredCard.front}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Click to {isFlipped ? 'show question' : 'reveal answer'}
                </p>
              </div>
            </div>
          </div>

          {/* Card Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={previousCard}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => rateCard('incorrect')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                ❌ Incorrect
              </button>
              <button
                onClick={() => rateCard('correct')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ Correct
              </button>
            </div>
            
            <button
              onClick={nextCard}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cards Available</h3>
          <p className="text-gray-600 mb-4">Generate some flashcards to start studying!</p>
        </div>
      )}

      {/* Generate New Cards */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🤖 Generate New Flashcards</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter topic (e.g., Biology, History, Math)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const topic = (e.target as HTMLInputElement).value
                if (topic) generateFlashcards(topic, 5)
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="topic"]') as HTMLInputElement
              if (input?.value) generateFlashcards(input.value, 5)
            }}
            disabled={isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '🤖 Generating...' : '✨ Generate'}
          </button>
        </div>
      </div>

      {/* Study Sessions History */}
      {studySessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Study Sessions</h3>
          <div className="space-y-3">
            {studySessions.map((session) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    {session.cardsStudied} cards studied
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.completedAt.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {Math.round((session.correctAnswers / session.cardsStudied) * 100)}% accuracy
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.timeSpent} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-yellow-700">
          <li>• <strong>Spaced Repetition:</strong> Review difficult cards more frequently</li>
          <li>• <strong>Active Recall:</strong> Try to remember the answer before flipping</li>
          <li>• <strong>Mix It Up:</strong> Use shuffle to avoid memorizing order</li>
          <li>• <strong>Track Progress:</strong> Monitor your confidence levels over time</li>
        </ul>
      </div>
    </div>
  )
}