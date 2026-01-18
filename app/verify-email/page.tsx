'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/lib/constants/routes'
import { getErrorMessage } from '@/lib/utils'
import { authService } from '@/services/auth'
import { ApiErrorResponse } from '@/services/api/client'
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('No verification token provided. Please check your email for the verification link.')
      setVerifying(false)
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token)
        if (response.verified) {
          setVerified(true)
          setEmail(response.email)

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push(ROUTES.LOGIN)
          }, 3000)
        } else {
          setError(response.message || 'Email verification failed. Please try again.')
        }
      } catch (error) {
        if (error instanceof ApiErrorResponse) {
          const detail = error.data.detail
          if (typeof detail === 'string') {
            setError(detail)
          } else {
            setError('Invalid or expired verification token. Please request a new verification link.')
          }
        } else {
          setError(getErrorMessage(error, 'Failed to verify email. Please try again.'))
        }
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Logo */}
          <div className="mb-6 text-center">
            <Image
              src="/vayada-logo.png"
              alt="Vayada"
              width={40}
              height={40}
              className="h-10 w-auto mx-auto mb-4"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Email Verification</h1>
          <p className="text-gray-600 mb-8 text-center">Verifying your email address...</p>

          {/* Loading State */}
          {verifying && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-600">Please wait while we verify your email...</p>
            </div>
          )}

          {/* Success State */}
          {!verifying && verified && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified Successfully!</h2>
              {email && (
                <p className="text-sm text-gray-600 mb-4">
                  Your email <span className="font-medium text-gray-900">{email}</span> has been verified.
                </p>
              )}
              <p className="text-sm text-gray-600 mb-6">
                Your account is now fully activated. Redirecting to login...
              </p>
              <Link
                href={ROUTES.LOGIN}
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Error State */}
          {!verifying && !verified && error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircleIcon className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Link
                  href={ROUTES.LOGIN}
                  className="block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                >
                  Go to Login
                </Link>
                <p className="text-xs text-gray-500">
                  If you need a new verification link, please complete your profile again or contact support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}

