import React, { useState, useRef } from 'react'

interface NoteSummarizerProps {
  userId: string
}

interface SummaryResult {
  id: string
  originalText: string
  summary: string
  keyPoints: string[]
  questions: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime: number
  createdAt: Date
}

export const NoteSummarizer: React.FC<NoteSummarizerProps> = ({ userId }) => {
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const [summaries, setSummaries] = useState<SummaryResult[]>([])
  const [summaryType, setSummaryType] = useState<'concise' | 'detailed' | 'bullet-points'>('concise')
  const [targetLength, setTargetLength] = useState<'short' | 'medium' | 'long'>('medium')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    
    try {
      // Simulate AI processing
      const result = await generateSummary(inputText, summaryType, targetLength)
      setSummaryResult(result)
      setSummaries(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateSummary = async (text: string, type: string, length: string): Promise<SummaryResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const wordCount = text.split(' ').length
    const targetWordCount = length === 'short' ? Math.ceil(wordCount * 0.2) : 
                           length === 'medium' ? Math.ceil(wordCount * 0.4) : 
                           Math.ceil(wordCount * 0.6)

    const summary = generateMockSummary(text, type, targetWordCount)
    const keyPoints = generateKeyPoints(text)
    const questions = generateQuestions(text)

    return {
      id: Date.now().toString(),
      originalText: text,
      summary,
      keyPoints,
      questions,
      difficulty: determineDifficulty(text),
      estimatedReadTime: Math.ceil(targetWordCount / 200), // 200 words per minute
      createdAt: new Date()
    }
  }

  const generateMockSummary = (text: string, type: string, targetWords: number): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const selectedSentences = sentences.slice(0, Math.min(3, sentences.length))
    
    if (type === 'bullet-points') {
      return selectedSentences.map(sentence => `• ${sentence.trim()}`).join('\n')
    } else if (type === 'detailed') {
      return `This content covers several important concepts. ${selectedSentences.join(' ')} The main takeaway is that understanding these principles is crucial for mastery of the subject.`
    } else {
      return selectedSentences.join(' ')
    }
  }

  const generateKeyPoints = (text: string): string[] => {
    const keywords = text.toLowerCase().match(/\b\w{4,}\b/g) || []
    const wordFreq = keywords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    
    return [
      `Key concept: ${topWords[0] || 'Main topic'}`,
      `Important detail: ${topWords[1] || 'Secondary topic'}`,
      `Critical point: ${topWords[2] || 'Supporting detail'}`,
      `Essential element: ${topWords[3] || 'Additional context'}`,
      `Core principle: ${topWords[4] || 'Fundamental idea'}`
    ]
  }

  const generateQuestions = (text: string): string[] => {
    return [
      "What is the main concept being discussed?",
      "How does this relate to what you already know?",
      "What are the practical applications of this information?",
      "What questions do you still have about this topic?",
      "How would you explain this to someone else?"
    ]
  }

  const determineDifficulty = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    const complexWords = text.match(/\b\w{8,}\b/g) || []
    const ratio = complexWords.length / text.split(' ').length
    
    if (ratio > 0.1) return 'advanced'
    if (ratio > 0.05) return 'intermediate'
    return 'beginner'
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setInputText(content)
    }
    reader.readAsText(file)
  }

  const exportSummary = (summary: SummaryResult) => {
    const content = `# Summary\n\n${summary.summary}\n\n## Key Points\n${summary.keyPoints.map(point => `- ${point}`).join('\n')}\n\n## Questions for Review\n${summary.questions.map(q => `- ${q}`).join('\n')}`
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `summary-${summary.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📚 AI Note Summarizer</h2>
        <p className="text-indigo-100">Transform any text into digestible summaries with key points and study questions</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📝 Input Your Content</h3>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              📁 Upload File
            </button>
            <span className="text-sm text-gray-600">or paste text below</span>
          </div>

          {/* Summary Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Summary Type</label>
              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="concise">Concise (Key points only)</option>
                <option value="detailed">Detailed (Comprehensive)</option>
                <option value="bullet-points">Bullet Points</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Length</label>
              <select
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="short">Short (20% of original)</option>
                <option value="medium">Medium (40% of original)</option>
                <option value="long">Long (60% of original)</option>
              </select>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text to Summarize</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your notes, textbook content, or any text you want to summarize..."
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {inputText.split(' ').length} words
              </span>
              <button
                onClick={handleTextSubmit}
                disabled={!inputText.trim() || isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? '🤖 AI is summarizing...' : '✨ Generate Summary'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Summary Result */}
      {summaryResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">📋 Summary Result</h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(summaryResult.difficulty)}`}>
                {summaryResult.difficulty.toUpperCase()}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {summaryResult.estimatedReadTime} min read
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{summaryResult.summary}</p>
              </div>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Points</h4>
              <ul className="space-y-1">
                {summaryResult.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Study Questions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Study Questions</h4>
              <div className="space-y-2">
                {summaryResult.questions.map((question, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => exportSummary(summaryResult)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                📥 Export Summary
              </button>
              <button
                onClick={() => setSummaryResult(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ✨ New Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Previous Summaries */}
      {summaries.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📚 Previous Summaries</h3>
          <div className="space-y-3">
            {summaries.map((summary) => (
              <div key={summary.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {summary.originalText.substring(0, 50)}...
                    </h4>
                    <p className="text-sm text-gray-600">
                      {summary.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(summary.difficulty)}`}>
                      {summary.difficulty}
                    </span>
                    <button
                      onClick={() => exportSummary(summary)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Export
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {summary.summary.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-yellow-700">
          <li>• <strong>Upload PDFs:</strong> The AI can extract and summarize text from PDF files</li>
          <li>• <strong>Adjust length:</strong> Use different target lengths based on your study needs</li>
          <li>• <strong>Export summaries:</strong> Save your summaries for offline study</li>
          <li>• <strong>Use questions:</strong> The generated questions help test your understanding</li>
        </ul>
      </div>
    </div>
  )
}