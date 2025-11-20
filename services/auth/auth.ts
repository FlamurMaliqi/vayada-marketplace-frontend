/**
 * Authentication service
 */

import { apiClient, ApiErrorResponse } from '../api/client'
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/lib/types'

export const authService = {
  /**
   * Register user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data)
      return response
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      throw new Error('Registration failed: Network error')
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data)
      return response
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      throw new Error('Login failed: Network error')
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    // TODO: Implement logout
    throw new Error('Not implemented yet')
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    // TODO: Implement get current user
    throw new Error('Not implemented yet')
  },
}

