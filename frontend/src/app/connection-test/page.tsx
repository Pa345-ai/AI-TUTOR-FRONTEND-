'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Database, Zap, Cloud } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { config, isSupabaseEnabled, getBackendType } from '@/lib/config'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  duration?: number
}

export default function ConnectionTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Environment Configuration', status: 'pending', message: 'Checking environment variables...' },
    { name: 'Supabase Connection', status: 'pending', message: 'Testing database connection...' },
    { name: 'Authentication', status: 'pending', message: 'Testing auth system...' },
    { name: 'Real-time Subscriptions', status: 'pending', message: 'Testing real-time features...' },
    { name: 'File Storage', status: 'pending', message: 'Testing file upload capabilities...' },
    { name: 'API Endpoints', status: 'pending', message: 'Testing backend API...' }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus('pending')

    // Test 1: Environment Configuration
    await updateTest(0, 'pending', 'Checking environment variables...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const envValid = validateEnvironment()
    await updateTest(0, envValid ? 'success' : 'error', 
      envValid ? 'Environment variables configured correctly' : 'Missing required environment variables')

    // Test 2: Supabase Connection
    await updateTest(1, 'pending', 'Testing database connection...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (error) throw error
      await updateTest(1, 'success', 'Database connection successful')
    } catch (error) {
      await updateTest(1, 'error', `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Test 3: Authentication
    await updateTest(2, 'pending', 'Testing auth system...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      await updateTest(2, 'success', 'Authentication system working')
    } catch (error) {
      await updateTest(2, 'error', `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Test 4: Real-time Subscriptions
    await updateTest(3, 'pending', 'Testing real-time features...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {})
        .subscribe()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      await channel.unsubscribe()
      await updateTest(3, 'success', 'Real-time subscriptions working')
    } catch (error) {
      await updateTest(3, 'error', `Real-time failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Test 5: File Storage
    await updateTest(4, 'pending', 'Testing file upload capabilities...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' })
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`test-${Date.now()}.txt`, testBlob)
      
      if (error) throw error
      
      // Clean up test file
      await supabase.storage
        .from('documents')
        .remove([data.path])
      
      await updateTest(4, 'success', 'File storage working')
    } catch (error) {
      await updateTest(4, 'error', `File storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Test 6: API Endpoints
    await updateTest(5, 'pending', 'Testing backend API...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const response = await fetch(`${config.backend.api.baseUrl}/health`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await updateTest(5, 'success', 'API endpoints responding')
    } catch (error) {
      await updateTest(5, 'error', `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Calculate overall status
    const allTests = tests.map(t => t.status)
    const hasErrors = allTests.includes('error')
    const allSuccess = allTests.every(status => status === 'success')
    
    setOverallStatus(hasErrors ? 'error' : allSuccess ? 'success' : 'pending')
    setIsRunning(false)
  }

  const updateTest = async (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ))
  }

  const validateEnvironment = () => {
    return !!(config.backend.supabase.url && config.backend.supabase.anonKey)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getOverallIcon = () => {
    switch (overallStatus) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Connection Test
            </h1>
            <p className="text-gray-600 mb-6">
              Testing your AI Tutoring App connection to Supabase
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              {getOverallIcon()}
              <div>
                <div className="text-lg font-semibold">
                  {overallStatus === 'success' && 'All Tests Passed!'}
                  {overallStatus === 'error' && 'Some Tests Failed'}
                  {overallStatus === 'pending' && 'Running Tests...'}
                </div>
                <div className="text-sm text-gray-500">
                  Backend Type: {getBackendType()}
                </div>
              </div>
            </div>

            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(test.status)} transition-all duration-300`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm opacity-75">{test.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Configuration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Backend Type</div>
                <div className="text-gray-600">{getBackendType()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Supabase Enabled</div>
                <div className="text-gray-600">{isSupabaseEnabled() ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">API Base URL</div>
                <div className="text-gray-600">{config.backend.api.baseUrl}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Environment</div>
                <div className="text-gray-600">{process.env.NODE_ENV}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}