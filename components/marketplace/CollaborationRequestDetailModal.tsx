'use client'

import { useState } from 'react'
import { Collaboration, Hotel, Creator, UserType } from '@/lib/types'
import { Button, StarRating } from '@/components/ui'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon, MapPinIcon, StarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface CollaborationRequestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  collaboration: (Collaboration & { hotel?: Hotel; creator?: Creator }) | null
  currentUserType: UserType
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}

// Platform icons mapping
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('instagram')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }
  if (platformLower.includes('tiktok')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  }
  if (platformLower.includes('youtube') || platformLower.includes('yt')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  if (platformLower.includes('facebook')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
}: CollaborationRequestDetailModalProps) {
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(new Set())
  
  if (!isOpen || !collaboration) return null

  const togglePlatform = (index: number) => {
    setExpandedPlatforms(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const getTotalFollowers = () => {
    if (currentUserType === 'hotel' && collaboration.creator?.platforms) {
      return collaboration.creator.platforms.reduce((sum, p) => sum + p.followers, 0)
    }
    return 0
  }

  const getAvgEngagement = () => {
    if (currentUserType === 'hotel' && collaboration.creator?.platforms) {
      const total = collaboration.creator.platforms.reduce((sum, p) => sum + p.engagementRate, 0)
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
    if (currentUserType === 'hotel' && collaboration.creator) {
      return "I absolutely love your property! I specialize in luxury travel content and would love to showcase your stunning rooms and amenities to my engaged audience."
    }
    if (currentUserType === 'creator' && collaboration.hotel) {
      return "Your eco-friendly approach aligns perfectly with my content focus. I'd love to create authentic content highlighting your sustainability initiatives and unique experiences."
    }
    return "Looking forward to collaborating with you!"
  }

  // Mock travel dates - in production this would come from collaboration data
  const travelDateFrom = 'Jun 15, 2024'
  const travelDateTo = 'Jun 20, 2024'

  // Mock platforms to post on - in production this would come from collaboration data
  const platformsToPostOn = currentUserType === 'hotel' && collaboration.creator?.platforms
    ? collaboration.creator.platforms.slice(0, 2).map(p => p.name)
    : []

  const otherParty = currentUserType === 'hotel' ? collaboration.creator : collaboration.hotel
  const otherPartyName = otherParty?.name || ''
  const otherPartyHandle = currentUserType === 'hotel' ? getHandle() : ''
  const otherPartyLocation = currentUserType === 'hotel' 
    ? collaboration.creator?.location || ''
    : collaboration.hotel?.location || ''
  const portfolioLink = currentUserType === 'hotel' 
    ? collaboration.creator?.portfolioLink
    : undefined

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">Review and manage creator collaboration requests</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-2xl">
              {otherPartyName.charAt(0)}
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

          {/* Application Summary */}
          <div>
            <h5 className="font-bold text-gray-900 mb-2">Application Summary</h5>
            <p className="text-gray-700 leading-relaxed">{getMessage()}</p>
          </div>

          {/* Travel Dates */}
          {currentUserType === 'hotel' && (
            <div>
              <h5 className="font-bold text-gray-900 mb-2">Travel Dates</h5>
              <p className="text-gray-700">{travelDateFrom} – {travelDateTo}</p>
            </div>
          )}

          {/* Platforms I'll Post On */}
          {currentUserType === 'hotel' && platformsToPostOn.length > 0 && (
            <div>
              <h5 className="font-bold text-gray-900 mb-2">Platforms I'll Post On</h5>
              <div className="flex flex-wrap gap-2">
                {platformsToPostOn.map((platform, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {getPlatformIcon(platform)}
                    <span>{platform === 'YT' ? 'YouTube' : platform}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Platform Metrics */}
          {currentUserType === 'hotel' && collaboration.creator?.platforms && collaboration.creator.platforms.length > 0 && (
            <div>
              <h5 className="font-bold text-gray-900 mb-4">Social Media Platforms</h5>
              <div className="space-y-3">
                {collaboration.creator.platforms.map((platform, index) => {
                  const isExpanded = expandedPlatforms.has(index)
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
                    >
                      {/* Platform Header - Clickable */}
                      <button
                        onClick={() => togglePlatform(index)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 flex items-center justify-center text-primary-600">
                            {getPlatformIcon(platform.name)}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <h6 className="text-lg font-bold text-gray-900">
                                {platform.name === 'YT' ? 'YouTube' : platform.name}
                              </h6>
                              {platform.handle && (
                                <span className="text-sm text-gray-600">@{platform.handle}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                {formatNumber(platform.followers)} followers
                              </span>
                              <span className="text-sm text-gray-600">
                                {platform.engagementRate.toFixed(1)}% engagement
                              </span>
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-6 border-t border-gray-200 pt-4 space-y-6">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Followers</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(platform.followers)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {platform.engagementRate.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          {/* Top Countries */}
                          {platform.topCountries && platform.topCountries.length > 0 && (
                            <div>
                              <h6 className="text-sm font-semibold text-gray-900 mb-3">Top Countries</h6>
                              <div className="space-y-2">
                                {platform.topCountries.map((country, idx) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">🏳️</span>
                                      <span className="text-sm text-gray-700">{country.country}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {country.percentage}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Top Age Groups */}
                          {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
                            <div>
                              <h6 className="text-sm font-semibold text-gray-900 mb-3">Top Age Groups</h6>
                              <div className="space-y-2">
                                {platform.topAgeGroups.map((ageGroup, idx) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{ageGroup.ageRange}</span>
                                    <span className="text-sm font-semibold text-gray-900">
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
                              <h6 className="text-sm font-semibold text-gray-900 mb-3">Gender Split</h6>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700">Male</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {platform.genderSplit.male}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${platform.genderSplit.male}%` }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700">Female</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {platform.genderSplit.female}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-pink-600 h-2 rounded-full"
                                      style={{ width: `${platform.genderSplit.female}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {currentUserType === 'hotel' && collaboration.creator?.rating && (
            <div>
              <h5 className="font-bold text-gray-900 mb-4">Reviews & Ratings</h5>
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                {/* Overall Rating Summary */}
                {collaboration.creator.rating.totalReviews > 0 ? (
                  <>
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                      <div className="flex items-center gap-4">
                        <StarRating
                          rating={collaboration.creator.rating.averageRating}
                          totalReviews={collaboration.creator.rating.totalReviews}
                          size="lg"
                        />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                              {collaboration.creator.rating.averageRating.toFixed(1)}
                            </span>
                            <span className="text-lg text-gray-500">/ 5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {collaboration.creator.rating.reviews && collaboration.creator.rating.reviews.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          All Reviews ({collaboration.creator.rating.reviews.length})
                        </h3>
                        <div className="space-y-4">
                          {collaboration.creator.rating.reviews.map((review) => (
                            <div
                              key={review.id}
                              className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    {review.hotelName}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
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
                                <p className="text-gray-700 leading-relaxed mt-3">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No reviews yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Reviews from hotels will appear here after collaborations
                    </p>
                  </div>
                )}
              </div>
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
        </div>

        {/* Modal Footer */}
        {collaboration.status === 'pending' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end">
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


