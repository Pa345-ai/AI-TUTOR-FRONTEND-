import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Users, Zap, Eye, Headphones, Gamepad2, Sparkles, Mountain, Atom, BookOpen } from 'lucide-react'

interface NeuroVerseMetaverseProps {
  onWorldEntered?: (world: string) => void
  onCollaborationStarted?: (session: string) => void
}

export default function NeuroVerseMetaverse({ onWorldEntered, onCollaborationStarted }: NeuroVerseMetaverseProps) {
  const [activeWorld, setActiveWorld] = useState<string | null>(null)
  const [isImmersed, setIsImmersed] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [collaborationSessions, setCollaborationSessions] = useState(0)

  useEffect(() => {
    // Simulate online users
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const learningWorlds = [
    {
      id: 'quantum-physics',
      name: 'Quantum Physics Lab',
      description: 'Explore the subatomic world in 3D',
      icon: Atom,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      users: 23,
      difficulty: 'Advanced'
    },
    {
      id: 'ancient-history',
      name: 'Ancient Civilizations',
      description: 'Walk through historical periods',
      icon: Mountain,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      users: 45,
      difficulty: 'Intermediate'
    },
    {
      id: 'mathematics',
      name: 'Mathematical Universe',
      description: 'Visualize complex equations in 3D',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      users: 67,
      difficulty: 'All Levels'
    },
    {
      id: 'biology',
      name: 'Cellular World',
      description: 'Journey inside living cells',
      icon: Eye,
      color: 'bg-gradient-to-r from-green-500 to-teal-600',
      users: 34,
      difficulty: 'Intermediate'
    }
  ]

  const features = [
    {
      icon: Globe,
      title: '3D Learning Worlds',
      description: 'Immersive environments for every subject',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description: 'Study with others in virtual spaces',
      status: 'active'
    },
    {
      icon: Zap,
      title: 'AI-Generated Content',
      description: 'Dynamic worlds that adapt to learning',
      status: 'active'
    },
    {
      icon: Eye,
      title: 'VR/AR Support',
      description: 'Full virtual and augmented reality',
      status: 'active'
    }
  ]

  const handleWorldEnter = (worldId: string) => {
    setActiveWorld(worldId)
    setIsImmersed(true)
    onWorldEntered?.(worldId)
    
    // Simulate collaboration session
    setTimeout(() => {
      setCollaborationSessions(prev => prev + 1)
      onCollaborationStarted?.(worldId)
    }, 2000)
  }

  const handleExitWorld = () => {
    setActiveWorld(null)
    setIsImmersed(false)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">NeuroVerse Metaverse</h3>
            <p className="text-gray-400">3D AI learning worlds</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Online Users</div>
            <div className="text-lg font-semibold text-white">{onlineUsers}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Active Sessions</div>
            <div className="text-lg font-semibold text-white">{collaborationSessions}</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/10 rounded-xl p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-2">
              <feature.icon className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
            </div>
            <p className="text-gray-300 text-xs">{feature.description}</p>
            <div className="mt-2">
              <span className="text-green-400 text-xs font-medium">Active</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Worlds */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Available Learning Worlds</h4>
        <div className="space-y-3">
          {learningWorlds.map((world, index) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                activeWorld === world.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${world.color} rounded-xl flex items-center justify-center`}>
                    <world.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">{world.name}</h5>
                    <p className="text-gray-300 text-sm">{world.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-blue-400 text-xs">{world.users} users</span>
                      <span className="text-gray-400 text-xs">{world.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {activeWorld === world.id ? (
                    <button
                      onClick={handleExitWorld}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all duration-300"
                    >
                      Exit World
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWorldEnter(world.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Enter World
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Immersive Experience */}
      {isImmersed && activeWorld && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Immersive Experience Active</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium text-sm">Visual Mode</span>
              </div>
              <p className="text-gray-300 text-xs">3D rendering active</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Headphones className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm">Audio Mode</span>
              </div>
              <p className="text-gray-300 text-xs">Spatial audio enabled</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium text-sm">Interaction</span>
              </div>
              <p className="text-gray-300 text-xs">Hand tracking active</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium text-sm">Collaboration</span>
              </div>
              <p className="text-gray-300 text-xs">Multi-user session</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Performance Metrics */}
      <div className="mt-6 bg-white/10 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4ms</div>
            <div className="text-gray-400 text-sm">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">60fps</div>
            <div className="text-gray-400 text-sm">Frame Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}