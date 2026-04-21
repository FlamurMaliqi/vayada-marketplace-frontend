'use client'

import { useState, useEffect } from 'react'
import { Button, Textarea } from '@/components/ui'
import { getMonthAbbr } from '@/lib/utils'
import { CURRENCY_OPTIONS } from '@/lib/utils/getCurrencySymbol'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { usePlatformDeliverables } from '@/hooks/usePlatformDeliverables'
import { PlatformDeliverablesSelector } from './PlatformDeliverablesSelector'
import { DateMonthPicker } from './DateMonthPicker'
import type { PlatformDeliverable } from './types'


interface HotelListing {
  id: string
  name: string
  location: string
  availableMonths: string[]
  offerings: Array<{ type: string; availability: string[] }>
}

interface HotelInvitationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: HotelInvitationData) => void
  creatorName: string
  listings: HotelListing[]
  creatorPlatforms?: string[]
}

export interface HotelInvitationData {
  listingId: string
  collaborationType: 'Free Stay' | 'Paid' | 'Discount'
  freeStayMinNights?: number
  freeStayMaxNights?: number
  paidAmount?: number
  currency?: string
  discountPercentage?: number
  preferredDateFrom?: string
  preferredDateTo?: string
  preferredMonths: string[]
  platformDeliverables: PlatformDeliverable[]
  message?: string
}

export function HotelInvitationModal({
  isOpen,
  onClose,
  onSubmit,
  creatorName,
  listings,
  creatorPlatforms = [],
}: HotelInvitationModalProps) {
  const [listingId, setListingId] = useState('')
  const [collaborationType, setCollaborationType] = useState<'Free Stay' | 'Paid' | 'Discount' | ''>('')
  const [freeStayMinNights, setFreeStayMinNights] = useState<number | undefined>(undefined)
  const [freeStayMaxNights, setFreeStayMaxNights] = useState<number | undefined>(undefined)
  const [paidAmount, setPaidAmount] = useState<number | undefined>(undefined)
  const [currency, setCurrency] = useState<string>('USD')
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined)
  const [preferredDateFrom, setPreferredDateFrom] = useState('')
  const [preferredDateTo, setPreferredDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    platformDeliverables,
    customDeliverableInput,
    setCustomDeliverableInput,
    handlePlatformToggle,
    handleDeliverableQuantityChange,
    handleAddCustomDeliverable,
    handleRemoveCustomDeliverable,
    isPlatformSelected,
    getPlatformDeliverables,
    resetDeliverables,
  } = usePlatformDeliverables()

  // Clear preferred months that are no longer available when listing or type changes
  useEffect(() => {
    if (!listingId) {
      setPreferredMonths([])
      return
    }

    const selectedListing = listings.find(l => l.id === listingId)
    if (!selectedListing) return

    let currentAvailable: string[] = []
    if (collaborationType) {
      const offering = selectedListing.offerings.find(o => o.type === collaborationType)
      if (offering) {
        currentAvailable = offering.availability.map(getMonthAbbr)
      }
    } else {
      currentAvailable = selectedListing.availableMonths.map(getMonthAbbr)
    }

    if (currentAvailable.length > 0) {
      setPreferredMonths(prev => prev.filter(m => currentAvailable.includes(m)))
    }
  }, [listingId, collaborationType, listings])


  if (!isOpen) return null

  const handleMonthToggle = (month: string) => {
    setPreferredMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const isMonthAvailable = (month: string): boolean => {
    const selectedListing = listings.find(l => l.id === listingId)
    if (!selectedListing || selectedListing.availableMonths.length === 0) return true

    if (collaborationType) {
      const offering = selectedListing.offerings.find(o => o.type === collaborationType)
      if (offering) {
        return offering.availability.some(am => getMonthAbbr(am) === month)
      }
    }
    return selectedListing.availableMonths.some(am => getMonthAbbr(am) === month)
  }

  const filterPlatforms = (p: string): boolean => {
    if (p === 'Content Package') return true
    const platformMatch = (list: string[], key: string) =>
      list.some(item =>
        item.toLowerCase() === key.toLowerCase() ||
        (key === 'YouTube' && item.toUpperCase() === 'YT') ||
        (key === 'YouTube' && item.toLowerCase() === 'youtube')
      )
    return creatorPlatforms.length === 0 || platformMatch(creatorPlatforms, p)
  }

  const handleSubmit = () => {
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
        currency: collaborationType === 'Paid' ? currency : undefined,
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
      setCurrency('USD')
      setDiscountPercentage(undefined)
      setPreferredDateFrom('')
      setPreferredDateTo('')
      setPreferredMonths([])
      resetDeliverables()
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
    resetDeliverables()
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
              <div className="flex gap-3">
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {CURRENCY_OPTIONS.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Offered</label>
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
          <DateMonthPicker
            dateFrom={preferredDateFrom}
            dateTo={preferredDateTo}
            onDateFromChange={setPreferredDateFrom}
            onDateToChange={setPreferredDateTo}
            preferredMonths={preferredMonths}
            onMonthToggle={handleMonthToggle}
            isMonthAvailable={isMonthAvailable}
            dateLabel="Preferred Dates"
          />

          {/* Platforms & Deliverables */}
          <PlatformDeliverablesSelector
            platformDeliverables={platformDeliverables}
            customDeliverableInput={customDeliverableInput}
            onCustomDeliverableInputChange={setCustomDeliverableInput}
            onPlatformToggle={handlePlatformToggle}
            onDeliverableQuantityChange={handleDeliverableQuantityChange}
            onAddCustomDeliverable={handleAddCustomDeliverable}
            onRemoveCustomDeliverable={handleRemoveCustomDeliverable}
            isPlatformSelected={isPlatformSelected}
            getPlatformDeliverables={getPlatformDeliverables}
            filterPlatforms={filterPlatforms}
            label="Expected Platforms & Deliverables"
            customDescription="Add any other content you'd like to expect"
          />

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
