'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { hotelService, creatorService } from '@/services/api'
import type { Hotel, Creator, UserType } from '@/lib/types'
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
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface ProfileInfo {
  email?: string
  avatar?: string
  name?: string
  type?: UserType
  status?: string
}

export default function ProfilePage() {
  const [userType, setUserType] = useState<UserType>('creator')
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // Get user type from localStorage (in production, this would come from auth context)
      const storedUserType = typeof window !== 'undefined'
        ? (localStorage.getItem('userType') as UserType) || 'creator'
        : 'creator'
      
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

      if (storedUserType === 'hotel') {
        try {
          const hotelData = await hotelService.getById(userId)
          setHotel(hotelData)
        } catch (error) {
          console.error('Error loading hotel profile:', error)
          // Use mock data for development
          setHotel(getMockHotel(userId))
        }
      } else {
        try {
          const creatorData = await creatorService.getById(userId)
          setCreator(creatorData)
        } catch (error) {
          console.error('Error loading creator profile:', error)
          // Use mock data for development
          setCreator(getMockCreator(userId))
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <ProfileWarningBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      <ProfileWarningBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              {userType === 'hotel' 
                ? 'View and manage your hotel profile'
                : 'View and manage your creator profile'}
            </p>
          </div>
          <Link href={ROUTES.PROFILE_EDIT}>
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Information Section */}
        {(hotel || creator) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {profileInfo.avatar ? (
                  <img
                    src={profileInfo.avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-primary-600" />
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium text-gray-900">{profileInfo.name || (hotel?.name || creator?.name)}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="font-medium text-gray-900">{profileInfo.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Account Type</div>
                <div className="font-medium text-gray-900 capitalize">{profileInfo.type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 capitalize">{hotel?.status || creator?.status}</span>
                  {(hotel?.status === 'verified' || creator?.status === 'verified') && (
                    <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Profile */}
        {userType === 'hotel' && hotel && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12">
              <div className="flex items-center gap-6">
                {profileInfo.avatar ? (
                  <img
                    src={profileInfo.avatar}
                    alt={hotel.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold text-4xl shadow-lg">
                    {hotel.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{hotel.name}</h2>
                    {hotel.status === 'verified' && (
                      <CheckBadgeIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex items-center text-primary-100">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-lg">{hotel.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {hotel.images && hotel.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${hotel.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created: {formatDate(hotel.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Last Updated: {formatDate(hotel.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Creator Profile */}
        {userType === 'creator' && creator && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12">
              <div className="flex items-center gap-6">
                {profileInfo.avatar ? (
                  <img
                    src={profileInfo.avatar}
                    alt={creator.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold text-4xl shadow-lg">
                    {creator.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{creator.name}</h2>
                    {creator.status === 'verified' && (
                      <CheckBadgeIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex items-center text-primary-100">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-lg">{creator.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserGroupIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-sm font-medium text-gray-600">Total Reach</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(creator.audienceSize)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <ChartBarIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-sm font-medium text-gray-600">Platforms</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {creator.platforms?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckBadgeIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-sm font-medium text-gray-600">Status</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {creator.status}
                  </p>
                </div>
              </div>

              {/* Niche */}
              {creator.niche && creator.niche.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Niche / Specialties</h3>
                  <div className="flex flex-wrap gap-3">
                    {creator.niche.map((niche, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {creator.platforms && creator.platforms.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media Platforms</h3>
                  <div className="space-y-4">
                    {creator.platforms.map((platform, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-gray-900">{platform.name}</h4>
                          <span className="text-sm text-gray-500">{platform.handle}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Followers</div>
                            <div className="text-xl font-bold text-gray-900">
                              {formatNumber(platform.followers)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Engagement Rate</div>
                            <div className="text-xl font-bold text-gray-900">
                              {platform.engagementRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created: {formatDate(creator.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Last Updated: {formatDate(creator.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Profile State */}
        {!hotel && !creator && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Profile Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't created a profile yet. Create one to start collaborating!
            </p>
            <Link href={ROUTES.PROFILE_EDIT}>
              <Button variant="primary" size="lg">
                Create Profile
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

// Mock data for development
function getMockHotel(id: string): Hotel {
  return {
    id,
    name: 'Sunset Beach Resort',
    location: 'Bali, Indonesia',
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities. Perfect for creators looking for an authentic travel experience.',
    images: [],
    amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'WiFi', 'Gym'],
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

