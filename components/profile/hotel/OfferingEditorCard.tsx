'use client'

import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  GiftIcon,
  LinkIcon,
  TagIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Input } from '@/components/ui'
import { CURRENCY_OPTIONS } from '@/lib/utils/getCurrencySymbol'
import type { CollaborationKind, ListingOffering } from '../types'
import { AvailabilityMonthSelector } from './AvailabilityMonthSelector'
import { PlatformSelector } from './PlatformSelector'

interface OfferingEditorCardProps {
  offering: ListingOffering
  index: number
  canRemove: boolean
  onChange: (offering: ListingOffering) => void
  onRemove: () => void
}

const OFFERING_TYPES: Array<{ type: CollaborationKind; icon: typeof GiftIcon; label: string }> = [
  { type: 'Free Stay', icon: GiftIcon, label: 'Free Stay' },
  { type: 'Paid', icon: CurrencyDollarIcon, label: 'Paid' },
  { type: 'Discount', icon: TagIcon, label: 'Discount' },
  { type: 'Affiliate', icon: LinkIcon, label: 'Affiliate' },
]

export function OfferingEditorCard({
  offering,
  index,
  canRemove,
  onChange,
  onRemove,
}: OfferingEditorCardProps) {
  const update = <K extends keyof ListingOffering>(field: K, value: ListingOffering[K]) => {
    onChange({ ...offering, [field]: value })
  }

  // When the type changes we wipe inapplicable type-specific fields so the
  // backend validator doesn't reject the request.
  const setType = (next: CollaborationKind) => {
    onChange({
      ...offering,
      type: next,
      freeStayMinNights: next === 'Free Stay' ? offering.freeStayMinNights : undefined,
      freeStayMaxNights: next === 'Free Stay' ? offering.freeStayMaxNights : undefined,
      paidMaxAmount: next === 'Paid' ? offering.paidMaxAmount : undefined,
      currency: next === 'Paid' ? offering.currency || 'USD' : undefined,
      discountPercentage: next === 'Discount' ? offering.discountPercentage : undefined,
      commissionPercentage: next === 'Affiliate' ? offering.commissionPercentage : undefined,
    })
  }

  const parseOptionalInt = (raw: string): number | undefined => {
    if (raw === '') return undefined
    const n = parseInt(raw, 10)
    return Number.isNaN(n) ? undefined : n
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h6 className="text-base font-semibold text-gray-900">Offering {index + 1}</h6>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Remove offering"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type picker (single value per offering) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Collaboration Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {OFFERING_TYPES.map(({ type, icon: Icon, label }) => {
            const selected = offering.type === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setType(type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${selected
                  ? 'border-[#2F54EB] bg-blue-50 text-[#2F54EB]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Type-specific inputs */}
      {offering.type === 'Free Stay' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Min. Nights"
            type="number"
            min={1}
            value={offering.freeStayMinNights ?? ''}
            onChange={(e) => update('freeStayMinNights', parseOptionalInt(e.target.value))}
            required
            placeholder="1"
            className="bg-gray-50 border-gray-200"
          />
          <Input
            label="Max. Nights"
            type="number"
            min={1}
            value={offering.freeStayMaxNights ?? ''}
            onChange={(e) => update('freeStayMaxNights', parseOptionalInt(e.target.value))}
            required
            placeholder="5"
            className="bg-gray-50 border-gray-200"
          />
        </div>
      )}

      {offering.type === 'Paid' && (
        <div className="flex gap-2">
          <div className="w-32">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Currency</label>
            <select
              value={offering.currency || 'USD'}
              onChange={(e) => update('currency', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Input
              label="Max. Amount"
              type="number"
              min={1}
              value={offering.paidMaxAmount ?? ''}
              onChange={(e) => update('paidMaxAmount', parseOptionalInt(e.target.value))}
              required
              placeholder="5000"
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      )}

      {offering.type === 'Discount' && (
        <Input
          label="Discount Percentage (%)"
          type="number"
          min={1}
          max={100}
          value={offering.discountPercentage ?? ''}
          onChange={(e) => update('discountPercentage', parseOptionalInt(e.target.value))}
          required
          placeholder="20"
          className="bg-gray-50 border-gray-200"
        />
      )}

      {offering.type === 'Affiliate' && (
        <Input
          label="Commission Percentage (%)"
          type="number"
          min={1}
          max={100}
          value={offering.commissionPercentage ?? ''}
          onChange={(e) => update('commissionPercentage', parseOptionalInt(e.target.value))}
          required
          placeholder="10"
          className="bg-gray-50 border-gray-200"
        />
      )}

      {/* Availability months (per offering) */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
          <label className="block text-sm font-semibold text-gray-900">
            Availability <span className="text-red-500">*</span>
          </label>
        </div>
        <AvailabilityMonthSelector
          selectedMonths={offering.availabilityMonths}
          onChange={(months) => update('availabilityMonths', months)}
        />
      </div>

      {/* Platforms (per offering) */}
      <PlatformSelector
        selectedPlatforms={offering.platforms}
        onChange={(platforms) => update('platforms', platforms)}
        label="Posting platforms"
        description="On which platforms must the creator post for this offering?"
      />

      {/* Per-offering follower threshold */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <UserGroupIcon className="w-4 h-4 text-primary-600" />
          <label className="block text-sm font-semibold text-gray-900">
            Min. Followers (optional)
          </label>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Overrides the listing-level minimum for this offering only — e.g. require 100k+ for a Free Stay but 10k for a Discount.
        </p>
        <Input
          type="number"
          min={1}
          value={offering.minFollowers ?? ''}
          onChange={(e) => update('minFollowers', parseOptionalInt(e.target.value))}
          placeholder="e.g., 100000"
          className="bg-gray-50 border-gray-200"
        />
      </div>
    </div>
  )
}
