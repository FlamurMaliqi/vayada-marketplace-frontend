import Link from 'next/link'
import { Creator } from '@/lib/types'
import { Button } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface CreatorCardProps {
  creator: Creator
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const totalFollowers = creator.platforms.reduce(
    (sum, platform) => sum + platform.followers,
    0
  )
  const avgEngagementRate =
    creator.platforms.reduce((sum, platform) => sum + platform.engagementRate, 0) /
    creator.platforms.length

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {creator.name}
              </h3>
              {creator.status === 'verified' && (
                <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{creator.location}</span>
            </div>
          </div>
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {creator.name.charAt(0)}
          </div>
        </div>

        {/* Niche Tags */}
        {creator.niche && creator.niche.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {creator.niche.map((niche, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-medium"
              >
                {niche}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
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
              <span
                key={index}
                className="px-2 py-1 bg-white text-gray-700 text-xs rounded-md border border-gray-200"
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-4">
        <div className="flex gap-2">
          <Link href={`/creators/${creator.id}`} className="flex-1">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
            >
              View Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Send collaboration request
              console.log('Request collaboration with', creator.id)
            }}
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}

