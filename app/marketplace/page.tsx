'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { HotelCard } from '@/components/marketplace/HotelCard'
import { CreatorCard } from '@/components/marketplace/CreatorCard'
import { Button } from '@/components/ui'
// Removed API imports - using mock data only for frontend design
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel, Creator } from '@/lib/types'

type ViewType = 'all' | 'hotels' | 'creators'

export default function MarketplacePage() {
  const { isCollapsed } = useSidebar()
  const [viewType, setViewType] = useState<ViewType>('all')
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

  useEffect(() => {
    loadData()
  }, [filters, viewType])

  const loadData = async () => {
    setLoading(true)
    // Use mock data directly for frontend design
    setTimeout(() => {
      if (viewType === 'all' || viewType === 'hotels') {
        setHotels(getMockHotels())
      }
      
      if (viewType === 'all' || viewType === 'creators') {
        setCreators(getMockCreators())
      }
      setLoading(false)
    }, 300)
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

        {/* View Toggle */}
        <div className="mb-6 flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/50 w-fit">
          <button
            onClick={() => setViewType('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              viewType === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setViewType('hotels')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              viewType === 'hotels'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => setViewType('creators')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              viewType === 'creators'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Creator
          </button>
        </div>

        {/* Filters */}
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filters={filters}
          onFiltersChange={setFilters}
          viewType={viewType}
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
            {/* Hotels Section */}
            {(viewType === 'all' || viewType === 'hotels') && (
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

            {/* Divider between Hotels and Creators */}
            {viewType === 'all' && sortedHotels.length > 0 && sortedCreators.length > 0 && (
              <div className="my-12 border-t border-gray-200"></div>
            )}

            {/* Creators Section */}
            {(viewType === 'all' || viewType === 'creators') && (
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

// Mock data for development
function getMockHotels(): Hotel[] {
  return [
    {
      id: '1',
      hotelProfileId: 'profile-1',
      name: 'Sunset Beach Villa',
      location: 'Bali, Indonesia',
      description: 'Luxuriöse Strandvilla mit atemberaubendem Meerblick und erstklassigen Annehmlichkeiten.',
      images: ['/hotel1.jpg'],
      accommodationType: 'Villa',
      collaborationType: 'Kostenlos',
      availability: ['Juni', 'Juli', 'August', 'September'],
      platforms: ['Instagram', 'TikTok'],
      domain: 'sunsetbeachvilla.com',
      boardType: 'Bed & Breakfast',
      numberOfNights: 3,
      targetAudience: ['Asia', 'Australia'],
      minFollowers: 10000,
      socialLinks: {
        instagram: 'https://instagram.com/sunsetbeachvilla',
        tiktok: 'https://tiktok.com/@sunsetbeachvilla',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      hotelProfileId: 'profile-1',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      description: 'Gemütliche Alpenlodge perfekt für Abenteuerlustige und Naturliebhaber.',
      images: ['/hotel2.jpg'],
      accommodationType: 'Lodge',
      collaborationType: 'Bezahlt',
      availability: ['Dezember', 'Januar', 'Februar', 'März'],
      platforms: ['Instagram', 'Facebook'],
      domain: 'mountainviewlodge.ch',
      boardType: 'Half Board',
      numberOfNights: 2,
      targetAudience: ['Europe', 'North America'],
      minFollowers: 25000,
      socialLinks: {
        instagram: 'https://instagram.com/mountainviewlodge',
        facebook: 'https://facebook.com/mountainviewlodge',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      hotelProfileId: 'profile-2',
      name: 'Urban Boutique Hotel',
      location: 'Tokyo, Japan',
      description: 'Modernes Boutique-Hotel im Herzen von Tokyo mit minimalistischem Design.',
      images: ['/hotel3.jpg'],
      accommodationType: 'Boutique Hotel',
      collaborationType: 'Kostenlos',
      availability: ['März', 'April', 'Mai', 'Juni'],
      platforms: ['Instagram', 'TikTok', 'YouTube'],
      domain: 'urbanboutique.jp',
      boardType: 'Bed & Breakfast',
      numberOfNights: 4,
      targetAudience: ['Asia', 'Australia'],
      minFollowers: 15000,
      socialLinks: {
        instagram: 'https://instagram.com/urbanboutique',
        tiktok: 'https://tiktok.com/@urbanboutique',
        youtube: 'https://youtube.com/@urbanboutique',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      hotelProfileId: 'profile-2',
      name: 'Desert Oasis Resort',
      location: 'Dubai, UAE',
      description: 'Luxuriöses Wüstenresort mit traditioneller Architektur und modernem Komfort.',
      images: ['/hotel4.jpg'],
      accommodationType: 'Resort',
      collaborationType: 'Bezahlt',
      availability: ['Oktober', 'November', 'Dezember', 'Januar'],
      platforms: ['Instagram', 'Facebook', 'YouTube'],
      domain: 'desertoasisresort.ae',
      boardType: 'All Inclusive',
      numberOfNights: 5,
      targetAudience: ['Middle East', 'Asia', 'Europe'],
      minFollowers: 30000,
      socialLinks: {
        instagram: 'https://instagram.com/desertoasisresort',
        facebook: 'https://facebook.com/desertoasisresort',
        youtube: 'https://youtube.com/@desertoasisresort',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      hotelProfileId: 'profile-3',
      name: 'Santorini Blue Suites',
      location: 'Santorini, Greece',
      description: 'Iconic white-washed suites perched on volcanic cliffs with stunning sunset views. Experience the magic of Santorini from your private infinity pool overlooking the Aegean Sea.',
      images: ['/hotel5.jpg'],
      accommodationType: 'Hotel',
      collaborationType: 'Kostenlos',
      availability: ['Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober'],
      platforms: ['Instagram', 'TikTok'],
      domain: 'santoriniblue.gr',
      boardType: 'Room Only',
      numberOfNights: 3,
      targetAudience: ['North America', 'Australia'],
      minFollowers: 50000,
      socialLinks: {
        instagram: 'https://instagram.com/santoriniblue',
        tiktok: 'https://tiktok.com/@santoriniblue',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      hotelProfileId: 'profile-3',
      name: 'Jungle Eco-Lodge',
      location: 'Costa Rica',
      description: 'Nachhaltige Öko-Lodge umgeben von tropischem Regenwald und Wildtieren.',
      images: ['/hotel6.jpg'],
      accommodationType: 'Lodge',
      collaborationType: 'Kostenlos',
      availability: ['Januar', 'Februar', 'März', 'April', 'Mai'],
      platforms: ['Instagram', 'YouTube'],
      domain: 'jungleecolodge.cr',
      boardType: 'Full Board',
      numberOfNights: 3,
      targetAudience: ['North America', 'South America', 'Europe'],
      minFollowers: 20000,
      socialLinks: {
        instagram: 'https://instagram.com/jungleecolodge',
        youtube: 'https://youtube.com/@jungleecolodge',
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

function getMockCreators(): Creator[] {
  const now = new Date()
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  return [
    {
      id: '1',
      name: 'Sarah Travels',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@sarahtravels', 
          followers: 125000, 
          engagementRate: 4.2,
          topCountries: [
            { country: 'Indonesia', percentage: 35 },
            { country: 'Australia', percentage: 22 },
            { country: 'Singapore', percentage: 15 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 48 },
            { ageRange: '18-24', percentage: 28 },
          ],
          genderSplit: { male: 45, female: 55 },
        },
        { 
          name: 'YouTube', 
          handle: '@sarahtravels', 
          followers: 45000, 
          engagementRate: 6.8,
          topCountries: [
            { country: 'Australia', percentage: 28 },
            { country: 'United States', percentage: 20 },
            { country: 'United Kingdom', percentage: 14 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 42 },
            { ageRange: '35-44', percentage: 31 },
          ],
          genderSplit: { male: 52, female: 48 },
        },
      ],
      audienceSize: 170000,
      location: 'Bali, Indonesia',
      portfolioLink: 'https://sarahtravels.com',
      rating: {
        averageRating: 4.8,
        totalReviews: 12,
        reviews: [
          {
            id: 'r1',
            hotelId: 'h1',
            hotelName: 'Sunset Beach Villa',
            rating: 5,
            comment: 'Excellent collaboration! Sarah delivered high-quality content and was very professional throughout the process.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r2',
            hotelId: 'h2',
            hotelName: 'Mountain View Lodge',
            rating: 5,
            comment: 'Amazing content creator. The photos and videos exceeded our expectations.',
            createdAt: twoMonthsAgo,
          },
          {
            id: 'r3',
            hotelId: 'h3',
            hotelName: 'Urban Boutique Hotel',
            rating: 4,
            comment: 'Great collaboration, very responsive and delivered on time.',
            createdAt: threeMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Adventure Mike',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@adventuremike', 
          followers: 89000, 
          engagementRate: 5.1,
          topCountries: [
            { country: 'Germany', percentage: 32 },
            { country: 'Switzerland', percentage: 21 },
            { country: 'Austria', percentage: 12 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 45 },
            { ageRange: '18-24', percentage: 30 },
          ],
          genderSplit: { male: 62, female: 38 },
        },
        { 
          name: 'TikTok', 
          handle: '@adventuremike', 
          followers: 120000, 
          engagementRate: 8.5,
          topCountries: [
            { country: 'United States', percentage: 28 },
            { country: 'United Kingdom', percentage: 18 },
            { country: 'Canada', percentage: 11 },
          ],
          topAgeGroups: [
            { ageRange: '18-24', percentage: 55 },
            { ageRange: '25-34', percentage: 31 },
          ],
          genderSplit: { male: 54, female: 46 },
        },
      ],
      audienceSize: 209000,
      location: 'Swiss Alps, Switzerland',
      portfolioLink: 'https://adventuremike.com',
      rating: {
        averageRating: 4.6,
        totalReviews: 8,
        reviews: [
          {
            id: 'r4',
            hotelId: 'h2',
            hotelName: 'Mountain View Lodge',
            rating: 5,
            comment: 'Perfect fit for our brand! Mike captured the adventure spirit beautifully.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r5',
            hotelId: 'h4',
            hotelName: 'Desert Oasis Resort',
            rating: 4,
            comment: 'Great content creator, very creative and professional.',
            createdAt: twoMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Tokyo Explorer',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@tokyoexplorer', 
          followers: 156000, 
          engagementRate: 4.8,
          topCountries: [
            { country: 'Japan', percentage: 42 },
            { country: 'South Korea', percentage: 18 },
            { country: 'Singapore', percentage: 12 },
          ],
          topAgeGroups: [
            { ageRange: '18-24', percentage: 38 },
            { ageRange: '25-34', percentage: 35 },
          ],
          genderSplit: { male: 48, female: 52 },
        },
        { 
          name: 'Facebook', 
          handle: '@tokyoexplorer', 
          followers: 25000, 
          engagementRate: 3.2,
          topCountries: [
            { country: 'Japan', percentage: 38 },
            { country: 'United States', percentage: 22 },
            { country: 'Australia', percentage: 15 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 41 },
            { ageRange: '35-44', percentage: 33 },
          ],
          genderSplit: { male: 55, female: 45 },
        },
      ],
      audienceSize: 181000,
      location: 'Tokyo, Japan',
      portfolioLink: 'https://tokyoexplorer.com',
      rating: {
        averageRating: 4.9,
        totalReviews: 15,
        reviews: [
          {
            id: 'r6',
            hotelId: 'h3',
            hotelName: 'Urban Boutique Hotel',
            rating: 5,
            comment: 'Outstanding work! The content perfectly showcased our hotel and reached our target audience.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r7',
            hotelId: 'h5',
            hotelName: 'Santorini Blue Suites',
            rating: 5,
            comment: 'Highly recommend! Professional, creative, and delivered exceptional results.',
            createdAt: twoMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Luxury Wanderer',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@luxurywanderer', 
          followers: 245000, 
          engagementRate: 3.9,
          topCountries: [
            { country: 'UAE', percentage: 28 },
            { country: 'Saudi Arabia', percentage: 19 },
            { country: 'United Kingdom', percentage: 15 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 44 },
            { ageRange: '35-44', percentage: 32 },
          ],
          genderSplit: { male: 58, female: 42 },
        },
        { 
          name: 'YouTube', 
          handle: '@luxurywanderer', 
          followers: 98000, 
          engagementRate: 5.5,
          topCountries: [
            { country: 'United States', percentage: 31 },
            { country: 'United Kingdom', percentage: 19 },
            { country: 'UAE', percentage: 14 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 46 },
            { ageRange: '35-44', percentage: 28 },
          ],
          genderSplit: { male: 61, female: 39 },
        },
      ],
      audienceSize: 343000,
      location: 'Dubai, UAE',
      portfolioLink: 'https://luxurywanderer.com',
      rating: {
        averageRating: 4.7,
        totalReviews: 20,
        reviews: [
          {
            id: 'r8',
            hotelId: 'h4',
            hotelName: 'Desert Oasis Resort',
            rating: 5,
            comment: 'Exceeded expectations! The luxury content perfectly aligned with our brand.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r9',
            hotelId: 'h5',
            hotelName: 'Santorini Blue Suites',
            rating: 4,
            comment: 'Great collaboration, very professional and delivered quality content.',
            createdAt: twoMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Island Dreams',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@islanddreams', 
          followers: 198000, 
          engagementRate: 4.5,
          topCountries: [
            { country: 'Greece', percentage: 36 },
            { country: 'Italy', percentage: 21 },
            { country: 'Spain', percentage: 16 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 47 },
            { ageRange: '18-24', percentage: 29 },
          ],
          genderSplit: { male: 41, female: 59 },
        },
        { 
          name: 'TikTok', 
          handle: '@islanddreams', 
          followers: 67000, 
          engagementRate: 2.8,
          topCountries: [
            { country: 'Greece', percentage: 31 },
            { country: 'United States', percentage: 24 },
            { country: 'United Kingdom', percentage: 16 },
          ],
          topAgeGroups: [
            { ageRange: '18-24', percentage: 52 },
            { ageRange: '25-34', percentage: 28 },
          ],
          genderSplit: { male: 38, female: 62 },
        },
      ],
      audienceSize: 265000,
      location: 'Santorini, Greece',
      portfolioLink: 'https://islanddreams.com',
      rating: {
        averageRating: 4.5,
        totalReviews: 10,
        reviews: [
          {
            id: 'r10',
            hotelId: 'h5',
            hotelName: 'Santorini Blue Suites',
            rating: 5,
            comment: 'Perfect match! The content beautifully captured the essence of our location.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r11',
            hotelId: 'h1',
            hotelName: 'Sunset Beach Villa',
            rating: 4,
            comment: 'Good collaboration, delivered as promised.',
            createdAt: twoMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Eco Explorer',
      platforms: [
        { 
          name: 'Instagram', 
          handle: '@ecoexplorer', 
          followers: 112000, 
          engagementRate: 5.8,
          topCountries: [
            { country: 'Costa Rica', percentage: 29 },
            { country: 'United States', percentage: 25 },
            { country: 'Canada', percentage: 14 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 43 },
            { ageRange: '18-24', percentage: 32 },
          ],
          genderSplit: { male: 47, female: 53 },
        },
        { 
          name: 'Facebook', 
          handle: '@ecoexplorer', 
          followers: 32000, 
          engagementRate: 4.1,
          topCountries: [
            { country: 'United States', percentage: 35 },
            { country: 'Canada', percentage: 21 },
            { country: 'Costa Rica', percentage: 18 },
          ],
          topAgeGroups: [
            { ageRange: '25-34', percentage: 39 },
            { ageRange: '35-44', percentage: 34 },
          ],
          genderSplit: { male: 51, female: 49 },
        },
      ],
      audienceSize: 144000,
      location: 'Costa Rica',
      rating: {
        averageRating: 4.3,
        totalReviews: 6,
        reviews: [
          {
            id: 'r12',
            hotelId: 'h6',
            hotelName: 'Jungle Eco-Lodge',
            rating: 4,
            comment: 'Great partnership! The eco-friendly content resonated well with our values.',
            createdAt: oneMonthAgo,
          },
          {
            id: 'r13',
            hotelId: 'h1',
            hotelName: 'Sunset Beach Villa',
            rating: 5,
            comment: 'Excellent work! Very authentic and engaging content.',
            createdAt: twoMonthsAgo,
          },
        ],
      },
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

