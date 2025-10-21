"use client";

import React, { useState } from 'react';
import { 
  Brain, 
  Palette, 
  Database, 
  Code, 
  BarChart3, 
  Clock,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Layers,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiModalExplanations } from '@/components/MultiModalExplanations';
import { MemorySystem } from '@/components/MemorySystem';

type ViewMode = 'overview' | 'explanations' | 'memory' | 'integrated';

export default function MultiModalMemoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLearningPatterns = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Multi-Modal Learning & Memory
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced visual explanations with intelligent memory system for enhanced learning retention
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
            <div className="text-gray-600">Visual Explanations</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">127</div>
            <div className="text-gray-600">Memories Stored</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
            <div className="text-gray-600">Retention Rate</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">23</div>
            <div className="text-gray-600">AI Insights</div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('overview')}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={viewMode === 'explanations' ? 'default' : 'ghost'}
                onClick={() => setViewMode('explanations')}
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Visual Explanations
              </Button>
              <Button
                variant={viewMode === 'memory' ? 'default' : 'ghost'}
                onClick={() => setViewMode('memory')}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Memory System
              </Button>
              <Button
                variant={viewMode === 'integrated' ? 'default' : 'ghost'}
                onClick={() => setViewMode('integrated')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Integrated View
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Learning Progress Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Visual Learning</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Drawing Exercises</span>
                      <span>12/15 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Code Examples</span>
                      <span>8/10 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Interactive Diagrams</span>
                      <span>5/6 completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Memory Retention</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Concepts Mastered</span>
                      <span>45/60</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Skills Practiced</span>
                      <span>23/30</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '77%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Connections Made</span>
                      <span>67/80</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">AI Insights</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Pattern:</strong> You learn best through visual representations
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Recommendation:</strong> Focus on drawing exercises for complex concepts
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Gap:</strong> Missing connections between algebra and geometry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Learning Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    type: 'drawing',
                    title: 'Quadratic Equation Visualization',
                    description: 'Created visual representation of quadratic formula solving process',
                    time: '2 hours ago',
                    icon: <Palette className="h-4 w-4 text-blue-500" />
                  },
                  {
                    type: 'memory',
                    title: 'Added Discriminant Concept',
                    description: 'Stored knowledge about discriminant and its relationship to roots',
                    time: '4 hours ago',
                    icon: <Database className="h-4 w-4 text-green-500" />
                  },
                  {
                    type: 'code',
                    title: 'Python Function Example',
                    description: 'Practiced implementing quadratic formula in Python',
                    time: '6 hours ago',
                    icon: <Code className="h-4 w-4 text-purple-500" />
                  },
                  {
                    type: 'diagram',
                    title: 'Algebra Concept Map',
                    description: 'Built interactive mind map of algebra concepts',
                    time: '1 day ago',
                    icon: <BarChart3 className="h-4 w-4 text-orange-500" />
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {activity.icon}
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setViewMode('explanations')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Palette className="h-6 w-6" />
                  <span>Start Drawing</span>
                </Button>
                <Button 
                  onClick={() => setViewMode('memory')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Database className="h-6 w-6" />
                  <span>Add Memory</span>
                </Button>
                <Button 
                  onClick={analyzeLearningPatterns}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Brain className="h-6 w-6" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Patterns'}</span>
                </Button>
                <Button 
                  onClick={() => setViewMode('integrated')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Layers className="h-6 w-6" />
                  <span>Integrated View</span>
                </Button>
              </div>
            </div>

            {/* Learning Recommendations */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Learning Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Visual Learning Strength</h4>
                  <p className="text-sm text-purple-100">
                    Your visual learning patterns show 89% retention rate. Continue using drawing and diagramming for complex concepts.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Memory Gap Identified</h4>
                  <p className="text-sm text-purple-100">
                    Focus on connecting algebra concepts to geometry. Create visual bridges between these subjects.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Next Learning Step</h4>
                  <p className="text-sm text-purple-100">
                    Practice quadratic word problems using your visual approach. This will strengthen real-world application.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Memory Consolidation</h4>
                  <p className="text-sm text-purple-100">
                    Review your quadratic formula memory in 24 hours to maximize long-term retention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Explanations Mode */}
        {viewMode === 'explanations' && <MultiModalExplanations />}

        {/* Memory System Mode */}
        {viewMode === 'memory' && <MemorySystem />}

        {/* Integrated View Mode */}
        {viewMode === 'integrated' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Integrated Learning Experience
              </h3>
              <p className="text-gray-600 mb-6">
                This integrated view combines visual explanations with memory system for enhanced learning. 
                Create visual representations while building long-term memory connections.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Visual Learning Tools</h4>
                  <div className="space-y-2">
                    <Button className="w-full justify-start">
                      <Palette className="h-4 w-4 mr-2" />
                      Drawing Canvas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      Code Examples
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Interactive Diagrams
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Memory Management</h4>
                  <div className="space-y-2">
                    <Button className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Add New Memory
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search Memories
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      View Insights
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
