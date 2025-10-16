"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Download, 
  Upload, 
  Sync, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  Share, 
  Copy, 
  Link, 
  Unlink, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Clock, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send, 
  Zap, 
  Target, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  Brain, 
  BookOpen, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Code, 
  Database, 
  Cloud, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Work, 
  School, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Scissors, 
  Clipboard, 
  CheckSquare, 
  Square, 
  Circle, 
  Dot, 
  Hash, 
  Percent, 
  DollarSign, 
  Euro, 
  Bitcoin, 
  CreditCard, 
  Banknote, 
  Coins, 
  TrendingDown, 
  Activity as ActivityIcon, 
  Zap as ZapIcon, 
  Flame, 
  Snowflake, 
  Sun, 
  Moon, 
  Cloud as CloudIcon, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Waves, 
  Mountain, 
  TreePine, 
  Trees, 
  Flower, 
  Leaf, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Squirrel, 
  Turtle, 
  Butterfly, 
  Bee, 
  Spider, 
  Ant, 
  Ladybug, 
  Dragonfly, 
  Snail, 
  Frog, 
  Lizard, 
  Snake, 
  Crocodile, 
  Penguin, 
  Owl, 
  Eagle, 
  Parrot, 
  Peacock, 
  Flamingo, 
  Toucan, 
  Hummingbird, 
  Robin, 
  Cardinal, 
  Bluebird, 
  Canary, 
  Finch, 
  Sparrow, 
  Crow, 
  Raven, 
  Magpie, 
  Jay, 
  Woodpecker, 
  Kingfisher, 
  Heron, 
  Stork, 
  Crane, 
  Swan, 
  Duck, 
  Goose, 
  Chicken, 
  Rooster, 
  Turkey, 
  Pheasant, 
  Quail, 
  Partridge, 
  Grouse, 
  Ptarmigan, 
  Sandpiper, 
  Plover, 
  Lapwing, 
  Curlew, 
  Snipe, 
  Woodcock, 
  Sanderling, 
  Dunlin, 
  Knot, 
  Turnstone, 
  Oystercatcher, 
  Avocet, 
  Stilt, 
  Godwit, 
  Redshank, 
  Greenshank, 
  Yellowlegs, 
  Willet, 
  Dowitcher, 
  Phalarope, 
  Jaeger, 
  Skua, 
  Gull, 
  Tern, 
  Noddy, 
  Booby, 
  Gannet, 
  Cormorant, 
  Shag, 
  Pelican, 
  Frigatebird, 
  Albatross, 
  Petrel, 
  Shearwater, 
  Fulmar, 
  StormPetrel, 
  DivingPetrel, 
  Prion, 
  Puffin, 
  Auk, 
  Guillemot, 
  Razorbill, 
  Murre, 
  Murrelet, 
  Auklet, 
  Dovekie, 
  Gyrfalcon, 
  Peregrine, 
  Merlin, 
  Kestrel, 
  Hobby, 
  Saker, 
  Lanner, 
  Goshawk, 
  Sparrowhawk, 
  Buzzard, 
  Harrier, 
  Kite, 
  Osprey, 
  Vulture, 
  Condor, 
  Caracara, 
  Falcon, 
  Hawk, 
  Accipiter, 
  Buteo, 
  Circus, 
  Milvus, 
  Haliaeetus, 
  Aquila, 
  Hieraaetus, 
  Spizaetus, 
  Lophaetus, 
  Polemaetus, 
  Stephanoaetus, 
  Morphnus, 
  Harpia, 
  Harpyopsis, 
  Pithecophaga, 
  Spilornis, 
  Gypaetus, 
  Neophron, 
  Gyps, 
  Aegypius, 
  Sarcogyps, 
  Trigonoceps, 
  Necrosyrtes, 
  Torgos, 
  Terathopius, 
  Circaetus, 
  Dryotriorchis, 
  Eutriorchis, 
  Leptodon, 
  Chondrohierax, 
  Elanoides, 
  Gampsonyx, 
  Chelictinia, 
  Elanus, 
  Machaerhamphus, 
  Rostrhamus, 
  Helicolestes, 
  Ictinia, 
  Busarellus, 
  Geranospiza, 
  Leucopternis, 
  Buteogallus, 
  Parabuteo, 
  Geranoaetus, 
  Harpyhaliaetus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'education' | 'communication' | 'storage' | 'social' | 'development' | 'design' | 'analytics' | 'other';
  icon: string;
  color: string;
  isConnected: boolean;
  isActive: boolean;
  lastSync?: Date;
  syncStatus: 'success' | 'error' | 'pending' | 'disabled';
  permissions: string[];
  features: string[];
  apiVersion: string;
  rateLimit: {
    requests: number;
    period: 'hour' | 'day' | 'month';
    remaining: number;
  };
  settings: IntegrationSettings;
  data: IntegrationData;
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  notifications: boolean;
  dataRetention: number; // days
  privacyLevel: 'public' | 'private' | 'restricted';
  allowedActions: string[];
  webhookUrl?: string;
  apiKey?: string;
  customFields: { [key: string]: any };
}

interface IntegrationData {
  totalItems: number;
  lastSyncItems: number;
  errorCount: number;
  successRate: number;
  dataSize: number; // bytes
  lastError?: string;
  syncHistory: SyncEvent[];
}

interface SyncEvent {
  id: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  itemsProcessed: number;
  itemsAdded: number;
  itemsUpdated: number;
  itemsDeleted: number;
  duration: number; // seconds
  errorMessage?: string;
}

interface ExportJob {
  id: string;
  name: string;
  description: string;
  source: string;
  destination: string;
  format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'json' | 'html' | 'md' | 'txt';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  itemsProcessed: number;
  totalItems: number;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  errorMessage?: string;
}

interface ImportJob {
  id: string;
  name: string;
  description: string;
  source: string;
  destination: string;
  format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'json' | 'html' | 'md' | 'txt';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  itemsProcessed: number;
  totalItems: number;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalDataTransferred: number;
  averageSyncTime: number;
  mostUsedIntegrations: { [key: string]: number };
  errorRate: number;
  dataGrowth: number;
}

export function RealToolsIntegration() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeTab, setActiveTab] = useState<'integrations' | 'exports' | 'imports' | 'settings' | 'analytics'>('integrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<IntegrationStats | null>(null);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleIntegrations: Integration[] = [
      {
        id: 'google-docs',
        name: 'Google Docs',
        description: 'Sync notes and documents with Google Docs',
        category: 'productivity',
        icon: '📄',
        color: 'blue',
        isConnected: true,
        isActive: true,
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        syncStatus: 'success',
        permissions: ['read', 'write', 'create', 'delete'],
        features: ['Document sync', 'Real-time collaboration', 'Version history', 'Comments'],
        apiVersion: 'v3',
        rateLimit: {
          requests: 1000,
          period: 'day',
          remaining: 850
        },
        settings: {
          autoSync: true,
          syncInterval: 15,
          notifications: true,
          dataRetention: 365,
          privacyLevel: 'private',
          allowedActions: ['read', 'write', 'create'],
          customFields: {}
        },
        data: {
          totalItems: 45,
          lastSyncItems: 12,
          errorCount: 2,
          successRate: 95.5,
          dataSize: 2048000,
          syncHistory: [
            {
              id: 'sync-1',
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              status: 'success',
              itemsProcessed: 12,
              itemsAdded: 3,
              itemsUpdated: 8,
              itemsDeleted: 1,
              duration: 45
            }
          ]
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'quizlet',
        name: 'Quizlet',
        description: 'Export flashcards and study sets to Quizlet',
        category: 'education',
        icon: '🧠',
        color: 'purple',
        isConnected: true,
        isActive: true,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        syncStatus: 'success',
        permissions: ['read', 'write', 'create'],
        features: ['Flashcard sync', 'Study set creation', 'Progress tracking'],
        apiVersion: 'v1',
        rateLimit: {
          requests: 500,
          period: 'day',
          remaining: 420
        },
        settings: {
          autoSync: false,
          syncInterval: 60,
          notifications: true,
          dataRetention: 180,
          privacyLevel: 'public',
          allowedActions: ['read', 'write', 'create'],
          customFields: {}
        },
        data: {
          totalItems: 23,
          lastSyncItems: 5,
          errorCount: 0,
          successRate: 100,
          dataSize: 512000,
          syncHistory: []
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'notion',
        name: 'Notion',
        description: 'Sync notes and knowledge base with Notion',
        category: 'productivity',
        icon: '📝',
        color: 'gray',
        isConnected: false,
        isActive: false,
        syncStatus: 'disabled',
        permissions: ['read', 'write', 'create'],
        features: ['Page sync', 'Database sync', 'Block-level updates'],
        apiVersion: 'v1',
        rateLimit: {
          requests: 100,
          period: 'hour',
          remaining: 100
        },
        settings: {
          autoSync: false,
          syncInterval: 30,
          notifications: false,
          dataRetention: 90,
          privacyLevel: 'private',
          allowedActions: ['read', 'write'],
          customFields: {}
        },
        data: {
          totalItems: 0,
          lastSyncItems: 0,
          errorCount: 0,
          successRate: 0,
          dataSize: 0,
          syncHistory: []
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'youtube',
        name: 'YouTube',
        description: 'Generate and upload educational videos to YouTube',
        category: 'social',
        icon: '📺',
        color: 'red',
        isConnected: true,
        isActive: false,
        syncStatus: 'error',
        permissions: ['read', 'write', 'create'],
        features: ['Video upload', 'Playlist creation', 'Analytics'],
        apiVersion: 'v3',
        rateLimit: {
          requests: 10000,
          period: 'day',
          remaining: 9500
        },
        settings: {
          autoSync: false,
          syncInterval: 120,
          notifications: true,
          dataRetention: 30,
          privacyLevel: 'public',
          allowedActions: ['read', 'write', 'create'],
          customFields: {}
        },
        data: {
          totalItems: 8,
          lastSyncItems: 0,
          errorCount: 5,
          successRate: 60,
          dataSize: 0,
          lastError: 'API quota exceeded',
          syncHistory: []
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    const sampleExportJobs: ExportJob[] = [
      {
        id: 'export-1',
        name: 'Study Notes to Google Docs',
        description: 'Export all study notes to Google Docs format',
        source: 'AI Tutor',
        destination: 'Google Docs',
        format: 'docx',
        status: 'completed',
        progress: 100,
        itemsProcessed: 25,
        totalItems: 25,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        downloadUrl: 'https://drive.google.com/file/example'
      },
      {
        id: 'export-2',
        name: 'Flashcards to Quizlet',
        description: 'Export math flashcards to Quizlet',
        source: 'AI Tutor',
        destination: 'Quizlet',
        format: 'csv',
        status: 'processing',
        progress: 65,
        itemsProcessed: 130,
        totalItems: 200,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    const sampleImportJobs: ImportJob[] = [
      {
        id: 'import-1',
        name: 'Import from Google Drive',
        description: 'Import documents from Google Drive',
        source: 'Google Drive',
        destination: 'AI Tutor',
        format: 'pdf',
        status: 'completed',
        progress: 100,
        itemsProcessed: 15,
        totalItems: 15,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    const sampleStats: IntegrationStats = {
      totalIntegrations: 12,
      activeIntegrations: 8,
      totalSyncs: 156,
      successfulSyncs: 142,
      failedSyncs: 14,
      totalDataTransferred: 1024000000,
      averageSyncTime: 45,
      mostUsedIntegrations: {
        'google-docs': 45,
        'quizlet': 32,
        'youtube': 28,
        'notion': 15
      },
      errorRate: 8.9,
      dataGrowth: 15.2
    };
    
    setIntegrations(sampleIntegrations);
    setExportJobs(sampleExportJobs);
    setImportJobs(sampleImportJobs);
    setStats(sampleStats);
  }, []);

  const connectIntegration = useCallback(async (integrationId: string) => {
    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              isConnected: true, 
              isActive: true, 
              lastSync: new Date(),
              syncStatus: 'success' as const
            }
          : integration
      ));
      
    } catch (error) {
      console.error('Error connecting integration:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const syncIntegration = useCallback(async (integrationId: string) => {
    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              lastSync: new Date(),
              syncStatus: 'success' as const,
              data: {
                ...integration.data,
                lastSyncItems: Math.floor(Math.random() * 20) + 5,
                successRate: Math.min(100, integration.data.successRate + 1)
              }
            }
          : integration
      ));
      
    } catch (error) {
      console.error('Error syncing integration:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const filteredIntegrations = integrations.filter(integration => 
    (searchQuery === '' || integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || integration.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory === 'all' || integration.category === filterCategory) &&
    (filterStatus === 'all' || integration.syncStatus === filterStatus)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'disabled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <FileText className="h-4 w-4" />;
      case 'education': return <BookOpen className="h-4 w-4" />;
      case 'communication': return <MessageCircle className="h-4 w-4" />;
      case 'storage': return <Cloud className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'development': return <Code className="h-4 w-4" />;
      case 'design': return <Image className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-purple-600" />
            Real Tools Integration
          </h1>
          <p className="text-gray-600">Connect and sync with your favorite productivity and educational tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'integrations', label: 'Integrations', icon: <Globe className="h-4 w-4" /> },
          { id: 'exports', label: 'Exports', icon: <Download className="h-4 w-4" /> },
          { id: 'imports', label: 'Imports', icon: <Upload className="h-4 w-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
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

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Categories</option>
                  <option value="productivity">Productivity</option>
                  <option value="education">Education</option>
                  <option value="communication">Communication</option>
                  <option value="storage">Storage</option>
                  <option value="social">Social</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="pending">Pending</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <p className="text-gray-600 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(integration.syncStatus)}`}>
                    {integration.syncStatus}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getCategoryIcon(integration.category)}
                    <span className="capitalize">{integration.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {integration.lastSync 
                        ? `Last sync: ${integration.lastSync.toLocaleTimeString()}`
                        : 'Never synced'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Database className="h-4 w-4" />
                    <span>{integration.data.totalItems} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{integration.data.successRate}% success rate</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {integration.isConnected ? 'Connected' : 'Not connected'}
                  </div>
                  <div className="flex gap-2">
                    {!integration.isConnected ? (
                      <Button 
                        size="sm" 
                        onClick={() => connectIntegration(integration.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4 mr-1" />
                        )}
                        Connect
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => syncIntegration(integration.id)}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Sync className="h-4 w-4 mr-1" />
                          )}
                          Sync
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exports Tab */}
      {activeTab === 'exports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600" />
                Export Jobs
              </h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Export
              </Button>
            </div>
            
            <div className="space-y-4">
              {exportJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <p className="text-sm text-gray-600">{job.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'completed' ? 'text-green-600 bg-green-100' :
                      job.status === 'processing' ? 'text-blue-600 bg-blue-100' :
                      job.status === 'failed' ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    }`}>
                      {job.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} />
                    <div className="text-sm text-gray-600">
                      {job.itemsProcessed} of {job.totalItems} items processed
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {job.format.toUpperCase()} • {job.source} → {job.destination}
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Imports Tab */}
      {activeTab === 'imports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Import Jobs
              </h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Import
              </Button>
            </div>
            
            <div className="space-y-4">
              {importJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <p className="text-sm text-gray-600">{job.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'completed' ? 'text-green-600 bg-green-100' :
                      job.status === 'processing' ? 'text-blue-600 bg-blue-100' :
                      job.status === 'failed' ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    }`}>
                      {job.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} />
                    <div className="text-sm text-gray-600">
                      {job.itemsProcessed} of {job.totalItems} items processed
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {job.format.toUpperCase()} • {job.source} → {job.destination}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalIntegrations}</div>
              <div className="text-gray-600">Total Integrations</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeIntegrations}</div>
              <div className="text-gray-600">Active Integrations</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalSyncs}</div>
              <div className="text-gray-600">Total Syncs</div>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.successfulSyncs}</div>
              <div className="text-gray-600">Successful Syncs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}