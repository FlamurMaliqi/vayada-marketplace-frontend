'use client'

import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { CollaborationResponse } from '@/services/api/collaborations'
import { useRouter } from 'next/navigation'

interface CalendarEventModalProps {
    isOpen: boolean
    onClose: () => void
    collaboration: CollaborationResponse | null
    onViewDetails: (id: string) => void
    userType?: 'hotel' | 'creator'
}

export function CalendarEventModal({ isOpen, onClose, collaboration, onViewDetails, userType = 'hotel' }: CalendarEventModalProps) {
    const router = useRouter()
    if (!isOpen || !collaboration) return null

    // Format dates
    const startDateStr = collaboration.travel_date_from || collaboration.preferred_date_from
    const endDateStr = collaboration.travel_date_to || collaboration.preferred_date_to

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'TBD'
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const dateRange = `${formatDate(startDateStr)} – ${formatDate(endDateStr)}`

    // Format numbers
    const formatNumber = (num?: number) => {
        if (!num) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
        return num.toString()
    }

    const handleContact = () => {
        if (collaboration.id) {
            router.push(`/chat?collaborationId=${collaboration.id}`)
            onClose()
        }
    }

    return (
        <div className="relative z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-10 overflow-y-auto pointer-events-none">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                            <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="p-6">
                            {userType === 'creator' ? (
                                <>
                                    {/* Mockup Header Style */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 text-gray-700">
                                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                                <path d="M10 6h4" />
                                                <path d="M10 10h4" />
                                                <path d="M10 14h4" />
                                                <path d="M10 18h4" />
                                            </svg>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {collaboration.listing_name || 'Collaboration Details'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-full bg-[#EBF0FF] px-3 py-1 text-sm font-semibold text-[#4F7DFF]">
                                                Collaboration
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-semibold text-[#374151] capitalize">
                                                {collaboration.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Card */}
                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between mb-8 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            {collaboration.hotel_picture ? (
                                                <img
                                                    src={collaboration.hotel_picture}
                                                    alt={collaboration.hotel_name}
                                                    className="w-16 h-16 rounded-full object-cover border border-gray-50"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-300">
                                                    {collaboration.hotel_name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 leading-tight">{collaboration.hotel_name}</h4>
                                                <div className="flex items-center gap-1 mt-1 text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
                                                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium">{collaboration.listing_location || 'Unknown Location'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                onViewDetails(collaboration.id)
                                                onClose()
                                            }}
                                        >
                                            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500" />
                                            <span>View</span>
                                        </button>
                                    </div>

                                    {/* Style-match Sections */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-base font-bold text-gray-900">Offer Details</p>
                                            <p className="text-gray-600">
                                                {collaboration.collaboration_type || 'Custom'} • {collaboration.collaboration_type === 'Paid' ? `$${collaboration.paid_amount}` :
                                                    collaboration.collaboration_type === 'Discount' ? `${collaboration.discount_percentage}% Off` :
                                                        collaboration.collaboration_type === 'Free Stay' ? `${collaboration.free_stay_max_nights} Nights` : 'Barter'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <p className="text-base font-bold text-gray-900">Period</p>
                                            <p className="text-gray-600">{dateRange}</p>
                                        </div>

                                        {collaboration.platform_deliverables && collaboration.platform_deliverables.length > 0 && (
                                            <div className="flex flex-col gap-3">
                                                <p className="text-base font-bold text-gray-900">Deliverables</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {collaboration.platform_deliverables.flatMap(pd =>
                                                        pd.deliverables.map((d, idx) => (
                                                            <span key={`${pd.platform}-${d.type}-${idx}`} className="inline-flex items-center rounded-full bg-[#F3F4F6] px-4 py-1.5 text-sm font-semibold text-[#374151]">
                                                                {d.quantity} {d.type}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between gap-3 mb-6">
                                        <h3 className="text-xl font-serif font-bold text-gray-900">
                                            Collaboration Details
                                        </h3>
                                    </div>

                                    {/* Header: Partner Info */}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            {collaboration.creator_profile_picture ? (
                                                <img
                                                    src={collaboration.creator_profile_picture}
                                                    alt={collaboration.creator_name}
                                                    className="w-16 h-16 rounded-full object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                                                    {collaboration.creator_name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{collaboration.creator_name}</h4>
                                                <p className="text-sm text-gray-500">@{collaboration.handle || collaboration.creator_name.toLowerCase().replace(/\s+/g, '')}</p>
                                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
                                                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                    </svg>
                                                    {collaboration.creator_location || 'Unknown Location'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 capitalize border border-gray-200">
                                            {collaboration.status}
                                        </span>
                                    </div>

                                    {/* Metrics Grid (Hotel View) */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Reach</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-500">
                                                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                                                </svg>
                                                <span className="text-lg font-bold text-gray-900">{formatNumber(collaboration.total_followers)}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Platforms</p>
                                            <div className="flex flex-wrap gap-2">
                                                {collaboration.platforms && collaboration.platforms.length > 0 ? (
                                                    collaboration.platforms.map(p => (
                                                        <span key={p.name} className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                                                            {p.name}
                                                        </span>
                                                    ))
                                                ) : collaboration.active_platform ? (
                                                    <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                                                        {collaboration.active_platform}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">None</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dates Section (Hotel View) */}
                                    <div className="bg-gray-50/50 border border-gray-50 rounded-2xl p-5 mb-8">
                                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Collaboration Period</p>
                                        <p className="text-gray-900 font-bold text-lg">{dateRange}</p>
                                    </div>
                                </>
                            )}

                            {/* Footer Actions */}
                            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-gray-100">
                                <button
                                    type="button"
                                    className="flex-1 rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all active:scale-95"
                                    onClick={handleContact}
                                >
                                    {userType === 'creator' ? 'Chat with Hotel' : 'Chat with Creator'}
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                                    onClick={() => {
                                        onViewDetails(collaboration.id)
                                        onClose()
                                    }}
                                >
                                    {userType === 'creator' ? 'Listing Page' : 'View Profile'}
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
