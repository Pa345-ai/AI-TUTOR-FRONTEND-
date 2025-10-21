"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackendStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export function BackendStatus({ onStatusChange }: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkBackendStatus = async () => {
    setStatus('checking');
    setErrorMessage('');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setErrorMessage('');
        onStatusChange?.(true);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setStatus('disconnected');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      onStatusChange?.(false);
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking backend...';
      case 'connected':
        return 'Backend connected';
      case 'disconnected':
        return 'Backend disconnected';
      case 'error':
        return 'Backend error';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600';
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      case 'error':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkBackendStatus}
          disabled={status === 'checking'}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600">
          Error: {errorMessage}
        </div>
      )}
      
      {lastChecked && (
        <div className="mt-2 text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
      
      {status === 'disconnected' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">
            Backend Not Connected
          </h4>
          <p className="text-xs text-yellow-700 mb-2">
            The app is running with mock data. To connect to the real backend:
          </p>
          <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1">
            <li>Deploy the backend to Vercel</li>
            <li>Set up Supabase database</li>
            <li>Configure environment variables</li>
            <li>Update NEXT_PUBLIC_BASE_URL</li>
          </ol>
          <div className="mt-2">
            <a 
              href="/backend-setup" 
              className="text-xs text-blue-600 hover:underline"
            >
              View setup guide →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}