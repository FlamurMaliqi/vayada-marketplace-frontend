'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { CollaborationCard } from '@/components/marketplace'
import { Button, Input } from '@/components/ui'
// Removed API imports - using mock data only for frontend design
import { ROUTES } from '@/lib/constants/routes'
import type { Collaboration, CollaborationStatus, Hotel, Creator, UserType } from '@/lib/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected'
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
  
  // Get user type from URL params or localStorage (for development)
  const userType = (searchParams.get('type') || 
    (typeof window !== 'undefined' ? localStorage.getItem('userType') : null) || 
    'hotel') as UserType
  
  // Get user ID from localStorage (for development - in production this would come from auth)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    loadCollaborations()
  }, [statusFilter, userType, currentUserId])

  const loadCollaborations = async () => {
    setLoading(true)
    // Use mock data directly for frontend design
    setTimeout(() => {
      setCollaborations(getMockCollaborations(userType, currentUserId))
      setLoading(false)
    }, 300)
  }

  const handleStatusUpdate = async (id: string, newStatus: CollaborationStatus) => {
    setUpdatingId(id)
    // Simulate status update (frontend design only)
    setTimeout(() => {
      // Update local state
      setCollaborations(prev => 
        prev.map(collab => 
          collab.id === id ? { ...collab, status: newStatus } : collab
        )
      )
      setUpdatingId(null)
    }, 500)
  }

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Declined' },
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
        <div className="pt-16">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Collaborations
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {userType === 'hotel' 
              ? 'Manage your partnerships with creators and influencers'
              : 'Manage your partnerships with hotels'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
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
              className="pl-10 w-full bg-white/80 backdrop-blur-sm border-gray-200/50"
            />
          </div>

          {/* Status Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/50 w-fit">
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

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Sort:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedCollaborations.map((collaboration) => (
              <CollaborationCard
                key={collaboration.id}
                collaboration={collaboration}
                onStatusUpdate={handleStatusUpdate}
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

      <Footer />
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
      name: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      description: 'Luxury beachfront resort',
      images: [],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      description: 'Cozy alpine lodge',
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
      niche: ['Luxury Travel'],
      platforms: [
        { name: 'Instagram', handle: '@sarahtravels', followers: 125000, engagementRate: 4.2 },
      ],
      audienceSize: 125000,
      location: 'Bali, Indonesia',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Adventure Mike',
      niche: ['Adventure Travel'],
      platforms: [
        { name: 'Instagram', handle: '@adventuremike', followers: 89000, engagementRate: 5.1 },
      ],
      audienceSize: 89000,
      location: 'Swiss Alps, Switzerland',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const allCollaborations = [
    {
      id: '1',
      hotelId: '1',
      creatorId: '1',
      status: 'pending' as CollaborationStatus,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[0],
    },
    {
      id: '2',
      hotelId: '2',
      creatorId: '2',
      status: 'accepted' as CollaborationStatus,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[1],
      creator: mockCreators[1],
    },
    {
      id: '3',
      hotelId: '1',
      creatorId: '2',
      status: 'rejected' as CollaborationStatus,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      hotel: mockHotels[0],
      creator: mockCreators[1],
    },
  ]

  // Filter by user type
  if (userType === 'hotel') {
    // Show only collaborations where hotelId matches (or default to hotel '1' if no userId)
    const filterId = userId || '1'
    return allCollaborations.filter(c => c.hotelId === filterId)
  } else {
    // Show only collaborations where creatorId matches (or default to creator '1' if no userId)
    const filterId = userId || '1'
    return allCollaborations.filter(c => c.creatorId === filterId)
  }
}

export default function CollaborationsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <CollaborationsPageContent />
    </Suspense>
  )
}

