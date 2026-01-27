'use client'

import { GiftIcon, CurrencyDollarIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { COLLABORATION_TYPES } from '@/lib/constants'

interface CollaborationTypeSelectorProps {
  selectedTypes: string[]
  onChange: (types: string[]) => void
}

const ICONS = {
  'Free Stay': GiftIcon,
  'Paid': CurrencyDollarIcon,
  'Discount': TagIcon,
} as const

export function CollaborationTypeSelector({ selectedTypes, onChange }: CollaborationTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {COLLABORATION_TYPES.map((type) => {
        const isSelected = selectedTypes.includes(type)
        const Icon = ICONS[type as keyof typeof ICONS]

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
                  onChange([...selectedTypes, type])
                } else {
                  onChange(selectedTypes.filter((t) => t !== type))
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
  )
}
