'use client'

import { PencilIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { GiftIcon, CurrencyDollarIcon, TagIcon, CalendarDaysIcon, LinkIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { HotelBadgeIcon } from '@/components/ui'
import { PLATFORM_OPTIONS, AGE_GROUP_OPTIONS } from '@/lib/constants'
import { formatNumber, getCurrencySymbol } from '@/lib/utils'
import type { ListingOffering, ProfileHotelListing } from '../types'

const TYPE_ICONS: Record<ListingOffering['type'], typeof GiftIcon> = {
  'Free Stay': GiftIcon,
  Paid: CurrencyDollarIcon,
  Discount: TagIcon,
  Affiliate: LinkIcon,
}

function formatMonths(months: string[]): string {
  if (months.length === 12) return 'Available all year'
  if (months.length === 0) return 'No months selected'
  return months.map((m) => m.substring(0, 3)).join(', ')
}

function describeOffering(o: ListingOffering): string {
  if (o.type === 'Free Stay') {
    if (o.freeStayMinNights && o.freeStayMaxNights && o.freeStayMinNights !== o.freeStayMaxNights) {
      return `${o.freeStayMinNights}–${o.freeStayMaxNights} nights complimentary`
    }
    const n = o.freeStayMaxNights || o.freeStayMinNights
    return n ? `Up to ${n} night${n === 1 ? '' : 's'} complimentary` : 'Complimentary stay'
  }
  if (o.type === 'Paid') {
    const symbol = getCurrencySymbol(o.currency || 'USD')
    return o.paidMaxAmount ? `Up to ${symbol}${o.paidMaxAmount.toLocaleString()}` : 'Paid collaboration'
  }
  if (o.type === 'Discount') return o.discountPercentage ? `${o.discountPercentage}% off` : 'Discount'
  return o.commissionPercentage ? `${o.commissionPercentage}% commission` : 'Affiliate commission'
}

interface ListingViewCardProps {
  listing: ProfileHotelListing
  index: number
  isCollapsed: boolean
  onToggleCollapse: () => void
  onEdit: () => void
  onDelete: () => void
  canDelete: boolean
}

export function ListingViewCard({
  listing,
  index,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  canDelete,
}: ListingViewCardProps) {
  const isComplete = !!(
    listing.name.trim() &&
    listing.location.trim() &&
    listing.accommodationType &&
    listing.description.trim() &&
    listing.offerings.length > 0 &&
    listing.offerings.every((o) => o.availabilityMonths.length > 0)
  )

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
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
            {canDelete && (
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

      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Listing Name</label>
                    <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-900">
                      {listing.name || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Location</label>
                    <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-900">
                      {listing.location || '-'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">Accommodation Type</label>
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-900">
                    {listing.accommodationType || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">Description</label>
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-900 whitespace-pre-wrap min-h-[100px]">
                    {listing.description || '-'}
                  </div>
                </div>
                {/* Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Property Photos</label>
                  {listing.images && listing.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {listing.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={image}
                            alt={`Property ${imageIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-500">No photos uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Offerings Section — one row per configured offering */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 bg-primary-600 rounded-full"></div>
                <h5 className="text-lg font-semibold text-gray-900">Offerings</h5>
              </div>
              {listing.offerings.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-500">
                  No offerings configured.
                </div>
              ) : (
                <div className="space-y-3">
                  {listing.offerings.map((o, idx) => {
                    const Icon = TYPE_ICONS[o.type]
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2F54EB] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <h6 className="font-semibold text-gray-900 text-base">{o.type}</h6>
                              <span className="text-sm text-gray-700">{describeOffering(o)}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
                                <CalendarDaysIcon className="w-3.5 h-3.5" />
                                {formatMonths(o.availabilityMonths)}
                              </span>
                              {o.minFollowers ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
                                  <UserGroupIcon className="w-3.5 h-3.5" />
                                  Min {formatNumber(o.minFollowers)} followers
                                </span>
                              ) : null}
                              {o.platforms.map((p) => (
                                <span
                                  key={p}
                                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Looking For Section */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                <h5 className="text-lg font-semibold text-gray-900">Looking For</h5>
              </div>
              <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                {/* Platforms */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-1">Creator&apos;s platforms</label>
                  <p className="text-sm text-gray-600 mb-3">Which platforms should the creator have?</p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORM_OPTIONS.map((platform) => {
                      const isSelected = listing.lookingForPlatforms?.includes(platform) || false
                      return (
                        <div
                          key={platform}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isSelected
                            ? 'border-[#2F54EB] bg-blue-50 text-[#2F54EB]'
                            : 'border-gray-200 bg-white text-gray-700'
                            }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                              ? 'border-[#2F54EB] bg-[#2F54EB]'
                              : 'border-gray-300 bg-white'
                              }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className={isSelected ? 'text-[#2F54EB]' : 'text-gray-700'}>
                            {platform}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Top Countries */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-1">Top Countries (optional)</label>
                  <p className="text-sm text-gray-600 mb-3">Select up to 3 countries your target audience is from</p>
                  {listing.targetGroupCountries && listing.targetGroupCountries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {listing.targetGroupCountries.map((country, countryIndex) => (
                        <span key={countryIndex} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold px-4 py-2 border border-blue-200 shadow-sm">
                          {country}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base text-gray-900">
                      No countries selected
                    </div>
                  )}
                </div>

                {/* Age Groups */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-1">Age Groups (optional)</label>
                  <p className="text-sm text-gray-600 mb-3">Select up to 3 age groups you want to target</p>
                  <div className="flex flex-wrap gap-2">
                    {AGE_GROUP_OPTIONS.map((range) => {
                      const isSelected = listing.targetGroupAgeGroups?.includes(range) || false
                      return (
                        <div
                          key={range}
                          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${isSelected
                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                            : 'bg-white text-gray-400 border-gray-200'
                            }`}
                        >
                          {range}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
