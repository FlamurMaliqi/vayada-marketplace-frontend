'use client'

import { useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { MONTHS_ABBR } from '@/lib/constants'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { getMonthAbbr } from '@/lib/utils'
import { usePlatformDeliverables } from '@/hooks/usePlatformDeliverables'
import { PlatformDeliverablesSelector } from './PlatformDeliverablesSelector'
import { DateMonthPicker } from './DateMonthPicker'
import type { PlatformDeliverable } from './types'

interface CollaborationApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CollaborationApplicationData) => void
  hotelName?: string
  availableMonths?: string[]
  requiredPlatforms?: string[]
  creatorPlatforms?: string[]
  maxNights?: number
  minNights?: number
}

export interface CollaborationApplicationData {
  whyGreatFit: string
  travelDateFrom?: string
  travelDateTo?: string
  preferredMonths: string[]
  platformDeliverables: PlatformDeliverable[]
  consent: boolean
}


const getMonthsInRange = (fromStr: string, toStr: string): string[] => {
  const from = new Date(fromStr)
  const to = new Date(toStr)
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return []

  const months = []
  const current = new Date(from.getFullYear(), from.getMonth(), 1)

  // Use a limit to prevent infinite loops if dates are somehow broken
  let safetyCounter = 0
  while (current <= to && safetyCounter < 24) {
    months.push(MONTHS_ABBR[current.getMonth()])
    current.setMonth(current.getMonth() + 1)
    safetyCounter++
  }
  return Array.from(new Set(months))
}

export function CollaborationApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  hotelName,
  availableMonths = [],
  requiredPlatforms = [],
  creatorPlatforms = [],
  maxNights,
  minNights,
}: CollaborationApplicationModalProps) {
  const [whyGreatFit, setWhyGreatFit] = useState('')
  const [travelDateFrom, setTravelDateFrom] = useState('')
  const [travelDateTo, setTravelDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [consent, setConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  if (!isOpen) return null

  const normalizedAvailable = availableMonths.map(m => getMonthAbbr(m))

  const handleMonthToggle = (month: string) => {
    setErrorMessage(null)
    setPreferredMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const isMonthAvailable = (month: string): boolean => {
    return availableMonths.length === 0 || normalizedAvailable.includes(month)
  }

  const filterPlatforms = (p: string): boolean => {
    if (p === 'Content Package') return true
    const platformMatch = (list: string[], key: string) =>
      list.includes(key) ||
      list.some(item => item.toLowerCase() === key.toLowerCase()) ||
      (key === 'YouTube' && list.includes('YT'))
    const isHotelDesired = platformMatch(requiredPlatforms, p)
    const isCreatorActive = creatorPlatforms.length === 0 || platformMatch(creatorPlatforms, p)
    return isHotelDesired && isCreatorActive
  }

  const handleSubmit = () => {
    setErrorMessage(null)

    const validPlatformDeliverables = platformDeliverables.filter(
      (pd) => pd.deliverables.length > 0
    )

    if (!whyGreatFit.trim() || validPlatformDeliverables.length === 0 || !consent) {
      return
    }

    // Nights Validation — creator cannot request more nights than hotel offers
    if (travelDateFrom && travelDateTo) {
      const from = new Date(travelDateFrom)
      const to = new Date(travelDateTo)
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        const nights = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
        if (maxNights && nights > maxNights) {
          setErrorMessage(
            `This hotel offers a maximum of ${maxNights} night${maxNights === 1 ? '' : 's'}. Please shorten your stay.`
          )
          return
        }
        if (minNights && nights > 0 && nights < minNights) {
          setErrorMessage(
            `This hotel requires a minimum of ${minNights} night${minNights === 1 ? '' : 's'}. Please extend your stay.`
          )
          return
        }
      }
    }

    // Availability Validation
    if (availableMonths.length > 0 && availableMonths.length < 12) {
      let requestedMonths: string[] = []

      if (travelDateFrom && travelDateTo) {
        requestedMonths = getMonthsInRange(travelDateFrom, travelDateTo)
      } else if (preferredMonths.length > 0) {
        requestedMonths = preferredMonths
      }

      if (requestedMonths.length > 0) {
        const invalidMonths = requestedMonths.filter(m => !normalizedAvailable.includes(m))
        if (invalidMonths.length > 0) {
          setErrorMessage(
            `The hotel is not available in: ${invalidMonths.join(', ')}. Please select dates within their availability.`
          )
          return
        }
      }
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        whyGreatFit,
        travelDateFrom: travelDateFrom || undefined,
        travelDateTo: travelDateTo || undefined,
        preferredMonths,
        platformDeliverables: validPlatformDeliverables,
        consent,
      })
      // Reset form
      setWhyGreatFit('')
      setTravelDateFrom('')
      setTravelDateTo('')
      setPreferredMonths([])
      resetDeliverables()
      setConsent(true)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const handleCancel = () => {
    setWhyGreatFit('')
    setTravelDateFrom('')
    setTravelDateTo('')
    setPreferredMonths([])
    resetDeliverables()
    setConsent(true)
    onClose()
  }

  const characterCount = whyGreatFit.length
  const maxCharacters = 500

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
          <h3 className="text-2xl font-bold text-gray-900">Apply for Collaboration</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Why are you a great fit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-medium text-gray-900">
                Why are you a great fit for this collaboration? <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                ({characterCount}/{maxCharacters})
              </span>
            </div>
            <Textarea
              value={whyGreatFit}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= maxCharacters) {
                  setWhyGreatFit(value)
                }
              }}
              rows={6}
              placeholder="Share your content style, audience demographics, and why you're excited about this hotel..."
              className="resize-y"
            />
          </div>

          {/* Stay length hint */}
          {(maxNights || minNights) && (
            <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-900">
              Stay length offered:{' '}
              {minNights && maxNights && minNights !== maxNights
                ? `${minNights}–${maxNights} nights`
                : `up to ${maxNights || minNights} night${(maxNights || minNights) === 1 ? '' : 's'}`}
            </div>
          )}

          {/* Preferred Travel Dates */}
          <DateMonthPicker
            dateFrom={travelDateFrom}
            dateTo={travelDateTo}
            onDateFromChange={(value) => {
              setErrorMessage(null)
              setTravelDateFrom(value)
            }}
            onDateToChange={(value) => {
              setErrorMessage(null)
              setTravelDateTo(value)
            }}
            preferredMonths={preferredMonths}
            onMonthToggle={handleMonthToggle}
            isMonthAvailable={isMonthAvailable}
            dateLabel="Preferred Travel Dates"
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
            label="Platforms & Expected Deliverables"
            customDescription="Add any other content you'd like to offer"
          />

          {/* Consent Checkbox */}
          <div
            className="p-5 flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50/30 cursor-pointer transition-all hover:bg-gray-50/50"
            onClick={() => setConsent(!consent)}
          >
            <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${consent
              ? 'bg-primary-600 border-primary-600'
              : 'border-primary-400 bg-white'
              }`}>
              {consent && <CheckIcon className="w-4 h-4 text-white stroke-[3px]" />}
            </div>
            <span className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
              I consent to sharing my contact information with the hotel if my application is accepted
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
            </div>
          )}

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
                !whyGreatFit.trim() ||
                platformDeliverables.filter((pd) => pd.deliverables.length > 0).length === 0 ||
                !consent
              }
            >
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
