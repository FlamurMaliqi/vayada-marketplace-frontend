'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isSubmitting: boolean
  submitError: string
  onErrorClear: () => void
  showForgotPassword?: boolean
  forgotPasswordHref?: string
  showRegister?: boolean
  registerHref?: string
  registerLabel?: string
  sessionExpired?: boolean
}

export default function LoginForm({
  onSubmit,
  isSubmitting,
  submitError,
  onErrorClear,
  showForgotPassword = true,
  forgotPasswordHref = '/forgot-password',
  showRegister = true,
  registerHref = '/register',
  registerLabel = 'Sign up',
  sessionExpired = false,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    onErrorClear()

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    await onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {sessionExpired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Your session has expired. Please login again.
          </p>
        </div>
      )}

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
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 ${
            emailError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
          }`}
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 text-sm text-gray-900"
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
        {showForgotPassword && (
          <div className="mt-2 text-right">
            <a href={forgotPasswordHref} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </a>
          </div>
        )}
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-800 font-semibold">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>

      {/* Register Link */}
      {showRegister && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href={registerHref} className="text-primary-600 hover:text-primary-700 font-medium">
              {registerLabel}
            </a>
          </p>
        </div>
      )}
    </form>
  )
}
