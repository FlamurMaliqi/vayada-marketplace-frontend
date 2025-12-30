'use client'

import React, { useState, useEffect } from 'react'
import { collaborationService } from '@/services/api/collaborations'
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
    CheckCircleIcon
} from '@heroicons/react/24/outline'

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

const ACTIVE_CHATS = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        handle: '@sarahtravels',
        status: 'Staying',
        statusColor: 'bg-blue-100 text-blue-700',
        time: '2 minutes',
        message: 'That sounds great! I\'ll have the content rea...',
        unread: 2,
        avatarColor: 'bg-red-100 text-red-600',
        initials: 'SM'
    },
    {
        id: 2,
        name: 'Marcus Chen',
        handle: '@marcusexplores',
        status: 'Negotiating',
        statusColor: 'bg-gray-100 text-gray-700',
        time: 'about 1 hour',
        message: 'Can we discuss the deliverables for the col...',
        unread: 0,
        avatarColor: 'bg-green-100 text-green-600',
        initials: 'MC'
    }
]

// Mock Messages for Chat Interface
const MOCK_MESSAGES: Record<number, { id: number, sender: 'me' | 'them', content: string, time: string, date?: string }[]> = {
    1: [
        { id: 1, sender: 'them', content: "Hi! I'm excited about the collaboration opportunity at your property.", time: '03:21', date: 'December 29, 2025' },
        { id: 2, sender: 'me', content: "Welcome Sarah! We'd love to have you. Let's discuss the details of your stay and content expectations.", time: '03:27' },
        { id: 3, sender: 'them', content: "Perfect! I was thinking 3 Instagram Reels and 10 high-quality photos showcasing the amenities and views.", time: '03:34' },
        { id: 4, sender: 'me', content: "That sounds great! I'll have the content ready by Friday.", time: '04:21' }
    ],
    2: [
        { id: 1, sender: 'them', content: "Can we discuss the deliverables for the collaboration?", time: '09:00', date: 'Yesterday' },
        { id: 2, sender: 'me', content: "Of course! What did you have in mind?", time: '09:15' }
    ]
}

const COLLABORATION_DETAILS = {
    1: {
        creator: {
            followers: '125.0K',
            engagement: '4.8%',
            platforms: ['instagram', 'youtube']
        },
        stay: {
            checkIn: 'Jan 15, 2025',
            checkOut: 'Jan 22, 2025'
        },
        deliverables: [
            { id: 1, type: 'Instagram Reels', count: 3 },
            { id: 2, type: 'High-Quality Photos', count: 10 },
            { id: 3, type: 'Story Mentions', count: 5 }
        ]
    }
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
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [completedDeliverables, setCompletedDeliverables] = useState<number[]>([1]) // Mock initial state
    const [messageInput, setMessageInput] = useState('')
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)

    // State for pending applications
    const [pendingRequests, setPendingRequests] = useState<any[]>([])

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                // Fetch pending collaborations initiated by creators
                const data = await collaborationService.getHotelCollaborations({
                    status: 'pending'
                })

                // Map API response to UI format
                const formattedRequests = data.map(collab => ({
                    id: collab.id,
                    name: collab.creator_name,
                    // Calculate relative time (simple approximation)
                    time: new Date(collab.created_at).toLocaleDateString(),
                    followers: formatNumber(collab.total_followers),
                    followersPlatform: (collab.active_platform || 'instagram').toLowerCase(),
                    engagement: (collab.avg_engagement_rate || 0).toFixed(1) + '%',
                    engagementPlatform: (collab.active_platform || 'instagram').toLowerCase(), // Fallback to active platform
                    avatarColor: 'bg-blue-100 text-blue-600', // Default color
                    initials: collab.creator_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                }))

                setPendingRequests(formattedRequests)
            } catch (error) {
                console.error('Failed to fetch pending requests:', error)
            }
        }

        fetchPendingRequests()
    }, [])

    const activeChat = selectedChatId ? ACTIVE_CHATS.find(c => c.id === selectedChatId) : null
    const messages = selectedChatId ? MOCK_MESSAGES[selectedChatId] : []
    const details = selectedChatId ? COLLABORATION_DETAILS[1] : null // Mock details for all

    // Calculate progress
    const totalDeliverables = details?.deliverables.length || 0
    const completedCount = completedDeliverables.length
    const progressPercentage = totalDeliverables > 0 ? (completedCount / totalDeliverables) * 100 : 0

    const toggleDeliverable = (id: number) => {
        setCompletedDeliverables(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        )
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim()) return
        // In a real app, you would add the message to the state here
        setMessageInput('')
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
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingRequests.length} pending</span>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${request.avatarColor}`}>{request.initials}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <h4 className="text-sm font-semibold text-gray-900 leading-none">{request.name}</h4>
                                                    <span className="text-[10px] text-gray-400">{request.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                                                    <span>{request.followers}</span><span>•</span><span>{request.engagement}</span>
                                                    <div className="flex items-center gap-1">
                                                        <PlatformIcon platform={request.followersPlatform} className="w-3 h-3 text-gray-400" />
                                                        <PlatformIcon platform={request.engagementPlatform} className="w-3 h-3 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm" title="Accept"><CheckIcon className="w-5 h-5" /></button>
                                                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-colors shadow-sm" title="Decline"><XMarkIcon className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center border-b border-gray-200 sticky top-0 bg-white z-10">
                            <button onClick={() => setActiveTab('Active')} className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Active' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>Active{activeTab === 'Active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}</button>
                            <button onClick={() => setActiveTab('Archived')} className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Archived' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>Archived{activeTab === 'Archived' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}</button>
                        </div>

                        {/* Chats List */}
                        <div className="divide-y divide-gray-50">
                            {activeTab === 'Active' && ACTIVE_CHATS.map((chat) => (
                                <div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors relative ${selectedChatId === chat.id ? 'bg-blue-50/80 border-r-2 border-blue-600' : ''}`}>
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${chat.avatarColor}`}>{chat.initials}</div>
                                            {chat.unread > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{chat.unread}</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h4>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">{chat.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-500 truncate">{chat.handle}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${chat.statusColor}`}>{chat.status}</span>
                                            </div>
                                            <p className={`text-sm truncate ${chat.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>{chat.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'Archived' && (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No archived conversations.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MIDDLE & RIGHT COLUMNS */}
                {selectedChatId && activeChat && details ? (
                    <>
                        {/* COLUMN 2: CHAT AREA (Flexible Width) */}
                        <div className="flex-1 flex flex-col h-full bg-white relative border-r border-gray-200">
                            {/* Chat Header */}
                            <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 bg-white flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${activeChat.avatarColor}`}>{activeChat.initials}</div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                                            <span className="text-xs text-gray-500 font-medium">{activeChat.handle}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-gray-600">{activeChat.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    Details <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                                {messages.map((msg, idx) => (
                                    <React.Fragment key={msg.id}>
                                        {msg.date && <div className="flex justify-center my-6"><span className="bg-gray-100/80 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">{msg.date}</span></div>}
                                        <div className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-[70%]">
                                                <div className="flex items-end gap-2">
                                                    {msg.sender === 'them' && <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${activeChat.avatarColor}`}>{activeChat.initials}</div>}
                                                    <div>
                                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'}`}>{msg.content}</div>
                                                        <div className={`text-[10px] text-gray-400 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>{msg.time} {msg.sender === 'me' && '✓'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Fixed Footer: Message Input */}
                            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <div className="flex gap-2 text-gray-400">
                                        <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><PaperClipIcon className="w-5 h-5" /></button>
                                        <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors"><PhotoIcon className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
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
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Collaboration Details</h3>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${activeChat.avatarColor}`}>{activeChat.initials}</div>
                                            <div>
                                                <h2 className="font-bold text-gray-900">{activeChat.name}</h2>
                                                <a href="#" className="text-xs text-blue-600 hover:underline">{activeChat.handle}</a>
                                            </div>
                                            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${activeChat.statusColor}`}>{activeChat.status}</span>
                                        </div>
                                    </div>

                                    {/* Creator Stats */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            <h4 className="text-xs font-bold text-gray-900 uppercase">Creator Stats</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase">Followers</div>
                                                <div className="text-sm font-bold text-gray-900">{details.creator.followers}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase">Engagement</div>
                                                <div className="text-sm font-bold text-gray-900">{details.creator.engagement}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {details.creator.platforms.map(p => <PlatformBadge key={p} platform={p} />)}
                                        </div>
                                    </div>

                                    {/* Stay Details */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <h4 className="text-xs font-bold text-gray-900 uppercase">Stay Details</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase">Check-in</div>
                                                <div className="text-sm font-bold text-gray-900">{details.stay.checkIn}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase">Check-out</div>
                                                <div className="text-sm font-bold text-gray-900">{details.stay.checkOut}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deliverables */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                                                <h4 className="text-xs font-bold text-gray-900 uppercase">Deliverables</h4>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{completedCount}/{totalDeliverables}</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            {details.deliverables.map(d => {
                                                const isCompleted = completedDeliverables.includes(d.id)
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
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <CheckIcon className="w-4 h-4" /> Confirm Collaboration
                                </button>
                                <button
                                    onClick={() => setIsSuggestModalOpen(true)}
                                    className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <PencilSquareIcon className="w-4 h-4" /> Suggest Changes
                                </button>
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

            {/* Suggest Changes Modal */}
            {activeChat && details && (
                <SuggestChangesModal
                    isOpen={isSuggestModalOpen}
                    onClose={() => setIsSuggestModalOpen(false)}
                    initialCheckIn={details.stay.checkIn}
                    initialCheckOut={details.stay.checkOut}
                    initialDeliverables={details.deliverables}
                    onSubmit={(data: any) => {
                        console.log('Counter-offer:', data)
                        // Here you would typically send the data to the backend
                        setIsSuggestModalOpen(false)
                    }}
                />
            )}
        </main>
    )
}

export default function ChatPage() {
    return <ChatPageContent />
}
