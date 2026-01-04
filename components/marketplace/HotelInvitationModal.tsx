'use client'

import { useState, useEffect } from 'react'
import { Button, Textarea } from '@/components/ui'
import { XMarkIcon, CalendarIcon, PlusSmallIcon, MinusSmallIcon, CheckIcon, PhotoIcon } from '@heroicons/react/24/outline'

const getPlatformIcon = (platform: string, className: string = "w-5 h-5") => {
  const platformLower = platform.toLowerCase()
  if (platformLower.includes('instagram')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
  if (platformLower.includes('tiktok')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    )
  }
  if (platformLower.includes('youtube') || platformLower.includes('yt')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
  if (platformLower.includes('facebook')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
  if (platformLower.includes('content package')) {
    return <PhotoIcon className={className} />
  }
  return null
}


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
const PLATFORM_OPTIONS = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Content Package']

// Map platforms to their available deliverables
const PLATFORM_DELIVERABLES: Record<string, string[]> = {
  'Instagram': ['Instagram Post', 'Instagram Stories', 'Instagram Reel'],
  'Facebook': ['Facebook Post', 'Facebook Stories', 'Facebook Reel'],
  'TikTok': ['TikTok Video'],
  'YouTube': ['YouTube Video', 'YouTube Shorts'],
  'Content Package': ['Photos', 'Videos'],
}
// Helper for month abbreviations
const getMonthAbbr = (month: string): string => {
  const monthMap: { [key: string]: string } = {
    'Januar': 'Jan',
    'Februar': 'Feb',
    'März': 'Mar',
    'April': 'Apr',
    'Mai': 'May',
    'Juni': 'Jun',
    'Juli': 'Jul',
    'August': 'Aug',
    'September': 'Sep',
    'Oktober': 'Oct',
    'November': 'Nov',
    'Dezember': 'Dec',
  }
  return monthMap[month] || month.substring(0, 3)
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
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined)
  const [preferredDateFrom, setPreferredDateFrom] = useState('')
  const [preferredDateTo, setPreferredDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [platformDeliverables, setPlatformDeliverables] = useState<PlatformDeliverable[]>([])
  const [customDeliverableInput, setCustomDeliverableInput] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setCustomDeliverableInput('')
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
    setCustomDeliverableInput('')
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
                {MONTHS.map((month) => {
                  const selectedListing = listings.find(l => l.id === listingId);

                  // Filter by specific collaboration type if selected, otherwise show combined availability
                  let isAvailable = !selectedListing || selectedListing.availableMonths.length === 0;

                  if (selectedListing) {
                    if (collaborationType) {
                      const offering = selectedListing.offerings.find(o => o.type === collaborationType);
                      if (offering) {
                        isAvailable = offering.availability.some(am => getMonthAbbr(am) === month);
                      }
                    } else {
                      isAvailable = selectedListing.availableMonths.some(am => getMonthAbbr(am) === month);
                    }
                  }

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => isAvailable && handleMonthToggle(month)}
                      disabled={!isAvailable}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${preferredMonths.includes(month)
                        ? 'bg-primary-600 text-white shadow-md'
                        : isAvailable
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
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
              Expected Platforms & Deliverables <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {PLATFORM_OPTIONS.filter(p => {
                // Content Package is always shown
                if (p === 'Content Package') return true

                // Compare platform with creator's platforms
                const platformMatch = (list: string[], key: string) =>
                  list.some(item =>
                    item.toLowerCase() === key.toLowerCase() ||
                    (key === 'YouTube' && item.toUpperCase() === 'YT') ||
                    (key === 'YouTube' && item.toLowerCase() === 'youtube')
                  );

                return creatorPlatforms.length === 0 || platformMatch(creatorPlatforms, p);
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
                <p className="text-sm text-gray-500">Add any other content you'd like to expect</p>
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

