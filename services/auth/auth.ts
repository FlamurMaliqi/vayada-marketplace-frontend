/**
 * Authentication service
 */

import { apiClient, ApiErrorResponse } from '../api/client'
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/lib/types'

const TOKEN_KEY = 'access_token'
const EXPIRES_AT_KEY = 'token_expires_at'

/**
 * Store JWT token and expiration time
 */
function storeToken(token: string, expiresIn: number): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(TOKEN_KEY, token)
  const expiresAt = Date.now() + (expiresIn * 1000)
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
}

/**
 * Store user data in localStorage
 */
function storeUserData(data: { id: string; email: string; name: string; type: string; status: string }): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userId', data.id)
  localStorage.setItem('userEmail', data.email)
  localStorage.setItem('userName', data.name)
  localStorage.setItem('userType', data.type)
  localStorage.setItem('userStatus', data.status)
  
  // Store full user object for easy access
  localStorage.setItem('user', JSON.stringify({
    id: data.id,
    email: data.email,
    name: data.name,
    type: data.type,
    status: data.status,
  }))
}

/**
 * Clear all auth data from localStorage
 */
function clearAuthData(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_AT_KEY)
  localStorage.removeItem('userId')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userName')
  localStorage.removeItem('userType')
  localStorage.removeItem('userStatus')
  localStorage.removeItem('user')
  localStorage.setItem('isLoggedIn', 'false')
  localStorage.setItem('profileComplete', 'false')
  localStorage.setItem('hasProfile', 'false')
}

/**
 * Get token if not expired
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY)
  
  if (!token || !expiresAt) return null
  
  if (Date.now() >= parseInt(expiresAt)) {
    clearAuthData()
    return null
  }
  
  return token
}

export const authService = {
  /**
   * Register user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data)
      
      // Store token and user data
      storeToken(response.access_token, response.expires_in)
      storeUserData({
        id: response.id,
        email: response.email,
        name: response.name,
        type: response.type,
        status: response.status,
      })
      
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
      
      // Store token and user data
      storeToken(response.access_token, response.expires_in)
      storeUserData({
        id: response.id,
        email: response.email,
        name: response.name,
        type: response.type,
        status: response.status,
      })
      
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
  logout: (): void => {
    clearAuthData()
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get<LoginResponse>('/auth/me')
      return response
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      throw new Error('Failed to get current user')
    }
  },

  /**
   * Check if user is logged in (has valid token)
   */
  isLoggedIn: (): boolean => {
    return getToken() !== null
  },

  /**
   * Get token if available and not expired
   */
  getToken: (): string | null => {
    return getToken()
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

