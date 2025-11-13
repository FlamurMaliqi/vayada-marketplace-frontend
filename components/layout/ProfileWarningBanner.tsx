'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export function ProfileWarningBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if profile is complete
    const profileComplete = typeof window !== 'undefined' 
      ? localStorage.getItem('profileComplete') === 'true'
      : false
    
    // Check if banner was dismissed for this session
    const dismissed = typeof window !== 'undefined'
      ? sessionStorage.getItem('profileWarningDismissed') === 'true'
      : false

    // Show banner if profile is not complete and not dismissed
    if (!profileComplete && !dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('profileWarningDismissed', 'true')
    }
  }

  if (!isVisible) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md border border-yellow-200/60 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-yellow-900 mb-1">
                Complete Your Profile
              </h3>
              <p className="text-sm text-yellow-800 mb-4">
                You need to complete your profile before you can submit collaboration requests.
              </p>
              <Link href={ROUTES.PROFILE_EDIT}>
                <Button variant="primary" size="sm" className="shadow-sm">
                  Complete Profile
                </Button>
              </Link>
            </div>
            
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg p-2 transition-all"
              aria-label="Dismiss warning"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

