'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { hotelService, creatorService } from '@/services/api'
import type { Hotel, Creator, UserType, Platform } from '@/lib/types'
import {
  PlusIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ProfileEditPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>('creator')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Profile form data (from profiles table)
  const [profileData, setProfileData] = useState({
    email: '',
    avatar: '',
    name: '',
  })

  // Hotel form data
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
    amenities: [] as string[],
    newAmenity: '',
    images: [] as string[],
    newImage: '',
  })

  // Creator form data
  const [creatorData, setCreatorData] = useState({
    name: '',
    location: '',
    niche: [] as string[],
    newNiche: '',
    audienceSize: 0,
    platforms: [] as Platform[],
  })

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

      // Load profile data (from profiles table)
      // In production, this would come from the profiles API
      const profileInfo = {
        email: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '',
        avatar: typeof window !== 'undefined' ? localStorage.getItem('userAvatar') || '' : '',
        name: typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '',
      }
      setProfileData(profileInfo)

      if (storedUserType === 'hotel') {
        try {
          const hotel = await hotelService.getById(userId)
          setHotelData({
            name: hotel.name || '',
            location: hotel.location || '',
            description: hotel.description || '',
            amenities: hotel.amenities || [],
            newAmenity: '',
            images: hotel.images || [],
            newImage: '',
          })
          // Update profile name if not set
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: hotel.name || '' }))
          }
        } catch (error) {
          console.error('Error loading hotel profile:', error)
          // Use mock data for development
          const mockHotel = getMockHotel(userId)
          setHotelData({
            name: mockHotel.name || '',
            location: mockHotel.location || '',
            description: mockHotel.description || '',
            amenities: mockHotel.amenities || [],
            newAmenity: '',
            images: mockHotel.images || [],
            newImage: '',
          })
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: mockHotel.name || '' }))
          }
        }
      } else {
        try {
          const creator = await creatorService.getById(userId)
          setCreatorData({
            name: creator.name || '',
            location: creator.location || '',
            niche: creator.niche || [],
            newNiche: '',
            audienceSize: creator.audienceSize || 0,
            platforms: creator.platforms || [],
          })
          // Update profile name if not set
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: creator.name || '' }))
          }
        } catch (error) {
          console.error('Error loading creator profile:', error)
          // Use mock data for development
          const mockCreator = getMockCreator(userId)
          setCreatorData({
            name: mockCreator.name || '',
            location: mockCreator.location || '',
            niche: mockCreator.niche || [],
            newNiche: '',
            audienceSize: mockCreator.audienceSize || 0,
            platforms: mockCreator.platforms || [],
          })
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: mockCreator.name || '' }))
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  // Hotel form handlers
  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHotelData(prev => ({ ...prev, [name]: value }))
  }

  const addAmenity = () => {
    if (hotelData.newAmenity.trim()) {
      setHotelData(prev => ({
        ...prev,
        amenities: [...prev.amenities, prev.newAmenity.trim()],
        newAmenity: '',
      }))
    }
  }

  const removeAmenity = (index: number) => {
    setHotelData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }))
  }

  const addImage = () => {
    if (hotelData.newImage.trim()) {
      setHotelData(prev => ({
        ...prev,
        images: [...prev.images, prev.newImage.trim()],
        newImage: '',
      }))
    }
  }

  const removeImage = (index: number) => {
    setHotelData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Creator form handlers
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'audienceSize') {
      setCreatorData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setCreatorData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addNiche = () => {
    if (creatorData.newNiche.trim()) {
      setCreatorData(prev => ({
        ...prev,
        niche: [...prev.niche, prev.newNiche.trim()],
        newNiche: '',
      }))
    }
  }

  const removeNiche = (index: number) => {
    setCreatorData(prev => ({
      ...prev,
      niche: prev.niche.filter((_, i) => i !== index),
    }))
  }

  const addPlatform = () => {
    setCreatorData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { name: '', handle: '', followers: 0, engagementRate: 0 }],
    }))
  }

  const removePlatform = (index: number) => {
    setCreatorData(prev => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }))
  }

  const updatePlatform = (index: number, field: string, value: string | number) => {
    setCreatorData(prev => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const userId = typeof window !== 'undefined'
        ? localStorage.getItem('userId') || '1'
        : '1'

      if (userType === 'hotel') {
        // Update hotel profile
        console.log('Updating hotel profile:', hotelData)
        // TODO: API call to update hotel profile
        await hotelService.update(userId, {
          name: hotelData.name,
          location: hotelData.location,
          description: hotelData.description,
          amenities: hotelData.amenities,
          images: hotelData.images,
        })
      } else {
        // Update creator profile
        console.log('Updating creator profile:', creatorData)
        // TODO: API call to update creator profile
        await creatorService.update(userId, {
          name: creatorData.name,
          location: creatorData.location,
          niche: creatorData.niche,
          platforms: creatorData.platforms,
        })
      }

      // Mark profile as complete
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileComplete', 'true')
        localStorage.setItem('hasProfile', 'true')
      }

      // Redirect to profile page after successful update
      router.push(ROUTES.PROFILE)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={ROUTES.PROFILE}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-lg text-gray-600">
            {userType === 'hotel'
              ? 'Update your hotel information'
              : 'Update your creator profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Profile Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Input
                  label="Avatar URL"
                  name="avatar"
                  type="url"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="URL to your profile picture"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="Your full name"
                />
              </div>
            </div>
          </div>

          {/* Hotel or Creator Specific Fields */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {userType === 'hotel' ? 'Hotel Information' : 'Creator Information'}
            </h2>
          </div>

          {userType === 'hotel' ? (
            <>
              <div>
                <Input
                  label="Hotel Name"
                  name="name"
                  value={hotelData.name}
                  onChange={handleHotelChange}
                  required
                  placeholder="Sunset Beach Resort"
                />
              </div>

              <div>
                <Input
                  label="Location"
                  name="location"
                  value={hotelData.location}
                  onChange={handleHotelChange}
                  required
                  placeholder="Bali, Indonesia"
                />
              </div>

              <div>
                <Textarea
                  label="Description"
                  name="description"
                  value={hotelData.description}
                  onChange={handleHotelChange}
                  required
                  placeholder="Tell us about your hotel..."
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    name="newAmenity"
                    value={hotelData.newAmenity}
                    onChange={handleHotelChange}
                    placeholder="Add amenity (e.g., Pool, Spa, WiFi)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addAmenity()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                </div>
                {hotelData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hotelData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="hover:text-primary-900"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (URLs)
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    name="newImage"
                    value={hotelData.newImage}
                    onChange={handleHotelChange}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addImage()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                </div>
                {hotelData.images.length > 0 && (
                  <div className="space-y-2">
                    {hotelData.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <Input
                  label="Creator Name / Brand Name"
                  name="name"
                  value={creatorData.name}
                  onChange={handleCreatorChange}
                  required
                  placeholder="Sarah Travels"
                />
              </div>

              <div>
                <Input
                  label="Location"
                  name="location"
                  value={creatorData.location}
                  onChange={handleCreatorChange}
                  required
                  placeholder="Bali, Indonesia"
                />
              </div>

              <div>
                <Input
                  label="Total Audience Size"
                  name="audienceSize"
                  type="number"
                  value={creatorData.audienceSize || ''}
                  onChange={handleCreatorChange}
                  placeholder="170000"
                  helperText="Total number of followers across all platforms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche / Specialties
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    name="newNiche"
                    value={creatorData.newNiche}
                    onChange={handleCreatorChange}
                    placeholder="Add niche (e.g., Luxury Travel, Beach Destinations)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNiche()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addNiche}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                </div>
                {creatorData.niche.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {creatorData.niche.map((niche, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
                      >
                        {niche}
                        <button
                          type="button"
                          onClick={() => removeNiche(index)}
                          className="hover:text-primary-900"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Platforms
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={addPlatform}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Platform
                  </Button>
                </div>
                <div className="space-y-4">
                  {creatorData.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Platform {index + 1}</h4>
                        {creatorData.platforms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePlatform(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Platform Name"
                          value={platform.name}
                          onChange={(e) =>
                            updatePlatform(index, 'name', e.target.value)
                          }
                          placeholder="Instagram"
                          required
                        />
                        <Input
                          label="Handle"
                          value={platform.handle}
                          onChange={(e) =>
                            updatePlatform(index, 'handle', e.target.value)
                          }
                          placeholder="@username"
                          required
                        />
                        <Input
                          label="Followers"
                          type="number"
                          value={platform.followers || ''}
                          onChange={(e) =>
                            updatePlatform(index, 'followers', parseInt(e.target.value) || 0)
                          }
                          placeholder="100000"
                          required
                        />
                        <Input
                          label="Engagement Rate (%)"
                          type="number"
                          step="0.1"
                          value={platform.engagementRate || ''}
                          onChange={(e) =>
                            updatePlatform(index, 'engagementRate', parseFloat(e.target.value) || 0)
                          }
                          placeholder="4.5"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  {creatorData.platforms.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No platforms added. Click "Add Platform" to get started.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              isLoading={saving}
            >
              Save Changes
            </Button>
            <Link href={ROUTES.PROFILE}>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
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
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
    images: [],
    amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'],
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function getMockCreator(id: string): Creator {
  return {
    id,
    name: 'Sarah Travels',
    niche: ['Luxury Travel', 'Beach Destinations'],
    platforms: [
      {
        name: 'Instagram',
        handle: '@sarahtravels',
        followers: 125000,
        engagementRate: 4.2,
      },
    ],
    audienceSize: 170000,
    location: 'Bali, Indonesia',
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

