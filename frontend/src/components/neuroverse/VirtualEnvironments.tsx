'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Play, Users, Clock, Star, Filter, Search, Globe, Zap, BookOpen, Microscope, Atom, Calculator, Palette } from 'lucide-react'

interface VirtualEnvironment {
  id: string
  name: string
  description: string
  environmentType: string
  subjectArea: string
  difficultyLevel: string
  vrSupported: boolean
  arSupported: boolean
  webSupported: boolean
  maxCapacity: number
  environmentData: any
  createdAt: string
  isActive: boolean
}

interface VirtualScene {
  id: string
  environmentId: string
  sceneName: string
  sceneType: string
  description: string
  learningObjectives: string[]
  durationMinutes: number
  difficultyLevel: string
}

export default function VirtualEnvironments() {
  const [environments, setEnvironments] = useState<VirtualEnvironment[]>([])
  const [scenes, setScenes] = useState<VirtualScene[]>([])
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadVirtualEnvironments()
  }, [])

  const loadVirtualEnvironments = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockEnvironments: VirtualEnvironment[] = [
        {
          id: '1',
          name: 'Physics Lab - Space Station',
          description: 'Learn physics in zero gravity aboard a space station with floating objects and magnetic fields',
          environmentType: 'laboratory',
          subjectArea: 'physics',
          difficultyLevel: 'intermediate',
          vrSupported: true,
          arSupported: true,
          webSupported: true,
          maxCapacity: 20,
          environmentData: {
            gravity: 0,
            atmosphere: 'artificial',
            lighting: 'fluorescent',
            objects: ['floating_balls', 'magnetic_fields', 'laser_equipment']
          },
          createdAt: '2024-01-15T10:30:00Z',
          isActive: true
        },
        {
          id: '2',
          name: 'Chemistry Lab - Molecular World',
          description: 'Explore chemistry at the molecular level with interactive atoms and chemical reactions',
          environmentType: 'laboratory',
          subjectArea: 'chemistry',
          difficultyLevel: 'advanced',
          vrSupported: true,
          arSupported: false,
          webSupported: true,
          maxCapacity: 15,
          environmentData: {
            scale: 'molecular',
            interactions: 'atomic',
            visualization: '3d_atoms',
            tools: ['electron_microscope', 'molecular_builder']
          },
          createdAt: '2024-01-14T15:45:00Z',
          isActive: true
        },
        {
          id: '3',
          name: 'Historical Classroom - Ancient Rome',
          description: 'Learn history in a reconstructed Roman classroom with authentic architecture and atmosphere',
          environmentType: 'historical',
          subjectArea: 'history',
          difficultyLevel: 'beginner',
          vrSupported: true,
          arSupported: true,
          webSupported: true,
          maxCapacity: 30,
          environmentData: {
            period: 'ancient_rome',
            architecture: 'roman',
            furniture: 'ancient',
            atmosphere: 'historical'
          },
          createdAt: '2024-01-13T09:20:00Z',
          isActive: true
        },
        {
          id: '4',
          name: 'Biology Lab - Underwater Research',
          description: 'Study marine biology in an underwater research station with marine life and ocean currents',
          environmentType: 'laboratory',
          subjectArea: 'biology',
          difficultyLevel: 'intermediate',
          vrSupported: true,
          arSupported: true,
          webSupported: true,
          maxCapacity: 25,
          environmentData: {
            location: 'underwater',
            pressure: 'high',
            visibility: 'limited',
            wildlife: 'marine'
          },
          createdAt: '2024-01-12T14:15:00Z',
          isActive: true
        },
        {
          id: '5',
          name: 'Mathematics Garden - Fractal Universe',
          description: 'Explore mathematical concepts in a fractal-based world with infinite geometric patterns',
          environmentType: 'space',
          subjectArea: 'mathematics',
          difficultyLevel: 'advanced',
          vrSupported: true,
          arSupported: false,
          webSupported: true,
          maxCapacity: 10,
          environmentData: {
            geometry: 'fractal',
            colors: 'mathematical',
            patterns: 'infinite',
            interactions: 'geometric'
          },
          createdAt: '2024-01-11T11:30:00Z',
          isActive: true
        },
        {
          id: '6',
          name: 'Art Studio - Renaissance Workshop',
          description: 'Create art in a Renaissance workshop with period-appropriate tools and techniques',
          environmentType: 'classroom',
          subjectArea: 'art',
          difficultyLevel: 'intermediate',
          vrSupported: true,
          arSupported: true,
          webSupported: true,
          maxCapacity: 12,
          environmentData: {
            period: 'renaissance',
            tools: 'traditional',
            lighting: 'natural',
            atmosphere: 'artistic'
          },
          createdAt: '2024-01-10T16:45:00Z',
          isActive: true
        }
      ]

      const mockScenes: VirtualScene[] = [
        {
          id: '1',
          environmentId: '1',
          sceneName: 'Gravity Experiment',
          sceneType: 'experiment',
          description: 'Experiment with objects in zero gravity',
          learningObjectives: ['Understand gravity', 'Compare gravitational forces', 'Predict motion'],
          durationMinutes: 30,
          difficultyLevel: 'beginner'
        },
        {
          id: '2',
          environmentId: '1',
          sceneName: 'Magnetic Fields',
          sceneType: 'lesson',
          description: 'Learn about magnetic fields in space',
          learningObjectives: ['Understand magnetism', 'Visualize field lines', 'Apply magnetic principles'],
          durationMinutes: 45,
          difficultyLevel: 'intermediate'
        },
        {
          id: '3',
          environmentId: '2',
          sceneName: 'Molecular Bonding',
          sceneType: 'experiment',
          description: 'Create and break molecular bonds',
          learningObjectives: ['Understand chemical bonds', 'Visualize molecular structures', 'Predict bond strength'],
          durationMinutes: 60,
          difficultyLevel: 'advanced'
        }
      ]

      setEnvironments(mockEnvironments)
      setScenes(mockScenes)
    } catch (error) {
      console.error('Failed to load virtual environments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'laboratory':
        return Microscope
      case 'historical':
        return BookOpen
      case 'space':
        return Globe
      case 'classroom':
        return Calculator
      default:
        return Eye
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'physics':
        return Zap
      case 'chemistry':
        return Atom
      case 'biology':
        return Microscope
      case 'mathematics':
        return Calculator
      case 'art':
        return Palette
      case 'history':
        return BookOpen
      default:
        return Globe
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

  const filteredEnvironments = environments.filter(env => {
    const matchesType = filterType === 'all' || env.environmentType === filterType
    const matchesSubject = filterSubject === 'all' || env.subjectArea === filterSubject
    const matchesSearch = searchQuery === '' || 
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSubject && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading virtual environments...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Immersive 3D Classrooms</h2>
        <p className="text-gray-600">
          AI avatars teach in virtual labs, classrooms, or historical worlds. Learn physics inside a simulated planet!
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search environments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="laboratory">Laboratory</option>
                <option value="classroom">Classroom</option>
                <option value="historical">Historical</option>
                <option value="space">Space</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="mathematics">Mathematics</option>
                <option value="history">History</option>
                <option value="art">Art</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Environments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEnvironments.map((environment) => {
          const EnvironmentIcon = getEnvironmentIcon(environment.environmentType)
          const SubjectIcon = getSubjectIcon(environment.subjectArea)
          const environmentScenes = scenes.filter(scene => scene.environmentId === environment.id)
          
          return (
            <div
              key={environment.id}
              className={`bg-white border-2 rounded-lg p-6 transition-all cursor-pointer ${
                selectedEnvironment === environment.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedEnvironment(selectedEnvironment === environment.id ? null : environment.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <EnvironmentIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{environment.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(environment.difficultyLevel)}`}>
                        {environment.difficultyLevel}
                      </span>
                      <span className="text-xs text-gray-500">{environment.environmentType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {environment.vrSupported && <div className="w-2 h-2 bg-green-500 rounded-full" title="VR Supported" />}
                  {environment.arSupported && <div className="w-2 h-2 bg-blue-500 rounded-full" title="AR Supported" />}
                  {environment.webSupported && <div className="w-2 h-2 bg-gray-500 rounded-full" title="Web Supported" />}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{environment.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{environment.maxCapacity} max</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SubjectIcon className="w-4 h-4" />
                    <span>{environment.subjectArea}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>

              {selectedEnvironment === environment.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-3">Available Scenes ({environmentScenes.length})</h4>
                  <div className="space-y-2">
                    {environmentScenes.map((scene) => (
                      <div key={scene.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{scene.sceneName}</h5>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{scene.durationMinutes} min</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{scene.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {scene.learningObjectives.slice(0, 2).map((objective, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {objective}
                            </span>
                          ))}
                          {scene.learningObjectives.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{scene.learningObjectives.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Enter Environment</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredEnvironments.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No environments found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}