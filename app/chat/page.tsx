'use client'

import React, { useState, useEffect } from 'react'
import {
  collaborationService,
  PlatformDeliverablesItem,
  PlatformDeliverable,
  transformCollaborationResponse,
  DetailedCollaboration,
  MessageResponse,
  UpdateCollaborationTermsRequest,
  ConversationResponse,
} from '@/services/api/collaborations'
import { AuthenticatedNavigation } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import SuggestChangesModal from './SuggestChangesModal'
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { CollaborationRequestDetailModal } from '@/components/marketplace/CollaborationRequestDetailModal'
import {
  PendingApplicationsList,
  ConversationsList,
  ChatMessageArea,
  ChatDetailsPanel,
  type PendingRequest,
} from '@/components/chat'
import type { Collaboration, Hotel, Creator } from '@/lib/types'
import { STORAGE_KEYS, getStatusClasses } from '@/lib/constants'
import { getInitials, formatCompactNumber } from '@/lib/utils'

function ChatPageContent() {
  const { isCollapsed } = useSidebar()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const [detailCollaboration, setDetailCollaboration] = useState<
    (Collaboration & { hotel?: Hotel; creator?: Creator }) | null
  >(null)

  // State for pending applications and conversations
  const [userType, setUserType] = useState<string | null>(null)
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)

  const [realMessages, setRealMessages] = useState<MessageResponse[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [activeCollaboration, setActiveCollaboration] = useState<DetailedCollaboration | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancellationTargetId, setCancellationTargetId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) || 'hotel'
      setUserType(storedUserType)
    }
  }, [])

  const fetchData = async () => {
    if (!userType) return

    try {
      const requestsData =
        userType === 'hotel'
          ? await collaborationService.getHotelCollaborations({ status: 'pending' })
          : await collaborationService.getCreatorCollaborations()

      const formattedRequests = requestsData
        .filter((collab) => collab.status === 'pending')
        .map((collab) => {
          const isReceived = !collab.is_initiator
          const derivedPlatforms =
            collab.platforms ||
            collab.platform_deliverables?.map((pd) => ({
              name: pd.platform.toLowerCase(),
            })) ||
            []

          let offerDetails = ''
          if (userType === 'creator' && collab.collaboration_type) {
            if (collab.collaboration_type === 'Free Stay' && collab.free_stay_max_nights) {
              offerDetails = `${collab.free_stay_max_nights} Nights`
            } else if (collab.collaboration_type === 'Paid' && collab.paid_amount) {
              offerDetails = `$${collab.paid_amount}`
            } else if (collab.collaboration_type === 'Discount' && collab.discount_percentage) {
              offerDetails = `${collab.discount_percentage}% Off`
            } else {
              offerDetails = collab.collaboration_type
            }
          }

          return {
            id: collab.id,
            name: userType === 'hotel' ? collab.creator_name : collab.hotel_name || 'Hotel',
            time: new Date(collab.created_at).toLocaleDateString(),
            followers: formatCompactNumber(collab.total_followers),
            followersPlatform: (collab.active_platform || 'instagram').toLowerCase(),
            engagement: (collab.avg_engagement_rate || 0).toFixed(1) + '%',
            engagementPlatform: (collab.active_platform || 'instagram').toLowerCase(),
            platforms: derivedPlatforms,
            location: collab.listing_location || collab.hotel_location || '',
            collaborationType: collab.collaboration_type || '',
            offerDetails: offerDetails,
            avatarColor: 'bg-blue-100 text-blue-600',
            avatarUrl:
              userType === 'hotel' ? collab.creator_profile_picture : collab.hotel_picture,
            initials: getInitials(
              userType === 'hotel' ? collab.creator_name : collab.hotel_name || 'Hotel'
            ),
            isReceived,
            status: collab.status,
          }
        })
      setPendingRequests(formattedRequests)

      const convData = await collaborationService.getConversations()
      setConversations(convData)
    } catch (error) {
      console.error('Failed to fetch chat data:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userType])

  const fetchMessages = async (silent = false, skipDetails = false) => {
    if (!selectedChatId) return

    if (!silent) {
      setIsLoadingMessages(true)
      if (!skipDetails) setIsLoadingDetails(true)
    }

    setHasMoreMessages(true)
    setConversations((prev) =>
      prev.map((conv) =>
        conv.collaboration_id === selectedChatId ? { ...conv, unread_count: 0 } : conv
      )
    )

    try {
      const msgData = await collaborationService.getMessages(selectedChatId)
      const reversed = [...msgData].reverse()
      setRealMessages(reversed)
      if (msgData.length < 50) {
        setHasMoreMessages(false)
      }

      collaborationService.markAsRead(selectedChatId).catch((err) =>
        console.error('Failed to mark as read:', err)
      )

      if (!skipDetails) {
        const detailResponse =
          userType === 'hotel'
            ? await collaborationService.getHotelCollaborationDetails(selectedChatId)
            : await collaborationService.getCreatorCollaborationDetails(selectedChatId)

        const detailedCollaboration = transformCollaborationResponse(detailResponse)
        setActiveCollaboration(detailedCollaboration)
      }
    } catch (error) {
      console.error('Failed to fetch chat details:', error)
    } finally {
      if (!silent) {
        setIsLoadingMessages(false)
        if (!skipDetails) setIsLoadingDetails(false)
      }
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    if (!selectedChatId) {
      setRealMessages([])
      return
    }
    fetchMessages()
  }, [selectedChatId])

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMessages || !selectedChatId || realMessages.length === 0) return

    setIsLoadingMore(true)
    try {
      const oldestMessage = realMessages[0]
      const data = await collaborationService.getMessages(selectedChatId, oldestMessage.created_at)

      if (data.length === 0) {
        setHasMoreMessages(false)
      } else {
        const reversed = [...data].reverse()
        setRealMessages((prev) => [...reversed, ...prev])
        if (data.length < 50) {
          setHasMoreMessages(false)
        }
      }
    } catch (error) {
      console.error('Failed to load more messages:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleViewDetails = async (id: string) => {
    try {
      const detailResponse =
        userType === 'creator'
          ? await collaborationService.getCreatorCollaborationDetails(id)
          : await collaborationService.getHotelCollaborationDetails(id)
      const detailedCollaboration = transformCollaborationResponse(detailResponse)
      setDetailCollaboration(detailedCollaboration)
    } catch (error) {
      console.error('Error fetching collaboration details:', error)
    }
  }

  const handleAccept = async (id: string) => {
    try {
      await collaborationService.respondToCollaboration(id, { status: 'accepted' })
      setPendingRequests((prev) => prev.filter((r) => r.id !== id))
      setDetailCollaboration(null)
      const convData = await collaborationService.getConversations()
      setConversations(convData)
    } catch (error) {
      console.error('Error accepting collaboration:', error)
    }
  }

  const handleDecline = async (id: string) => {
    try {
      await collaborationService.respondToCollaboration(id, { status: 'declined' })
      setPendingRequests((prev) => prev.filter((r) => r.id !== id))
      setDetailCollaboration(null)
      const convData = await collaborationService.getConversations()
      setConversations(convData)
    } catch (error) {
      console.error('Error declining collaboration:', error)
    }
  }

  const activeChat = selectedChatId
    ? conversations.find((c) => c.collaboration_id === selectedChatId)
    : null

  const toggleDeliverable = async (deliverableId: string) => {
    if (!selectedChatId) return

    try {
      const updatedResponse = await collaborationService.toggleDeliverable(
        selectedChatId,
        deliverableId
      )
      const detailedCollaboration = transformCollaborationResponse(updatedResponse)
      setActiveCollaboration(detailedCollaboration)
      fetchMessages(true, true)
    } catch (error) {
      console.error('Failed to toggle deliverable:', error)
    }
  }

  const handleSuggestChanges = async (data: UpdateCollaborationTermsRequest) => {
    if (!selectedChatId) return

    try {
      const updatedResponse = await collaborationService.updateTerms(selectedChatId, data)
      const detailedCollaboration = transformCollaborationResponse(updatedResponse)
      setActiveCollaboration(detailedCollaboration)
      setIsSuggestModalOpen(false)
      fetchMessages(true, true)
    } catch (error) {
      console.error('Failed to suggest changes:', error)
    }
  }

  const handleApproveTerms = async (id?: string) => {
    const collabId = id || selectedChatId
    if (!collabId) return

    try {
      const updatedResponse = await collaborationService.approveCollaboration(collabId)
      const detailedCollaboration = transformCollaborationResponse(updatedResponse)
      setActiveCollaboration(detailedCollaboration)
      fetchMessages(true, true)
    } catch (error) {
      console.error('Failed to approve terms:', error)
    }
  }

  const handleCancelCollaboration = async () => {
    if (!cancellationTargetId) return

    try {
      const response = await collaborationService.cancelCollaboration(
        cancellationTargetId,
        cancelReason
      )

      if (cancellationTargetId === selectedChatId) {
        const detailedCollaboration = transformCollaborationResponse(response)
        setActiveCollaboration(detailedCollaboration)
        fetchMessages(true, true)
      }

      fetchData()
      setIsCancelModalOpen(false)
      setCancelReason('')
      setCancellationTargetId(null)
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Failed to cancel collaboration:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedChatId) return

    const content = messageInput.trim()
    setMessageInput('')

    try {
      const tempMessage = {
        id: `temp-${Date.now()}`,
        collaboration_id: selectedChatId,
        sender_id: 'me',
        sender_name: 'Me',
        sender_avatar: null,
        content: content,
        content_type: 'text' as const,
        metadata: null,
        created_at: new Date().toISOString(),
      }

      setRealMessages((prev) => [...prev, tempMessage])

      setConversations((prev) => {
        const chatIndex = prev.findIndex((c) => c.collaboration_id === selectedChatId)
        if (chatIndex === -1) return prev

        const updatedChat = {
          ...prev[chatIndex],
          last_message_content: content,
          last_message_at: tempMessage.created_at,
          unread_count: 0,
        }

        const filtered = prev.filter((c) => c.collaboration_id !== selectedChatId)
        return [updatedChat, ...filtered]
      })

      await collaborationService.sendMessage(selectedChatId, content)
    } catch (error) {
      console.error('Failed to send message:', error)
      setRealMessages((prev) => prev.filter((m) => !m.id.toString().startsWith('temp-')))
      setMessageInput(content)
    }
  }

  const handleSendImageMessage = async (file: File, caption?: string) => {
    if (!selectedChatId) return

    // Upload image
    const { url } = await collaborationService.uploadChatImage(file)

    // Create temp message for image
    const tempImageMessage = {
      id: `temp-img-${Date.now()}`,
      collaboration_id: selectedChatId,
      sender_id: 'me',
      sender_name: 'Me',
      sender_avatar: null,
      content: url,
      content_type: 'image' as const,
      metadata: null,
      created_at: new Date().toISOString(),
    }

    setRealMessages((prev) => [...prev, tempImageMessage])

    // Send image message
    await collaborationService.sendMessage(selectedChatId, url, 'image')

    // Update conversation list
    setConversations((prev) => {
      const chatIndex = prev.findIndex((c) => c.collaboration_id === selectedChatId)
      if (chatIndex === -1) return prev

      const updatedChat = {
        ...prev[chatIndex],
        last_message_content: caption || 'Sent an image',
        last_message_at: new Date().toISOString(),
        unread_count: 0,
      }

      const filtered = prev.filter((c) => c.collaboration_id !== selectedChatId)
      return [updatedChat, ...filtered]
    })

    // If caption provided, send it as a separate text message
    if (caption) {
      const tempCaptionMessage = {
        id: `temp-caption-${Date.now()}`,
        collaboration_id: selectedChatId,
        sender_id: 'me',
        sender_name: 'Me',
        sender_avatar: null,
        content: caption,
        content_type: 'text' as const,
        metadata: null,
        created_at: new Date().toISOString(),
      }

      setRealMessages((prev) => [...prev, tempCaptionMessage])
      await collaborationService.sendMessage(selectedChatId, caption)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <AuthenticatedNavigation />

      <div
        className={`fixed top-16 bottom-0 left-0 right-0 flex transition-all duration-300 ${
          isCollapsed ? 'md:pl-16' : 'md:pl-56'
        } z-0`}
      >
        {/* COLUMN 1: LEFT SIDEBAR */}
        <div className="w-80 md:w-96 border-r border-gray-200 flex flex-col h-full bg-white flex-shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Pending Applications */}
            <PendingApplicationsList
              requests={pendingRequests}
              userType={userType}
              onViewDetails={handleViewDetails}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />

            {/* Conversations List */}
            <ConversationsList
              conversations={conversations}
              selectedChatId={selectedChatId}
              isLoading={isLoadingConversations}
              onSelectChat={setSelectedChatId}
            />
          </div>
        </div>

        {/* MIDDLE & RIGHT COLUMNS */}
        {selectedChatId && activeChat && activeCollaboration ? (
          <>
            {/* COLUMN 2: CHAT AREA */}
            <div className="flex-1 flex flex-col h-full bg-white relative border-r border-gray-200">
              {/* Chat Header */}
              <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  {activeChat.partner_avatar ? (
                    <img
                      src={activeChat.partner_avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {getInitials(activeChat.partner_name)}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-none">
                        {activeChat.partner_name}
                      </h3>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full border border-current opacity-80 ${getStatusClasses(activeChat.collaboration_status)}`}
                      >
                        {activeChat.collaboration_status}
                      </span>
                    </div>
                    {activeCollaboration.listingName && (
                      <div className="flex items-center gap-1.5 py-0.5 px-2 bg-blue-50/50 border border-blue-100/50 rounded-lg w-fit">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">
                          {userType === 'hotel' ? 'Applied to:' : 'Property:'}
                        </span>
                        <span className="text-xs font-black text-blue-600 tracking-wide">
                          {activeCollaboration.listingName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailCollaboration(activeCollaboration)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Details <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* More Options Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                          {['pending', 'negotiating', 'accepted'].includes(
                            activeChat.collaboration_status.toLowerCase()
                          ) && (
                            <button
                              onClick={() => {
                                setCancellationTargetId(selectedChatId)
                                setIsCancelModalOpen(true)
                                setIsMenuOpen(false)
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <ExclamationTriangleIcon className="w-4 h-4" />
                              {activeChat.collaboration_status.toLowerCase() === 'pending'
                                ? 'Withdraw Request'
                                : 'Cancel Collaboration'}
                            </button>
                          )}
                          {!['pending', 'negotiating', 'accepted'].includes(
                            activeChat.collaboration_status.toLowerCase()
                          ) && (
                            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
                              No actions available
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ChatMessageArea
                messages={realMessages}
                activeChat={activeChat}
                isLoading={isLoadingMessages}
                isLoadingMore={isLoadingMore}
                hasMoreMessages={hasMoreMessages}
                messageInput={messageInput}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
                onLoadMore={handleLoadMore}
                onSendImageMessage={handleSendImageMessage}
              />
            </div>

            {/* COLUMN 3: DETAILS PANEL */}
            <ChatDetailsPanel
              activeChat={activeChat}
              activeCollaboration={activeCollaboration}
              userType={userType}
              onToggleDeliverable={toggleDeliverable}
              onSuggestChanges={() => setIsSuggestModalOpen(true)}
              onApproveTerms={() => handleApproveTerms()}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Select a conversation</h3>
              <p className="text-sm text-gray-500">
                Choose a chat from the sidebar to view messages
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CollaborationRequestDetailModal
        isOpen={!!detailCollaboration}
        onClose={() => setDetailCollaboration(null)}
        collaboration={detailCollaboration}
        currentUserType={userType as 'hotel' | 'creator'}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      <SuggestChangesModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        initialCheckIn={activeCollaboration?.travelDateFrom || activeCollaboration?.preferredDateFrom || ''}
        initialCheckOut={activeCollaboration?.travelDateTo || activeCollaboration?.preferredDateTo || ''}
        initialPlatformDeliverables={activeCollaboration?.platformDeliverables || []}
        initialCollaborationType={activeCollaboration?.collaborationType}
        initialFreeStayMaxNights={activeCollaboration?.freeStayMaxNights}
        initialPaidAmount={activeCollaboration?.paidAmount}
        initialDiscountPercentage={activeCollaboration?.discountPercentage}
        allowedCollaborationTypes={activeCollaboration?.allowedCollaborationTypes}
        userType={userType}
        onSubmit={handleSuggestChanges}
      />

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Collaboration</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel this collaboration? This action cannot be undone.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setIsCancelModalOpen(false)
                  setCancelReason('')
                  setCancellationTargetId(null)
                }}
                className="flex-1 py-2.5 px-4 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Keep Collaboration
              </button>
              <button
                onClick={handleCancelCollaboration}
                className="flex-1 py-2.5 px-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Cancel Collaboration
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function ChatPage() {
  return <ChatPageContent />
}
