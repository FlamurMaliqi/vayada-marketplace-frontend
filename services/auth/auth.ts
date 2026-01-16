/**
 * Authentication service
 */

import { apiClient, ApiErrorResponse } from '../api/client'
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/lib/types'
import { STORAGE_KEYS } from '@/lib/constants'

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

  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true')
  localStorage.setItem(STORAGE_KEYS.USER_ID, data.id)
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.email)
  localStorage.setItem(STORAGE_KEYS.USER_NAME, data.name)
  localStorage.setItem(STORAGE_KEYS.USER_TYPE, data.type)
  localStorage.setItem(STORAGE_KEYS.USER_STATUS, data.status)

  // Store full user object for easy access
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
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
  localStorage.removeItem(STORAGE_KEYS.USER_ID)
  localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
  localStorage.removeItem(STORAGE_KEYS.USER_NAME)
  localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
  localStorage.removeItem(STORAGE_KEYS.USER_STATUS)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false')
  localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'false')
  localStorage.setItem(STORAGE_KEYS.HAS_PROFILE, 'false')
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
   * Always succeeds (for security - don't reveal if email exists)
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string; token: string | null }>('/auth/forgot-password', { email })
      return { message: response.message }
    } catch (error: any) {
      // For security, always show success message even if email doesn't exist
      // This prevents email enumeration attacks
      if (error instanceof ApiErrorResponse) {
        // Still return success message for security
        return { message: 'If an account with that email exists, a password reset link has been sent.' }
      }
      // For network errors, still show success to maintain security
      return { message: 'If an account with that email exists, a password reset link has been sent.' }
    }
  },

  /**
   * Reset password with token
   * Validates the reset token and updates the password
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    try {
      if (!token || token.trim() === '') {
        throw new Error('Invalid reset token. Please request a new password reset link.')
      }

      if (!newPassword || newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long.')
      }

      const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
        token,
        new_password: newPassword,
      })
      
      return response
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        // Handle backend validation errors
        if (error.status === 400 || error.status === 422) {
          const detail = error.data.detail
          if (typeof detail === 'string') {
            throw new Error(detail)
          }
          if (Array.isArray(detail) && detail.length > 0) {
            // Pydantic validation errors
            const firstError = detail[0]
            const field = Array.isArray(firstError.loc) ? firstError.loc.slice(1).join('.') : 'field'
            throw new Error(`${field}: ${firstError.msg || 'Validation error'}`)
          }
          throw new Error('Invalid or expired reset token. Please request a new password reset link.')
        }
        if (error.status === 404) {
          throw new Error('Invalid or expired reset token. Please request a new password reset link.')
        }
        // For other errors, use the detail message if available
        const detail = error.data.detail
        if (typeof detail === 'string') {
          throw new Error(detail)
        }
        throw new Error('Failed to reset password. Please try again.')
      }
      throw new Error(error.message || 'Failed to reset password. Please try again.')
    }
  },

  /**
   * Send email verification code
   * Sends a verification code to the provided email address
   * Code expires in 15 minutes
   */
  sendVerificationCode: async (email: string): Promise<{ message: string; code: string | null }> => {
    try {
      const response = await apiClient.post<{ message: string; code: string | null }>('/auth/send-verification-code', { email })
      return response
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        const detail = error.data.detail
        if (typeof detail === 'string') {
          throw new Error(detail)
        }
        throw new Error('Failed to send verification code. Please try again.')
      }
      throw new Error('Failed to send verification code. Please try again.')
    }
  },

  /**
   * Verify email verification code
   * Verifies the code sent to the email address
   * Code can only be used once
   * @deprecated Use verifyEmail with token instead (link-based verification)
   */
  verifyEmailCode: async (email: string, code: string): Promise<{ message: string; verified: boolean }> => {
    try {
      const response = await apiClient.post<{ message: string; verified: boolean }>('/auth/verify-email-code', {
        email,
        code,
      })
      return response
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        const detail = error.data.detail
        if (typeof detail === 'string') {
          throw new Error(detail)
        }
        // Check if it's a verification error
        if (error.status === 400 || error.status === 422) {
          throw new Error('Invalid or expired verification code. Please request a new code.')
        }
        throw new Error('Failed to verify code. Please try again.')
      }
      throw new Error('Failed to verify code. Please try again.')
    }
  },

  /**
   * Verify email using token from verification link
   * Used after profile completion - user clicks link in email
   * Token expires after 48 hours
   */
  verifyEmail: async (token: string): Promise<{ message: string; verified: boolean; email: string | null }> => {
    try {
      if (!token || token.trim() === '') {
        throw new Error('Invalid verification token. Please request a new verification link.')
      }

      const response = await apiClient.get<{ message: string; verified: boolean; email: string | null }>(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      return response
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        const detail = error.data.detail
        if (typeof detail === 'string') {
          throw new Error(detail)
        }
        // Check if it's a verification error
        if (error.status === 400 || error.status === 404 || error.status === 422) {
          throw new Error('Invalid or expired verification token. Please request a new verification link.')
        }
        throw new Error('Failed to verify email. Please try again.')
      }
      throw new Error('Failed to verify email. Please try again.')
    }
  },
}

