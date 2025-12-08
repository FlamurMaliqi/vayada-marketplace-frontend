/**
 * Hotel API service
 */

import { apiClient } from './client'
import type { Hotel, PaginatedResponse, HotelProfile, HotelListing, CollaborationOffering, CreatorRequirements, HotelProfileStatus } from '@/lib/types'
import { transformHotelListingToHotel } from '@/lib/utils'

// Request/Response types for hotel profile endpoints
export interface UpdateHotelProfileRequest {
  name?: string
  category?: string
  location?: string
  picture?: string
  website?: string
  about?: string
  email?: string
  phone?: string
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
   * Get all hotels (public marketplace)
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Hotel>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const query = queryParams.toString()
    const response = await apiClient.get<PaginatedResponse<HotelListing>>(`/hotels${query ? `?${query}` : ''}`)
    
    // Transform HotelListing[] to Hotel[]
    return {
      ...response,
      data: response.data.map(transformHotelListingToHotel),
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
  updateMyProfile: async (data: UpdateHotelProfileRequest): Promise<HotelProfile> => {
    return apiClient.put<HotelProfile>('/hotels/me', data)
  },

  /**
   * Upload hotel profile picture
   * POST /hotels/me/upload-picture
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
   * Upload listing images
   * POST /hotels/me/listings/:id/upload-images
   */
  uploadListingImages: async (id: string, files: File[]): Promise<UploadImagesResponse> => {
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

