'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { authService } from '@/services/auth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResetPassword = async (token: string, password: string) => {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await authService.resetPassword(token, password)
    } catch (error) {
      setIsSubmitting(false)

      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError('Something went wrong. Please try again or request a new reset link.')
      }

      throw error
    } finally {
      setIsSubmitting(false)
    }
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
            Enter your new password below. Make sure it&apos;s strong and secure.
          </p>

          <ResetPasswordForm
            onSubmit={handleResetPassword}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onErrorClear={() => setSubmitError('')}
            loginHref={ROUTES.LOGIN}
            forgotPasswordHref={ROUTES.FORGOT_PASSWORD}
            onSuccess={() => router.push(ROUTES.LOGIN)}
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
