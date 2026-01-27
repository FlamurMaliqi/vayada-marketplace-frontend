'use client'

import { useRouter } from 'next/navigation'
import { PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Button, Input, ErrorModal } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { PLATFORM_OPTIONS, AGE_GROUP_OPTIONS } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'
import { ProfilePictureModal } from '../ProfilePictureModal'
import { CreatorOverviewTab } from './CreatorOverviewTab'
import { PlatformCardView } from './PlatformCardView'
import { CreatorReviewsTab } from './CreatorReviewsTab'
import { formatFollowersDE } from './utils'
import { useCreatorProfile } from '@/hooks/useCreatorProfile'
import { usePlatformManagement } from '@/hooks/usePlatformManagement'
import { useErrorModal } from '@/hooks/useErrorModal'
import type { CreatorProfileStatus } from '@/lib/types'

export function CreatorProfile() {
  const router = useRouter()
  const { errorModal, showError, closeError } = useErrorModal()

  const creator = useCreatorProfile(showError)
  const platformMgmt = usePlatformManagement(
    creator.editFormData,
    creator.setEditFormData,
    creator.expandedPlatforms,
    creator.setExpandedPlatforms,
    creator.platformCountryInputs,
    creator.setPlatformCountryInputs,
  )

  const {
    creatorProfile,
    setCreatorProfile,
    loading,
    profileStatus,
    isProfileIncomplete,
    activeCreatorTab,
    setActiveCreatorTab,
    phone,
    setPhone,
    isEditingProfile,
    setIsEditingProfile,
    isSavingProfile,
    showPictureModal,
    setShowPictureModal,
    profilePicturePreview,
    setProfilePicturePreview,
    editFormData,
    setEditFormData,
    fileInputRef,
    expandedPlatforms,
    platformCountryInputs,
    handleSaveProfile,
    handleCancelEdit,
    handleCreatorImageChange,
  } = creator

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (isProfileIncomplete) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 mb-6">
            {(profileStatus as CreatorProfileStatus)?.missing_fields
              ? `Please complete the following: ${(profileStatus as CreatorProfileStatus).missing_fields.join(', ')}`
              : 'Your profile setup is not complete. Please finish the onboarding process.'}
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.PROFILE_COMPLETE)}
          >
            Complete Profile
          </Button>
        </div>
      </div>
    )
  }

  if (!creatorProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Data Unavailable
          </h3>
          <p className="text-gray-600 mb-6">
            Your profile status is being checked, but profile data endpoints are currently unavailable.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.PROFILE_COMPLETE)}
          >
            Go to Profile Completion
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header with Tabs and Action Buttons */}
      <div className="pt-6 pr-6 pb-6 pl-0 mb-6" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCreatorTab('overview')}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${activeCreatorTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveCreatorTab('platforms')}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${activeCreatorTab === 'platforms'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              Social Media Platforms
            </button>
            <button
              onClick={() => setActiveCreatorTab('reviews')}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${activeCreatorTab === 'reviews'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              Reviews &amp; Ratings
            </button>
          </div>
          {isEditingProfile ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={isSavingProfile}
                className="px-4 py-2.5 rounded-lg font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile || !editFormData.name || !editFormData.shortDescription || !editFormData.location}
                className="px-4 py-2.5 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="p-2.5 rounded-lg bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center"
              title="Edit Profile"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
        {activeCreatorTab === 'overview' && (
          <CreatorOverviewTab
            profile={creatorProfile}
            isEditing={isEditingProfile}
            editFormData={editFormData}
            phone={phone}
            onEditFormChange={setEditFormData}
            onPhoneChange={setPhone}
            onImageChange={handleCreatorImageChange}
            fileInputRef={fileInputRef}
          />
        )}

        {activeCreatorTab === 'platforms' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Social Media Platforms</h2>
            </div>

            {!isEditingProfile ? (
              <div className="space-y-4">
                {creatorProfile.platforms && creatorProfile.platforms.length > 0 ? (
                  creatorProfile.platforms.map((platform, index) => (
                    <PlatformCardView key={index} platform={platform} />
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No platforms added yet. Edit your profile to add social media platforms.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shadow-sm">
                      <LinkIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">Connect Your Platforms</h3>
                      <p className="text-sm text-gray-600">
                        Link your accounts and define your audience per platform
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    Add at least one platform with audience demographics to help match you with the right properties.
                  </p>

                  {/* Platform Cards Grid */}
                  <div className="space-y-3 mt-4">
                    {PLATFORM_OPTIONS.map((platformName) => {
                      const platformsOfThisType = editFormData.platforms.filter((p) => p.name === platformName)
                      const hasPlatforms = platformsOfThisType.length > 0

                      const platformColors: Record<string, string> = {
                        Instagram: 'from-yellow-400 via-pink-500 to-purple-600',
                        TikTok: 'from-gray-900 to-gray-800',
                        YouTube: 'from-red-600 to-red-500',
                        Facebook: 'from-blue-600 to-blue-500',
                      }

                      const renderIcon = () => {
                        if (platformName === 'Instagram') {
                          return (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                            </svg>
                          )
                        }
                        if (platformName === 'TikTok') {
                          return (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.1z" />
                            </svg>
                          )
                        }
                        if (platformName === 'YouTube') {
                          return (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          )
                        }
                        return (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )
                      }

                      return (
                        <div key={platformName} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                          <div className="flex items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br ${platformColors[platformName] || 'from-gray-500 to-gray-400'}`}>
                                {renderIcon()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{platformName}</p>
                                {hasPlatforms && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {platformsOfThisType.length} {platformsOfThisType.length === 1 ? 'account' : 'accounts'} added
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setEditFormData({
                                  ...editFormData,
                                  platforms: [
                                    ...editFormData.platforms,
                                    {
                                      name: platformName,
                                      handle: '',
                                      followers: 0,
                                      engagementRate: 0,
                                      topCountries: [],
                                      topAgeGroups: [],
                                      genderSplit: { male: 0, female: 0 },
                                    },
                                  ],
                                })
                              }}
                              className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                            >
                              Add Account
                            </button>
                          </div>

                          {platformsOfThisType.length > 0 && (
                            <div className="border-t border-gray-100 divide-y divide-gray-100">
                              {platformsOfThisType.map((platform, idx) => {
                                const allIndices = editFormData.platforms
                                  .map((p, i) => p.name === platformName ? i : -1)
                                  .filter(i => i !== -1)
                                const actualIndex = allIndices[idx]

                                return (
                                  <div key={`${platformName}-${idx}`} className="px-4 md:px-6 pb-5 pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <p className="text-sm font-semibold text-gray-700">
                                          {platform.handle || `Account ${idx + 1}`}
                                        </p>
                                        {platform.handle && (
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            {platform.followers > 0 ? `${formatFollowersDE(platform.followers)} followers` : 'No followers set'}
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const allOfType = editFormData.platforms
                                            .map((p, i) => ({ platform: p, index: i }))
                                            .filter(({ platform: pl }) => pl.name === platformName)
                                          const platformToRemove = allOfType[idx]
                                          if (platformToRemove) {
                                            platformMgmt.removePlatform(platformToRemove.index)
                                          }
                                        }}
                                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                      <Input
                                        label="Username"
                                        type="text"
                                        value={actualIndex >= 0 ? editFormData.platforms[actualIndex].handle : ''}
                                        onChange={(e) => platformMgmt.updatePlatform(actualIndex, 'handle', e.target.value)}
                                        placeholder="@ username"
                                        required
                                        className="bg-gray-50"
                                      />
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                          label="Followers"
                                          type="number"
                                          value={actualIndex >= 0 ? editFormData.platforms[actualIndex].followers || '' : ''}
                                          onChange={(e) => platformMgmt.updatePlatform(actualIndex, 'followers', e.target.value === '' ? '' as unknown as number : parseInt(e.target.value))}
                                          required
                                          placeholder="0"
                                          min={1}
                                          className="bg-gray-50"
                                        />
                                        <Input
                                          label="Engagement Rate (%)"
                                          type="number"
                                          value={actualIndex >= 0 ? editFormData.platforms[actualIndex].engagementRate || '' : ''}
                                          onChange={(e) => {
                                            const raw = e.target.value.replace(',', '.')
                                            platformMgmt.updatePlatform(actualIndex, 'engagementRate', raw === '' ? '' as unknown as number : parseFloat(raw))
                                          }}
                                          required
                                          placeholder="0.00"
                                          min={0.01}
                                          max={100}
                                          step="0.01"
                                          className="bg-gray-50"
                                        />
                                      </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                                      <button
                                        type="button"
                                        onClick={() => platformMgmt.togglePlatformExpanded(actualIndex)}
                                        className="flex items-center justify-between w-full text-left"
                                      >
                                        <span className="text-sm font-semibold text-gray-800">Audience Demographics (Optional)</span>
                                        {expandedPlatforms.has(actualIndex) ? (
                                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                        ) : (
                                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                        )}
                                      </button>

                                      {expandedPlatforms.has(actualIndex) && (
                                        <div className="mt-4 space-y-4">
                                          {/* Top Countries */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <p className="text-sm font-semibold text-gray-800">Top Countries</p>
                                                <p className="text-xs text-gray-500">Select up to 3 countries with their audience percentage</p>
                                              </div>
                                            </div>
                                            <div className="space-y-2">
                                              <input
                                                type="text"
                                                value={platformCountryInputs[actualIndex] || ''}
                                                onChange={(e) => platformMgmt.handleCountryInputChange(actualIndex, e.target.value)}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    platformMgmt.addCountryFromInput(actualIndex)
                                                  }
                                                }}
                                                placeholder="Search countries..."
                                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                                              />
                                              {platformMgmt.getAvailableCountries(actualIndex).length > 0 && (
                                                <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                                  {platformMgmt.getAvailableCountries(actualIndex).map((country) => (
                                                    <button
                                                      key={country}
                                                      type="button"
                                                      onClick={() => platformMgmt.addCountryFromInput(actualIndex, country)}
                                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                                                    >
                                                      {country}
                                                    </button>
                                                  ))}
                                                </div>
                                              )}
                                              {editFormData.platforms[actualIndex]?.topCountries?.length ? (
                                                <div className="space-y-2">
                                                  {editFormData.platforms[actualIndex].topCountries!.map((country, countryIndex) => (
                                                    <div
                                                      key={`${country.country}-${countryIndex}`}
                                                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-primary-50/60 px-3 py-2"
                                                    >
                                                      <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-800 truncate">{country.country || 'Country'}</p>
                                                        <p className="text-xs text-gray-500">Audience percentage</p>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1">
                                                          <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            value={country.percentage && country.percentage > 0 ? country.percentage : ''}
                                                            onChange={(e) => {
                                                              const raw = e.target.value
                                                              const parsed = raw === '' ? 0 : parseFloat(raw)
                                                              platformMgmt.updateTopCountry(actualIndex, countryIndex, 'percentage', parsed)
                                                            }}
                                                            placeholder="0"
                                                            className="w-16 bg-transparent text-sm text-gray-800 outline-none"
                                                          />
                                                          <span className="text-sm text-gray-500">%</span>
                                                        </div>
                                                        <button
                                                          type="button"
                                                          onClick={() => platformMgmt.removeCountryTag(actualIndex, countryIndex)}
                                                          className="p-1 text-gray-500 hover:text-primary-700"
                                                          aria-label={`Remove ${country.country}`}
                                                        >
                                                          <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-xs text-gray-500">Add up to 3 countries and set the audience % for each.</p>
                                              )}
                                            </div>
                                          </div>

                                          {/* Age Groups */}
                                          <div className="space-y-2">
                                            <div>
                                              <p className="text-sm font-semibold text-gray-800">Age Groups</p>
                                              <p className="text-xs text-gray-500">Select up to 3 age groups with their audience percentage</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {AGE_GROUP_OPTIONS.map((range) => {
                                                const isSelected = editFormData.platforms[actualIndex]?.topAgeGroups?.some((a) => a.ageRange === range)
                                                return (
                                                  <button
                                                    key={range}
                                                    type="button"
                                                    onClick={() => platformMgmt.toggleAgeGroupTag(actualIndex, range)}
                                                    className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${isSelected
                                                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                                                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-700'
                                                      }`}
                                                  >
                                                    {range}
                                                  </button>
                                                )
                                              })}
                                            </div>
                                          </div>

                                          {/* Gender Split */}
                                          <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-800">Gender Split</p>
                                            <div className="grid grid-cols-2 gap-3">
                                              <Input
                                                label="Male %"
                                                type="number"
                                                value={editFormData.platforms[actualIndex]?.genderSplit?.male && editFormData.platforms[actualIndex].genderSplit!.male > 0 ? editFormData.platforms[actualIndex].genderSplit!.male : ''}
                                                onChange={(e) => {
                                                  const val = e.target.value
                                                  const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                                  platformMgmt.updateGenderSplit(actualIndex, 'male', cleanVal === '' ? 0 : parseInt(cleanVal))
                                                }}
                                                placeholder="45"
                                                min={0}
                                                max={100}
                                                step="0.1"
                                                className="bg-gray-50"
                                              />
                                              <Input
                                                label="Female %"
                                                type="number"
                                                value={editFormData.platforms[actualIndex]?.genderSplit?.female && editFormData.platforms[actualIndex].genderSplit!.female > 0 ? editFormData.platforms[actualIndex].genderSplit!.female : ''}
                                                onChange={(e) => {
                                                  const val = e.target.value
                                                  const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                                  platformMgmt.updateGenderSplit(actualIndex, 'female', cleanVal === '' ? 0 : parseInt(cleanVal))
                                                }}
                                                placeholder="55"
                                                min={0}
                                                max={100}
                                                step="0.1"
                                                className="bg-gray-50"
                                              />
                                            </div>
                                            {editFormData.platforms[actualIndex]?.genderSplit && (editFormData.platforms[actualIndex].genderSplit!.male + editFormData.platforms[actualIndex].genderSplit!.female) > 100 && (
                                              <p className="text-xs text-red-600 mt-1">Total &gt; 100%</p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {editFormData.platforms.length === 0 && (
                    <p className="text-center text-orange-700 font-medium text-sm mt-4">
                      Connect at least one platform to complete your profile
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                    <InformationCircleIcon className="w-5 h-5 text-primary-600" />
                    <p className="leading-snug">
                      All data should be verifiable via platform insights (e.g., Instagram Insights, YouTube Analytics).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeCreatorTab === 'reviews' && (
          <CreatorReviewsTab rating={creatorProfile.rating} />
        )}
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={showPictureModal}
        onClose={() => setShowPictureModal(false)}
        title="Profile Picture"
        name={creatorProfile.name}
        picture={creatorProfile.profilePicture}
        onChangePicture={(_file, preview) => {
          setProfilePicturePreview(preview)
          setEditFormData({ ...editFormData, profilePicture: preview })
          setShowPictureModal(false)
          setIsEditingProfile(true)
        }}
        onDeletePicture={() => {
          setCreatorProfile({ ...creatorProfile, profilePicture: undefined })
          setEditFormData({ ...editFormData, profilePicture: '' })
          setProfilePicturePreview(null)
        }}
        showDeleteButton={!!creatorProfile.profilePicture}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </>
  )
}
