'use client'

import { PencilIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { HotelBadgeIcon } from '@/components/ui'
import type { ProfileHotelListing } from '@/components/profile/types'

interface ListingCardHeaderProps {
  listing: ProfileHotelListing
  index: number
  isCollapsed: boolean
  showDeleteButton: boolean
  onToggleCollapse: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ListingCardHeader({
  listing,
  index,
  isCollapsed,
  showDeleteButton,
  onToggleCollapse,
  onEdit,
  onDelete,
}: ListingCardHeaderProps) {
  const isComplete = !!(
    listing.name.trim() &&
    listing.location.trim() &&
    listing.accommodationType &&
    listing.description.trim() &&
    listing.collaborationTypes.length > 0 &&
    listing.availability.length > 0
  )

  return (
    <div className="flex items-center justify-between">
      <div
        onClick={onToggleCollapse}
        className="flex items-center gap-3 flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
      >
        <HotelBadgeIcon active={isComplete} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-base">
            {listing.name || `Property Listing ${index + 1}`}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            title="Edit listing"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>
          {showDeleteButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Remove listing"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
          {isCollapsed ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  )
}
