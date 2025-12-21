/**
 * Creator API service
 */

import { apiClient } from './client'
import type { Creator, PaginatedResponse, CreatorProfileStatus } from '@/lib/types'

export const creatorService = {
  /**
   * Get all creators
   */
  getAll: async (params?: { 
    page?: number
    limit?: number
    location?: string
  }): Promise<PaginatedResponse<Creator>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.location) queryParams.append('location', params.location)
    
    const query = queryParams.toString()
    return apiClient.get<PaginatedResponse<Creator>>(`/creators${query ? `?${query}` : ''}`)
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

