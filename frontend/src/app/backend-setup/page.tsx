"use client";

import React from 'react';
import { CheckCircle, ExternalLink, Code, Database, Key, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackendSetupPage() {
  const steps = [
    {
      id: 1,
      title: "Deploy Backend to Vercel",
      description: "Deploy the backend API to Vercel for hosting",
      icon: <Rocket className="h-6 w-6" />,
      commands: [
        "npm install -g vercel",
        "vercel login",
        "cd backend",
        "vercel --prod"
      ]
    },
    {
      id: 2,
      title: "Set up Supabase Database",
      description: "Create a Supabase project and set up the database schema",
      icon: <Database className="h-6 w-6" />,
      steps: [
        "Go to supabase.com and create a new project",
        "Go to SQL Editor and run the schema from supabase-schema.sql",
        "Get your Project URL and anon key from Settings > API"
      ]
    },
    {
      id: 3,
      title: "Configure Environment Variables",
      description: "Set up the required environment variables in Vercel",
      icon: <Key className="h-6 w-6" />,
      variables: [
        "SUPABASE_URL=your-supabase-project-url",
        "SUPABASE_ANON_KEY=your-supabase-anon-key",
        "OPENAI_API_KEY=your-openai-api-key"
      ]
    },
    {
      id: 4,
      title: "Update Frontend Configuration",
      description: "Update the frontend environment variables",
      icon: <Code className="h-6 w-6" />,
      config: [
        "Update .env.local with your backend URL",
        "Set NEXT_PUBLIC_BASE_URL to your Vercel deployment URL",
        "Configure Supabase credentials"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Backend Setup Guide
            </h1>
            <p className="text-lg text-gray-600">
              Connect your AI Tutoring App to a real backend for full functionality
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Step {step.id}: {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    
                    {step.commands && (
                      <div className="bg-gray-900 rounded-lg p-4 mb-4">
                        <h4 className="text-white font-medium mb-2">Commands:</h4>
                        <div className="space-y-1">
                          {step.commands.map((command, cmdIndex) => (
                            <div key={cmdIndex} className="text-green-400 font-mono text-sm">
                              $ {command}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.steps && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600">
                          {step.steps.map((instruction, instIndex) => (
                            <li key={instIndex}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {step.variables && (
                      <div className="bg-gray-900 rounded-lg p-4 mb-4">
                        <h4 className="text-white font-medium mb-2">Environment Variables:</h4>
                        <div className="space-y-1">
                          {step.variables.map((variable, varIndex) => (
                            <div key={varIndex} className="text-yellow-400 font-mono text-sm">
                              {variable}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.config && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Configuration:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {step.config.map((config, configIndex) => (
                            <li key={configIndex}>{config}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Test Your Setup
              </h3>
            </div>
            <p className="text-green-700 mb-4">
              Once you've completed all steps, test your backend connection:
            </p>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-green-400 font-mono text-sm space-y-1">
                <div>$ curl https://your-backend-url.vercel.app/api/health</div>
                <div>$ curl -X POST https://your-backend-url.vercel.app/api/chat/message \</div>
                <div className="ml-4">-H &quot;Content-Type: application/json&quot; \</div>
                <div className="ml-4">-d &apos;{`{"userId":"test","content":"Hello"}`}&apos;</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="mr-4"
            >
              Back to App
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://vercel.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Vercel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}