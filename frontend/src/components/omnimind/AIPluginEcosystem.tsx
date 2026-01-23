'use client'

import React, { useState, useEffect } from 'react'
import { Plug, Star, Download, Code, Settings, Filter, Search, Plus, Eye, Play, Pause, Trash2, Edit, Share } from 'lucide-react'

interface AIPlugin {
  id: string
  name: string
  description: string
  version: string
  developerId: string
  developerName: string
  pluginType: string
  category: string
  status: string
  pricingModel: string
  price: number
  capabilities: string[]
  requirements: any
  downloadCount: number
  rating: number
  reviewCount: number
  isPublic: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface PluginInstallation {
  id: string
  pluginId: string
  userId: string
  organizationId: string
  installationConfig: any
  status: string
  lastUsedAt: string
  usageCount: number
  createdAt: string
}

export default function AIPluginEcosystem() {
  const [plugins, setPlugins] = useState<AIPlugin[]>([])
  const [installations, setInstallations] = useState<PluginInstallation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my_plugins' | 'installed' | 'develop'>('marketplace')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlugin, setNewPlugin] = useState({
    name: '',
    description: '',
    pluginType: 'learning_module',
    category: 'mathematics',
    pricingModel: 'free',
    price: 0
  })

  useEffect(() => {
    loadPluginData()
  }, [])

  const loadPluginData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPlugins: AIPlugin[] = [
        {
          id: '1',
          name: 'Math Tutor Pro',
          description: 'Advanced mathematics tutoring with step-by-step problem solving and visual explanations',
          version: '1.2.0',
          developerId: 'dev1',
          developerName: 'EduTech Solutions',
          pluginType: 'learning_module',
          category: 'mathematics',
          status: 'approved',
          pricingModel: 'subscription',
          price: 9.99,
          capabilities: ['problem_solving', 'step_by_step', 'visualization', 'assessment'],
          requirements: { minMemory: '512MB', supportedPlatforms: ['web', 'mobile'] },
          downloadCount: 1250,
          rating: 4.8,
          reviewCount: 89,
          isPublic: true,
          isFeatured: true,
          createdAt: '2024-01-10T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          publishedAt: '2024-01-12T09:00:00Z'
        },
        {
          id: '2',
          name: 'Chemistry Lab Simulator',
          description: 'Virtual chemistry experiments with realistic physics and safety protocols',
          version: '2.1.0',
          developerId: 'dev2',
          developerName: 'Science Labs Inc',
          pluginType: 'learning_module',
          category: 'science',
          status: 'approved',
          pricingModel: 'freemium',
          price: 0,
          capabilities: ['experiments', 'safety_mode', 'data_analysis', 'report_generation'],
          requirements: { minMemory: '1GB', supportedPlatforms: ['web', 'vr'] },
          downloadCount: 890,
          rating: 4.6,
          reviewCount: 67,
          isPublic: true,
          isFeatured: false,
          createdAt: '2024-01-08T15:45:00Z',
          updatedAt: '2024-01-14T11:30:00Z',
          publishedAt: '2024-01-09T08:00:00Z'
        },
        {
          id: '3',
          name: 'Language Learning Assistant',
          description: 'AI-powered language learning with conversation practice and pronunciation feedback',
          version: '1.5.0',
          developerId: 'dev3',
          developerName: 'LinguaAI',
          pluginType: 'learning_module',
          category: 'language',
          status: 'approved',
          pricingModel: 'usage_based',
          price: 0.10,
          capabilities: ['conversation', 'pronunciation', 'grammar_check', 'vocabulary'],
          requirements: { minMemory: '256MB', supportedPlatforms: ['web', 'mobile', 'desktop'] },
          downloadCount: 2100,
          rating: 4.9,
          reviewCount: 156,
          isPublic: true,
          isFeatured: true,
          createdAt: '2024-01-05T12:20:00Z',
          updatedAt: '2024-01-13T16:45:00Z',
          publishedAt: '2024-01-06T10:00:00Z'
        },
        {
          id: '4',
          name: 'Code Review Bot',
          description: 'Automated code review and improvement suggestions for programming education',
          version: '3.0.0',
          developerId: 'dev4',
          developerName: 'CodeMasters',
          pluginType: 'assessment_tool',
          category: 'technology',
          status: 'approved',
          pricingModel: 'subscription',
          price: 19.99,
          capabilities: ['code_analysis', 'bug_detection', 'performance_optimization', 'best_practices'],
          requirements: { minMemory: '2GB', supportedPlatforms: ['web', 'desktop'] },
          downloadCount: 750,
          rating: 4.7,
          reviewCount: 45,
          isPublic: true,
          isFeatured: false,
          createdAt: '2024-01-03T09:15:00Z',
          updatedAt: '2024-01-12T13:20:00Z',
          publishedAt: '2024-01-04T14:00:00Z'
        },
        {
          id: '5',
          name: 'History Timeline Builder',
          description: 'Interactive timeline creation for historical events and learning',
          version: '1.0.0',
          developerId: 'dev5',
          developerName: 'HistoryHub',
          pluginType: 'content_generator',
          category: 'history',
          status: 'approved',
          pricingModel: 'free',
          price: 0,
          capabilities: ['timeline_creation', 'event_visualization', 'interactive_learning', 'quiz_generation'],
          requirements: { minMemory: '128MB', supportedPlatforms: ['web'] },
          downloadCount: 450,
          rating: 4.4,
          reviewCount: 23,
          isPublic: true,
          isFeatured: false,
          createdAt: '2024-01-01T11:00:00Z',
          updatedAt: '2024-01-10T15:30:00Z',
          publishedAt: '2024-01-02T09:00:00Z'
        }
      ]

      const mockInstallations: PluginInstallation[] = [
        {
          id: '1',
          pluginId: '1',
          userId: 'user1',
          organizationId: 'org1',
          installationConfig: { theme: 'dark', difficulty: 'advanced' },
          status: 'active',
          lastUsedAt: '2024-01-15T10:30:00Z',
          usageCount: 45,
          createdAt: '2024-01-12T14:20:00Z'
        },
        {
          id: '2',
          pluginId: '3',
          userId: 'user1',
          organizationId: 'org1',
          installationConfig: { language: 'spanish', level: 'intermediate' },
          status: 'active',
          lastUsedAt: '2024-01-15T09:15:00Z',
          usageCount: 23,
          createdAt: '2024-01-10T16:45:00Z'
        }
      ]

      setPlugins(mockPlugins)
      setInstallations(mockInstallations)
    } catch (error) {
      console.error('Failed to load plugin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const installPlugin = async (pluginId: string) => {
    try {
      // Simulate plugin installation
      const newInstallation: PluginInstallation = {
        id: Date.now().toString(),
        pluginId,
        userId: 'user1',
        organizationId: 'org1',
        installationConfig: {},
        status: 'active',
        lastUsedAt: new Date().toISOString(),
        usageCount: 0,
        createdAt: new Date().toISOString()
      }
      
      setInstallations([...installations, newInstallation])
      
      // Update plugin download count
      setPlugins(plugins.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, downloadCount: plugin.downloadCount + 1 }
          : plugin
      ))
    } catch (error) {
      console.error('Failed to install plugin:', error)
    }
  }

  const createPlugin = async () => {
    try {
      const newPluginData: AIPlugin = {
        id: Date.now().toString(),
        name: newPlugin.name,
        description: newPlugin.description,
        version: '1.0.0',
        developerId: 'dev_current',
        developerName: 'Current User',
        pluginType: newPlugin.pluginType,
        category: newPlugin.category,
        status: 'draft',
        pricingModel: newPlugin.pricingModel,
        price: newPlugin.price,
        capabilities: [],
        requirements: {},
        downloadCount: 0,
        rating: 0,
        reviewCount: 0,
        isPublic: false,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: ''
      }

      setPlugins([newPluginData, ...plugins])
      setNewPlugin({ name: '', description: '', pluginType: 'learning_module', category: 'mathematics', pricingModel: 'free', price: 0 })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create plugin:', error)
    }
  }

  const getPluginTypeIcon = (type: string) => {
    switch (type) {
      case 'learning_module':
        return Code
      case 'assessment_tool':
        return Star
      case 'content_generator':
        return Settings
      default:
        return Plug
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mathematics':
        return 'bg-blue-100 text-blue-800'
      case 'science':
        return 'bg-green-100 text-green-800'
      case 'language':
        return 'bg-purple-100 text-purple-800'
      case 'technology':
        return 'bg-orange-100 text-orange-800'
      case 'history':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPricingColor = (model: string) => {
    switch (model) {
      case 'free':
        return 'bg-green-100 text-green-800'
      case 'freemium':
        return 'bg-blue-100 text-blue-800'
      case 'subscription':
        return 'bg-purple-100 text-purple-800'
      case 'usage_based':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = filterCategory === 'all' || plugin.category === filterCategory
    const matchesType = filterType === 'all' || plugin.pluginType === filterType
    const matchesPricing = filterPricing === 'all' || plugin.pricingModel === filterPricing
    const matchesSearch = searchQuery === '' || 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesPricing && matchesSearch
  })

  const installedPluginIds = installations.map(inst => inst.pluginId)
  const myPlugins = plugins.filter(plugin => plugin.developerId === 'dev_current')

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading plugin ecosystem...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Plugin Ecosystem</h2>
            <p className="text-gray-600">
              Let developers build their own learning modules powered by OmniMind. Complete SDK and marketplace.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plugin</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'marketplace', label: 'Marketplace', count: filteredPlugins.length },
              { id: 'my_plugins', label: 'My Plugins', count: myPlugins.length },
              { id: 'installed', label: 'Installed', count: installations.length },
              { id: 'develop', label: 'Developer Tools', count: 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Create Plugin Form */}
      {showCreateForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New AI Plugin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plugin Name</label>
              <input
                type="text"
                value={newPlugin.name}
                onChange={(e) => setNewPlugin({ ...newPlugin, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter plugin name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newPlugin.category}
                onChange={(e) => setNewPlugin({ ...newPlugin, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="language">Language</option>
                <option value="technology">Technology</option>
                <option value="history">History</option>
                <option value="art">Art</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plugin Type</label>
              <select
                value={newPlugin.pluginType}
                onChange={(e) => setNewPlugin({ ...newPlugin, pluginType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="learning_module">Learning Module</option>
                <option value="assessment_tool">Assessment Tool</option>
                <option value="content_generator">Content Generator</option>
                <option value="analytics_engine">Analytics Engine</option>
                <option value="integration_bridge">Integration Bridge</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
              <select
                value={newPlugin.pricingModel}
                onChange={(e) => setNewPlugin({ ...newPlugin, pricingModel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="subscription">Subscription</option>
                <option value="usage_based">Usage Based</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newPlugin.description}
                onChange={(e) => setNewPlugin({ ...newPlugin, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your plugin's functionality"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createPlugin}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Plugin
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search plugins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="language">Language</option>
                    <option value="technology">Technology</option>
                    <option value="history">History</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="learning_module">Learning Module</option>
                    <option value="assessment_tool">Assessment Tool</option>
                    <option value="content_generator">Content Generator</option>
                    <option value="analytics_engine">Analytics Engine</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterPricing}
                    onChange={(e) => setFilterPricing(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Pricing</option>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="subscription">Subscription</option>
                    <option value="usage_based">Usage Based</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Plugins Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => {
              const PluginIcon = getPluginTypeIcon(plugin.pluginType)
              const isInstalled = installedPluginIds.includes(plugin.id)
              
              return (
                <div key={plugin.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <PluginIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plugin.name}</h3>
                        <p className="text-sm text-gray-500">by {plugin.developerName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plugin.category)}`}>
                            {plugin.category}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPricingColor(plugin.pricingModel)}`}>
                            {plugin.pricingModel}
                          </span>
                          {plugin.isFeatured && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {plugin.pricingModel === 'free' ? 'Free' : `$${plugin.price}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {plugin.pricingModel === 'subscription' ? '/month' : plugin.pricingModel === 'usage_based' ? '/use' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{plugin.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Version</span>
                      <span className="font-semibold">{plugin.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Downloads</span>
                      <span className="font-semibold">{plugin.downloadCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{plugin.rating}</span>
                        <span className="text-gray-500">({plugin.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {isInstalled ? (
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <Play className="w-4 h-4" />
                        <span>Use Plugin</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => installPlugin(plugin.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install</span>
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'my_plugins' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myPlugins.map((plugin) => {
              const PluginIcon = getPluginTypeIcon(plugin.pluginType)
              
              return (
                <div key={plugin.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <PluginIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plugin.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            plugin.status === 'approved' ? 'bg-green-100 text-green-800' :
                            plugin.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                            plugin.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {plugin.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plugin.category)}`}>
                            {plugin.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-indigo-600">
                        {plugin.downloadCount} downloads
                      </div>
                      <div className="text-xs text-gray-500">
                        v{plugin.version}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{plugin.description}</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'installed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {installations.map((installation) => {
              const plugin = plugins.find(p => p.id === installation.pluginId)
              if (!plugin) return null
              
              const PluginIcon = getPluginTypeIcon(plugin.pluginType)
              
              return (
                <div key={installation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <PluginIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plugin.name}</h3>
                        <p className="text-sm text-gray-500">by {plugin.developerName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            installation.status === 'active' ? 'bg-green-100 text-green-800' :
                            installation.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {installation.status}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plugin.category)}`}>
                            {plugin.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {installation.usageCount} uses
                      </div>
                      <div className="text-xs text-gray-500">
                        Last used: {new Date(installation.lastUsedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{plugin.description}</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Launch</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'develop' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Developer Resources</h3>
            <p className="text-indigo-700 mb-4">
              Get started building AI-powered learning plugins with our comprehensive SDK and documentation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">SDK Downloads</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Python SDK</span>
                    <span className="text-indigo-600 font-semibold">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JavaScript SDK</span>
                    <span className="text-indigo-600 font-semibold">v1.8.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Java SDK</span>
                    <span className="text-indigo-600 font-semibold">v1.5.0</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">Documentation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>API Reference</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tutorials</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examples</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Community Forum</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Developer Chat</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bug Reports</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}