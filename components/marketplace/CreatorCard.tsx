import { useState } from 'react'
import Image from 'next/image'
import { Creator } from '@/lib/types'
import { Button, StarRating, PlatformIcon } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, UserGroupIcon, SparklesIcon, PaperAirplaneIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
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
  const primaryPlatform = creator.platforms[0]
  const topCountries = Array.from(
    new Set(
      creator.platforms
        .flatMap((platform) => platform.topCountries?.slice(0, 2).map((country) => country.country) || [])
        .filter(Boolean)
    )
  ).slice(0, 3)

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-elevated">
        <div className="relative h-64 overflow-hidden bg-gray-950">
          {creator.profilePicture && !imageError ? (
            <Image
              src={creator.profilePicture}
              alt=""
              fill
              className="scale-110 object-cover opacity-75 blur-sm transition-transform duration-500 group-hover:scale-[1.16]"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-amber-900" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,32,0.24)_0%,rgba(8,17,32,0.46)_48%,rgba(8,17,32,0.90)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_100%)]" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
            {creator.creatorType && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                creator.creatorType === 'Lifestyle'
                  ? 'border-blue-200/70 bg-white/90 text-blue-700'
                  : 'border-amber-200/70 bg-white/90 text-amber-700'
              }`}>
                {creator.creatorType === 'Lifestyle' ? (
                  <SparklesIcon className="h-3.5 w-3.5" />
                ) : (
                  <PaperAirplaneIcon className="h-3.5 w-3.5" />
                )}
                <span>{creator.creatorType}</span>
              </span>
            )}

            {primaryPlatform && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-gray-800 shadow-sm backdrop-blur-md"
                title={primaryPlatform.name === 'YT' ? 'YouTube' : primaryPlatform.name}
              >
                <PlatformIcon platform={primaryPlatform.name} className="h-[18px] w-[18px]" />
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-end gap-4">
              <div className="relative flex-shrink-0">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl ring-1 ring-white/40">
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
                {creator.status === 'verified' && (
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 shadow-md ring-4 ring-white">
                    <CheckBadgeIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 pb-1 text-white">
                <h3 className="truncate text-2xl font-extrabold tracking-tight" title={creator.name}>
                  {creator.name}
                </h3>
                <div className="mt-1 flex items-center text-sm font-semibold text-white/80">
                  <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-white/65" />
                  <span className="truncate">{creator.location}</span>
                </div>
                {creator.rating && creator.rating.totalReviews > 0 && (
                  <div className="mt-2 rounded-full bg-white/90 px-2 py-1 text-gray-900">
                    <StarRating
                      rating={creator.rating.averageRating}
                      totalReviews={creator.rating.totalReviews}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5">
          <div className="grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50">
            <div className="min-w-0 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                <UserGroupIcon className="h-4 w-4 text-primary-500" />
                <span>Reach</span>
              </div>
              <p className="truncate text-2xl font-extrabold tracking-tight text-gray-950">
                {formatNumber(totalFollowers)}
              </p>
            </div>
            <div className="min-w-0 border-l border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                <ChartBarIcon className="h-4 w-4 text-primary-500" />
                <span>Engagement</span>
              </div>
              <p className="truncate text-2xl font-extrabold tracking-tight text-gray-950">
                {avgEngagementRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {topCountries.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Audience</div>
              <div className="flex flex-wrap gap-2">
                {topCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          <div className="mt-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Platforms</div>
            <div className="flex flex-wrap gap-2">
              {creator.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors group-hover:ring-primary-200"
                >
                  <PlatformIcon platform={platform.name} className="h-3.5 w-3.5 text-gray-500" />
                  <span>{platform.name === 'YT' ? 'YouTube' : platform.name}</span>
                </div>
              ))}
            </div>
          </div>

          {creator.shortDescription && (
            <p className="mt-5 line-clamp-2 text-sm font-medium leading-6 text-gray-600">
              {creator.shortDescription}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto border-t border-gray-100 bg-white p-5">
          <Button
            variant="primary"
            size="sm"
            className="w-full gap-2 py-3 shadow-glow transition-transform group-hover:bg-primary-700 active:scale-[0.98]"
            onClick={() => setIsModalOpen(true)}
          >
            <span>View Profile</span>
            <ArrowRightIcon className="h-4 w-4" />
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
