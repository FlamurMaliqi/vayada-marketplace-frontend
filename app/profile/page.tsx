'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { Button, Input } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

type UserType = 'hotel' | 'creator'

interface Platform {
  name: string
  handle: string
  followers: number
  engagementRate: number
}

// Mock data for Creator Profile
interface CreatorProfile {
  id: string
  name: string
  profilePicture?: string
  shortDescription: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
  rating: number // 1-5 stars
  totalRatings: number
  platforms: Platform[]
  portfolioLink?: string
  email: string
  phone?: string
}

// Mock data for Hotel Profile
interface HotelProfile {
  id: string
  name: string
  picture?: string
  category: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
}

type CreatorTab = 'overview' | 'platforms'
type HotelTab = 'overview' | 'about' | 'offering' | 'looking-for' | 'contact'

export default function ProfilePage() {
  const { isCollapsed } = useSidebar()
  const [userType, setUserType] = useState<UserType>('creator')
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCreatorTab, setActiveCreatorTab] = useState<CreatorTab>('overview')
  const [activeHotelTab, setActiveHotelTab] = useState<HotelTab>('overview')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [userType])

  useEffect(() => {
    if (creatorProfile?.email) {
      setEmail(creatorProfile.email)
    }
    if (creatorProfile?.phone) {
      setPhone(creatorProfile.phone)
    }
  }, [creatorProfile])

  const loadProfile = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (userType === 'creator') {
        setCreatorProfile({
          id: '1',
          name: 'Sarah Travels',
          shortDescription: 'Luxury travel & lifestyle creator focusing on boutique hotels and unique experiences.',
          location: 'Los Angeles, USA',
          status: 'verified',
          rating: 4.5,
          totalRatings: 12,
          platforms: [
            {
              name: 'Instagram',
              handle: '@sarahtravels',
              followers: 125000,
              engagementRate: 4.2,
            },
            {
              name: 'TikTok',
              handle: '@sarahtravels',
              followers: 89000,
              engagementRate: 8.5,
            },
            {
              name: 'YouTube',
              handle: '@sarahtravels',
              followers: 45000,
              engagementRate: 6.8,
            },
            {
              name: 'Facebook',
              handle: '@sarahtravels',
              followers: 32000,
              engagementRate: 3.2,
            },
            {
              name: 'Blog/Website',
              handle: 'sarahtravels.com',
              followers: 15000,
              engagementRate: 5.1,
            },
          ],
          portfolioLink: 'https://sarahtravels.com/portfolio',
          email: 'sarah.travels@example.com',
          phone: '+1 (555) 123-4567',
        })
      } else {
        setHotelProfile({
          id: '1',
          name: 'Luxury Villa Management',
          category: 'Resort',
          location: 'Bali, Indonesia',
          status: 'verified',
        })
      }
      setLoading(false)
    }, 300)
  }

  // Platform Icon Component
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase()
    if (platformLower.includes('instagram')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    }
    if (platformLower.includes('tiktok')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    }
    if (platformLower.includes('youtube') || platformLower.includes('yt')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
    if (platformLower.includes('facebook')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
    if (platformLower.includes('blog') || platformLower.includes('website')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
    return null
  }

  // Format followers with German number format (22.000)
  const formatFollowersDE = (num: number): string => {
    return new Intl.NumberFormat('de-DE').format(num)
  }

  const handleSaveContact = async () => {
    if (!email || !email.includes('@')) {
      return
    }
    
    setIsSavingContact(true)
    // Simulate API call
    setTimeout(() => {
      if (creatorProfile) {
        setCreatorProfile({
          ...creatorProfile,
          email: email,
          phone: phone,
        })
      }
      setIsEditingContact(false)
      setIsSavingContact(false)
      // In production, make API call to save contact information
    }, 500)
  }

  // Star Rating Component
  const StarRating = ({ rating, totalRatings }: { rating: number; totalRatings: number }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[...Array(fullStars)].map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <div className="relative">
              <StarIconOutline className="w-5 h-5 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <StarIcon className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <StarIconOutline key={i} className="w-5 h-5 text-gray-300" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">({totalRatings} ratings)</span>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Profile
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-6">
              Manage your profile information
            </p>

            {/* User Type Toggle */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/50 w-fit">
              <button
                onClick={() => setUserType('creator')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  userType === 'creator'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Creator Profile
              </button>
              <button
                onClick={() => setUserType('hotel')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  userType === 'hotel'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Hotel Profile
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Creator Profile Tabs */}
              {userType === 'creator' && creatorProfile && (
                <>
                  {/* Tab Navigation */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 w-fit">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveCreatorTab('overview')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeCreatorTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveCreatorTab('platforms')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeCreatorTab === 'platforms'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Social Media Platforms
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Overview Tab */}
                    {activeCreatorTab === 'overview' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                        </div>

                  <div className="flex items-start gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {creatorProfile.profilePicture ? (
                        <img
                          src={creatorProfile.profilePicture}
                          alt={creatorProfile.name}
                          className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-gray-100">
                          {creatorProfile.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Profile Information */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold text-gray-900">{creatorProfile.name}</h3>
                        {creatorProfile.status === 'verified' && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                            <CheckBadgeIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold">Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPinIcon className="w-5 h-5" />
                        <span className="text-lg">{creatorProfile.location}</span>
                      </div>

                      {/* Rating */}
                      <div className="mb-4">
                        <StarRating rating={creatorProfile.rating} totalRatings={creatorProfile.totalRatings} />
                      </div>

                      {/* Short Description */}
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Description
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {creatorProfile.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    </div>

                    <div className="space-y-6">
                      {!isEditingContact ? (
                        <div className="space-y-4">
                          {/* Email Display */}
                          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <label className="text-sm font-medium text-gray-700">E-Mail</label>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 ml-8">{email || 'Not provided'}</p>
                          </div>

                          {/* Phone Display */}
                          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <label className="text-sm font-medium text-gray-700">Telefon</label>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 ml-8">{phone || 'Not provided'}</p>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setIsEditingContact(true)}
                            className="w-full sm:w-auto"
                          >
                            Edit Contact Information
                          </Button>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                          <div>
                            <Input
                              label="E-Mail"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="your.email@example.com"
                              required
                              helperText="Your email address for contact"
                            />
                          </div>
                          <div>
                            <Input
                              label="Telefon (optional)"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              helperText="Your phone number for contact"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="primary"
                              onClick={handleSaveContact}
                              isLoading={isSavingContact}
                              disabled={!email || !email.includes('@')}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditingContact(false)
                                if (creatorProfile?.email) {
                                  setEmail(creatorProfile.email)
                                }
                                if (creatorProfile?.phone) {
                                  setPhone(creatorProfile.phone)
                                }
                              }}
                              disabled={isSavingContact}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                      </div>
                    )}

                    {/* Social Media Platforms Tab */}
                    {activeCreatorTab === 'platforms' && creatorProfile.platforms && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Social Media Platforms</h2>
                        </div>

                        <div className="space-y-4">
                          {creatorProfile.platforms.map((platform, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              {/* Platform Icon */}
                              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center text-gray-700 border border-gray-200">
                                {getPlatformIcon(platform.name)}
                              </div>

                              {/* Platform Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="font-medium">{platform.handle}</span>
                                  <span className="text-gray-400">•</span>
                                  <span>{formatFollowersDE(platform.followers)} Follower</span>
                                  <span className="text-gray-400">•</span>
                                  <span>{platform.engagementRate.toFixed(1).replace('.', ',')}% Engagement</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Hotel Profile Tabs */}
              {userType === 'hotel' && hotelProfile && (
                <>
                  {/* Tab Navigation */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveHotelTab('overview')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveHotelTab('about')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'about'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        About
                      </button>
                      <button
                        onClick={() => setActiveHotelTab('offering')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'offering'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Offering
                      </button>
                      <button
                        onClick={() => setActiveHotelTab('looking-for')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'looking-for'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Looking For
                      </button>
                      <button
                        onClick={() => setActiveHotelTab('contact')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'contact'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Contact Information
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {activeHotelTab === 'overview' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                        </div>
                        <p className="text-gray-600">Hotel profile overview will be implemented here.</p>
                      </div>
                    )}
                    {activeHotelTab === 'about' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">About</h2>
                        </div>
                        <p className="text-gray-600">About section will be implemented here.</p>
                      </div>
                    )}
                    {activeHotelTab === 'offering' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Offering</h2>
                        </div>
                        <p className="text-gray-600">Offering section will be implemented here.</p>
                      </div>
                    )}
                    {activeHotelTab === 'looking-for' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Looking For</h2>
                        </div>
                        <p className="text-gray-600">Looking For section will be implemented here.</p>
                      </div>
                    )}
                    {activeHotelTab === 'contact' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                        </div>
                        <p className="text-gray-600">Contact information section will be implemented here.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
