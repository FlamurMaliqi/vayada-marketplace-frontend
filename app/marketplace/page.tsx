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
    // Marketplace endpoints have been removed from backend
    // Backend only supports authentication endpoints
    console.warn('Marketplace endpoints are not available. Backend only supports authentication.')
    setHotels([])
    setCreators([])
    setLoading(false)
  }

  const hasNoData = !loading && hotels.length === 0 && creators.length === 0

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
      
      // Map filter values to data values
      const typeMap: Record<string, string[]> = {
        'Resort': ['Resort'],
        'Boutique': ['Boutique Hotel'],
        'Lodge': ['Lodge'],
        'Hostel': ['Hostel'],
        'Luxury': ['Resort', 'Boutique Hotel', 'Hotel'], // Luxury can be various types
        'City Hotel': ['Hotel', 'Boutique Hotel'],
      }
      
      // Get all possible accommodation types for selected filters
      const allowedTypes = selectedTypes.flatMap(type => typeMap[type] || [type])
      
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
      
      // Map English month names to German month names
      const monthMap: Record<string, string> = {
        'January': 'Januar',
        'February': 'Februar',
        'March': 'März',
        'April': 'April',
        'May': 'Mai',
        'June': 'Juni',
        'July': 'Juli',
        'August': 'August',
        'September': 'September',
        'October': 'Oktober',
        'November': 'November',
        'December': 'Dezember',
      }
      
      // Get all possible German month names for selected filters
      const germanMonths = selectedMonths.map(month => monthMap[month] || month)
      
      // Check if hotel's availability includes any of the selected months
      const hasAvailability = germanMonths.some(month => 
        hotel.availability?.includes(month)
      ) || selectedMonths.some(month => 
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

    // Creator-specific filters can be added here when needed
    // Currently, only hotel filters are implemented

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
    <main className="min-h-screen bg-white">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
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
        ) : hasNoData ? (
          <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
            <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketplace Unavailable</h3>
            <p className="text-gray-600 mb-4">
              The marketplace endpoints have been removed from the backend. The backend now only supports authentication endpoints.
            </p>
            <p className="text-sm text-gray-500">
              You can still register and login, but profile and marketplace features are not available.
            </p>
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

