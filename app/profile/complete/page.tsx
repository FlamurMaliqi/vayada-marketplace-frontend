'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HotelBadgeIcon } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { STORAGE_KEYS } from '@/lib/constants'
import { checkProfileStatus, isProfileComplete } from '@/lib/utils'
import type { UserType, CreatorProfileStatus, HotelProfileStatus, Creator } from '@/lib/types'
import { creatorService } from '@/services/api/creators'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCreatorProfileForm } from '@/hooks/useCreatorProfileForm'
import { useHotelProfileForm } from '@/hooks/useHotelProfileForm'
import {
  LoadingScreen,
  ProfileCompletionScreen,
  ProfileCompletionProgress,
  StepIndicators,
  CreatorProfileForm,
  HotelProfileForm,
} from '@/components/profile-complete'

export default function ProfileCompletePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [profileStatus, setProfileStatus] = useState<CreatorProfileStatus | HotelProfileStatus | null>(null)
  const [error, setError] = useState('')
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)

  const creatorSteps = ['Creator Type', 'Basic Information', 'Social Media Platforms']
  const hotelSteps = ['Basic Information', 'Property Listings']

  // Initialize hooks with error handler
  const creatorForm = useCreatorProfileForm({ onError: setError })
  const hotelForm = useHotelProfileForm({ onError: setError })

  const formatErrorDetail = (detail: unknown): string => {
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((err: { loc?: (string | number)[]; msg?: string }) => {
        const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field'
        return `${field}: ${err.msg || 'Validation error'}`
      }).join('; ')
    }
    if (detail && typeof detail === 'object') return JSON.stringify(detail)
    return 'An error occurred'
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType | null
      setUserType(storedUserType)

      const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || ''

      if (storedUserType === 'hotel') {
        hotelForm.setForm(prev => ({ ...prev, name: userName }))
      } else if (storedUserType === 'creator') {
        creatorForm.setForm(prev => ({ ...prev, name: userName }))
      }

      if (storedUserType) {
        loadProfileStatus(storedUserType, true)
      } else {
        router.push(ROUTES.LOGIN)
      }
    }
  }, [router])

  const loadProfileStatus = async (type: UserType, skipRedirect = false): Promise<CreatorProfileStatus | HotelProfileStatus | null> => {
    setLoading(true)
    try {
      const status = await checkProfileStatus(type)
      setProfileStatus(status)
      if (status?.profile_complete && !skipRedirect && !profileCompleted) {
        setProfileCompleted(true)
      }
      return status
    } catch (err) {
      console.error('Failed to load profile status:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    const steps = userType === 'creator' ? creatorSteps : hotelSteps
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const canProceedToNextStep = (): boolean => {
    if (userType === 'creator') {
      if (currentStep === 1) return creatorForm.canProceedCreatorType()
      if (currentStep === 2) return creatorForm.canProceedStep1()
      return true
    }
    if (userType === 'hotel') {
      return currentStep === 1 ? hotelForm.canProceedStep1() : true
    }
    return false
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!creatorForm.validateForm()) return

    setSubmitting(true)
    try {
      const platforms = creatorForm.platforms.map(p => {
        const validAgeGroups = p.top_age_groups?.filter(tag => tag.ageRange?.trim())
          .map(tag => ({ ageRange: tag.ageRange.trim(), percentage: tag.percentage })) || []

        return {
          name: p.name,
          handle: p.handle,
          followers: Number(p.followers),
          engagementRate: Number(p.engagement_rate),
          ...(p.top_countries?.length && {
            topCountries: p.top_countries.map(tc => ({ country: tc.country, percentage: tc.percentage })),
          }),
          ...(validAgeGroups.length && { topAgeGroups: validAgeGroups }),
          ...(p.gender_split && (p.gender_split.male > 0 || p.gender_split.female > 0) && {
            genderSplit: { male: p.gender_split.male, female: p.gender_split.female },
          }),
        }
      })

      const audienceSize = platforms.reduce((sum, p) => sum + p.followers, 0)

      let profilePictureUrl: string | undefined
      if (creatorForm.profilePictureFile) {
        try {
          const uploadResponse = await creatorService.uploadProfilePicture(creatorForm.profilePictureFile)
          profilePictureUrl = uploadResponse.url
        } catch (err) {
          if (err instanceof ApiErrorResponse) {
            setError(formatErrorDetail(err.data.detail) || 'Failed to upload profile picture')
          } else {
            setError('Failed to upload profile picture. Please try again.')
          }
          setSubmitting(false)
          return
        }
      }

      const updatePayload = {
        name: creatorForm.form.name,
        location: creatorForm.form.location,
        platforms,
        audienceSize,
        creatorType: creatorForm.form.creator_type,
        ...(creatorForm.form.portfolio_link?.trim() && { portfolioLink: creatorForm.form.portfolio_link.trim() }),
        ...(creatorForm.form.short_description?.trim() && { shortDescription: creatorForm.form.short_description.trim() }),
        ...(creatorForm.form.phone?.trim() && { phone: creatorForm.form.phone.trim() }),
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      }

      const updatedProfile = await creatorService.updateMyProfile(updatePayload)
      const responseWithSnakeCase = updatedProfile as Creator & { profile_picture?: string | null }
      const pictureUrl = updatedProfile.profilePicture || responseWithSnakeCase.profile_picture
      if (pictureUrl?.trim()) {
        creatorForm.setForm(prev => ({ ...prev, profile_image: pictureUrl }))
      }

      const complete = await isProfileComplete('creator')
      if (complete) {
        setProfileCompleted(true)
        localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true')
      } else {
        const updatedStatus = await loadProfileStatus('creator', true)
        handleIncompleteProfile(updatedStatus as CreatorProfileStatus)
      }
    } catch (err) {
      if (err instanceof ApiErrorResponse) {
        setError(formatErrorDetail(err.data.detail) || 'Failed to update profile')
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
    if (!hotelForm.validateForm()) return

    setSubmitting(true)
    try {
      const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      if (!userEmail) {
        setError('Email is required. Please log in again.')
        setSubmitting(false)
        return
      }

      let profilePictureUrl: string | undefined
      if (hotelForm.profilePictureFile) {
        try {
          const uploadResponse = await hotelService.uploadProfileImage(hotelForm.profilePictureFile)
          profilePictureUrl = uploadResponse.url
        } catch (err) {
          if (err instanceof ApiErrorResponse) {
            setError(formatErrorDetail(err.data.detail) || 'Failed to upload profile picture')
          } else {
            setError('Failed to upload profile picture. Please try again.')
          }
          setSubmitting(false)
          return
        }
      }

      const updatePayload = {
        name: hotelForm.form.name.trim(),
        location: hotelForm.form.location.trim(),
        about: hotelForm.form.about.trim(),
        website: hotelForm.form.website.trim(),
        phone: hotelForm.form.phone.trim(),
        email: userEmail,
        ...(profilePictureUrl && { picture: profilePictureUrl }),
      }

      const updatedProfile = await hotelService.updateMyProfile(updatePayload)
      if (updatedProfile?.picture) {
        hotelForm.setForm(prev => ({ ...prev, picture: updatedProfile.picture || '' }))
      }

      // Create listings
      for (const listing of hotelForm.listings) {
        const offerings = buildListingOfferings(listing)
        let imageUrls = listing.images.filter(img => !img.startsWith('data:'))

        if (listing.imageFiles?.length) {
          try {
            const uploadResponse = await hotelService.uploadListingImages(listing.imageFiles)
            imageUrls = [...imageUrls, ...uploadResponse.images.map(img => img.url)]
          } catch (err) {
            if (err instanceof ApiErrorResponse) {
              setError(formatErrorDetail(err.data.detail) || `Failed to upload images for listing "${listing.name}"`)
            } else {
              setError(`Failed to upload images for listing "${listing.name}". Please try again.`)
            }
            setSubmitting(false)
            return
          }
        }

        if (imageUrls.length === 0) {
          setError(`Listing "${listing.name}": At least one image is required`)
          setSubmitting(false)
          return
        }

        await hotelService.createListing({
          name: listing.name,
          location: listing.location,
          description: listing.description,
          accommodation_type: listing.accommodation_type || undefined,
          images: imageUrls,
          collaboration_offerings: offerings,
          creator_requirements: buildCreatorRequirements(listing),
        })
      }

      const complete = await isProfileComplete('hotel')
      if (complete) {
        setProfileCompleted(true)
        localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, 'true')
      } else {
        const updatedStatus = await loadProfileStatus('hotel', true)
        handleIncompleteProfile(updatedStatus as HotelProfileStatus)
      }
    } catch (err) {
      if (err instanceof ApiErrorResponse) {
        setError(formatErrorDetail(err.data.detail) || 'Failed to update profile')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleIncompleteProfile = (status: CreatorProfileStatus | HotelProfileStatus | null) => {
    if (!status || status.profile_complete) {
      setError('Profile updated, but some fields may still be missing. Please check the requirements.')
      return
    }
    const { missing_fields = [], completion_steps = [] } = status
    let errorMessage = 'Profile updated successfully, but some required information is still missing:\n\n'
    if (completion_steps.length > 0) {
      errorMessage += completion_steps.slice(0, 5).map((step, idx) => `${idx + 1}. ${step}`).join('\n')
      if (completion_steps.length > 5) {
        errorMessage += `\n...and ${completion_steps.length - 5} more requirement${completion_steps.length - 5 > 1 ? 's' : ''}`
      }
    } else if (missing_fields.length > 0) {
      errorMessage += 'Missing fields: ' + missing_fields.join(', ')
    } else {
      errorMessage += 'Please review all sections and ensure all required fields are completed.'
    }
    setError(errorMessage)
  }

  const buildListingOfferings = (listing: typeof hotelForm.listings[0]) => {
    const offerings: Array<{
      collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
      availability_months: string[]
      platforms: string[]
      free_stay_min_nights?: number
      free_stay_max_nights?: number
      paid_max_amount?: number
      discount_percentage?: number
    }> = []

    if (listing.collaborationTypes.includes('Free Stay')) {
      offerings.push({
        collaboration_type: 'Free Stay',
        availability_months: listing.availability,
        platforms: listing.platforms,
        free_stay_min_nights: listing.freeStayMinNights,
        free_stay_max_nights: listing.freeStayMaxNights,
      })
    }
    if (listing.collaborationTypes.includes('Paid')) {
      offerings.push({
        collaboration_type: 'Paid',
        availability_months: listing.availability,
        platforms: listing.platforms,
        paid_max_amount: listing.paidMaxAmount,
      })
    }
    if (listing.collaborationTypes.includes('Discount')) {
      offerings.push({
        collaboration_type: 'Discount',
        availability_months: listing.availability,
        platforms: listing.platforms,
        discount_percentage: listing.discountPercentage,
      })
    }
    return offerings
  }

  const buildCreatorRequirements = (listing: typeof hotelForm.listings[0]) => {
    const ageGroups = listing.targetGroupAgeGroups || []
    let targetAgeMin: number | undefined
    let targetAgeMax: number | undefined

    if (ageGroups.length > 0) {
      let min = Infinity, max = -Infinity, has55Plus = false
      ageGroups.forEach(g => {
        if (g === '18-24') { min = Math.min(min, 18); max = Math.max(max, 24) }
        else if (g === '25-34') { min = Math.min(min, 25); max = Math.max(max, 34) }
        else if (g === '35-44') { min = Math.min(min, 35); max = Math.max(max, 44) }
        else if (g === '45-54') { min = Math.min(min, 45); max = Math.max(max, 54) }
        else if (g === '55+') { min = Math.min(min, 55); has55Plus = true }
      })
      targetAgeMin = min === Infinity ? undefined : min
      targetAgeMax = has55Plus ? undefined : (max === -Infinity ? undefined : max)
    } else {
      targetAgeMin = listing.targetGroupAgeMin
      targetAgeMax = listing.targetGroupAgeMax
    }

    return {
      platforms: listing.lookingForPlatforms,
      min_followers: listing.lookingForMinFollowers || undefined,
      target_countries: listing.targetGroupCountries,
      target_age_min: targetAgeMin,
      target_age_max: targetAgeMax,
    }
  }

  if (loading) return <LoadingScreen />
  if (!userType || !profileStatus) return null

  if (profileCompleted || profileStatus.profile_complete) {
    return (
      <ProfileCompletionScreen
        userType={userType}
        onGoHome={() => router.push(ROUTES.HOME)}
        onEditProfile={() => router.push(ROUTES.PROFILE)}
      />
    )
  }

  const steps = userType === 'creator' ? creatorSteps : hotelSteps
  const totalSteps = steps.length
  const completionPercentage = profileStatus?.profile_complete
    ? 100
    : userType === 'creator'
      ? creatorForm.calculateProgress()
      : hotelForm.calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center relative">
          <a href="/" className="absolute left-0 p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all" title="Back to Home">
            <ArrowLeftIcon className="w-5 h-5" />
          </a>
          <div className="flex items-center gap-2">
            <img src="/vayada-logo.png" alt="Vayada" className="h-12" />
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileCompletionProgress percentage={completionPercentage} />

        {/* Header Card with Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            {userType === 'creator' ? (
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            ) : (
              <HotelBadgeIcon active />
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Complete Your Profile</h1>
              <p className="text-xs text-gray-500 max-w-xs">
                {userType === 'creator' ? 'Add info to connect with hotels' : 'Update info to collaborate'}
              </p>
            </div>
          </div>
          <StepIndicators steps={steps} currentStep={currentStep} />
        </div>

        {/* Forms */}
        {userType === 'creator' && (
          <CreatorProfileForm
            form={creatorForm.form}
            platforms={creatorForm.platforms}
            currentStep={currentStep}
            totalSteps={totalSteps}
            error={error}
            submitting={submitting}
            canProceed={canProceedToNextStep()}
            expandedPlatforms={creatorForm.expandedPlatforms}
            platformCountryInputs={creatorForm.platformCountryInputs}
            imageInputRef={creatorForm.imageInputRef}
            onFormChange={creatorForm.handleFormChange}
            onImageChange={creatorForm.handleImageChange}
            onAddPlatform={creatorForm.addPlatform}
            onRemovePlatform={creatorForm.removePlatform}
            onUpdatePlatform={creatorForm.updatePlatform}
            onTogglePlatformExpanded={creatorForm.togglePlatformExpanded}
            onCountryInputChange={creatorForm.handleCountryInputChange}
            onAddCountry={creatorForm.addCountryFromInput}
            onRemoveCountry={creatorForm.removeCountry}
            onUpdateCountryPercentage={creatorForm.updateCountryPercentage}
            getAvailableCountries={creatorForm.getAvailableCountries}
            onToggleAgeGroup={creatorForm.toggleAgeGroup}
            onUpdateGenderSplit={creatorForm.updateGenderSplit}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSubmit={handleCreatorSubmit}
          />
        )}

        {userType === 'hotel' && (
          <HotelProfileForm
            form={hotelForm.form}
            listings={hotelForm.listings}
            currentStep={currentStep}
            totalSteps={totalSteps}
            error={error}
            submitting={submitting}
            canProceed={canProceedToNextStep()}
            collapsedCards={hotelForm.collapsedCards}
            countryInputs={hotelForm.countryInputs}
            countries={hotelForm.countries}
            imageInputRefs={hotelForm.listingImageInputRefs}
            onFormChange={hotelForm.handleFormChange}
            onAddListing={hotelForm.addListing}
            onRemoveListing={hotelForm.removeListing}
            onToggleCollapse={hotelForm.toggleListingCollapse}
            onUpdateListing={hotelForm.updateListing}
            onImageChange={hotelForm.handleListingImageChange}
            onRemoveImage={hotelForm.removeListingImage}
            onCountryInputChange={hotelForm.handleCountryInputChange}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSubmit={handleHotelSubmit}
          />
        )}
      </div>
    </div>
  )
}
