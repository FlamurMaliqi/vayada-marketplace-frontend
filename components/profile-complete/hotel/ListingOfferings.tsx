'use client'

import { Input } from '@/components/ui'
import {
  CheckCircleIcon,
  GiftIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarDaysIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { MONTHS_FULL, PLATFORM_OPTIONS, COLLABORATION_TYPES } from '@/lib/constants'
import { CURRENCY_OPTIONS } from '@/lib/utils/getCurrencySymbol'
import type { ListingFormData } from '@/lib/types'

interface ListingOfferingsProps {
  listing: ListingFormData
  index: number
  onUpdateListing: (index: number, field: keyof ListingFormData, value: ListingFormData[keyof ListingFormData]) => void
}

export function ListingOfferings({ listing, index, onUpdateListing }: ListingOfferingsProps) {
  return (
    <div className="pt-2 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-5 bg-primary-600 rounded-full"></div>
        <h5 className="text-lg font-semibold text-gray-900">Offerings</h5>
      </div>
      <div className="space-y-5 bg-gray-50 border border-gray-200 rounded-2xl p-4">
        {/* Collaboration Types */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Collaboration Types <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COLLABORATION_TYPES.map((type) => {
              const isSelected = listing.collaborationTypes.includes(type)
              const icons = {
                'Free Stay': GiftIcon,
                'Paid': CurrencyDollarIcon,
                'Discount': TagIcon,
                'Affiliate': LinkIcon,
              }
              const Icon = icons[type as keyof typeof icons]

              return (
                <label
                  key={type}
                  className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all text-center ${isSelected
                    ? 'bg-purple-50 border-[#2F54EB] shadow-sm'
                    : 'bg-[#F7F7FA] border-[#E5E7EB] text-gray-800 hover:border-primary-200'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onUpdateListing(index, 'collaborationTypes', [...listing.collaborationTypes, type])
                        // Prefill the Affiliate commission to 5% only when the
                        // field is still empty/untouched, so user input or a
                        // stored value is never overwritten.
                        if (type === 'Affiliate' && listing.commissionPercentage == null) {
                          onUpdateListing(index, 'commissionPercentage', 5)
                        }
                      } else {
                        onUpdateListing(index, 'collaborationTypes', listing.collaborationTypes.filter((t) => t !== type))
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#2F54EB] text-white' : 'bg-white text-gray-700'
                    }`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                    {type}
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs font-medium text-[#2F54EB]">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </div>
                  )}
                </label>
              )
            })}
          </div>
        </div>

        {/* Free Stay Details */}
        {listing.collaborationTypes.includes('Free Stay') && (
          <div className="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all space-y-3">
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
                value={listing.freeStayMinNights || ''}
                min={1}
                onChange={(e) => {
                  const { value } = e.target
                  if (value === '') {
                    onUpdateListing(index, 'freeStayMinNights', undefined)
                    return
                  }
                  const parsed = parseInt(value)
                  onUpdateListing(index, 'freeStayMinNights', Number.isNaN(parsed) ? undefined : Math.max(1, parsed))
                }}
                placeholder="1"
                required
                className="bg-gray-50 border-gray-200"
              />
              <Input
                label="Max. Nights"
                type="number"
                value={listing.freeStayMaxNights || ''}
                min={1}
                onChange={(e) => {
                  const { value } = e.target
                  if (value === '') {
                    onUpdateListing(index, 'freeStayMaxNights', undefined)
                    return
                  }
                  const parsed = parseInt(value)
                  onUpdateListing(index, 'freeStayMaxNights', Number.isNaN(parsed) ? undefined : Math.max(1, parsed))
                }}
                placeholder="5"
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        )}

        {/* Paid Details */}
        {listing.collaborationTypes.includes('Paid') && (
          <div className="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-900 text-base">Paid Details</h6>
                <p className="text-sm text-gray-600">Set the maximum payment amount</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-32">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Currency</label>
                <select
                  value={listing.currency || 'USD'}
                  onChange={(e) => onUpdateListing(index, 'currency', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <Input
                  label="Max. Amount"
                  type="number"
                  value={listing.paidMaxAmount || ''}
                  onChange={(e) => onUpdateListing(index, 'paidMaxAmount', parseInt(e.target.value) || undefined)}
                  placeholder="5000"
                  required
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Discount Details */}
        {listing.collaborationTypes.includes('Discount') && (
          <div className="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all space-y-3">
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
              value={listing.discountPercentage || ''}
              onChange={(e) => onUpdateListing(index, 'discountPercentage', parseInt(e.target.value) || undefined)}
              placeholder="20"
              min={1}
              max={100}
              required
              className="bg-gray-50 border-gray-200"
            />
          </div>
        )}

        {/* Affiliate Details */}
        {listing.collaborationTypes.includes('Affiliate') && (
          <div className="p-4 md:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h6 className="font-semibold text-gray-900 text-base">Affiliate Details</h6>
                <p className="text-sm text-gray-600">Commission paid on bookings driven by the creator's link</p>
              </div>
            </div>
            <Input
              label="Commission Percentage (%)"
              type="number"
              value={listing.commissionPercentage || ''}
              onChange={(e) => onUpdateListing(index, 'commissionPercentage', parseInt(e.target.value) || undefined)}
              placeholder="5"
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
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
            {/* All Year Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={() => {
                  const allMonthsSelected = MONTHS_FULL.every(month => listing.availability.includes(month))
                  if (allMonthsSelected) {
                    onUpdateListing(index, 'availability', [])
                  } else {
                    onUpdateListing(index, 'availability', [...MONTHS_FULL])
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base font-bold transition-all shadow-sm ${MONTHS_FULL.every(month => listing.availability.includes(month))
                  ? 'bg-gradient-to-r from-[#2F54EB] to-[#1e3a8a] border-[#2F54EB] text-white shadow-md'
                  : 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-300 text-primary-700 hover:from-primary-100 hover:to-primary-200 hover:border-primary-400 hover:shadow-md'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5" />
                  {MONTHS_FULL.every(month => listing.availability.includes(month)) ? 'All Year Selected' : 'Select All Year'}
                </span>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {MONTHS_FULL.map((month) => {
                const isSelected = listing.availability.includes(month)
                const monthAbbr = month.substring(0, 3)

                return (
                  <label
                    key={month}
                    className={`relative flex flex-col items-center justify-center py-3 rounded-xl border cursor-pointer transition-all ${isSelected
                      ? 'bg-[#2F54EB] border-[#2F54EB] text-white'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onUpdateListing(index, 'availability', [...listing.availability, month])
                        } else {
                          onUpdateListing(index, 'availability', listing.availability.filter((m) => m !== month))
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{monthAbbr}</div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">Property posting platforms</label>
          <p className="text-sm text-gray-600 mb-3">On which platforms is your property active?</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((platform) => {
              const isSelected = listing.platforms.includes(platform)
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
                        onUpdateListing(index, 'platforms', [...listing.platforms, platform])
                      } else {
                        onUpdateListing(index, 'platforms', listing.platforms.filter((p) => p !== platform))
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
      </div>
    </div>
  )
}
