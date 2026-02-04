'use client'

import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import type { CreatorType } from '@/lib/types'

interface CreatorTypeStepProps {
  selectedType: CreatorType | undefined
  onSelect: (type: CreatorType) => void
}

const CREATOR_TYPES = [
  {
    type: 'Lifestyle' as CreatorType,
    icon: SparklesIcon,
    label: 'Lifestyle Creator',
  },
  {
    type: 'Travel' as CreatorType,
    icon: PaperAirplaneIcon,
    label: 'Travel Creator',
  },
]

export function CreatorTypeStep({ selectedType, onSelect }: CreatorTypeStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Creator Category</h3>
          <p className="text-xs text-gray-500">Select the type that best describes your content</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CREATOR_TYPES.map(({ type, icon: Icon, label }) => {
          const isSelected = selectedType === type

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={`flex flex-col items-center justify-center gap-3 px-4 py-8 rounded-xl border transition-all ${
                isSelected
                  ? 'border-[#2F54EB] bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-[#2F54EB]' : 'text-gray-500'}`} />
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      <p className="text-center text-sm text-gray-500">
        This helps hotels find creators that match their collaboration needs
      </p>
    </div>
  )
}
