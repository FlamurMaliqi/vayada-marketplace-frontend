'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { CollaborationCard, CollaborationRejectedModal, CollaborationRequestDetailModal } from '@/components/marketplace'
import { Button, Input } from '@/components/ui'
// Removed API imports - using mock data only for frontend design
import { ROUTES } from '@/lib/constants/routes'
import type { Collaboration, CollaborationStatus, Hotel, Creator, UserType } from '@/lib/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected' | 'completed'
type SortOption = 'newest' | 'a-z'

function CollaborationsPageContent() {
  const { isCollapsed } = useSidebar()
  const searchParams = useSearchParams()
  const [collaborations, setCollaborations] = useState<
    (Collaboration & { hotel?: Hotel; creator?: Creator })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [rejectedCollaboration, setRejectedCollaboration] = useState<
    (Collaboration & { hotel?: Hotel; creator?: Creator }) | null
  >(null)
  const [detailCollaboration, setDetailCollaboration] = useState<
    (Collaboration & { hotel?: Hotel; creator?: Creator }) | null
  >(null)
  
  // Initialize userType from searchParams (available on both server and client)
  // This ensures server and client render the same initial value
  // Default to 'hotel' so the subtitle shows "Manage your partnerships with creators"
  const [userType, setUserType] = useState<UserType>(
    (searchParams.get('type') as UserType) || 'hotel'
  )
  
  // Get user ID from localStorage (for development - in production this would come from auth)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Update userType from localStorage after hydration (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null
      const urlType = searchParams.get('type') as UserType | null
      
      // Priority: URL param > localStorage > default
      if (urlType && (urlType === 'hotel' || urlType === 'creator')) {
        setUserType(urlType)
      } else if (storedUserType && (storedUserType === 'hotel' || storedUserType === 'creator')) {
        setUserType(storedUserType)
      }
      
      const userId = localStorage.getItem('userId')
      setCurrentUserId(userId)
    }
  }, [searchParams])

  // Load collaborations whenever dependencies change
  useEffect(() => {
    loadCollaborations()
  }, [statusFilter, userType, currentUserId])

  const loadCollaborations = async () => {
    setLoading(true)
    // Use mock data directly for frontend design
    setTimeout(() => {
      // Pass currentUserId (can be null, which will show default demo collaborations)
      const loadedCollaborations = getMockCollaborations(userType, currentUserId)
      setCollaborations(loadedCollaborations)
      setLoading(false)
    }, 300)
  }

  const handleStatusUpdate = async (id: string, newStatus: CollaborationStatus) => {
    setUpdatingId(id)
    // Simulate status update (frontend design only)
    setTimeout(() => {
      // Find the collaboration being updated
      const updatedCollaboration = collaborations.find(collab => collab.id === id)
      
      // Update local state
      setCollaborations(prev => 
        prev.map(collab => 
          collab.id === id ? { ...collab, status: newStatus, updatedAt: new Date() } : collab
        )
      )
      setUpdatingId(null)
      
      // If rejected, show the modal
      if (newStatus === 'rejected' && updatedCollaboration) {
        setRejectedCollaboration({
          ...updatedCollaboration,
          status: 'rejected',
          updatedAt: new Date(),
        })
      }
    }, 500)
  }

  const handleViewDetails = (collaboration: Collaboration & { hotel?: Hotel; creator?: Creator }) => {
    setDetailCollaboration(collaboration)
  }

  const handleAcceptFromModal = (id: string) => {
    handleStatusUpdate(id, 'accepted')
  }

  const handleDeclineFromModal = (id: string) => {
    handleStatusUpdate(id, 'rejected')
  }

  const handleRatingSubmit = async (id: string, rating: number, comment: string) => {
    // Simulate rating submission (frontend design only)
    // In production, this would call an API to submit the rating
    setTimeout(() => {
      setCollaborations(prev => 
        prev.map(collab => 
          collab.id === id ? { ...collab, hasRated: true } : collab
        )
      )
      // TODO: In production, submit rating to API
      console.log('Rating submitted:', { id, rating, comment })
    }, 500)
  }

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Declined' },
    { value: 'completed', label: 'Completed' },
  ]

  const filteredAndSortedCollaborations = useMemo(() => {
    let filtered = collaborations.filter((collab) => {
      // Status filter
      if (statusFilter !== 'all' && collab.status !== statusFilter) {
        return false
      }

      // Search filter - only search the "other party" (not the current user)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        if (userType === 'hotel') {
          // If user is hotel, search creator info
          const creatorMatch = collab.creator?.name.toLowerCase().includes(query) ||
            collab.creator?.location.toLowerCase().includes(query)
          if (!creatorMatch) return false
        } else {
          // If user is creator, search hotel info
          const hotelMatch = collab.hotel?.name.toLowerCase().includes(query) ||
            collab.hotel?.location.toLowerCase().includes(query)
          if (!hotelMatch) return false
        }
      }

      return true
    })

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        // A-Z sort by the "other party" name
        const aName = userType === 'hotel' 
          ? (a.creator?.name || '')
          : (a.hotel?.name || '')
        const bName = userType === 'hotel'
          ? (b.creator?.name || '')
          : (b.hotel?.name || '')
        return aName.localeCompare(bName)
      }
    })

    return filtered
  }, [collaborations, statusFilter, searchQuery, sortOption, userType])

  return (
    <main className="min-h-screen bg-white">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Collaborations
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {userType === 'hotel' 
              ? 'Manage your partnerships with creators'
              : 'Manage your partnerships with hotels'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar and Sort - Same Line */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={userType === 'hotel' 
                  ? 'Search by creator name, location...'
                  : 'Search by hotel name, location...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-white border-gray-300"
              />
            </div>
            {/* Sort Filter */}
            <div className="flex-shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px]"
              >
                <option value="newest">Newest</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  statusFilter === filter.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredAndSortedCollaborations.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedCollaborations.map((collaboration) => (
              <CollaborationCard
                key={collaboration.id}
                collaboration={collaboration}
                onStatusUpdate={handleStatusUpdate}
                onRatingSubmit={handleRatingSubmit}
                onViewDetails={handleViewDetails}
                currentUserType={userType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
            <p className="text-gray-500 mb-6 text-lg">
              {searchQuery
                ? 'No collaborations found matching your search.'
                : statusFilter === 'all'
                ? 'No collaborations found.'
                : `No ${statusFilter} collaborations found.`}
            </p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = ROUTES.MARKETPLACE)}
              size="lg"
            >
              Browse Marketplace
            </Button>
          </div>
        )}
        </div>
      </div>

      {/* Rejected Collaboration Modal */}
      <CollaborationRejectedModal
        isOpen={rejectedCollaboration !== null}
        onClose={() => setRejectedCollaboration(null)}
        collaboration={rejectedCollaboration}
        currentUserType={userType}
      />

      {/* Collaboration Request Detail Modal */}
      <CollaborationRequestDetailModal
        isOpen={detailCollaboration !== null}
        onClose={() => setDetailCollaboration(null)}
        collaboration={detailCollaboration}
        currentUserType={userType}
        onAccept={handleAcceptFromModal}
        onDecline={handleDeclineFromModal}
      />
    </main>
  )
}

// Mock data for development
function getMockCollaborations(
  userType: UserType = 'hotel',
  userId: string | null = null
): (Collaboration & { hotel?: Hotel; creator?: Creator })[] {
  const mockHotels: Hotel[] = [
    {
      id: '1',
      hotelProfileId: 'profile-1',
      name: 'Sunset Beach Villa',
      location: 'Bali, Indonesia',
      description: 'Luxuriöse Strandvilla mit atemberaubendem Meerblick und erstklassigen Annehmlichkeiten.',
      images: [],
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
      images: [],
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
      images: [],
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
      images: [],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      hotelProfileId: 'profile-3',
      name: 'Santorini Blue Suites',
      location: 'Santorini, Greece',
      description: 'Iconic white-washed suites perched on volcanic cliffs with stunning sunset views.',
      images: [],
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
      images: [],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockCreators: Creator[] = [
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
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const allCollaborations = [
    // Hotel 1 collaborations
    {
      id: '1',
      hotelId: '1',
      creatorId: '1',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[0],
    },
    {
      id: '2',
      hotelId: '1',
      creatorId: '5',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[4],
    },
    {
      id: '3',
      hotelId: '1',
      creatorId: '2',
      status: 'rejected' as CollaborationStatus,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[1],
    },
    {
      id: '4',
      hotelId: '1',
      creatorId: '4',
      status: 'completed' as CollaborationStatus,
      hasRated: false, // Needs rating
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[3],
    },
    // Hotel 2 collaborations
    {
      id: '5',
      hotelId: '2',
      creatorId: '2',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[1],
      creator: mockCreators[1],
    },
    {
      id: '6',
      hotelId: '2',
      creatorId: '6',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[1],
      creator: mockCreators[5],
    },
    {
      id: '7',
      hotelId: '2',
      creatorId: '3',
      status: 'cancelled' as CollaborationStatus,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[1],
      creator: mockCreators[2],
    },
    // Hotel 3 collaborations
    {
      id: '8',
      hotelId: '3',
      creatorId: '3',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[2],
      creator: mockCreators[2],
    },
    {
      id: '9',
      hotelId: '3',
      creatorId: '1',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[2],
      creator: mockCreators[0],
    },
    // Hotel 4 collaborations
    {
      id: '10',
      hotelId: '4',
      creatorId: '4',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[3],
      creator: mockCreators[3],
    },
    {
      id: '11',
      hotelId: '4',
      creatorId: '5',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[3],
      creator: mockCreators[4],
    },
    // Hotel 5 collaborations
    {
      id: '12',
      hotelId: '5',
      creatorId: '5',
      status: 'completed' as CollaborationStatus,
      hasRated: false, // Needs rating
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[4],
      creator: mockCreators[4],
    },
    {
      id: '13',
      hotelId: '5',
      creatorId: '1',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[4],
      creator: mockCreators[0],
    },
    {
      id: '14',
      hotelId: '5',
      creatorId: '4',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[4],
      creator: mockCreators[3],
    },
    // Hotel 6 collaborations
    {
      id: '15',
      hotelId: '6',
      creatorId: '6',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[5],
      creator: mockCreators[5],
    },
    {
      id: '16',
      hotelId: '6',
      creatorId: '2',
      status: 'rejected' as CollaborationStatus,
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[5],
      creator: mockCreators[1],
    },
  ]

  // Filter by user type
  if (userType === 'hotel') {
    // If userId is set, show only that hotel's collaborations
    // Otherwise, show collaborations for multiple hotels (1, 2, 3) for development
    if (userId) {
      return allCollaborations.filter(c => c.hotelId === userId)
    } else {
      // Show collaborations for hotels 1, 2, and 3 for better demo experience
      const filtered = allCollaborations.filter(c => ['1', '2', '3'].includes(c.hotelId))
      return filtered
    }
  } else {
    // If userId is set, show only that creator's collaborations
    // Otherwise, show collaborations for multiple creators (1, 2, 3) for development
    if (userId) {
      return allCollaborations.filter(c => c.creatorId === userId)
    } else {
      // Show collaborations for creators 1, 2, and 3 for better demo experience
      const filtered = allCollaborations.filter(c => ['1', '2', '3'].includes(c.creatorId))
      return filtered
    }
  }
}

export default function CollaborationsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </main>
    }>
      <CollaborationsPageContent />
    </Suspense>
  )
}

