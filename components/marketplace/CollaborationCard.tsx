import Link from 'next/link'
import { Collaboration, Hotel, Creator, CollaborationStatus } from '@/lib/types'
import { Button } from '@/components/ui'
import { 
  MapPinIcon, 
  CheckBadgeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface CollaborationCardProps {
  collaboration: Collaboration & {
    hotel?: Hotel
    creator?: Creator
  }
  onStatusUpdate?: (id: string, status: CollaborationStatus) => void
  currentUserType?: 'hotel' | 'creator'
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
  currentUserType 
}: CollaborationCardProps) {
  const statusInfo = statusConfig[collaboration.status]
  const StatusIcon = statusInfo.icon

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      {/* Status Badge */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusInfo.label}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{formatDate(collaboration.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Show only the "other party" based on user type */}
        {currentUserType === 'hotel' && collaboration.creator && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Collaborating With</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg">
                  {collaboration.creator.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 truncate text-lg">
                      {collaboration.creator.name}
                    </h4>
                    {collaboration.creator.status === 'verified' && (
                      <CheckBadgeIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="truncate">{collaboration.creator.location}</span>
                  </div>
                </div>
              </div>
              {collaboration.creator.platforms && collaboration.creator.platforms.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Total Reach</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(
                      collaboration.creator.platforms.reduce(
                        (sum, p) => sum + p.followers,
                        0
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link href={`/creators/${collaboration.creatorId}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Creator Profile
              </Button>
            </Link>
          </div>
        )}

        {currentUserType === 'creator' && collaboration.hotel && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Collaborating With</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg">
                  {collaboration.hotel.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 truncate text-lg">
                      {collaboration.hotel.name}
                    </h4>
                    {collaboration.hotel.status === 'verified' && (
                      <CheckBadgeIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="truncate">{collaboration.hotel.location}</span>
                  </div>
                </div>
              </div>
              {collaboration.hotel.description && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Description</div>
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {collaboration.hotel.description}
                  </div>
                </div>
              )}
            </div>
            <Link href={`/hotels/${collaboration.hotelId}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Hotel Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Actions */}
        {onStatusUpdate && collaboration.status === 'pending' && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-2">
            {currentUserType !== 'hotel' && collaboration.hotel && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => onStatusUpdate(collaboration.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onStatusUpdate(collaboration.id, 'rejected')}
                >
                  Reject
                </Button>
              </>
            )}
            {currentUserType === 'hotel' && collaboration.creator && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onStatusUpdate(collaboration.id, 'cancelled')}
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}

        {collaboration.status === 'accepted' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onStatusUpdate?.(collaboration.id, 'completed')}
            >
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

