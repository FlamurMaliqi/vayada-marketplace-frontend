'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { UserType } from '@/lib/types'
import Link from 'next/link'
import { AuthenticatedNavigation, Footer } from '@/components/layout'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel } from '@/lib/types'
import {
  MapPinIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [userType, setUserType] = useState<UserType>('creator')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    message: '',
    proposedDates: '',
    collaborationType: '',
  })

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = typeof window !== 'undefined'
      ? (localStorage.getItem('userType') as UserType) || 'creator'
      : 'creator'
    setUserType(storedUserType)
  }, [])

  useEffect(() => {
    loadHotel()
  }, [params.id])

  const loadHotel = () => {
    const hotelId = Array.isArray(params.id) ? params.id[0] : params.id
    if (!hotelId) return
    
    setLoading(true)
    // Hardcoded mock data for frontend design
    setTimeout(() => {
      setHotel(getMockHotel(hotelId))
      setLoading(false)
    }, 300)
  }

  const handleRequestCollaboration = () => {
    if (!hotel) return

    setRequesting(true)

    // Simulate collaboration request (frontend design only)
    setTimeout(() => {
      setRequesting(false)
      setShowRequestModal(false)
      // Reset form
      setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
      // Redirect to collaborations page after a short delay
      setTimeout(() => {
        router.push(ROUTES.COLLABORATIONS)
      }, 500)
    }, 1000)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRequestForm(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <BuildingOfficeIcon className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Hotel not found</h1>
            <p className="text-gray-600 mb-8">The hotel you're looking for doesn't exist or has been removed.</p>
            <Link href={ROUTES.MARKETPLACE}>
              <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <AuthenticatedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-all duration-200 hover:scale-105 font-medium group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </button>

        {/* Hero Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-16 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">{hotel.name}</h1>
                    {hotel.status === 'verified' && (
                      <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <CheckBadgeIcon className="w-5 h-5 text-white" />
                        <span className="text-sm font-semibold text-white">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-primary-100 text-xl font-medium">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setShowRequestModal(true)}
                >
                  Request Collaboration
                </Button>
              </div>
            </div>
          </div>

          {/* Description Preview */}
          <div className="p-8">
            <p className="text-gray-700 text-lg leading-relaxed">{hotel.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {hotel.images && hotel.images.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="relative h-[500px] bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden group">
                  <img
                    src={hotel.images[selectedImageIndex] || hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {hotel.images.length > 1 && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                    <div className="grid grid-cols-4 gap-3">
                      {hotel.images.slice(0, 4).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                            selectedImageIndex === index
                              ? 'border-primary-600 ring-4 ring-primary-200 scale-105'
                              : 'border-gray-200 hover:border-primary-400 hover:scale-105'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${hotel.name} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          {selectedImageIndex === index && (
                            <div className="absolute inset-0 bg-primary-600/20"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-16 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-5xl font-bold text-white">
                    {hotel.name.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-500 text-lg font-medium">No images available</p>
              </div>
            )}


            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-10 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900">About</h2>
              </div>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed pl-4">
                <p>
                  {hotel.description}
                </p>
                <p className="pt-4 border-t border-gray-200">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">Quick Information</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-gray-50 to-transparent rounded-xl">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</div>
                    <div className="text-gray-900 font-bold">{hotel.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-gray-50 to-transparent rounded-xl">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</div>
                    <div className="text-gray-900 font-bold capitalize">{hotel.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold">
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition-all duration-300 hover:scale-105 font-semibold">
                  <PhoneIcon className="w-5 h-5" />
                  Request Call
                </button>
              </div>
            </div>

            {/* Explore More Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">Explore More</h3>
              </div>
              <Link href={ROUTES.MARKETPLACE}>
                <Button variant="outline" size="md" className="w-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Browse All Hotels
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Request Collaboration</h2>
                <p className="text-primary-100 mt-1">Send a collaboration request to {hotel?.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRequestCollaboration()
              }}
              className="p-8 space-y-6"
            >
              {/* Collaboration Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Collaboration Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="collaborationType"
                  value={requestForm.collaborationType}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select collaboration type</option>
                  <option value="content-creation">Content Creation</option>
                  <option value="social-media">Social Media Promotion</option>
                  <option value="blog-post">Blog Post</option>
                  <option value="video-production">Video Production</option>
                  <option value="photography">Photography</option>
                  <option value="influencer-stay">Influencer Stay</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Proposed Dates */}
              <div>
                <Input
                  label="Proposed Dates"
                  name="proposedDates"
                  type="text"
                  value={requestForm.proposedDates}
                  onChange={handleFormChange}
                  placeholder="e.g., March 15-20, 2024 or Flexible"
                  helperText="When would you like to collaborate?"
                />
              </div>

              {/* Message */}
              <div>
                <Textarea
                  label="Message"
                  name="message"
                  value={requestForm.message}
                  onChange={handleFormChange}
                  required
                  rows={6}
                  placeholder="Tell the hotel about your collaboration idea, your audience, and what you can offer..."
                  helperText="Describe your collaboration proposal in detail"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setShowRequestModal(false)
                    setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={requesting}
                  disabled={requesting}
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

// Mock data for development
function getMockHotel(id: string): Hotel {
  const mockHotels: Record<string, Hotel> = {
    '1': {
      id: '1',
      hotelProfileId: 'profile-1',
      name: 'Sunset Beach Resort',
      location: 'Bali, Indonesia',
      description: 'Luxury beachfront resort with stunning ocean views and world-class amenities. Nestled on the pristine beaches of Bali, our resort offers an unparalleled experience combining traditional Balinese hospitality with modern luxury. Each room features private balconies overlooking the Indian Ocean, and our award-winning spa provides rejuvenating treatments using local ingredients.',
      images: ['/hotel1.jpg'],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    '2': {
      id: '2',
      hotelProfileId: 'profile-1',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      description: 'Cozy alpine lodge perfect for adventure seekers and nature lovers. Experience the magic of the Swiss Alps in our charming lodge, where traditional architecture meets modern comfort. Wake up to breathtaking mountain views, enjoy authentic Swiss cuisine, and explore endless hiking trails right from our doorstep.',
      images: ['/hotel2.jpg'],
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
  return mockHotels[id] || mockHotels['1']
}

