'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear errors when user types
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
      // Call login API
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })
      
      // Store user data in localStorage (temporary until proper auth is implemented)
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userId', response.id)
        localStorage.setItem('userEmail', response.email)
        localStorage.setItem('userName', response.name)
        localStorage.setItem('userType', response.type)
        localStorage.setItem('userStatus', response.status)
        
        // Store full user object for easy access
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          email: response.email,
          name: response.name,
          type: response.type,
          status: response.status,
        }))
        
        // Set profile completion status (will be updated when profile API is connected)
        // For now, default to false
        localStorage.setItem('profileComplete', 'false')
        localStorage.setItem('hasProfile', 'false')
      }
      
      // Redirect to marketplace on success
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
