'use client'

import { Collaboration, Hotel, Creator, UserType } from '@/lib/types'
import { Button, PlatformIcon } from '@/components/ui'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { CheckBadgeIcon, MapPinIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { formatNumber, formatDateShort, getTimeAgo } from '@/lib/utils'

interface CollaborationRejectedModalProps {
  isOpen: boolean
  onClose: () => void
  collaboration: (Collaboration & { hotel?: Hotel; creator?: Creator }) | null
  currentUserType: UserType
}

export function CollaborationRejectedModal({
  isOpen,
  onClose,
  collaboration,
  currentUserType,
}: CollaborationRejectedModalProps) {
  if (!isOpen || !collaboration) return null

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

  const otherParty = currentUserType === 'hotel' ? collaboration.creator : collaboration.hotel
  const otherPartyName = otherParty?.name || ''
  const otherPartyHandle = currentUserType === 'hotel' ? getHandle() : ''
  const otherPartyLocation = currentUserType === 'hotel' 
    ? collaboration.creator?.location || ''
    : collaboration.hotel?.location || ''

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
          <h3 className="text-xl font-bold text-gray-900">Collaboration Rejected</h3>
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
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{formatNumber(getTotalFollowers())} followers</span>
                  <span>•</span>
                  <span>{getAvgEngagement()}% engagement</span>
                  <span>•</span>
                  <span>Applied {getTimeAgo(collaboration.createdAt)}</span>
                </div>
              )}
              {otherPartyLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{otherPartyLocation}</span>
                </div>
              )}
              {/* Platform Badges */}
              {currentUserType === 'hotel' && collaboration.creator?.platforms && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {collaboration.creator.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      <PlatformIcon platform={platform.name} className="w-5 h-5" />
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

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <XCircleIcon className="w-4 h-4" />
              Rejected
            </span>
          </div>

          {/* Rejected Date */}
          <div className="text-sm text-gray-600">
            Rejected on {formatDateShort(collaboration.updatedAt)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

