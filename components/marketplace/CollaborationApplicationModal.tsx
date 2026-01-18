'use client'

import { useState } from 'react'
import { Button, Textarea, getPlatformIcon } from '@/components/ui'
import { MONTHS_ABBR, PLATFORM_OPTIONS_WITH_CONTENT, PLATFORM_DELIVERABLES } from '@/lib/constants'
import { XMarkIcon, CalendarIcon, PlusSmallIcon, MinusSmallIcon, CheckIcon } from '@heroicons/react/24/outline'
import { getMonthAbbr } from '@/lib/utils'

interface CollaborationApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CollaborationApplicationData) => void
  hotelName?: string
  availableMonths?: string[]
  requiredPlatforms?: string[]
  creatorPlatforms?: string[]
}

export interface DeliverableItem {
  type: string
  quantity: number
}

export interface PlatformDeliverable {
  platform: string
  deliverables: DeliverableItem[]
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
}: CollaborationApplicationModalProps) {
  const [whyGreatFit, setWhyGreatFit] = useState('')
  const [travelDateFrom, setTravelDateFrom] = useState('')
  const [travelDateTo, setTravelDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [platformDeliverables, setPlatformDeliverables] = useState<PlatformDeliverable[]>([])
  const [customDeliverableInput, setCustomDeliverableInput] = useState('')
  const [consent, setConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const normalizedAvailable = availableMonths.map(m => getMonthAbbr(m))

  const handleMonthToggle = (month: string) => {
    setErrorMessage(null)
    setPreferredMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) => {
      const existing = prev.find((pd: PlatformDeliverable) => pd.platform === platform)
      if (existing) {
        // Remove platform and all its deliverables
        return prev.filter((pd: PlatformDeliverable) => pd.platform !== platform)
      } else {
        // Add platform with empty deliverables
        return [...prev, { platform, deliverables: [] }]
      }
    })
  }

  const handleDeliverableToggle = (platform: string, deliverableType: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev.map((pd: PlatformDeliverable) => {
        if (pd.platform !== platform) return pd
        const existing = pd.deliverables.find((d: DeliverableItem) => d.type === deliverableType)
        if (existing) {
          // Remove deliverable
          return {
            ...pd,
            deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== deliverableType),
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
    if (quantity < 0) return
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev.map((pd: PlatformDeliverable) => {
        if (pd.platform !== platform) return pd
        const existing = pd.deliverables.find((d: DeliverableItem) => d.type === deliverableType)

        if (quantity === 0) {
          return {
            ...pd,
            deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== deliverableType),
          }
        }

        if (existing) {
          return {
            ...pd,
            deliverables: pd.deliverables.map((d: DeliverableItem) =>
              d.type === deliverableType ? { ...d, quantity } : d
            ),
          }
        } else {
          return {
            ...pd,
            deliverables: [...pd.deliverables, { type: deliverableType, quantity }],
          }
        }
      })
    )
  }

  const handleAddCustomDeliverable = () => {
    const trimmed = customDeliverableInput.trim()
    if (!trimmed) return

    setPlatformDeliverables((prev: PlatformDeliverable[]) => {
      const existingPlatform = prev.find((pd: PlatformDeliverable) => pd.platform === 'Custom')
      if (existingPlatform) {
        if (existingPlatform.deliverables.some((d: DeliverableItem) => d.type === trimmed)) {
          return prev
        }
        return prev.map((pd: PlatformDeliverable) =>
          pd.platform === 'Custom'
            ? { ...pd, deliverables: [...pd.deliverables, { type: trimmed, quantity: 1 }] }
            : pd
        )
      }
      return [...prev, { platform: 'Custom', deliverables: [{ type: trimmed, quantity: 1 }] }]
    })
    setCustomDeliverableInput('')
  }

  const handleRemoveCustomDeliverable = (type: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev
        .map((pd: PlatformDeliverable) =>
          pd.platform === 'Custom'
            ? { ...pd, deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== type) }
            : pd
        )
        .filter((pd: PlatformDeliverable) => pd.platform !== 'Custom' || pd.deliverables.length > 0)
    )
  }

  const isPlatformSelected = (platform: string) => {
    return platformDeliverables.some((pd) => pd.platform === platform)
  }

  const getPlatformDeliverables = (platform: string) => {
    return platformDeliverables.find((pd) => pd.platform === platform)?.deliverables || []
  }

  const handleSubmit = () => {
    setErrorMessage(null)

    // Filter out platforms with no deliverables
    const validPlatformDeliverables = platformDeliverables.filter(
      (pd) => pd.deliverables.length > 0
    )

    if (!whyGreatFit.trim() || validPlatformDeliverables.length === 0 || !consent) {
      return
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
      setPlatformDeliverables([])
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
    setPlatformDeliverables([])
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

          {/* Preferred Travel Dates */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Preferred Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={travelDateFrom}
                    onChange={(e) => {
                      setErrorMessage(null)
                      setTravelDateFrom(e.target.value)
                    }}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={travelDateTo}
                    onChange={(e) => {
                      setErrorMessage(null)
                      setTravelDateTo(e.target.value)
                    }}
                    min={travelDateFrom}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Or select preferred months</p>
              <div className="grid grid-cols-4 gap-2">
                {MONTHS_ABBR.map((month) => {
                  const isAvailable =
                    availableMonths.length === 0 ||
                    normalizedAvailable.includes(month);

                  return (
                    <button
                      key={month}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleMonthToggle(month)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${preferredMonths.includes(month)
                        ? 'bg-primary-600 text-white shadow-md'
                        : isAvailable
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-30 grayscale'
                        }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platforms & Deliverables */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-4">
              Platforms & Expected Deliverables <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {PLATFORM_OPTIONS_WITH_CONTENT.filter(p => {
                // Content Package and Custom are always shown
                if (p === 'Content Package') return true

                // Compare platform with normalized lists
                const platformMatch = (list: string[], key: string) =>
                  list.includes(key) ||
                  list.some(item => item.toLowerCase() === key.toLowerCase()) ||
                  (key === 'YouTube' && list.includes('YT'));

                const isHotelDesired = platformMatch(requiredPlatforms, p);
                const isCreatorActive = creatorPlatforms.length === 0 || platformMatch(creatorPlatforms, p);

                return isHotelDesired && isCreatorActive;
              }).map((platform) => {
                const platformSelected = isPlatformSelected(platform)
                const platformDeliverablesList = getPlatformDeliverables(platform)
                const availableDeliverables = PLATFORM_DELIVERABLES[platform] || []

                return (
                  <div
                    key={platform}
                    className={`rounded-2xl transition-all duration-200 border ${platformSelected
                      ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                      : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50/50'
                      }`}
                  >
                    {/* Platform Header */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => handlePlatformToggle(platform)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${platformSelected
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-primary-400 bg-white'
                          }`}>
                          {platformSelected && <CheckIcon className="w-4 h-4 text-white stroke-[3px]" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-gray-900">
                            {getPlatformIcon(platform, "w-6 h-6")}
                          </div>
                          <span className="text-lg font-semibold text-gray-900">{platform}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables for this platform */}
                    {platformSelected && (
                      <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {availableDeliverables.map((deliverable) => {
                          const deliverableItem = platformDeliverablesList.find(
                            (d) => d.type === deliverable
                          )
                          const quantity = deliverableItem?.quantity || 0

                          return (
                            <div
                              key={deliverable}
                              className="bg-white px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-primary-200 transition-colors shadow-sm"
                            >
                              <span className="text-gray-700 font-medium">{deliverable}</span>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeliverableQuantityChange(platform, deliverable, quantity - 1)
                                  }}
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${quantity > 0
                                    ? 'border-primary-200 text-primary-600 hover:bg-primary-50'
                                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                    }`}
                                  disabled={quantity === 0}
                                >
                                  <MinusSmallIcon className="w-5 h-5" />
                                </button>
                                <span className={`w-4 text-center text-base font-bold tabular-nums ${quantity > 0 ? 'text-gray-900' : 'text-gray-400'
                                  }`}>
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeliverableQuantityChange(platform, deliverable, quantity + 1)
                                  }}
                                  className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all shadow-sm"
                                >
                                  <PlusSmallIcon className="w-5 h-5" />
                                </button>
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

            {/* Custom Deliverables Section */}
            <div className="mt-6 p-6 border border-gray-300 bg-gray-50/30 rounded-2xl">
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900">Custom Deliverables</h4>
                <p className="text-sm text-gray-500">Add any other content you&apos;d like to offer</p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customDeliverableInput}
                  onChange={(e) => setCustomDeliverableInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomDeliverable())}
                  placeholder="e.g., Blog Post, Drone Footage..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDeliverable}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm"
                >
                  <PlusSmallIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Custom Deliverables List */}
              <div className="space-y-2">
                {getPlatformDeliverables('Custom').map((item) => (
                  <div
                    key={item.type}
                    className="bg-white px-4 py-3 rounded-xl border border-gray-300 flex items-center justify-between shadow-sm animate-in slide-in-from-top-1 duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomDeliverable(item.type)}
                        className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <span className="text-gray-700 font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleDeliverableQuantityChange('Custom', item.type, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <MinusSmallIcon className="w-5 h-5" />
                      </button>
                      <span className="w-4 text-center text-base font-bold text-gray-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeliverableQuantityChange('Custom', item.type, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all shadow-sm"
                      >
                        <PlusSmallIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {platformDeliverables.some((pd) => pd.deliverables.length > 0) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Deliverables:</p>
              <ul className="space-y-1">
                {platformDeliverables
                  .filter((pd: PlatformDeliverable) => pd.deliverables.length > 0)
                  .map((pd: PlatformDeliverable) =>
                    pd.deliverables.map((deliverable: DeliverableItem) => (
                      <li key={`${pd.platform}-${deliverable.type}`} className="text-sm text-gray-600">
                        <span className="font-medium">{pd.platform}:</span> {deliverable.quantity}x{' '}
                        {deliverable.type}
                      </li>
                    ))
                  )}
              </ul>
            </div>
          )}
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

