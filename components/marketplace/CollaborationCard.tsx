import { useState } from 'react'
import { Collaboration, Hotel, Creator, CollaborationStatus, UserType } from '@/lib/types'
import { Button } from '@/components/ui'
import { 
  CheckBadgeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'
import { CollaborationRatingModal } from './CollaborationRatingModal'

interface CollaborationCardProps {
  collaboration: Collaboration & {
    hotel?: Hotel
    creator?: Creator
  }
  onStatusUpdate?: (id: string, status: CollaborationStatus) => void
  onRatingSubmit?: (id: string, rating: number, comment: string) => void
  onViewDetails?: (collaboration: Collaboration & { hotel?: Hotel; creator?: Creator }) => void
  currentUserType?: UserType
}

const statusConfig: Record<CollaborationStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: XCircleIcon },
}

export function CollaborationCard({ 
  collaboration, 
  onStatusUpdate,
  onRatingSubmit,
  onViewDetails,
  currentUserType 
}: CollaborationCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const statusInfo = statusConfig[collaboration.status]
  const StatusIcon = statusInfo.icon

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (onRatingSubmit) {
      onRatingSubmit(collaboration.id, rating, comment)
    }
  }

  const shouldShowRatingPrompt = 
    currentUserType === 'hotel' &&
    collaboration.status === 'completed' &&
    !collaboration.hasRated

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - new Date(date).getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffWeeks === 1) return '1 week ago'
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
    // Mock message based on collaboration
    if (currentUserType === 'hotel' && collaboration.creator) {
      return "I absolutely love your property! I specialize in luxury travel content and would love to showcase your stunning rooms and amenities to my engaged audience. Let's create something amazing together!"
    }
    if (currentUserType === 'creator' && collaboration.hotel) {
      return "Your eco-friendly approach aligns perfectly with my content focus. I'd love to create authentic content highlighting your sustainability initiatives and unique experiences."
    }
    return "Looking forward to collaborating with you!"
  }

  const handleCardClick = () => {
    if (onViewDetails && collaboration.status === 'pending') {
      onViewDetails(collaboration)
    }
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 ${
        collaboration.status === 'pending' && onViewDetails ? 'cursor-pointer' : ''
      }`}
      onClick={collaboration.status === 'pending' && onViewDetails ? handleCardClick : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-2xl">
          {currentUserType === 'hotel' 
            ? collaboration.creator?.name.charAt(0) || ''
            : collaboration.hotel?.name.charAt(0) || ''
          }
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Handle */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {currentUserType === 'hotel' 
                  ? collaboration.creator?.name || ''
                  : collaboration.hotel?.name || ''
                }
              </h3>
              {(currentUserType === 'hotel' && collaboration.creator?.status === 'verified') ||
               (currentUserType === 'creator' && collaboration.hotel?.status === 'verified') ? (
                <CheckBadgeIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
              ) : null}
            </div>
            {currentUserType === 'hotel' && getHandle() && (
              <div className="text-sm text-gray-500">{getHandle()}</div>
            )}
          </div>

          {/* Stats */}
          {currentUserType === 'hotel' && collaboration.creator && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span>{formatNumber(getTotalFollowers())} followers</span>
              <span>•</span>
              <span>{getAvgEngagement()}% engagement</span>
              <span>•</span>
              <span>{formatDate(collaboration.createdAt)}</span>
            </div>
          )}

          {currentUserType === 'creator' && collaboration.hotel && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span>{formatDate(collaboration.createdAt)}</span>
            </div>
          )}

          {/* Message */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {getMessage()}
          </p>
        </div>

        {/* Action Buttons - Only for pending */}
        {onStatusUpdate && collaboration.status === 'pending' && (
          <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="primary"
              size="md"
              className="min-w-[100px]"
              onClick={() => onStatusUpdate(collaboration.id, 'accepted')}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="md"
              className="min-w-[100px]"
              onClick={() => onStatusUpdate(collaboration.id, 'rejected')}
            >
              Decline
            </Button>
          </div>
        )}

        {/* Rating Prompt for completed collaborations */}
        {shouldShowRatingPrompt && (
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 max-w-xs shadow-sm">
              <div className="flex items-start gap-2 mb-2">
                <StarIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Rate Your Experience
                  </p>
                  <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                    This collaboration is completed. Please rate your experience with a 1-5 star rating and share your feedback.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowRatingModal(true)}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <StarIcon className="w-4 h-4 mr-2" />
                Rate Now
              </Button>
            </div>
          </div>
        )}

        {/* Status badge for non-pending (when not showing rating prompt) */}
        {collaboration.status !== 'pending' && !shouldShowRatingPrompt && (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex-shrink-0`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusInfo.label}</span>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {collaboration.creator && (
        <CollaborationRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          creatorName={collaboration.creator.name}
        />
      )}
    </div>
  )
}

