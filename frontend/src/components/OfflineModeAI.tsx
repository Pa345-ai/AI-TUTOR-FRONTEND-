"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Brain, 
  Cpu, 
  HardDrive, 
  Zap, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  RefreshCw,
  FileText,
  Target,
  Activity,
  Search,
  Image,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AIModel {
  id: string;
  name: string;
  size: string;
  type: 'text' | 'image' | 'speech' | 'multimodal';
  accuracy: number;
  speed: number;
  memoryUsage: number;
  capabilities: string[];
  status: 'downloaded' | 'downloading' | 'available' | 'error';
  downloadProgress: number;
  lastUsed: Date;
  version: string;
  description: string;
  requirements: {
    minRAM: number;
    minStorage: number;
    supportedFormats: string[];
  };
}

interface OfflineSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  modelsUsed: string[];
  tasksCompleted: number;
  dataProcessed: number;
  accuracy: number;
  efficiency: number;
}

interface OfflineCapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'unavailable' | 'limited';
  models: string[];
  requirements: string[];
  benefits: string[];
}

interface OfflineStats {
  totalSessions: number;
  totalTime: number;
  modelsDownloaded: number;
  dataProcessed: number;
  averageAccuracy: number;
  efficiency: number;
  storageUsed: number;
  storageAvailable: number;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: Date;
    model: string;
    duration: number;
  }>;
}

export function OfflineModeAI() {
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [currentSession, setCurrentSession] = useState<OfflineSession | null>(null);
  const [stats, setStats] = useState<OfflineStats | null>(null);
  const [activeTab, setActiveTab] = useState<'models' | 'capabilities' | 'sessions' | 'settings'>('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const capabilities: OfflineCapability[] = [
    {
      id: 'text-generation',
      name: 'Text Generation',
      description: 'Generate text, summaries, and responses using on-device models',
      icon: <FileText className="h-6 w-6" />,
      status: 'available',
      models: ['text-model-1', 'text-model-2'],
      requirements: ['2GB RAM', '1GB Storage'],
      benefits: ['Privacy', 'Speed', 'No Internet Required']
    },
    {
      id: 'image-analysis',
      name: 'Image Analysis',
      description: 'Analyze and describe images using computer vision models',
      icon: <Image className="h-6 w-6" />,
      status: 'available',
      models: ['vision-model-1', 'vision-model-2'],
      requirements: ['4GB RAM', '2GB Storage'],
      benefits: ['Visual Learning', 'Accessibility', 'Offline Processing']
    },
    {
      id: 'speech-recognition',
      name: 'Speech Recognition',
      description: 'Convert speech to text and analyze audio content',
      icon: <Mic className="h-6 w-6" />,
      status: 'available',
      models: ['speech-model-1', 'speech-model-2'],
      requirements: ['3GB RAM', '1.5GB Storage'],
      benefits: ['Voice Commands', 'Accessibility', 'Real-time Processing']
    },
    {
      id: 'multimodal',
      name: 'Multimodal AI',
      description: 'Process text, images, and audio together for complex tasks',
      icon: <Brain className="h-6 w-6" />,
      status: 'limited',
      models: ['multimodal-model-1'],
      requirements: ['8GB RAM', '4GB Storage'],
      benefits: ['Advanced Learning', 'Complex Analysis', 'Comprehensive Understanding']
    }
  ];

  useEffect(() => {
    initializeOfflineMode();
    checkConnectionStatus();
  }, []);

  const initializeOfflineMode = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleModels: AIModel[] = [
      {
        id: 'text-model-1',
        name: 'GPT-2 Small',
        size: '500MB',
        type: 'text',
        accuracy: 85,
        speed: 90,
        memoryUsage: 2,
        capabilities: ['Text Generation', 'Summarization', 'Question Answering'],
        status: 'downloaded',
        downloadProgress: 100,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        version: '1.0.0',
        description: 'Lightweight text generation model for basic tasks',
        requirements: {
          minRAM: 2,
          minStorage: 1,
          supportedFormats: ['txt', 'md', 'json']
        }
      },
      {
        id: 'vision-model-1',
        name: 'MobileNet V2',
        size: '1.2GB',
        type: 'image',
        accuracy: 78,
        speed: 85,
        memoryUsage: 4,
        capabilities: ['Image Classification', 'Object Detection', 'Visual Description'],
        status: 'downloaded',
        downloadProgress: 100,
        lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
        version: '2.1.0',
        description: 'Efficient computer vision model for mobile devices',
        requirements: {
          minRAM: 4,
          minStorage: 2,
          supportedFormats: ['jpg', 'png', 'webp']
        }
      },
      {
        id: 'speech-model-1',
        name: 'Whisper Tiny',
        size: '800MB',
        type: 'speech',
        accuracy: 82,
        speed: 88,
        memoryUsage: 3,
        capabilities: ['Speech Recognition', 'Audio Transcription', 'Language Detection'],
        status: 'downloading',
        downloadProgress: 65,
        lastUsed: new Date(),
        version: '1.5.0',
        description: 'Compact speech recognition model for real-time processing',
        requirements: {
          minRAM: 3,
          minStorage: 1.5,
          supportedFormats: ['wav', 'mp3', 'm4a']
        }
      },
      {
        id: 'multimodal-model-1',
        name: 'CLIP Base',
        size: '2.5GB',
        type: 'multimodal',
        accuracy: 88,
        speed: 75,
        memoryUsage: 8,
        capabilities: ['Image-Text Understanding', 'Visual Question Answering', 'Content Moderation'],
        status: 'available',
        downloadProgress: 0,
        lastUsed: new Date(),
        version: '1.0.0',
        description: 'Multimodal model for understanding images and text together',
        requirements: {
          minRAM: 8,
          minStorage: 4,
          supportedFormats: ['jpg', 'png', 'txt', 'md']
        }
      }
    ];
    
    const sampleStats: OfflineStats = {
      totalSessions: 45,
      totalTime: 2340,
      modelsDownloaded: 3,
      dataProcessed: 15600,
      averageAccuracy: 83.5,
      efficiency: 87.2,
      storageUsed: 4.2,
      storageAvailable: 15.8,
      recentActivity: [
        {
          id: 'a1',
          action: 'Text Generation',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          model: 'GPT-2 Small',
          duration: 2.5
        },
        {
          id: 'a2',
          action: 'Image Analysis',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          model: 'MobileNet V2',
          duration: 1.8
        }
      ]
    };
    
    setModels(sampleModels);
    setStats(sampleStats);
  }, []);

  const checkConnectionStatus = useCallback(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    
    if (!online) {
      setIsOfflineMode(true);
      startOfflineSession();
    }
  }, []);

  const startOfflineSession = useCallback(() => {
    const session: OfflineSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      modelsUsed: [],
      tasksCompleted: 0,
      dataProcessed: 0,
      accuracy: 0,
      efficiency: 0
    };
    
    setCurrentSession(session);
  }, []);

  const downloadModel = useCallback(async (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'downloading' as const, downloadProgress: 0 }
        : model
    ));
    
    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, downloadProgress: progress }
          : model
      ));
    }
    
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: 'downloaded' as const, downloadProgress: 100 }
        : model
    ));
  }, []);

  const useModel = useCallback(async (modelId: string, task: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate model usage
      const model = models.find(m => m.id === modelId);
      if (model) {
        setModels(prev => prev.map(m => 
          m.id === modelId 
            ? { ...m, lastUsed: new Date() }
            : m
        ));
        
        if (currentSession) {
          setCurrentSession(prev => prev ? {
            ...prev,
            modelsUsed: [...new Set([...prev.modelsUsed, modelId])],
            tasksCompleted: prev.tasksCompleted + 1,
            dataProcessed: prev.dataProcessed + Math.random() * 100
          } : null);
        }
      }
      
    } catch (error) {
      console.error('Error using model:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [models, currentSession]);

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    if (!isOfflineMode) {
      startOfflineSession();
    } else {
      setCurrentSession(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded': return 'text-green-600 bg-green-100';
      case 'downloading': return 'text-blue-600 bg-blue-100';
      case 'available': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCapabilityStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'limited': return 'text-yellow-600 bg-yellow-100';
      case 'unavailable': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Offline Mode + On-Device AI
          </h1>
          <p className="text-gray-600">Powerful AI capabilities that work without internet connection</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Connection Status & Offline Toggle */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Connection Status</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {isOnline ? 'Connected to internet' : 'Working offline'}
            </div>
            <button
              onClick={toggleOfflineMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                isOfflineMode ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOfflineMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {currentSession && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-900">Active Offline Session</h4>
                <p className="text-sm text-purple-700">
                  Started {currentSession.startTime.toLocaleTimeString()} • 
                  {currentSession.tasksCompleted} tasks completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-700">
                  Models used: {currentSession.modelsUsed.length}
                </div>
                <div className="text-sm text-purple-700">
                  Data processed: {currentSession.dataProcessed.toFixed(1)}MB
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSessions}</div>
            <div className="text-gray-600">Offline Sessions</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.modelsDownloaded}</div>
            <div className="text-gray-600">Models Downloaded</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageAccuracy.toFixed(1)}%</div>
            <div className="text-gray-600">Average Accuracy</div>
          </div>
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.storageUsed}GB</div>
            <div className="text-gray-600">Storage Used</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'models', label: 'AI Models', icon: <Cpu className="h-4 w-4" /> },
          { id: 'capabilities', label: 'Capabilities', icon: <Zap className="h-4 w-4" /> },
          { id: 'sessions', label: 'Sessions', icon: <Clock className="h-4 w-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="speech">Speech</option>
                  <option value="multimodal">Multimodal</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models
              .filter(model => 
                (searchQuery === '' || model.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (filterType === 'all' || model.type === filterType)
              )
              .map((model) => (
                <div key={model.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <p className="text-gray-600 text-sm">{model.type} • {model.size}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(model.status)}`}>
                      {model.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      <span>Accuracy: {model.accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="h-4 w-4" />
                      <span>Speed: {model.speed}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <HardDrive className="h-4 w-4" />
                      <span>Memory: {model.memoryUsage}GB</span>
                    </div>
                  </div>
                  
                  {model.status === 'downloading' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Downloading...</span>
                        <span>{model.downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${model.downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Version {model.version}
                    </div>
                    <div className="flex gap-2">
                      {model.status === 'available' && (
                        <Button 
                          size="sm" 
                          onClick={() => downloadModel(model.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {model.status === 'downloaded' && (
                        <Button 
                          size="sm"
                          onClick={() => useModel(model.id, 'test')}
                          disabled={isProcessing}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Capabilities Tab */}
      {activeTab === 'capabilities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((capability) => (
              <div key={capability.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 rounded-full ${getCapabilityStatusColor(capability.status)}`}>
                    {capability.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{capability.name}</h3>
                    <p className="text-gray-600 text-sm">{capability.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getCapabilityStatusColor(capability.status)}`}>
                    {capability.status}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {capability.requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {capability.benefits.map((benefit, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Available Models:</h4>
                    <div className="text-sm text-gray-600">
                      {capability.models.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && stats && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-600">
                      {activity.model} • {activity.duration}s • {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Offline Mode Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-download models</h4>
                  <p className="text-sm text-gray-600">Automatically download recommended models</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Background processing</h4>
                  <p className="text-sm text-gray-600">Process tasks in background when offline</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data compression</h4>
                  <p className="text-sm text-gray-600">Compress data to save storage space</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Storage Management</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Used: {stats?.storageUsed}GB</span>
                    <span>Available: {stats?.storageAvailable}GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${((stats?.storageUsed || 0) / ((stats?.storageUsed || 0) + (stats?.storageAvailable || 0))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
