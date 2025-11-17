'use client'

import { Input } from '@/components/ui'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption?: string
  onSortChange?: (sort: string) => void
  filters: {
    hotelType?: string
    offering?: string
    availability?: string
    budget?: string
  }
  onFiltersChange: (filters: {
    hotelType?: string
    offering?: string
    availability?: string
    budget?: string
  }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

// Filter options
const HOTEL_TYPES = [
  'All Hotel Types',
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Lodge',
  'Apartment',
  'Villa',
]

const OFFERINGS = [
  'All Offerings',
  'Free',
  'Paid',
]

const AVAILABILITY_OPTIONS = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const BUDGET_OPTIONS = [
  'All Budgets',
  'Free',
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000+',
]

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  sortOption = 'relevance',
  onSortChange,
  filters,
  onFiltersChange,
  viewType,
}: MarketplaceFiltersProps) {
  return (
    <div className="mb-8">
      {/* Search Bar and Sort - Same Line */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={viewType === 'hotels' 
              ? 'Search hotels by name or location...'
              : viewType === 'creators'
              ? 'Search creators by name or location...'
              : 'Hotels, Creator suchen...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 w-full"
          />
        </div>
        {onSortChange && (
          <div className="flex-shrink-0">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px]"
            >
              <option value="relevance">Relevance</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        )}
      </div>

    </div>
  )
}






