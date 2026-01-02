'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { HotelCard } from '@/components/marketplace/HotelCard'
import { CreatorCard } from '@/components/marketplace/CreatorCard'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel, Creator, UserType } from '@/lib/types'
import { hotelService } from '@/services/api/hotels'
import { creatorService } from '@/services/api/creators'
import { ApiErrorResponse } from '@/services/api/client'

export default function MarketplacePage() {
  const { isCollapsed } = useSidebar()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<string>('relevance')
  const [filters, setFilters] = useState<{
    hotelType?: string | string[]
    offering?: string | string[]
    availability?: string | string[]
    budget?: number
    minFollowers?: number
    minEngagementRate?: number
    creatorPlatforms?: string | string[]
    topCountries?: string | string[]
  }>({})
  // Get userType from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null
      setUserType(storedUserType)
    }
  }, [])

  useEffect(() => {
    if (userType) {
      loadData()
    }
  }, [filters, userType])

  const loadData = async () => {
    if (!userType) return
    
    setLoading(true)
    try {
      // Load hotels if user is creator
      if (userType === 'creator') {
        const hotelsResponse = await hotelService.getAll()
        setHotels(hotelsResponse.data)
      } else {
        setHotels([])
      }

      // Load creators if user is hotel
      if (userType === 'hotel') {
        const creatorsResponse = await creatorService.getAll()
        setCreators(creatorsResponse.data)
      } else {
        setCreators([])
      }
    } catch (error) {
      console.error('Error loading marketplace data:', error)
      // Set empty arrays on error
      setHotels([])
      setCreators([])
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        hotel.name.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        hotel.description.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Hotel type filter (multiselect)
    if (filters.hotelType) {
      const selectedTypes = Array.isArray(filters.hotelType) 
        ? filters.hotelType 
        : [filters.hotelType]
      
      // Filter values now match data values exactly, so we can use them directly
      const allowedTypes = selectedTypes
      
      // Check if hotel's accommodation type matches any of the allowed types
      if (!hotel.accommodationType || !allowedTypes.includes(hotel.accommodationType)) {
      return false
      }
    }

    // Offering filter (multiselect)
    if (filters.offering) {
      const selectedOfferings = Array.isArray(filters.offering) 
        ? filters.offering 
        : [filters.offering]
      
      // Map filter values to data values
      const offeringMap: Record<string, string[]> = {
        'Free stay': ['Kostenlos'],
        'Paid stay': ['Bezahlt'],
        'Hybrid': ['Kostenlos', 'Bezahlt'], // Hybrid can be either
      }
      
      // Get all possible collaboration types for selected filters
      const allowedTypes = selectedOfferings.flatMap(offering => offeringMap[offering] || [])
      
      // Check if hotel's collaboration type matches any of the allowed types
      if (!hotel.collaborationType || !allowedTypes.includes(hotel.collaborationType)) {
        return false
      }
    }

    // Availability filter (multiselect)
    if (filters.availability && hotel.availability) {
      const selectedMonths = Array.isArray(filters.availability) 
        ? filters.availability 
        : [filters.availability]
      
      // Backend returns months in English, so we can check directly
      // Check if hotel's availability includes any of the selected months
      const hasAvailability = selectedMonths.some(month => 
        hotel.availability?.includes(month)
      )
      
      if (!hasAvailability) return false
    }

    // Budget filter (placeholder - will be implemented based on discussion)
    // if (filters.budget) {
    //   // Budget filtering logic to be added
    // }

    return true
  })

  const filteredCreators = creators.filter((creator) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        creator.name.toLowerCase().includes(query) ||
        creator.location.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Minimum Followers filter
    if (filters.minFollowers) {
      if (creator.audienceSize < filters.minFollowers) {
        return false
      }
    }

    // Minimum Engagement Rate filter
    if (filters.minEngagementRate) {
      const avgEngagementRate = creator.platforms.length > 0
        ? creator.platforms.reduce((sum, platform) => sum + (platform.engagementRate || 0), 0) / creator.platforms.length
        : 0
      if (avgEngagementRate < filters.minEngagementRate) {
        return false
      }
    }

    // Platforms filter (multiselect)
    if (filters.creatorPlatforms) {
      const selectedPlatforms = Array.isArray(filters.creatorPlatforms)
        ? filters.creatorPlatforms
        : [filters.creatorPlatforms]
      
      const creatorPlatformNames = creator.platforms.map(p => p.name)
      const hasMatchingPlatform = selectedPlatforms.some(platform =>
        creatorPlatformNames.includes(platform)
      )
      
      if (!hasMatchingPlatform) return false
    }

    // Top Countries filter (multiselect)
    if (filters.topCountries) {
      const selectedCountries = Array.isArray(filters.topCountries)
        ? filters.topCountries
        : [filters.topCountries]
      
      // Check if any platform has any of the selected countries in topCountries
      const hasMatchingCountry = creator.platforms.some(platform => {
        if (!platform.topCountries || platform.topCountries.length === 0) return false
        return platform.topCountries.some(countryData =>
          selectedCountries.includes(countryData.country)
        )
      })
      
      if (!hasMatchingCountry) return false
    }

    return true
  })

  // Sort function
  const sortItems = <T extends Hotel | Creator>(items: T[]): T[] => {
    const sorted = [...items]
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'relevance':
      default:
        return sorted // Keep original order for relevance
    }
  }

  const sortedHotels = sortItems(filteredHotels)
  const sortedCreators = sortItems(filteredCreators)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto pt-4 pb-8" style={{ paddingLeft: 'clamp(0.5rem, 3%, 3rem)', paddingRight: '2rem' }}>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Marketplace
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Explore Collaborations opportunities
            </p>
          </div>
        </div>


        {/* Filters */}
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filters={filters}
          onFiltersChange={setFilters}
          viewType={userType === 'creator' ? 'hotels' : userType === 'hotel' ? 'creators' : 'all'}
        />

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Hotels Section - Only show if user is creator */}
            {userType === 'creator' && (
              <div className="mb-12">
                {sortedHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                    <p className="text-gray-500 text-lg">Keine Hotels gefunden, die Ihren Kriterien entsprechen.</p>
                  </div>
                )}
              </div>
            )}

            {/* Creators Section - Only show if user is hotel */}
            {userType === 'hotel' && (
              <div>
                {sortedCreators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCreators.map((creator) => (
                      <CreatorCard key={creator.id} creator={creator} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                    <p className="text-gray-500 text-lg">Keine Creator gefunden, die Ihren Kriterien entsprechen.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </div>
      </div>

    </main>
  )
}

