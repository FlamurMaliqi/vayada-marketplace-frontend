'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { getErrorMessage } from '@/lib/utils'
import { authService } from '@/services/auth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
    } else {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user types
    if (error) setError('')
    if (passwordError) setPasswordError('')
  }

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return 'Password must contain at least one number'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPasswordError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password)
    if (passwordValidation) {
      setPasswordError(passwordValidation)
      return
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.resetPassword(token, formData.password)
      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN)
      }, 3000)
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again or request a new reset link.'))
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
                <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800">
                  <strong>Ready to sign in?</strong> Use your new password to access your account.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => router.push(ROUTES.LOGIN)}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-all"
                >
                  Go to Sign In
                </button>
                <p className="text-sm text-gray-500">
                  Redirecting to sign in page in 3 seconds...
                </p>
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

  if (!token && !error) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Loading (50% width) */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600 mx-auto"></div>
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
      {/* Left Side - Reset Password Form (50% width) */}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reset password</h1>
          <p className="text-gray-600 mb-8">
            Enter your new password below. Make sure it's strong and secure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            )}

            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your new password"
                autoComplete="new-password"
                disabled={isSubmitting || !token}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900 ${passwordError ? 'border-red-300' : 'border-gray-300'
                  } ${isSubmitting || !token ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={isSubmitting || !token}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900 ${passwordError ? 'border-red-300' : 'border-gray-300'
                  } ${isSubmitting || !token ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isSubmitting || !token || !formData.password || !formData.confirmPassword}
              className={`
                w-full px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${isSubmitting || !token || !formData.password || !formData.confirmPassword
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }
              `}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href={ROUTES.LOGIN}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Need a new reset link?{' '}
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Request another
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex">
        {/* Left Side - Loading (50% width) */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600 mx-auto"></div>
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
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

