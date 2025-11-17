'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
// Removed API imports - using mock data only for frontend design
import type { Hotel, Creator, UserType, HotelProfile } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/utils'
import {
  MapPinIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserCircleIcon,
  SparklesIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import {
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

interface ProfileInfo {
  email?: string
  avatar?: string
  name?: string
  type?: UserType
  status?: string
}

export default function ProfilePage() {
  const { isCollapsed } = useSidebar()
  const [userType, setUserType] = useState<UserType>('creator')
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // Hardcode userType for now - will be set by backend later
      // For testing: change 'hotel' to 'creator' to test creator profile
      const hardcodedUserType: UserType = 'hotel'
      
      // Set in localStorage for consistency
      if (typeof window !== 'undefined') {
        if (!localStorage.getItem('userType')) {
          localStorage.setItem('userType', hardcodedUserType)
        }
      }
      
      // Get user type from localStorage (in production, this would come from auth context)
      const storedUserType = typeof window !== 'undefined'
        ? (localStorage.getItem('userType') as UserType) || hardcodedUserType
        : hardcodedUserType
      
      setUserType(storedUserType)

      // Get user ID (in production, this would come from auth context)
      const userId = typeof window !== 'undefined'
        ? localStorage.getItem('userId') || '1'
        : '1'

      // Load profile info (email, avatar, etc.)
      // In production, this would come from the profiles table
      const profileData: ProfileInfo = {
        email: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'user@example.com' : 'user@example.com',
        avatar: typeof window !== 'undefined' ? localStorage.getItem('userAvatar') || undefined : undefined,
        name: typeof window !== 'undefined' ? localStorage.getItem('userName') || undefined : undefined,
        type: storedUserType,
        status: 'verified', // In production, get from profile
      }
      setProfileInfo(profileData)

      // Use mock data directly for frontend design
      if (storedUserType === 'hotel') {
        setHotelProfile(getMockHotelProfile(userId))
      } else {
        setCreator(getMockCreator(userId))
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <AuthenticatedNavigation />
        <div className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
          <div className="pt-16">
            <ProfileWarningBanner />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-64'} pt-16`}>
        <div className="pt-16">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              My Profile
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {userType === 'hotel' 
                ? 'View and manage your hotel profile'
                : 'View and manage your creator profile'}
            </p>
          </div>
          <Link href={ROUTES.PROFILE_EDIT}>
            <Button variant="primary" size="md" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Information Section */}
        {(hotelProfile || creator) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary-50/50 to-transparent hover:from-primary-50 transition-colors">
                {profileInfo.avatar ? (
                  <img
                    src={profileInfo.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md ring-4 ring-white">
                    <UserCircleIcon className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</div>
                  <div className="font-bold text-lg text-gray-900">{profileInfo.name || (hotelProfile?.name || creator?.name)}</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/50 to-transparent hover:from-gray-50 transition-colors">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Email</span>
                </div>
                <div className="font-bold text-lg text-gray-900">{profileInfo.email}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/50 to-transparent hover:from-gray-50 transition-colors">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Type</div>
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-100 text-primary-700 font-bold capitalize">
                  {profileInfo.type}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/50 to-transparent hover:from-gray-50 transition-colors">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900 capitalize">{hotelProfile?.status || creator?.status}</span>
                  {(hotelProfile?.status === 'verified' || creator?.status === 'verified') && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span className="text-xs font-semibold">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Profile */}
        {userType === 'hotel' && hotelProfile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
            {/* Header Section */}
              <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-16 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {hotelProfile.logo ? (
                  <img
                    src={hotelProfile.logo}
                    alt={hotelProfile.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white/90 shadow-2xl ring-4 ring-white/50"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-5xl shadow-2xl ring-4 ring-white/50 border-4 border-white/90">
                    {hotelProfile.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="text-4xl font-extrabold drop-shadow-lg">{hotelProfile.name}</h2>
                    {hotelProfile.status === 'verified' && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                  {hotelProfile.description && (
                    <p className="text-primary-100 text-lg mb-2">{hotelProfile.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-primary-100 text-sm font-medium">
                    <span>{hotelProfile.listings.length} {hotelProfile.listings.length === 1 ? 'Property' : 'Properties'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10">
              {/* Description */}
              {hotelProfile.description && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Über uns</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg pl-4">{hotelProfile.description}</p>
                </div>
              )}

              {/* Listings Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Meine Properties</h3>
                  </div>
                  <Link href={ROUTES.PROFILE_EDIT}>
                    <Button variant="primary" size="sm">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Property hinzufügen
                    </Button>
                  </Link>
                </div>
                {hotelProfile.listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4">
                    {hotelProfile.listings.map((listing) => (
                      <Link key={listing.id} href={`/hotels/${listing.id}`}>
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 cursor-pointer">
                          {/* Image */}
                          <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
                            {listing.images && listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-primary-600 text-4xl font-bold">
                                  {listing.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            {listing.status === 'verified' && (
                              <div className="absolute top-3 right-3">
                                <div className="bg-white rounded-full p-1.5 shadow-md">
                                  <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          <div className="p-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                              {listing.name}
                            </h4>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              <span>{listing.location}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {listing.description}
                            </p>
                            {listing.accommodationType && (
                              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold mb-2">
                                {listing.accommodationType}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 pl-4">
                    <p className="text-gray-500 mb-4">Noch keine Properties hinzugefügt</p>
                    <Link href={ROUTES.PROFILE_EDIT}>
                      <Button variant="primary" size="sm">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Erste Property hinzufügen
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-8 border-t border-gray-200">
                <div className="pl-4">
                  <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl p-4 max-w-md">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktiv seit</div>
                      <div className="font-semibold text-gray-900">{formatDate(hotelProfile.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Creator Profile */}
        {userType === 'creator' && creator && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-16 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {profileInfo.avatar ? (
                  <img
                    src={profileInfo.avatar}
                    alt={creator.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white/90 shadow-2xl ring-4 ring-white/50"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-5xl shadow-2xl ring-4 ring-white/50 border-4 border-white/90">
                    {creator.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="text-4xl font-extrabold drop-shadow-lg">{creator.name}</h2>
                    {creator.status === 'verified' && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-primary-100 text-lg font-medium">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    <span>{creator.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="group relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                      <UserGroupIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Reach</h3>
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900">
                    {formatNumber(creator.audienceSize)}
                  </p>
                </div>
                <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Platforms</h3>
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900">
                    {creator.platforms?.length || 0}
                  </p>
                </div>
                <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                      <CheckBadgeIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 capitalize">
                    {creator.status}
                  </p>
                </div>
              </div>

              {/* Niche */}
              {creator.niche && creator.niche.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Niche / Specialties</h3>
                  </div>
                  <div className="flex flex-wrap gap-3 pl-4">
                    {creator.niche.map((niche, index) => (
                      <span
                        key={index}
                        className="group px-5 py-2.5 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border border-primary-200/50 flex items-center gap-2"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {creator.platforms && creator.platforms.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Social Media Platforms</h3>
                  </div>
                  <div className="space-y-4 pl-4">
                    {creator.platforms.map((platform, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-bold text-gray-900">{platform.name}</h4>
                          <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">{platform.handle}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-4 bg-gradient-to-br from-primary-50 to-transparent rounded-xl">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Followers</div>
                            <div className="text-2xl font-extrabold text-gray-900">
                              {formatNumber(platform.followers)}
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-transparent rounded-xl">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Engagement Rate</div>
                            <div className="flex items-baseline gap-2">
                              <div className="text-2xl font-extrabold text-gray-900">
                                {platform.engagementRate.toFixed(1)}%
                              </div>
                              <div className="flex items-center text-green-600">
                                <StarIconSolid className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-8 border-t border-gray-200">
                <div className="pl-4">
                  <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl p-4 max-w-md">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Since</div>
                      <div className="font-semibold text-gray-900">{formatDate(creator.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Profile State */}
        {!hotelProfile && !creator && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">No Profile Found</h3>
              <p className="text-gray-600 mb-8 text-lg">
                You haven't created a profile yet. Create one to start collaborating!
              </p>
              <Link href={ROUTES.PROFILE_EDIT}>
                <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Create Profile
                </Button>
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

// Mock data for development
function getMockHotelProfile(id: string): HotelProfile {
  return {
    id: 'profile-1',
    userId: id,
    name: 'Luxury Villa Management',
    description: 'Wir sind eine führende Villa-Management-Agentur mit über 15 exklusiven Properties in den schönsten Destinationen weltweit.',
    logo: undefined,
    listings: [
      {
        id: '1',
        hotelProfileId: 'profile-1',
        name: 'Sunset Beach Villa',
        location: 'Bali, Indonesia',
        description: 'Luxuriöse Strandvilla mit atemberaubendem Meerblick und erstklassigen Annehmlichkeiten.',
        images: ['/hotel1.jpg'],
        accommodationType: 'Villa',
        collaborationType: 'Kostenlos',
        availability: ['Juni', 'Juli', 'August', 'September'],
        status: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        hotelProfileId: 'profile-1',
        name: 'Mountain View Lodge',
        location: 'Swiss Alps, Switzerland',
        description: 'Gemütliche Alpenlodge perfekt für Abenteuerlustige und Naturliebhaber.',
        images: ['/hotel2.jpg'],
        accommodationType: 'Lodge',
        collaborationType: 'Bezahlt',
        availability: ['Dezember', 'Januar', 'Februar', 'März'],
        status: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        hotelProfileId: 'profile-1',
        name: 'Urban Boutique Apartment',
        location: 'Tokyo, Japan',
        description: 'Modernes Boutique-Apartment im Herzen von Tokyo mit minimalistischem Design.',
        images: ['/hotel3.jpg'],
        accommodationType: 'Apartment',
        collaborationType: 'Kostenlos',
        availability: ['März', 'April', 'Mai', 'Juni'],
        status: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function getMockCreator(id: string): Creator {
  return {
    id,
    name: 'Sarah Travels',
    niche: ['Luxury Travel', 'Beach Destinations', 'Adventure'],
    platforms: [
      {
        name: 'Instagram',
        handle: '@sarahtravels',
        followers: 125000,
        engagementRate: 4.2,
      },
      {
        name: 'YouTube',
        handle: '@sarahtravels',
        followers: 45000,
        engagementRate: 6.8,
      },
    ],
    audienceSize: 170000,
    location: 'Bali, Indonesia',
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

