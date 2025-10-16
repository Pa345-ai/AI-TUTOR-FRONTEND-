'use client'

import React, { useState, useEffect } from 'react'
import { Code, Download, BookOpen, Play, Settings, Plus, RefreshCw, ExternalLink, Copy, Star, Users, Zap, Globe } from 'lucide-react'

interface DeveloperAccount {
  id: string
  userId: string
  organizationName: string
  organizationType: string
  websiteUrl: string
  description: string
  verificationStatus: string
  apiQuotaPerMonth: number
  currentMonthUsage: number
  billingTier: string
  createdAt: string
}

interface SDKDownload {
  id: string
  developerId: string
  sdkName: string
  sdkVersion: string
  platform: string
  downloadCount: number
  createdAt: string
}

interface DeveloperResource {
  id: string
  resourceType: string
  title: string
  content: string
  contentUrl: string
  category: string
  difficultyLevel: string
  tags: string[]
  viewCount: number
  helpfulVotes: number
  isFeatured: boolean
  createdAt: string
}

export default function DeveloperTools() {
  const [developerAccount, setDeveloperAccount] = useState<DeveloperAccount | null>(null)
  const [sdkDownloads, setSDKDownloads] = useState<SDKDownload[]>([])
  const [resources, setResources] = useState<DeveloperResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'sdk' | 'documentation' | 'examples' | 'community'>('overview')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDeveloperData()
  }, [])

  const loadDeveloperData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockDeveloperAccount: DeveloperAccount = {
        id: '1',
        userId: 'user1',
        organizationName: 'EduTech Solutions',
        organizationType: 'startup',
        websiteUrl: 'https://edutech-solutions.com',
        description: 'Building innovative educational technology solutions',
        verificationStatus: 'verified',
        apiQuotaPerMonth: 100000,
        currentMonthUsage: 45230,
        billingTier: 'professional',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const mockSDKDownloads: SDKDownload[] = [
        {
          id: '1',
          developerId: '1',
          sdkName: 'python',
          sdkVersion: '2.1.0',
          platform: 'linux',
          downloadCount: 1250,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          developerId: '1',
          sdkName: 'javascript',
          sdkVersion: '1.8.0',
          platform: 'web',
          downloadCount: 890,
          createdAt: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          developerId: '1',
          sdkName: 'java',
          sdkVersion: '1.5.0',
          platform: 'windows',
          downloadCount: 650,
          createdAt: '2024-01-15T08:45:00Z'
        }
      ]

      const mockResources: DeveloperResource[] = [
        {
          id: '1',
          resourceType: 'documentation',
          title: 'Getting Started with OmniMind SDK',
          content: 'Complete guide to building your first AI learning module',
          contentUrl: 'https://docs.omnimind.ai/getting-started',
          category: 'getting_started',
          difficultyLevel: 'beginner',
          tags: ['sdk', 'tutorial', 'beginner'],
          viewCount: 1250,
          helpfulVotes: 89,
          isFeatured: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          resourceType: 'tutorial',
          title: 'Building a Math Plugin',
          content: 'Step-by-step tutorial for creating a mathematics learning plugin',
          contentUrl: 'https://docs.omnimind.ai/tutorials/math-plugin',
          category: 'tutorials',
          difficultyLevel: 'intermediate',
          tags: ['math', 'plugin', 'tutorial'],
          viewCount: 890,
          helpfulVotes: 67,
          isFeatured: false,
          createdAt: '2024-01-05T00:00:00Z'
        },
        {
          id: '3',
          resourceType: 'example',
          title: 'Chemistry Lab Integration',
          content: 'Example code for integrating with virtual chemistry labs',
          contentUrl: 'https://github.com/omnimind/examples/chemistry-lab',
          category: 'examples',
          difficultyLevel: 'advanced',
          tags: ['chemistry', 'integration', 'example'],
          viewCount: 650,
          helpfulVotes: 45,
          isFeatured: true,
          createdAt: '2024-01-08T00:00:00Z'
        },
        {
          id: '4',
          resourceType: 'guide',
          title: 'API Rate Limiting Best Practices',
          content: 'Guide to implementing proper rate limiting in your integrations',
          contentUrl: 'https://docs.omnimind.ai/guides/rate-limiting',
          category: 'best_practices',
          difficultyLevel: 'intermediate',
          tags: ['api', 'rate_limiting', 'best_practices'],
          viewCount: 420,
          helpfulVotes: 34,
          isFeatured: false,
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '5',
          resourceType: 'template',
          title: 'Plugin Boilerplate Template',
          content: 'Ready-to-use template for creating new AI learning plugins',
          contentUrl: 'https://github.com/omnimind/plugin-template',
          category: 'templates',
          difficultyLevel: 'beginner',
          tags: ['template', 'boilerplate', 'plugin'],
          viewCount: 780,
          helpfulVotes: 56,
          isFeatured: true,
          createdAt: '2024-01-12T00:00:00Z'
        }
      ]

      setDeveloperAccount(mockDeveloperAccount)
      setSDKDownloads(mockSDKDownloads)
      setResources(mockResources)
    } catch (error) {
      console.error('Failed to load developer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadSDK = async (sdkName: string, platform: string) => {
    try {
      // Simulate SDK download
      console.log(`Downloading ${sdkName} SDK for ${platform}`)
      // In real implementation, this would trigger an actual download
    } catch (error) {
      console.error('Failed to download SDK:', error)
    }
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation':
        return BookOpen
      case 'tutorial':
        return Play
      case 'example':
        return Code
      case 'guide':
        return Settings
      case 'template':
        return Copy
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting_started':
        return 'bg-blue-100 text-blue-800'
      case 'tutorials':
        return 'bg-green-100 text-green-800'
      case 'examples':
        return 'bg-purple-100 text-purple-800'
      case 'best_practices':
        return 'bg-orange-100 text-orange-800'
      case 'templates':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBillingTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800'
      case 'basic':
        return 'bg-blue-100 text-blue-800'
      case 'professional':
        return 'bg-purple-100 text-purple-800'
      case 'enterprise':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory
    const matchesDifficulty = filterDifficulty === 'all' || resource.difficultyLevel === filterDifficulty
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading developer tools...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer Tools</h2>
        <p className="text-gray-600">
          Complete SDK, documentation, and resources for building AI-powered learning solutions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Code },
            { id: 'sdk', label: 'SDK Downloads', icon: Download },
            { id: 'documentation', label: 'Documentation', icon: BookOpen },
            { id: 'examples', label: 'Examples', icon: Play },
            { id: 'community', label: 'Community', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Developer Account Status */}
          {developerAccount && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Code className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{developerAccount.organizationName}</h3>
                    <p className="text-sm text-gray-500">{developerAccount.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBillingTierColor(developerAccount.billingTier)}`}>
                        {developerAccount.billingTier}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        developerAccount.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {developerAccount.verificationStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-indigo-600">
                    {developerAccount.currentMonthUsage.toLocaleString()}/{developerAccount.apiQuotaPerMonth.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">API calls this month</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">API Usage</span>
                    <span className="font-semibold">
                      {Math.round(developerAccount.currentMonthUsage / developerAccount.apiQuotaPerMonth * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${developerAccount.currentMonthUsage / developerAccount.apiQuotaPerMonth * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Organization Type</div>
                    <div className="font-semibold capitalize">{developerAccount.organizationType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Website</div>
                    <div className="font-semibold">
                      <a href={developerAccount.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {developerAccount.websiteUrl}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{sdkDownloads.length}</div>
              <div className="text-sm text-gray-600">SDK Downloads</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {resources.reduce((acc, resource) => acc + resource.viewCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {resources.reduce((acc, resource) => acc + resource.helpfulVotes, 0)}
              </div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                <Download className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Download SDK</div>
                  <div className="text-sm text-gray-500">Get the latest SDK for your platform</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">View Documentation</div>
                  <div className="text-sm text-gray-500">Comprehensive API and SDK docs</div>
                </div>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                <Play className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Try Examples</div>
                  <div className="text-sm text-gray-500">Run sample code and tutorials</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sdk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sdkDownloads.map((sdk) => (
              <div key={sdk.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Code className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg capitalize">{sdk.sdkName} SDK</h3>
                      <p className="text-sm text-gray-500">v{sdk.sdkVersion}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sdk.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">
                      {sdk.downloadCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">downloads</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Version</div>
                      <div className="font-semibold">{sdk.sdkVersion}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Platform</div>
                      <div className="font-semibold capitalize">{sdk.platform}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-500 mb-1">Features</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Full API support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Type definitions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Examples included</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => downloadSDK(sdk.sdkName, sdk.platform)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documentation' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="getting_started">Getting Started</option>
                    <option value="tutorials">Tutorials</option>
                    <option value="examples">Examples</option>
                    <option value="best_practices">Best Practices</option>
                    <option value="templates">Templates</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResources.map((resource) => {
              const ResourceIcon = getResourceTypeIcon(resource.resourceType)
              
              return (
                <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <ResourceIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                            {resource.category.replace('_', ' ')}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficultyLevel)}`}>
                            {resource.difficultyLevel}
                          </span>
                          {resource.isFeatured && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-indigo-600">
                        {resource.viewCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{resource.content}</p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{resource.helpfulVotes}</span>
                        </div>
                        <div className="text-gray-500">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-indigo-600 font-medium">
                        {resource.resourceType}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Resource</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Code Examples</h3>
            <p className="text-green-700 mb-4">
              Interactive code examples and tutorials to help you get started quickly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Basic Plugin</h4>
                <div className="text-sm text-green-700 mb-2">Create a simple learning module</div>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                  <div>from omnimind import Plugin</div>
                  <div>plugin = Plugin("math-tutor")</div>
                  <div>plugin.add_lesson("algebra")</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">API Integration</h4>
                <div className="text-sm text-green-700 mb-2">Connect to external learning platforms</div>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                  <div>import omnimind.api as api</div>
                  <div>client = api.Client(api_key)</div>
                  <div>data = client.get_learning_data()</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Developer Forum</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect with other developers, ask questions, and share your projects.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Forum
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get real-time help from our community and support team.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Start Chat
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Showcase</h3>
              <p className="text-gray-600 text-sm mb-4">
                Share your AI learning plugins and get feedback from the community.
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                View Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}