'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { UserType, Hotel, Creator } from '@/lib/types'
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon as CheckCircleIconSolid,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Message {
  id: string
  senderId: string
  senderType: UserType
  text: string
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  participantId: string
  participantType: UserType
  participantName: string
  participantAvatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  messages: Message[]
}

function ChatsPageContent() {
  const { isCollapsed } = useSidebar()
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<UserType>('creator')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    message: '',
    proposedDates: '',
    collaborationType: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = typeof window !== 'undefined'
      ? (localStorage.getItem('userType') as UserType) || 'creator'
      : 'creator'
    setUserType(storedUserType)
    
    // Load mock conversations
    const mockConversations = getMockConversations(storedUserType)
    setConversations(mockConversations)
    
    // Check if we need to start a new chat
    const startChatId = searchParams.get('startChat')
    if (startChatId) {
      // Find or create conversation with this hotel/creator
      const existingConv = mockConversations.find(c => c.participantId === startChatId)
      if (existingConv) {
        setSelectedConversation(existingConv.id)
      } else {
        // Create new conversation
        const newConv = createNewConversation(startChatId, storedUserType)
        setConversations(prev => [newConv, ...prev])
        setSelectedConversation(newConv.id)
      }
      // Clean up URL
      window.history.replaceState({}, '', ROUTES.CHATS)
    } else {
      // Auto-select first conversation
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0].id)
      }
    }
  }, [searchParams])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation, conversations])

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderType: userType,
      text: messageText.trim(),
      timestamp: new Date(),
      read: false,
    }

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.text,
            lastMessageTime: newMessage.timestamp,
            unreadCount: 0,
          }
        }
        return conv
      })
    )

    setMessageText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRequestCollaboration = () => {
    if (!currentConversation) return

    setRequesting(true)
    // Simulate collaboration request (frontend design only)
    setTimeout(() => {
      setRequesting(false)
      setShowRequestModal(false)
      setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
      // Redirect to collaborations page after a short delay
      setTimeout(() => {
        window.location.href = ROUTES.COLLABORATIONS
      }, 500)
    }, 1000)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRequestForm(prev => ({ ...prev, [name]: value }))
  }

  const currentConversation = conversations.find(c => c.id === selectedConversation)
  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
        <div className="pt-16">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Messages
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Chat with {userType === 'hotel' ? 'creators' : 'hotels'} about collaborations
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="flex h-[calc(100vh-280px)] min-h-[600px]">
            {/* Conversations List */}
            <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                          selectedConversation === conversation.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {conversation.participantName.charAt(0)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.participantName}
                              </h3>
                              {conversation.lastMessageTime && (
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage || 'No messages yet'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 flex-shrink-0 px-2 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col hidden md:flex">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {currentConversation.participantName.charAt(0)}
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900">{currentConversation.participantName}</h2>
                          <p className="text-sm text-gray-500">
                            {currentConversation.participantType === 'hotel' ? 'Hotel' : 'Creator'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={currentConversation.participantType === 'hotel' 
                          ? `/hotels/${currentConversation.participantId}`
                          : `/creators/${currentConversation.participantId}`
                        }>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        {userType === 'creator' && currentConversation.participantType === 'hotel' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowRequestModal(true)}
                          >
                            Request Collaboration
                          </Button>
                        )}
                        {userType === 'hotel' && currentConversation.participantType === 'creator' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowRequestModal(true)}
                          >
                            Request Collaboration
                          </Button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                    <div className="space-y-4">
                      {currentConversation.messages.map((message) => {
                        const isOwnMessage = message.senderId === 'current-user'
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-2xl px-4 py-3 ${
                                  isOwnMessage
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.timestamp)}
                                </span>
                                {isOwnMessage && (
                                  <span>
                                    {message.read ? (
                                      <CheckCircleIconSolid className="w-4 h-4 text-primary-600" />
                                    ) : (
                                      <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="px-6"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collaboration Request Modal */}
        {showRequestModal && currentConversation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-3xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Request Collaboration</h2>
                  <p className="text-primary-100 mt-1">
                    Send a collaboration request to {currentConversation.participantName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRequestModal(false)
                    setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                  }}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleRequestCollaboration()
                }}
                className="p-8 space-y-6"
              >
                {/* Collaboration Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Collaboration Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="collaborationType"
                    value={requestForm.collaborationType}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select collaboration type</option>
                    <option value="content-creation">Content Creation</option>
                    <option value="social-media">Social Media Promotion</option>
                    <option value="blog-post">Blog Post</option>
                    <option value="video-production">Video Production</option>
                    <option value="photography">Photography</option>
                    <option value="influencer-stay">Influencer Stay</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Proposed Dates */}
                <div>
                  <Input
                    label="Proposed Dates"
                    name="proposedDates"
                    type="text"
                    value={requestForm.proposedDates}
                    onChange={handleFormChange}
                    placeholder="e.g., March 15-20, 2024 or Flexible"
                    helperText="When would you like to collaborate?"
                  />
                </div>

                {/* Message */}
                <div>
                  <Textarea
                    label="Message"
                    name="message"
                    value={requestForm.message}
                    onChange={handleFormChange}
                    required
                    rows={6}
                    placeholder="Tell them about your collaboration idea, your audience, and what you can offer..."
                    helperText="Describe your collaboration proposal in detail"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      setShowRequestModal(false)
                      setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    isLoading={requesting}
                    disabled={requesting}
                  >
                    {requesting ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function ChatsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <AuthenticatedNavigation />
        <div className="pl-64 pt-16 transition-all duration-300">
          <div className="pt-16">
            <ProfileWarningBanner />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    }>
      <ChatsPageContent />
    </Suspense>
  )
}

// Helper function to format time
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Create a new conversation with a hotel or creator
function createNewConversation(participantId: string, userType: UserType): Conversation {
  const participantType: UserType = userType === 'hotel' ? 'creator' : 'hotel'
  
  // Mock data for new conversations
  const mockNames: Record<string, string> = {
    '1': userType === 'hotel' ? 'Sarah Travels' : 'Sunset Beach Resort',
    '2': userType === 'hotel' ? 'Adventure Mike' : 'Mountain View Lodge',
  }

  return {
    id: `new-${participantId}-${Date.now()}`,
    participantId,
    participantType,
    participantName: mockNames[participantId] || (userType === 'hotel' ? 'Creator' : 'Hotel'),
    lastMessage: undefined,
    lastMessageTime: undefined,
    unreadCount: 0,
    messages: [],
  }
}

// Mock conversations data
function getMockConversations(userType: UserType): Conversation[] {
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      description: 'Luxury beachfront resort',
      images: [],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      description: 'Cozy alpine lodge',
      images: [],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockCreators: Creator[] = [
    {
      id: '1',
      name: 'Sarah Travels',
      niche: ['Luxury Travel'],
      platforms: [],
      audienceSize: 125000,
      location: 'Bali, Indonesia',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Adventure Mike',
      niche: ['Adventure Travel'],
      platforms: [],
      audienceSize: 89000,
      location: 'Swiss Alps, Switzerland',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  if (userType === 'hotel') {
    return [
      {
        id: '1',
        participantId: '1',
        participantType: 'creator',
        participantName: 'Sarah Travels',
        lastMessage: 'Looking forward to working with you!',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 2,
        messages: [
          {
            id: '1',
            senderId: '1',
            senderType: 'creator',
            text: 'Hi! I saw your hotel and I think it would be perfect for a collaboration. I specialize in luxury travel content.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '2',
            senderId: 'current-user',
            senderType: 'hotel',
            text: 'Hello Sarah! That sounds great. What kind of collaboration are you thinking about?',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '3',
            senderId: '1',
            senderType: 'creator',
            text: 'I was thinking about a 3-night stay in exchange for Instagram posts and stories. I have 125K followers with a 4.2% engagement rate.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '4',
            senderId: 'current-user',
            senderType: 'hotel',
            text: 'That sounds perfect! When would you be available?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '5',
            senderId: '1',
            senderType: 'creator',
            text: 'I\'m flexible in March. Would that work for you?',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '6',
            senderId: '1',
            senderType: 'creator',
            text: 'Looking forward to working with you!',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
          },
        ],
      },
      {
        id: '2',
        participantId: '2',
        participantType: 'creator',
        participantName: 'Adventure Mike',
        lastMessage: 'Thanks for the quick response!',
        lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        unreadCount: 0,
        messages: [
          {
            id: '1',
            senderId: '2',
            senderType: 'creator',
            text: 'Hi there! I\'m interested in featuring your hotel in my adventure travel content.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '2',
            senderId: 'current-user',
            senderType: 'hotel',
            text: 'Hello! That sounds interesting. Tell me more about your content style.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '3',
            senderId: '2',
            senderType: 'creator',
            text: 'Thanks for the quick response!',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            read: true,
          },
        ],
      },
    ]
  } else {
    return [
      {
        id: '1',
        participantId: '1',
        participantType: 'hotel',
        participantName: 'Sunset Beach Resort',
        lastMessage: 'That sounds perfect! When would you be available?',
        lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        unreadCount: 0,
        messages: [
          {
            id: '1',
            senderId: 'current-user',
            senderType: 'creator',
            text: 'Hi! I saw your hotel and I think it would be perfect for a collaboration. I specialize in luxury travel content.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '2',
            senderId: '1',
            senderType: 'hotel',
            text: 'Hello Sarah! That sounds great. What kind of collaboration are you thinking about?',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '3',
            senderId: 'current-user',
            senderType: 'creator',
            text: 'I was thinking about a 3-night stay in exchange for Instagram posts and stories. I have 125K followers with a 4.2% engagement rate.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '4',
            senderId: '1',
            senderType: 'hotel',
            text: 'That sounds perfect! When would you be available?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: true,
          },
        ],
      },
      {
        id: '2',
        participantId: '2',
        participantType: 'hotel',
        participantName: 'Mountain View Lodge',
        lastMessage: 'We\'d love to host you!',
        lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        unreadCount: 1,
        messages: [
          {
            id: '1',
            senderId: 'current-user',
            senderType: 'creator',
            text: 'Hello! I\'m interested in creating content at your lodge. Do you work with travel creators?',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
          },
          {
            id: '2',
            senderId: '2',
            senderType: 'hotel',
            text: 'Yes, we do! We\'d love to host you!',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: false,
          },
        ],
      },
    ]
  }
}

