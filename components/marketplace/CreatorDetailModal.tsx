'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Creator } from '@/lib/types'
import { Button, StarRating, SuccessModal, ErrorModal, PlatformIcon } from '@/components/ui'
import { formatNumber, formatFollowers, getTimeAgo } from '@/lib/utils'
import {
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { HotelInvitationModal, type HotelInvitationData } from './HotelInvitationModal'
import { collaborationService, type CreateHotelCollaborationRequest } from '@/services/api/collaborations'
import { hotelService } from '@/services/api/hotels'
import { getCurrentUserInfo } from '@/lib/utils/accessControl'
import { ROUTES } from '@/lib/constants/routes'

interface CreatorDetailModalProps {
  creator: Creator | null
  isOpen: boolean
  onClose: () => void
  isPublic?: boolean
}

// Get country flag emoji
const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    'Germany': '🇩🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'Canada': '🇨🇦',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Singapore': '🇸🇬',
    'Thailand': '🇹🇭',
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'Philippines': '🇵🇭',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'South Africa': '🇿🇦',
    'UAE': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'Qatar': '🇶🇦',
    'Kuwait': '🇰🇼',
    'Egypt': '🇪🇬',
  }
  return countryFlags[country] || '🏳️'
}

export function CreatorDetailModal({ creator, isOpen, onClose, isPublic = false }: CreatorDetailModalProps) {
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [errorState, setErrorState] = useState<{ isOpen: boolean, message: string, title?: string }>({
    isOpen: false,
    message: ''
  })
  const [hotelListings, setHotelListings] = useState<{
    id: string;
    name: string;
    location: string;
    availableMonths: string[];
    offerings: Array<{ type: string; availability: string[] }>
  }[]>([])

  // Fetch hotel listings when modal is open (skip for public view)
  useEffect(() => {
    const fetchListings = async () => {
      if (!isOpen || isPublic) return

      const userInfo = getCurrentUserInfo()
      if (userInfo.userType !== 'hotel') return

      try {
        const profile = await hotelService.getMyProfile()
        if (profile.listings && profile.listings.length > 0) {
          const formattedListings = profile.listings.map(l => {
            const allAvailableMonths = Array.from(new Set(
              l.collaboration_offerings?.flatMap(o => o.availability_months || []) || []
            ))

            return {
              id: l.id,
              name: l.name,
              location: l.location,
              availableMonths: allAvailableMonths,
              offerings: l.collaboration_offerings.map(o => ({
                type: o.collaboration_type,
                availability: o.availability_months
              }))
            }
          })
          setHotelListings(formattedListings)
        }
      } catch (error) {
        console.error('Failed to fetch hotel listings:', error)
      }
    }

    fetchListings()
  }, [isOpen, isPublic])

  if (!isOpen || !creator) return null

  const handleInviteClick = () => {
    setShowInvitationModal(true)
  }

  const handleInvitationSubmit = async (data: HotelInvitationData) => {
    try {
      const userInfo = getCurrentUserInfo()
      if (!userInfo.userId) {
        setErrorState({
          isOpen: true,
          message: 'Please log in to invite creators',
          title: 'Authentication Required'
        })
        return
      }

      if (!creator) {
        setErrorState({
          isOpen: true,
          message: 'Creator information is missing',
          title: 'Missing Information'
        })
        return
      }

      // Transform frontend data to API format
      const request: CreateHotelCollaborationRequest = {
        initiator_type: 'hotel',
        listing_id: data.listingId,
        creator_id: creator.id,
        collaboration_type: data.collaborationType,
        free_stay_min_nights: data.freeStayMinNights,
        free_stay_max_nights: data.freeStayMaxNights,
        paid_amount: data.paidAmount,
        discount_percentage: data.discountPercentage,
        preferred_date_from: data.preferredDateFrom || undefined,
        preferred_date_to: data.preferredDateTo || undefined,
        preferred_months: data.preferredMonths.length > 0 ? data.preferredMonths : undefined,
        platform_deliverables: (data.platformDeliverables || []).map(pd => ({
          platform: pd.platform as 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom',
          deliverables: pd.deliverables.map(d => ({
            type: d.type,
            quantity: d.quantity,
          })),
        })),
        message: data.message || undefined,
      }

      await collaborationService.create(request)
      setShowInvitationModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to send invitation:', error)
      const rawMessage = error instanceof Error ? error.message : 'Failed to send invitation. Please try again.'

      let displayMessage = rawMessage
      let displayTitle = 'Invitation Error'

      if (rawMessage.includes('unique constraint') && rawMessage.includes('idx_collaborations_unique_active')) {
        displayMessage = 'You already have an active collaboration or pending invitation with this creator. You can only have one active conversation per property.'
        displayTitle = 'Duplicate Invitation'
      }

      setErrorState({
        isOpen: true,
        message: displayMessage,
        title: displayTitle
      })
    }
  }

  // Calculate total followers and weighted average engagement (proportional to follower count)
  const totalFollowers = creator.platforms.reduce((sum, platform) => sum + platform.followers, 0)
  const avgEngagementRate = totalFollowers > 0
    ? creator.platforms.reduce((sum, platform) => sum + (platform.followers * (typeof platform.engagementRate === 'number' ? platform.engagementRate : 0)), 0) / totalFollowers
    : 0

  // Get primary platform handle (first platform's handle)
  const primaryHandle = creator.platforms.length > 0
    ? creator.platforms[0].handle.replace('@', '')
    : ''

  // Generate about description
  const getAboutDescription = () => {
    return 'Content creator sharing unique experiences and insights.'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header Section - Profile Picture, Name, Platform Badges, Reviews */}
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full flex-shrink-0 overflow-hidden relative">
              {creator.profilePicture && !imageError ? (
                <Image
                  src={creator.profilePicture}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl">
                  {creator.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name, Handle, Platform Badges, and Reviews */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{creator.name}</h2>
              <p className="text-gray-600 mb-3">@{primaryHandle}</p>

              {/* Platform Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {creator.platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    <PlatformIcon platform={platform.name} className="w-5 h-5" />
                    <span>{platform.name === 'YT' ? 'YouTube' : platform.name}</span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              {creator.rating && (
                <div>
                  <StarRating
                    rating={creator.rating.averageRating}
                    totalReviews={creator.rating.totalReviews}
                    size="lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Metrics Section - Followers, Engagement Rate, Location */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-6 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatFollowers(totalFollowers)}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {typeof avgEngagementRate === 'number'
                    ? avgEngagementRate.toFixed(1)
                    : '0.0'}%
                </div>
                <div className="text-sm text-gray-600">Engagement</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>{creator.location}</span>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">
              {getAboutDescription()}
            </p>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Social Links</h3>
            <div className="flex gap-3">
              {creator.platforms.map((platform, index) => (
                <a
                  key={index}
                  href={`https://${platform.name.toLowerCase()}.com/${platform.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                  title={platform.name}
                >
                  <PlatformIcon platform={platform.name} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Portfolio Link Section */}
          {creator.portfolioLink && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h3>
              <a
                href={creator.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View Portfolio</span>
              </a>
            </div>
          )}

          {/* Platform Metrics Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Platform Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creator.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  {/* Platform Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="text-gray-700">
                      <PlatformIcon platform={platform.name} className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {platform.name === 'YT' ? 'YouTube' : platform.name}
                    </h4>
                  </div>

                  {/* Followers and Engagement */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Followers</div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(platform.followers)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Engagement</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {typeof platform.engagementRate === 'number'
                          ? platform.engagementRate.toFixed(1)
                          : '0.0'}%
                      </div>
                    </div>
                  </div>

                  {/* Top Countries */}
                  {platform.topCountries && platform.topCountries.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Top Countries</div>
                      <ul className="space-y-2">
                        {platform.topCountries.map((country, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-lg">{getCountryFlag(country.country)}</span>
                            <span className="text-sm text-gray-700">{country.country}: <span className="font-semibold text-gray-900">{country.percentage}%</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Top Age Groups */}
                  {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Top Age Groups</div>
                      <ul className="space-y-2">
                        {platform.topAgeGroups.map((ageGroup, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {ageGroup.ageRange}: <span className="font-semibold text-gray-900">{ageGroup.percentage}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gender Split */}
                  {platform.genderSplit && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Gender Split</div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-700">Male: <span className="font-semibold text-gray-900">{platform.genderSplit.male}%</span></div>
                        <div className="text-sm text-gray-700">Female: <span className="font-semibold text-gray-900">{platform.genderSplit.female}%</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          {creator.rating && creator.rating.reviews && creator.rating.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Reviews ({creator.rating.totalReviews})
              </h3>
              <div className="space-y-4">
                {creator.rating.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.hotelName}</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(review.createdAt)}
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
                      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer with Last Updated and Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated {getTimeAgo(creator.updatedAt)}
            </p>
            {isPublic ? (
              <Link href={`${ROUTES.LOGIN}?redirect=/marketplace`}>
                <Button variant="primary" size="lg">
                  Sign in to Collaborate
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleInviteClick}
              >
                Invite to Collaborate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hotel Invitation Modal */}
      <HotelInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        onSubmit={handleInvitationSubmit}
        creatorName={creator.name}
        listings={hotelListings}
        creatorPlatforms={creator.platforms.map(p => p.name)}
      />
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Invitation Sent!"
        message={`We've sent your collaboration invitation to ${creator.name}. They will be notified immediately.`}
      />
      {/* Error Modal */}
      <ErrorModal
        isOpen={errorState.isOpen}
        onClose={() => setErrorState(prev => ({ ...prev, isOpen: false }))}
        title={errorState.title}
        message={errorState.message}
      />
    </div>
  )
}

