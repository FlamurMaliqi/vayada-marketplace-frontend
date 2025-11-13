import Link from 'next/link'
import { Hotel } from '@/lib/types'
import { Button } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
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
        {hotel.status === 'verified' && (
          <div className="absolute top-3 right-3">
            <div className="bg-white rounded-full p-1.5 shadow-md">
              <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
            {hotel.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{hotel.location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/hotels/${hotel.id}`} className="flex-1">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
            >
              View Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Send collaboration request
              console.log('Request collaboration with', hotel.id)
            }}
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}

