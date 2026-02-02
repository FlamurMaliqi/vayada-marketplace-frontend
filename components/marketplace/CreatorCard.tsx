import { useState } from 'react'
import Image from 'next/image'
import { Creator } from '@/lib/types'
import { Button, StarRating, PlatformIcon } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'
import { CreatorDetailModal } from './CreatorDetailModal'

interface CreatorCardProps {
  creator: Creator
  isPublic?: boolean
}

export function CreatorCard({ creator, isPublic = false }: CreatorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const totalFollowers = creator.platforms.reduce(
    (sum, platform) => sum + platform.followers,
    0
  )
  // Weighted average engagement rate (proportional to follower count)
  const avgEngagementRate = totalFollowers > 0
    ? creator.platforms.reduce((sum, platform) => sum + (platform.followers * (typeof platform.engagementRate === 'number' ? platform.engagementRate : 0)), 0) / totalFollowers
    : 0

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {creator.name}
                </h3>
                {creator.status === 'verified' && (
                  <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <CheckBadgeIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{creator.location}</span>
              </div>
              {/* Rating - replacing category section */}
              {creator.rating && (
                <div className="flex items-center">
                  <StarRating
                    rating={creator.rating.averageRating}
                    totalReviews={creator.rating.totalReviews}
                    size="sm"
                  />
                </div>
              )}
            </div>
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden relative">
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
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                  {creator.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-1">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                <span>Total Reach</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(totalFollowers)}
              </p>
            </div>
            <div>
              <div className="text-gray-600 text-xs mb-1">Engagement Rate</div>
              <p className="text-lg font-bold text-gray-900">
                {avgEngagementRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Platforms */}
          <div className="mb-4">
            <div className="text-gray-600 text-xs mb-2">Platforms</div>
            <div className="flex flex-wrap gap-2">
              {creator.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-white text-gray-700 text-xs rounded-md border border-gray-200"
                >
                  <PlatformIcon platform={platform.name} />
                  <span>{platform.name === 'YT' ? 'YouTube' : platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
          >
            View Profile
          </Button>
        </div>
      </div>
      <CreatorDetailModal
        creator={creator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPublic={isPublic}
      />
    </>
  )
}

