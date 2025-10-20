import React, { useState, useEffect } from 'react'

interface CollaborativeStudyRoomsProps {
  userId: string
}

interface StudyRoom {
  id: string
  name: string
  subject: string
  description: string
  maxParticipants: number
  currentParticipants: number
  isActive: boolean
  createdBy: string
  createdAt: Date
  aiModerator: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface Participant {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  joinedAt: Date
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'user' | 'ai' | 'system'
}

export const CollaborativeStudyRooms: React.FC<CollaborativeStudyRoomsProps> = ({ userId }) => {
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomForm, setRoomForm] = useState({
    name: '',
    subject: '',
    description: '',
    maxParticipants: 6,
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    aiModerator: true
  })

  // Sample rooms for demonstration
  const sampleRooms: StudyRoom[] = [
    {
      id: '1',
      name: 'Calculus Study Group',
      subject: 'Mathematics',
      description: 'Working through calculus problems together',
      maxParticipants: 8,
      currentParticipants: 4,
      isActive: true,
      createdBy: 'Alice Johnson',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiModerator: true,
      difficulty: 'intermediate'
    },
    {
      id: '2',
      name: 'Biology Review Session',
      subject: 'Biology',
      description: 'Preparing for the upcoming biology exam',
      maxParticipants: 6,
      currentParticipants: 3,
      isActive: true,
      createdBy: 'Bob Smith',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      aiModerator: true,
      difficulty: 'advanced'
    },
    {
      id: '3',
      name: 'Programming Basics',
      subject: 'Computer Science',
      description: 'Learning Python fundamentals together',
      maxParticipants: 10,
      currentParticipants: 7,
      isActive: true,
      createdBy: 'Carol Davis',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      aiModerator: true,
      difficulty: 'beginner'
    }
  ]

  const sampleParticipants: Participant[] = [
    { id: '1', name: 'Alice Johnson', avatar: '👩', isOnline: true, joinedAt: new Date() },
    { id: '2', name: 'Bob Smith', avatar: '👨', isOnline: true, joinedAt: new Date() },
    { id: '3', name: 'Carol Davis', avatar: '👩', isOnline: false, joinedAt: new Date() },
    { id: '4', name: 'David Wilson', avatar: '👨', isOnline: true, joinedAt: new Date() }
  ]

  const sampleMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'ai',
      senderName: 'AI Moderator',
      content: 'Welcome to the study room! I\'m here to help facilitate your learning.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'ai'
    },
    {
      id: '2',
      senderId: '1',
      senderName: 'Alice Johnson',
      content: 'Thanks! I\'m struggling with this calculus problem. Can anyone help?',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'user'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Bob Smith',
      content: 'Sure! What\'s the problem?',
      timestamp: new Date(Date.now() - 7 * 60 * 1000),
      type: 'user'
    },
    {
      id: '4',
      senderId: 'ai',
      senderName: 'AI Moderator',
      content: 'I can help too! Please share the problem and I\'ll guide you through the solution step by step.',
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
      type: 'ai'
    }
  ]

  useEffect(() => {
    setRooms(sampleRooms)
  }, [])

  useEffect(() => {
    if (currentRoom) {
      setParticipants(sampleParticipants)
      setMessages(sampleMessages)
    }
  }, [currentRoom])

  const createRoom = () => {
    const newRoom: StudyRoom = {
      id: Date.now().toString(),
      name: roomForm.name,
      subject: roomForm.subject,
      description: roomForm.description,
      maxParticipants: roomForm.maxParticipants,
      currentParticipants: 1,
      isActive: true,
      createdBy: 'You',
      createdAt: new Date(),
      aiModerator: roomForm.aiModerator,
      difficulty: roomForm.difficulty
    }

    setRooms(prev => [newRoom, ...prev])
    setRoomForm({
      name: '',
      subject: '',
      description: '',
      maxParticipants: 6,
      difficulty: 'intermediate',
      aiModerator: true
    })
    setIsCreatingRoom(false)
  }

  const joinRoom = (room: StudyRoom) => {
    setCurrentRoom(room)
    // Simulate joining room
    const updatedRooms = rooms.map(r => 
      r.id === room.id 
        ? { ...r, currentParticipants: Math.min(r.currentParticipants + 1, r.maxParticipants) }
        : r
    )
    setRooms(updatedRooms)
  }

  const leaveRoom = () => {
    if (currentRoom) {
      const updatedRooms = rooms.map(r => 
        r.id === currentRoom.id 
          ? { ...r, currentParticipants: Math.max(r.currentParticipants - 1, 0) }
          : r
      )
      setRooms(updatedRooms)
    }
    setCurrentRoom(null)
    setParticipants([])
    setMessages([])
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !currentRoom) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'user'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'AI Moderator',
        content: generateAIResponse(newMessage),
        timestamp: new Date(),
        type: 'ai'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Let me help you work through this step by step.",
      "I can see you're thinking about this correctly. Here's what I would suggest...",
      "Excellent point! This relates to the concept we discussed earlier.",
      "Let me break this down into smaller parts to make it clearer.",
      "That's a common misconception. Here's the correct approach...",
      "Great work! You're on the right track. Let's build on this idea."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
  }

  if (currentRoom) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Room Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentRoom.name}</h2>
              <p className="text-blue-100">{currentRoom.description}</p>
            </div>
            <button
              onClick={leaveRoom}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">💬 Chat</h3>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.type === 'ai'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      {message.type === 'ai' && <span className="text-xs">🤖</span>}
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Participants & Room Info */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">👥 Participants ({participants.length})</h3>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <span className="text-2xl">{participant.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{participant.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-600">
                          {participant.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">ℹ️ Room Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{currentRoom.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentRoom.difficulty)}`}>
                    {currentRoom.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{currentRoom.currentParticipants}/{currentRoom.maxParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Moderator:</span>
                  <span className="font-medium">{currentRoom.aiModerator ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">👥 Collaborative Study Rooms</h2>
        <p className="text-purple-100">Study together with friends and AI moderation</p>
      </div>

      {/* Create Room Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Available Study Rooms</h3>
        <button
          onClick={() => setIsCreatingRoom(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          ➕ Create New Room
        </button>
      </div>

      {/* Create Room Modal */}
      {isCreatingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Study Room</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                <input
                  type="text"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Calculus Study Group"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={roomForm.subject}
                  onChange={(e) => setRoomForm({...roomForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What will you be studying?"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <select
                    value={roomForm.maxParticipants}
                    onChange={(e) => setRoomForm({...roomForm, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={roomForm.difficulty}
                    onChange={(e) => setRoomForm({...roomForm, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aiModerator"
                  checked={roomForm.aiModerator}
                  onChange={(e) => setRoomForm({...roomForm, aiModerator: e.target.checked})}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="aiModerator" className="text-sm text-gray-700">
                  Enable AI Moderator
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsCreatingRoom(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                disabled={!roomForm.name || !roomForm.subject}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{room.name}</h4>
                <p className="text-sm text-gray-600">{room.subject}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.isActive)}`}>
                {room.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm">{room.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Participants:</span>
                <span className="font-medium">{room.currentParticipants}/{room.maxParticipants}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(room.difficulty)}`}>
                  {room.difficulty.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">AI Moderator:</span>
                <span className="font-medium">{room.aiModerator ? 'Yes' : 'No'}</span>
              </div>
            </div>
            
            <button
              onClick={() => joinRoom(room)}
              disabled={room.currentParticipants >= room.maxParticipants}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {room.currentParticipants >= room.maxParticipants ? 'Room Full' : 'Join Room'}
            </button>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Study Room Tips</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• <strong>AI Moderator:</strong> Helps facilitate discussions and answer questions</li>
          <li>• <strong>Active Participation:</strong> Engage with others to maximize learning</li>
          <li>• <strong>Respectful Communication:</strong> Maintain a positive learning environment</li>
          <li>• <strong>Share Resources:</strong> Help others by sharing helpful materials</li>
        </ul>
      </div>
    </div>
  )
}