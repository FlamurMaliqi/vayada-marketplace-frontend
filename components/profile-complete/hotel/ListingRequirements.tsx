'use client'

import { Input } from '@/components/ui'
import { XMarkIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { PLATFORM_OPTIONS, AGE_GROUP_OPTIONS, CREATOR_TYPE_OPTIONS } from '@/lib/constants'
import type { ListingFormData, CreatorType } from '@/lib/types'

interface ListingRequirementsProps {
  listing: ListingFormData
  index: number
  countryInput: string
  countries: string[]
  onUpdateListing: (index: number, field: keyof ListingFormData, value: ListingFormData[keyof ListingFormData]) => void
  onCountryInputChange: (index: number, value: string) => void
}

export function ListingRequirements({
  listing,
  index,
  countryInput,
  countries,
  onUpdateListing,
  onCountryInputChange,
}: ListingRequirementsProps) {
  const filteredCountries = countryInput
    ? countries.filter(c =>
        c.toLowerCase().includes(countryInput.toLowerCase()) &&
        !listing.targetGroupCountries.includes(c)
      )
    : []

  return (
    <div className="pt-2 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
        <h5 className="text-lg font-semibold text-gray-900">Looking For</h5>
      </div>
      <div className="space-y-5 bg-gray-50 border border-gray-200 rounded-2xl p-4">
        {/* Platforms */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">Creator's platforms</label>
          <p className="text-sm text-gray-600 mb-3">Which platforms should the creator have?</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((platform) => {
              const isSelected = listing.lookingForPlatforms.includes(platform)
              return (
                <label
                  key={platform}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${isSelected
                    ? 'border-[#2F54EB] bg-blue-50 text-[#2F54EB]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onUpdateListing(index, 'lookingForPlatforms', [...listing.lookingForPlatforms, platform])
                      } else {
                        onUpdateListing(index, 'lookingForPlatforms', listing.lookingForPlatforms.filter((p) => p !== platform))
                      }
                    }}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                      ? 'border-[#2F54EB] bg-[#2F54EB]'
                      : 'border-gray-400 bg-white'
                      }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                  </span>
                  <span className={isSelected ? 'text-[#2F54EB]' : 'text-gray-700'}>
                    {platform}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Creator Types */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">Creator Type (optional)</label>
          <p className="text-sm text-gray-600 mb-3">What type of creators are you looking for?</p>
          <div className="flex flex-wrap gap-2">
            {CREATOR_TYPE_OPTIONS.map((type) => {
              const isSelected = listing.lookingForCreatorTypes?.includes(type as CreatorType) || false
              return (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${isSelected
                    ? 'border-[#2F54EB] bg-blue-50 text-[#2F54EB]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentTypes = listing.lookingForCreatorTypes || []
                      if (e.target.checked) {
                        onUpdateListing(index, 'lookingForCreatorTypes', [...currentTypes, type as CreatorType])
                      } else {
                        onUpdateListing(index, 'lookingForCreatorTypes', currentTypes.filter((t) => t !== type))
                      }
                    }}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                      ? 'border-[#2F54EB] bg-[#2F54EB]'
                      : 'border-gray-400 bg-white'
                      }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                  </span>
                  {type === 'Lifestyle' ? (
                    <SparklesIcon className={`w-4 h-4 mr-1 ${isSelected ? 'text-[#2F54EB]' : 'text-gray-500'}`} />
                  ) : (
                    <PaperAirplaneIcon className={`w-4 h-4 mr-1 ${isSelected ? 'text-[#2F54EB]' : 'text-gray-500'}`} />
                  )}
                  <span className={isSelected ? 'text-[#2F54EB]' : 'text-gray-700'}>
                    {type} Creator
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Min Followers */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-2">Min. Followers (optional)</label>
          <Input
            type="number"
            value={listing.lookingForMinFollowers || ''}
            onChange={(e) => onUpdateListing(index, 'lookingForMinFollowers', parseInt(e.target.value) || undefined)}
            placeholder="e.g., 50000"
            className="bg-gray-50"
          />
        </div>

        {/* Top Countries */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">Top Countries (optional)</label>
          <p className="text-sm text-gray-600 mb-3">Select up to 3 countries your target audience is from</p>
          <div className="space-y-2">
            <input
              type="text"
              value={countryInput}
              onChange={(e) => onCountryInputChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const country = countryInput.trim()
                  if (country && countries.includes(country) && !listing.targetGroupCountries.includes(country) && listing.targetGroupCountries.length < 3) {
                    onUpdateListing(index, 'targetGroupCountries', [...listing.targetGroupCountries, country])
                    onCountryInputChange(index, '')
                  }
                }
              }}
              placeholder="Search countries..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
            />
            {/* Dropdown suggestions */}
            {filteredCountries.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      if (listing.targetGroupCountries.length < 3 && !listing.targetGroupCountries.includes(country)) {
                        onUpdateListing(index, 'targetGroupCountries', [...listing.targetGroupCountries, country])
                        onCountryInputChange(index, '')
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
            {listing.targetGroupCountries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listing.targetGroupCountries.map((country, countryIndex) => (
                  <span key={countryIndex} className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 border border-primary-100">
                    {country}
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateListing(index, 'targetGroupCountries', listing.targetGroupCountries.filter((c) => c !== country))
                      }}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Age Groups */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">Age Groups</label>
          <p className="text-sm text-gray-600 mb-3">Select up to 3 age groups you want to target</p>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUP_OPTIONS.map((range) => {
              const isSelected = listing.targetGroupAgeGroups?.includes(range) || false
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    const currentGroups = listing.targetGroupAgeGroups || []
                    if (isSelected) {
                      onUpdateListing(index, 'targetGroupAgeGroups', currentGroups.filter((g) => g !== range))
                    } else {
                      if (currentGroups.length < 3) {
                        onUpdateListing(index, 'targetGroupAgeGroups', [...currentGroups, range])
                      }
                    }
                  }}
                  disabled={!isSelected && (listing.targetGroupAgeGroups?.length || 0) >= 3}
                  className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${isSelected
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                >
                  {range}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
