/**
 * Collaborations API service
 */

import { apiClient } from './client'
import type { Collaboration, PaginatedResponse } from '@/lib/types'
import type { Hotel, Creator } from '@/lib/types'

// Platform deliverable types
export interface PlatformDeliverable {
  type: string
  quantity: number
}

export interface PlatformDeliverablesItem {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook'
  deliverables: PlatformDeliverable[]
}

// Creator application request
export interface CreateCreatorCollaborationRequest {
  initiator_type: 'creator'
  listing_id: string
  creator_id: string
  why_great_fit: string
  consent: true
  travel_date_from?: string
  travel_date_to?: string
  preferred_months?: string[]
  platform_deliverables: PlatformDeliverablesItem[]
}

// Hotel invitation request
export interface CreateHotelCollaborationRequest {
  initiator_type: 'hotel'
  listing_id: string
  creator_id: string
  collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
  free_stay_min_nights?: number
  free_stay_max_nights?: number
  paid_amount?: number
  discount_percentage?: number
  preferred_date_from?: string
  preferred_date_to?: string
  preferred_months?: string[]
  platform_deliverables: PlatformDeliverablesItem[]
  message?: string
}

export type CreateCollaborationRequest = CreateCreatorCollaborationRequest | CreateHotelCollaborationRequest

// Backend collaboration response (snake_case)
export interface CollaborationResponse {
  id: string
  initiator_type: 'creator' | 'hotel'
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  creator_id: string
  creator_name: string
  creator_profile_picture: string | null
  hotel_id: string
  hotel_name: string
  total_followers?: number
  avg_engagement_rate?: number
  listing_id: string
  listing_name: string
  listing_location: string
  collaboration_type: 'Free Stay' | 'Paid' | 'Discount' | null
  free_stay_min_nights: number | null
  free_stay_max_nights: number | null
  paid_amount: number | null
  discount_percentage: number | null
  travel_date_from: string | null
  travel_date_to: string | null
  preferred_date_from: string | null
  preferred_date_to: string | null
  preferred_months: string[] | null
  why_great_fit: string | null
  platform_deliverables: PlatformDeliverablesItem[]
  consent: boolean | null
  created_at: string
  updated_at: string
  responded_at: string | null
  cancelled_at: string | null
  completed_at: string | null
}

export const collaborationService = {
  /**
   * Get creator collaborations
   */
  getCreatorCollaborations: async (params?: {
    status?: string
    initiated_by?: string
  }): Promise<CollaborationResponse[]> => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.initiated_by) queryParams.append('initiated_by', params.initiated_by)

    const query = queryParams.toString()
    const response = await apiClient.get<CollaborationResponse[]>(`/creators/me/collaborations${query ? `?${query}` : ''}`)

    // Log the raw backend response
    console.log('GET /creators/me/collaborations - Raw backend response:', JSON.stringify(response, null, 2))

    return response
  },

  /**
   * Get hotel collaborations
   */
  getHotelCollaborations: async (params?: {
    listing_id?: string
    status?: string
    initiated_by?: string
  }): Promise<CollaborationResponse[]> => {
    const queryParams = new URLSearchParams()
    if (params?.listing_id) queryParams.append('listing_id', params.listing_id)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.initiated_by) queryParams.append('initiated_by', params.initiated_by)

    const query = queryParams.toString()
    const response = await apiClient.get<CollaborationResponse[]>(`/hotels/me/collaborations${query ? `?${query}` : ''}`)

    // Log the raw backend response
    console.log('GET /hotels/me/collaborations - Raw backend response:', JSON.stringify(response, null, 2))

    return response
  },

  /**
   * Get all collaborations (legacy endpoint - kept for backward compatibility)
   */
  getAll: async (params?: {
    page?: number
    limit?: number
    status?: string
    hotelId?: string
    creatorId?: string
  }): Promise<PaginatedResponse<Collaboration>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.hotelId) queryParams.append('hotelId', params.hotelId)
    if (params?.creatorId) queryParams.append('creatorId', params.creatorId)

    const query = queryParams.toString()
    return apiClient.get<PaginatedResponse<Collaboration>>(`/collaborations${query ? `?${query}` : ''}`)
  },

  /**
   * Get collaboration by ID
   */
  getById: async (id: string): Promise<Collaboration> => {
    return apiClient.get<Collaboration>(`/collaborations/${id}`)
  },

  /**
   * Create collaboration request (creator application or hotel invitation)
   */
  create: async (data: CreateCollaborationRequest): Promise<Collaboration> => {
    return apiClient.post<Collaboration>('/collaborations', data)
  },

  /**
   * Update collaboration status
   */
  updateStatus: async (id: string, status: string): Promise<Collaboration> => {
    return apiClient.put<Collaboration>(`/collaborations/${id}`, { status })
  },

  /**
   * Delete collaboration
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/collaborations/${id}`)
  },
}

/**
 * Transform backend collaboration response to frontend Collaboration type
 */
export function transformCollaborationResponse(
  response: CollaborationResponse
): Collaboration & { hotel?: Hotel; creator?: Creator } {
  // Map status: backend uses 'declined', frontend uses 'rejected'
  const statusMap: Record<string, Collaboration['status']> = {
    pending: 'pending',
    accepted: 'accepted',
    declined: 'rejected',
    completed: 'completed',
    cancelled: 'cancelled',
  }

  // Create hotel object from response
  const hotel: Hotel | undefined = response.hotel_id
    ? {
      id: response.hotel_id,
      name: response.hotel_name,
      location: response.listing_location,
      description: '',
      images: [],
      accommodationType: undefined,
      collaborationType: undefined,
      availability: undefined,
      platforms: undefined,
      minFollowers: undefined,
      targetCountries: undefined,
      targetAgeMin: undefined,
      targetAgeMax: undefined,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
    : undefined

  // Create creator object from response
  const creator: Creator | undefined = response.creator_id
    ? {
      id: response.creator_id,
      email: '',
      name: response.creator_name,
      location: '',
      platforms: [],
      audienceSize: response.total_followers ?? 0,
      avgEngagementRate: response.avg_engagement_rate ?? undefined,
      rating: {
        averageRating: 0,
        totalReviews: 0,
      },
      portfolioLink: undefined,
      shortDescription: undefined,
      phone: null,
      profilePicture: response.creator_profile_picture || undefined,
      status: 'verified' as const,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
    : undefined

  return {
    id: response.id,
    hotelId: response.hotel_id,
    creatorId: response.creator_id,
    status: statusMap[response.status] || 'pending',
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    hotel,
    creator,
    // Store additional backend fields for use in components
    initiatorType: response.initiator_type,
    listingId: response.listing_id,
    listingName: response.listing_name,
    listingLocation: response.listing_location,
    collaborationType: response.collaboration_type,
    freeStayMinNights: response.free_stay_min_nights,
    freeStayMaxNights: response.free_stay_max_nights,
    paidAmount: response.paid_amount,
    discountPercentage: response.discount_percentage,
    travelDateFrom: response.travel_date_from,
    travelDateTo: response.travel_date_to,
    preferredDateFrom: response.preferred_date_from,
    preferredDateTo: response.preferred_date_to,
    preferredMonths: response.preferred_months,
    whyGreatFit: response.why_great_fit,
    platformDeliverables: response.platform_deliverables,
    consent: response.consent,
    respondedAt: response.responded_at,
    cancelledAt: response.cancelled_at,
    completedAt: response.completed_at,
  } as Collaboration & {
    hotel?: Hotel
    creator?: Creator
    initiatorType?: 'creator' | 'hotel'
    listingId?: string
    listingName?: string
    listingLocation?: string
    collaborationType?: 'Free Stay' | 'Paid' | 'Discount' | null
    freeStayMinNights?: number | null
    freeStayMaxNights?: number | null
    paidAmount?: number | null
    discountPercentage?: number | null
    travelDateFrom?: string | null
    travelDateTo?: string | null
    preferredDateFrom?: string | null
    preferredDateTo?: string | null
    preferredMonths?: string[] | null
    whyGreatFit?: string | null
    platformDeliverables?: PlatformDeliverablesItem[]
    consent?: boolean | null
    respondedAt?: string | null
    cancelledAt?: string | null
    completedAt?: string | null
  }
}

