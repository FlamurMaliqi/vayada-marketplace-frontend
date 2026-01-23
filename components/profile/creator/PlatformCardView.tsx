'use client'

import type { ProfilePlatform } from '@/components/profile/types'
import { PlatformIcon, getPlatformGradient } from './PlatformIcon'
import { formatFollowersDE, getCountryFlag } from './utils'

interface PlatformCardViewProps {
  platform: ProfilePlatform
}

export function PlatformCardView({ platform }: PlatformCardViewProps) {
  const hasMetrics =
    (platform.topCountries && platform.topCountries.length > 0) ||
    (platform.topAgeGroups && platform.topAgeGroups.length > 0) ||
    platform.genderSplit

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Platform Header */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-white bg-gradient-to-br ${getPlatformGradient(platform.name)}`}>
          <PlatformIcon platform={platform.name} className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-lg">{platform.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-medium">{platform.handle}</span>
            <span className="text-gray-400">•</span>
            <span>{formatFollowersDE(platform.followers ?? 0)} Follower</span>
            <span className="text-gray-400">•</span>
            <span>{(platform.engagementRate ?? 0).toFixed(1).replace('.', ',')}% Engagement</span>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      {hasMetrics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Countries */}
          {platform.topCountries && platform.topCountries.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Top Countries</div>
              <ul className="space-y-2">
                {platform.topCountries.map((country, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-lg">{getCountryFlag(country.country)}</span>
                    <span className="text-sm text-gray-700">
                      {country.country}: <span className="font-semibold text-gray-900">{country.percentage}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Age Groups */}
          {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Top Age Groups</div>
              <ul className="space-y-2">
                {platform.topAgeGroups.map((ageGroup, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {ageGroup.ageRange}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gender Split */}
          {platform.genderSplit && (
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">Gender Split</div>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  Male: <span className="font-semibold text-gray-900">{platform.genderSplit.male}%</span>
                </div>
                <div className="text-sm text-gray-700">
                  Female: <span className="font-semibold text-gray-900">{platform.genderSplit.female}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No additional metrics available. Edit your profile to add platform metrics.
        </div>
      )}
    </div>
  )
}
