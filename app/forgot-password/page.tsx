'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { authService } from '@/services/auth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Call the forgot password service
      // Always shows success for security (don't reveal if email exists)
      await authService.forgotPassword(email)
      setIsSuccess(true)
    } catch {
      // Even on error, show success message for security
      // This prevents email enumeration attacks
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Success Message (50% width) */}
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
            <div className="mb-6">
              <img
                src="/vayada-logo.png"
                alt="Vayada"
                className="h-10 mb-4"
              />
            </div>

            {/* Success Content */}
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => router.push(ROUTES.LOGIN)}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-all"
                >
                  Back to Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Try a different email
                </button>
              </div>
            </div>
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

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form (50% width) */}
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
          <div className="mb-6">
            <img
              src="/vayada-logo.png"
              alt="Vayada"
              className="h-10 mb-4"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot password?</h1>
          <p className="text-gray-600 mb-8">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900 ${error ? 'border-red-300' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Error Message */}
            {error && !error.includes('email') && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            )}

            {/* Send Reset Link Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className={`
                w-full px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${isSubmitting || !email
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }
              `}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
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

