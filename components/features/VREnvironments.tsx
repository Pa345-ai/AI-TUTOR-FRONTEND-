import React, { useState } from 'react'
import { useOmniMind } from '../../hooks/useOmniMind'
import { VREnvironment } from '../../lib/supabase'

interface VREnvironmentsProps {
  userId: string
}

export const VREnvironments: React.FC<VREnvironmentsProps> = ({ userId }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { vrEnvironments } = useOmniMind(userId)

  const handleEnterEnvironment = async (environment: VREnvironment) => {
    setIsLoading(true)
    setSelectedEnvironment(environment)
    
    // Simulate loading VR environment
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const getEnvironmentIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'classroom': '🏫',
      'laboratory': '🧪',
      'library': '📚',
      'space': '🚀',
      'underwater': '🐠',
      'forest': '🌲',
      'mountain': '⛰️',
      'desert': '🏜️',
      'arctic': '❄️',
      'volcano': '🌋'
    }
    return icons[type] || '🌐'
  }

  const getEnvironmentColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'classroom': 'from-blue-50 to-indigo-100',
      'laboratory': 'from-green-50 to-emerald-100',
      'library': 'from-amber-50 to-yellow-100',
      'space': 'from-purple-50 to-violet-100',
      'underwater': 'from-cyan-50 to-blue-100',
      'forest': 'from-green-50 to-lime-100',
      'mountain': 'from-gray-50 to-slate-100',
      'desert': 'from-orange-50 to-amber-100',
      'arctic': 'from-blue-50 to-cyan-100',
      'volcano': 'from-red-50 to-orange-100'
    }
    return colors[type] || 'from-gray-50 to-gray-100'
  }

  if (isLoading && selectedEnvironment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🥽</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Entering VR Environment</h3>
          <p className="text-gray-600 mb-4">Loading {selectedEnvironment.name}...</p>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🥽 VR Learning Environments</h2>
        <div className="text-sm text-gray-600">
          {vrEnvironments.length} environments available
        </div>
      </div>

      {vrEnvironments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🥽</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No VR Environments Available</h3>
          <p className="text-gray-600">VR environments will be available soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vrEnvironments.map((environment: VREnvironment) => (
            <div key={environment.id} className="group relative">
              <div className={`bg-gradient-to-br ${getEnvironmentColor(environment.environment_type)} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{getEnvironmentIcon(environment.environment_type)}</div>
                  <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium text-gray-700">
                    {environment.environment_type}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {environment.name}
                </h3>
                
                <p className="text-gray-700 mb-4 text-sm">
                  {environment.description}
                </p>

                {environment.settings && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(environment.settings).slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-white bg-opacity-50 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {Object.keys(environment.settings).length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{Object.keys(environment.settings).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleEnterEnvironment(environment)}
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-opacity-30 transition-all duration-200 group-hover:bg-opacity-30"
                >
                  Enter Environment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VR Features Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🌟 VR Learning Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🎓</div>
            <h4 className="font-medium text-gray-800 mb-1">Immersive Learning</h4>
            <p className="text-sm text-gray-600">Learn in 3D environments that bring concepts to life</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🤝</div>
            <h4 className="font-medium text-gray-800 mb-1">Collaborative Spaces</h4>
            <p className="text-sm text-gray-600">Study with others in shared virtual environments</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="font-medium text-gray-800 mb-1">Hands-on Practice</h4>
            <p className="text-sm text-gray-600">Practice skills in safe, controlled virtual settings</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🌍</div>
            <h4 className="font-medium text-gray-800 mb-1">Global Access</h4>
            <p className="text-sm text-gray-600">Access world-class learning environments from anywhere</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="font-medium text-gray-800 mb-1">Gamified Learning</h4>
            <p className="text-sm text-gray-600">Learn through interactive games and challenges</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-medium text-gray-800 mb-1">Progress Tracking</h4>
            <p className="text-sm text-gray-600">Monitor your learning progress in real-time</p>
          </div>
        </div>
      </div>

      {/* VR Requirements */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">🥽 VR Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Hardware Requirements</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• VR headset (Oculus, HTC Vive, or compatible)</li>
              <li>• PC with VR-ready graphics card</li>
              <li>• Stable internet connection (10+ Mbps)</li>
              <li>• 4GB+ RAM available</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Software Requirements</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• OmniMind VR app (coming soon)</li>
              <li>• SteamVR or Oculus software</li>
              <li>• Updated graphics drivers</li>
              <li>• Windows 10+ or macOS 10.15+</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
