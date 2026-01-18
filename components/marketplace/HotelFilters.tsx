'use client'

import { useState, useEffect } from 'react'
import {
  FilterChip,
  MultiSelectDropdown,
  RangeSliderDropdown,
  MonthSelectorDropdown,
} from '@/components/common'
import {
  HOTEL_TYPES,
  OFFERING_OPTIONS,
  MONTHS_FULL,
  MONTHS_ABBR,
  BUDGET_RANGE,
} from '@/lib/constants'
import { formatBudget } from '@/lib/utils'

export interface HotelFiltersState {
  hotelType?: string | string[]
  offering?: string | string[]
  availability?: string | string[]
  budget?: number
}

interface HotelFiltersProps {
  filters: HotelFiltersState
  onFiltersChange: (filters: HotelFiltersState) => void
  onClearAll?: () => void
  showClearAll?: boolean
}

export function HotelFilters({
  filters,
  onFiltersChange,
  onClearAll,
  showClearAll = true,
}: HotelFiltersProps) {
  const [budgetValue, setBudgetValue] = useState(filters.budget ?? BUDGET_RANGE.min)

  useEffect(() => {
    if (filters.budget !== undefined) setBudgetValue(filters.budget)
  }, [filters.budget])

  // Helper to normalize string | string[] to string[]
  const toArray = (value: string | string[] | undefined): string[] => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const selectedHotelTypes = toArray(filters.hotelType)
  const selectedOfferings = toArray(filters.offering)
  const selectedAvailability = toArray(filters.availability)

  const createToggleHandler = (key: 'hotelType' | 'offering' | 'availability') => (value: string) => {
    const current = toArray(filters[key])
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    const newFilters = { ...filters }
    if (updated.length === 0) {
      delete newFilters[key]
    } else {
      newFilters[key] = updated
    }
    onFiltersChange(newFilters)
  }

  const handleBudgetChange = (value: number) => {
    setBudgetValue(value)
    const newFilters = { ...filters }
    if (value === BUDGET_RANGE.min) {
      delete newFilters.budget
    } else {
      newFilters.budget = value
    }
    onFiltersChange(newFilters)
  }

  const handleClearAll = () => {
    onFiltersChange({})
    setBudgetValue(BUDGET_RANGE.min)
    onClearAll?.()
  }

  const hasFilters =
    selectedHotelTypes.length > 0 ||
    selectedOfferings.length > 0 ||
    selectedAvailability.length > 0 ||
    (filters.budget !== undefined && filters.budget > BUDGET_RANGE.min)

  const getMonthAbbr = (month: string) => {
    const index = MONTHS_FULL.indexOf(month as typeof MONTHS_FULL[number])
    return index >= 0 ? MONTHS_ABBR[index] : month.substring(0, 3)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <MultiSelectDropdown
          label="Hotel Type"
          title="Select Hotel Types"
          options={HOTEL_TYPES}
          selected={selectedHotelTypes}
          onToggle={createToggleHandler('hotelType')}
        />

        <MultiSelectDropdown
          label="Offering"
          title="Select Offerings"
          options={OFFERING_OPTIONS}
          selected={selectedOfferings}
          onToggle={createToggleHandler('offering')}
        />

        <MonthSelectorDropdown
          label="Availability"
          selected={selectedAvailability}
          onToggle={createToggleHandler('availability')}
        />

        <RangeSliderDropdown
          label="Budget"
          title="Budget Range"
          min={BUDGET_RANGE.min}
          max={BUDGET_RANGE.max}
          step={BUDGET_RANGE.step}
          value={budgetValue}
          defaultValue={BUDGET_RANGE.min}
          onChange={handleBudgetChange}
          formatValue={formatBudget}
          formatMin="€500"
          formatMax="€10,000"
        />

        {showClearAll && hasFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedHotelTypes.map((type) => (
            <FilterChip key={type} label={type} onRemove={() => createToggleHandler('hotelType')(type)} />
          ))}
          {selectedOfferings.map((offering) => (
            <FilterChip key={offering} label={offering} onRemove={() => createToggleHandler('offering')(offering)} />
          ))}
          {selectedAvailability.map((month) => (
            <FilterChip key={month} label={getMonthAbbr(month)} onRemove={() => createToggleHandler('availability')(month)} />
          ))}
          {filters.budget !== undefined && filters.budget > BUDGET_RANGE.min && (
            <FilterChip label={formatBudget(filters.budget)} onRemove={() => handleBudgetChange(BUDGET_RANGE.min)} />
          )}
        </div>
      )}
    </>
  )
}
