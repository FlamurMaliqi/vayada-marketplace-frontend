'use client'

import { RefObject } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CreatorFormState, PlatformFormData, CreatorType } from '@/lib/types'
import { FormNavigationButtons } from '../FormNavigationButtons'
import { CreatorTypeStep } from './CreatorTypeStep'
import { CreatorBasicInfoStep } from './CreatorBasicInfoStep'
import { CreatorPlatformsStep } from './CreatorPlatformsStep'

interface CreatorProfileFormProps {
  // Form state
  form: CreatorFormState
  platforms: PlatformFormData[]

  // Step management
  currentStep: number
  totalSteps: number

  // UI state
  error: string
  submitting: boolean
  canProceed: boolean
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>

  // Refs
  imageInputRef: RefObject<HTMLInputElement>

  // Form handlers
  onFormChange: (updates: Partial<CreatorFormState>) => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  // Platform handlers
  onAddPlatform: (name: string) => void
  onRemovePlatform: (index: number) => void
  onUpdatePlatform: (index: number, field: keyof PlatformFormData, value: PlatformFormData[keyof PlatformFormData]) => void
  onTogglePlatformExpanded: (index: number) => void

  // Country handlers
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountry: (platformIndex: number, country?: string) => void
  onRemoveCountry: (platformIndex: number, countryIndex: number) => void
  onUpdateCountryPercentage: (platformIndex: number, countryIndex: number, percentage: number) => void
  getAvailableCountries: (platformIndex: number) => string[]

  // Age/gender handlers
  onToggleAgeGroup: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, field: 'male' | 'female', value: string) => void

  // Navigation handlers
  onPrevStep: () => void
  onNextStep: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function CreatorProfileForm({
  form,
  platforms,
  currentStep,
  totalSteps,
  error,
  submitting,
  canProceed,
  expandedPlatforms,
  platformCountryInputs,
  imageInputRef,
  onFormChange,
  onImageChange,
  onAddPlatform,
  onRemovePlatform,
  onUpdatePlatform,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountryPercentage,
  getAvailableCountries,
  onToggleAgeGroup,
  onUpdateGenderSplit,
  onPrevStep,
  onNextStep,
  onSubmit,
}: CreatorProfileFormProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === totalSteps) {
      onSubmit(e)
    } else {
      onNextStep()
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
      {/* Step 1: Creator Type Selection */}
      {currentStep === 1 && (
        <CreatorTypeStep
          selectedType={form.creator_type}
          onSelect={(type: CreatorType) => onFormChange({ creator_type: type })}
        />
      )}

      {/* Step 2: Basic Information */}
      {currentStep === 2 && (
        <CreatorBasicInfoStep
          form={form}
          onFormChange={onFormChange}
          error={error}
          imageInputRef={imageInputRef}
          onImageChange={onImageChange}
        />
      )}

      {/* Step 3: Platforms Section */}
      {currentStep === 3 && (
        <CreatorPlatformsStep
          platforms={platforms}
          expandedPlatforms={expandedPlatforms}
          platformCountryInputs={platformCountryInputs}
          onAddPlatform={onAddPlatform}
          onRemovePlatform={onRemovePlatform}
          onUpdatePlatform={onUpdatePlatform}
          onTogglePlatformExpanded={onTogglePlatformExpanded}
          onCountryInputChange={onCountryInputChange}
          onAddCountry={onAddCountry}
          onRemoveCountry={onRemoveCountry}
          onUpdateCountryPercentage={onUpdateCountryPercentage}
          onToggleAgeGroup={onToggleAgeGroup}
          onUpdateGenderSplit={onUpdateGenderSplit}
          getAvailableCountries={getAvailableCountries}
        />
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 font-medium whitespace-pre-line">{error}</p>
        </div>
      )}

      <FormNavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        submitting={submitting}
        canProceed={canProceed}
        onPrevious={onPrevStep}
        onNext={onNextStep}
        submitLabel="Review & Complete Profile"
      />
    </form>
  )
}
