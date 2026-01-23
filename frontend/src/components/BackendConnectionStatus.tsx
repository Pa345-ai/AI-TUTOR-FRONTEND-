'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { config, isSupabaseEnabled, getBackendType } from '@/lib/config'

interface ConnectionStatus {
  type: 'supabase' | 'api' | 'mock'
  status: 'connected' | 'disconnected' | 'error' | 'checking'
  message: string
  lastChecked: Date
}

export default function BackendConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    type: getBackendType() as 'supabase' | 'api' | 'mock',
    status: 'checking',
    message: 'Checking connection...',
    lastChecked: new Date()
  })

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const checkConnection = async () => {
    const backendType = getBackendType()
    
    try {
      if (backendType === 'supabase' && isSupabaseEnabled()) {
        // Test Supabase connection
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)
        
        if (error) {
          throw new Error(`Supabase error: ${error.message}`)
        }
        
        setConnectionStatus({
          type: 'supabase',
          status: 'connected',
          message: 'Connected to Supabase database',
          lastChecked: new Date()
        })
      } else if (backendType === 'api') {
        // Test API connection
        const response = await fetch(`${config.backend.api.baseUrl}/health`)
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        setConnectionStatus({
          type: 'api',
          status: 'connected',
          message: 'Connected to API backend',
          lastChecked: new Date()
        })
      } else {
        // Mock backend
        setConnectionStatus({
          type: 'mock',
          status: 'connected',
          message: 'Using mock data (development mode)',
          lastChecked: new Date()
        })
      }
    } catch (error) {
      console.error('Connection check failed:', error)
      setConnectionStatus({
        type: backendType as 'supabase' | 'api' | 'mock',
        status: 'error',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastChecked: new Date()
      })
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'checking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'checking':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  const getBackendTypeLabel = () => {
    switch (connectionStatus.type) {
      case 'supabase':
        return 'Supabase'
      case 'api':
        return 'API'
      case 'mock':
        return 'Mock Data'
      default:
        return 'Unknown'
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow-lg transition-colors"
        title="Show connection status"
      >
        <AlertCircle className="w-4 h-4 text-gray-600" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm p-3 rounded-lg border ${getStatusColor()} shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div>
            <div className="font-medium text-sm">
              {getBackendTypeLabel()} Backend
            </div>
            <div className="text-xs opacity-75">
              {connectionStatus.message}
            </div>
            <div className="text-xs opacity-50 mt-1">
              Last checked: {connectionStatus.lastChecked.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
      
      {connectionStatus.status === 'error' && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <button
            onClick={checkConnection}
            className="text-xs underline hover:no-underline transition-all"
          >
            Retry connection
          </button>
        </div>
      )}
    </div>
  )
}