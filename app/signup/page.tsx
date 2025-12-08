'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'
import { UserType } from '@/lib/types'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'

function SignUpForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'creator' as UserType,
  })
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Set user type from URL query parameter if present
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'creator' || type === 'hotel') {
      setFormData(prev => ({ ...prev, userType: type as UserType }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear errors when user types
    if (name === 'confirmPassword' && (confirmPasswordError || passwordError)) {
      setConfirmPasswordError('')
      setPasswordError('')
    }
    if (name === 'password' && passwordError) {
      setPasswordError('')
    }
    if (name === 'email' && emailError) {
      setEmailError('')
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setPasswordError('')
    setConfirmPasswordError('')
    setEmailError('')
    setSubmitError('')
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    // Validate password length
    if (!validatePassword(formData.password)) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        password: formData.password,
        type: formData.userType as 'creator' | 'hotel',
        ...(formData.name.trim() && { name: formData.name.trim() }),
      }
      
      // Call registration API (token is automatically stored by authService)
      const response = await authService.register(registrationData)
      
      // Check profile status after registration
      const userType = response.type as UserType
      if (userType === 'creator' || userType === 'hotel') {
        try {
          const profileStatus = await checkProfileStatus(userType)
          if (profileStatus && !profileStatus.profile_complete) {
            // Profile is incomplete, redirect to profile completion page
            router.push(ROUTES.PROFILE_COMPLETE)
            return
          }
        } catch (error) {
          // If profile status check fails, still allow registration
          console.error('Failed to check profile status:', error)
        }
      }
      
      // Profile is complete or status check failed, redirect to marketplace
      router.push(ROUTES.MARKETPLACE)
    } catch (error) {
      setIsSubmitting(false)
      
      if (error instanceof ApiErrorResponse) {
              // Handle different error status codes
        if (error.status === 400) {
          // Email already registered
          setEmailError(error.data.detail as string || 'Email already registered')
        } else if (error.status === 422) {
          // Validation errors
          const detail = error.data.detail
          if (Array.isArray(detail)) {
            // Handle field-specific validation errors
            detail.forEach((err) => {
              const field = err.loc[err.loc.length - 1] as string
              if (field === 'email') {
                setEmailError(err.msg)
              } else if (field === 'password') {
                setPasswordError(err.msg)
              } else if (field === 'type') {
                setSubmitError(err.msg)
              } else {
                setSubmitError(err.msg)
              }
            })
          } else {
            setSubmitError(detail as string || 'Validation error')
          }
        } else if (error.status === 500) {
          // Server error
          setSubmitError(error.data.detail as string || 'Server error. Please try again later.')
        } else {
          // Other errors
          setSubmitError(error.data.detail as string || 'Registration failed. Please try again.')
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
      
      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">vayada</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* User Type Selection */}
              <div className="space-y-4">
                <label className="block text-base font-semibold text-gray-900 mb-4">
                  I am a
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'creator' }))}
                    className={`
                      px-6 py-6 rounded-xl border-2 transition-all font-medium
                      ${formData.userType === 'creator'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.userType === 'creator' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-lg">Creator</span>
                      <span className="text-xs text-gray-500">Influencer or Content Creator</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'hotel' }))}
                    className={`
                      px-6 py-6 rounded-xl border-2 transition-all font-medium
                      ${formData.userType === 'hotel'
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.userType === 'hotel' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-lg">Hotel</span>
                      <span className="text-xs text-gray-500">Hotel or Accommodation</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-6">
                <Input
                  label="Name (Optional)"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  helperText="If left empty, will default to your email prefix"
                />

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

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  helperText="Must be at least 8 characters"
                  error={passwordError}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  error={confirmPasswordError}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-base">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">{submitError}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="px-8 pb-8 text-center border-t border-gray-200 pt-6">
              <p className="text-base text-gray-700">
                Already have an account?{' '}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign in
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

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
        <Navigation />
        <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
