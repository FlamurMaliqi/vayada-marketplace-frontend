'use client'

import { useState } from 'react'

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>
  isSubmitting: boolean
  loginHref?: string
}

export default function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  loginHref = '/login',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    try {
      await onSubmit(email)
      setIsSuccess(true)
    } catch {
      // Always show success for security (anti-enumeration)
      setIsSuccess(true)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">
            Check your email for a password reset link. If an account exists with that email, you&apos;ll receive instructions shortly.
          </p>
        </div>
        <a
          href={loginHref}
          className="inline-block w-full text-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Sign In
        </a>
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
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          required
          placeholder="admin@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 ${
            emailError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <a href={loginHref} className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </form>
  )
}
