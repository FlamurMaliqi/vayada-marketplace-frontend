import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Hotel } from '@/lib/types'
import { Button, SuccessModal, ErrorModal, PlatformIcon } from '@/components/ui'
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HotelDetailModal } from './HotelDetailModal'
import { CollaborationApplicationModal, type CollaborationApplicationData } from './CollaborationApplicationModal'
import { collaborationService, type CreateCreatorCollaborationRequest } from '@/services/api/collaborations'
import { getCurrentUserInfo } from '@/lib/utils/accessControl'
import { getMonthAbbr } from '@/lib/utils/months'
import { ROUTES } from '@/lib/constants/routes'

interface HotelCardProps {
  hotel: Hotel
  creatorPlatforms?: string[]
  isPublic?: boolean
}

export function HotelCard({ hotel, creatorPlatforms = [], isPublic = false }: HotelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [errorState, setErrorState] = useState<{ isOpen: boolean, message: string, title?: string }>({
    isOpen: false,
    message: ''
  })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
          platform: pd.platform as 'Instagram' | 'TikTok' | 'YouTube',
          deliverables: pd.deliverables.map(d => ({
            type: d.type,
            quantity: d.quantity,
          })),
        })),
      }

      await collaborationService.create(request)
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

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 flex flex-col h-full">
        {/* Image Gallery */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0 overflow-hidden">
          {images.length > 0 && !imageError ? (
            <>
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Indicators/Dots */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        goToImage(index)
                      }}
                      className={`h-2 rounded-full transition-all ${index === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-primary-600 text-3xl font-bold">
                {hotel.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {hotel.name}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{hotel.location}</span>
          </div>

          {/* Platforms */}
          {hotel.platforms && hotel.platforms.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700 font-medium">Platforms:</span>
                <div className="flex items-center gap-2">
                  {hotel.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center w-6 h-6 text-gray-700"
                      title={platform === 'YT' ? 'YouTube' : platform}
                    >
                      <PlatformIcon platform={platform} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          {hotel.availability && hotel.availability.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-700 font-medium">Available:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {hotel.availability.length === 12 ? (
                    <span className="inline-block px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                      All Year
                    </span>
                  ) : hotel.availability.length > 4 ? (
                    <>
                      {hotel.availability.slice(0, 4).map((month, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                        >
                          {getMonthAbbr(month)}
                        </span>
                      ))}
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        +{hotel.availability.length - 4}
                      </span>
                    </>
                  ) : (
                    hotel.availability.map((month, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                      >
                        {getMonthAbbr(month)}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsModalOpen(true)}
            >
              View Details
            </Button>
            {isPublic ? (
              <Link href={`${ROUTES.LOGIN}?redirect=/marketplace`} className="flex-1">
                <Button variant="primary" size="sm" className="w-full">
                  Sign in to Apply
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault()
                  setShowApplicationModal(true)
                }}
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>
      <HotelDetailModal
        hotel={hotel}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CollaborationApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
        hotelName={hotel.name}
        availableMonths={hotel.availability}
        requiredPlatforms={hotel.platforms}
        creatorPlatforms={creatorPlatforms}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
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
    </>
  )
}

