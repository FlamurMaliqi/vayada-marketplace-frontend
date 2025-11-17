'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
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
  const [filters, setFilters] = useState({
    accommodationType: '',
    collaborationType: '',
    availability: '',
    followerRange: '',
    platform: '',
  })

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

    // Accommodation type filter
    if (filters.accommodationType && hotel.accommodationType !== filters.accommodationType) {
      return false
    }

    // Collaboration type filter
    if (filters.collaborationType && hotel.collaborationType !== filters.collaborationType) {
      return false
    }

    // Availability filter
    if (filters.availability && hotel.availability) {
      const hasAvailability = hotel.availability.includes(filters.availability)
      if (!hasAvailability) return false
    }

    return true
  })

  const filteredCreators = creators.filter((creator) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        creator.name.toLowerCase().includes(query) ||
        creator.location.toLowerCase().includes(query) ||
        creator.niche.some((n) => n.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    // Follower range filter
    if (filters.followerRange) {
      const range = filters.followerRange
      const totalFollowers = creator.audienceSize
      
      let matchesRange = false
      if (range === '1.000 - 10.000') {
        matchesRange = totalFollowers >= 1000 && totalFollowers < 10000
      } else if (range === '10.000 - 50.000') {
        matchesRange = totalFollowers >= 10000 && totalFollowers < 50000
      } else if (range === '50.000 - 100.000') {
        matchesRange = totalFollowers >= 50000 && totalFollowers < 100000
      } else if (range === '100.000 - 500.000') {
        matchesRange = totalFollowers >= 100000 && totalFollowers < 500000
      } else if (range === '500.000 - 1.000.000') {
        matchesRange = totalFollowers >= 500000 && totalFollowers < 1000000
      } else if (range === '1.000.000+') {
        matchesRange = totalFollowers >= 1000000
      }
      
      if (!matchesRange) return false
    }

    // Platform filter
    if (filters.platform) {
      // Map filter platform names to actual platform names
      const platformMap: Record<string, string> = {
        'YouTube': 'YouTube',
        'YT': 'YouTube',
        'Instagram': 'Instagram',
        'TikTok': 'TikTok',
        'Facebook': 'Facebook',
      }
      const filterPlatform = platformMap[filters.platform] || filters.platform
      const hasPlatform = creator.platforms.some(
        (p) => p.name.toLowerCase() === filterPlatform.toLowerCase()
      )
      if (!hasPlatform) return false
    }

    return true
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
        <div className="pt-16">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Marktplatz
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Entdecken Sie Hotels und Creator für authentische Partnerschaften
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Hotels {filteredHotels.length > 0 && <span className="text-primary-600">({filteredHotels.length})</span>}
                  </h2>
                </div>
                {filteredHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHotels.map((hotel) => (
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

            {/* Creators Section */}
            {(viewType === 'all' || viewType === 'creators') && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Creator & Influencer {filteredCreators.length > 0 && <span className="text-primary-600">({filteredCreators.length})</span>}
                  </h2>
                </div>
                {filteredCreators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCreators.map((creator) => (
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

      <Footer />
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
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      hotelProfileId: 'profile-3',
      name: 'Coastal Retreat',
      location: 'Santorini, Greece',
      description: 'Atemberaubendes Klippenhotel mit spektakulären Sonnenuntergangsblick über die Ägäis.',
      images: ['/hotel5.jpg'],
      accommodationType: 'Hotel',
      collaborationType: 'Kostenlos',
      availability: ['Mai', 'Juni', 'Juli', 'August', 'September'],
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
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

function getMockCreators(): Creator[] {
  return [
    {
      id: '1',
      name: 'Sarah Travels',
      niche: ['Luxury Travel', 'Beach Destinations'],
      platforms: [
        { name: 'Instagram', handle: '@sarahtravels', followers: 125000, engagementRate: 4.2 },
        { name: 'YouTube', handle: '@sarahtravels', followers: 45000, engagementRate: 6.8 },
      ],
      audienceSize: 170000,
      location: 'Bali, Indonesia',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Adventure Mike',
      niche: ['Adventure Travel', 'Mountain Sports'],
      platforms: [
        { name: 'Instagram', handle: '@adventuremike', followers: 89000, engagementRate: 5.1 },
        { name: 'TikTok', handle: '@adventuremike', followers: 120000, engagementRate: 8.5 },
      ],
      audienceSize: 209000,
      location: 'Swiss Alps, Switzerland',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Tokyo Explorer',
      niche: ['City Travel', 'Food & Culture'],
      platforms: [
        { name: 'Instagram', handle: '@tokyoexplorer', followers: 156000, engagementRate: 4.8 },
        { name: 'Facebook', handle: '@tokyoexplorer', followers: 25000, engagementRate: 3.2 },
      ],
      audienceSize: 181000,
      location: 'Tokyo, Japan',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Luxury Wanderer',
      niche: ['Luxury Travel', 'Resorts'],
      platforms: [
        { name: 'Instagram', handle: '@luxurywanderer', followers: 245000, engagementRate: 3.9 },
        { name: 'YouTube', handle: '@luxurywanderer', followers: 98000, engagementRate: 5.5 },
      ],
      audienceSize: 343000,
      location: 'Dubai, UAE',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Island Dreams',
      niche: ['Beach Destinations', 'Romantic Travel'],
      platforms: [
        { name: 'Instagram', handle: '@islanddreams', followers: 198000, engagementRate: 4.5 },
        { name: 'TikTok', handle: '@islanddreams', followers: 67000, engagementRate: 2.8 },
      ],
      audienceSize: 265000,
      location: 'Santorini, Greece',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Eco Explorer',
      niche: ['Eco Travel', 'Adventure Travel'],
      platforms: [
        { name: 'Instagram', handle: '@ecoexplorer', followers: 112000, engagementRate: 5.8 },
        { name: 'Facebook', handle: '@ecoexplorer', followers: 32000, engagementRate: 4.1 },
      ],
      audienceSize: 144000,
      location: 'Costa Rica',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

