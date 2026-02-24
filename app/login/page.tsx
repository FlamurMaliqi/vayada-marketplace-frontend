'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import type { UserType } from '@/lib/types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionExpired, setSessionExpired] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true)
    }
  }, [searchParams])

  const handleLogin = async (email: string, password: string) => {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const response = await authService.login({ email, password })

      // Check profile status after login
      const userType = response.type as UserType
      if (userType === 'creator' || userType === 'hotel') {
        try {
          const profileStatus = await checkProfileStatus(userType)
          if (profileStatus && profileStatus.profile_complete) {
            localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true')
          } else if (profileStatus && !profileStatus.profile_complete) {
            localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'false')
            router.push(ROUTES.PROFILE_COMPLETE)
            return
          }
        } catch (error) {
          console.error('Failed to check profile status:', error)
        }
      }

      router.push(ROUTES.MARKETPLACE)
    } catch (error) {
      setIsSubmitting(false)

      if (error instanceof ApiErrorResponse) {
        if (error.status === 401) {
          setSubmitError('Invalid email or password')
        } else if (error.status === 403) {
          setSubmitError('Your account has been suspended. Please contact support.')
        } else if (error.status === 422) {
          const detail = error.data.detail
          if (Array.isArray(detail)) {
            setSubmitError(detail.map(e => e.msg).join('. '))
          } else {
            setSubmitError(detail as string || 'Validation error')
          }
        } else if (error.status === 500) {
          setSubmitError('Server error. Please try again later.')
        } else {
          setSubmitError(error.data.detail as string || 'Login failed. Please try again.')
        }
      } else {
        setSubmitError('Network error. Please check your connection and try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form (50% width) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
        {/* Back to Home Button */}
        <Link
          href={ROUTES.HOME}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/vayada-logo.png"
              alt="Vayada"
              className="h-12 mb-6"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>

          <LoginForm
            onSubmit={handleLogin}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onErrorClear={() => setSubmitError('')}
            sessionExpired={sessionExpired}
            registerHref={ROUTES.SIGNUP}
            registerLabel="Sign up"
            forgotPasswordHref={ROUTES.FORGOT_PASSWORD}
          />
        </div>
      </div>

      {/* Right Side - Image (50% width) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="/hotel-hero.JPG"
            alt="Luxury hotel resort"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
