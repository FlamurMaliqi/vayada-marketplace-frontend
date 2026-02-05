'use client'

import { RefObject } from 'react'
import { Input, Textarea } from '@/components/ui'
import {
  UserIcon,
  MapPinIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CreatorFormState } from '@/lib/types'

interface CreatorBasicInfoStepProps {
  form: CreatorFormState
  onFormChange: (updates: Partial<CreatorFormState>) => void
  error: string
  imageInputRef: RefObject<HTMLInputElement>
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function CreatorBasicInfoStep({
  form,
  onFormChange,
  error,
  imageInputRef,
  onImageChange,
}: CreatorBasicInfoStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
          <p className="text-xs text-gray-500">Your creator profile details</p>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-5">
        {/* Left Column: Name & Location */}
        <div className="flex-1 space-y-3">
          <Input
            label="Name"
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            required
            placeholder="Your full name"
            error={error && error.includes('Name') ? error : undefined}
            leadingIcon={<UserIcon className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Location"
            type="text"
            value={form.location}
            onChange={(e) => onFormChange({ location: e.target.value })}
            required
            placeholder="e.g., New York, USA"
            error={error && error.includes('Location') ? error : undefined}
            leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>

        {/* Right Column: Profile Picture */}
        <div className="w-full md:w-auto flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Profile Picture</span>
          <div
            className="relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-all overflow-hidden bg-gray-50 group"
            onClick={() => imageInputRef.current?.click()}
          >
            {form.profile_image ? (
              <>
                <img
                  src={form.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[10px] font-medium">Change</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 text-gray-400 mb-1 group-hover:text-primary-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-primary-600">Upload</span>
              </>
            )}
          </div>
          <input
            type="file"
            ref={imageInputRef}
            onChange={onImageChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Creator Biography"
          value={form.short_description}
          onChange={(e) => onFormChange({ short_description: e.target.value })}
          required
          placeholder="Tell us about yourself as a travel creator"
          rows={3}
          maxLength={500}
          error={error && error.includes('description') ? error : undefined}
        />
        <p className={`text-xs mt-1 ${
          form.short_description.trim().length >= 10
            ? 'text-green-600'
            : form.short_description.trim().length > 0
              ? 'text-red-500'
              : 'text-gray-500'
        }`}>
          {form.short_description.length}/500 characters
          {form.short_description.trim().length > 0 && form.short_description.trim().length < 10 && (
            <span> (minimum 10 characters)</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-700">Portfolio Link</h4>
        <Input
          label=""
          type="url"
          value={form.portfolio_link}
          onChange={(e) => onFormChange({ portfolio_link: e.target.value })}
          placeholder="https://your-portfolio.com"
          helperText="Optional - Your website, media kit, or best-performing content URL"
          leadingIcon={<LinkIcon className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <h4 className="text-base font-bold text-gray-900">Contact Information</h4>
          <p className="text-sm text-gray-500 mt-1">Your email & phone number for direct communication with properties after both accept a collaboration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || '' : ''}
            disabled
            required
            leadingIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
            className="bg-gray-50 text-gray-500"
          />
          <Input
            label="Phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => onFormChange({ phone: e.target.value })}
            placeholder="+1-555-123-4567"
            leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>
      </div>
    </div>
  )
}
