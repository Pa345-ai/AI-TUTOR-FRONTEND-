"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Play, 
  RotateCcw,
  Zap,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MasteryLevel {
  id: string;
  name: string;
  description: string;
  requiredMastery: number; // 0-100
  color: string;
  icon: string;
  benefits: string[];
}

interface SkillMastery {
  skillId: string;
  skillName: string;
  currentMastery: number;
  targetMastery: number;
  attempts: number;
  lastAttempt: Date;
  improvement: number;
  status: 'not-started' | 'learning' | 'practicing' | 'mastered' | 'needs-review';
  prerequisites: string[];
  nextSkills: string[];
  resources: Array<{
    type: 'video' | 'text' | 'quiz' | 'practice' | 'project';
    title: string;
    duration: number;
    completed: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

interface LearningStreak {
  date: string;
  skillsPracticed: number;
  timeSpent: number; // minutes
  masteryGained: number;
  streak: number;
}

interface MasteryGoal {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'overdue';
}

export function MasteryLearningSystem() {
  const [masteryLevels, setMasteryLevels] = useState<MasteryLevel[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [streaks, setStreaks] = useState<LearningStreak[]>([]);
  const [goals, setGoals] = useState<MasteryGoal[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillMastery | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'skills' | 'goals' | 'analytics'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize mastery system
  useEffect(() => {
    initializeMasterySystem();
  }, []);

  const initializeMasterySystem = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const levels: MasteryLevel[] = [
      {
        id: 'novice',
        name: 'Novice',
        description: 'Just starting to learn the basics',
        requiredMastery: 0,
        color: '#6b7280',
        icon: '🌱',
        benefits: ['Access to beginner resources', 'Basic progress tracking']
      },
      {
        id: 'apprentice',
        name: 'Apprentice',
        description: 'Building foundational knowledge',
        requiredMastery: 25,
        color: '#3b82f6',
        icon: '📚',
        benefits: ['Intermediate resources', 'Peer learning groups', 'Progress insights']
      },
      {
        id: 'practitioner',
        name: 'Practitioner',
        description: 'Applying knowledge in practice',
        requiredMastery: 50,
        color: '#10b981',
        icon: '⚡',
        benefits: ['Advanced resources', 'Mentorship opportunities', 'Skill challenges']
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Deep understanding and expertise',
        requiredMastery: 75,
        color: '#f59e0b',
        icon: '🎯',
        benefits: ['Expert resources', 'Teaching opportunities', 'Advanced projects']
      },
      {
        id: 'master',
        name: 'Master',
        description: 'Complete mastery and innovation',
        requiredMastery: 90,
        color: '#ef4444',
        icon: '👑',
        benefits: ['Master resources', 'Leadership roles', 'Innovation projects']
      }
    ];

    const sampleSkills: SkillMastery[] = [
      {
        skillId: 'algebra-basics',
        skillName: 'Algebra Basics',
        currentMastery: 85,
        targetMastery: 90,
        attempts: 12,
        lastAttempt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        improvement: 15,
        status: 'practicing',
        prerequisites: [],
        nextSkills: ['linear-equations', 'quadratic-equations'],
        resources: [
          { type: 'video', title: 'Algebra Fundamentals', duration: 20, completed: true, difficulty: 'easy' },
          { type: 'practice', title: 'Basic Problems', duration: 30, completed: true, difficulty: 'easy' },
          { type: 'quiz', title: 'Mastery Test', duration: 15, completed: false, difficulty: 'hard' }
        ]
      },
      {
        skillId: 'linear-equations',
        skillName: 'Linear Equations',
        currentMastery: 60,
        targetMastery: 80,
        attempts: 8,
        lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        improvement: 8,
        status: 'learning',
        prerequisites: ['algebra-basics'],
        nextSkills: ['quadratic-equations', 'systems-equations'],
        resources: [
          { type: 'video', title: 'Linear Equations Explained', duration: 25, completed: true, difficulty: 'medium' },
          { type: 'practice', title: 'Equation Solving', duration: 40, completed: false, difficulty: 'medium' },
          { type: 'project', title: 'Real-world Applications', duration: 60, completed: false, difficulty: 'hard' }
        ]
      },
      {
        skillId: 'quadratic-equations',
        skillName: 'Quadratic Equations',
        currentMastery: 25,
        targetMastery: 70,
        attempts: 3,
        lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        improvement: 5,
        status: 'not-started',
        prerequisites: ['algebra-basics', 'linear-equations'],
        nextSkills: ['polynomials', 'graphing-quadratics'],
        resources: [
          { type: 'video', title: 'Quadratic Formula', duration: 30, completed: false, difficulty: 'hard' },
          { type: 'text', title: 'Quadratic Methods', duration: 45, completed: false, difficulty: 'hard' },
          { type: 'practice', title: 'Quadratic Problems', duration: 50, completed: false, difficulty: 'hard' }
        ]
      }
    ];

    const sampleStreaks: LearningStreak[] = [
      { date: '2024-01-15', skillsPracticed: 3, timeSpent: 45, masteryGained: 12, streak: 5 },
      { date: '2024-01-14', skillsPracticed: 2, timeSpent: 30, masteryGained: 8, streak: 4 },
      { date: '2024-01-13', skillsPracticed: 4, timeSpent: 60, masteryGained: 15, streak: 3 },
      { date: '2024-01-12', skillsPracticed: 1, timeSpent: 20, masteryGained: 5, streak: 2 },
      { date: '2024-01-11', skillsPracticed: 2, timeSpent: 35, masteryGained: 10, streak: 1 }
    ];

    const sampleGoals: MasteryGoal[] = [
      {
        id: 'goal-1',
        title: 'Master Algebra Fundamentals',
        description: 'Achieve 90% mastery in all basic algebra skills',
        targetSkills: ['algebra-basics', 'linear-equations'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: 'high',
        progress: 65,
        status: 'active'
      },
      {
        id: 'goal-2',
        title: 'Complete Advanced Math Track',
        description: 'Master all advanced mathematics concepts',
        targetSkills: ['quadratic-equations', 'polynomials', 'trigonometry'],
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        progress: 25,
        status: 'active'
      }
    ];

    setMasteryLevels(levels);
    setSkills(sampleSkills);
    setStreaks(sampleStreaks);
    setGoals(sampleGoals);
    setIsAnalyzing(false);
  }, []);

  // Get current mastery level
  const getCurrentMasteryLevel = useCallback(() => {
    const averageMastery = skills.reduce((acc, skill) => acc + skill.currentMastery, 0) / skills.length;
    return masteryLevels.find(level => averageMastery >= level.requiredMastery) || masteryLevels[0];
  }, [skills, masteryLevels]);

  // Get skill status color
  const getSkillStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'text-green-600 bg-green-100';
      case 'practicing': return 'text-blue-600 bg-blue-100';
      case 'learning': return 'text-yellow-600 bg-yellow-100';
      case 'needs-review': return 'text-orange-600 bg-orange-100';
      case 'not-started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Practice a skill
  const practiceSkill = useCallback((skillId: string) => {
    setSkills(prev => prev.map(skill => 
      skill.skillId === skillId 
        ? { 
            ...skill, 
            attempts: skill.attempts + 1,
            currentMastery: Math.min(100, skill.currentMastery + Math.random() * 10),
            lastAttempt: new Date(),
            status: skill.currentMastery > 80 ? 'mastered' : 'practicing'
          }
        : skill
    ));
  }, []);

  // Calculate overall progress
  const overallProgress = skills.length > 0 
    ? skills.reduce((acc, skill) => acc + skill.currentMastery, 0) / skills.length 
    : 0;

  const currentLevel = getCurrentMasteryLevel();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Target className="h-8 w-8 text-purple-600" />
          Mastery Learning System
        </h1>
        <p className="text-gray-600">Khan Academy-style mastery tracking with personalized learning paths</p>
      </div>

      {/* Current Mastery Level */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">{currentLevel?.icon}</span>
              {currentLevel?.name}
            </h2>
            <p className="text-purple-100 mt-1">{currentLevel?.description}</p>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Mastery</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-purple-100">Mastery Score</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={viewMode === 'skills' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('skills')}
          >
            <BookOpen className="h-4 w-4" />
            Skills
          </Button>
          <Button
            variant={viewMode === 'goals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('goals')}
          >
            <Target className="h-4 w-4" />
            Goals
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            <TrendingUp className="h-4 w-4" />
            Analytics
          </Button>
        </div>

        <Button
          onClick={initializeMasterySystem}
          disabled={isAnalyzing}
          size="sm"
        >
          <Zap className="h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Skills Overview
            </h3>
            <div className="space-y-3">
              {skills.slice(0, 3).map((skill) => (
                <div key={skill.skillId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{skill.skillName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillStatusColor(skill.status)}`}>
                        {skill.status}
                      </span>
                    </div>
                    <Progress value={skill.currentMastery} className="h-1" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{skill.currentMastery}%</span>
                      <span>{skill.attempts} attempts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Learning Streak
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {streaks[0]?.streak || 0} days
              </div>
              <div className="text-sm text-gray-600 mb-4">Current streak</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today&apos;s practice</span>
                  <span>{streaks[0]?.timeSpent || 0} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Skills practiced</span>
                  <span>{streaks[0]?.skillsPracticed || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mastery gained</span>
                  <span>+{streaks[0]?.masteryGained || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Active Goals
            </h3>
            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-1 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{goal.progress}% complete</span>
                    <span>{Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills Mode */}
      {viewMode === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSkill?.skillId === skill.skillId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm">{skill.skillName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillStatusColor(skill.status)}`}>
                    {skill.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Mastery</span>
                    <span className="font-medium">{skill.currentMastery}%</span>
                  </div>
                  <Progress value={skill.currentMastery} className="h-1" />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{skill.attempts} attempts</span>
                    <span>+{skill.improvement}% this week</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      practiceSkill(skill.skillId);
                    }}
                    className="flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Practice
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Skill Details */}
          {selectedSkill && (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedSkill.skillName}</h3>
                  <p className="text-gray-600">Mastery: {selectedSkill.currentMastery}% / {selectedSkill.targetMastery}%</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedSkill(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Progress Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Mastery</span>
                        <span className="font-medium">{selectedSkill.currentMastery}%</span>
                      </div>
                      <Progress value={selectedSkill.currentMastery} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Target Mastery</span>
                        <span className="font-medium">{selectedSkill.targetMastery}%</span>
                      </div>
                      <Progress value={selectedSkill.targetMastery} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Learning Stats</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Attempts:</span>
                        <span className="ml-2 font-medium">{selectedSkill.attempts}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Improvement:</span>
                        <span className="ml-2 font-medium text-green-600">+{selectedSkill.improvement}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Practice:</span>
                        <span className="ml-2 font-medium">
                          {selectedSkill.lastAttempt.toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSkillStatusColor(selectedSkill.status)}`}>
                          {selectedSkill.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Learning Resources</h4>
                    <div className="space-y-2">
                      {selectedSkill.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {resource.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <span className="text-sm font-medium">{resource.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{resource.duration}min</span>
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              resource.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              resource.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {resource.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => practiceSkill(selectedSkill.skillId)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Practice Now
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goals Mode */}
      {viewMode === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Learning Goals</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white p-6 rounded-lg border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{goal.title}</h4>
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.status === 'active' ? 'bg-green-100 text-green-800' :
                      goal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Mode */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Learning Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">Overall Mastery</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-green-600">{streaks[0]?.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-purple-600">{skills.length}</div>
              <div className="text-sm text-gray-600">Skills Tracked</div>
            </div>
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-orange-600">{goals.length}</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Mastery Levels Progress</h4>
            <div className="space-y-3">
              {masteryLevels.map((level, index) => (
                <div key={level.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: level.color }}>
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{level.name}</span>
                      <span className="text-sm text-gray-500">{level.requiredMastery}% required</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (overallProgress / level.requiredMastery) * 100)}%`,
                          backgroundColor: level.color
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
