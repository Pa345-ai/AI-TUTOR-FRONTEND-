"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Database, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Clock, 
  Tag, 
  Link, 
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  Archive,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'concept' | 'fact' | 'skill' | 'experience' | 'connection';
  subject: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  connections: string[];
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  confidence: number; // 0-100
  source?: string;
  notes?: string;
  isArchived: boolean;
  isPrivate: boolean;
}

interface MemoryConnection {
  id: string;
  fromMemoryId: string;
  toMemoryId: string;
  relationship: 'prerequisite' | 'related' | 'contradicts' | 'builds_on' | 'example_of';
  strength: number; // 0-100
  createdAt: Date;
}

interface MemorySearch {
  query: string;
  filters: {
    type?: string;
    subject?: string;
    importance?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    tags?: string[];
  };
  sortBy: 'relevance' | 'date' | 'importance' | 'access_count' | 'confidence';
  sortOrder: 'asc' | 'desc';
}

interface MemoryInsight {
  id: string;
  type: 'gap' | 'connection' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  relatedMemories: string[];
  actionItems?: string[];
}

export function MemorySystem() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [connections, setConnections] = useState<MemoryConnection[]>([]);
  const [insights, setInsights] = useState<MemoryInsight[]>([]);
  const [searchQuery, setSearchQuery] = useState<MemorySearch>({
    query: '',
    filters: {},
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'graph' | 'timeline' | 'insights'>('list');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showPrivate, setShowPrivate] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    initializeMemorySystem();
  }, []);

  const initializeMemorySystem = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleMemories: Memory[] = [
      {
        id: 'mem-1',
        title: 'Quadratic Formula',
        content: 'The quadratic formula x = (-b ± √(b² - 4ac)) / 2a is used to solve quadratic equations of the form ax² + bx + c = 0.',
        type: 'concept',
        subject: 'Mathematics',
        importance: 'high',
        tags: ['algebra', 'quadratic', 'formula', 'equations'],
        connections: ['mem-2', 'mem-3'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        accessCount: 15,
        confidence: 85,
        source: 'Textbook Chapter 5',
        notes: 'Remember to check discriminant first to determine number of solutions',
        isArchived: false,
        isPrivate: false
      },
      {
        id: 'mem-2',
        title: 'Discriminant',
        content: 'The discriminant D = b² - 4ac determines the nature of roots in a quadratic equation. If D > 0: two real roots, D = 0: one real root, D < 0: no real roots.',
        type: 'concept',
        subject: 'Mathematics',
        importance: 'high',
        tags: ['algebra', 'quadratic', 'discriminant', 'roots'],
        connections: ['mem-1', 'mem-4'],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        accessCount: 12,
        confidence: 90,
        source: 'Online Tutorial',
        notes: 'Critical for understanding when quadratic formula applies',
        isArchived: false,
        isPrivate: false
      },
      {
        id: 'mem-3',
        title: 'Completing the Square',
        content: 'Alternative method to solve quadratic equations by transforming ax² + bx + c = 0 into the form (x + h)² = k.',
        type: 'skill',
        subject: 'Mathematics',
        importance: 'medium',
        tags: ['algebra', 'quadratic', 'completing-square', 'method'],
        connections: ['mem-1'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        accessCount: 8,
        confidence: 70,
        source: 'Practice Problems',
        notes: 'Useful when quadratic formula is not applicable',
        isArchived: false,
        isPrivate: false
      },
      {
        id: 'mem-4',
        title: 'Graphing Parabolas',
        content: 'Quadratic functions graph as parabolas. The vertex form y = a(x - h)² + k shows vertex at (h, k) and axis of symmetry at x = h.',
        type: 'skill',
        subject: 'Mathematics',
        importance: 'medium',
        tags: ['algebra', 'quadratic', 'graphing', 'parabola', 'vertex'],
        connections: ['mem-2'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        accessCount: 6,
        confidence: 75,
        source: 'Graphing Software',
        notes: 'Practice with different values of a, h, k',
        isArchived: false,
        isPrivate: false
      },
      {
        id: 'mem-5',
        title: 'Personal Learning Preference',
        content: 'I learn mathematics best through visual representations and step-by-step problem solving rather than pure memorization.',
        type: 'experience',
        subject: 'Learning Style',
        importance: 'high',
        tags: ['learning-style', 'visual', 'step-by-step', 'personal'],
        connections: [],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        accessCount: 3,
        confidence: 95,
        source: 'Self-reflection',
        notes: 'Use this to guide study methods',
        isArchived: false,
        isPrivate: true
      }
    ];

    const sampleConnections: MemoryConnection[] = [
      {
        id: 'conn-1',
        fromMemoryId: 'mem-1',
        toMemoryId: 'mem-2',
        relationship: 'builds_on',
        strength: 90,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'conn-2',
        fromMemoryId: 'mem-1',
        toMemoryId: 'mem-3',
        relationship: 'related',
        strength: 75,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'conn-3',
        fromMemoryId: 'mem-2',
        toMemoryId: 'mem-4',
        relationship: 'prerequisite',
        strength: 80,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    const sampleInsights: MemoryInsight[] = [
      {
        id: 'insight-1',
        type: 'gap',
        title: 'Missing Factoring Knowledge',
        description: 'You have strong knowledge of quadratic formula and discriminant, but limited understanding of factoring methods.',
        confidence: 85,
        relatedMemories: ['mem-1', 'mem-2'],
        actionItems: ['Study factoring techniques', 'Practice factoring quadratics', 'Connect factoring to quadratic formula']
      },
      {
        id: 'insight-2',
        type: 'connection',
        title: 'Strong Quadratic Knowledge Cluster',
        description: 'Your quadratic equation knowledge forms a well-connected cluster with high confidence levels.',
        confidence: 92,
        relatedMemories: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
        actionItems: ['Apply knowledge to word problems', 'Explore advanced quadratic applications']
      },
      {
        id: 'insight-3',
        type: 'pattern',
        title: 'Visual Learning Preference',
        description: 'Your learning style preference aligns with your most confident mathematical concepts.',
        confidence: 88,
        relatedMemories: ['mem-5', 'mem-4'],
        actionItems: ['Continue using visual methods', 'Seek more graphical representations']
      }
    ];

    setMemories(sampleMemories);
    setConnections(sampleConnections);
    setInsights(sampleInsights);
    setIsAnalyzing(false);
  }, []);

  // Search and filter memories
  const filteredMemories = memories.filter(memory => {
    if (!showArchived && memory.isArchived) return false;
    if (!showPrivate && memory.isPrivate) return false;
    
    if (searchQuery.query) {
      const query = searchQuery.query.toLowerCase();
      if (!memory.title.toLowerCase().includes(query) && 
          !memory.content.toLowerCase().includes(query) &&
          !memory.tags.some(tag => tag.toLowerCase().includes(query))) {
        return false;
      }
    }

    if (searchQuery.filters.type && memory.type !== searchQuery.filters.type) return false;
    if (searchQuery.filters.subject && memory.subject !== searchQuery.filters.subject) return false;
    if (searchQuery.filters.importance && memory.importance !== searchQuery.filters.importance) return false;
    if (searchQuery.filters.tags && searchQuery.filters.tags.length > 0) {
      if (!searchQuery.filters.tags.some(tag => memory.tags.includes(tag))) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (searchQuery.sortBy) {
      case 'date':
        return searchQuery.sortOrder === 'asc' 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      case 'importance':
        const importanceOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return searchQuery.sortOrder === 'asc'
          ? importanceOrder[a.importance] - importanceOrder[b.importance]
          : importanceOrder[b.importance] - importanceOrder[a.importance];
      case 'access_count':
        return searchQuery.sortOrder === 'asc'
          ? a.accessCount - b.accessCount
          : b.accessCount - a.accessCount;
      case 'confidence':
        return searchQuery.sortOrder === 'asc'
          ? a.confidence - b.confidence
          : b.confidence - a.confidence;
      default:
        return 0;
    }
  });

  // Get importance color
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept': return 'text-blue-600 bg-blue-100';
      case 'fact': return 'text-green-600 bg-green-100';
      case 'skill': return 'text-purple-600 bg-purple-100';
      case 'experience': return 'text-pink-600 bg-pink-100';
      case 'connection': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Add new memory
  const addMemory = useCallback((memory: Omit<Memory, 'id' | 'createdAt' | 'lastAccessed' | 'accessCount'>) => {
    const newMemory: Memory = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 0
    };
    setMemories(prev => [newMemory, ...prev]);
  }, []);

  // Update memory
  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, ...updates } : memory
    ));
  }, []);

  // Archive memory
  const archiveMemory = useCallback((id: string) => {
    updateMemory(id, { isArchived: true });
  }, [updateMemory]);

  // Delete memory
  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  }, []);

  // Access memory (update access count and last accessed)
  const accessMemory = useCallback((id: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id 
        ? { 
            ...memory, 
            lastAccessed: new Date(), 
            accessCount: memory.accessCount + 1 
          }
        : memory
    ));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          Memory & Long-Term Context
        </h1>
        <p className="text-gray-600">AI-powered memory system with intelligent connections and insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{memories.length}</div>
          <div className="text-gray-600">Total Memories</div>
        </div>
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{connections.length}</div>
          <div className="text-gray-600">Connections</div>
        </div>
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{insights.length}</div>
          <div className="text-gray-600">AI Insights</div>
        </div>
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {Math.round(memories.reduce((acc, mem) => acc + mem.confidence, 0) / memories.length) || 0}%
          </div>
          <div className="text-gray-600">Avg Confidence</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Database className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('graph')}
            >
              <Link className="h-4 w-4" />
              Graph
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Clock className="h-4 w-4" />
              Timeline
            </Button>
            <Button
              variant={viewMode === 'insights' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('insights')}
            >
              <Lightbulb className="h-4 w-4" />
              Insights
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4" />
              {showArchived ? 'Hide' : 'Show'} Archived
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivate(!showPrivate)}
            >
              {showPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPrivate ? 'Hide' : 'Show'} Private
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={initializeMemorySystem}
            disabled={isAnalyzing}
            size="sm"
          >
            <Zap className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Memory
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery.query}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, query: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={searchQuery.filters.type || ''}
            onChange={(e) => setSearchQuery(prev => ({ 
              ...prev, 
              filters: { ...prev.filters, type: e.target.value || undefined }
            }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="concept">Concept</option>
            <option value="fact">Fact</option>
            <option value="skill">Skill</option>
            <option value="experience">Experience</option>
            <option value="connection">Connection</option>
          </select>

          <select
            value={searchQuery.filters.subject || ''}
            onChange={(e) => setSearchQuery(prev => ({ 
              ...prev, 
              filters: { ...prev.filters, subject: e.target.value || undefined }
            }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Language">Language</option>
            <option value="Learning Style">Learning Style</option>
          </select>

          <select
            value={searchQuery.sortBy}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="importance">Importance</option>
            <option value="access_count">Access Count</option>
            <option value="confidence">Confidence</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery(prev => ({ 
              ...prev, 
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {searchQuery.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className={`bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow ${
                selectedMemory?.id === memory.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => {
                setSelectedMemory(memory);
                accessMemory(memory.id);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{memory.title}</h3>
                  <p className="text-gray-600 mb-3">{memory.content}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(memory.type)}`}>
                      {memory.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(memory.importance)}`}>
                      {memory.importance}
                    </span>
                    <span className="text-xs text-gray-500">{memory.subject}</span>
                    {memory.isPrivate && <Lock className="h-3 w-3 text-gray-400" />}
                    {memory.isArchived && <Archive className="h-3 w-3 text-gray-400" />}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Confidence: {memory.confidence}%</span>
                    <span>Accessed: {memory.accessCount} times</span>
                    <span>Last: {memory.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => archiveMemory(memory.id)}>
                    <Archive className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteMemory(memory.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {memory.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                </div>
                <p className="text-gray-600 mb-4">{insight.description}</p>
                
                {insight.actionItems && insight.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Action Items:</h5>
                    <ul className="space-y-1">
                      {insight.actionItems.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Target className="h-3 w-3 text-purple-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Memory Details */}
      {selectedMemory && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{selectedMemory.title}</h3>
              <p className="text-gray-600">{selectedMemory.content}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedMemory(null)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedMemory.type)}`}>
                      {selectedMemory.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Importance:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(selectedMemory.importance)}`}>
                      {selectedMemory.importance}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span>{selectedMemory.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span>{selectedMemory.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Count:</span>
                    <span>{selectedMemory.accessCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{selectedMemory.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Accessed:</span>
                    <span>{selectedMemory.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {selectedMemory.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedMemory.notes}</p>
                </div>
              )}

              {selectedMemory.source && (
                <div>
                  <h4 className="font-medium mb-2">Source</h4>
                  <p className="text-sm text-gray-600">{selectedMemory.source}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedMemory.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Connections</h4>
                <div className="space-y-1">
                  {selectedMemory.connections.map((connId, index) => {
                    const connectedMemory = memories.find(m => m.id === connId);
                    return connectedMemory ? (
                      <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {connectedMemory.title}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Link className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
