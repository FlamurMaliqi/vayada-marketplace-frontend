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
    offering?: string | string[]
    availability?: string | string[]
    budget?: number
    minFollowers?: number
    minEngagementRate?: number
    creatorPlatforms?: string | string[]
    topCountries?: string | string[]
  }
  onFiltersChange: (filters: {
    hotelType?: string | string[]
    offering?: string | string[]
    availability?: string | string[]
    budget?: number
    minFollowers?: number
    minEngagementRate?: number
    creatorPlatforms?: string | string[]
    topCountries?: string | string[]
  }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

// Filter options
const HOTEL_TYPES = [
  'Hotel',
  'Boutiques Hotel',
  'City Hotel',
  'Luxury Hotel',
  'Apartment',
  'Villa',
  'Lodge',
]

const OFFERINGS = [
  'Free stay',
  'Paid stay',
  'Hybrid',
]

const AVAILABILITY_OPTIONS = [
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

const MONTH_ABBREVIATIONS: Record<string, string> = {
  'January': 'Jan',
  'February': 'Feb',
  'March': 'Mar',
  'April': 'Apr',
  'May': 'May',
  'June': 'Jun',
  'July': 'Jul',
  'August': 'Aug',
  'September': 'Sep',
  'October': 'Oct',
  'November': 'Nov',
  'December': 'Dec',
}

const BUDGET_OPTIONS = [
  'All Budgets',
  'Free',
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000+',
]

// Creator filter options
const CREATOR_PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
]

const COMMON_COUNTRIES = [
  'USA',
  'UK',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Switzerland',
  'Austria',
  'Belgium',
  'Canada',
  'Australia',
  'Japan',
  'South Korea',
  'Brazil',
  'Mexico',
  'India',
  'China',
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
  const [isOfferingOpen, setIsOfferingOpen] = useState(false)
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)
  const [budgetValue, setBudgetValue] = useState<number>(filters.budget || 500)
  const [isCreatorPlatformsOpen, setIsCreatorPlatformsOpen] = useState(false)
  const [isTopCountriesOpen, setIsTopCountriesOpen] = useState(false)
  const [isMinFollowersOpen, setIsMinFollowersOpen] = useState(false)
  const [isMinEngagementRateOpen, setIsMinEngagementRateOpen] = useState(false)
  const [minFollowersValue, setMinFollowersValue] = useState<number>(filters.minFollowers || 0)
  const [minEngagementRateValue, setMinEngagementRateValue] = useState<number>(filters.minEngagementRate || 0)
  const hotelTypeButtonRef = useRef<HTMLButtonElement>(null)
  const hotelTypeDropdownRef = useRef<HTMLDivElement>(null)
  const offeringButtonRef = useRef<HTMLButtonElement>(null)
  const offeringDropdownRef = useRef<HTMLDivElement>(null)
  const availabilityButtonRef = useRef<HTMLButtonElement>(null)
  const availabilityDropdownRef = useRef<HTMLDivElement>(null)
  const budgetButtonRef = useRef<HTMLButtonElement>(null)
  const budgetDropdownRef = useRef<HTMLDivElement>(null)
  const creatorPlatformsButtonRef = useRef<HTMLButtonElement>(null)
  const creatorPlatformsDropdownRef = useRef<HTMLDivElement>(null)
  const topCountriesButtonRef = useRef<HTMLButtonElement>(null)
  const topCountriesDropdownRef = useRef<HTMLDivElement>(null)
  const minFollowersButtonRef = useRef<HTMLButtonElement>(null)
  const minFollowersDropdownRef = useRef<HTMLDivElement>(null)
  const minEngagementRateButtonRef = useRef<HTMLButtonElement>(null)
  const minEngagementRateDropdownRef = useRef<HTMLDivElement>(null)

  // Get selected hotel types as array
  const selectedHotelTypes = Array.isArray(filters.hotelType) 
    ? filters.hotelType 
    : filters.hotelType 
      ? [filters.hotelType] 
      : []

  // Get selected offerings as array
  const selectedOfferings = Array.isArray(filters.offering) 
    ? filters.offering 
    : filters.offering 
      ? [filters.offering] 
      : []

  // Get selected availability months as array
  const selectedAvailability = Array.isArray(filters.availability) 
    ? filters.availability 
    : filters.availability 
      ? [filters.availability] 
      : []

  // Get selected creator platforms as array
  const selectedCreatorPlatforms = Array.isArray(filters.creatorPlatforms)
    ? filters.creatorPlatforms
    : filters.creatorPlatforms
      ? [filters.creatorPlatforms]
      : []

  // Get selected top countries as array
  const selectedTopCountries = Array.isArray(filters.topCountries)
    ? filters.topCountries
    : filters.topCountries
      ? [filters.topCountries]
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
      if (
        offeringDropdownRef.current &&
        offeringButtonRef.current &&
        !offeringDropdownRef.current.contains(event.target as Node) &&
        !offeringButtonRef.current.contains(event.target as Node)
      ) {
        setIsOfferingOpen(false)
      }
      if (
        availabilityDropdownRef.current &&
        availabilityButtonRef.current &&
        !availabilityDropdownRef.current.contains(event.target as Node) &&
        !availabilityButtonRef.current.contains(event.target as Node)
      ) {
        setIsAvailabilityOpen(false)
      }
      if (
        budgetDropdownRef.current &&
        budgetButtonRef.current &&
        !budgetDropdownRef.current.contains(event.target as Node) &&
        !budgetButtonRef.current.contains(event.target as Node)
      ) {
        setIsBudgetOpen(false)
      }
      if (
        creatorPlatformsDropdownRef.current &&
        creatorPlatformsButtonRef.current &&
        !creatorPlatformsDropdownRef.current.contains(event.target as Node) &&
        !creatorPlatformsButtonRef.current.contains(event.target as Node)
      ) {
        setIsCreatorPlatformsOpen(false)
      }
      if (
        topCountriesDropdownRef.current &&
        topCountriesButtonRef.current &&
        !topCountriesDropdownRef.current.contains(event.target as Node) &&
        !topCountriesButtonRef.current.contains(event.target as Node)
      ) {
        setIsTopCountriesOpen(false)
      }
      if (
        minFollowersDropdownRef.current &&
        minFollowersButtonRef.current &&
        !minFollowersDropdownRef.current.contains(event.target as Node) &&
        !minFollowersButtonRef.current.contains(event.target as Node)
      ) {
        setIsMinFollowersOpen(false)
      }
      if (
        minEngagementRateDropdownRef.current &&
        minEngagementRateButtonRef.current &&
        !minEngagementRateDropdownRef.current.contains(event.target as Node) &&
        !minEngagementRateButtonRef.current.contains(event.target as Node)
      ) {
        setIsMinEngagementRateOpen(false)
      }
    }

    if (isHotelTypeOpen || isOfferingOpen || isAvailabilityOpen || isBudgetOpen || isCreatorPlatformsOpen || isTopCountriesOpen || isMinFollowersOpen || isMinEngagementRateOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHotelTypeOpen, isOfferingOpen, isAvailabilityOpen, isBudgetOpen, isCreatorPlatformsOpen, isTopCountriesOpen, isMinFollowersOpen, isMinEngagementRateOpen])

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
    if (filters.budget !== undefined) {
      setBudgetValue(filters.budget)
    }
  }, [filters.budget])

  useEffect(() => {
    if (filters.minFollowers !== undefined) {
      setMinFollowersValue(filters.minFollowers)
    }
  }, [filters.minFollowers])

  useEffect(() => {
    if (filters.minEngagementRate !== undefined) {
      setMinEngagementRateValue(filters.minEngagementRate)
    }
  }, [filters.minEngagementRate])

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

  const handleOfferingToggle = (offering: string) => {
    const currentOfferings = selectedOfferings
    const newOfferings = currentOfferings.includes(offering)
      ? currentOfferings.filter(o => o !== offering)
      : [...currentOfferings, offering]
    
    const newFilters = { ...filters }
    if (newOfferings.length === 0) {
      delete newFilters.offering
    } else {
      newFilters.offering = newOfferings
    }
    onFiltersChange(newFilters)
  }

  const handleAvailabilityToggle = (month: string) => {
    const currentMonths = selectedAvailability
    const newMonths = currentMonths.includes(month)
      ? currentMonths.filter(m => m !== month)
      : [...currentMonths, month]
    
    const newFilters = { ...filters }
    if (newMonths.length === 0) {
      delete newFilters.availability
    } else {
      newFilters.availability = newMonths
    }
    onFiltersChange(newFilters)
  }

  const handleBudgetChange = (value: number) => {
    setBudgetValue(value)
    const newFilters = { ...filters }
    if (value === 500) {
      delete newFilters.budget
    } else {
      newFilters.budget = value
    }
    onFiltersChange(newFilters)
  }

  const formatBudget = (value: number) => {
    return `€${value.toLocaleString()}`
  }

  const formatFollowers = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const handleCreatorPlatformToggle = (platform: string) => {
    const currentPlatforms = selectedCreatorPlatforms
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform]
    
    const newFilters = { ...filters }
    if (newPlatforms.length === 0) {
      delete newFilters.creatorPlatforms
    } else {
      newFilters.creatorPlatforms = newPlatforms
    }
    onFiltersChange(newFilters)
  }

  const handleTopCountryToggle = (country: string) => {
    const currentCountries = selectedTopCountries
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter(c => c !== country)
      : [...currentCountries, country]
    
    const newFilters = { ...filters }
    if (newCountries.length === 0) {
      delete newFilters.topCountries
    } else {
      newFilters.topCountries = newCountries
    }
    onFiltersChange(newFilters)
  }

  const handleMinFollowersChange = (value: number) => {
    setMinFollowersValue(value)
    const newFilters = { ...filters }
    if (value === 0) {
      delete newFilters.minFollowers
    } else {
      newFilters.minFollowers = value
    }
    onFiltersChange(newFilters)
  }

  const handleMinEngagementRateChange = (value: number) => {
    setMinEngagementRateValue(value)
    const newFilters = { ...filters }
    if (value === 0) {
      delete newFilters.minEngagementRate
    } else {
      newFilters.minEngagementRate = value
    }
    onFiltersChange(newFilters)
  }

  const handleClearAll = () => {
    const newFilters = { ...filters }
    delete newFilters.hotelType
    delete newFilters.offering
    delete newFilters.availability
    delete newFilters.budget
    delete newFilters.minFollowers
    delete newFilters.minEngagementRate
    delete newFilters.creatorPlatforms
    delete newFilters.topCountries
    onFiltersChange(newFilters)
  }

  const hasAnyFilters = selectedHotelTypes.length > 0 || selectedOfferings.length > 0 || selectedAvailability.length > 0 || (filters.budget !== undefined && filters.budget > 500) || (filters.minFollowers !== undefined && filters.minFollowers > 0) || (filters.minEngagementRate !== undefined && filters.minEngagementRate > 0) || selectedCreatorPlatforms.length > 0 || selectedTopCountries.length > 0

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
        <>
        <div className="flex flex-wrap gap-2">
          {/* Hotel Type Filter - Multiselect */}
          <div className="relative">
            <button
              ref={hotelTypeButtonRef}
              onClick={() => setIsHotelTypeOpen(!isHotelTypeOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Hotel Type
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

          {/* Offering Filter - Multiselect */}
          <div className="relative">
            <button
              ref={offeringButtonRef}
              onClick={() => setIsOfferingOpen(!isOfferingOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Offering
            </button>
            {isOfferingOpen && (
              <div
                ref={offeringDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[220px] overflow-hidden"
              >
                <div className="px-5 py-2.5 text-gray-900 text-sm">
                  Select Offerings
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {OFFERINGS.map((offering) => {
                    const isSelected = selectedOfferings.includes(offering)
                    return (
                      <label
                        key={offering}
                        className="flex items-center px-5 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          handleOfferingToggle(offering)
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
                        <span className="ml-3 text-sm text-gray-900">{offering}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Availability Filter - Grid */}
          <div className="relative">
            <button
              ref={availabilityButtonRef}
              onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Availability
            </button>
            {isAvailabilityOpen && (
              <div
                ref={availabilityDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[280px] overflow-hidden"
              >
                <div className="px-5 py-2.5 text-gray-900 text-sm font-bold">
                  Select Months
                </div>
                <div className="px-5 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABILITY_OPTIONS.map((month) => {
                      const isSelected = selectedAvailability.includes(month)
                      return (
                        <button
                          key={month}
                          onClick={() => handleAvailabilityToggle(month)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {MONTH_ABBREVIATIONS[month]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Filter - Slider */}
          <div className="relative">
            <button
              ref={budgetButtonRef}
              onClick={() => setIsBudgetOpen(!isBudgetOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Budget
            </button>
            {isBudgetOpen && (
              <div
                ref={budgetDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[320px] overflow-hidden"
              >
                <div className="px-5 py-3 text-gray-900 text-sm font-bold text-center">
                  Budget Range (Paid/Hybrid)
                </div>
                <div className="px-5 pb-5">
                  <div className="relative">
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="100"
                      value={budgetValue}
                      onChange={(e) => handleBudgetChange(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer budget-slider"
                      style={{
                        background: `linear-gradient(to right, rgb(14, 165, 233) 0%, rgb(14, 165, 233) ${((budgetValue - 500) / (10000 - 500)) * 100}%, rgb(229, 231, 235) ${((budgetValue - 500) / (10000 - 500)) * 100}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-gray-700">
                    <span>€500</span>
                    <span>€10,000</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {hasAnyFilters && (
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

        {/* Selected Filter Chips */}
        {hasAnyFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Hotel Type Chips */}
            {selectedHotelTypes.map((type) => (
              <div
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
              >
                <span>{type}</span>
                <button
                  onClick={() => handleHotelTypeToggle(type)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label={`Remove ${type}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Offering Chips */}
            {selectedOfferings.map((offering) => (
              <div
                key={offering}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
              >
                <span>{offering}</span>
                <button
                  onClick={() => handleOfferingToggle(offering)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label={`Remove ${offering}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Availability Chips */}
            {selectedAvailability.map((month) => (
              <div
                key={month}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
              >
                <span>{MONTH_ABBREVIATIONS[month]}</span>
                <button
                  onClick={() => handleAvailabilityToggle(month)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label={`Remove ${month}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Budget Chip */}
            {filters.budget !== undefined && filters.budget > 500 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                <span>{formatBudget(filters.budget)}</span>
                <button
                  onClick={() => handleBudgetChange(500)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Remove budget"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        </>
      )}

      {/* Creator Filters - Only show when viewing creators */}
      {(viewType === 'all' || viewType === 'creators') && (
        <>
        <div className="flex flex-wrap gap-2">
          {/* Minimum Followers Filter - Slider */}
          <div className="relative">
            <button
              ref={minFollowersButtonRef}
              onClick={() => setIsMinFollowersOpen(!isMinFollowersOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              {filters.minFollowers && filters.minFollowers > 0
                ? `Follower: ${formatFollowers(filters.minFollowers)}+`
                : 'Follower'}
            </button>
            {isMinFollowersOpen && (
              <div
                ref={minFollowersDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[320px] overflow-hidden"
              >
                <div className="px-5 py-3 text-gray-900 text-sm font-bold text-center">
                  Minimum Followers
                </div>
                <div className="px-5 pb-5">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={minFollowersValue}
                      onChange={(e) => handleMinFollowersChange(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(14, 165, 233) 0%, rgb(14, 165, 233) ${(minFollowersValue / 10000000) * 100}%, rgb(229, 231, 235) ${(minFollowersValue / 10000000) * 100}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-gray-700">
                    <span>0</span>
                    <span className="font-medium">{formatFollowers(minFollowersValue)}</span>
                    <span>10M</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Minimum Engagement Rate Filter - Slider */}
          <div className="relative">
            <button
              ref={minEngagementRateButtonRef}
              onClick={() => setIsMinEngagementRateOpen(!isMinEngagementRateOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              {filters.minEngagementRate && filters.minEngagementRate > 0
                ? `Engagement: ${filters.minEngagementRate.toFixed(1)}%+`
                : 'Engagement Rate'}
            </button>
            {isMinEngagementRateOpen && (
              <div
                ref={minEngagementRateDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[320px] overflow-hidden"
              >
                <div className="px-5 py-3 text-gray-900 text-sm font-bold text-center">
                  Minimum Engagement Rate
                </div>
                <div className="px-5 pb-5">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={minEngagementRateValue}
                      onChange={(e) => handleMinEngagementRateChange(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(14, 165, 233) 0%, rgb(14, 165, 233) ${(minEngagementRateValue / 10) * 100}%, rgb(229, 231, 235) ${(minEngagementRateValue / 10) * 100}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-gray-700">
                    <span>0%</span>
                    <span className="font-medium">{minEngagementRateValue.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Platforms Filter - Multiselect */}
          <div className="relative">
            <button
              ref={creatorPlatformsButtonRef}
              onClick={() => setIsCreatorPlatformsOpen(!isCreatorPlatformsOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Platforms
            </button>
            {isCreatorPlatformsOpen && (
              <div
                ref={creatorPlatformsDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[220px] overflow-hidden"
              >
                <div className="px-5 py-2.5 text-gray-900 text-sm">
                  Select Platforms
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {CREATOR_PLATFORMS.map((platform) => {
                    const isSelected = selectedCreatorPlatforms.includes(platform)
                    return (
                      <label
                        key={platform}
                        className="flex items-center px-5 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCreatorPlatformToggle(platform)
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
                        <span className="ml-3 text-sm text-gray-900">{platform}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Countries Filter - Multiselect */}
          <div className="relative">
            <button
              ref={topCountriesButtonRef}
              onClick={() => setIsTopCountriesOpen(!isTopCountriesOpen)}
              className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              Top Countries
            </button>
            {isTopCountriesOpen && (
              <div
                ref={topCountriesDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[220px] max-h-96 overflow-hidden"
              >
                <div className="px-5 py-2.5 text-gray-900 text-sm">
                  Select Countries
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {COMMON_COUNTRIES.map((country) => {
                    const isSelected = selectedTopCountries.includes(country)
                    return (
                      <label
                        key={country}
                        className="flex items-center px-5 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          handleTopCountryToggle(country)
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
                        <span className="ml-3 text-sm text-gray-900">{country}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Creator Filter Chips */}
        {(selectedCreatorPlatforms.length > 0 || selectedTopCountries.length > 0 || (filters.minFollowers !== undefined && filters.minFollowers > 0) || (filters.minEngagementRate !== undefined && filters.minEngagementRate > 0)) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Min Followers Chip */}
            {filters.minFollowers !== undefined && filters.minFollowers > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                <span>Follower: {formatFollowers(filters.minFollowers)}+</span>
                <button
                  onClick={() => handleMinFollowersChange(0)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Remove minimum followers"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Min Engagement Rate Chip */}
            {filters.minEngagementRate !== undefined && filters.minEngagementRate > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                <span>Engagement: {filters.minEngagementRate.toFixed(1)}%+</span>
                <button
                  onClick={() => handleMinEngagementRateChange(0)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Remove minimum engagement rate"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Creator Platforms Chips */}
            {selectedCreatorPlatforms.map((platform) => (
              <div
                key={platform}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
              >
                <span>{platform}</span>
                <button
                  onClick={() => handleCreatorPlatformToggle(platform)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label={`Remove ${platform}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Top Countries Chips */}
            {selectedTopCountries.map((country) => (
              <div
                key={country}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
              >
                <span>{country}</span>
                <button
                  onClick={() => handleTopCountryToggle(country)}
                  className="hover:text-gray-900 transition-colors"
                  aria-label={`Remove ${country}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        </>
      )}
    </div>
  )
}






