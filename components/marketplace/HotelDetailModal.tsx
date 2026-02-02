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
  CalendarDaysIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
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

  const collaborationType = hotel.collaborationType === 'Kostenlos' ? 'Free Stay' : 'Paid'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image Section */}
        <div className="relative h-72 md:h-80 flex-shrink-0">
          {images.length > 0 && !imageError ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 transition-colors shadow-lg"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 transition-colors shadow-lg"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Dots */}
              {hasMultipleImages && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-2 rounded-full transition-all ${index === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <BuildingOfficeIcon className="w-20 h-20 text-white/50" />
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 transition-colors shadow-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Hotel Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {hotel.accommodationType && (
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  {hotel.accommodationType}
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                collaborationType === 'Free Stay'
                  ? 'bg-green-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
              }`}>
                {collaborationType}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{hotel.name}</h2>
            <div className="flex items-center gap-1 text-white/90">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hotel.numberOfNights && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{hotel.numberOfNights}</div>
                  <div className="text-xs text-gray-500 mt-1">Nights</div>
                </div>
              )}
              {hotel.boardType && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-sm font-bold text-gray-900">{hotel.boardType}</div>
                  <div className="text-xs text-gray-500 mt-1">Board Type</div>
                </div>
              )}
              {hotel.minFollowers && (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(hotel.minFollowers)}+</div>
                  <div className="text-xs text-gray-500 mt-1">Min. Followers</div>
                </div>
              )}
              {hotel.domain && (
                <a
                  href={`https://${hotel.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center transition-colors"
                >
                  <GlobeAltIcon className="w-6 h-6 text-primary-600 mx-auto" />
                  <div className="text-xs text-gray-500 mt-1">Website</div>
                </a>
              )}
            </div>

            {/* About */}
            {hotel.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-primary-600" />
                  About this Property
                </h3>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {/* What's Included */}
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                What's Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.collaborationType && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {collaborationType === 'Free Stay' ? 'Complimentary Stay' : 'Paid Collaboration'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hotel.numberOfNights ? `Up to ${hotel.numberOfNights} nights` : 'Dates flexible'}
                      </div>
                    </div>
                  </div>
                )}
                {hotel.boardType && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{hotel.boardType}</div>
                      <div className="text-xs text-gray-500">Meal plan included</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {hotel.availability && hotel.availability.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                  Available Months
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.availability.length === 12 ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Available All Year
                    </span>
                  ) : (
                    hotel.availability.map((month, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {getMonthAbbr(month)}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-primary-600" />
                Creator Requirements
              </h3>
              <div className="space-y-4">
                {/* Platforms */}
                {hotel.platforms && hotel.platforms.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Required Platforms</div>
                    <div className="flex flex-wrap gap-2">
                      {hotel.platforms.map((platform, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                        >
                          <PlatformIcon platform={platform} className="w-4 h-4" />
                          <span className="font-medium text-gray-700">
                            {platform === 'YT' ? 'YouTube' : platform}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                {hotel.targetAudience && hotel.targetAudience.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Target Audience Regions</div>
                    <div className="flex flex-wrap gap-2">
                      {hotel.targetAudience.map((audience, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age Range */}
                {(hotel.targetAgeMin || hotel.targetAgeMax) && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Target Age Range</div>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {hotel.targetAgeMin && hotel.targetAgeMax
                        ? `${hotel.targetAgeMin} - ${hotel.targetAgeMax} years`
                        : hotel.targetAgeMin
                          ? `${hotel.targetAgeMin}+ years`
                          : `Up to ${hotel.targetAgeMax} years`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {hotel.socialLinks && Object.values(hotel.socialLinks).some(Boolean) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect with Us</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.socialLinks.instagram && (
                    <a
                      href={hotel.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <PlatformIcon platform="Instagram" className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {hotel.socialLinks.tiktok && (
                    <a
                      href={hotel.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <PlatformIcon platform="TikTok" className="w-4 h-4" />
                      TikTok
                    </a>
                  )}
                  {hotel.socialLinks.facebook && (
                    <a
                      href={hotel.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <PlatformIcon platform="Facebook" className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {hotel.socialLinks.youtube && (
                    <a
                      href={hotel.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <PlatformIcon platform="YouTube" className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
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
          onClose()
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
