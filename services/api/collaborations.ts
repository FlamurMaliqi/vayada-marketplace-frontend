/**
 * Collaborations API service
 */

import { apiClient } from './client'
import type { Collaboration, PaginatedResponse } from '@/lib/types'
import type { Hotel, Creator } from '@/lib/types'
import { buildQueryString } from '@/lib/utils'

// Platform deliverable types
export interface PlatformDeliverable {
  id: string
  type: string
  quantity: number
  status?: 'pending' | 'completed'
  completed?: boolean
  completed_at?: string | null
}

export interface PlatformDeliverablesItem {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom' | string
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
  platform_deliverables: Array<{
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom' | string
    deliverables: Array<{
      type: string
      quantity: number
    }>
  }>
}


export interface UpdateCollaborationTermsRequest {
  travel_date_from?: string
  travel_date_to?: string
  platform_deliverables?: Array<{
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom' | string
    deliverables: Array<{
      id?: string
      type: string
      quantity: number
    }>
  }>

  collaboration_type?: string
  free_stay_max_nights?: number | null
  paid_amount?: number | null
  discount_percentage?: number | null
}

export interface CollaborationResponseRequest {
  status: 'accepted' | 'declined'
  response_message?: string
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
  platform_deliverables: Array<{
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom' | string
    deliverables: Array<{
      type: string
      quantity: number
    }>
  }>

  message?: string
}

export type CreateCollaborationRequest = CreateCreatorCollaborationRequest | CreateHotelCollaborationRequest

// Backend collaboration response (snake_case)
export interface CollaborationResponse {
  id: string
  initiator_type: 'creator' | 'hotel'
  is_initiator: boolean
  status: 'pending' | 'negotiating' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  creator_id: string
  creator_name: string
  creator_profile_picture: string | null
  handle: string | null
  creator_location: string | null
  is_verified: boolean

  creator_portfolio_link?: string | null
  portfolio_link?: string | null
  platforms?: Array<{
    name: "Instagram" | "TikTok" | "YouTube" | "Facebook" | string
    handle: string
    followers: number
    engagement_rate: number
    top_countries?: Array<{ country: string; percentage: number }> | null
    top_age_groups?: Array<{ ageRange: string; percentage: number }> | null
    gender_split?: { male: number; female: number; other?: number } | null
  }>
  hotel_id: string
  hotel_name: string
  hotel_picture?: string | null
  hotel_location?: string | null
  hotel_website?: string | null
  hotel_about?: string | null
  hotel_phone?: string | null
  total_followers?: number
  avg_engagement_rate?: number
  active_platform?: string
  primary_handle?: string
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
  platform_deliverables?: PlatformDeliverablesItem[]
  reputation?: {
    average_rating: number
    total_reviews: number
    reviews: Array<{
      id: string
      hotel_name: string
      rating: number
      comment?: string
      created_at: string
    }>
  }
  hotel_agreed_at: string | null
  creator_agreed_at: string | null
  consent: boolean | null
  created_at: string
  cancelled_at: string | null
  completed_at: string | null
  hotelProfilePicture?: string | null
  listingImages?: string[]
  listing_images?: string[]
  creatorRequirements?: {
    platforms: string[]
    minFollowers: number
    targetCountries: string[]
    targetAgeMin: number
    targetAgeMax: number
  }
  // Additional properties that may come from backend
  updated_at?: string
  responded_at?: string
  creator_requirements?: {
    platforms: string[]
    min_followers: number
    target_countries: string[]
    target_age_min: number
    target_age_max: number
  }
}

export type DetailedCollaboration = Collaboration & {
  hotel?: Hotel
  creator?: Creator
  listingId?: string
  listingName?: string
  listingLocation?: string
  collaborationType?: 'Free Stay' | 'Paid' | 'Discount' | null
  hotelLocation?: string | null
  hotelWebsite?: string | null
  hotelAbout?: string | null
  hotelPhone?: string | null
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
  hotelAgreedAt?: Date | null
  creatorAgreedAt?: Date | null
  consent?: boolean | null
  respondedAt?: string | null
  cancelledAt?: string | null
  completedAt?: string | null
  listingImages?: string[]
  creatorRequirements?: {
    platforms: string[]
    minFollowers: number
    targetCountries: string[]
    targetAgeMin: number
    targetAgeMax: number
  }
  allowedCollaborationTypes?: ('Free Stay' | 'Paid' | 'Discount')[]
}

export interface ConversationResponse {
  collaboration_id: string
  partner_name: string
  partner_avatar: string | null
  last_message_content: string | null
  last_message_at: string | null
  unread_count: number
  collaboration_status: string
  my_role: 'creator' | 'hotel'
  listing_name?: string | null
}

export interface MessageMetadata {
  imageUrl?: string
  fileName?: string
  fileSize?: number
  [key: string]: unknown
}

export interface MessageResponse {
  id: string
  collaboration_id: string
  sender_id: string | null
  sender_name: string | null
  sender_avatar: string | null
  content: string
  content_type: 'text' | 'image' | 'system'
  metadata: MessageMetadata | null
  created_at: string
}

export const collaborationService = {
  /**
   * Get creator collaborations
   */
  getCreatorCollaborations: async (params?: {
    status?: string
    initiated_by?: string
  }): Promise<CollaborationResponse[]> => {
    const query = buildQueryString({
      status: params?.status,
      initiated_by: params?.initiated_by,
    })
    const response = await apiClient.get<CollaborationResponse[]>(`/creators/me/collaborations${query}`)

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
    const query = buildQueryString({
      listing_id: params?.listing_id,
      status: params?.status,
      initiated_by: params?.initiated_by,
    })
    const response = await apiClient.get<CollaborationResponse[]>(`/hotels/me/collaborations${query}`)

    return response
  },

  getHotelCollaborationDetails: async (id: string): Promise<CollaborationResponse> => {
    const response = await apiClient.get<CollaborationResponse>(`/hotels/me/collaborations/${id}`)
    return response
  },

  /**
   * Get creator collaboration details by ID
   */
  getCreatorCollaborationDetails: async (id: string): Promise<CollaborationResponse> => {
    const response = await apiClient.get<CollaborationResponse>(`/creators/me/collaborations/${id}`)
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
    const query = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
      hotelId: params?.hotelId,
      creatorId: params?.creatorId,
    })
    return apiClient.get<PaginatedResponse<Collaboration>>(`/collaborations${query}`)
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

  /**
   * Get all conversations for the current user
   */
  getConversations: async (): Promise<ConversationResponse[]> => {
    return apiClient.get<ConversationResponse[]>('/collaborations/conversations')
  },

  /**
   * Mark all messages in a collaboration as read
   */
  markAsRead: async (collaborationId: string): Promise<void> => {
    return apiClient.post<void>(`/collaborations/${collaborationId}/read`)
  },

  /**
   * Get messages for a collaboration
   */
  getMessages: async (collaborationId: string, before?: string): Promise<MessageResponse[]> => {
    const query = buildQueryString({ before })
    return apiClient.get<MessageResponse[]>(`/collaborations/${collaborationId}/messages${query}`)
  },

  /**
   * Send a message to a collaboration
   */
  sendMessage: async (collaborationId: string, content: string, contentType: 'text' | 'image' = 'text'): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>(`/collaborations/${collaborationId}/messages`, {
      content,
      message_type: contentType
    })
  },

  /**
   * Toggle the completion status of a deliverable
   */
  toggleDeliverable: async (collaborationId: string, deliverableId: string): Promise<CollaborationResponse> => {
    return apiClient.post<CollaborationResponse>(`/collaborations/${collaborationId}/deliverables/${deliverableId}/toggle`)
  },

  /**
   * Approve terms (Double Confirmation)
   */
  approveCollaboration: async (collaborationId: string): Promise<CollaborationResponse> => {
    return apiClient.post<CollaborationResponse>(`/collaborations/${collaborationId}/approve`)
  },

  /**
   * Suggest new terms for a collaboration
   */
  updateTerms: async (collaborationId: string, data: UpdateCollaborationTermsRequest): Promise<CollaborationResponse> => {
    return apiClient.put<CollaborationResponse>(`/collaborations/${collaborationId}/terms`, data)
  },

  /**
   * Accept or Decline a collaboration request
   */
  /**
   * Respond to a collaboration request (Accept/Decline)
   */
  respondToCollaboration: async (collaborationId: string, data: CollaborationResponseRequest): Promise<CollaborationResponse> => {
    return apiClient.post<CollaborationResponse>(`/collaborations/${collaborationId}/respond`, data)
  },

  /**
   * Cancel or withdraw from a collaboration
   */
  cancelCollaboration: async (collaborationId: string, reason?: string): Promise<CollaborationResponse> => {
    return apiClient.post<CollaborationResponse>(`/collaborations/${collaborationId}/cancel`, { reason })
  },

  /**
   * Rate a creator after completing a collaboration (hotels only)
   */
  rateCollaboration: async (
    collaborationId: string,
    rating: number,
    comment?: string
  ): Promise<{ message: string; rating_id: string; created_at: string }> => {
    return apiClient.post(`/collaborations/${collaborationId}/rate`, {
      rating,
      comment
    })
  },

  /**
   * Upload an image for chat messages
   */
  uploadChatImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<{ url: string }>('/upload/image/chat', formData)
  },
}

/**
 * Transforms a backend collaboration response into a Frontend-friendly Collaboration object with simplified structure
 */
export function transformCollaborationResponse(
  response: CollaborationResponse
): DetailedCollaboration {
  const updatedAt = response.updated_at || response.created_at

  const hotel: Hotel | undefined = response.hotel_name
    ? {
      id: response.hotel_id,
      hotelProfileId: '', // Not provided in simplified response
      name: response.hotel_name,
      location: response.listing_location || '',
      description: '', // Not provided
      picture: response.hotelProfilePicture || response.hotel_picture || undefined,
      images: [response.hotelProfilePicture || response.hotel_picture].filter(Boolean) as string[],
      status: 'verified',
      createdAt: new Date(response.created_at),
      updatedAt: new Date(updatedAt),
    }
    : undefined

  const creator: Creator | undefined = response.creator_name
    ? {
      id: response.creator_id,
      email: '', // Not provided
      name: response.creator_name,
      location: response.creator_location || '',
      platforms: response.platforms?.map((p) => ({
        name: p.name || 'platform',
        handle: p.handle,
        followers: p.followers,
        engagementRate: p.engagement_rate,
        topCountries: p.top_countries || undefined,
        topAgeGroups: p.top_age_groups || undefined,
        genderSplit: p.gender_split || undefined,
      })) || [],
      audienceSize: response.total_followers ?? 0,
      avgEngagementRate: response.avg_engagement_rate ?? undefined,
      creatorType: (response.creator_type as 'Lifestyle' | 'Travel') || 'Lifestyle',
      rating: response.reputation
        ? {
          averageRating: response.reputation.average_rating,
          totalReviews: response.reputation.total_reviews,
          reviews: response.reputation.reviews.map((r) => ({
            id: r.id,
            hotelId: '', // Not provided in simplified response, likely not needed for display
            hotelName: r.hotel_name,
            rating: r.rating,
            comment: r.comment,
            createdAt: new Date(r.created_at)
          }))
        }
        : {
          averageRating: 0,
          totalReviews: 0,
        },
      portfolioLink: response.portfolio_link || response.creator_portfolio_link || undefined,
      shortDescription: undefined,
      phone: null,
      profilePicture: response.creator_profile_picture || undefined,
      status: 'verified' as const,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(updatedAt),
    }
    : undefined

  const result = {
    id: response.id,
    hotelId: response.hotel_id,
    creatorId: response.creator_id,
    status: response.status || 'pending',
    createdAt: new Date(response.created_at),
    updatedAt: new Date(updatedAt),
    hotel,
    creator,
    is_initiator: response.is_initiator,
    // Store additional backend fields for use in components
    initiator_type: response.initiator_type,
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
    hotelLocation: response.hotel_location,
    hotelWebsite: response.hotel_website,
    hotelAbout: response.hotel_about,
    hotelPhone: response.hotel_phone,
    hotelAgreedAt: response.hotel_agreed_at ? new Date(response.hotel_agreed_at) : null,
    creatorAgreedAt: response.creator_agreed_at ? new Date(response.creator_agreed_at) : null,
    consent: response.consent,
    respondedAt: response.responded_at,
    cancelledAt: response.cancelled_at,
    completedAt: response.completed_at,
    listingImages: response.listingImages || response.listing_images || [],
    creatorRequirements: response.creatorRequirements || (response.creator_requirements ? {
      platforms: response.creator_requirements.platforms,
      minFollowers: response.creator_requirements.min_followers,
      targetCountries: response.creator_requirements.target_countries,
      targetAgeMin: response.creator_requirements.target_age_min,
      targetAgeMax: response.creator_requirements.target_age_max,
    } : undefined),
  } as DetailedCollaboration

  return result
}
