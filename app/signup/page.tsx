'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { UserType } from '@/lib/types'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  // Email verification state
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [codeSendError, setCodeSendError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null) // in seconds

  // Set user type from URL query parameter if present
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'creator' || type === 'hotel') {
      setFormData(prev => ({ ...prev, userType: type as UserType }))
    }
  }, [searchParams])

  // Countdown timer for verification code expiration (15 minutes = 900 seconds)
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) {
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

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
      // Reset verification when email changes
      if (isEmailVerified) {
        setIsEmailVerified(false)
        setIsCodeSent(false)
        setVerificationCode('')
      }
    }
    if (name === 'verificationCode' && verificationError) {
      setVerificationError('')
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSendVerificationCode = async () => {
    // Validate email first
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setCodeSendError('')
    setIsSendingCode(true)
    setVerificationCode('')
    setVerificationError('')
    setIsEmailVerified(false)

    try {
      await authService.sendVerificationCode(formData.email)
      setIsCodeSent(true)
      setTimeRemaining(900) // 15 minutes = 900 seconds
    } catch (error: any) {
      setCodeSendError(error.message || 'Failed to send verification code. Please try again.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code')
      return
    }

    setVerificationError('')
    setIsVerifyingCode(true)

    try {
      const response = await authService.verifyEmailCode(formData.email, verificationCode.trim())
      if (response.verified) {
        setIsEmailVerified(true)
        setVerificationError('')
      } else {
        setVerificationError('Invalid verification code. Please try again.')
      }
    } catch (error: any) {
      setVerificationError(error.message || 'Invalid verification code. Please try again.')
    } finally {
      setIsVerifyingCode(false)
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

    // Validate terms acceptance
    if (!termsAccepted) {
      setSubmitError('You must agree to the Terms & Privacy to continue')
      return
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Note: Email verification is optional but recommended
    // We'll proceed with registration even if not verified

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
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form (50% width) */}
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
              src="/vayada-logo.svg"
              alt="Vayada"
              className="h-10 mb-4 rounded-lg"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign up</h1>
          <p className="text-gray-600 mb-8">Enter your credentials to create your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'creator' }))}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border transition-all font-medium text-sm flex items-center justify-center gap-2
                    ${formData.userType === 'creator'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                    }
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Creator
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'hotel' }))}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border transition-all font-medium text-sm flex items-center justify-center gap-2
                    ${formData.userType === 'hotel'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
                    }
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Hotel
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isEmailVerified}
                  className={`flex-1 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900 ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  } ${isEmailVerified ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {isEmailVerified && (
                  <div className="flex items-center px-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
              
              {/* Send Verification Code Button */}
              {!isEmailVerified && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={!validateEmail(formData.email) || isSendingCode}
                    className={`
                      text-sm font-medium transition-colors
                      ${!validateEmail(formData.email) || isSendingCode
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-primary-600 hover:text-primary-700'
                      }
                    `}
                  >
                    {isSendingCode ? 'Sending...' : isCodeSent ? 'Resend verification code' : 'Send verification code'}
                  </button>
                  {codeSendError && (
                    <p className="mt-1 text-sm text-red-600">{codeSendError}</p>
                  )}
                  {isCodeSent && timeRemaining !== null && timeRemaining > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      Code expires in {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                  {isCodeSent && timeRemaining === 0 && (
                    <p className="mt-1 text-xs text-red-600">Code expired. Please request a new code.</p>
                  )}
                </div>
              )}

              {/* Verification Code Input */}
              {isCodeSent && !isEmailVerified && (
                <div className="mt-3">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="verificationCode"
                      type="text"
                      name="verificationCode"
                      value={verificationCode}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '')
                        setVerificationCode(value)
                        if (verificationError) setVerificationError('')
                      }}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      disabled={timeRemaining === 0}
                      className={`flex-1 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-gray-900 ${
                        verificationError ? 'border-red-300' : 'border-gray-300'
                      } ${timeRemaining === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={!verificationCode.trim() || isVerifyingCode || timeRemaining === 0 || verificationCode.length !== 6}
                      className={`
                        px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                        ${!verificationCode.trim() || isVerifyingCode || timeRemaining === 0 || verificationCode.length !== 6
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                        }
                      `}
                    >
                      {isVerifyingCode ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  {verificationError && (
                    <p className="mt-1 text-sm text-red-600">{verificationError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="min 8 characters"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white pr-12 text-gray-900 ${passwordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white pr-12 text-gray-900 ${confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
              )}
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-full"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <Link href={ROUTES.TERMS} className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms
                  </Link>
                  {' '}&{' '}
                  <Link href={ROUTES.PRIVACY} className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy
                  </Link>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold">{submitError}</p>
              </div>
            )}

            {/* Email Verification Status */}
            {isEmailVerified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-800 font-medium">✓ Email verified successfully</p>
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className={`
                w-full px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${isSubmitting || !termsAccepted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }
              `}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            {!isEmailVerified && isCodeSent && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Email verification is optional but recommended
              </p>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have an account?{' '}
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
            src="/signup-hero.jpg"
            alt="Luxury resort with hot tub and caldera view"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-12 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 bg-gray-200"></div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
