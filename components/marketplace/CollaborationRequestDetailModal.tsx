'use client'

import { Collaboration, Hotel, Creator, UserType } from '@/lib/types'
import { DetailedCollaboration } from '@/services/api/collaborations'
import { Button, StarRating } from '@/components/ui'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon, MapPinIcon, StarIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface CollaborationRequestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  collaboration: DetailedCollaboration | null
  currentUserType: UserType
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onApprove?: (id: string) => void
}

// Platform icons mapping
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('instagram')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  if (platformLower.includes('tiktok')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    )
  }
  if (platformLower.includes('youtube') || platformLower.includes('yt')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
  if (platformLower.includes('facebook')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
  return null
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'less than a minute ago'
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}

export function CollaborationRequestDetailModal({
  isOpen,
  onClose,
  collaboration,
  currentUserType,
  onAccept,
  onDecline,
  onApprove,
}: CollaborationRequestDetailModalProps) {
  if (!isOpen || !collaboration) return null

  const getTotalFollowers = () => {
    if (currentUserType === 'hotel' && collaboration.creator?.platforms) {
      return collaboration.creator.platforms.reduce((sum, p) => sum + p.followers, 0)
    }
    return 0
  }

  const getAvgEngagement = () => {
    if (currentUserType === 'hotel' && collaboration.creator?.platforms) {
      const total = collaboration.creator.platforms.reduce((sum, p) => sum + (typeof p.engagementRate === 'number' ? p.engagementRate : 0), 0)
      return (total / collaboration.creator.platforms.length).toFixed(1)
    }
    return '0.0'
  }

  const getHandle = () => {
    if (currentUserType === 'hotel' && collaboration.creator?.platforms?.[0]) {
      return collaboration.creator.platforms[0].handle
    }
    return ''
  }

  const getMessage = () => {
    if (collaboration.whyGreatFit) {
      return collaboration.whyGreatFit
    }

    if (currentUserType === 'hotel' && collaboration.creator) {
      return "I absolutely love your property! I specialize in luxury travel content and would love to showcase your stunning rooms and amenities to my engaged audience."
    }
    if (currentUserType === 'creator' && collaboration.hotel) {
      return "Your eco-friendly approach aligns perfectly with my content focus. I'd love to create authentic content highlighting your sustainability initiatives and unique experiences."
    }
    return "Looking forward to collaborating with you!"
  }

  // Real travel dates from collaboration data
  const travelDateFrom = collaboration.travelDateFrom || collaboration.preferredDateFrom || 'TBD'
  const travelDateTo = collaboration.travelDateTo || collaboration.preferredDateTo || 'TBD'

  const otherParty = currentUserType === 'hotel' ? collaboration.creator : collaboration.hotel
  const otherPartyName = otherParty?.name || ''
  const otherPartyHandle = currentUserType === 'hotel' ? getHandle() : ''
  const otherPartyLocation = currentUserType === 'hotel'
    ? collaboration.creator?.location || ''
    : collaboration.hotel?.location || ''
  const portfolioLink = currentUserType === 'hotel'
    ? collaboration.creator?.portfolioLink
    : undefined

  const listingImages = collaboration.listingImages || []
  const hasListingImages = listingImages.length > 0

  const handleAccept = () => {
    if (onAccept) {
      onAccept(collaboration.id)
    }
    onClose()
  }

  const handleDecline = () => {
    if (onDecline) {
      onDecline(collaboration.id)
    }
    onClose()
  }

  const handleApprove = () => {
    if (onApprove) {
      onApprove(collaboration.id)
    }
    onClose()
  }

  // Check if current user has already agreed
  const hasUserAgreed = (currentUserType === 'hotel' && collaboration.hotelAgreedAt) ||
    (currentUserType === 'creator' && collaboration.creatorAgreedAt)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <XMarkIcon className="w-6 h-6 text-gray-400" />
        </button>

        {/* Modal Content */}
        <div className="p-0 overflow-y-auto">
          {/* Listing Images (For Creators) */}
          {currentUserType === 'creator' && hasListingImages && (
            <div className="w-full relative aspect-[16/9] bg-gray-100 border-b border-gray-100">
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
                {listingImages.map((img, idx) => (
                  <div key={idx} className="flex-none w-full snap-center">
                    <img
                      src={img}
                      alt={`Listing ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {listingImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                  {listingImages.length} Images
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 overflow-hidden">
                {(currentUserType === 'hotel' ? collaboration.creator?.profilePicture : collaboration.hotel?.picture) ? (
                  <img
                    src={(currentUserType === 'hotel' ? collaboration.creator?.profilePicture : collaboration.hotel?.picture) || undefined}
                    alt={otherPartyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                    {otherPartyName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold text-gray-900">{otherPartyName}</h4>
                  {(currentUserType === 'hotel' && collaboration.creator?.status === 'verified') ||
                    (currentUserType === 'creator' && collaboration.hotel?.status === 'verified') ? (
                    <CheckBadgeIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  ) : null}
                </div>
                {otherPartyHandle && (
                  <p className="text-gray-600 mb-2">{otherPartyHandle}</p>
                )}
                {currentUserType === 'hotel' && collaboration.creator && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>{formatNumber(getTotalFollowers())} followers</span>
                    <span>•</span>
                    <span>{getAvgEngagement()}% engagement</span>
                    <span>•</span>
                    <span>Applied {getTimeAgo(collaboration.createdAt)}</span>
                  </div>
                )}
                {otherPartyLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{otherPartyLocation}</span>
                  </div>
                )}
                {/* Platform Badges */}
                {currentUserType === 'hotel' && collaboration.creator?.platforms && (
                  <div className="flex flex-wrap gap-2">
                    {collaboration.creator.platforms.slice(0, 2).map((platform, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {getPlatformIcon(platform.name)}
                        <span>{platform.name === 'YT' ? 'YouTube' : platform.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Brand Overview (For Creators) */}
            {currentUserType === 'creator' && (collaboration.hotelAbout || collaboration.hotelWebsite) && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-3">Brand Overview</h5>
                {collaboration.hotelAbout && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {collaboration.hotelAbout}
                  </p>
                )}
                {collaboration.hotelWebsite && (
                  <a
                    href={collaboration.hotelWebsite.startsWith('http') ? collaboration.hotelWebsite : `https://${collaboration.hotelWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-semibold"
                  >
                    Visit Website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Message / Application Summary */}
            <div>
              <h5 className="font-bold text-gray-900 mb-2">
                {currentUserType === 'hotel' ? 'Application Summary' : 'Message'}
              </h5>
              <p className="text-gray-700 leading-relaxed">{getMessage()}</p>
            </div>

            {/* Travel Dates / Period */}
            <div>
              <h5 className="font-bold text-gray-900 mb-2">
                {currentUserType === 'hotel' ? 'Travel Dates' : 'Collaboration Period'}
              </h5>
              {collaboration.travelDateFrom || collaboration.preferredDateFrom ? (
                <p className="text-gray-700">{travelDateFrom} – {travelDateTo}</p>
              ) : collaboration.preferredMonths && collaboration.preferredMonths.length > 0 ? (
                <p className="text-gray-700">Preferred Months: {collaboration.preferredMonths.join(', ')}</p>
              ) : (
                <p className="text-gray-700">TBD</p>
              )}
            </div>

            {/* Offer Details (Creator Only) */}
            {currentUserType === 'creator' && collaboration.collaborationType && (
              <div>
                <h5 className="font-bold text-gray-900 mb-2">Offer Details</h5>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-700 font-medium">
                    {collaboration.collaborationType}
                    {collaboration.collaborationType === 'Free Stay' && collaboration.freeStayMaxNights && ` • ${collaboration.freeStayMaxNights} Nights`}
                    {collaboration.collaborationType === 'Paid' && collaboration.paidAmount && ` • $${collaboration.paidAmount}`}
                    {collaboration.collaborationType === 'Discount' && collaboration.discountPercentage && ` • ${collaboration.discountPercentage}% Off`}
                  </p>
                </div>
              </div>
            )}

            {/* Looking For Section (For Creators) */}
            {currentUserType === 'creator' && collaboration.creatorRequirements && (
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                  Looking For
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {collaboration.creatorRequirements.platforms && collaboration.creatorRequirements.platforms.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platforms</p>
                      <div className="flex flex-wrap gap-1">
                        {collaboration.creatorRequirements.platforms.map((p, i) => (
                          <span key={p} className="text-sm font-semibold text-gray-900 capitalize">
                            {p}{i < (collaboration.creatorRequirements?.platforms.length || 0) - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {collaboration.creatorRequirements.minFollowers > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Min. Followers</p>
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(collaboration.creatorRequirements.minFollowers)}+</p>
                    </div>
                  )}

                  {collaboration.creatorRequirements.targetCountries && collaboration.creatorRequirements.targetCountries.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Countries</p>
                      <p className="text-sm font-semibold text-gray-900">{collaboration.creatorRequirements.targetCountries.join(', ')}</p>
                    </div>
                  )}

                  {(collaboration.creatorRequirements.targetAgeMin || collaboration.creatorRequirements.targetAgeMax) && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Audience Age</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {collaboration.creatorRequirements.targetAgeMin && collaboration.creatorRequirements.targetAgeMax
                          ? `${collaboration.creatorRequirements.targetAgeMin}-${collaboration.creatorRequirements.targetAgeMax}`
                          : collaboration.creatorRequirements.targetAgeMin
                            ? `${collaboration.creatorRequirements.targetAgeMin}+`
                            : collaboration.creatorRequirements.targetAgeMax
                              ? `Up to ${collaboration.creatorRequirements.targetAgeMax}`
                              : 'Any'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deliverables / Platforms I'll Post On */}
            {collaboration.platformDeliverables && collaboration.platformDeliverables.length > 0 && (
              <div>
                <h5 className="font-bold text-gray-900 mb-3">
                  {currentUserType === 'hotel' ? "Platforms I'll Post On" : 'Deliverables'}
                </h5>
                <div className="space-y-4">
                  {collaboration.platformDeliverables.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-blue-600">
                          {getPlatformIcon(item.platform)}
                        </div>
                        <span className="font-semibold text-gray-900">{item.platform}</span>
                      </div>
                      {currentUserType === 'creator' ? (
                        <div className="ml-7 flex flex-wrap gap-2">
                          {item.deliverables.map((deliverable, dIndex) => (
                            <div key={dIndex} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              {deliverable.quantity}x {deliverable.type}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-7 space-y-1">
                          {item.deliverables.map((deliverable, dIndex) => (
                            <div key={dIndex} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg inline-block w-fit">
                              {deliverable.quantity}x {deliverable.type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details (For Accepted/Completed) */}
            {currentUserType === 'creator' && (collaboration.status === 'accepted' || collaboration.status === 'completed') && collaboration.hotelPhone && (
              <div className="border-t border-gray-100 pt-6">
                <h5 className="font-bold text-gray-900 mb-2">Hotel Contact Details</h5>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <a href={`tel:${collaboration.hotelPhone}`} className="text-primary-600 hover:underline font-medium">
                  {collaboration.hotelPhone}
                </a>
              </div>
            )}

            {/* Portfolio */}
            {portfolioLink && (
              <div>
                <h5 className="font-bold text-gray-900 mb-2">Portfolio</h5>
                <a
                  href={portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>{portfolioLink}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Social Media Platform Metrics */}
            {currentUserType === 'hotel' && collaboration.creator?.platforms && collaboration.creator.platforms.length > 0 && (
              <div>
                <h5 className="font-bold text-gray-900 mb-4">Platform Metrics</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collaboration.creator.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 flex items-center justify-center text-gray-900 bg-gray-100 rounded-lg">
                          {getPlatformIcon(platform.name)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {platform.name === 'YT' ? 'YouTube' : platform.name}
                        </h3>
                      </div>

                      {/* Main Stats */}
                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Followers</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatNumber(platform.followers)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Engagement</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(typeof platform.engagementRate === 'number' ? platform.engagementRate : 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Top Countries */}
                      {platform.topCountries && platform.topCountries.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-3">Top Countries</p>
                          <div className="space-y-2">
                            {platform.topCountries.slice(0, 3).map((country, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {/* Simple flag mapping could go here, for now just text or emoji if possible */}
                                  <span className="text-sm font-medium text-gray-900">{country.country}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                  {country.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Age Groups */}
                      {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-3">Top Age Groups</p>
                          <div className="space-y-2">
                            {platform.topAgeGroups.slice(0, 3).map((ageGroup, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{ageGroup.ageRange}</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {ageGroup.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gender Split */}
                      {platform.genderSplit && (
                        <div>
                          <p className="text-sm text-gray-500 mb-3">Gender Split</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Male</span>
                              <span className="text-sm font-bold text-gray-900">{platform.genderSplit.male}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Female</span>
                              <span className="text-sm font-bold text-gray-900">{platform.genderSplit.female}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {currentUserType === 'hotel' && collaboration.creator?.rating && (
              <div>
                <h5 className="font-bold text-gray-900 mb-4">Reviews & Ratings</h5>
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  {collaboration.creator.rating.totalReviews > 0 ? (
                    <>
                      {/* Header with Overall Rating */}
                      <div className="bg-gray-50 px-5 py-4 flex items-center justify-between border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {collaboration.creator.rating.averageRating.toFixed(1)}
                            </span>
                            <div className="flex flex-col">
                              <StarRating
                                rating={collaboration.creator.rating.averageRating}
                                size="sm"
                                showNumber={false}
                                showReviews={false}
                              />
                              <span className="text-xs text-gray-500">
                                {collaboration.creator.rating.totalReviews} reviews
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Reviews List */}
                      {collaboration.creator.rating.reviews && collaboration.creator.rating.reviews.length > 0 && (
                        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                          {collaboration.creator.rating.reviews.map((review) => (
                            <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h6 className="font-semibold text-gray-900 text-sm">{review.hotelName}</h6>
                                  <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <StarRating
                                  rating={review.rating}
                                  size="sm"
                                  showNumber={false}
                                  showReviews={false}
                                />
                              </div>
                              {review.comment && (
                                <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <StarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No reviews yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Modal Footer */}
        {(collaboration.status === 'pending' || collaboration.status === 'negotiating') && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end">
            <div className="flex items-center gap-3">
              {collaboration.status === 'pending' && (
                <>
                  {!collaboration.is_initiator ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm font-medium flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 italic">
                      Waiting for {collaboration.initiator_type === 'hotel' ? 'Creator' : 'Hotel'} response...
                    </div>
                  )}
                </>
              )}
              {collaboration.status === 'negotiating' && (
                <>
                  {hasUserAgreed ? (
                    <div className="text-gray-400 text-sm font-medium flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                      <ArrowPathIcon className="w-4 h-4 animate-spin-slow" /> Waiting for {otherPartyName}...
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleApprove}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" /> Approve Terms
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


