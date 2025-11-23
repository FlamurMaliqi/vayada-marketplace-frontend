'use client'

import { useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface HotelListing {
  id: string
  name: string
  location: string
}

interface HotelInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: HotelInvitationData) => void
  creatorName: string
  listings: HotelListing[]
}

export interface DeliverableItem {
  type: string
  quantity: number
}

export interface PlatformDeliverable {
  platform: string
  deliverables: DeliverableItem[]
}

export interface HotelInvitationData {
  listingId: string
  collaborationType: 'Free Stay' | 'Paid' | 'Discount'
  freeStayMinNights?: number
  freeStayMaxNights?: number
  paidAmount?: number
  discountPercentage?: number
  preferredDateFrom?: string
  preferredDateTo?: string
  preferredMonths: string[]
  platformDeliverables: PlatformDeliverable[]
  message?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook']

// Map platforms to their available deliverables
const PLATFORM_DELIVERABLES: Record<string, string[]> = {
  'Instagram': ['Instagram Post', 'Instagram Stories', 'Instagram Reel', 'Photo Pack (20+ images)'],
  'TikTok': ['TikTok Video', 'Photo Pack (20+ images)'],
  'YouTube': ['YouTube Video', 'Photo Pack (20+ images)'],
  'Facebook': ['Facebook Post', 'Photo Pack (20+ images)'],
}

export function HotelInvitationModal({
  isOpen,
  onClose,
  onSubmit,
  creatorName,
  listings,
}: HotelInvitationModalProps) {
  const [listingId, setListingId] = useState('')
  const [collaborationType, setCollaborationType] = useState<'Free Stay' | 'Paid' | 'Discount' | ''>('')
  const [freeStayMinNights, setFreeStayMinNights] = useState<number | undefined>(undefined)
  const [freeStayMaxNights, setFreeStayMaxNights] = useState<number | undefined>(undefined)
  const [paidAmount, setPaidAmount] = useState<number | undefined>(undefined)
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined)
  const [preferredDateFrom, setPreferredDateFrom] = useState('')
  const [preferredDateTo, setPreferredDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [platformDeliverables, setPlatformDeliverables] = useState<PlatformDeliverable[]>([])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleMonthToggle = (month: string) => {
    setPreferredMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setPlatformDeliverables((prev) => {
      const existing = prev.find((pd) => pd.platform === platform)
      if (existing) {
        // Remove platform and all its deliverables
        return prev.filter((pd) => pd.platform !== platform)
      } else {
        // Add platform with empty deliverables
        return [...prev, { platform, deliverables: [] }]
      }
    })
  }

  const handleDeliverableToggle = (platform: string, deliverableType: string) => {
    setPlatformDeliverables((prev) =>
      prev.map((pd) => {
        if (pd.platform !== platform) return pd
        const existing = pd.deliverables.find((d) => d.type === deliverableType)
        if (existing) {
          // Remove deliverable
          return {
            ...pd,
            deliverables: pd.deliverables.filter((d) => d.type !== deliverableType),
          }
        } else {
          // Add deliverable with default quantity of 1
          return {
            ...pd,
            deliverables: [...pd.deliverables, { type: deliverableType, quantity: 1 }],
          }
        }
      })
    )
  }

  const handleDeliverableQuantityChange = (platform: string, deliverableType: string, quantity: number) => {
    if (quantity < 1) return
    setPlatformDeliverables((prev) =>
      prev.map((pd) => {
        if (pd.platform !== platform) return pd
        return {
          ...pd,
          deliverables: pd.deliverables.map((d) =>
            d.type === deliverableType ? { ...d, quantity } : d
          ),
        }
      })
    )
  }

  const isPlatformSelected = (platform: string) => {
    return platformDeliverables.some((pd) => pd.platform === platform)
  }

  const getPlatformDeliverables = (platform: string) => {
    return platformDeliverables.find((pd) => pd.platform === platform)?.deliverables || []
  }

  const handleSubmit = () => {
    // Filter out platforms with no deliverables
    const validPlatformDeliverables = platformDeliverables.filter(
      (pd) => pd.deliverables.length > 0
    )

    if (!listingId || !collaborationType || validPlatformDeliverables.length === 0) {
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        listingId,
        collaborationType: collaborationType as 'Free Stay' | 'Paid' | 'Discount',
        freeStayMinNights,
        freeStayMaxNights,
        paidAmount,
        discountPercentage,
        preferredDateFrom: preferredDateFrom || undefined,
        preferredDateTo: preferredDateTo || undefined,
        preferredMonths,
        platformDeliverables: validPlatformDeliverables,
        message: message.trim() || undefined,
      })
      // Reset form
      setListingId('')
      setCollaborationType('')
      setFreeStayMinNights(undefined)
      setFreeStayMaxNights(undefined)
      setPaidAmount(undefined)
      setDiscountPercentage(undefined)
      setPreferredDateFrom('')
      setPreferredDateTo('')
      setPreferredMonths([])
      setPlatformDeliverables([])
      setMessage('')
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const handleCancel = () => {
    setListingId('')
    setCollaborationType('')
    setFreeStayMinNights(undefined)
    setFreeStayMaxNights(undefined)
    setPaidAmount(undefined)
    setDiscountPercentage(undefined)
      setPreferredDateFrom('')
      setPreferredDateTo('')
      setPreferredMonths([])
      setPlatformDeliverables([])
      setMessage('')
      onClose()
    }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-2xl font-bold text-gray-900">Invite {creatorName} to Collaborate</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Listing Selection */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Listing Selection <span className="text-red-500">*</span>
            </label>
            <select
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a listing</option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.name} - {listing.location}
                </option>
              ))}
            </select>
          </div>

          {/* Collaboration Type */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Collaboration Type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="collaborationType"
                  value="Free Stay"
                  checked={collaborationType === 'Free Stay'}
                  onChange={(e) => setCollaborationType(e.target.value as 'Free Stay')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">Free Stay</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="collaborationType"
                  value="Paid"
                  checked={collaborationType === 'Paid'}
                  onChange={(e) => setCollaborationType(e.target.value as 'Paid')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">Paid</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="collaborationType"
                  value="Discount"
                  checked={collaborationType === 'Discount'}
                  onChange={(e) => setCollaborationType(e.target.value as 'Discount')}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">Discount</span>
              </label>
            </div>
          </div>

          {/* Offer Details - Conditional */}
          {collaborationType === 'Free Stay' && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Free Stay Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Nights</label>
                  <input
                    type="number"
                    value={freeStayMinNights || ''}
                    onChange={(e) => setFreeStayMinNights(parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max. Nights</label>
                  <input
                    type="number"
                    value={freeStayMaxNights || ''}
                    onChange={(e) => setFreeStayMaxNights(parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="5"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          {collaborationType === 'Paid' && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Paid Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Offered ($)</label>
                <input
                  type="number"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(parseInt(e.target.value) || undefined)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="5000"
                  min="0"
                />
              </div>
            </div>
          )}

          {collaborationType === 'Discount' && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Discount Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={discountPercentage || ''}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || undefined)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="30"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          )}

          {/* Preferred Dates */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">Preferred Dates</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDateFrom}
                    onChange={(e) => setPreferredDateFrom(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDateTo}
                    onChange={(e) => setPreferredDateTo(e.target.value)}
                    min={preferredDateFrom}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Or select preferred months</p>
              <div className="grid grid-cols-4 gap-2">
                {MONTHS.map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthToggle(month)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      preferredMonths.includes(month)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms & Deliverables */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Expected Platforms & Deliverables <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {PLATFORM_OPTIONS.map((platform) => {
                const platformSelected = isPlatformSelected(platform)
                const platformDeliverablesList = getPlatformDeliverables(platform)
                const availableDeliverables = PLATFORM_DELIVERABLES[platform] || []

                return (
                  <div
                    key={platform}
                    className={`border-2 rounded-lg transition-all ${
                      platformSelected
                        ? 'border-primary-500 bg-primary-50/30'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Platform Header */}
                    <div className="p-4 border-b border-gray-200">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformSelected}
                          onChange={() => handlePlatformToggle(platform)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-3 text-lg font-semibold text-gray-900">{platform}</span>
                      </label>
                    </div>

                    {/* Deliverables for this platform */}
                    {platformSelected && (
                      <div className="p-4 space-y-3">
                        {availableDeliverables.map((deliverable) => {
                          const isSelected = platformDeliverablesList.some(
                            (d) => d.type === deliverable
                          )
                          const deliverableItem = platformDeliverablesList.find(
                            (d) => d.type === deliverable
                          )
                          const quantity = deliverableItem?.quantity || 1

                          return (
                            <div
                              key={deliverable}
                              className={`p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? 'border-primary-400 bg-primary-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleDeliverableToggle(platform, deliverable)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                  />
                                  <span className="ml-3 text-gray-700 font-medium text-sm">
                                    {deliverable}
                                  </span>
                                </label>
                                {isSelected && (
                                  <div className="flex items-center gap-2 ml-4">
                                    <label className="text-xs text-gray-600">Qty:</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={quantity}
                                      onChange={(e) =>
                                        handleDeliverableQuantityChange(
                                          platform,
                                          deliverable,
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-16 px-2 py-1 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {platformDeliverables.some((pd) => pd.deliverables.length > 0) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Deliverables:</p>
                <ul className="space-y-1">
                  {platformDeliverables
                    .filter((pd) => pd.deliverables.length > 0)
                    .map((pd) =>
                      pd.deliverables.map((deliverable) => (
                        <li key={`${pd.platform}-${deliverable.type}`} className="text-sm text-gray-600">
                          <span className="font-medium">{pd.platform}:</span> {deliverable.quantity}x{' '}
                          {deliverable.type}
                        </li>
                      ))
                    )}
                </ul>
              </div>
            )}
          </div>

          {/* Message/Notes */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Message/Notes (optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Add any additional details or special requirements..."
              className="resize-y text-gray-900 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={
                !listingId ||
                !collaborationType ||
                platformDeliverables.filter((pd) => pd.deliverables.length > 0).length === 0
              }
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

