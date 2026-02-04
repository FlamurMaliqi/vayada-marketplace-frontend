'use client'

import { RefObject } from 'react'
import { Input, Textarea } from '@/components/ui'
import {
  XMarkIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { HOTEL_TYPES } from '@/lib/constants'
import type { ListingFormData } from '@/lib/types'
import { ListingOfferings } from './ListingOfferings'
import { ListingRequirements } from './ListingRequirements'

interface ListingCardProps {
  listing: ListingFormData
  index: number
  isCollapsed: boolean
  countryInput: string
  countries: string[]
  imageInputRef: RefObject<HTMLInputElement>
  canRemove: boolean
  onToggleCollapse: () => void
  onRemove: () => void
  onUpdateListing: (index: number, field: keyof ListingFormData, value: ListingFormData[keyof ListingFormData]) => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (imageIndex: number) => void
  onCountryInputChange: (index: number, value: string) => void
}

export function ListingCard({
  listing,
  index,
  isCollapsed,
  countryInput,
  countries,
  imageInputRef,
  canRemove,
  onToggleCollapse,
  onRemove,
  onUpdateListing,
  onImageChange,
  onRemoveImage,
  onCountryInputChange,
}: ListingCardProps) {
  // Check if listing is complete (has all required basic fields)
  const isComplete = listing.name.trim() &&
    listing.location.trim() &&
    listing.accommodation_type.trim() &&
    listing.description.trim() &&
    listing.collaborationTypes.length > 0 &&
    listing.availability.length > 0 &&
    listing.platforms.length > 0 &&
    listing.lookingForPlatforms.length > 0

  return (
    <div className="border border-gray-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${isComplete
            ? 'bg-green-100 text-green-700'
            : 'bg-[#EEF2FF] text-[#2F54EB]'
            }`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-base">
              {listing.name || `Property Listing ${index + 1}`}
            </h4>
            {isCollapsed && listing.name && (
              <p className="text-xs text-gray-500 mt-0">
                {listing.location && `${listing.location}`} {listing.accommodation_type && `${listing.accommodation_type}`}
              </p>
            )}
          </div>
          {isCollapsed ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Remove listing"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Basic Information */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold text-gray-900">Basic Information</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Listing Name"
                type="text"
                value={listing.name}
                onChange={(e) => onUpdateListing(index, 'name', e.target.value)}
                required
                placeholder="Hotel Vayada"
                className="bg-gray-50 border-gray-200"
              />

              <Input
                label="Location"
                type="text"
                value={listing.location}
                onChange={(e) => onUpdateListing(index, 'location', e.target.value)}
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
                value={listing.accommodation_type}
                onChange={(e) => onUpdateListing(index, 'accommodation_type', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 text-sm text-gray-900"
              >
                <option value="">Select type</option>
                {HOTEL_TYPES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Description"
              value={listing.description}
              onChange={(e) => onUpdateListing(index, 'description', e.target.value)}
              required
              rows={3}
              placeholder="A stunning beachfront villa with private pool and ocean views."
              className="bg-gray-50 border-gray-200"
            />

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Photos <span className="text-red-500">*</span>
              </label>
              {listing.images.length > 0 ? (
                <div className="space-y-2">
                  {/* Main Featured Image */}
                  <div className="relative group w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={listing.images[0]}
                      alt={`${listing.name} - Main photo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 right-3">
                        <button
                          type="button"
                          onClick={() => onRemoveImage(0)}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-1.5"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {listing.images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                      {listing.images.slice(1, 6).map((image, imageIndex) => (
                        <div key={imageIndex + 1} className="relative group aspect-square">
                          <img
                            src={image}
                            alt={`${listing.name} - Photo ${imageIndex + 2}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:border-primary-400 group-hover:shadow-md transition-all cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => onRemoveImage(imageIndex + 1)}
                              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
                              title="Remove image"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add More Button */}
                      {listing.images.length < 10 && (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 transition-all group cursor-pointer bg-gray-50"
                        >
                          <PlusIcon className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-medium">Add</span>
                        </button>
                      )}

                      {/* Show remaining count if more than 6 images */}
                      {listing.images.length > 6 && (
                        <div className="aspect-square rounded-lg bg-gray-800/80 flex items-center justify-center text-white text-xs font-semibold">
                          +{listing.images.length - 6}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add First Image Button (if only one image) */}
                  {listing.images.length === 1 && listing.images.length < 10 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 transition-all group cursor-pointer bg-gray-50"
                      >
                        <PlusIcon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">Add More</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-primary-400 hover:bg-primary-50 transition-all group cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 group-hover:border-primary-400 flex items-center justify-center mb-4 transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 group-hover:text-primary-500 transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-700 group-hover:text-primary-600 transition-colors mb-1">Upload Property Photos</p>
                  <p className="text-sm text-gray-500">Showcase your property with high-quality images</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP - Max 5MB per image</p>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
                multiple
              />
            </div>
          </div>

          {/* Offerings Section */}
          <ListingOfferings
            listing={listing}
            index={index}
            onUpdateListing={onUpdateListing}
          />

          {/* Looking For Section */}
          <ListingRequirements
            listing={listing}
            index={index}
            countryInput={countryInput}
            countries={countries}
            onUpdateListing={onUpdateListing}
            onCountryInputChange={onCountryInputChange}
          />
        </>
      )}
    </div>
  )
}
