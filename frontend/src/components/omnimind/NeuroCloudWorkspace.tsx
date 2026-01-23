'use client'

import React, { useState, useEffect } from 'react'
import { Cloud, Brain, Upload, Play, Pause, Settings, Plus, RefreshCw, BarChart3, Target, Database, Cpu, AlertCircle, CheckCircle } from 'lucide-react'

interface AIWorkspace {
  id: string
  organizationId: string
  organizationName: string
  workspaceName: string
  description: string
  workspaceType: string
  aiModelType: string
  trainingDataSource: string
  privacyLevel: string
  status: string
  modelConfiguration: any
  trainingProgress: any
  performanceMetrics: any
  dataSources: any[]
  accessPermissions: any
  createdAt: string
  updatedAt: string
  deployedAt: string
}

interface TrainingDataset {
  id: string
  workspaceId: string
  datasetName: string
  description: string
  dataType: string
  fileFormat: string
  fileSizeBytes: number
  recordCount: number
  dataSchema: any
  qualityScore: number
  privacyCompliance: any
  processingStatus: string
  createdAt: string
}

interface ModelTrainingJob {
  id: string
  workspaceId: string
  jobName: string
  trainingConfig: any
  datasetIds: string[]
  modelArchitecture: any
  hyperparameters: any
  status: string
  progressPercentage: number
  currentEpoch: number
  totalEpochs: number
  trainingMetrics: any
  validationMetrics: any
  errorMessage: string
  startedAt: string
  completedAt: string
  estimatedCompletion: string
  createdAt: string
}

interface DeployedModel {
  id: string
  workspaceId: string
  trainingJobId: string
  modelName: string
  modelVersion: string
  modelType: string
  deploymentConfig: any
  apiEndpoint: string
  status: string
  performanceMetrics: any
  usageCount: number
  lastUsedAt: string
  createdAt: string
}

export default function NeuroCloudWorkspace() {
  const [workspaces, setWorkspaces] = useState<AIWorkspace[]>([])
  const [datasets, setDatasets] = useState<TrainingDataset[]>([])
  const [trainingJobs, setTrainingJobs] = useState<ModelTrainingJob[]>([])
  const [deployedModels, setDeployedModels] = useState<DeployedModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'workspaces' | 'datasets' | 'training' | 'models' | 'analytics'>('workspaces')
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [showUploadDataset, setShowUploadDataset] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({
    workspaceName: '',
    description: '',
    workspaceType: 'institutional',
    aiModelType: 'tutor',
    privacyLevel: 'private'
  })

  useEffect(() => {
    loadNeuroCloudData()
  }, [])

  const loadNeuroCloudData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockWorkspaces: AIWorkspace[] = [
        {
          id: '1',
          organizationId: 'org1',
          organizationName: 'Stanford University',
          workspaceName: 'Math Department AI Tutor',
          description: 'Specialized AI tutor for advanced mathematics courses',
          workspaceType: 'institutional',
          aiModelType: 'tutor',
          trainingDataSource: 'private_data',
          privacyLevel: 'private',
          status: 'active',
          modelConfiguration: {
            architecture: 'transformer',
            parameters: 175000000,
            trainingMethod: 'supervised_learning'
          },
          trainingProgress: {
            currentEpoch: 45,
            totalEpochs: 100,
            loss: 0.0234,
            accuracy: 0.9456
          },
          performanceMetrics: {
            responseTime: 120,
            accuracy: 0.9456,
            userSatisfaction: 4.7,
            uptime: 99.9
          },
          dataSources: [
            { name: 'Course Materials', type: 'text', size: '2.3GB' },
            { name: 'Student Interactions', type: 'structured', size: '1.8GB' },
            { name: 'Assessment Data', type: 'structured', size: '0.9GB' }
          ],
          accessPermissions: {
            admins: ['user1', 'user2'],
            researchers: ['user3', 'user4'],
            students: ['user5', 'user6']
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          deployedAt: '2024-01-10T14:20:00Z'
        },
        {
          id: '2',
          organizationId: 'org2',
          organizationName: 'Microsoft Corporation',
          workspaceName: 'Corporate Training Assistant',
          description: 'AI assistant for employee training and development programs',
          workspaceType: 'departmental',
          aiModelType: 'assistant',
          trainingDataSource: 'hybrid',
          privacyLevel: 'confidential',
          status: 'training',
          modelConfiguration: {
            architecture: 'gpt_style',
            parameters: 350000000,
            trainingMethod: 'reinforcement_learning'
          },
          trainingProgress: {
            currentEpoch: 23,
            totalEpochs: 50,
            loss: 0.0456,
            accuracy: 0.8923
          },
          performanceMetrics: {
            responseTime: 95,
            accuracy: 0.8923,
            userSatisfaction: 4.5,
            uptime: 99.7
          },
          dataSources: [
            { name: 'Training Materials', type: 'text', size: '5.1GB' },
            { name: 'Employee Feedback', type: 'structured', size: '2.2GB' },
            { name: 'Performance Data', type: 'structured', size: '1.5GB' }
          ],
          accessPermissions: {
            admins: ['user7', 'user8'],
            managers: ['user9', 'user10'],
            employees: ['user11', 'user12']
          },
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
          deployedAt: ''
        },
        {
          id: '3',
          organizationId: 'org3',
          organizationName: 'MIT Research Lab',
          workspaceName: 'Research AI Lab',
          description: 'Experimental AI models for educational research',
          workspaceType: 'research',
          aiModelType: 'custom',
          trainingDataSource: 'synthetic',
          privacyLevel: 'restricted',
          status: 'deployed',
          modelConfiguration: {
            architecture: 'custom_transformer',
            parameters: 500000000,
            trainingMethod: 'multi_task_learning'
          },
          trainingProgress: {
            currentEpoch: 100,
            totalEpochs: 100,
            loss: 0.0123,
            accuracy: 0.9789
          },
          performanceMetrics: {
            responseTime: 85,
            accuracy: 0.9789,
            userSatisfaction: 4.9,
            uptime: 99.95
          },
          dataSources: [
            { name: 'Research Data', type: 'mixed', size: '12.3GB' },
            { name: 'Synthetic Data', type: 'generated', size: '8.7GB' },
            { name: 'Benchmark Data', type: 'structured', size: '3.2GB' }
          ],
          accessPermissions: {
            researchers: ['user13', 'user14'],
            phd_students: ['user15', 'user16'],
            collaborators: ['user17', 'user18']
          },
          createdAt: '2023-12-15T00:00:00Z',
          updatedAt: '2024-01-15T08:45:00Z',
          deployedAt: '2024-01-01T12:00:00Z'
        }
      ]

      const mockDatasets: TrainingDataset[] = [
        {
          id: '1',
          workspaceId: '1',
          datasetName: 'Advanced Calculus Problems',
          description: 'Collection of advanced calculus problems with solutions',
          dataType: 'text',
          fileFormat: 'json',
          fileSizeBytes: 2300000000,
          recordCount: 15000,
          dataSchema: {
            fields: ['problem', 'solution', 'difficulty', 'topic'],
            types: ['string', 'string', 'integer', 'string']
          },
          qualityScore: 0.92,
          privacyCompliance: {
            gdpr_compliant: true,
            ferpa_compliant: true,
            data_retention: '7_years'
          },
          processingStatus: 'ready',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          workspaceId: '1',
          datasetName: 'Student Interaction Logs',
          description: 'Anonymized student interaction data with AI tutor',
          dataType: 'structured',
          fileFormat: 'csv',
          fileSizeBytes: 1800000000,
          recordCount: 50000,
          dataSchema: {
            fields: ['timestamp', 'user_id_hash', 'question', 'response', 'rating'],
            types: ['datetime', 'string', 'string', 'string', 'integer']
          },
          qualityScore: 0.88,
          privacyCompliance: {
            gdpr_compliant: true,
            ferpa_compliant: true,
            data_retention: '3_years'
          },
          processingStatus: 'ready',
          createdAt: '2024-01-02T00:00:00Z'
        }
      ]

      const mockTrainingJobs: ModelTrainingJob[] = [
        {
          id: '1',
          workspaceId: '1',
          jobName: 'Math Tutor v2.0 Training',
          trainingConfig: {
            learningRate: 0.001,
            batchSize: 32,
            optimizer: 'adam'
          },
          datasetIds: ['1', '2'],
          modelArchitecture: {
            type: 'transformer',
            layers: 12,
            hiddenSize: 768,
            attentionHeads: 12
          },
          hyperparameters: {
            learningRate: 0.001,
            batchSize: 32,
            epochs: 100,
            dropout: 0.1
          },
          status: 'running',
          progressPercentage: 45.0,
          currentEpoch: 45,
          totalEpochs: 100,
          trainingMetrics: {
            loss: 0.0234,
            accuracy: 0.9456,
            perplexity: 2.1
          },
          validationMetrics: {
            loss: 0.0289,
            accuracy: 0.9234,
            bleu_score: 0.87
          },
          errorMessage: '',
          startedAt: '2024-01-10T14:00:00Z',
          completedAt: '',
          estimatedCompletion: '2024-01-20T18:00:00Z',
          createdAt: '2024-01-10T13:30:00Z'
        }
      ]

      const mockDeployedModels: DeployedModel[] = [
        {
          id: '1',
          workspaceId: '1',
          trainingJobId: '1',
          modelName: 'Math Tutor v1.5',
          modelVersion: '1.5.0',
          modelType: 'tutor',
          deploymentConfig: {
            instanceType: 'gpu_large',
            replicas: 3,
            autoScaling: true
          },
          apiEndpoint: 'https://api.omnimind.ai/v1/models/math-tutor-v1-5',
          status: 'active',
          performanceMetrics: {
            responseTime: 120,
            throughput: 1000,
            errorRate: 0.01
          },
          usageCount: 15420,
          lastUsedAt: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-10T14:20:00Z'
        }
      ]

      setWorkspaces(mockWorkspaces)
      setDatasets(mockDatasets)
      setTrainingJobs(mockTrainingJobs)
      setDeployedModels(mockDeployedModels)
    } catch (error) {
      console.error('Failed to load NeuroCloud data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createWorkspace = async () => {
    try {
      const newWorkspaceData: AIWorkspace = {
        id: Date.now().toString(),
        organizationId: 'org_current',
        organizationName: 'Current Organization',
        workspaceName: newWorkspace.workspaceName,
        description: newWorkspace.description,
        workspaceType: newWorkspace.workspaceType,
        aiModelType: newWorkspace.aiModelType,
        trainingDataSource: 'private_data',
        privacyLevel: newWorkspace.privacyLevel,
        status: 'active',
        modelConfiguration: {},
        trainingProgress: {},
        performanceMetrics: {},
        dataSources: [],
        accessPermissions: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deployedAt: ''
      }

      setWorkspaces([newWorkspaceData, ...workspaces])
      setNewWorkspace({
        workspaceName: '',
        description: '',
        workspaceType: 'institutional',
        aiModelType: 'tutor',
        privacyLevel: 'private'
      })
      setShowCreateWorkspace(false)
    } catch (error) {
      console.error('Failed to create workspace:', error)
    }
  }

  const getWorkspaceTypeIcon = (type: string) => {
    switch (type) {
      case 'institutional':
        return Brain
      case 'departmental':
        return Target
      case 'research':
        return Cpu
      case 'project_based':
        return Database
      default:
        return Cloud
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'training':
        return 'bg-blue-100 text-blue-800'
      case 'deployed':
        return 'bg-purple-100 text-purple-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'private':
        return 'bg-red-100 text-red-800'
      case 'confidential':
        return 'bg-orange-100 text-orange-800'
      case 'restricted':
        return 'bg-yellow-100 text-yellow-800'
      case 'public':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProcessingStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
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
        <p className="text-gray-600">Loading NeuroCloud Workspace...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">NeuroCloud AI Workspace</h2>
            <p className="text-gray-600">
              A cloud environment where institutions can train their own tutors on private data.
            </p>
          </div>
          <button
            onClick={() => setShowCreateWorkspace(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'workspaces', label: 'Workspaces', count: workspaces.length },
              { id: 'datasets', label: 'Datasets', count: datasets.length },
              { id: 'training', label: 'Training Jobs', count: trainingJobs.length },
              { id: 'models', label: 'Deployed Models', count: deployedModels.length },
              { id: 'analytics', label: 'Analytics', count: 0 }
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

      {/* Create Workspace Form */}
      {showCreateWorkspace && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New AI Workspace</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name</label>
              <input
                type="text"
                value={newWorkspace.workspaceName}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, workspaceName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter workspace name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Type</label>
              <select
                value={newWorkspace.workspaceType}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, workspaceType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="institutional">Institutional</option>
                <option value="departmental">Departmental</option>
                <option value="project_based">Project Based</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Model Type</label>
              <select
                value={newWorkspace.aiModelType}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, aiModelType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="tutor">Tutor</option>
                <option value="assistant">Assistant</option>
                <option value="specialist">Specialist</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Level</label>
              <select
                value={newWorkspace.privacyLevel}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, privacyLevel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your AI workspace"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowCreateWorkspace(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createWorkspace}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Workspace
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workspaces.map((workspace) => {
              const WorkspaceIcon = getWorkspaceTypeIcon(workspace.workspaceType)
              
              return (
                <div key={workspace.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <WorkspaceIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{workspace.workspaceName}</h3>
                        <p className="text-sm text-gray-500">{workspace.organizationName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workspace.status)}`}>
                            {workspace.status}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPrivacyLevelColor(workspace.privacyLevel)}`}>
                            {workspace.privacyLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-indigo-600">
                        {workspace.dataSources.length} sources
                      </div>
                      <div className="text-xs text-gray-500">
                        {workspace.aiModelType}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{workspace.description}</p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Accuracy</div>
                        <div className="font-semibold">
                          {workspace.performanceMetrics.accuracy ? 
                            `${(workspace.performanceMetrics.accuracy * 100).toFixed(1)}%` : 
                            'N/A'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Response Time</div>
                        <div className="font-semibold">
                          {workspace.performanceMetrics.responseTime ? 
                            `${workspace.performanceMetrics.responseTime}ms` : 
                            'N/A'
                          }
                        </div>
                      </div>
                    </div>

                    {workspace.trainingProgress.currentEpoch && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Training Progress</span>
                          <span className="font-semibold">
                            {workspace.trainingProgress.currentEpoch}/{workspace.trainingProgress.totalEpochs}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${workspace.trainingProgress.currentEpoch / workspace.trainingProgress.totalEpochs * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Data Sources</div>
                      <div className="space-y-1">
                        {workspace.dataSources.slice(0, 2).map((source, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-gray-600">{source.name}</span>
                            <span className="text-gray-500">{source.size}</span>
                          </div>
                        ))}
                        {workspace.dataSources.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{workspace.dataSources.length - 2} more sources
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Manage</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'datasets' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Training Datasets</h3>
            <button
              onClick={() => setShowUploadDataset(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{dataset.datasetName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getProcessingStatusColor(dataset.processingStatus)}`}>
                          {dataset.processingStatus}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{dataset.dataType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {dataset.recordCount.toLocaleString()} records
                    </div>
                    <div className="text-xs text-gray-500">
                      {(dataset.fileSizeBytes / 1024 / 1024 / 1024).toFixed(1)} GB
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{dataset.description}</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Quality Score</div>
                      <div className="font-semibold">
                        {(dataset.qualityScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Format</div>
                      <div className="font-semibold uppercase">{dataset.fileFormat}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Privacy Compliance</div>
                    <div className="flex space-x-2">
                      {dataset.privacyCompliance.gdpr_compliant && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          GDPR
                        </span>
                      )}
                      {dataset.privacyCompliance.ferpa_compliant && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          FERPA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Cpu className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{job.jobName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Epoch {job.currentEpoch}/{job.totalEpochs}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      {job.progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.estimatedCompletion ? 
                        `ETA: ${new Date(job.estimatedCompletion).toLocaleDateString()}` : 
                        'No ETA'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold">{job.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${job.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Training Loss</div>
                      <div className="font-semibold">
                        {job.trainingMetrics.loss ? job.trainingMetrics.loss.toFixed(4) : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Accuracy</div>
                      <div className="font-semibold">
                        {job.trainingMetrics.accuracy ? 
                          `${(job.trainingMetrics.accuracy * 100).toFixed(1)}%` : 
                          'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Learning Rate</div>
                      <div className="font-semibold">{job.hyperparameters.learningRate}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Batch Size</div>
                      <div className="font-semibold">{job.hyperparameters.batchSize}</div>
                    </div>
                  </div>

                  {job.errorMessage && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-700">{job.errorMessage}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  {job.status === 'running' ? (
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deployedModels.map((model) => (
              <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{model.modelName}</h3>
                      <p className="text-sm text-gray-500">v{model.modelVersion}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          model.status === 'active' ? 'bg-green-100 text-green-800' :
                          model.status === 'deploying' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {model.status}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{model.modelType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600">
                      {model.usageCount.toLocaleString()} calls
                    </div>
                    <div className="text-xs text-gray-500">
                      Last used: {model.lastUsedAt ? new Date(model.lastUsedAt).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Response Time</div>
                      <div className="font-semibold">
                        {model.performanceMetrics.responseTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Throughput</div>
                      <div className="font-semibold">
                        {model.performanceMetrics.throughput}/sec
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Error Rate</div>
                      <div className="font-semibold">
                        {(model.performanceMetrics.errorRate * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Instance Type</div>
                      <div className="font-semibold">
                        {model.deploymentConfig.instanceType}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">API Endpoint</div>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {model.apiEndpoint}
                      </code>
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Test Model</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{workspaces.length}</div>
              <div className="text-sm text-gray-600">Active Workspaces</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{datasets.length}</div>
              <div className="text-sm text-gray-600">Training Datasets</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{trainingJobs.length}</div>
              <div className="text-sm text-gray-600">Training Jobs</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{deployedModels.length}</div>
              <div className="text-sm text-gray-600">Deployed Models</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Training Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Training performance charts would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}