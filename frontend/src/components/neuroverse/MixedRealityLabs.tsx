'use client'

import React, { useState, useEffect } from 'react'
import { Hand, Play, Clock, Target, Zap, Atom, Microscope, Calculator, Settings, Filter, Search, Star, AlertTriangle, CheckCircle } from 'lucide-react'

interface VirtualExperiment {
  id: string
  name: string
  subjectArea: string
  experimentType: string
  difficultyLevel: string
  description: string
  learningObjectives: string[]
  equipmentRequired: string[]
  procedureSteps: any[]
  expectedOutcomes: any
  variables: any
  safetyNotes: string[]
  simulationData: any
  isActive: boolean
}

interface ExperimentSession {
  id: string
  userId: string
  experimentId: string
  environmentId: string
  sessionData: any
  results: any
  accuracyScore: number
  safetyScore: number
  learningOutcomes: string[]
  durationMinutes: number
  completedAt: string
  createdAt: string
}

interface VirtualLabEquipment {
  id: string
  name: string
  equipmentType: string
  subjectArea: string
  functionality: any
  physicsProperties: any
  safetyProtocols: string[]
  usageInstructions: any
  meshData: any
}

export default function MixedRealityLabs() {
  const [experiments, setExperiments] = useState<VirtualExperiment[]>([])
  const [sessions, setSessions] = useState<ExperimentSession[]>([])
  const [equipment, setEquipment] = useState<VirtualLabEquipment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRunningExperiment, setIsRunningExperiment] = useState(false)

  useEffect(() => {
    loadMixedRealityData()
  }, [])

  const loadMixedRealityData = async () => {
    try {
      setIsLoading(true)
      // Simulate API calls - replace with actual Supabase calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockExperiments: VirtualExperiment[] = [
        {
          id: '1',
          name: 'Gravity Simulation',
          subjectArea: 'physics',
          experimentType: 'physics',
          difficultyLevel: 'beginner',
          description: 'Experiment with gravity in different environments and observe how objects behave under various gravitational forces',
          learningObjectives: ['Understand gravity', 'Compare gravitational forces', 'Predict motion under gravity'],
          equipmentRequired: ['gravity_simulator', 'mass_objects', 'measurement_tools'],
          procedureSteps: [
            { step: 1, action: 'Set up gravity simulator', duration: 5 },
            { step: 2, action: 'Place objects in zero gravity', duration: 10 },
            { step: 3, action: 'Apply different gravitational forces', duration: 15 },
            { step: 4, action: 'Record observations', duration: 10 }
          ],
          expectedOutcomes: {
            observations: ['Objects fall at different rates', 'Gravity affects all objects equally'],
            measurements: ['Acceleration due to gravity', 'Time of fall', 'Distance traveled']
          },
          variables: {
            gravity_strength: { min: 0, max: 2, default: 1, unit: 'g' },
            object_mass: { min: 1, max: 100, default: 10, unit: 'kg' },
            air_resistance: { min: 0, max: 1, default: 0.1, unit: 'coefficient' }
          },
          safetyNotes: ['Wear safety goggles', 'Keep hands away from moving objects', 'Report any equipment malfunctions'],
          simulationData: {
            physics_engine: 'realistic',
            collision_detection: true,
            fluid_dynamics: false,
            electromagnetic_forces: false
          },
          isActive: true
        },
        {
          id: '2',
          name: 'Molecular Bonding',
          subjectArea: 'chemistry',
          experimentType: 'chemistry',
          difficultyLevel: 'intermediate',
          description: 'Create and break molecular bonds in 3D space, observing how atoms interact and form compounds',
          learningObjectives: ['Understand chemical bonds', 'Visualize molecular structures', 'Predict bond strength'],
          equipmentRequired: ['molecular_builder', 'bond_analyzer', 'energy_meter'],
          procedureSteps: [
            { step: 1, action: 'Select atoms for bonding', duration: 5 },
            { step: 2, action: 'Position atoms in 3D space', duration: 10 },
            { step: 3, action: 'Initiate bonding process', duration: 15 },
            { step: 4, action: 'Analyze bond strength', duration: 10 }
          ],
          expectedOutcomes: {
            observations: ['Atoms form stable bonds', 'Bond strength varies with atom types'],
            measurements: ['Bond energy', 'Bond length', 'Molecular stability']
          },
          variables: {
            atom_type: { options: ['H', 'C', 'O', 'N', 'Cl'], default: 'C' },
            temperature: { min: 0, max: 1000, default: 298, unit: 'K' },
            pressure: { min: 0.1, max: 10, default: 1, unit: 'atm' }
          },
          safetyNotes: ['Handle virtual chemicals carefully', 'Follow proper bonding procedures', 'Monitor energy levels'],
          simulationData: {
            physics_engine: 'quantum',
            collision_detection: true,
            fluid_dynamics: false,
            electromagnetic_forces: true
          },
          isActive: true
        },
        {
          id: '3',
          name: 'Cell Division',
          subjectArea: 'biology',
          experimentType: 'biology',
          difficultyLevel: 'intermediate',
          description: 'Observe and interact with the cell division process, understanding mitosis and meiosis',
          learningObjectives: ['Understand mitosis', 'Identify cell phases', 'Learn about cell cycle'],
          equipmentRequired: ['microscope', 'cell_samples', 'phase_marker'],
          procedureSteps: [
            { step: 1, action: 'Prepare cell samples', duration: 5 },
            { step: 2, action: 'Focus microscope on cells', duration: 10 },
            { step: 3, action: 'Observe cell division phases', duration: 20 },
            { step: 4, action: 'Record phase transitions', duration: 15 }
          ],
          expectedOutcomes: {
            observations: ['Cells progress through phases', 'Chromosomes align and separate'],
            measurements: ['Phase duration', 'Cell count', 'Division rate']
          },
          variables: {
            cell_type: { options: ['plant', 'animal', 'bacterial'], default: 'animal' },
            temperature: { min: 20, max: 40, default: 37, unit: '°C' },
            nutrient_level: { min: 0, max: 100, default: 50, unit: '%' }
          },
          safetyNotes: ['Use sterile techniques', 'Handle samples carefully', 'Clean equipment after use'],
          simulationData: {
            physics_engine: 'biological',
            collision_detection: false,
            fluid_dynamics: true,
            electromagnetic_forces: false
          },
          isActive: true
        },
        {
          id: '4',
          name: 'Fractal Geometry',
          subjectArea: 'mathematics',
          experimentType: 'mathematics',
          difficultyLevel: 'advanced',
          description: 'Explore mathematical fractals in 3D space, calculating dimensions and creating patterns',
          learningObjectives: ['Understand fractals', 'Calculate fractal dimensions', 'Create fractal patterns'],
          equipmentRequired: ['fractal_generator', 'dimension_calculator', 'pattern_analyzer'],
          procedureSteps: [
            { step: 1, action: 'Set fractal parameters', duration: 5 },
            { step: 2, action: 'Generate fractal pattern', duration: 10 },
            { step: 3, action: 'Calculate fractal dimension', duration: 15 },
            { step: 4, action: 'Analyze pattern properties', duration: 10 }
          ],
          expectedOutcomes: {
            observations: ['Fractals show self-similarity', 'Patterns repeat at different scales'],
            measurements: ['Fractal dimension', 'Pattern complexity', 'Convergence rate']
          },
          variables: {
            fractal_type: { options: ['mandelbrot', 'julia', 'sierpinski'], default: 'mandelbrot' },
            iteration_depth: { min: 10, max: 1000, default: 100, unit: 'iterations' },
            zoom_level: { min: 0.1, max: 10, default: 1, unit: 'x' }
          },
          safetyNotes: ['Monitor computational load', 'Save work frequently', 'Use appropriate precision'],
          simulationData: {
            physics_engine: 'mathematical',
            collision_detection: false,
            fluid_dynamics: false,
            electromagnetic_forces: false
          },
          isActive: true
        }
      ]

      const mockSessions: ExperimentSession[] = [
        {
          id: '1',
          userId: 'user1',
          experimentId: '1',
          environmentId: 'env1',
          sessionData: {
            variables: { gravity_strength: 1.5, object_mass: 25 },
            actions: ['setup', 'place_objects', 'apply_gravity', 'record_data']
          },
          results: {
            observations: ['Objects fell faster with higher gravity', 'Heavier objects fell at same rate'],
            measurements: { acceleration: 14.7, time_fall: 2.1, distance: 15.4 }
          },
          accuracyScore: 0.92,
          safetyScore: 0.95,
          learningOutcomes: ['Understood gravity principles', 'Learned about acceleration'],
          durationMinutes: 35,
          completedAt: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ]

      const mockEquipment: VirtualLabEquipment[] = [
        {
          id: '1',
          name: 'Virtual Microscope',
          equipmentType: 'microscope',
          subjectArea: 'biology',
          functionality: {
            magnification: '1000x',
            resolution: 'high',
            imaging: '3d'
          },
          physicsProperties: {
            weight: 5.0,
            fragility: 'high',
            precision: 'very_high'
          },
          safetyProtocols: ['Handle with care', 'Clean after use', 'Report malfunctions'],
          usageInstructions: {
            setup: 'Place on stable surface',
            operation: 'Adjust focus slowly',
            cleanup: 'Clean lenses and store safely'
          },
          meshData: {
            model: 'microscope_3d',
            materials: ['metal', 'glass', 'plastic'],
            textures: ['brushed_metal', 'clear_glass']
          }
        }
      ]

      setExperiments(mockExperiments)
      setSessions(mockSessions)
      setEquipment(mockEquipment)
    } catch (error) {
      console.error('Failed to load mixed reality data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startExperiment = async (experimentId: string) => {
    setIsRunningExperiment(true)
    // Simulate experiment startup
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRunningExperiment(false)
    // In real implementation, this would launch the VR/AR experiment
    console.log('Starting experiment:', experimentId)
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
      default:
        return Hand
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

  const getSafetyLevel = (notes: string[]) => {
    if (notes.length > 5) return { level: 'High Risk', color: 'text-red-600' }
    if (notes.length > 2) return { level: 'Medium Risk', color: 'text-yellow-600' }
    return { level: 'Low Risk', color: 'text-green-600' }
  }

  const filteredExperiments = experiments.filter(exp => {
    const matchesSubject = filterSubject === 'all' || exp.subjectArea === filterSubject
    const matchesDifficulty = filterDifficulty === 'all' || exp.difficultyLevel === filterDifficulty
    const matchesSearch = searchQuery === '' || 
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSubject && matchesDifficulty && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading mixed reality labs...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mixed Reality Labs</h2>
        <p className="text-gray-600">
          For STEM, students can experiment virtually with real-world physics and chemistry in safe environments.
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
                placeholder="Search experiments..."
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
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExperiments.map((experiment) => {
          const SubjectIcon = getSubjectIcon(experiment.subjectArea)
          const safety = getSafetyLevel(experiment.safetyNotes)
          const experimentSessions = sessions.filter(session => session.experimentId === experiment.id)
          
          return (
            <div
              key={experiment.id}
              className={`bg-white border-2 rounded-lg p-6 transition-all cursor-pointer ${
                selectedExperiment === experiment.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedExperiment(selectedExperiment === experiment.id ? null : experiment.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <SubjectIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{experiment.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experiment.difficultyLevel)}`}>
                        {experiment.difficultyLevel}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{experiment.subjectArea}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${safety.color}`}>
                    {safety.level}
                  </div>
                  <div className="text-xs text-gray-500">Safety Level</div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{experiment.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Learning Objectives</div>
                  <div className="flex flex-wrap gap-1">
                    {experiment.learningObjectives.slice(0, 2).map((objective, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {objective}
                      </span>
                    ))}
                    {experiment.learningObjectives.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{experiment.learningObjectives.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-semibold">
                      {experiment.procedureSteps.reduce((total, step) => total + step.duration, 0)} min
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Equipment</div>
                    <div className="font-semibold">{experiment.equipmentRequired.length} items</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Completed {experimentSessions.length} times</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.7</span>
                  </div>
                </div>
              </div>

              {selectedExperiment === experiment.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Procedure Steps</h4>
                      <div className="space-y-2">
                        {experiment.procedureSteps.map((step, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{step.action}</span>
                            <span className="text-xs text-gray-500">{step.duration} min</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Safety Notes</h4>
                      <div className="space-y-1">
                        {experiment.safetyNotes.map((note, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Variables</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(experiment.variables).map(([key, value]: [string, any]) => (
                          <div key={key} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                            <div className="text-gray-600">
                              {value.min !== undefined ? `${value.min}-${value.max} ${value.unit || ''}` : 
                               value.options ? value.options.join(', ') : 'Configurable'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => startExperiment(experiment.id)}
                      disabled={isRunningExperiment}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isRunningExperiment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>{isRunningExperiment ? 'Starting...' : 'Start Experiment'}</span>
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

      {filteredExperiments.length === 0 && (
        <div className="text-center py-12">
          <Hand className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}