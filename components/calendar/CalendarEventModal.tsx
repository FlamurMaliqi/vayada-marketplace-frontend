'use client'

import { XMarkIcon, ArrowTopRightOnSquareIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline'
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
                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            {(collaboration.listing_images?.[0] || collaboration.listingImages?.[0] || collaboration.hotel_picture) ? (
                                                <img
                                                    src={collaboration.listing_images?.[0] || collaboration.listingImages?.[0] || collaboration.hotel_picture || ''}
                                                    alt={collaboration.listing_name || collaboration.hotel_name}
                                                    className="w-16 h-16 rounded-xl object-cover border border-gray-50 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-300">
                                                    {(collaboration.listing_name || collaboration.hotel_name).charAt(0)}
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
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-base font-bold text-gray-900">Offer Details</p>
                                            <p className="text-gray-600">
                                                {collaboration.collaboration_type || 'Custom'} • {collaboration.collaboration_type === 'Paid' ? `$${collaboration.paid_amount}` :
                                                    collaboration.collaboration_type === 'Discount' ? `${collaboration.discount_percentage}% Off` :
                                                        collaboration.collaboration_type === 'Free Stay' ? `${collaboration.free_stay_max_nights} Nights` : 'Barter'}
                                            </p>
                                        </div>

                                        {collaboration.platform_deliverables && collaboration.platform_deliverables.length > 0 && (
                                            <div className="flex flex-col gap-2">
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

                                        {/* Looking For Section */}
                                        {((collaboration as any).creatorRequirements || (collaboration as any).creator_requirements) && (
                                            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                                                <p className="text-lg font-bold text-gray-900">Looking For</p>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {(((collaboration as any).creatorRequirements || (collaboration as any).creator_requirements)?.platforms) &&
                                                        (((collaboration as any).creatorRequirements || (collaboration as any).creator_requirements)?.platforms).length > 0 && (
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Platforms</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {(((collaboration as any).creatorRequirements || (collaboration as any).creator_requirements)?.platforms).map((p: string, i: number, arr: string[]) => (
                                                                        <span key={p} className="text-sm font-medium text-gray-900 capitalize">
                                                                            {p}{i < arr.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {(((collaboration as any).creatorRequirements?.minFollowers || (collaboration as any).creator_requirements?.min_followers) > 0) && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min. Followers</p>
                                                            <p className="text-sm font-medium text-gray-900">{formatNumber((collaboration as any).creatorRequirements?.minFollowers || (collaboration as any).creator_requirements?.min_followers)}</p>
                                                        </div>
                                                    )}

                                                    {(((collaboration as any).creatorRequirements?.targetCountries || (collaboration as any).creator_requirements?.target_countries)) &&
                                                        (((collaboration as any).creatorRequirements?.targetCountries || (collaboration as any).creator_requirements?.target_countries)).length > 0 && (
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Top Countries</p>
                                                                <p className="text-sm font-medium text-gray-900">{((collaboration as any).creatorRequirements?.targetCountries || (collaboration as any).creator_requirements?.target_countries).join(', ')}</p>
                                                            </div>
                                                        )}

                                                    {((collaboration as any).creatorRequirements || (collaboration as any).creator_requirements) && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Age</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {((collaboration as any).creatorRequirements?.targetAgeMin || (collaboration as any).creator_requirements?.target_age_min) &&
                                                                    ((collaboration as any).creatorRequirements?.targetAgeMax || (collaboration as any).creator_requirements?.target_age_max)
                                                                    ? `${((collaboration as any).creatorRequirements?.targetAgeMin || (collaboration as any).creator_requirements?.target_age_min)}-${((collaboration as any).creatorRequirements?.targetAgeMax || (collaboration as any).creator_requirements?.target_age_max)}`
                                                                    : ((collaboration as any).creatorRequirements?.targetAgeMin || (collaboration as any).creator_requirements?.target_age_min)
                                                                        ? `${((collaboration as any).creatorRequirements?.targetAgeMin || (collaboration as any).creator_requirements?.target_age_min)}+`
                                                                        : ((collaboration as any).creatorRequirements?.targetAgeMax || (collaboration as any).creator_requirements?.target_age_max)
                                                                            ? `Up to ${((collaboration as any).creatorRequirements?.targetAgeMax || (collaboration as any).creator_requirements?.target_age_max)}`
                                                                            : 'Any'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4 text-left">
                                        <h3 className="text-2xl font-serif font-bold text-gray-900">
                                            Collaboration Details
                                        </h3>
                                    </div>

                                    {/* Profile Section */}
                                    <div className="flex items-start justify-between mb-6 text-left">
                                        <div className="flex items-center gap-4">
                                            {collaboration.creator_profile_picture ? (
                                                <img
                                                    src={collaboration.creator_profile_picture}
                                                    alt={collaboration.creator_name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                                                    {collaboration.creator_name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 leading-tight">{collaboration.creator_name}</h4>
                                                <p className="text-gray-400 text-sm mt-0.5">@{collaboration.handle || collaboration.creator_name.toLowerCase().replace(/\s+/g, '')}</p>
                                                <div className="flex items-center gap-1 mt-1 text-gray-400 text-sm">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    {collaboration.creator_location || 'Unknown Location'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="mt-1 inline-flex items-center rounded-full bg-[#EBF9F3] px-3 py-1 text-[13px] font-semibold text-[#008A5E]">
                                            Campaign Active
                                        </span>
                                    </div>

                                    {/* Dates Card */}
                                    <div className="rounded-2xl p-4 mb-4 text-left">
                                        <p className="text-[13px] font-medium text-gray-400 mb-1.5 tracking-wide">Dates</p>
                                        <p className="text-l font-bold text-gray-900">{dateRange}</p>
                                    </div>

                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                                        <div className="ounded-2xl p-4">
                                            <p className="text-[13px] font-medium text-gray-400 mb-1.5 tracking-wide">Reach</p>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-4 w-4 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                <span className="text-l font-bold text-gray-900">{formatNumber(collaboration.total_followers)}</span>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl p-4">
                                            <p className="text-[13px] font-medium text-gray-400 mb-1.5 tracking-wide">Platforms</p>
                                            <div className="flex flex-wrap gap-2">
                                                {collaboration.platforms && collaboration.platforms.length > 0 ? (
                                                    collaboration.platforms.map(p => (
                                                        <span key={p.name} className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[13px] font-bold text-gray-900 border border-gray-50">
                                                            {p.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[13px] font-bold text-gray-900 shadow-sm border border-gray-50">
                                                        {collaboration.active_platform || 'Instagram'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deliverables Section */}
                                    <div className="mb-6 text-left">
                                        <p className=" text-gray-900 mb-3">Deliverables</p>
                                        <div className="flex flex-wrap gap-2">
                                            {collaboration.platform_deliverables && collaboration.platform_deliverables.length > 0 ? (
                                                collaboration.platform_deliverables.flatMap(pd =>
                                                    pd.deliverables.map((d, idx) => (
                                                        <span key={`${pd.platform}-${d.type}-${idx}`} className="inline-flex items-center rounded-full bg-white border border-gray-100 px-2.5 py-1.5 text-[14px] text-gray-900">
                                                            {d.quantity} {d.type}
                                                        </span>
                                                    ))
                                                )
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">No specific deliverables listed</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Footer Actions */}
                            <div className={`flex items-center gap-3 border-t border-gray-100 ${userType === 'creator' ? 'mt-6 pt-5' : 'mt-8 pt-8'}`}>
                                <button
                                    type="button"
                                    className={`flex-1 rounded-xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95 ${userType === 'creator'
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                        : 'bg-[#4353E4] text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600'
                                        }`}
                                    onClick={handleContact}
                                >
                                    {userType === 'creator' ? 'Chat with Hotel' : 'Contact Creator'}
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
