'use client'

import { useRef, useEffect, useState } from 'react'
import { Input } from '@/components/ui'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption?: string
  onSortChange?: (sort: string) => void
  filters: {
    hotelType?: string | string[]
    offering?: string
    availability?: string
    budget?: string
  }
  onFiltersChange: (filters: {
    hotelType?: string | string[]
    offering?: string
    availability?: string
    budget?: string
  }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

// Filter options
const HOTEL_TYPES = [
  'Resort',
  'Boutique',
  'Lodge',
  'Hostel',
  'Luxury',
  'City Hotel',
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
  const [isHotelTypeOpen, setIsHotelTypeOpen] = useState(false)
  const hotelTypeButtonRef = useRef<HTMLButtonElement>(null)
  const hotelTypeDropdownRef = useRef<HTMLDivElement>(null)
  const offeringRef = useRef<HTMLSelectElement>(null)
  const availabilityRef = useRef<HTMLSelectElement>(null)
  const budgetRef = useRef<HTMLSelectElement>(null)

  // Get selected hotel types as array
  const selectedHotelTypes = Array.isArray(filters.hotelType) 
    ? filters.hotelType 
    : filters.hotelType 
      ? [filters.hotelType] 
      : []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hotelTypeDropdownRef.current &&
        hotelTypeButtonRef.current &&
        !hotelTypeDropdownRef.current.contains(event.target as Node) &&
        !hotelTypeButtonRef.current.contains(event.target as Node)
      ) {
        setIsHotelTypeOpen(false)
      }
    }

    if (isHotelTypeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHotelTypeOpen])

  const adjustSelectWidth = (ref: React.RefObject<HTMLSelectElement>) => {
    if (ref.current) {
      const select = ref.current
      const selectedOption = select.options[select.selectedIndex]
      const text = selectedOption?.text || select.options[0]?.text || ''
      
      // Create a temporary span to measure text width
      const tempSpan = document.createElement('span')
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.fontSize = window.getComputedStyle(select).fontSize
      tempSpan.style.fontFamily = window.getComputedStyle(select).fontFamily
      tempSpan.style.fontWeight = window.getComputedStyle(select).fontWeight
      tempSpan.textContent = text
      document.body.appendChild(tempSpan)
      
      const textWidth = tempSpan.offsetWidth
      document.body.removeChild(tempSpan)
      
      // Set width: text width + padding (px-3 = 12px each side = 24px)
      select.style.width = `${Math.max(textWidth + 24, 80)}px`
    }
  }

  useEffect(() => {
    adjustSelectWidth(offeringRef)
    adjustSelectWidth(availabilityRef)
    adjustSelectWidth(budgetRef)
  }, [filters])

  const handleHotelTypeToggle = (hotelType: string) => {
    const currentTypes = selectedHotelTypes
    const newTypes = currentTypes.includes(hotelType)
      ? currentTypes.filter(t => t !== hotelType)
      : [...currentTypes, hotelType]
    
    const newFilters = { ...filters }
    if (newTypes.length === 0) {
      delete newFilters.hotelType
    } else {
      newFilters.hotelType = newTypes
    }
    onFiltersChange(newFilters)
  }

  const handleFilterChange = (key: 'offering' | 'availability' | 'budget', value: string) => {
    const newFilters = { ...filters }
    if (!value || value === 'All Offerings' || value === 'All Months' || value === 'All Budgets') {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    onFiltersChange(newFilters)
  }

  const getHotelTypeDisplayText = () => {
    if (selectedHotelTypes.length === 0) return 'Hotel Type'
    if (selectedHotelTypes.length === 1) return selectedHotelTypes[0]
    return `${selectedHotelTypes.length} selected`
  }

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

      {/* Filter Options - Beneath Search Bar */}
      {(viewType === 'all' || viewType === 'hotels') && (
        <div className="flex flex-wrap gap-2">
          {/* Hotel Type Filter - Multiselect */}
          <div className="relative">
            <button
              ref={hotelTypeButtonRef}
              onClick={() => setIsHotelTypeOpen(!isHotelTypeOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              {getHotelTypeDisplayText()}
            </button>
            {isHotelTypeOpen && (
              <div
                ref={hotelTypeDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[220px] overflow-hidden"
              >
                <div className="px-5 py-2.5 text-gray-900 text-sm">
                  Select Hotel Types
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {HOTEL_TYPES.map((type) => {
                    const isSelected = selectedHotelTypes.includes(type)
                    return (
                      <label
                        key={type}
                        className="flex items-center px-5 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          handleHotelTypeToggle(type)
                        }}
                      >
                        <div className="relative flex items-center justify-center">
                          {isSelected ? (
                            <div className="w-4 h-4 bg-primary-600 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-primary-400 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="ml-3 text-sm text-gray-900">{type}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Offering Filter */}
          <select
            ref={offeringRef}
            value={filters.offering || ''}
            onChange={(e) => {
              handleFilterChange('offering', e.target.value)
              setTimeout(() => adjustSelectWidth(offeringRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Offering</option>
            {OFFERINGS.slice(1).map((offering) => (
              <option key={offering} value={offering}>
                {offering}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            ref={availabilityRef}
            value={filters.availability || ''}
            onChange={(e) => {
              handleFilterChange('availability', e.target.value)
              setTimeout(() => adjustSelectWidth(availabilityRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Availability</option>
            {AVAILABILITY_OPTIONS.slice(1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Budget Filter */}
          <select
            ref={budgetRef}
            value={filters.budget || ''}
            onChange={(e) => {
              handleFilterChange('budget', e.target.value)
              setTimeout(() => adjustSelectWidth(budgetRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Budget</option>
            {BUDGET_OPTIONS.slice(1).map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}






