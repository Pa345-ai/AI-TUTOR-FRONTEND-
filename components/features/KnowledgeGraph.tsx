import React, { useState } from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'
import { KnowledgeGraph as KnowledgeGraphType } from '../../lib/supabase'

interface KnowledgeGraphProps {
  userId: string
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [isUpdating, setIsUpdating] = useState(false)
  const { knowledgeGraphs, updateKnowledgeGraph } = useOmniMind(userId)

  const handleUpdateGraph = async (subject: string, topic: string, masteryLevel: number) => {
    setIsUpdating(true)
    try {
      await updateKnowledgeGraph({
        subject,
        topic,
        mastery_level: masteryLevel,
        connections: []
      })
    } catch (error) {
      console.error('Error updating knowledge graph:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600 bg-green-100'
    if (level >= 60) return 'text-yellow-600 bg-yellow-100'
    if (level >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getMasteryLabel = (level: number) => {
    if (level >= 90) return 'Expert'
    if (level >= 80) return 'Advanced'
    if (level >= 60) return 'Intermediate'
    if (level >= 40) return 'Beginner'
    return 'Novice'
  }

  const filteredGraphs = selectedSubject === 'all' 
    ? knowledgeGraphs 
    : knowledgeGraphs.filter(graph => graph.subject === selectedSubject)

  const subjects = [...new Set(knowledgeGraphs.map(graph => graph.subject))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🧩 Knowledge Graph</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Knowledge Visualization</h3>
        
        {filteredGraphs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Knowledge Data Yet</h3>
            <p className="text-gray-600 mb-4">Start learning to build your knowledge graph!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Knowledge Graph Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGraphs.map((graph: KnowledgeGraphType) => (
                <div key={graph.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{graph.topic}</h4>
                      <p className="text-sm text-gray-600">{graph.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(graph.mastery_level)}`}>
                      {getMasteryLabel(graph.mastery_level)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Mastery Level</span>
                        <span>{graph.mastery_level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            graph.mastery_level >= 80 ? 'bg-green-500' :
                            graph.mastery_level >= 60 ? 'bg-yellow-500' :
                            graph.mastery_level >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${graph.mastery_level}%` }}
                        ></div>
                      </div>
                    </div>

                    {graph.connections && graph.connections.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Connections:</p>
                        <div className="flex flex-wrap gap-1">
                          {graph.connections.slice(0, 3).map((connection: any, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {connection}
                            </span>
                          ))}
                          {graph.connections.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{graph.connections.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateGraph(graph.subject, graph.topic, Math.min(100, graph.mastery_level + 10))}
                        disabled={isUpdating}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                      >
                        +10%
                      </button>
                      <button
                        onClick={() => handleUpdateGraph(graph.subject, graph.topic, Math.max(0, graph.mastery_level - 10))}
                        disabled={isUpdating}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        -10%
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Knowledge Graph Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Knowledge Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredGraphs.length}
                  </div>
                  <div className="text-sm text-purple-700">Total Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredGraphs.filter(g => g.mastery_level >= 80).length}
                  </div>
                  <div className="text-sm text-green-700">Expert Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredGraphs.filter(g => g.mastery_level >= 60 && g.mastery_level < 80).length}
                  </div>
                  <div className="text-sm text-yellow-700">Advanced</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredGraphs.filter(g => g.mastery_level < 60).length}
                  </div>
                  <div className="text-sm text-orange-700">Learning</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
