import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/AuthProvider'

interface Message {
  id: string
  user_id: string
  username: string
  message: string
  timestamp: string
  type: 'text' | 'ai_response' | 'system'
}

interface StudyRoom {
  id: string
  name: string
  subject: string
  max_participants: number
  current_participants: number
  is_active: boolean
}

interface CollaborativeStudyRoomProps {
  roomId: string
}

export function CollaborativeStudyRoom({ roomId }: CollaborativeStudyRoomProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [room, setRoom] = useState<StudyRoom | null>(null)
  const [participants, setParticipants] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!roomId || !user) return

    // Load room data
    loadRoomData()
    
    // Subscribe to real-time messages
    const messagesSubscription = supabase
      .channel(`study_room_${roomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'study_room_messages',
          filter: `room_id=eq.${roomId}`
        }, 
        (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => [...prev, newMsg])
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = messagesSubscription.presenceState()
        const users = Object.keys(state).map(key => state[key][0]?.user_id).filter(Boolean)
        setParticipants(users as string[])
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const newUser = newPresences[0]?.user_id
        if (newUser) {
          setParticipants(prev => [...prev, newUser])
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const leftUser = leftPresences[0]?.user_id
        if (leftUser) {
          setParticipants(prev => prev.filter(id => id !== leftUser))
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await messagesSubscription.track({
            user_id: user.id,
            username: user.user_metadata?.full_name || user.email,
            online_at: new Date().toISOString()
          })
        }
      })

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [roomId, user])

  const loadRoomData = async () => {
    try {
      // Load room info
      const { data: roomData, error: roomError } = await supabase
        .from('study_rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (roomError) throw roomError
      setRoom(roomData)

      // Load recent messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('study_room_messages')
        .select(`
          *,
          users!study_room_messages_user_id_fkey(full_name, email)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (messagesError) throw messagesError
      
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id,
        user_id: msg.user_id,
        username: msg.users?.full_name || msg.users?.email || 'Unknown',
        message: msg.message,
        timestamp: msg.created_at,
        type: msg.type || 'text'
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading room data:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      const { error } = await supabase
        .from('study_room_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          message: newMessage.trim(),
          type: 'text'
        })

      if (error) throw error

      setNewMessage('')
      
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      setIsTyping(prev => prev.filter(id => id !== user.id))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set typing indicator
    if (!isTyping.includes(user?.id || '')) {
      setIsTyping(prev => [...prev, user?.id || ''])
    }

    // Clear typing indicator after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(prev => prev.filter(id => id !== user?.id))
    }, 3000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Room Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-600">{room.subject} • {participants.length} participants</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participantId, index) => (
                <div
                  key={participantId}
                  className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                >
                  {index + 1}
                </div>
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                  +{participants.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.user_id === user?.id
                  ? 'bg-indigo-600 text-white'
                  : message.type === 'ai_response'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-600 text-center text-sm'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type !== 'system' && (
                <div className="text-xs font-medium mb-1">
                  {message.username}
                </div>
              )}
              <div className="text-sm">{message.message}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">
                {isTyping.length === 1 ? 'Someone is typing...' : `${isTyping.length} people are typing...`}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}