'use client'

import { AGE_GROUP_OPTIONS } from '@/lib/constants'

interface AgeGroupSelectorProps {
  selectedGroups: string[]
  onChange: (groups: string[]) => void
  maxSelections?: number
  label?: string
  description?: string
}

export function AgeGroupSelector({ selectedGroups, onChange, maxSelections = 3, label, description }: AgeGroupSelectorProps) {
  return (
    <div>
      {label && <label className="block text-base font-semibold text-gray-900 mb-1">{label}</label>}
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {AGE_GROUP_OPTIONS.map((range) => {
          const isSelected = selectedGroups.includes(range)
          return (
            <button
              key={range}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(selectedGroups.filter((g) => g !== range))
                } else {
                  if (selectedGroups.length < maxSelections) {
                    onChange([...selectedGroups, range])
                  }
                }
              }}
              disabled={!isSelected && selectedGroups.length >= maxSelections}
              className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${isSelected
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
              {range}
            </button>
          )
        })}
      </div>
    </div>
  )
}
