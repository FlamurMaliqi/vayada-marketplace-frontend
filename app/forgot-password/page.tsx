'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { authService } from '@/services/auth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleForgotPassword = async (email: string) => {
    setIsSubmitting(true)
    try {
      await authService.forgotPassword(email)
    } finally {
      setIsSubmitting(false)
    }
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
            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            isSubmitting={isSubmitting}
            loginHref={ROUTES.LOGIN}
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
