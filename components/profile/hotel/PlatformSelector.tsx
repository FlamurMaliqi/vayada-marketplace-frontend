'use client'

import { PLATFORM_OPTIONS } from '@/lib/constants'

interface PlatformSelectorProps {
  selectedPlatforms: string[]
  onChange: (platforms: string[]) => void
  label?: string
  description?: string
}

export function PlatformSelector({ selectedPlatforms, onChange, label, description }: PlatformSelectorProps) {
  return (
    <div>
      {label && <label className="block text-base font-semibold text-gray-900 mb-1">{label}</label>}
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {PLATFORM_OPTIONS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform)
          return (
            <label
              key={platform}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${isSelected
                ? 'border-[#2F54EB] bg-blue-50 text-[#2F54EB]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedPlatforms, platform])
                  } else {
                    onChange(selectedPlatforms.filter((p) => p !== platform))
                  }
                }}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                  ? 'border-[#2F54EB] bg-[#2F54EB]'
                  : 'border-gray-300 bg-white'
                  }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </span>
              <span className={isSelected ? 'text-[#2F54EB]' : 'text-gray-700'}>
                {platform}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
