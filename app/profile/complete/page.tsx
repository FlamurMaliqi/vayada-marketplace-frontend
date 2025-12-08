'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { checkProfileStatus, isProfileComplete } from '@/lib/utils'
import type { UserType, CreatorProfileStatus, HotelProfileStatus } from '@/lib/types'
import { creatorService } from '@/services/api/creators'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'
import {
  XMarkIcon,
  PlusIcon,
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const HOTEL_CATEGORIES = [
  'Resort',
  'Hotel',
  'Villa',
  'Apartment',
  'Hostel',
  'Boutique Hotel',
  'Luxury Hotel',
  'Eco Resort',
  'Spa Resort',
  'Beach Resort',
]

const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook']

interface PlatformFormData {
  name: string
  handle: string
  followers: number | ''
  engagement_rate: number | ''
  top_countries?: Array<{ country: string; percentage: number }>
  top_age_groups?: Array<{ ageRange: string; percentage: number }>
  gender_split?: { male: number; female: number }
}

export default function ProfileCompletePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [profileStatus, setProfileStatus] = useState<CreatorProfileStatus | HotelProfileStatus | null>(null)
  const [error, setError] = useState('')

  // Creator form state
  const [creatorForm, setCreatorForm] = useState({
    location: '',
    short_description: '',
    portfolio_link: '',
    phone: '',
  })
  const [creatorPlatforms, setCreatorPlatforms] = useState<PlatformFormData[]>([])

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    name: '',
    category: 'Hotel',
    location: 'Not specified',
    email: '',
    about: '',
    website: '',
    phone: '',
  })

  useEffect(() => {
    // Get user type from localStorage
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null
      setUserType(storedUserType)
      
      // Pre-fill hotel form with user data
      if (storedUserType === 'hotel') {
        const userName = localStorage.getItem('userName') || ''
        const userEmail = localStorage.getItem('userEmail') || ''
        setHotelForm(prev => ({
          ...prev,
          name: userName,
          email: userEmail,
        }))
      }
      
      if (storedUserType) {
        loadProfileStatus(storedUserType)
      } else {
        // No user type, redirect to login
        router.push(ROUTES.LOGIN)
      }
    }
  }, [router])

  const loadProfileStatus = async (type: UserType) => {
    setLoading(true)
    try {
      const status = await checkProfileStatus(type)
      setProfileStatus(status)
      
      if (status && status.profile_complete) {
        // Profile already complete, redirect to marketplace
        router.push(ROUTES.MARKETPLACE)
        return
      }
    } catch (error) {
      console.error('Failed to load profile status:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPlatform = () => {
    setCreatorPlatforms([
      ...creatorPlatforms,
      {
        name: '',
        handle: '',
        followers: '',
        engagement_rate: '',
      },
    ])
  }

  const removePlatform = (index: number) => {
    setCreatorPlatforms(creatorPlatforms.filter((_, i) => i !== index))
  }

  const updatePlatform = (index: number, field: keyof PlatformFormData, value: any) => {
    const updated = [...creatorPlatforms]
    updated[index] = { ...updated[index], [field]: value }
    setCreatorPlatforms(updated)
  }

  const validateCreatorForm = (): boolean => {
    if (!creatorForm.location.trim()) {
      setError('Location is required')
      return false
    }
    
    if (!creatorForm.short_description.trim()) {
      setError('Short description is required')
      return false
    }
    
    if (creatorForm.short_description.trim().length < 10) {
      setError('Short description must be at least 10 characters')
      return false
    }
    
    if (creatorForm.short_description.trim().length > 500) {
      setError('Short description must be at most 500 characters')
      return false
    }
    
    if (creatorPlatforms.length === 0) {
      setError('At least one platform is required')
      return false
    }
    
    for (let i = 0; i < creatorPlatforms.length; i++) {
      const platform = creatorPlatforms[i]
      if (!platform.name) {
        setError(`Platform ${i + 1}: Platform name is required`)
        return false
      }
      if (!platform.handle.trim()) {
        setError(`Platform ${i + 1}: Handle is required`)
        return false
      }
      if (platform.followers === '' || Number(platform.followers) < 0) {
        setError(`Platform ${i + 1}: Followers must be 0 or greater`)
        return false
      }
      if (platform.engagement_rate === '' || Number(platform.engagement_rate) < 0 || Number(platform.engagement_rate) > 100) {
        setError(`Platform ${i + 1}: Engagement rate must be between 0 and 100`)
        return false
      }
    }
    
    return true
  }

  const validateHotelForm = (): boolean => {
    if (!hotelForm.name.trim() || hotelForm.name.trim().length < 2) {
      setError('Hotel name must be at least 2 characters')
      return false
    }
    
    if (!hotelForm.location.trim() || hotelForm.location === 'Not specified') {
      setError('Location must be updated from default value')
      return false
    }
    
    if (!hotelForm.email.trim() || !hotelForm.email.includes('@')) {
      setError('Valid email is required')
      return false
    }
    
    if (hotelForm.about && hotelForm.about.trim().length < 10) {
      setError('About section must be at least 10 characters if provided')
      return false
    }
    
    return true
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateCreatorForm()) {
      return
    }
    
    setSubmitting(true)
    try {
      // Note: Profile update endpoints may not be available
      // This is a placeholder for when endpoints are restored
      console.log('Creator profile data:', {
        ...creatorForm,
        platforms: creatorPlatforms.map(p => ({
          name: p.name,
          handle: p.handle,
          followers: Number(p.followers),
          engagement_rate: Number(p.engagement_rate),
          ...(p.top_countries && { top_countries: p.top_countries }),
          ...(p.top_age_groups && { top_age_groups: p.top_age_groups }),
          ...(p.gender_split && { gender_split: p.gender_split }),
        })),
      })
      
      // TODO: Call API when endpoints are available
      // await creatorService.updateMyProfile({ ... })
      
      // Check if profile is now complete
      const isComplete = await isProfileComplete('creator')
      if (isComplete) {
        router.push(ROUTES.MARKETPLACE)
      } else {
        // Reload status to show updated completion steps
        await loadProfileStatus('creator')
        setError('Profile updated, but some fields may still be missing. Please check the requirements.')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      if (error instanceof ApiErrorResponse) {
        setError(error.data.detail as string || 'Failed to update profile')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateHotelForm()) {
      return
    }
    
    setSubmitting(true)
    try {
      // Note: Profile update endpoints may not be available
      // This is a placeholder for when endpoints are restored
      console.log('Hotel profile data:', hotelForm)
      
      // TODO: Call API when endpoints are available
      // await hotelService.updateMyProfile({ ... })
      
      // Check if profile is now complete
      const isComplete = await isProfileComplete('hotel')
      if (isComplete) {
        router.push(ROUTES.MARKETPLACE)
      } else {
        // Reload status to show updated completion steps
        await loadProfileStatus('hotel')
        setError('Profile updated, but some fields may still be missing. Please check the requirements.')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      if (error instanceof ApiErrorResponse) {
        setError(error.data.detail as string || 'Failed to update profile')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (!userType || !profileStatus) {
    return null
  }

  const completionPercentage = profileStatus.profile_complete
    ? 100
    : Math.max(0, 100 - (profileStatus.completion_steps.length * 20))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Minimal Header */}
      <div className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              vayada
            </h1>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-primary-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform">
            {userType === 'creator' ? (
              <UserIcon className="w-10 h-10 text-white" />
            ) : (
              <BuildingOfficeIcon className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Complete Your Profile
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {userType === 'creator'
              ? 'Add your information to start connecting with hotels and unlock amazing collaboration opportunities'
              : 'Update your hotel information to start collaborating with creators and grow your brand'}
          </p>
        </div>

        {/* Creator Form */}
        {userType === 'creator' && (
          <form onSubmit={handleCreatorSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                Basic Information
              </h3>
              
              <Input
                label="Location"
                type="text"
                value={creatorForm.location}
                onChange={(e) => setCreatorForm({ ...creatorForm, location: e.target.value })}
                required
                placeholder="e.g., New York, USA"
                error={error && error.includes('Location') ? error : undefined}
              />

              <Textarea
                label="Short Description"
                value={creatorForm.short_description}
                onChange={(e) => setCreatorForm({ ...creatorForm, short_description: e.target.value })}
                required
                placeholder="Tell us about yourself (10-500 characters)"
                rows={4}
                maxLength={500}
                error={error && error.includes('description') ? error : undefined}
                helperText={`${creatorForm.short_description.length}/500 characters`}
              />

              <Input
                label="Portfolio Link"
                type="url"
                value={creatorForm.portfolio_link}
                onChange={(e) => setCreatorForm({ ...creatorForm, portfolio_link: e.target.value })}
                placeholder="https://your-portfolio.com"
                helperText="Optional - Your portfolio or website URL"
              />

              <Input
                label="Phone"
                type="tel"
                value={creatorForm.phone}
                onChange={(e) => setCreatorForm({ ...creatorForm, phone: e.target.value })}
                placeholder="+1-555-123-4567"
                helperText="Optional - Contact phone number"
              />
            </div>

            {/* Platforms Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Social Media Platforms</h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {creatorPlatforms.length} platform{creatorPlatforms.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Add at least one platform <span className="font-semibold text-red-600">(required)</span>
                  </p>
                </div>
              </div>

              {creatorPlatforms.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50">
                  <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-2">No platforms added yet</p>
                  <p className="text-sm text-gray-500">Click below to add your first social media platform</p>
                </div>
              )}

              {creatorPlatforms.map((platform, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 space-y-5 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Platform {index + 1}</h4>
                    </div>
                    {creatorPlatforms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlatform(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove platform"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Platform Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={platform.name}
                        onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white font-medium"
                      >
                        <option value="">Select platform</option>
                        {PLATFORM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Handle/Username"
                      type="text"
                      value={platform.handle}
                      onChange={(e) => updatePlatform(index, 'handle', e.target.value)}
                      required
                      placeholder="@username or username"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Followers"
                      type="number"
                      value={platform.followers}
                      onChange={(e) => updatePlatform(index, 'followers', e.target.value === '' ? '' : parseInt(e.target.value))}
                      required
                      placeholder="0"
                      min={0}
                    />

                    <Input
                      label="Engagement Rate (%)"
                      type="number"
                      value={platform.engagement_rate}
                      onChange={(e) => updatePlatform(index, 'engagement_rate', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      required
                      placeholder="0.00"
                      min={0}
                      max={100}
                      step="0.01"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPlatform}
                className="w-full py-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-semibold group"
              >
                <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add Another Platform
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Complete Profile
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Hotel Form */}
        {userType === 'hotel' && (
          <form onSubmit={handleHotelSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 md:p-10 space-y-10">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-500">Your hotel details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    label="Hotel Name"
                    type="text"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                    required
                    placeholder="Your hotel or company name"
                    helperText="Pre-filled from registration"
                    className="pl-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={hotelForm.category}
                    onChange={(e) => setHotelForm({ ...hotelForm, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white font-medium"
                  >
                    {HOTEL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Default: Hotel (can be updated)</p>
                </div>

                <div className="relative md:col-span-2">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    label="Location"
                    type="text"
                    value={hotelForm.location}
                    onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                    required
                    placeholder="Enter your hotel location"
                    error={error && error.includes('Location') ? error : undefined}
                    helperText={hotelForm.location === 'Not specified' ? '⚠️ Must be updated from default value' : undefined}
                    className="pl-12"
                  />
                </div>

                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    label="Email"
                    type="email"
                    value={hotelForm.email}
                    onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                    required
                    placeholder="contact@hotel.com"
                    helperText="Pre-filled from registration"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Additional Information</h3>
                  <p className="text-sm text-gray-500">Optional but recommended</p>
                </div>
              </div>

              <Textarea
                label="About"
                value={hotelForm.about}
                onChange={(e) => setHotelForm({ ...hotelForm, about: e.target.value })}
                placeholder="Describe your hotel, amenities, unique features, and what makes it special (10-5000 characters)"
                rows={6}
                maxLength={5000}
                helperText={`${hotelForm.about.length}/5000 characters (optional but recommended)`}
                className="resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <GlobeAltIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    label="Website"
                    type="url"
                    value={hotelForm.website}
                    onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                    placeholder="https://your-hotel.com"
                    helperText="Optional - Your hotel website URL"
                    className="pl-12"
                  />
                </div>

                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    label="Phone"
                    type="tel"
                    value={hotelForm.phone}
                    onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                    placeholder="+1-555-123-4567"
                    helperText="Optional - Contact phone number"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Complete Profile
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

