"use client";

import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  BarChart3, 
  BookOpen, 
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { MasteryLearningSystem } from '@/components/MasteryLearningSystem';

type ViewMode = 'graph' | 'mastery' | 'overview';

export default function KnowledgeGraphEnhancedPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeKnowledgeGaps = async () => {
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
              Knowledge Graph Understanding
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visual learning map with gap identification, prerequisite tracking, and mastery learning like Khan Academy
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
            <div className="text-gray-600">Overall Mastery</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Skills Tracked</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
            <div className="text-gray-600">Knowledge Gaps</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-gray-600">Learning Paths</div>
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
                <BarChart3 className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={viewMode === 'graph' ? 'default' : 'ghost'}
                onClick={() => setViewMode('graph')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Knowledge Graph
              </Button>
              <Button
                variant={viewMode === 'mastery' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mastery')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Mastery Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Knowledge Gaps Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Knowledge Gaps Identified
                  </h3>
                  <p className="text-red-700 mb-4">
                    Our AI has identified 3 critical knowledge gaps that are preventing you from advancing to the next level.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-gray-900 mb-2">Linear Equations</h4>
                      <p className="text-sm text-gray-600 mb-2">Missing: Graphing Lines</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-600 font-medium">High Priority</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Fix Now
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-gray-900 mb-2">Algebra Basics</h4>
                      <p className="text-sm text-gray-600 mb-2">Missing: Variable Manipulation</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-orange-600 font-medium">Medium Priority</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Practice
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-gray-900 mb-2">Geometry</h4>
                      <p className="text-sm text-gray-600 mb-2">Missing: Angle Properties</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-yellow-600 font-medium">Low Priority</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Paths */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Recommended Learning Paths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Complete Algebra Journey</h4>
                      <p className="text-sm text-gray-600">Master algebra from basics to advanced concepts</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Intermediate
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>195 min total</span>
                      <span>3 topics</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                    <Button size="sm" variant="outline">
                      Customize
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Geometry Fundamentals</h4>
                      <p className="text-sm text-gray-600">Learn geometric concepts and properties</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Beginner
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>120 min total</span>
                      <span>2 topics</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mastery Levels */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Mastery Levels Progress
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Novice', icon: '🌱', progress: 100, color: 'bg-gray-500', description: 'Just starting to learn the basics' },
                  { name: 'Apprentice', icon: '📚', progress: 100, color: 'bg-blue-500', description: 'Building foundational knowledge' },
                  { name: 'Practitioner', icon: '⚡', progress: 85, color: 'bg-green-500', description: 'Applying knowledge in practice' },
                  { name: 'Expert', icon: '🎯', progress: 45, color: 'bg-yellow-500', description: 'Deep understanding and expertise' },
                  { name: 'Master', icon: '👑', progress: 15, color: 'bg-red-500', description: 'Complete mastery and innovation' }
                ].map((level, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-100">
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{level.name}</span>
                        <span className="text-sm text-gray-500">{level.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${level.color}`}
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={analyzeKnowledgeGaps}
                disabled={isAnalyzing}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="h-5 w-5 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Knowledge Gaps'}
              </Button>
              <Button 
                onClick={() => setViewMode('graph')}
                size="lg"
                variant="outline"
              >
                <Brain className="h-5 w-5 mr-2" />
                View Knowledge Graph
              </Button>
              <Button 
                onClick={() => setViewMode('mastery')}
                size="lg"
                variant="outline"
              >
                <Target className="h-5 w-5 mr-2" />
                Mastery Learning
              </Button>
            </div>
          </div>
        )}

        {/* Knowledge Graph Mode */}
        {viewMode === 'graph' && <KnowledgeGraph />}

        {/* Mastery Learning Mode */}
        {viewMode === 'mastery' && <MasteryLearningSystem />}
      </div>
    </div>
  );
}
