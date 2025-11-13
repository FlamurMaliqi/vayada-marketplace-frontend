/**
 * Collaborations API service
 */

import { apiClient } from './client'
import type { Collaboration, PaginatedResponse } from '@/lib/types'

export const collaborationService = {
  /**
   * Get all collaborations
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
   * Create collaboration request
   */
  create: async (data: { hotelId?: string; creatorId?: string }): Promise<Collaboration> => {
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

