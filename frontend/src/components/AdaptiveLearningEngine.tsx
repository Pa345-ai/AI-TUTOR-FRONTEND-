"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Target, TrendingUp, Clock, Star, Zap, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LearningPath {
  id: string;
  topic: string;
  difficulty: number; // 1-10 scale
  mastery: number; // 0-100%
  estimatedTime: number; // minutes
  prerequisites: string[];
  nextTopics: string[];
  resources: Array<{
    type: 'video' | 'text' | 'quiz' | 'practice';
    title: string;
    duration: number;
    completed: boolean;
  }>;
}

interface PerformanceData {
  topic: string;
  accuracy: number;
  timeSpent: number;
  attempts: number;
  lastAttempt: Date;
  improvement: number; // percentage improvement
}

interface AdaptiveEngineProps {
  userId: string;
  subject: string;
  onPathUpdate: (path: LearningPath[]) => void;
  onRecommendation: (recommendation: string) => void;
}

export function AdaptiveLearningEngine({ userId, subject, onPathUpdate, onRecommendation }: AdaptiveEngineProps) {
  const [learningPath, setLearningPath] = useState<LearningPath[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [currentFocus, setCurrentFocus] = useState<string>('');
  const [difficultyAdjustment, setDifficultyAdjustment] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  // Generate personalized learning path
  const generateLearningPath = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPath: LearningPath[] = [
      {
        id: '1',
        topic: 'Introduction to Algebra',
        difficulty: 3,
        mastery: 0,
        estimatedTime: 30,
        prerequisites: [],
        nextTopics: ['Linear Equations', 'Quadratic Equations'],
        resources: [
          { type: 'video', title: 'What is Algebra?', duration: 10, completed: false },
          { type: 'text', title: 'Basic Algebraic Concepts', duration: 15, completed: false },
          { type: 'quiz', title: 'Algebra Fundamentals Quiz', duration: 5, completed: false }
        ]
      },
      {
        id: '2',
        topic: 'Linear Equations',
        difficulty: 5,
        mastery: 0,
        estimatedTime: 45,
        prerequisites: ['Introduction to Algebra'],
        nextTopics: ['Quadratic Equations', 'Systems of Equations'],
        resources: [
          { type: 'video', title: 'Solving Linear Equations', duration: 15, completed: false },
          { type: 'practice', title: 'Linear Equation Problems', duration: 20, completed: false },
          { type: 'quiz', title: 'Linear Equations Test', duration: 10, completed: false }
        ]
      },
      {
        id: '3',
        topic: 'Quadratic Equations',
        difficulty: 7,
        mastery: 0,
        estimatedTime: 60,
        prerequisites: ['Linear Equations'],
        nextTopics: ['Polynomials', 'Graphing Quadratics'],
        resources: [
          { type: 'video', title: 'Understanding Quadratics', duration: 20, completed: false },
          { type: 'text', title: 'Quadratic Formula', duration: 25, completed: false },
          { type: 'practice', title: 'Quadratic Problems', duration: 15, completed: false }
        ]
      }
    ];
    
    setLearningPath(mockPath);
    onPathUpdate(mockPath);
    setIsAnalyzing(false);
  }, [onPathUpdate]);

  // Analyze performance and adjust difficulty
  const analyzePerformance = useCallback((topic: string, accuracy: number, timeSpent: number) => {
    const existingData = performanceData.find(p => p.topic === topic);
    const improvement = existingData ? accuracy - existingData.accuracy : 0;
    
    const newData: PerformanceData = {
      topic,
      accuracy,
      timeSpent,
      attempts: (existingData?.attempts || 0) + 1,
      lastAttempt: new Date(),
      improvement
    };
    
    setPerformanceData(prev => [
      ...prev.filter(p => p.topic !== topic),
      newData
    ]);
    
    // Adjust difficulty based on performance
    if (accuracy >= 0.8) {
      setDifficultyAdjustment(prev => Math.min(prev + 1, 3));
      setInsights(prev => [...prev, `Great job on ${topic}! Increasing difficulty.`]);
    } else if (accuracy < 0.5) {
      setDifficultyAdjustment(prev => Math.max(prev - 1, -3));
      setInsights(prev => [...prev, `Let's review ${topic} with easier problems.`]);
    }
    
    // Update mastery levels
    setLearningPath(prev => prev.map(path => {
      if (path.topic === topic) {
        const newMastery = Math.min(100, path.mastery + (accuracy * 20));
        return { ...path, mastery: newMastery };
      }
      return path;
    }));
  }, [performanceData]);

  // Generate recommendations
  const generateRecommendations = useCallback(() => {
    const weakTopics = performanceData.filter(p => p.accuracy < 0.6);
    const strongTopics = performanceData.filter(p => p.accuracy >= 0.8);
    
    const recommendations: string[] = [];
    
    if (weakTopics.length > 0) {
      recommendations.push(`Focus on reviewing: ${weakTopics.map(t => t.topic).join(', ')}`);
    }
    
    if (strongTopics.length > 0) {
      recommendations.push(`You're excelling at: ${strongTopics.map(t => t.topic).join(', ')}`);
    }
    
    const nextTopic = learningPath.find(path => path.mastery < 50 && path.prerequisites.every(p => {
      const prereq = learningPath.find(lp => lp.topic === p);
      return prereq ? prereq.mastery >= 80 : false;
    }));
    
    if (nextTopic) {
      recommendations.push(`Next recommended topic: ${nextTopic.topic}`);
    }
    
    setInsights(recommendations);
    onRecommendation(recommendations.join(' | '));
  }, [performanceData, learningPath, onRecommendation]);

  // Get difficulty color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-100';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get mastery color
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600';
    if (mastery >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    generateLearningPath();
  }, [generateLearningPath]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          Adaptive Learning Engine
        </h1>
        <p className="text-gray-600">AI-powered personalized learning paths that adapt to your performance</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Current Focus</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {currentFocus || 'Getting Started'}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-medium">Improvement</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            +{difficultyAdjustment > 0 ? difficultyAdjustment : 0}%
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Time Spent</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {performanceData.reduce((acc, p) => acc + p.timeSpent, 0)}m
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Mastery Level</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {Math.round(learningPath.reduce((acc, p) => acc + p.mastery, 0) / learningPath.length) || 0}%
          </p>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI Insights
          </h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <p key={index} className="text-sm text-gray-700">• {insight}</p>
            ))}
          </div>
        </div>
      )}

      {/* Learning Path */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Learning Path</h3>
          <Button onClick={generateRecommendations} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Get Recommendations'}
          </Button>
        </div>
        
        <div className="space-y-4">
          {learningPath.map((path, index) => (
            <div key={path.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <h4 className="text-lg font-semibold">{path.topic}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      Level {path.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.estimatedTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {path.resources.length} resources
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mastery Progress</span>
                      <span className={`font-medium ${getMasteryColor(path.mastery)}`}>
                        {Math.round(path.mastery)}%
                      </span>
                    </div>
                    <Progress value={path.mastery} className="h-2" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    Start Learning
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => analyzePerformance(path.topic, Math.random() * 0.4 + 0.6, Math.random() * 30 + 10)}
                  >
                    Simulate Test
                  </Button>
                </div>
              </div>
              
              {/* Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {path.resources.map((resource, resIndex) => (
                  <div key={resIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {resource.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className="text-sm font-medium">{resource.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{resource.duration}min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
