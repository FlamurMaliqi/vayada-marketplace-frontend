/**
 * Creator API service
 */

import { apiClient } from './client'
import type { Creator, PaginatedResponse, CreatorProfileStatus } from '@/lib/types'
import { transformCreatorMarketplaceResponse } from '@/lib/utils'

// Backend API response type for marketplace endpoint (snake_case from backend)
interface CreatorMarketplaceResponse {
  id: string
  name: string
  location: string
  short_description: string
  portfolio_link: string | null
  profile_picture: string | null
  platforms: Array<{
    id: string
    name: "Instagram" | "TikTok" | "YouTube" | "Facebook"
    handle: string
    followers: number
    engagement_rate: number
    top_countries: Array<{ country: string; percentage: number }> | null
    top_age_groups: Array<{ ageRange: string; percentage: number }> | null
    gender_split: { male: number; female: number; other?: number } | null
  }>
  audience_size: number
  average_rating: number
  total_reviews: number
  created_at: string
}

export const creatorService = {
  /**
   * Get all creators (marketplace endpoint - returns direct array)
   * No query parameters supported - endpoint returns all verified creators with complete profiles
   */
  getAll: async (): Promise<PaginatedResponse<Creator>> => {
    // Backend returns direct array, not paginated response
    // No query parameters - endpoint automatically filters to verified creators with complete profiles
    const response = await apiClient.get<CreatorMarketplaceResponse[]>('/marketplace/creators')
    
    // Log the raw response from backend
    console.log('GET /marketplace/creators - Raw backend response:', JSON.stringify(response, null, 2))
    
    // Transform API response to frontend format
    const creators = response.map(transformCreatorMarketplaceResponse)
    
    // Return as paginated response for consistency with frontend expectations
    return {
      data: creators,
      pagination: {
        page: 1,
        limit: creators.length,
        total: creators.length,
        totalPages: 1,
      },
    }
  },

  /**
   * Get creator by ID
   */
  getById: async (id: string): Promise<Creator> => {
    return apiClient.get<Creator>(`/creators/${id}`)
  },

  /**
   * Get current creator's profile
   * GET /creators/me
   */
  getMyProfile: async (): Promise<Creator> => {
    return apiClient.get<Creator>('/creators/me')
  },

  /**
   * Update creator profile
   * PUT /creators/me
   * Accepts JSON only (no FormData support)
   */
  updateMyProfile: async (data: Partial<Creator>): Promise<Creator> => {
    return apiClient.put<Creator>('/creators/me', data)
  },

  /**
   * Upload creator profile picture
   * POST /upload/image/creator-profile
   */
  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<{ url: string }>('/upload/image/creator-profile', formData)
  },

  /**
   * Create creator
   */
  create: async (data: Partial<Creator>): Promise<Creator> => {
    return apiClient.post<Creator>('/creators', data)
  },

  /**
   * Update creator
   */
  update: async (id: string, data: Partial<Creator>): Promise<Creator> => {
    return apiClient.put<Creator>(`/creators/${id}`, data)
  },

  /**
   * Delete creator
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/creators/${id}`)
  },

  /**
   * Get creator profile completion status
   * GET /creators/me/profile-status
   */
  getProfileStatus: async (): Promise<CreatorProfileStatus> => {
    return apiClient.get<CreatorProfileStatus>('/creators/me/profile-status')
  },
}

