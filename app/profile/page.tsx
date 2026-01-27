'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { STORAGE_KEYS } from '@/lib/constants'
import { CreatorProfile } from '@/components/profile/creator'
import { HotelProfile } from '@/components/profile/hotel'
import type { UserType } from '@/components/profile/types'

export default function ProfilePage() {
  const { isCollapsed } = useSidebar()

  const [userType, setUserType] = useState<UserType>(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType | null
      if (storedUserType && (storedUserType === 'creator' || storedUserType === 'hotel')) {
        return storedUserType
      }
    }
    return 'creator'
  })

  useEffect(() => {
    const storedUserType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType | null
    if (storedUserType && (storedUserType === 'creator' || storedUserType === 'hotel')) {
      setUserType(storedUserType)
    }
  }, [])

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-7xl mx-auto pt-4 pb-8" style={{ paddingLeft: 'clamp(0.5rem, 3%, 3rem)', paddingRight: '2rem' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Profile
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-6">
              Manage your profile information
            </p>
          </div>

          {userType === 'creator' && <CreatorProfile />}
          {userType === 'hotel' && <HotelProfile />}
        </div>
      </div>
    </main>
  )
}
