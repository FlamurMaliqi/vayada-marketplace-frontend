'use client'

import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui'
import { PLATFORM_OPTIONS, AGE_GROUP_OPTIONS } from '@/lib/constants'
import type { ProfilePlatform, CreatorEditFormData } from '@/components/profile/types'
import { PlatformCardView } from './PlatformCardView'
import { PlatformIcon, getPlatformGradient } from './PlatformIcon'
import { formatFollowersDE } from './utils'

interface CreatorPlatformsTabProps {
  isEditing: boolean
  platforms: ProfilePlatform[]
  editFormData: CreatorEditFormData
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>
  onTogglePlatformExpanded: (index: number) => void
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountryFromInput: (platformIndex: number, country?: string) => void
  onRemoveCountryTag: (platformIndex: number, countryIndex: number) => void
  onUpdateTopCountry: (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => void
  onToggleAgeGroupTag: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, gender: 'male' | 'female', value: number) => void
  onUpdatePlatform: (index: number, field: string, value: string | number) => void
  onAddPlatform: (platformName: string) => void
  onRemovePlatform: (index: number) => void
  getAvailableCountries: (platformIndex: number) => string[]
}

export function CreatorPlatformsTab({
  isEditing,
  platforms,
  editFormData,
  expandedPlatforms,
  platformCountryInputs,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountryFromInput,
  onRemoveCountryTag,
  onUpdateTopCountry,
  onToggleAgeGroupTag,
  onUpdateGenderSplit,
  onUpdatePlatform,
  onAddPlatform,
  onRemovePlatform,
  getAvailableCountries,
}: CreatorPlatformsTabProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Social Media Platforms</h2>
      </div>

      {!isEditing ? (
        <ViewMode platforms={platforms} />
      ) : (
        <EditMode
          editFormData={editFormData}
          expandedPlatforms={expandedPlatforms}
          platformCountryInputs={platformCountryInputs}
          onTogglePlatformExpanded={onTogglePlatformExpanded}
          onCountryInputChange={onCountryInputChange}
          onAddCountryFromInput={onAddCountryFromInput}
          onRemoveCountryTag={onRemoveCountryTag}
          onUpdateTopCountry={onUpdateTopCountry}
          onToggleAgeGroupTag={onToggleAgeGroupTag}
          onUpdateGenderSplit={onUpdateGenderSplit}
          onUpdatePlatform={onUpdatePlatform}
          onAddPlatform={onAddPlatform}
          onRemovePlatform={onRemovePlatform}
          getAvailableCountries={getAvailableCountries}
        />
      )}
    </div>
  )
}

function ViewMode({ platforms }: { platforms: ProfilePlatform[] }) {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No platforms added yet. Edit your profile to add social media platforms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {platforms.map((platform, index) => (
        <PlatformCardView key={index} platform={platform} />
      ))}
    </div>
  )
}

interface EditModeProps {
  editFormData: CreatorEditFormData
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>
  onTogglePlatformExpanded: (index: number) => void
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountryFromInput: (platformIndex: number, country?: string) => void
  onRemoveCountryTag: (platformIndex: number, countryIndex: number) => void
  onUpdateTopCountry: (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => void
  onToggleAgeGroupTag: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, gender: 'male' | 'female', value: number) => void
  onUpdatePlatform: (index: number, field: string, value: string | number) => void
  onAddPlatform: (platformName: string) => void
  onRemovePlatform: (index: number) => void
  getAvailableCountries: (platformIndex: number) => string[]
}

function EditMode({
  editFormData,
  expandedPlatforms,
  platformCountryInputs,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountryFromInput,
  onRemoveCountryTag,
  onUpdateTopCountry,
  onToggleAgeGroupTag,
  onUpdateGenderSplit,
  onUpdatePlatform,
  onAddPlatform,
  onRemovePlatform,
  getAvailableCountries,
}: EditModeProps) {
  return (
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
          {PLATFORM_OPTIONS.map((platformName) => (
            <PlatformSection
              key={platformName}
              platformName={platformName}
              editFormData={editFormData}
              expandedPlatforms={expandedPlatforms}
              platformCountryInputs={platformCountryInputs}
              onTogglePlatformExpanded={onTogglePlatformExpanded}
              onCountryInputChange={onCountryInputChange}
              onAddCountryFromInput={onAddCountryFromInput}
              onRemoveCountryTag={onRemoveCountryTag}
              onUpdateTopCountry={onUpdateTopCountry}
              onToggleAgeGroupTag={onToggleAgeGroupTag}
              onUpdateGenderSplit={onUpdateGenderSplit}
              onUpdatePlatform={onUpdatePlatform}
              onAddPlatform={onAddPlatform}
              onRemovePlatform={onRemovePlatform}
              getAvailableCountries={getAvailableCountries}
            />
          ))}
        </div>

        {/* Error Message */}
        {editFormData.platforms.length === 0 && (
          <p className="text-center text-orange-700 font-medium text-sm mt-4">
            Connect at least one platform to complete your profile
          </p>
        )}

        {/* Info Box */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
          <InformationCircleIcon className="w-5 h-5 text-primary-600" />
          <p className="leading-snug">
            All data should be verifiable via platform insights (e.g., Instagram Insights, YouTube Analytics).
          </p>
        </div>
      </div>
    </div>
  )
}

interface PlatformSectionProps {
  platformName: string
  editFormData: CreatorEditFormData
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>
  onTogglePlatformExpanded: (index: number) => void
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountryFromInput: (platformIndex: number, country?: string) => void
  onRemoveCountryTag: (platformIndex: number, countryIndex: number) => void
  onUpdateTopCountry: (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => void
  onToggleAgeGroupTag: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, gender: 'male' | 'female', value: number) => void
  onUpdatePlatform: (index: number, field: string, value: string | number) => void
  onAddPlatform: (platformName: string) => void
  onRemovePlatform: (index: number) => void
  getAvailableCountries: (platformIndex: number) => string[]
}

function PlatformSection({
  platformName,
  editFormData,
  expandedPlatforms,
  platformCountryInputs,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountryFromInput,
  onRemoveCountryTag,
  onUpdateTopCountry,
  onToggleAgeGroupTag,
  onUpdateGenderSplit,
  onUpdatePlatform,
  onAddPlatform,
  onRemovePlatform,
  getAvailableCountries,
}: PlatformSectionProps) {
  const platformsOfThisType = editFormData.platforms.filter((p) => p.name === platformName)
  const hasPlatforms = platformsOfThisType.length > 0

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
      {/* Platform Header */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br ${getPlatformGradient(platformName)}`}>
            <PlatformIcon platform={platformName} className="w-6 h-6 text-white" />
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
          onClick={() => onAddPlatform(platformName)}
          className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
        >
          Add Account
        </button>
      </div>

      {/* Show all platforms of this type */}
      {platformsOfThisType.length > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {platformsOfThisType.map((platform, idx) => {
            const allIndices = editFormData.platforms
              .map((p, i) => p.name === platformName ? i : -1)
              .filter(i => i !== -1)
            const actualIndex = allIndices[idx]

            return (
              <PlatformAccountForm
                key={`${platformName}-${idx}`}
                platform={platform}
                idx={idx}
                actualIndex={actualIndex}
                editFormData={editFormData}
                expandedPlatforms={expandedPlatforms}
                platformCountryInputs={platformCountryInputs}
                onTogglePlatformExpanded={onTogglePlatformExpanded}
                onCountryInputChange={onCountryInputChange}
                onAddCountryFromInput={onAddCountryFromInput}
                onRemoveCountryTag={onRemoveCountryTag}
                onUpdateTopCountry={onUpdateTopCountry}
                onToggleAgeGroupTag={onToggleAgeGroupTag}
                onUpdateGenderSplit={onUpdateGenderSplit}
                onUpdatePlatform={onUpdatePlatform}
                onRemovePlatform={onRemovePlatform}
                getAvailableCountries={getAvailableCountries}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

interface PlatformAccountFormProps {
  platform: ProfilePlatform
  idx: number
  actualIndex: number
  editFormData: CreatorEditFormData
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>
  onTogglePlatformExpanded: (index: number) => void
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountryFromInput: (platformIndex: number, country?: string) => void
  onRemoveCountryTag: (platformIndex: number, countryIndex: number) => void
  onUpdateTopCountry: (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => void
  onToggleAgeGroupTag: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, gender: 'male' | 'female', value: number) => void
  onUpdatePlatform: (index: number, field: string, value: string | number) => void
  onRemovePlatform: (index: number) => void
  getAvailableCountries: (platformIndex: number) => string[]
}

function PlatformAccountForm({
  platform,
  idx,
  actualIndex,
  editFormData,
  expandedPlatforms,
  platformCountryInputs,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountryFromInput,
  onRemoveCountryTag,
  onUpdateTopCountry,
  onToggleAgeGroupTag,
  onUpdateGenderSplit,
  onUpdatePlatform,
  onRemovePlatform,
  getAvailableCountries,
}: PlatformAccountFormProps) {
  const availableCountries = getAvailableCountries(actualIndex)

  return (
    <div className="px-4 md:px-6 pb-5 pt-4">
      {/* Account Header */}
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
          onClick={() => onRemovePlatform(actualIndex)}
          className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
        >
          Remove
        </button>
      </div>

      {/* Account Form */}
      <div className="space-y-3 mb-4">
        <Input
          label="Username"
          type="text"
          value={actualIndex >= 0 ? editFormData.platforms[actualIndex].handle : ''}
          onChange={(e) => onUpdatePlatform(actualIndex, 'handle', e.target.value)}
          placeholder="@ username"
          required
          className="bg-gray-50"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Followers"
            type="number"
            value={actualIndex >= 0 ? editFormData.platforms[actualIndex].followers || '' : ''}
            onChange={(e) => onUpdatePlatform(actualIndex, 'followers', e.target.value === '' ? '' : parseInt(e.target.value))}
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
              onUpdatePlatform(actualIndex, 'engagementRate', raw === '' ? '' : parseFloat(raw))
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

      {/* Demographics Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <button
          type="button"
          onClick={() => onTogglePlatformExpanded(actualIndex)}
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
                  onChange={(e) => onCountryInputChange(actualIndex, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onAddCountryFromInput(actualIndex)
                    }
                  }}
                  placeholder="Search countries..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                />
                {/* Dropdown suggestions */}
                {availableCountries.length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    {availableCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => onAddCountryFromInput(actualIndex, country)}
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
                                onUpdateTopCountry(actualIndex, countryIndex, 'percentage', parsed)
                              }}
                              placeholder="0"
                              className="w-16 bg-transparent text-sm text-gray-800 outline-none"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveCountryTag(actualIndex, countryIndex)}
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

            {/* Top Age Groups */}
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
                      onClick={() => onToggleAgeGroupTag(actualIndex, range)}
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
                    onUpdateGenderSplit(actualIndex, 'male', cleanVal === '' ? 0 : parseInt(cleanVal))
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
                    onUpdateGenderSplit(actualIndex, 'female', cleanVal === '' ? 0 : parseInt(cleanVal))
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
}
