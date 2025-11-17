import { useState } from 'react'
import { Hotel } from '@/lib/types'
import { Button } from '@/components/ui'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { HotelDetailModal } from './HotelDetailModal'

interface HotelCardProps {
  hotel: Hotel
}

// Platform icons mapping
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('instagram')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }
  if (platformLower.includes('tiktok')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  }
  if (platformLower.includes('youtube') || platformLower.includes('yt')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  if (platformLower.includes('facebook')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
  return null
}

// Month abbreviation mapping
const getMonthAbbr = (month: string): string => {
  const monthMap: { [key: string]: string } = {
    'Januar': 'Jan',
    'Februar': 'Feb',
    'März': 'Mar',
    'April': 'Apr',
    'Mai': 'May',
    'Juni': 'Jun',
    'Juli': 'Jul',
    'August': 'Aug',
    'September': 'Sep',
    'Oktober': 'Oct',
    'November': 'Nov',
    'Dezember': 'Dec',
  }
  return monthMap[month] || month.substring(0, 3)
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const displayedMonths = hotel.availability?.slice(0, 3) || []
  const remainingMonths = (hotel.availability?.length || 0) - 3

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
        {hotel.images && hotel.images.length > 0 ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient if image fails
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-primary-600 text-4xl font-bold">
              {hotel.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {hotel.name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>{hotel.location}</span>
        </div>

        {/* Platforms */}
        {hotel.platforms && hotel.platforms.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-700 font-medium mb-2">Platforms:</div>
            <div className="flex flex-wrap gap-2">
              {hotel.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {getPlatformIcon(platform)}
                  <span>{platform === 'YT' ? 'YouTube' : platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {hotel.availability && hotel.availability.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-700 font-medium mb-2">Available:</div>
            <div className="flex flex-wrap gap-2">
              {displayedMonths.map((month, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1.5 bg-gray-800 text-white rounded-full text-sm font-medium"
                >
                  {getMonthAbbr(month)}
                </span>
              ))}
              {remainingMonths > 0 && (
                <span className="inline-block px-3 py-1.5 bg-gray-800 text-white rounded-full text-sm font-medium">
                  +{remainingMonths}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setIsModalOpen(true)}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              setIsModalOpen(true)
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
    <HotelDetailModal
      hotel={hotel}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  )
}

