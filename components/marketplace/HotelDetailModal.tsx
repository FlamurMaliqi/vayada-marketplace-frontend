'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Hotel } from '@/lib/types'
import { Button, PlatformIcon } from '@/components/ui'
import { getMonthAbbr } from '@/lib/utils'
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
import { SuccessModal } from '@/components/ui/SuccessModal'
import { ErrorModal } from '@/components/ui/ErrorModal'

interface HotelDetailModalProps {
  hotel: Hotel | null
  isOpen: boolean
  onClose: () => void
}

// Format number with thousand separator (German locale)
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num)
}

export function HotelDetailModal({ hotel, isOpen, onClose }: HotelDetailModalProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [errorState, setErrorState] = useState<{ isOpen: boolean, message: string, title?: string }>({
    isOpen: false,
    message: ''
  })
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
        setErrorState({
          isOpen: true,
          message: 'Please log in to apply for collaborations',
          title: 'Authentication Required'
        })
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
          platform: pd.platform,
          deliverables: pd.deliverables.map(d => ({
            type: d.type,
            quantity: d.quantity,
          })),
        })),
      }

      await collaborationService.create(request)
      // Close application modal and show success modal
      setShowApplicationModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to submit application:', error)
      const rawMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.'

      let displayMessage = rawMessage
      let displayTitle = 'Application Error'

      if (rawMessage.includes('unique constraint') && rawMessage.includes('idx_collaborations_unique_active')) {
        displayMessage = 'You already have an active collaboration or pending request with this hotel. You can only have one active conversation per property.'
        displayTitle = 'Duplicate Application'
      }

      setErrorState({
        isOpen: true,
        message: displayMessage,
        title: displayTitle
      })
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
          {images.length > 0 && !imageError && (
            <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden">
              {/* Current Image */}
              <Image
                src={images[currentImageIndex]}
                alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
                onError={() => setImageError(true)}
                unoptimized
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
                    <PlatformIcon platform="Instagram" className="w-5 h-5" />
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
                    <PlatformIcon platform="TikTok" className="w-5 h-5" />
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
                    <PlatformIcon platform="Facebook" className="w-5 h-5" />
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
                    <PlatformIcon platform="YouTube" className="w-5 h-5" />
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
                      {hotel.availability.length === 12 ? (
                        <span className="inline-block px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          All Year
                        </span>
                      ) : (
                        hotel.availability.map((month, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {getMonthAbbr(month)}
                          </span>
                        ))
                      )}
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
                        <PlatformIcon platform={platform} className="w-5 h-5" />
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
        availableMonths={hotel.availability}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          onClose() // Close the hotel detail modal too after success
        }}
        title="Application Sent!"
        message={`Your application has been sent to ${hotel.name}. They will be notified immediately.`}
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

