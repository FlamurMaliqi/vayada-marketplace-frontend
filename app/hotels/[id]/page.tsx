'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthenticatedNavigation, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import { hotelService } from '@/services/api'
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel } from '@/lib/types'
import {
  MapPinIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    loadHotel()
  }, [params.id])

  const loadHotel = async () => {
    if (!params.id || typeof params.id !== 'string') return
    
    setLoading(true)
    try {
      const hotelData = await hotelService.getById(params.id)
      setHotel(hotelData)
    } catch (error) {
      console.error('Error loading hotel:', error)
      // For development, use mock data
      setHotel(getMockHotel(params.id))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h1>
          <Link href={ROUTES.MARKETPLACE}>
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
                  {hotel.status === 'verified' && (
                    <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg">{hotel.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {hotel.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  console.log('Request collaboration with', hotel.id)
                  // TODO: Implement collaboration request
                }}
              >
                Request Collaboration
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  console.log('Contact hotel', hotel.id)
                  // TODO: Implement contact functionality
                }}
              >
                Contact Hotel
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {hotel.images && hotel.images.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-96 bg-gradient-to-br from-primary-100 to-primary-200">
                  <img
                    src={hotel.images[selectedImageIndex] || hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                {hotel.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {hotel.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary-600 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${hotel.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">
                    {hotel.name.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-500">No images available</p>
              </div>
            )}

            {/* Amenities Section */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  {hotel.description}
                </p>
                <p>
                  This property is verified and ready to collaborate with travel creators
                  and influencers. Connect directly to discuss partnership opportunities
                  and create authentic content that showcases the unique experience this
                  hotel offers.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="text-gray-900 font-medium">{hotel.location}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckBadgeIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-gray-900 font-medium capitalize">{hotel.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                  Request Call
                </button>
              </div>
            </div>

            {/* Similar Hotels */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More</h3>
              <Link href={ROUTES.MARKETPLACE}>
                <Button variant="outline" size="md" className="w-full">
                  Browse All Hotels
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Mock data for development
function getMockHotel(id: string): Hotel {
  const mockHotels: Record<string, Hotel> = {
    '1': {
      id: '1',
      name: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      description: 'Luxury beachfront resort with stunning ocean views and world-class amenities. Nestled on the pristine beaches of Bali, our resort offers an unparalleled experience combining traditional Balinese hospitality with modern luxury. Each room features private balconies overlooking the Indian Ocean, and our award-winning spa provides rejuvenating treatments using local ingredients.',
      images: ['/hotel1.jpg'],
      amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Parking', 'Concierge', 'Room Service'],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    '2': {
      id: '2',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      description: 'Cozy alpine lodge perfect for adventure seekers and nature lovers. Experience the magic of the Swiss Alps in our charming lodge, where traditional architecture meets modern comfort. Wake up to breathtaking mountain views, enjoy authentic Swiss cuisine, and explore endless hiking trails right from our doorstep.',
      images: ['/hotel2.jpg'],
      amenities: ['Ski Access', 'Fireplace', 'Restaurant', 'Spa', 'WiFi', 'Parking', 'Ski Storage'],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
  return mockHotels[id] || mockHotels['1']
}

