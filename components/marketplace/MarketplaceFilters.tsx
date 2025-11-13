'use client'

import { Input } from '@/components/ui'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: {
    location: string
    niche: string
  }
  onFiltersChange: (filters: { location: string; niche: string }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

const LOCATIONS = [
  'All Locations',
  'Bali, Indonesia',
  'Swiss Alps, Switzerland',
  'Tokyo, Japan',
  'Dubai, UAE',
  'Santorini, Greece',
  'Costa Rica',
]

const NICHES = [
  'All Niches',
  'Luxury Travel',
  'Beach Destinations',
  'Adventure Travel',
  'Mountain Sports',
  'City Travel',
  'Food & Culture',
  'Eco Travel',
  'Romantic Travel',
]

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  viewType,
}: MarketplaceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search hotels, creators, locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 w-full"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FunnelIcon className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {showFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
              Active
            </span>
          )}
        </button>
        {(filters.location || filters.niche) && (
          <button
            onClick={() => onFiltersChange({ location: '', niche: '' })}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  onFiltersChange({ ...filters, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {LOCATIONS.map((location) => (
                  <option key={location} value={location === 'All Locations' ? '' : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Niche Filter (only for creators) */}
            {(viewType === 'all' || viewType === 'creators') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche
                </label>
                <select
                  value={filters.niche}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, niche: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {NICHES.map((niche) => (
                    <option key={niche} value={niche === 'All Niches' ? '' : niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}





