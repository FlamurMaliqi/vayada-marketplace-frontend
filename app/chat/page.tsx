'use client'

import React, { useState, useEffect } from 'react'
import { collaborationService, PlatformDeliverablesItem, PlatformDeliverable, transformCollaborationResponse, DetailedCollaboration } from '@/services/api/collaborations'
import { AuthenticatedNavigation } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import SuggestChangesModal from './SuggestChangesModal'
import {
    MagnifyingGlassIcon,
    CheckIcon,
    XMarkIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    PaperAirplaneIcon,
    ArrowTopRightOnSquareIcon,
    PencilSquareIcon,
    CalendarIcon,
    DocumentTextIcon,
    MapPinIcon,
    UserIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    HandThumbUpIcon,
    ExclamationCircleIcon,
    BanknotesIcon,
    TagIcon
} from '@heroicons/react/24/outline'
import { CollaborationRequestDetailModal } from '@/components/marketplace/CollaborationRequestDetailModal'
import type { Collaboration, Hotel, Creator } from '@/lib/types'

// Helper for formatting numbers (e.g. 125000 -> 125.0K)
const formatNumber = (num: number | undefined) => {
    if (!num) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}
// Social Media Icons
const InstagramIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)

const YouTubeIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const TikTokIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

// Helper for initials
const getInitials = (name: string) => {
    if (!name) return ''
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

// Types


const SystemMessage = ({ content }: { content: string }) => {
    const isNegotiation = content.toLowerCase().includes('counter-offer') || content.toLowerCase().includes('suggested')
    const isSuccess = content.toLowerCase().includes('completed') || content.toLowerCase().includes('accepted') || content.toLowerCase().includes('agreed')
    const isIncomplete = content.toLowerCase().includes('incomplete')

    // Split content if it has structured data (header: detail1 • detail2)
    let header = content
    let subtext: string[] = []

    if (content.includes(':')) {
        const parts = content.split(':')
        header = parts[0].trim()
        const details = parts.slice(1).join(':').trim()
        if (details) {
            // Split by bullet points if they exist
            subtext = details.split('•').map(s => s.trim()).filter(Boolean)
        }
    }

    let bgColor = 'bg-gray-100/50 text-gray-500 border-gray-200'
    let Icon = ChatBubbleOvalLeftEllipsisIcon
    let iconColor = 'text-gray-400'

    if (isNegotiation) {
        bgColor = 'bg-blue-50/50 text-blue-700 border-blue-100'
        iconColor = 'text-blue-500'
        Icon = ArrowPathIcon
    } else if (isSuccess) {
        bgColor = 'bg-emerald-50/50 text-emerald-700 border-emerald-100'
        iconColor = 'text-emerald-500'
        Icon = CheckCircleIcon
    } else if (isIncomplete) {
        bgColor = 'bg-amber-50/50 text-amber-700 border-amber-100'
        iconColor = 'text-amber-500'
        Icon = ExclamationCircleIcon
    }

    // If it has subtext or is a negotiation, render as a structured box
    if (subtext.length > 0 || isNegotiation) {
        return (
            <div className="flex justify-center my-10 px-4">
                <div className={`w-full max-w-sm rounded-2xl border ${bgColor} p-4 shadow-sm animate-in fade-in zoom-in duration-300`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-9 h-9 rounded-xl ${bgColor.split(' ')[0]} border border-white/50 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <p className="text-[10px] font-black tracking-widest uppercase opacity-60">{header}</p>
                            {subtext.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {subtext.map((s, i) => (
                                        <li key={i} className="text-[13px] font-bold leading-tight flex items-start gap-2 text-gray-900">
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${iconColor.replace('text-', 'bg-')} opacity-40 flex-shrink-0`} />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[13px] font-bold leading-tight text-gray-900">
                                    {content.includes(':') ? content.split(':')[1].trim() : content}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center my-8">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${bgColor} shadow-sm max-w-[80%] animate-in fade-in zoom-in duration-300`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                <span className="text-xs font-bold">{content}</span>
            </div>
        </div>
    )
}

// Components
const PlatformIcon = ({ platform, className }: { platform?: string, className?: string }) => {
    if (platform === 'instagram') return <InstagramIcon className={className} />
    if (platform === 'youtube') return <YouTubeIcon className={className} />
    if (platform === 'tiktok') return <TikTokIcon className={className} />
    return null
}

const PlatformBadge = ({ platform }: { platform: string }) => (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md">
        <PlatformIcon platform={platform} className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-[10px] font-medium text-gray-700 capitalize">{platform}</span>
    </div>
)

function ChatPageContent() {
    const { isCollapsed } = useSidebar()
    const [activeTab, setActiveTab] = useState<'Active' | 'Archived'>('Active')
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [messageInput, setMessageInput] = useState('')
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
    const [detailCollaboration, setDetailCollaboration] = useState<(Collaboration & { hotel?: Hotel; creator?: Creator }) | null>(null)

    // State for pending applications and conversations
    const [userType, setUserType] = useState<string>('hotel')
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [applicationsTab, setApplicationsTab] = useState<'received' | 'sent'>('received')
    const [conversations, setConversations] = useState<any[]>([])
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)

    const [realMessages, setRealMessages] = useState<any[]>([])
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const [activeCollaboration, setActiveCollaboration] = useState<DetailedCollaboration | null>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isEditingSidebar, setIsEditingSidebar] = useState(false)
    const [localCollaboration, setLocalCollaboration] = useState<DetailedCollaboration | null>(null)
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (!isLoadingMessages && !isLoadingMore) {
            scrollToBottom()
        }
    }, [realMessages, isLoadingMessages, isLoadingMore])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserType = localStorage.getItem('userType')
            if (storedUserType) setUserType(storedUserType)
        }
    }, [])

    const fetchData = async () => {
        try {
            // Fetch pending collaborations based on user type
            const requestsData = userType === 'hotel'
                ? await collaborationService.getHotelCollaborations({ status: 'pending' })
                : await collaborationService.getCreatorCollaborations() // Get all collaborations for creators

            // Map API response to UI format
            const formattedRequests = requestsData
                .filter(collab => collab.status === 'pending') // Only show pending collaborations
                .map(collab => {
                    // Check if received: current role is NOT the initiator
                    const isReceived = !collab.is_initiator

                    // Extract unique platforms from deliverables if platforms array is missing
                    const derivedPlatforms = collab.platforms || (collab.platform_deliverables?.map(pd => ({
                        name: pd.platform.toLowerCase()
                    }))) || []

                    // Format offer details for creators viewing hotels
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
                        name: userType === 'hotel' ? collab.creator_name : (collab.hotel_name || 'Hotel'),
                        time: new Date(collab.created_at).toLocaleDateString(),
                        // Creator metrics (for hotels viewing creators)
                        followers: formatNumber(collab.total_followers),
                        followersPlatform: (collab.active_platform || 'instagram').toLowerCase(),
                        engagement: (collab.avg_engagement_rate || 0).toFixed(1) + '%',
                        engagementPlatform: (collab.active_platform || 'instagram').toLowerCase(),
                        platforms: derivedPlatforms,
                        // Hotel info (for creators viewing hotels)
                        location: collab.listing_location || collab.hotel_location || '',
                        collaborationType: collab.collaboration_type || '',
                        offerDetails: offerDetails,
                        avatarColor: 'bg-blue-100 text-blue-600',
                        avatarUrl: userType === 'hotel' ? collab.creator_profile_picture : collab.hotel_picture,
                        initials: getInitials(userType === 'hotel' ? collab.creator_name : (collab.hotel_name || 'Hotel')),
                        isReceived,
                        status: collab.status // Keep the status for filtering
                    }
                })
            setPendingRequests(formattedRequests)

            // Fetch conversations
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

    const fetchMessages = async (silent = false) => {
        if (!selectedChatId) return

        // Reset edit state when switching or refreshing chats
        setIsEditingSidebar(false)
        setLocalCollaboration(null)

        if (!silent) {
            setIsLoadingMessages(true)
            setIsLoadingDetails(true)
        }

        setHasMoreMessages(true)

        // Reset unread count locally for snappy UI
        setConversations(prev => prev.map(conv =>
            conv.collaboration_id === selectedChatId
                ? { ...conv, unread_count: 0 }
                : conv
        ))

        try {
            // Fetch messages
            const msgData = await collaborationService.getMessages(selectedChatId)
            const reversed = [...msgData].reverse()
            setRealMessages(reversed)
            if (msgData.length < 50) {
                setHasMoreMessages(false)
            }

            // Mark as read in backend
            collaborationService.markAsRead(selectedChatId).catch(err =>
                console.error('Failed to mark as read:', err)
            )

            // Fetch collaboration details for the right panel
            const detailResponse = userType === 'hotel'
                ? await collaborationService.getHotelCollaborationDetails(selectedChatId)
                : await collaborationService.getCreatorCollaborationDetails(selectedChatId)

            const detailedCollaboration = transformCollaborationResponse(detailResponse)
            setActiveCollaboration(detailedCollaboration)
        } catch (error) {
            console.error('Failed to fetch chat details:', error)
        } finally {
            if (!silent) {
                setIsLoadingMessages(false)
                setIsLoadingDetails(false)
            }
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
            // The oldest message is at index 0 of our reversed array
            const oldestMessage = realMessages[0]
            const data = await collaborationService.getMessages(selectedChatId, oldestMessage.created_at)

            if (data.length === 0) {
                setHasMoreMessages(false)
            } else {
                const reversed = [...data].reverse()
                setRealMessages(prev => [...reversed, ...prev])
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
            const detailResponse = userType === 'creator'
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
            // Refresh list
            setPendingRequests(prev => prev.filter(r => r.id !== id))
            setDetailCollaboration(null)
            // Refresh conversations to show the newly accepted one
            const convData = await collaborationService.getConversations()
            setConversations(convData)
        } catch (error) {
            console.error('Error accepting collaboration:', error)
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await collaborationService.respondToCollaboration(id, { status: 'declined' })
            // Refresh list
            setPendingRequests(prev => prev.filter(r => r.id !== id))
            setDetailCollaboration(null)
            // Refresh conversations? Declined usually cancels it, so we might want to refresh too
            const convData = await collaborationService.getConversations()
            setConversations(convData)
        } catch (error) {
            console.error('Error declining collaboration:', error)
        }
    }

    const activeChat = selectedChatId ? conversations.find(c => c.collaboration_id === selectedChatId) : null

    const flatDeliverables = activeCollaboration?.platformDeliverables?.flatMap((pd: PlatformDeliverablesItem) =>
        pd.deliverables.map((d: PlatformDeliverable) => {
            const platformName = pd.platform.toLowerCase()
            const typeLower = d.type.toLowerCase()
            const displayType = typeLower.includes(platformName) ? d.type : `${pd.platform} ${d.type}`

            return {
                id: d.id,
                type: displayType,
                count: d.quantity,
                completed: d.completed
            }
        })
    ) || []

    const stayDetails = {
        checkIn: activeCollaboration?.travelDateFrom || activeCollaboration?.preferredDateFrom || 'TBD',
        checkOut: activeCollaboration?.travelDateTo || activeCollaboration?.preferredDateTo || 'TBD'
    }

    // Format relative time for messages
    const formatTime = (dateStr: string | null) => {
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

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()
        if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
        if (s === 'negotiating') return 'bg-blue-100 text-blue-700'
        if (s === 'accepted') return 'bg-emerald-100 text-emerald-700'
        if (s === 'staying') return 'bg-purple-100 text-purple-700'
        if (s === 'completed') return 'bg-green-100 text-green-700'
        if (s === 'declined' || s === 'cancelled') return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-600'
    }

    // Calculate progress
    const totalDeliverables = flatDeliverables.length
    const completedCount = flatDeliverables.filter(d => d.completed).length
    const progressPercentage = totalDeliverables > 0 ? (completedCount / totalDeliverables) * 100 : 0

    const toggleDeliverable = async (deliverableId: string) => {
        if (!selectedChatId) return

        try {
            const updatedResponse = await collaborationService.toggleDeliverable(selectedChatId, deliverableId)
            const detailedCollaboration = transformCollaborationResponse(updatedResponse)
            setActiveCollaboration(detailedCollaboration)
            // Refresh messages silently to show the system notification without flickering
            fetchMessages(true)
        } catch (error) {
            console.error('Failed to toggle deliverable:', error)
        }
    }

    const handleSuggestChanges = async (data: any) => {
        if (!selectedChatId) return

        try {
            const updatedResponse = await collaborationService.updateTerms(selectedChatId, data)
            const detailedCollaboration = transformCollaborationResponse(updatedResponse)
            setActiveCollaboration(detailedCollaboration)
            setIsSuggestModalOpen(false)
            // Refresh messages silently to show the system notification without flickering
            fetchMessages(true)
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
            // Refresh messages silently to show the system notification without flickering
            fetchMessages(true)
        } catch (error) {
            console.error('Failed to approve terms:', error)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim() || !selectedChatId) return

        const content = messageInput.trim()
        setMessageInput('')

        try {
            // Optimistically add the message to the UI
            // Note: Since we don't have the ID yet, we'll use a temporary one
            const tempMessage = {
                id: `temp-${Date.now()}`,
                collaboration_id: selectedChatId,
                sender_id: 'me', // Will be resolved by the logic in rendering
                sender_name: 'Me',
                sender_avatar: null,
                content: content,
                content_type: 'text',
                metadata: null,
                created_at: new Date().toISOString()
            }

            setRealMessages(prev => [...prev, tempMessage])

            // Update conversations list to move this chat to top and update last message
            setConversations(prev => {
                const chatIndex = prev.findIndex(c => c.collaboration_id === selectedChatId)
                if (chatIndex === -1) return prev

                const updatedChat = {
                    ...prev[chatIndex],
                    last_message_content: content,
                    last_message_at: tempMessage.created_at,
                    unread_count: 0
                }

                const filtered = prev.filter(c => c.collaboration_id !== selectedChatId)
                return [updatedChat, ...filtered]
            })

            await collaborationService.sendMessage(selectedChatId, content)

            // Optionally, we could re-fetch or replace the temp message with the real one, 
            // but for now, this provides a snappy UI.
        } catch (error) {
            console.error('Failed to send message:', error)
            // Rollback on error?
            setRealMessages(prev => prev.filter(m => !m.id.toString().startsWith('temp-')))
            setMessageInput(content) // Restore input
        }
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <AuthenticatedNavigation />

            {/* Main Container - Fixed positioning to guarantee viewport height adherence */}
            <div
                className={`fixed top-16 bottom-0 left-0 right-0 flex transition-all duration-300 ${isCollapsed ? 'md:pl-16' : 'md:pl-56'} z-0`}
            >
                {/* COLUMN 1: LEFT SIDEBAR */}
                <div className="w-80 md:w-96 border-r border-gray-200 flex flex-col h-full bg-white flex-shrink-0">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* New Applications */}
                        <div className="border-b-4 border-gray-50">
                            <div className="px-4 py-3 flex items-center justify-between bg-gray-50/50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">New Applications</span>
                                </div>
                                <span className="bg-blue-600/10 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-600/20">{pendingRequests.length} total</span>
                            </div>

                            {/* Sub-tabs for Received/Sent */}
                            <div className="px-3 py-2 bg-white border-b border-gray-100 flex gap-2">
                                <button
                                    onClick={() => setApplicationsTab('received')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${applicationsTab === 'received'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Received
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${applicationsTab === 'received' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                        {pendingRequests.filter(r => r.isReceived).length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setApplicationsTab('sent')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${applicationsTab === 'sent'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    Sent
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${applicationsTab === 'sent' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                        {pendingRequests.filter(r => !r.isReceived).length}
                                    </span>
                                </button>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {pendingRequests.filter(r => applicationsTab === 'received' ? r.isReceived : !r.isReceived).length > 0 ? (
                                    pendingRequests
                                        .filter(r => applicationsTab === 'received' ? r.isReceived : !r.isReceived)
                                        .map((request) => (
                                            <div
                                                key={request.id}
                                                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                                                onClick={() => handleViewDetails(request.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {request.avatarUrl ? (
                                                        <img
                                                            src={request.avatarUrl}
                                                            alt={request.name}
                                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${request.avatarColor}`}>
                                                            {request.initials}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline gap-2 mb-0.5">
                                                            <h4 className="text-sm font-semibold text-gray-900 leading-none">{request.name}</h4>
                                                            <span className="text-[10px] text-gray-400">{request.time}</span>
                                                        </div>
                                                        {userType === 'hotel' ? (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                                                                <span>{request.followers}</span><span>•</span><span>{request.engagement}</span>
                                                                <div className="flex items-center gap-1">
                                                                    {request.platforms && request.platforms.length > 0 ? (
                                                                        request.platforms.map((p: any) => (
                                                                            <PlatformIcon
                                                                                key={p.name}
                                                                                platform={(p.name || p.platform || '').toLowerCase()}
                                                                                className="w-3 h-3 text-gray-400"
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <PlatformIcon platform={request.followersPlatform} className="w-3 h-3 text-gray-400" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                                                                {request.location && (
                                                                    <>
                                                                        <MapPinIcon className="w-3 h-3 text-gray-400" />
                                                                        <span className="truncate max-w-[120px]">{request.location}</span>
                                                                    </>
                                                                )}
                                                                {request.collaborationType && request.offerDetails && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="font-semibold text-blue-600">{request.offerDetails}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {request.isReceived ? (
                                                            <>
                                                                <button
                                                                    className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                                                                    title="Accept"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleAccept(request.id)
                                                                    }}
                                                                >
                                                                    <CheckIcon className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-colors shadow-sm"
                                                                    title="Decline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleDecline(request.id)
                                                                    }}
                                                                >
                                                                    <XMarkIcon className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 italic whitespace-nowrap">
                                                                    Waiting for {userType === 'hotel' ? 'Creator' : 'Hotel'} response
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="p-8 text-center bg-white">
                                        <p className="text-xs font-medium text-gray-400 italic">
                                            No {applicationsTab} applications found
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center border-b border-gray-200 sticky top-0 bg-white z-10">
                            <button onClick={() => setActiveTab('Active')} className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Active' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>Active{activeTab === 'Active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}</button>
                            <button onClick={() => setActiveTab('Archived')} className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Archived' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>Archived{activeTab === 'Archived' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}</button>
                        </div>

                        {/* Chats List */}
                        <div className="divide-y divide-gray-50">
                            {activeTab === 'Active' && (
                                isLoadingConversations ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                                    </div>
                                ) : conversations.length > 0 ? (
                                    conversations.map((chat) => (
                                        <div
                                            key={chat.collaboration_id}
                                            onClick={() => setSelectedChatId(chat.collaboration_id)}
                                            className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors relative ${selectedChatId === chat.collaboration_id ? 'bg-blue-50/80 border-r-2 border-blue-600' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    {chat.partner_avatar ? (
                                                        <img src={chat.partner_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                                            {getInitials(chat.partner_name)}
                                                        </div>
                                                    )}
                                                    {chat.unread_count > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{chat.unread_count}</div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{chat.partner_name}</h4>
                                                        <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(chat.last_message_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${getStatusColor(chat.collaboration_status)}`}>
                                                            {chat.collaboration_status}
                                                        </span>
                                                        {chat.my_role && (
                                                            <span className="text-[10px] text-gray-400 capitalize">{chat.my_role}</span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm truncate ${chat.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                                        {chat.last_message_content || 'No messages yet'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-sm text-gray-500">
                                        No active conversations.
                                    </div>
                                )
                            )}

                            {activeTab === 'Archived' && (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No archived conversations.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MIDDLE & RIGHT COLUMNS */}
                {selectedChatId && activeChat && activeCollaboration ? (
                    <>
                        {/* COLUMN 2: CHAT AREA (Flexible Width) */}
                        <div className="flex-1 flex flex-col h-full bg-white relative border-r border-gray-200">
                            {/* Chat Header */}
                            <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 bg-white flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    {activeChat.partner_avatar ? (
                                        <img src={activeChat.partner_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                            {getInitials(activeChat.partner_name)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{activeChat.partner_name}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-gray-600 capitalize">{activeChat.collaboration_status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDetailCollaboration(activeCollaboration)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Details <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {hasMoreMessages && (
                                            <div className="flex justify-center pb-4">
                                                <button
                                                    onClick={handleLoadMore}
                                                    disabled={isLoadingMore}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 transition-all disabled:opacity-50"
                                                >
                                                    {isLoadingMore ? 'Loading older messages...' : 'Load older messages'}
                                                </button>
                                            </div>
                                        )}

                                        {realMessages.length > 0 ? (
                                            realMessages.map((msg, idx) => {
                                                const isSystem = msg.sender_id === null || msg.content_type === 'system'
                                                const isThem = !isSystem && msg.sender_name === activeChat.partner_name
                                                const isMe = !isSystem && !isThem

                                                // Simple date grouping
                                                const showDate = idx === 0 || new Date(realMessages[idx - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString()
                                                const dateStr = new Date(msg.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
                                                const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                                if (isSystem) {
                                                    return (
                                                        <SystemMessage key={msg.id} content={msg.content} />
                                                    )
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
                                                                        msg.sender_avatar ? (
                                                                            <img src={msg.sender_avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                                                        ) : (
                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                                                                {getInitials(msg.sender_name || activeChat.partner_name)}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                    <div>
                                                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'}`}>
                                                                            {msg.content_type === 'image' ? (
                                                                                <img src={msg.content} alt="Attachment" className="max-w-full rounded-lg" />
                                                                            ) : (
                                                                                msg.content
                                                                            )}
                                                                        </div>
                                                                        <div className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
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
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <div className="flex gap-2 text-gray-400">
                                        <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><PaperClipIcon className="w-5 h-5" /></button>
                                        <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><PhotoIcon className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"><FaceSmileIcon className="w-5 h-5" /></button>
                                    </div>
                                    <button type="submit" disabled={!messageInput.trim()} className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm"><PaperAirplaneIcon className="w-5 h-5" /></button>
                                </form>
                            </div>
                        </div>

                        {/* COLUMN 3: DETAILS PANEL (Fixed Width) */}
                        <div className="w-[350px] flex flex-col h-full bg-white flex-shrink-0 border-l border-gray-100">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-6 space-y-8">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Collaboration Details</h3>
                                        <div className="flex items-center gap-2">
                                            {isEditingSidebar ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingSidebar(false)
                                                            setLocalCollaboration(null)
                                                        }}
                                                        className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (localCollaboration) setActiveCollaboration(localCollaboration)
                                                            setIsEditingSidebar(false)
                                                            setLocalCollaboration(null)
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setLocalCollaboration(activeCollaboration)
                                                        setIsEditingSidebar(true)
                                                    }}
                                                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase transition-all"
                                                >
                                                    <PencilSquareIcon className="w-3 h-3" /> Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        {activeChat.partner_avatar ? (
                                            <img src={activeChat.partner_avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
                                                {getInitials(activeChat.partner_name)}
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="font-bold text-gray-900">{activeChat.partner_name}</h2>
                                        </div>
                                        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(activeChat.collaboration_status)}`}>
                                            {activeChat.collaboration_status}
                                        </span>
                                    </div>

                                    {/* Partner Stats - Show Hotel stats for creators, Creator stats for hotels */}
                                    {userType === 'creator' ? (
                                        // Show Hotel Stats when creator is signed in
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                <h4 className="text-xs font-bold text-gray-900 uppercase">Hotel Details</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {activeCollaboration.hotel?.name && (
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase">Property</div>
                                                        <div className="text-sm font-bold text-gray-900">{activeCollaboration.hotel.name}</div>
                                                    </div>
                                                )}
                                                {activeCollaboration.listingLocation && (
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase">Location</div>
                                                        <div className="text-sm font-medium text-gray-900">{activeCollaboration.listingLocation}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // Show Creator Stats when hotel is signed in
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <UserIcon className="w-4 h-4 text-gray-400" />
                                                <h4 className="text-xs font-bold text-gray-900 uppercase">Creator Stats</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Followers</div>
                                                    <div className="text-sm font-bold text-gray-900">{formatNumber(activeCollaboration.creator?.audienceSize)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Engagement</div>
                                                    <div className="text-sm font-bold text-gray-900">{(activeCollaboration.creator?.avgEngagementRate || 0).toFixed(1)}%</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {activeCollaboration.creator?.platforms?.map(p => (
                                                    <PlatformBadge key={p.name} platform={(p.name || 'platform').toLowerCase()} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Collaboration Terms */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <BanknotesIcon className="w-4 h-4 text-gray-400" />
                                            <h4 className="text-xs font-bold text-gray-900 uppercase">Collaboration Terms</h4>
                                        </div>
                                        {isEditingSidebar ? (
                                            <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Type</label>
                                                    <select
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                        value={localCollaboration?.collaborationType || ''}
                                                        onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, collaborationType: e.target.value as any } : null)}
                                                    >
                                                        <option value="Free Stay">Free Stay</option>
                                                        <option value="Paid">Paid</option>
                                                        <option value="Discount">Discount</option>
                                                    </select>
                                                </div>
                                                {localCollaboration?.collaborationType === 'Free Stay' && (
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Max Nights</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium"
                                                            value={localCollaboration?.freeStayMaxNights || ''}
                                                            onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, freeStayMaxNights: parseInt(e.target.value) } : null)}
                                                        />
                                                    </div>
                                                )}
                                                {localCollaboration?.collaborationType === 'Paid' && (
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Amount ($)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium"
                                                            value={localCollaboration?.paidAmount || ''}
                                                            onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, paidAmount: parseInt(e.target.value) } : null)}
                                                        />
                                                    </div>
                                                )}
                                                {localCollaboration?.collaborationType === 'Discount' && (
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Discount (%)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium"
                                                            value={localCollaboration?.discountPercentage || ''}
                                                            onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, discountPercentage: parseInt(e.target.value) } : null)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase mb-1">Type</div>
                                                    <div className="text-sm font-bold text-gray-900">{activeCollaboration.collaborationType || 'TBD'}</div>
                                                </div>
                                                <div>
                                                    {activeCollaboration.collaborationType === 'Free Stay' && (
                                                        <>
                                                            <div className="text-[10px] text-gray-500 uppercase mb-1">Max Nights</div>
                                                            <div className="text-sm font-bold text-gray-900">{activeCollaboration.freeStayMaxNights || 0}</div>
                                                        </>
                                                    )}
                                                    {activeCollaboration.collaborationType === 'Paid' && (
                                                        <>
                                                            <div className="text-[10px] text-gray-500 uppercase mb-1">Amount</div>
                                                            <div className="text-sm font-bold text-gray-900">${activeCollaboration.paidAmount || 0}</div>
                                                        </>
                                                    )}
                                                    {activeCollaboration.collaborationType === 'Discount' && (
                                                        <>
                                                            <div className="text-[10px] text-gray-500 uppercase mb-1">Discount</div>
                                                            <div className="text-sm font-bold text-gray-900">{activeCollaboration.discountPercentage || 0}%</div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stay Details */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <h4 className="text-xs font-bold text-gray-900 uppercase">Stay Details</h4>
                                        </div>
                                        {isEditingSidebar ? (
                                            <div className="grid grid-cols-1 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Check-in</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium"
                                                        value={localCollaboration?.travelDateFrom || localCollaboration?.preferredDateFrom || ''}
                                                        onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, travelDateFrom: e.target.value } : null)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Check-out</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium"
                                                        value={localCollaboration?.travelDateTo || localCollaboration?.preferredDateTo || ''}
                                                        onChange={(e) => setLocalCollaboration(prev => prev ? { ...prev, travelDateTo: e.target.value } : null)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Check-in</div>
                                                    <div className="text-sm font-bold text-gray-900">{stayDetails.checkIn}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Check-out</div>
                                                    <div className="text-sm font-bold text-gray-900">{stayDetails.checkOut}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Deliverables */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                                                <h4 className="text-xs font-bold text-gray-900 uppercase">Deliverables</h4>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{completedCount}/{flatDeliverables.length}</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${flatDeliverables.length > 0 ? (completedCount / flatDeliverables.length) * 100 : 0}%` }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            {flatDeliverables.map(d => {
                                                const isCompleted = d.completed
                                                return (
                                                    <div
                                                        key={d.id}
                                                        onClick={() => toggleDeliverable(d.id)}
                                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group ${isCompleted
                                                            ? 'bg-blue-50/30 border-blue-100'
                                                            : 'bg-white border-gray-100 hover:border-blue-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted
                                                                ? 'bg-blue-600 text-white'
                                                                : 'border-2 border-blue-600 bg-white'
                                                                }`}>
                                                                {isCompleted && <CheckIcon className="w-3.5 h-3.5" />}
                                                            </div>
                                                            <span className={`text-sm select-none ${isCompleted
                                                                ? 'text-gray-400 line-through decoration-gray-400'
                                                                : 'text-gray-700 font-medium'
                                                                }`}>
                                                                {d.type}
                                                            </span>
                                                        </div>
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded border transition-colors ${isCompleted
                                                            ? 'bg-gray-100 text-gray-400 border-transparent'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 group-hover:border-blue-100'
                                                            }`}>
                                                            × {d.count}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Footer: Actions */}
                            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 space-y-2">
                                {['pending', 'negotiating'].includes(activeChat.collaboration_status.toLowerCase()) ? (
                                    <>
                                        {((activeChat.my_role === 'hotel' && !activeCollaboration.hotelAgreedAt) ||
                                            (activeChat.my_role === 'creator' && !activeCollaboration.creatorAgreedAt)) ? (
                                            <button
                                                onClick={() => handleApproveTerms()}
                                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" /> Approve Terms
                                            </button>
                                        ) : (
                                            <div className="w-full py-2.5 bg-gray-50 text-gray-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2 border border-gray-100">
                                                <ArrowPathIcon className="w-4 h-4 animate-spin-slow" /> Waiting for {activeChat.partner_name}...
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsSuggestModalOpen(true)}
                                            className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" /> Suggest Changes
                                        </button>
                                    </>
                                ) : activeChat.collaboration_status.toLowerCase() === 'accepted' ? (
                                    <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg flex items-center justify-center gap-2 border border-emerald-100">
                                        <CheckCircleIcon className="w-4 h-4" /> Collaboration Accepted
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDetailCollaboration(activeCollaboration)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <DocumentTextIcon className="w-4 h-4" /> View Full Terms
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // Empty State (Full Width of remaining space)
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h2>
                        <p className="text-sm text-gray-500 max-w-sm mb-6">
                            Select a conversation from the list to start chatting, or check your pending requests to begin new collaborations.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                            View Pending Requests
                        </button>
                    </div>
                )}
            </div>

            {/* Modals outside main container but inside component */}
            {activeChat && activeCollaboration && (
                <SuggestChangesModal
                    isOpen={isSuggestModalOpen}
                    onClose={() => setIsSuggestModalOpen(false)}
                    initialCheckIn={activeCollaboration.travelDateFrom || activeCollaboration.preferredDateFrom || ''}
                    initialCheckOut={activeCollaboration.travelDateTo || activeCollaboration.preferredDateTo || ''}
                    initialPlatformDeliverables={activeCollaboration.platformDeliverables || []}
                    initialCollaborationType={activeCollaboration.collaborationType}
                    initialFreeStayMaxNights={activeCollaboration.freeStayMaxNights}
                    initialPaidAmount={activeCollaboration.paidAmount}
                    initialDiscountPercentage={activeCollaboration.discountPercentage}
                    onSubmit={handleSuggestChanges}
                />
            )}

            <CollaborationRequestDetailModal
                isOpen={!!detailCollaboration}
                onClose={() => setDetailCollaboration(null)}
                collaboration={detailCollaboration}
                currentUserType={userType as 'hotel' | 'creator'}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onApprove={handleApproveTerms}
            />
        </main>
    )
}

export default function ChatPage() {
    return <ChatPageContent />
}
