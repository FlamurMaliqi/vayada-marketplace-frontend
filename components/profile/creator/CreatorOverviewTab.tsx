'use client'

import { useRef, RefObject } from 'react'
import { UserIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Input, Textarea } from '@/components/ui'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CreatorProfile, CreatorEditFormData } from '@/components/profile/types'

interface CreatorOverviewTabProps {
  profile: CreatorProfile
  isEditing: boolean
  editFormData: CreatorEditFormData
  phone: string
  onEditFormChange: (data: CreatorEditFormData) => void
  onPhoneChange: (phone: string) => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef?: RefObject<HTMLInputElement>
}

export function CreatorOverviewTab({
  profile,
  isEditing,
  editFormData,
  phone,
  onEditFormChange,
  onPhoneChange,
  onImageChange,
  fileInputRef: externalFileInputRef,
}: CreatorOverviewTabProps) {
  const internalFileInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = externalFileInputRef || internalFileInputRef

  const profilePic = isEditing ? editFormData.profilePicture : profile.profilePicture
  const hasPicture = profilePic && profilePic.trim() !== ''

  return (
    <div className="space-y-5">
      {/* Edit Profile Section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
            <p className="text-xs text-gray-500">Update your profile details</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-5">
        {/* Left Column: Name & Location */}
        <div className="flex-1 space-y-3">
          <Input
            label="Name"
            type="text"
            value={isEditing ? editFormData.name : profile.name}
            onChange={(e) => {
              if (isEditing) {
                onEditFormChange({ ...editFormData, name: e.target.value })
              }
            }}
            disabled={!isEditing}
            required
            placeholder="Your full name"
            leadingIcon={<UserIcon className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Location"
            type="text"
            value={isEditing ? editFormData.location : profile.location}
            onChange={(e) => {
              if (isEditing) {
                onEditFormChange({ ...editFormData, location: e.target.value })
              }
            }}
            disabled={!isEditing}
            required
            placeholder="e.g., New York, USA"
            leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>

        {/* Right Column: Profile Picture */}
        <div className="w-full md:w-auto flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Profile Picture</span>
          <div
            className={`relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50 group ${isEditing ? 'cursor-pointer hover:border-primary-500 hover:bg-gray-50' : 'cursor-default'
              }`}
            onClick={() => {
              if (isEditing) {
                fileInputRef.current?.click()
              }
            }}
          >
            {hasPicture ? (
              <>
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-medium">Change</span>
                  </div>
                )}
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
          <p className="text-xs text-gray-500 text-center">Optional - JPG, PNG or WebP (max 5MB)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Creator Biography"
          value={isEditing ? editFormData.shortDescription : profile.shortDescription}
          onChange={(e) => {
            if (isEditing) {
              onEditFormChange({ ...editFormData, shortDescription: e.target.value })
            }
          }}
          disabled={!isEditing}
          required
          placeholder="Tell us about yourself as a travel creator..."
          rows={3}
          maxLength={500}
          helperText={`${(isEditing ? editFormData.shortDescription : profile.shortDescription).length}/500 characters`}
        />
        <p className="text-xs text-gray-500 mt-1">Highlight your niche, primary audience demographics, and unique travel style.</p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-700">Portfolio Link</h4>
        <Input
          label=""
          type="url"
          value={isEditing ? editFormData.portfolioLink : (profile.portfolioLink || '')}
          onChange={(e) => {
            if (isEditing) {
              onEditFormChange({ ...editFormData, portfolioLink: e.target.value })
            }
          }}
          disabled={!isEditing}
          placeholder="https://your-portfolio.com"
          helperText="Optional - Your website, media kit, or best-performing content URL"
          leadingIcon={<LinkIcon className="w-5 h-5 text-gray-400" />}
        />
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4 pt-2">
        <div>
          <h4 className="text-base font-bold text-gray-900">Contact Information</h4>
          <p className="text-sm text-gray-500 mt-1">Your email & phone number for direct communication with properties after both accept a collaboration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || profile.email : profile.email}
            disabled
            required
            leadingIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
            className="bg-gray-50 text-gray-500"
          />
          <Input
            label="Phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => {
              if (isEditing) {
                onPhoneChange(e.target.value)
              }
            }}
            disabled={!isEditing}
            placeholder="+1-555-123-4567"
            leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>
      </div>
    </div>
  )
}
