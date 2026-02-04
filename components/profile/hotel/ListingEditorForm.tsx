'use client'

import { XMarkIcon, GiftIcon, CurrencyDollarIcon, TagIcon, CalendarDaysIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Input, Textarea, Button, HotelBadgeIcon } from '@/components/ui'
import { HOTEL_TYPES, CREATOR_TYPE_OPTIONS } from '@/lib/constants'
import type { CreatorType } from '@/lib/types'
import { CollaborationTypeSelector } from './CollaborationTypeSelector'
import { AvailabilityMonthSelector } from './AvailabilityMonthSelector'
import { PlatformSelector } from './PlatformSelector'
import { AgeGroupSelector } from './AgeGroupSelector'
import { CountrySearchInput } from './CountrySearchInput'
import { ListingImageGallery } from './ListingImageGallery'
import type { ListingFormData } from '../types'

const HOTEL_CATEGORIES = HOTEL_TYPES

interface ListingEditorFormProps {
  formData: ListingFormData
  onChange: (data: ListingFormData) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  isEditing: boolean
  listingIndex?: number
  listingImageInputRef: React.RefObject<HTMLInputElement>
  onManagePhotos: () => void
  onAddImage: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  countryInput: string
  onCountryInputChange: (value: string) => void
}

export function ListingEditorForm({
  formData,
  onChange,
  onSave,
  onCancel,
  isSaving,
  isEditing,
  listingIndex,
  listingImageInputRef,
  onManagePhotos,
  onAddImage,
  onImageChange,
  countryInput,
  onCountryInputChange,
}: ListingEditorFormProps) {
  const updateField = <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header for new listing */}
      {!isEditing && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HotelBadgeIcon active={false} />
            <h4 className="font-semibold text-gray-900 text-base">
              {formData.name || `Property Listing ${listingIndex ?? 1}`}
            </h4>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            title="Cancel"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Basic Information Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Listing Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              placeholder="Luxury Beach Villa"
              className="bg-gray-50 border-gray-200"
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              required
              placeholder="Bali, Indonesia"
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Accommodation Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.accommodationType}
              onChange={(e) => updateField('accommodationType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 text-sm text-gray-900"
              required
            >
              <option value="">Select type</option>
              {HOTEL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
            rows={3}
            placeholder="A stunning beachfront villa with private pool and ocean views."
            className="bg-gray-50 border-gray-200"
          />
          {/* Images */}
          <ListingImageGallery
            images={formData.images}
            listingName={formData.name}
            onManagePhotos={onManagePhotos}
            onAddImage={onAddImage}
            listingImageInputRef={listingImageInputRef}
            onImageChange={onImageChange}
          />
        </div>
      </div>

      {/* Offerings Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-5 bg-primary-600 rounded-full"></div>
          <h5 className="text-lg font-semibold text-gray-900">Offerings</h5>
        </div>
        <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
          {/* Collaboration Types */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Collaboration Types <span className="text-red-500">*</span>
            </label>
            <CollaborationTypeSelector
              selectedTypes={formData.collaborationTypes}
              onChange={(types) => updateField('collaborationTypes', types as ('Free Stay' | 'Paid' | 'Discount')[])}
            />
          </div>

          {/* Free Stay Details */}
          {formData.collaborationTypes.includes('Free Stay') && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center">
                  <GiftIcon className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900 text-base">Free Stay Details</h6>
                  <p className="text-sm text-gray-600">Specify the night range for free stays</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Min. Nights"
                  type="number"
                  value={formData.freeStayMinNights || ''}
                  min={1}
                  onChange={(e) => {
                    const { value } = e.target
                    if (value === '') {
                      updateField('freeStayMinNights', undefined)
                      return
                    }
                    const parsed = parseInt(value)
                    updateField('freeStayMinNights', Number.isNaN(parsed) ? undefined : Math.max(1, parsed))
                  }}
                  placeholder="1"
                  required
                  className="bg-gray-50 border-gray-200"
                />
                <Input
                  label="Max. Nights"
                  type="number"
                  value={formData.freeStayMaxNights || ''}
                  min={1}
                  onChange={(e) => {
                    const { value } = e.target
                    if (value === '') {
                      updateField('freeStayMaxNights', undefined)
                      return
                    }
                    const parsed = parseInt(value)
                    updateField('freeStayMaxNights', Number.isNaN(parsed) ? undefined : Math.max(1, parsed))
                  }}
                  placeholder="5"
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Paid Details */}
          {formData.collaborationTypes.includes('Paid') && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center">
                  <CurrencyDollarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900 text-base">Paid Details</h6>
                  <p className="text-sm text-gray-600">Set the maximum payment amount</p>
                </div>
              </div>
              <Input
                label="Max. Amount ($)"
                type="number"
                value={formData.paidMaxAmount || ''}
                onChange={(e) => updateField('paidMaxAmount', parseInt(e.target.value) || undefined)}
                placeholder="5000"
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>
          )}

          {/* Discount Details */}
          {formData.collaborationTypes.includes('Discount') && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center">
                  <TagIcon className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900 text-base">Discount Details</h6>
                  <p className="text-sm text-gray-600">Set the discount percentage</p>
                </div>
              </div>
              <Input
                label="Discount Percentage (%)"
                type="number"
                value={formData.discountPercentage || ''}
                onChange={(e) => updateField('discountPercentage', parseInt(e.target.value) || undefined)}
                placeholder="20"
                min={1}
                max={100}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>
          )}

          {/* Availability */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
              <label className="block text-base font-semibold text-gray-900">
                Availability <span className="text-red-500">*</span>
              </label>
            </div>
            <AvailabilityMonthSelector
              selectedMonths={formData.availability}
              onChange={(months) => updateField('availability', months)}
            />
          </div>

          {/* Platforms */}
          <PlatformSelector
            selectedPlatforms={formData.platforms}
            onChange={(platforms) => updateField('platforms', platforms)}
            label="Property posting platforms"
            description="On which platforms is your property active?"
          />
        </div>
      </div>

      {/* Looking For Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
          <h5 className="text-lg font-semibold text-gray-900">Looking For</h5>
        </div>
        <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
          {/* Platforms */}
          <PlatformSelector
            selectedPlatforms={formData.lookingForPlatforms}
            onChange={(platforms) => updateField('lookingForPlatforms', platforms)}
            label="Creator's platforms"
            description="Which platforms should the creator have?"
          />

          {/* Creator Types */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-1">Creator Type (optional)</label>
            <p className="text-sm text-gray-600 mb-3">What type of creators are you looking for?</p>
            <div className="flex flex-wrap gap-2">
              {CREATOR_TYPE_OPTIONS.map((type) => {
                const isSelected = formData.lookingForCreatorTypes?.includes(type as CreatorType) || false
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
                        const currentTypes = formData.lookingForCreatorTypes || []
                        if (e.target.checked) {
                          updateField('lookingForCreatorTypes', [...currentTypes, type as CreatorType])
                        } else {
                          updateField('lookingForCreatorTypes', currentTypes.filter((t) => t !== type))
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
              value={formData.lookingForMinFollowers || ''}
              onChange={(e) => updateField('lookingForMinFollowers', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 50000"
              className="bg-gray-50"
            />
          </div>

          {/* Top Countries */}
          <CountrySearchInput
            selectedCountries={formData.targetGroupCountries}
            onChange={(countries) => updateField('targetGroupCountries', countries)}
            searchValue={countryInput}
            onSearchChange={onCountryInputChange}
            label="Top Countries (optional)"
            description="Select up to 3 countries your target audience is from"
          />

          {/* Age Groups */}
          <AgeGroupSelector
            selectedGroups={formData.targetGroupAgeGroups || []}
            onChange={(groups) => updateField('targetGroupAgeGroups', groups)}
            label="Age Groups (optional)"
            description="Select up to 3 age groups you want to target"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          isLoading={isSaving}
          disabled={!formData.name || !formData.location || !formData.description}
        >
          {isEditing ? 'Save Changes' : 'Create Listing'}
        </Button>
      </div>
    </div>
  )
}
