'use client'

import { useState, useEffect } from 'react'
import { Hotel } from '@/lib/types'
import { Button } from '@/components/ui'
import {
  MapPinIcon,
  GlobeAltIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { CollaborationApplicationModal, type CollaborationApplicationData } from './CollaborationApplicationModal'
import { collaborationService, type CreateCreatorCollaborationRequest } from '@/services/api/collaborations'
import { getCurrentUserInfo } from '@/lib/utils/accessControl'

interface HotelDetailModalProps {
  hotel: Hotel | null
  isOpen: boolean
  onClose: () => void
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

// Month abbreviation mapping
const getMonthAbbr = (month: string): string => {
  const monthMap: { [key: string]: string } = {
    'Januar': 'Jan',
    'Februar': 'Feb',
    'März': 'Mar',
    'April': 'Apr',
    'Mai': 'May',
    'Juni': 'Jun',
    'Juli': 'Jul',
    'August': 'Aug',
    'September': 'Sep',
    'Oktober': 'Oct',
    'November': 'Nov',
    'Dezember': 'Dec',
  }
  return monthMap[month] || month.substring(0, 3)
}

// Format number with thousand separator
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num)
}

export function HotelDetailModal({ hotel, isOpen, onClose }: HotelDetailModalProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset image index when modal opens (must be before early return)
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
    }
  }, [isOpen])

  if (!isOpen || !hotel) return null

  const handleApplyClick = () => {
    setShowApplicationModal(true)
  }

  const handleApplicationSubmit = async (data: CollaborationApplicationData) => {
    try {
      const userInfo = getCurrentUserInfo()
      if (!userInfo.userId) {
        alert('Please log in to apply for collaborations')
        return
      }

      // Transform frontend data to API format
      const request: CreateCreatorCollaborationRequest = {
        initiator_type: 'creator',
        listing_id: hotel.id,
        creator_id: userInfo.userId,
        why_great_fit: data.whyGreatFit,
        consent: true,
        travel_date_from: data.travelDateFrom || undefined,
        travel_date_to: data.travelDateTo || undefined,
        preferred_months: data.preferredMonths.length > 0 ? data.preferredMonths : undefined,
        platform_deliverables: (data.platformDeliverables || []).map(pd => ({
          platform: pd.platform as 'Instagram' | 'TikTok' | 'YouTube',
          deliverables: pd.deliverables.map(d => ({
            type: d.type,
            quantity: d.quantity,
          })),
        })),
      }

      await collaborationService.create(request)
      // Close both modals
      setShowApplicationModal(false)
      onClose()
      // Optionally show success message
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
    }
  }

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : []
  const hasMultipleImages = images.length > 1

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Location and Domain */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              <span>{hotel.location}</span>
            </div>
            {hotel.domain && (
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5" />
                <a
                  href={`https://${hotel.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {hotel.domain}
                </a>
              </div>
            )}
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden">
              {/* Current Image */}
              <img
                src={images[currentImageIndex]}
                alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Indicators/Dots */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-2.5 rounded-full transition-all ${index === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-2.5 bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}

          {/* About Section */}
          {hotel.description && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>
          )}

          {/* Social Links */}
          {hotel.socialLinks && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find us online</h3>
              <div className="flex flex-wrap gap-3">
                {hotel.socialLinks.instagram && (
                  <a
                    href={hotel.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {getPlatformIcon('Instagram')}
                    <span>Instagram</span>
                  </a>
                )}
                {hotel.socialLinks.tiktok && (
                  <a
                    href={hotel.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {getPlatformIcon('TikTok')}
                    <span>TikTok</span>
                  </a>
                )}
                {hotel.socialLinks.facebook && (
                  <a
                    href={hotel.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {getPlatformIcon('Facebook')}
                    <span>Facebook</span>
                  </a>
                )}
                {hotel.socialLinks.youtube && (
                  <a
                    href={hotel.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {getPlatformIcon('YouTube')}
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Collaboration Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Collaboration Details</h3>
            <div className="space-y-4">
              {/* Board Type and Number of Nights */}
              {(hotel.boardType || hotel.numberOfNights) && (
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Offering</div>
                    <div className="text-gray-900 font-medium">
                      {hotel.collaborationType === 'Kostenlos' ? 'Free Stay' : 'Paid Collaboration'}
                      {hotel.numberOfNights && ` · ${hotel.numberOfNights} nights`}
                      {hotel.boardType && ` · Board: ${hotel.boardType}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Availability */}
              {hotel.availability && hotel.availability.length > 0 && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">Availability</div>
                    <div className="flex flex-wrap gap-2">
                      {hotel.availability.map((month, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {getMonthAbbr(month)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Looking For */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Looking For</h3>
            <div className="space-y-4">
              {/* Platforms */}
              {hotel.platforms && hotel.platforms.length > 0 && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.platforms.map((platform, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {getPlatformIcon(platform)}
                        <span>{platform === 'YT' ? 'YouTube' : platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Countries */}
              {hotel.targetAudience && hotel.targetAudience.length > 0 && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Top Countries</div>
                  <div className="flex flex-wrap gap-2">
                    {hotel.targetAudience.map((audience, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of Followers */}
              {hotel.minFollowers && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Minimum Followers</div>
                  <div className="text-gray-900 font-medium">
                    {formatNumber(hotel.minFollowers)}+ followers
                  </div>
                </div>
              )}

              {/* Age Range */}
              {(hotel.targetAgeMin || hotel.targetAgeMax) && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Target Age Range</div>
                  <div className="text-gray-900 font-medium">
                    {hotel.targetAgeMin && hotel.targetAgeMax
                      ? `${hotel.targetAgeMin} - ${hotel.targetAgeMax} years`
                      : hotel.targetAgeMin
                        ? `${hotel.targetAgeMin}+ years`
                        : hotel.targetAgeMax
                          ? `Up to ${hotel.targetAgeMax} years`
                          : ''}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleApplyClick}
            >
              Apply for Collaboration
            </Button>
          </div>
        </div>
      </div>

      {/* Collaboration Application Modal */}
      <CollaborationApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
        hotelName={hotel.name}
      />
    </div>
  )
}

