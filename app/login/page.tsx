'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import type { UserType } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tokenExpired, setTokenExpired] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if token expired
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setTokenExpired(true)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear email validation errors when user types
    if (name === 'email' && emailError) {
      setEmailError('')
    }
    // Don't clear submit errors automatically - let user see the error
    // They can clear it by clicking the X button or trying again
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setEmailError('')
    setSubmitError('')
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Call login API (token is automatically stored by authService)
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })
      
      // Check profile status after login
      const userType = response.type as UserType
      if (userType === 'creator' || userType === 'hotel') {
        try {
          const profileStatus = await checkProfileStatus(userType)
          if (profileStatus && profileStatus.profile_complete) {
            // Profile is complete, update localStorage so warning banner doesn't show
            localStorage.setItem('profileComplete', 'true')
          } else if (profileStatus && !profileStatus.profile_complete) {
            // Profile is incomplete, set to false and redirect to profile completion page
            localStorage.setItem('profileComplete', 'false')
            router.push(ROUTES.PROFILE_COMPLETE)
            return
          }
        } catch (error) {
          // If profile status check fails, still allow login
          console.error('Failed to check profile status:', error)
        }
      }
      
      // Profile is complete or status check failed, redirect to marketplace
      router.push(ROUTES.MARKETPLACE)
    } catch (error) {
      setIsSubmitting(false)
      
      // Clear password field for security
      setFormData(prev => ({ ...prev, password: '' }))
      
      if (error instanceof ApiErrorResponse) {
        // Handle different error status codes
        if (error.status === 401) {
          // Invalid credentials
          setSubmitError('Invalid email or password')
        } else if (error.status === 403) {
          // Account suspended
          setSubmitError('Your account has been suspended. Please contact support.')
        } else if (error.status === 422) {
          // Validation errors
          const detail = error.data.detail
          if (Array.isArray(detail)) {
            // Handle field-specific validation errors
            detail.forEach((err) => {
              const field = err.loc[err.loc.length - 1] as string
              if (field === 'email') {
                setEmailError(err.msg)
              } else {
                setSubmitError(err.msg)
              }
            })
          } else {
            setSubmitError(detail as string || 'Validation error')
          }
        } else if (error.status === 500) {
          // Server error
          setSubmitError('Server error. Please try again later.')
        } else {
          // Other errors
          setSubmitError(error.data.detail as string || 'Login failed. Please try again.')
        }
      } else {
        // Network or other errors
        setSubmitError('Network error. Please check your connection and try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-center">
              <h1 className="text-3xl font-bold text-white">vayada</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {tokenExpired && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    Your session has expired. Please login again.
                  </p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
                error={emailError}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <div className="mt-2 text-right">
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-semibold">{submitError}</p>
                      <p className="text-xs text-red-600 mt-1">Please check your credentials and try again.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitError('')}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label="Dismiss error"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="px-8 pb-8 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={ROUTES.SIGNUP}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
