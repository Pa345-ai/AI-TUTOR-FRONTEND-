'use client'

import React, { useState, useEffect } from 'react'
import { Globe, Key, BarChart3, Settings, Plus, RefreshCw, Eye, Edit, Trash2, Play, Pause, Copy, ExternalLink } from 'lucide-react'

interface APIKey {
  id: string
  keyName: string
  keyValue: string
  keyType: string
  permissions: string[]
  rateLimitPerHour: number
  rateLimitPerDay: number
  usageCount: number
  lastUsedAt: string
  expiresAt: string
  isActive: boolean
  createdAt: string
}

interface PlatformIntegration {
  id: string
  platformName: string
  platformType: string
  integrationType: string
  configuration: any
  webhookUrl: string
  apiEndpoints: string[]
  authenticationMethod: string
  status: string
  lastSyncAt: string
  syncFrequency: string
  errorCount: number
  lastError: string
  createdAt: string
}

interface APIUsageLog {
  id: string
  apiKeyId: string
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs: number
  ipAddress: string
  createdAt: string
}

export default function OpenAPIHub() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([])
  const [usageLogs, setUsageLogs] = useState<APIUsageLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'api_keys' | 'integrations' | 'usage_analytics' | 'documentation'>('api_keys')
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [showCreateIntegration, setShowCreateIntegration] = useState(false)
  const [newKey, setNewKey] = useState({
    keyName: '',
    keyType: 'production',
    permissions: [] as string[],
    rateLimitPerHour: 1000,
    rateLimitPerDay: 10000
  })
  const [newIntegration, setNewIntegration] = useState({
    platformName: '',
    platformType: 'lms',
    integrationType: 'api',
    authenticationMethod: 'api_key'
  })

  useEffect(() => {
    loadAPIHubData()
  }, [])

  const loadAPIHubData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAPIKeys: APIKey[] = [
        {
          id: '1',
          keyName: 'Production API Key',
          keyValue: 'omni_sk_live_1234567890abcdef',
          keyType: 'production',
          permissions: ['read:users', 'write:learning_data', 'read:analytics'],
          rateLimitPerHour: 1000,
          rateLimitPerDay: 10000,
          usageCount: 15420,
          lastUsedAt: '2024-01-15T10:30:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          keyName: 'Development API Key',
          keyValue: 'omni_sk_test_abcdef1234567890',
          keyType: 'development',
          permissions: ['read:users', 'write:learning_data'],
          rateLimitPerHour: 100,
          rateLimitPerDay: 1000,
          usageCount: 2340,
          lastUsedAt: '2024-01-15T09:15:00Z',
          expiresAt: '2024-06-30T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          keyName: 'Webhook Integration Key',
          keyValue: 'omni_wh_webhook_9876543210fedcba',
          keyType: 'production',
          permissions: ['webhook:events'],
          rateLimitPerHour: 500,
          rateLimitPerDay: 5000,
          usageCount: 890,
          lastUsedAt: '2024-01-14T16:45:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-05T00:00:00Z'
        }
      ]

      const mockIntegrations: PlatformIntegration[] = [
        {
          id: '1',
          platformName: 'Canvas LMS',
          platformType: 'lms',
          integrationType: 'api',
          configuration: {
            baseUrl: 'https://canvas.instructure.com',
            version: 'v1',
            timeout: 30000
          },
          webhookUrl: '',
          apiEndpoints: ['/api/v1/courses', '/api/v1/users', '/api/v1/assignments'],
          authenticationMethod: 'oauth2',
          status: 'active',
          lastSyncAt: '2024-01-15T10:00:00Z',
          syncFrequency: 'realtime',
          errorCount: 0,
          lastError: '',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          platformName: 'Moodle',
          platformType: 'lms',
          integrationType: 'webhook',
          configuration: {
            webhookSecret: 'moodle_webhook_secret_123',
            events: ['course_completed', 'grade_updated', 'user_enrolled']
          },
          webhookUrl: 'https://moodle.example.com/webhook/omnimind',
          apiEndpoints: [],
          authenticationMethod: 'webhook_signature',
          status: 'active',
          lastSyncAt: '2024-01-15T09:30:00Z',
          syncFrequency: 'realtime',
          errorCount: 2,
          lastError: 'Connection timeout',
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          platformName: 'Workday Learning',
          platformType: 'hr_system',
          integrationType: 'sso',
          configuration: {
            ssoProvider: 'saml',
            entityId: 'workday-learning',
            certificate: 'workday_cert.pem'
          },
          webhookUrl: '',
          apiEndpoints: ['/api/learning/records', '/api/users/profile'],
          authenticationMethod: 'saml',
          status: 'active',
          lastSyncAt: '2024-01-15T08:15:00Z',
          syncFrequency: 'daily',
          errorCount: 0,
          lastError: '',
          createdAt: '2024-01-03T00:00:00Z'
        },
        {
          id: '4',
          platformName: 'Salesforce Trailhead',
          platformType: 'corporate_training',
          integrationType: 'api',
          configuration: {
            baseUrl: 'https://api.trailhead.com',
            version: 'v2',
            timeout: 30000
          },
          webhookUrl: '',
          apiEndpoints: ['/api/v2/trails', '/api/v2/modules', '/api/v2/badges'],
          authenticationMethod: 'oauth2',
          status: 'active',
          lastSyncAt: '2024-01-15T07:45:00Z',
          syncFrequency: 'hourly',
          errorCount: 1,
          lastError: 'Rate limit exceeded',
          createdAt: '2024-01-04T00:00:00Z'
        }
      ]

      const mockUsageLogs: APIUsageLog[] = [
        {
          id: '1',
          apiKeyId: '1',
          endpoint: '/api/v1/learning-progress',
          method: 'GET',
          statusCode: 200,
          responseTimeMs: 145,
          ipAddress: '192.168.1.100',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          apiKeyId: '1',
          endpoint: '/api/v1/users/123/analytics',
          method: 'POST',
          statusCode: 201,
          responseTimeMs: 234,
          ipAddress: '192.168.1.100',
          createdAt: '2024-01-15T10:29:00Z'
        },
        {
          id: '3',
          apiKeyId: '2',
          endpoint: '/api/v1/learning-modules',
          method: 'GET',
          statusCode: 200,
          responseTimeMs: 89,
          ipAddress: '10.0.0.50',
          createdAt: '2024-01-15T10:28:00Z'
        }
      ]

      setAPIKeys(mockAPIKeys)
      setIntegrations(mockIntegrations)
      setUsageLogs(mockUsageLogs)
    } catch (error) {
      console.error('Failed to load API Hub data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createAPIKey = async () => {
    try {
      const newKeyData: APIKey = {
        id: Date.now().toString(),
        keyName: newKey.keyName,
        keyValue: `omni_sk_${newKey.keyType}_${Math.random().toString(36).substring(2, 15)}`,
        keyType: newKey.keyType,
        permissions: newKey.permissions,
        rateLimitPerHour: newKey.rateLimitPerHour,
        rateLimitPerDay: newKey.rateLimitPerDay,
        usageCount: 0,
        lastUsedAt: '',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString()
      }

      setAPIKeys([newKeyData, ...apiKeys])
      setNewKey({
        keyName: '',
        keyType: 'production',
        permissions: [],
        rateLimitPerHour: 1000,
        rateLimitPerDay: 10000
      })
      setShowCreateKey(false)
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const createIntegration = async () => {
    try {
      const newIntegrationData: PlatformIntegration = {
        id: Date.now().toString(),
        platformName: newIntegration.platformName,
        platformType: newIntegration.platformType,
        integrationType: newIntegration.integrationType,
        configuration: {},
        webhookUrl: '',
        apiEndpoints: [],
        authenticationMethod: newIntegration.authenticationMethod,
        status: 'pending',
        lastSyncAt: '',
        syncFrequency: 'realtime',
        errorCount: 0,
        lastError: '',
        createdAt: new Date().toISOString()
      }

      setIntegrations([newIntegrationData, ...integrations])
      setNewIntegration({
        platformName: '',
        platformType: 'lms',
        integrationType: 'api',
        authenticationMethod: 'api_key'
      })
      setShowCreateIntegration(false)
    } catch (error) {
      console.error('Failed to create integration:', error)
    }
  }

  const copyAPIKey = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue)
    // You could add a toast notification here
  }

  const getKeyTypeColor = (type: string) => {
    switch (type) {
      case 'production':
        return 'bg-green-100 text-green-800'
      case 'development':
        return 'bg-blue-100 text-blue-800'
      case 'sandbox':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformTypeColor = (type: string) => {
    switch (type) {
      case 'lms':
        return 'bg-blue-100 text-blue-800'
      case 'hr_system':
        return 'bg-purple-100 text-purple-800'
      case 'corporate_training':
        return 'bg-green-100 text-green-800'
      case 'edtech':
        return 'bg-orange-100 text-orange-800'
      case 'crm':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Open API Hub...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Open API Hub</h2>
            <p className="text-gray-600">
              Other ed-tech, HR, or corporate learning platforms can integrate your intelligence core.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateKey(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create API Key</span>
            </button>
            <button
              onClick={() => setShowCreateIntegration(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Integration</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'api_keys', label: 'API Keys', count: apiKeys.length },
              { id: 'integrations', label: 'Integrations', count: integrations.length },
              { id: 'usage_analytics', label: 'Usage Analytics', count: usageLogs.length },
              { id: 'documentation', label: 'Documentation', count: 0 }
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

      {/* Create API Key Form */}
      {showCreateKey && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
              <input
                type="text"
                value={newKey.keyName}
                onChange={(e) => setNewKey({ ...newKey, keyName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter key name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Type</label>
              <select
                value={newKey.keyType}
                onChange={(e) => setNewKey({ ...newKey, keyType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="development">Development</option>
                <option value="production">Production</option>
                <option value="sandbox">Sandbox</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (per hour)</label>
              <input
                type="number"
                value={newKey.rateLimitPerHour}
                onChange={(e) => setNewKey({ ...newKey, rateLimitPerHour: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (per day)</label>
              <input
                type="number"
                value={newKey.rateLimitPerDay}
                onChange={(e) => setNewKey({ ...newKey, rateLimitPerDay: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateKey(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createAPIKey}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Key
            </button>
          </div>
        </div>
      )}

      {/* Create Integration Form */}
      {showCreateIntegration && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input
                type="text"
                value={newIntegration.platformName}
                onChange={(e) => setNewIntegration({ ...newIntegration, platformName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter platform name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Type</label>
              <select
                value={newIntegration.platformType}
                onChange={(e) => setNewIntegration({ ...newIntegration, platformType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="lms">LMS</option>
                <option value="hr_system">HR System</option>
                <option value="corporate_training">Corporate Training</option>
                <option value="edtech">EdTech</option>
                <option value="crm">CRM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Integration Type</label>
              <select
                value={newIntegration.integrationType}
                onChange={(e) => setNewIntegration({ ...newIntegration, integrationType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="sso">SSO</option>
                <option value="data_sync">Data Sync</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Method</label>
              <select
                value={newIntegration.authenticationMethod}
                onChange={(e) => setNewIntegration({ ...newIntegration, authenticationMethod: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="api_key">API Key</option>
                <option value="oauth2">OAuth2</option>
                <option value="basic_auth">Basic Auth</option>
                <option value="jwt">JWT</option>
                <option value="saml">SAML</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateIntegration(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createIntegration}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Integration
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'api_keys' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {apiKeys.map((key) => (
              <div key={key.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Key className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{key.keyName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getKeyTypeColor(key.keyType)}`}>
                          {key.keyType}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">
                      {key.usageCount.toLocaleString()} calls
                    </div>
                    <div className="text-xs text-gray-500">
                      Last used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">API Key</div>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {key.keyValue}
                      </code>
                      <button
                        onClick={() => copyAPIKey(key.keyValue)}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Rate Limit (hour)</div>
                      <div className="font-semibold">{key.rateLimitPerHour.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Rate Limit (day)</div>
                      <div className="font-semibold">{key.rateLimitPerDay.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.platformName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPlatformTypeColor(integration.platformType)}`}>
                          {integration.platformType.replace('_', ' ')}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {integration.errorCount} errors
                    </div>
                    <div className="text-xs text-gray-500">
                      Last sync: {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Integration Type</div>
                      <div className="font-semibold capitalize">{integration.integrationType}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Auth Method</div>
                      <div className="font-semibold uppercase">{integration.authenticationMethod}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Sync Frequency</div>
                      <div className="font-semibold capitalize">{integration.syncFrequency}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">API Endpoints</div>
                      <div className="font-semibold">{integration.apiEndpoints.length}</div>
                    </div>
                  </div>

                  {integration.lastError && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-sm font-medium text-red-900 mb-1">Last Error</div>
                      <div className="text-sm text-red-700">{integration.lastError}</div>
                    </div>
                  )}

                  {integration.apiEndpoints.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">API Endpoints</div>
                      <div className="space-y-1">
                        {integration.apiEndpoints.slice(0, 3).map((endpoint, index) => (
                          <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {endpoint}
                          </div>
                        ))}
                        {integration.apiEndpoints.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{integration.apiEndpoints.length - 3} more endpoints
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Test Connection</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
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

      {activeTab === 'usage_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {usageLogs.length.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total API Calls</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(usageLogs.reduce((acc, log) => acc + (log.statusCode >= 200 && log.statusCode < 300 ? 1 : 0), 0) / usageLogs.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(usageLogs.reduce((acc, log) => acc + log.responseTimeMs, 0) / usageLogs.length)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(usageLogs.map(log => log.ipAddress)).size}
              </div>
              <div className="text-sm text-gray-600">Unique IPs</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent API Calls</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usageLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          log.method === 'POST' ? 'bg-green-100 text-green-800' :
                          log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-100 text-green-800' :
                          log.statusCode >= 400 ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.responseTimeMs}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">API Documentation</h3>
            <p className="text-indigo-700 mb-4">
              Comprehensive documentation for integrating with the OmniMind OS platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">Getting Started</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Quick Start Guide</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authentication</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limiting</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">API Reference</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Learning Data API</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Management API</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytics API</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-2">SDKs & Examples</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Python SDK</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JavaScript SDK</span>
                    <span className="text-indigo-600">→</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Examples</span>
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