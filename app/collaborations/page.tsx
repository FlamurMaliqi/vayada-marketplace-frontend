'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { CollaborationCard, CollaborationRejectedModal, CollaborationRequestDetailModal } from '@/components/marketplace'
import { Button, Input } from '@/components/ui'
import { FeatureUnavailableModal } from '@/components/ui/FeatureUnavailableModal'
import { ROUTES } from '@/lib/constants/routes'
import type { Collaboration, CollaborationStatus, Hotel, Creator, UserType } from '@/lib/types'
import { collaborationService } from '@/services/api/collaborations'
import { hotelService } from '@/services/api/hotels'
import { creatorService } from '@/services/api/creators'
import { ApiErrorResponse } from '@/services/api/client'
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
  const [showUnavailableModal, setShowUnavailableModal] = useState(false)
  
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
    // Collaboration endpoints have been removed from backend
    // Backend only supports authentication endpoints
    console.warn('Collaboration endpoints are not available. Backend only supports authentication.')
    setCollaborations([])
    setLoading(false)
  }

  // Show modal when collaborations are unavailable
  useEffect(() => {
    if (!loading && collaborations.length === 0) {
      setShowUnavailableModal(true)
    }
  }, [loading, collaborations.length])

  const handleStatusUpdate = async (id: string, newStatus: CollaborationStatus) => {
    // Collaboration endpoints have been removed from backend
    console.warn('Collaboration update endpoints are not available. Backend only supports authentication.')
    alert('Collaboration management is not available. Backend only supports authentication endpoints.')
    setUpdatingId(null)
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
        ) : !loading && collaborations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Collaborations will be available shortly.</p>
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

      {/* Feature Unavailable Modal */}
      <FeatureUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        featureName="Collaborations"
      />
    </main>
  )
}

// Removed mock data - now using API

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

