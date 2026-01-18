'use client'

import { useState } from 'react'
import { getStatusClasses } from '@/lib/constants'
import { AvatarSimple } from '@/components/ui'
import type { ConversationResponse } from '@/services/api/collaborations'

interface ConversationsListProps {
  conversations: ConversationResponse[]
  selectedChatId: string | null
  isLoading: boolean
  onSelectChat: (id: string) => void
}

// Format relative time for messages
function formatTime(dateStr: string | null) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffInHours < 168) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function ConversationsList({
  conversations,
  selectedChatId,
  isLoading,
  onSelectChat,
}: ConversationsListProps) {
  const [activeTab, setActiveTab] = useState<'Active' | 'Archived'>('Active')

  const archivedStatuses = ['completed', 'cancelled', 'declined']
  const filteredConversations = conversations.filter((chat) => {
    const isArchived = archivedStatuses.includes(chat.collaboration_status.toLowerCase())
    return activeTab === 'Archived' ? isArchived : !isArchived
  })

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={() => setActiveTab('Active')}
          className={`flex-1 py-3 text-sm font-medium text-center relative ${
            activeTab === 'Active' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Active
          {activeTab === 'Active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('Archived')}
          className={`flex-1 py-3 text-sm font-medium text-center relative ${
            activeTab === 'Archived' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Archived
          {activeTab === 'Archived' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Chats List */}
      <div className="divide-y divide-gray-50">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            {activeTab === 'Active' ? 'No active conversations.' : 'No archived conversations.'}
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.collaboration_id}
              onClick={() => onSelectChat(chat.collaboration_id)}
              className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors relative ${
                selectedChatId === chat.collaboration_id
                  ? 'bg-blue-50/80 border-r-2 border-blue-600'
                  : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <AvatarSimple
                    src={chat.partner_avatar}
                    name={chat.partner_name}
                    size="md"
                    variant="blue"
                  />
                  {chat.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {chat.unread_count}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {chat.partner_name}
                    </h4>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {formatTime(chat.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${getStatusClasses(chat.collaboration_status)}`}
                    >
                      {chat.collaboration_status}
                    </span>
                    {chat.my_role && (
                      <span className="text-[10px] text-gray-400 capitalize">{chat.my_role}</span>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate ${
                      chat.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {chat.last_message_content || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
