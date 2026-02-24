'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface ResetPasswordFormProps {
  onSubmit: (token: string, password: string) => Promise<void>
  isSubmitting: boolean
  submitError: string
  onErrorClear: () => void
  loginHref?: string
  forgotPasswordHref?: string
  onSuccess?: () => void
}

function ResetPasswordFormInner({
  onSubmit,
  isSubmitting,
  submitError,
  onErrorClear,
  loginHref = '/login',
  forgotPasswordHref = '/forgot-password',
  onSuccess,
}: ResetPasswordFormProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isSuccess && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onSuccess])

  if (!token) {
    return (
      <div className="text-center space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">
            Invalid or missing reset token. Please request a new password reset link.
          </p>
        </div>
        <a
          href={forgotPasswordHref}
          className="inline-block w-full text-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Request New Reset Link
        </a>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">
            Password reset successful! Redirecting to sign in...
          </p>
        </div>
        <a
          href={loginHref}
          className="inline-block w-full text-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Sign In
        </a>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof localErrors = {}
    onErrorClear()

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors)
      return
    }

    setLocalErrors({})

    try {
      await onSubmit(token, password)
      setIsSuccess(true)
    } catch {
      // Error handled by parent via submitError prop
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (localErrors.password) setLocalErrors(prev => ({ ...prev, password: undefined }))
            }}
            required
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
        {localErrors.password && (
          <p className="mt-1 text-sm text-red-600">{localErrors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (localErrors.confirmPassword) setLocalErrors(prev => ({ ...prev, confirmPassword: undefined }))
            }}
            required
            placeholder="Confirm your password"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 text-sm text-gray-900"
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
        {localErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{localErrors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Error */}
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
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
  return (
    <Suspense fallback={
      <div className="text-center text-sm text-gray-500">Loading...</div>
    }>
      <ResetPasswordFormInner {...props} />
    </Suspense>
  )
}
