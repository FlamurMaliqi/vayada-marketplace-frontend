'use client'

import { useState, useEffect } from 'react'
import {
  FilterChip,
  MultiSelectDropdown,
  RangeSliderDropdown,
  SearchableCountrySelect,
} from '@/components/common'
import {
  PLATFORM_OPTIONS,
  FOLLOWERS_RANGE,
  ENGAGEMENT_RATE_RANGE,
} from '@/lib/constants'
import { formatFollowers, formatEngagementRate } from '@/lib/utils'

export interface CreatorFiltersState {
  minFollowers?: number
  minEngagementRate?: number
  creatorPlatforms?: string | string[]
  topCountries?: string | string[]
}

interface CreatorFiltersProps {
  filters: CreatorFiltersState
  onFiltersChange: (filters: CreatorFiltersState) => void
  onClearAll?: () => void
  showClearAll?: boolean
}

export function CreatorFilters({
  filters,
  onFiltersChange,
  onClearAll,
  showClearAll = true,
}: CreatorFiltersProps) {
  const [minFollowersValue, setMinFollowersValue] = useState(filters.minFollowers ?? FOLLOWERS_RANGE.min)
  const [minEngagementRateValue, setMinEngagementRateValue] = useState(filters.minEngagementRate ?? ENGAGEMENT_RATE_RANGE.min)

  useEffect(() => {
    if (filters.minFollowers !== undefined) setMinFollowersValue(filters.minFollowers)
  }, [filters.minFollowers])

  useEffect(() => {
    if (filters.minEngagementRate !== undefined) setMinEngagementRateValue(filters.minEngagementRate)
  }, [filters.minEngagementRate])

  // Helper to normalize string | string[] to string[]
  const toArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const selectedCreatorPlatforms = toArray(filters.creatorPlatforms)
  const selectedTopCountries = toArray(filters.topCountries)

  const createToggleHandler = (key: 'creatorPlatforms' | 'topCountries') => (value: string) => {
    const current = toArray(filters[key])
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    const newFilters = { ...filters }
    if (updated.length === 0) {
      delete newFilters[key]
    } else {
      newFilters[key] = updated
    }
    onFiltersChange(newFilters)
  }

  const handleMinFollowersChange = (value: number) => {
    setMinFollowersValue(value)
    const newFilters = { ...filters }
    if (value === FOLLOWERS_RANGE.min) {
      delete newFilters.minFollowers
    } else {
      newFilters.minFollowers = value
    }
    onFiltersChange(newFilters)
  }

  const handleMinEngagementRateChange = (value: number) => {
    setMinEngagementRateValue(value)
    const newFilters = { ...filters }
    if (value === ENGAGEMENT_RATE_RANGE.min) {
      delete newFilters.minEngagementRate
    } else {
      newFilters.minEngagementRate = value
    }
    onFiltersChange(newFilters)
  }

  const handleClearCountries = () => {
    const newFilters = { ...filters }
    delete newFilters.topCountries
    onFiltersChange(newFilters)
  }

  const handleClearAll = () => {
    onFiltersChange({})
    setMinFollowersValue(FOLLOWERS_RANGE.min)
    setMinEngagementRateValue(ENGAGEMENT_RATE_RANGE.min)
    onClearAll?.()
  }

  const hasFilters =
    selectedCreatorPlatforms.length > 0 ||
    selectedTopCountries.length > 0 ||
    (filters.minFollowers !== undefined && filters.minFollowers > FOLLOWERS_RANGE.min) ||
    (filters.minEngagementRate !== undefined && filters.minEngagementRate > ENGAGEMENT_RATE_RANGE.min)

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <RangeSliderDropdown
          label="Follower"
          title="Minimum Followers"
          min={FOLLOWERS_RANGE.min}
          max={FOLLOWERS_RANGE.max}
          step={FOLLOWERS_RANGE.step}
          value={minFollowersValue}
          defaultValue={FOLLOWERS_RANGE.min}
          onChange={handleMinFollowersChange}
          formatValue={(v) => (v > 0 ? `${formatFollowers(v)}+` : formatFollowers(v))}
          formatMin="0"
          formatMax="1M"
          showCurrentValue
        />

        <RangeSliderDropdown
          label="Engagement Rate"
          title="Minimum Engagement Rate"
          min={ENGAGEMENT_RATE_RANGE.min}
          max={ENGAGEMENT_RATE_RANGE.max}
          step={ENGAGEMENT_RATE_RANGE.step}
          value={minEngagementRateValue}
          defaultValue={ENGAGEMENT_RATE_RANGE.min}
          onChange={handleMinEngagementRateChange}
          formatValue={(v) => (v > 0 ? `${formatEngagementRate(v)}+` : formatEngagementRate(v))}
          formatMin="0%"
          formatMax="10%"
          showCurrentValue
        />

        <MultiSelectDropdown
          label="Platforms"
          title="Select Platforms"
          options={PLATFORM_OPTIONS}
          selected={selectedCreatorPlatforms}
          onToggle={createToggleHandler('creatorPlatforms')}
        />

        <SearchableCountrySelect
          selected={selectedTopCountries}
          onToggle={createToggleHandler('topCountries')}
          onClearAll={handleClearCountries}
        />

        {showClearAll && hasFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.minFollowers !== undefined && filters.minFollowers > FOLLOWERS_RANGE.min && (
            <FilterChip
              label={`Follower: ${formatFollowers(filters.minFollowers)}+`}
              onRemove={() => handleMinFollowersChange(FOLLOWERS_RANGE.min)}
            />
          )}
          {filters.minEngagementRate !== undefined && filters.minEngagementRate > ENGAGEMENT_RATE_RANGE.min && (
            <FilterChip
              label={`Engagement: ${formatEngagementRate(filters.minEngagementRate)}+`}
              onRemove={() => handleMinEngagementRateChange(ENGAGEMENT_RATE_RANGE.min)}
            />
          )}
          {selectedCreatorPlatforms.map((platform) => (
            <FilterChip
              key={platform}
              label={platform}
              onRemove={() => createToggleHandler('creatorPlatforms')(platform)}
            />
          ))}
          {selectedTopCountries.map((country) => (
            <FilterChip
              key={country}
              label={country}
              onRemove={() => createToggleHandler('topCountries')(country)}
            />
          ))}
        </div>
      )}
    </>
  )
}
