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

  /**
   * Request password reset
   * Sends a password reset email to the user
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      // In production, this would call the API
      // await apiClient.post('/auth/forgot-password', { email })
      
      // For development: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, handle errors from API
      // For now, we'll always succeed for demo purposes
      console.log('Password reset email sent to:', email)
    } catch (error: any) {
      // In production, handle specific error cases
      if (error.response?.status === 404) {
        // Don't reveal if email exists or not for security
        // Still show success message
        return
      }
      throw new Error('Failed to send password reset email. Please try again.')
    }
  },

  /**
   * Reset password with token
   * Validates the reset token and updates the password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      // In production, this would call the API
      // await apiClient.post('/auth/reset-password', { token, password: newPassword })
      
      // For development: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validate token format (basic check)
      if (!token || token.length < 20) {
        throw new Error('Invalid reset token. Please request a new password reset link.')
      }
      
      // In production, handle errors from API
      console.log('Password reset successful for token:', token.substring(0, 10) + '...')
    } catch (error: any) {
      // In production, handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('Invalid or expired reset token. Please request a new password reset link.')
      }
      if (error.response?.status === 401) {
        throw new Error('This reset link has expired. Please request a new one.')
      }
      throw new Error(error.message || 'Failed to reset password. Please try again.')
    }
  },
}

