'use client'

import { useState } from 'react'
import { Creator } from '@/lib/types'
import { Button, StarRating } from '@/components/ui'
import { formatNumber } from '@/lib/utils'
import {
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { HotelInvitationModal, type HotelInvitationData } from './HotelInvitationModal'

interface CreatorDetailModalProps {
  creator: Creator | null
  isOpen: boolean
  onClose: () => void
}

// Platform icons mapping
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('instagram')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }
  if (platformLower.includes('tiktok')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  }
  if (platformLower.includes('youtube') || platformLower.includes('yt')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  if (platformLower.includes('facebook')) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
  return null
}

// Format number with K suffix
const formatFollowers = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// Get country flag emoji
const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    'Germany': '🇩🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    'Canada': '🇨🇦',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Singapore': '🇸🇬',
    'Thailand': '🇹🇭',
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'Philippines': '🇵🇭',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'South Africa': '🇿🇦',
    'UAE': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'Qatar': '🇶🇦',
    'Kuwait': '🇰🇼',
    'Egypt': '🇪🇬',
  }
  return countryFlags[country] || '🏳️'
}

// Get time ago string
const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'less than a minute ago'
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}

export function CreatorDetailModal({ creator, isOpen, onClose }: CreatorDetailModalProps) {
  const [showInvitationModal, setShowInvitationModal] = useState(false)

  // Mock hotel listings - in production, this would come from the logged-in hotel's profile
  const mockListings = [
    { id: 'listing-1', name: 'Luxury Beach Villa', location: 'Bali, Indonesia' },
    { id: 'listing-2', name: 'Mountain Resort', location: 'Swiss Alps, Switzerland' },
  ]

  if (!isOpen || !creator) return null

  const handleInviteClick = () => {
    setShowInvitationModal(true)
  }

  const handleInvitationSubmit = (data: HotelInvitationData) => {
    // TODO: Implement actual invitation submission logic
    console.log('Invitation submitted:', data)
    setShowInvitationModal(false)
  }

  // Calculate total followers and average engagement
  const totalFollowers = creator.platforms.reduce((sum, platform) => sum + platform.followers, 0)
  const avgEngagementRate = creator.platforms.reduce((sum, platform) => sum + platform.engagementRate, 0) / creator.platforms.length

  // Get primary platform handle (first platform's handle)
  const primaryHandle = creator.platforms.length > 0 
    ? creator.platforms[0].handle.replace('@', '') 
    : ''

  // Generate about description
  const getAboutDescription = () => {
    return 'Content creator sharing unique experiences and insights.'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header Section */}
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {creator.name.charAt(0)}
            </div>

            {/* Name and Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{creator.name}</h2>
              <p className="text-gray-600 mb-3">@{primaryHandle}</p>

              {/* Platform Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {creator.platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {getPlatformIcon(platform.name)}
                    <span>{platform.name === 'YT' ? 'YouTube' : platform.name}</span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              {creator.rating && (
                <div className="mb-4">
                  <StarRating
                    rating={creator.rating.averageRating}
                    totalReviews={creator.rating.totalReviews}
                    size="lg"
                  />
                </div>
              )}

              {/* Key Metrics */}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{formatFollowers(totalFollowers)}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{avgEngagementRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>{creator.location}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">
              {getAboutDescription()}
            </p>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Social Links</h3>
            <div className="flex gap-3">
              {creator.platforms.map((platform, index) => (
                <a
                  key={index}
                  href={`https://${platform.name.toLowerCase()}.com/${platform.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                  title={platform.name}
                >
                  {getPlatformIcon(platform.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Portfolio Link Section */}
          {creator.portfolioLink && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h3>
              <a
                href={creator.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View Portfolio</span>
              </a>
            </div>
          )}

          {/* Platform Metrics Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Platform Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creator.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  {/* Platform Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="text-gray-700">
                      {getPlatformIcon(platform.name)}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {platform.name === 'YT' ? 'YouTube' : platform.name}
                    </h4>
                  </div>

                  {/* Followers and Engagement */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Followers</div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(platform.followers)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Engagement</div>
                      <div className="text-2xl font-bold text-gray-900">{platform.engagementRate.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Top Countries */}
                  {platform.topCountries && platform.topCountries.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Top Countries</div>
                      <ul className="space-y-2">
                        {platform.topCountries.map((country, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-lg">{getCountryFlag(country.country)}</span>
                            <span className="text-sm text-gray-700">{country.country}: <span className="font-semibold text-gray-900">{country.percentage}%</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Top Age Groups */}
                  {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Top Age Groups</div>
                      <ul className="space-y-2">
                        {platform.topAgeGroups.map((ageGroup, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {ageGroup.ageRange}: <span className="font-semibold text-gray-900">{ageGroup.percentage}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gender Split */}
                  {platform.genderSplit && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Gender Split</div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-700">Male: <span className="font-semibold text-gray-900">{platform.genderSplit.male}%</span></div>
                        <div className="text-sm text-gray-700">Female: <span className="font-semibold text-gray-900">{platform.genderSplit.female}%</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          {creator.rating && creator.rating.reviews && creator.rating.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Reviews ({creator.rating.totalReviews})
              </h3>
              <div className="space-y-4">
                {creator.rating.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.hotelName}</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(review.createdAt)}
                        </p>
                      </div>
                      <StarRating
                        rating={review.rating}
                        size="sm"
                        showNumber={false}
                        showReviews={false}
                      />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer with Last Updated and Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated {getTimeAgo(creator.updatedAt)}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleInviteClick}
            >
              Invite to Collaborate
            </Button>
          </div>
        </div>
      </div>

      {/* Hotel Invitation Modal */}
      <HotelInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        onSubmit={handleInvitationSubmit}
        creatorName={creator.name}
        listings={mockListings}
      />
    </div>
  )
}

