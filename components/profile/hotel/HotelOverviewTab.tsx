'use client'

import { MapPinIcon, GlobeAltIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Input, Textarea } from '@/components/ui'
import type { ProfileHotelProfile, HotelEditFormData } from '@/components/profile/types'

// Hotel icon SVG component
function HotelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
      <path d="M10 6h4"></path>
      <path d="M10 10h4"></path>
      <path d="M10 14h4"></path>
      <path d="M10 18h4"></path>
    </svg>
  )
}

interface HotelOverviewTabProps {
  profile: ProfileHotelProfile
  isEditing: boolean
  editFormData: HotelEditFormData
  phone: string
  onEditFormChange: (data: HotelEditFormData) => void
  onPhoneChange: (phone: string) => void
}

export function HotelOverviewTab({
  profile,
  isEditing,
  editFormData,
  phone,
  onEditFormChange,
  onPhoneChange,
}: HotelOverviewTabProps) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fafafa' }}>
          <HotelIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-sm text-gray-500">Your hotel details</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hotel Name"
            value={editFormData.name}
            onChange={(e) => onEditFormChange({ ...editFormData, name: e.target.value })}
            required
            placeholder="Hotel name"
            disabled={!isEditing}
            leadingIcon={<HotelIcon className="w-5 h-5 text-gray-400" />}
          />
          <Input
            label="Location"
            value={editFormData.location}
            onChange={(e) => onEditFormChange({ ...editFormData, location: e.target.value })}
            required
            placeholder="City, Country"
            disabled={!isEditing}
            leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>

        {/* Full-width About */}
        <div>
          <Textarea
            label="About"
            value={editFormData.about}
            onChange={(e) => onEditFormChange({ ...editFormData, about: e.target.value })}
            required
            rows={5}
            placeholder="Describe your hotel..."
            disabled={!isEditing}
          />
        </div>

        {/* Contact Information Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website"
              required
              type="url"
              value={editFormData.website}
              onChange={(e) => onEditFormChange({ ...editFormData, website: e.target.value })}
              placeholder="https://example.com"
              disabled={!isEditing}
              leadingIcon={<GlobeAltIcon className="w-5 h-5 text-gray-400" />}
            />
            <Input
              label="Phone"
              required
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+1 (555) 123-4567"
              helperText=""
              disabled={!isEditing}
              leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
