'use client'

import React, { useRef, useEffect } from 'react'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'
import { AvatarSimple } from '@/components/ui'
import { SystemMessage } from './SystemMessage'
import type { MessageResponse, ConversationResponse } from '@/services/api/collaborations'

interface ChatMessageAreaProps {
  messages: MessageResponse[]
  activeChat: ConversationResponse
  isLoading: boolean
  isLoadingMore: boolean
  hasMoreMessages: boolean
  messageInput: string
  onMessageInputChange: (value: string) => void
  onSendMessage: (e: React.FormEvent) => void
  onLoadMore: () => void
}

export function ChatMessageArea({
  messages,
  activeChat,
  isLoading,
  isLoadingMore,
  hasMoreMessages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onLoadMore,
}: ChatMessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isLoading && !isLoadingMore) {
      scrollToBottom()
    }
  }, [messages, isLoading, isLoadingMore])

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {hasMoreMessages && (
              <div className="flex justify-center pb-4">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading older messages...' : 'Load older messages'}
                </button>
              </div>
            )}

            {messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isSystem = msg.sender_id === null || msg.content_type === 'system'
                const isThem = !isSystem && msg.sender_name === activeChat.partner_name
                const isMe = !isSystem && !isThem

                // Simple date grouping
                const showDate =
                  idx === 0 ||
                  new Date(messages[idx - 1].created_at).toDateString() !==
                    new Date(msg.created_at).toDateString()
                const dateStr = new Date(msg.created_at).toLocaleDateString([], {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
                const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                if (isSystem) {
                  return <SystemMessage key={msg.id} content={msg.content} />
                }

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="bg-gray-100/80 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">
                          {dateStr}
                        </span>
                      </div>
                    )}
                    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[70%]">
                        <div className="flex items-end gap-2">
                          {isThem && (
                            <AvatarSimple
                              src={msg.sender_avatar}
                              name={msg.sender_name || activeChat.partner_name}
                              size="sm"
                              variant="blue"
                            />
                          )}
                          <div>
                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'
                              }`}
                            >
                              {msg.content_type === 'image' ? (
                                <img
                                  src={msg.content}
                                  alt="Attachment"
                                  className="max-w-full rounded-lg"
                                />
                              ) : (
                                msg.content
                              )}
                            </div>
                            <div
                              className={`text-[10px] text-gray-400 mt-1 ${
                                isMe ? 'text-right' : 'text-left'
                              }`}
                            >
                              {timeStr} {isMe && '✓'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No messages yet. Send a message to start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Footer: Message Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <form onSubmit={onSendMessage} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  )
}
