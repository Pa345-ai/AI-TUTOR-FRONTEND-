"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Brain, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  TrendingUp,
  Users,
  Clock,
  Star,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface KnowledgeNode {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mastery: number; // 0-100
  prerequisites: string[];
  nextTopics: string[];
  estimatedTime: number; // minutes
  resources: Array<{
    type: 'video' | 'text' | 'quiz' | 'practice';
    title: string;
    duration: number;
    completed: boolean;
  }>;
  skills: string[];
  x: number;
  y: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  lastStudied?: Date;
  attempts: number;
  accuracy: number;
}

interface KnowledgeGap {
  id: string;
  topic: string;
  skill: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string[];
  suggestedActions: string[];
  estimatedTime: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  nodes: string[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
}

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'list' | 'timeline'>('graph');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGaps, setShowGaps] = useState(true);
  const [showPrerequisites, setShowPrerequisites] = useState(true);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ width: 800, height: 600 });

  // Initialize knowledge graph with sample data
  useEffect(() => {
    generateKnowledgeGraph();
  }, []);

  const generateKnowledgeGraph = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleNodes: KnowledgeNode[] = [
      {
        id: 'algebra-basics',
        title: 'Algebra Basics',
        description: 'Fundamental concepts of algebra including variables, expressions, and equations',
        subject: 'Mathematics',
        difficulty: 'beginner',
        mastery: 85,
        prerequisites: [],
        nextTopics: ['linear-equations', 'quadratic-equations'],
        estimatedTime: 45,
        resources: [
          { type: 'video', title: 'Introduction to Algebra', duration: 15, completed: true },
          { type: 'text', title: 'Algebra Fundamentals', duration: 20, completed: true },
          { type: 'quiz', title: 'Basic Algebra Quiz', duration: 10, completed: true }
        ],
        skills: ['variable manipulation', 'expression evaluation', 'basic equations'],
        x: 100,
        y: 200,
        status: 'completed',
        lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        attempts: 3,
        accuracy: 0.87
      },
      {
        id: 'linear-equations',
        title: 'Linear Equations',
        description: 'Solving linear equations with one and two variables',
        subject: 'Mathematics',
        difficulty: 'intermediate',
        mastery: 60,
        prerequisites: ['algebra-basics'],
        nextTopics: ['quadratic-equations', 'systems-equations'],
        estimatedTime: 60,
        resources: [
          { type: 'video', title: 'Linear Equations Explained', duration: 20, completed: true },
          { type: 'practice', title: 'Linear Equation Problems', duration: 25, completed: false },
          { type: 'quiz', title: 'Linear Equations Test', duration: 15, completed: false }
        ],
        skills: ['equation solving', 'graphing lines', 'slope calculation'],
        x: 300,
        y: 150,
        status: 'in-progress',
        lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attempts: 2,
        accuracy: 0.65
      },
      {
        id: 'quadratic-equations',
        title: 'Quadratic Equations',
        description: 'Understanding and solving quadratic equations',
        subject: 'Mathematics',
        difficulty: 'advanced',
        mastery: 25,
        prerequisites: ['algebra-basics', 'linear-equations'],
        nextTopics: ['polynomials', 'graphing-quadratics'],
        estimatedTime: 90,
        resources: [
          { type: 'video', title: 'Quadratic Formula', duration: 25, completed: false },
          { type: 'text', title: 'Quadratic Methods', duration: 30, completed: false },
          { type: 'practice', title: 'Quadratic Problems', duration: 35, completed: false }
        ],
        skills: ['quadratic formula', 'factoring', 'completing the square'],
        x: 500,
        y: 100,
        status: 'locked',
        lastStudied: undefined,
        attempts: 0,
        accuracy: 0
      },
      {
        id: 'geometry-basics',
        title: 'Geometry Basics',
        description: 'Basic geometric shapes, angles, and properties',
        subject: 'Mathematics',
        difficulty: 'beginner',
        mastery: 70,
        prerequisites: [],
        nextTopics: ['triangles', 'circles'],
        estimatedTime: 50,
        resources: [
          { type: 'video', title: 'Introduction to Geometry', duration: 18, completed: true },
          { type: 'text', title: 'Geometric Properties', duration: 22, completed: true },
          { type: 'quiz', title: 'Basic Geometry Quiz', duration: 10, completed: false }
        ],
        skills: ['shape recognition', 'angle measurement', 'basic properties'],
        x: 100,
        y: 400,
        status: 'in-progress',
        lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        attempts: 1,
        accuracy: 0.72
      },
      {
        id: 'triangles',
        title: 'Triangles',
        description: 'Properties and theorems related to triangles',
        subject: 'Mathematics',
        difficulty: 'intermediate',
        mastery: 0,
        prerequisites: ['geometry-basics'],
        nextTopics: ['trigonometry', 'similarity'],
        estimatedTime: 70,
        resources: [
          { type: 'video', title: 'Triangle Properties', duration: 22, completed: false },
          { type: 'text', title: 'Triangle Theorems', duration: 28, completed: false },
          { type: 'practice', title: 'Triangle Problems', duration: 20, completed: false }
        ],
        skills: ['triangle properties', 'theorems', 'angle relationships'],
        x: 300,
        y: 350,
        status: 'available',
        lastStudied: undefined,
        attempts: 0,
        accuracy: 0
      }
    ];

    const sampleGaps: KnowledgeGap[] = [
      {
        id: 'gap-1',
        topic: 'Linear Equations',
        skill: 'Graphing Lines',
        severity: 'high',
        impact: ['quadratic-equations', 'systems-equations'],
        suggestedActions: [
          'Practice graphing linear equations with different slopes',
          'Review slope-intercept form',
          'Complete graphing exercises'
        ],
        estimatedTime: 30
      },
      {
        id: 'gap-2',
        topic: 'Algebra Basics',
        skill: 'Variable Manipulation',
        severity: 'medium',
        impact: ['linear-equations'],
        suggestedActions: [
          'Practice simplifying expressions',
          'Review order of operations',
          'Complete variable substitution exercises'
        ],
        estimatedTime: 20
      }
    ];

    const samplePaths: LearningPath[] = [
      {
        id: 'path-1',
        name: 'Complete Algebra Journey',
        description: 'Master algebra from basics to advanced concepts',
        nodes: ['algebra-basics', 'linear-equations', 'quadratic-equations'],
        estimatedDuration: 195,
        difficulty: 'intermediate',
        progress: 45
      },
      {
        id: 'path-2',
        name: 'Geometry Fundamentals',
        description: 'Learn geometric concepts and properties',
        nodes: ['geometry-basics', 'triangles'],
        estimatedDuration: 120,
        difficulty: 'beginner',
        progress: 35
      }
    ];

    setNodes(sampleNodes);
    setGaps(sampleGaps);
    setLearningPaths(samplePaths);
    setIsGenerating(false);
  }, []);

  // Calculate node positions for graph view
  const calculateNodePositions = useCallback(() => {
    const width = svgSize.width;
    const height = svgSize.height;
    
    setNodes(prev => prev.map((node, index) => {
      // Simple grid layout for now
      const cols = Math.ceil(Math.sqrt(prev.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...node,
        x: (col + 1) * (width / (cols + 1)),
        y: (row + 1) * (height / (Math.ceil(prev.length / cols) + 1))
      };
    }));
  }, [svgSize]);

  useEffect(() => {
    calculateNodePositions();
  }, [calculateNodePositions]);

  // Get node color based on status and mastery
  const getNodeColor = (node: KnowledgeNode) => {
    if (node.status === 'locked') return '#e5e7eb';
    if (node.status === 'completed') return '#10b981';
    if (node.status === 'in-progress') return '#f59e0b';
    return '#3b82f6';
  };

  // Get mastery color
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return '#10b981';
    if (mastery >= 60) return '#f59e0b';
    if (mastery >= 40) return '#f97316';
    return '#ef4444';
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get gap severity color
  const getGapSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Start learning a node
  const startLearning = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, status: 'in-progress' as const }
        : node
    ));
  }, []);

  // Complete a node
  const completeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            status: 'completed' as const,
            mastery: Math.min(100, node.mastery + 20),
            lastStudied: new Date()
          }
        : node
    ));
  }, []);

  // Filter nodes based on current filters
  const filteredNodes = nodes.filter(node => {
    if (filterSubject !== 'all' && node.subject !== filterSubject) return false;
    if (filterDifficulty !== 'all' && node.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          Knowledge Graph Understanding
        </h1>
        <p className="text-gray-600">Visual learning map with gap identification and mastery tracking</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('graph')}
            >
              <Target className="h-4 w-4" />
              Graph
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <BookOpen className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Clock className="h-4 w-4" />
              Timeline
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Language">Language</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGaps(!showGaps)}
          >
            <AlertCircle className="h-4 w-4" />
            {showGaps ? 'Hide' : 'Show'} Gaps
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrerequisites(!showPrerequisites)}
          >
            <ArrowRight className="h-4 w-4" />
            {showPrerequisites ? 'Hide' : 'Show'} Prerequisites
          </Button>
          <Button
            onClick={generateKnowledgeGraph}
            disabled={isGenerating}
            size="sm"
          >
            <Zap className="h-4 w-4" />
            {isGenerating ? 'Analyzing...' : 'Refresh Graph'}
          </Button>
        </div>
      </div>

      {/* Knowledge Gaps */}
      {showGaps && gaps.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Knowledge Gaps Identified
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{gap.topic}</h4>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getGapSeverityColor(gap.severity)}`}
                  >
                    {gap.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Missing skill: {gap.skill}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Suggested actions:</p>
                  {gap.suggestedActions.map((action, index) => (
                    <p key={index} className="text-xs text-gray-700">• {action}</p>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Est. time: {gap.estimatedTime}min</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Start Practice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learningPaths.map((path) => (
          <div key={path.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{path.name}</h3>
                <p className="text-sm text-gray-600">{path.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)} text-white`}>
                {path.difficulty}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{path.progress}%</span>
              </div>
              <Progress value={path.progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{path.estimatedDuration} min total</span>
                <span>{path.nodes.length} topics</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4" />
                Continue
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg border p-6">
        {viewMode === 'graph' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Knowledge Graph</h3>
            <div className="border rounded-lg overflow-hidden">
              <svg
                ref={svgRef}
                width={svgSize.width}
                height={svgSize.height}
                className="w-full h-96"
              >
                {/* Draw connections */}
                {showPrerequisites && filteredNodes.map(node => 
                  node.prerequisites.map(prereqId => {
                    const prereq = nodes.find(n => n.id === prereqId);
                    if (!prereq) return null;
                    return (
                      <line
                        key={`${prereqId}-${node.id}`}
                        x1={prereq.x}
                        y1={prereq.y}
                        x2={node.x}
                        y2={node.y}
                        stroke="#d1d5db"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    );
                  })
                )}

                {/* Draw nodes */}
                {filteredNodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill={getNodeColor(node)}
                      stroke="#374151"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedNode(node)}
                    />
                    <text
                      x={node.x}
                      y={node.y - 5}
                      textAnchor="middle"
                      className="text-xs font-medium fill-white"
                    >
                      {node.mastery}%
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className="text-xs font-medium fill-white"
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedNode?.id === node.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{node.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(node.difficulty)} text-white`}>
                      {node.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{node.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Mastery</span>
                      <span className={`font-medium ${getMasteryColor(node.mastery)}`}>
                        {node.mastery}%
                      </span>
                    </div>
                    <Progress value={node.mastery} className="h-1" />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{node.estimatedTime} min</span>
                      <span className={`px-1 py-0.5 rounded text-xs ${
                        node.status === 'completed' ? 'bg-green-100 text-green-800' :
                        node.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        node.status === 'available' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {node.status === 'available' && (
                      <Button size="sm" onClick={() => startLearning(node.id)}>
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    )}
                    {node.status === 'in-progress' && (
                      <Button size="sm" variant="outline" onClick={() => completeNode(node.id)}>
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learning Timeline</h3>
            <div className="space-y-4">
              {filteredNodes
                .filter(node => node.lastStudied)
                .sort((a, b) => (b.lastStudied?.getTime() || 0) - (a.lastStudied?.getTime() || 0))
                .map((node, index) => (
                <div key={node.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{node.title}</h4>
                    <p className="text-sm text-gray-600">
                      Studied {node.lastStudied?.toLocaleDateString()} • 
                      Mastery: {node.mastery}% • 
                      {node.attempts} attempts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(node.mastery)} text-white`}>
                      {node.mastery}%
                    </span>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-3 w-3" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{selectedNode.title}</h3>
              <p className="text-gray-600">{selectedNode.description}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedNode(null)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Mastery Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Mastery</span>
                    <span className={`font-medium ${getMasteryColor(selectedNode.mastery)}`}>
                      {selectedNode.mastery}%
                    </span>
                  </div>
                  <Progress value={selectedNode.mastery} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <div className="space-y-1">
                  {selectedNode.prerequisites.length > 0 ? (
                    selectedNode.prerequisites.map((prereqId, index) => {
                      const prereq = nodes.find(n => n.id === prereqId);
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{prereq?.title || prereqId}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">No prerequisites</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <div className="space-y-2">
                  {selectedNode.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {resource.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className="text-sm font-medium">{resource.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{resource.duration}min</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Next Topics</h4>
                <div className="space-y-1">
                  {selectedNode.nextTopics.map((nextId, index) => {
                    const next = nodes.find(n => n.id === nextId);
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-blue-500" />
                        <span>{next?.title || nextId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                {selectedNode.status === 'available' && (
                  <Button onClick={() => startLearning(selectedNode.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                )}
                {selectedNode.status === 'in-progress' && (
                  <Button onClick={() => completeNode(selectedNode.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
