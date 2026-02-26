import { useState } from 'react'
import Image from 'next/image'
import { Creator } from '@/lib/types'
import { Button, StarRating, PlatformIcon } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, UserGroupIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
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
          {/* Profile Picture - centered and larger */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-100">
                {creator.profilePicture && !imageError ? (
                  <Image
                    src={creator.profilePicture}
                    alt={creator.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
                    {creator.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Verification Badge - overlaid on profile picture */}
              {creator.status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center ring-2 ring-white">
                  <CheckBadgeIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name and Info - centered */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 truncate max-w-full" title={creator.name}>
              {creator.name}
            </h3>
            <div className="flex items-center justify-center text-gray-600 text-sm mt-1 mb-3">
              <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{creator.location}</span>
            </div>
            {/* Rating */}
            {creator.rating && (
              <div className="flex items-center justify-center">
                <StarRating
                  rating={creator.rating.averageRating}
                  totalReviews={creator.rating.totalReviews}
                  size="sm"
                />
              </div>
            )}
            {/* Creator Type Badge */}
            {creator.creatorType && (
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  creator.creatorType === 'Lifestyle'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {creator.creatorType === 'Lifestyle' ? (
                    <SparklesIcon className="w-3 h-3" />
                  ) : (
                    <PaperAirplaneIcon className="w-3 h-3" />
                  )}
                  <span>{creator.creatorType}</span>
                </span>
              </div>
            )}
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

