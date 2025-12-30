/**
 * Access control utilities for restricted features
 */

import type { UserType } from '@/lib/types'

/**
 * List of allowed emails for testing purposes (e.g., cofounder)
 * Add emails here to grant access even if user is not admin
 */
const ALLOWED_TEST_EMAILS: string[] = [
  // Add cofounder or other test emails here
  // Example: 'cofounder@example.com'
]

/**
 * Check if the current user has access to restricted features (marketplace, collaborations)
 * 
 * Access is granted if:
 * - User type is 'admin'
 * - User email is in the ALLOWED_TEST_EMAILS list
 * 
 * @returns true if user has access, false otherwise
 */
export function hasRestrictedFeatureAccess(): boolean {
  if (typeof window === 'undefined') return false

  const userType = localStorage.getItem('userType') as UserType | null
  const userEmail = localStorage.getItem('userEmail')

  // Admin users always have access
  if (userType === 'admin') {
    return true
  }

  // Check if email is in allowed test emails list
  if (userEmail && ALLOWED_TEST_EMAILS.length > 0) {
    const normalizedEmail = userEmail.toLowerCase().trim()
    return ALLOWED_TEST_EMAILS.some(
      email => email.toLowerCase().trim() === normalizedEmail
    )
  }

  return false
}

/**
 * Get current user info from localStorage
 */
export function getCurrentUserInfo(): {
  userType: UserType | null
  userEmail: string | null
  userId: string | null
} {
  if (typeof window === 'undefined') {
    return {
      userType: null,
      userEmail: null,
      userId: null,
    }
  }

  return {
    userType: localStorage.getItem('userType') as UserType | null,
    userEmail: localStorage.getItem('userEmail'),
    userId: localStorage.getItem('userId'),
  }
}



