/**
 * Hotel API service
 */

import { apiClient } from './client'
import type { Hotel, PaginatedResponse, HotelProfile, HotelListing, CollaborationOffering, CreatorRequirements, HotelProfileStatus } from '@/lib/types'
import { transformHotelListingToHotel, transformListingMarketplaceResponse } from '@/lib/utils'

// Backend API response type for marketplace endpoint (snake_case)
interface ListingMarketplaceResponse {
  id: string
  hotel_profile_id: string
  hotel_name: string
  hotel_picture: string | null
  name: string
  location: string
  description: string
  accommodation_type: string | null
  images: string[]
  status: "pending" | "verified" | "rejected"
  collaboration_offerings: Array<{
    id: string
    listing_id: string
    collaboration_type: "Free Stay" | "Paid" | "Discount"
    availability_months: string[]
    platforms: ("Instagram" | "TikTok" | "YouTube" | "Facebook")[]
    free_stay_min_nights: number | null
    free_stay_max_nights: number | null
    paid_max_amount: string | null // Backend returns as string (e.g., "2000.00")
    discount_percentage: number | null
    created_at: string
    updated_at: string
  }>
  creator_requirements?: {
    id: string
    listing_id: string
    platforms: ("Instagram" | "TikTok" | "YouTube" | "Facebook")[]
    min_followers: number | null
    target_countries: string[]
    target_age_min: number | null
    target_age_max: number | null
    created_at: string
    updated_at: string
  }
  created_at: string
}

// Request/Response types for hotel profile endpoints
// Partial update for hotel profile (PUT /hotels/me)
// Send only changed fields; omitted fields stay untouched.
export interface UpdateHotelProfileRequest {
  name?: string
  location?: string
  email?: string
  about?: string
  website?: string
  phone?: string
  picture?: string | null // allow clearing or replacing
}

export interface CreateListingRequest {
  name: string
  location: string
  description: string
  accommodation_type?: string
  images?: string[]
  collaboration_offerings: Array<{
    collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
    availability_months: string[]
    platforms: string[]
    free_stay_min_nights?: number
    free_stay_max_nights?: number
    paid_max_amount?: number
    discount_percentage?: number
  }>
  creator_requirements: {
    platforms: string[]
    min_followers?: number
    target_countries: string[]
    target_age_min?: number
    target_age_max?: number
  }
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

export interface UploadPictureResponse {
  url: string
}

export interface UploadImagesResponse {
  urls: string[]
}

export const hotelService = {
  /**
   * Get all hotel listings (public marketplace endpoint - returns direct array)
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Hotel>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const query = queryParams.toString()
    // Backend returns direct array, not paginated response
    const response = await apiClient.get<ListingMarketplaceResponse[]>(`/marketplace/listings${query ? `?${query}` : ''}`)
    
    // Log the raw response from backend
    console.log('GET /marketplace/listings - Raw backend response:', JSON.stringify(response, null, 2))
    
    // Transform API response to frontend format
    const hotels = response.map(transformListingMarketplaceResponse)
    
    // Return as paginated response for consistency with frontend expectations
    return {
      data: hotels,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || hotels.length,
        total: hotels.length,
        totalPages: 1,
      },
    }
  },

  /**
   * Get hotel by ID (public)
   */
  getById: async (id: string): Promise<Hotel> => {
    const listing = await apiClient.get<HotelListing>(`/hotels/${id}`)
    return transformHotelListingToHotel(listing)
  },

  /**
   * Get current hotel's profile with all listings
   * GET /hotels/me
   */
  getMyProfile: async (): Promise<HotelProfile> => {
    return apiClient.get<HotelProfile>('/hotels/me')
  },

  /**
   * Update hotel profile
   * PUT /hotels/me
   */
  updateMyProfile: async (data: UpdateHotelProfileRequest | FormData): Promise<HotelProfile> => {
    // If FormData, use upload method; otherwise use regular put
    if (data instanceof FormData) {
      return apiClient.upload<HotelProfile>('/hotels/me', data, { method: 'PUT' })
    }
    return apiClient.put<HotelProfile>('/hotels/me', data)
  },

  /**
   * Upload hotel profile picture (recommended flow)
   * POST /upload/image/hotel-profile
   * Returns URL and metadata to include in profile update
   */
  uploadProfileImage: async (file: File): Promise<{
    url: string
    thumbnail_url?: string
    key?: string
    width?: number
    height?: number
    size_bytes?: number
    format?: string
  }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<{
      url: string
      thumbnail_url?: string
      key?: string
      width?: number
      height?: number
      size_bytes?: number
      format?: string
    }>('/upload/image/hotel-profile', formData)
  },

  /**
   * Upload hotel profile picture (legacy method)
   * POST /hotels/me/upload-picture
   * @deprecated Use uploadProfileImage() instead (recommended flow)
   */
  uploadPicture: async (file: File): Promise<UploadPictureResponse> => {
    const formData = new FormData()
    formData.append('picture', file)
    return apiClient.upload<UploadPictureResponse>('/hotels/me/upload-picture', formData)
  },

  /**
   * Create new listing
   * POST /hotels/me/listings
   */
  createListing: async (data: CreateListingRequest): Promise<HotelListing> => {
    return apiClient.post<HotelListing>('/hotels/me/listings', data)
  },

  /**
   * Update existing listing
   * PUT /hotels/me/listings/:id
   */
  updateListing: async (id: string, data: UpdateListingRequest): Promise<HotelListing> => {
    return apiClient.put<HotelListing>(`/hotels/me/listings/${id}`, data)
  },

  /**
   * Delete listing
   * DELETE /hotels/me/listings/:id
   */
  deleteListing: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/hotels/me/listings/${id}`)
  },

  /**
   * Upload listing images (standalone - before creating/updating listing)
   * POST /upload/images/listing
   * Returns array of image URLs to include in listing creation/update
   */
  uploadListingImages: async (files: File[]): Promise<{ images: Array<{ url: string }> }> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return apiClient.upload<{ images: Array<{ url: string }> }>('/upload/images/listing', formData)
  },

  /**
   * Upload listing images to existing listing (legacy method)
   * POST /hotels/me/listings/:id/upload-images
   * @deprecated Use uploadListingImages() and include URLs in listing update instead
   */
  uploadListingImagesToExisting: async (id: string, files: File[]): Promise<UploadImagesResponse> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })
    return apiClient.upload<UploadImagesResponse>(`/hotels/me/listings/${id}/upload-images`, formData)
  },

  // Legacy methods (kept for backward compatibility)
  /**
   * Create hotel (legacy)
   */
  create: async (data: Partial<Hotel>): Promise<Hotel> => {
    return apiClient.post<Hotel>('/hotels', data)
  },

  /**
   * Update hotel (legacy)
   */
  update: async (id: string, data: Partial<Hotel>): Promise<Hotel> => {
    return apiClient.put<Hotel>(`/hotels/${id}`, data)
  },

  /**
   * Delete hotel (legacy)
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/hotels/${id}`)
  },

  /**
   * Get hotel profile completion status
   * GET /hotels/me/profile-status
   */
  getProfileStatus: async (): Promise<HotelProfileStatus> => {
    return apiClient.get<HotelProfileStatus>('/hotels/me/profile-status')
  },
}

