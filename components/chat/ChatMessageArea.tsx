'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { AvatarSimple } from '@/components/ui'
import { SystemMessage } from './SystemMessage'
import type { MessageResponse, ConversationResponse } from '@/services/api/collaborations'

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

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
  onSendImageMessage?: (file: File, caption?: string) => Promise<void>
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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
  onSendImageMessage,
}: ChatMessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isLoading && !isLoadingMore) {
      scrollToBottom()
    }
  }, [messages, isLoading, isLoadingMore])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmojiPicker])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError('Please select an image (JPG, PNG, WebP, GIF)')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Image must be smaller than 5MB')
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImage(null)
    setImagePreview('')
    setUploadError(null)
  }

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const input = textInputRef.current
    if (input) {
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const newValue = messageInput.slice(0, start) + emojiData.emoji + messageInput.slice(end)
      onMessageInputChange(newValue)

      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emojiData.emoji.length
        input.focus()
      }, 0)
    } else {
      onMessageInputChange(messageInput + emojiData.emoji)
    }
    setShowEmojiPicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedImage && onSendImageMessage) {
      setIsUploading(true)
      setUploadError(null)

      try {
        const caption = messageInput.trim() || undefined
        await onSendImageMessage(selectedImage, caption)
        handleRemoveImage()
        onMessageInputChange('')
      } catch (error) {
        console.error('Failed to send image:', error)
        setUploadError('Failed to upload. Please try again.')
      } finally {
        setIsUploading(false)
      }
    } else if (messageInput.trim()) {
      onSendMessage(e)
    }
  }

  const canSend = (selectedImage && !isUploading) || messageInput.trim()

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
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg border border-gray-200"
            />
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Attach image"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={textInputRef}
              type="text"
              placeholder={selectedImage ? 'Add a caption (optional)...' : 'Type a message...'}
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              disabled={isUploading}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
            />
          </div>

          {/* Emoji button */}
          <div className="relative emoji-picker-container">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isUploading}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Add emoji"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!canSend || isUploading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </>
  )
}
