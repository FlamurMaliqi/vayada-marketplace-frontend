'use client'

import { XMarkIcon, SparklesIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Input, Textarea, Button, HotelBadgeIcon } from '@/components/ui'
import { HOTEL_TYPES, CREATOR_TYPE_OPTIONS } from '@/lib/constants'
import type { CreatorType } from '@/lib/types'
import { OfferingEditorCard } from './OfferingEditorCard'
import { PlatformSelector } from './PlatformSelector'
import { AgeGroupSelector } from './AgeGroupSelector'
import { CountrySearchInput } from './CountrySearchInput'
import { ListingImageGallery } from './ListingImageGallery'
import type { ListingFormData, ListingOffering } from '../types'
import { createEmptyOffering } from '../types'

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

  const updateOffering = (idx: number, next: ListingOffering) => {
    const offerings = formData.offerings.map((o, i) => (i === idx ? next : o))
    updateField('offerings', offerings)
  }

  const removeOffering = (idx: number) => {
    updateField('offerings', formData.offerings.filter((_, i) => i !== idx))
  }

  const addOffering = () => {
    updateField('offerings', [...formData.offerings, createEmptyOffering()])
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

      {/* Offerings Section — one card per offering, each with its own months / followers */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-primary-600 rounded-full"></div>
            <h5 className="text-lg font-semibold text-gray-900">Offerings</h5>
          </div>
          <p className="text-xs text-gray-500">
            Add one offering per tier — months and follower thresholds are configured individually.
          </p>
        </div>
        <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
          {formData.offerings.length === 0 && (
            <p className="text-sm text-gray-500">
              No offerings yet — add one to describe what you give creators in exchange for content.
            </p>
          )}
          {formData.offerings.map((offering, idx) => (
            <OfferingEditorCard
              key={idx}
              offering={offering}
              index={idx}
              canRemove={formData.offerings.length > 1}
              onChange={(next) => updateOffering(idx, next)}
              onRemove={() => removeOffering(idx)}
            />
          ))}
          <button
            type="button"
            onClick={addOffering}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary-300 bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add another offering
          </button>
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

          {/* Min Followers (listing-level fallback) */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">Min. Followers (optional)</label>
            <p className="text-sm text-gray-600 mb-2">
              Listing-level minimum, applied when an offering doesn&apos;t override it.
            </p>
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
