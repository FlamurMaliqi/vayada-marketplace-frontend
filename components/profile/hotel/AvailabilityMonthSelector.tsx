'use client'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { MONTHS_FULL } from '@/lib/constants'

interface AvailabilityMonthSelectorProps {
  selectedMonths: string[]
  onChange: (months: string[]) => void
}

export function AvailabilityMonthSelector({ selectedMonths, onChange }: AvailabilityMonthSelectorProps) {
  const allSelected = MONTHS_FULL.every(month => selectedMonths.includes(month))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
      <div className="mb-3">
        <button
          type="button"
          onClick={() => {
            if (allSelected) {
              onChange([])
            } else {
              onChange([...MONTHS_FULL])
            }
          }}
          className={`w-full px-4 py-3 rounded-xl border-2 text-base font-bold transition-all shadow-sm ${allSelected
            ? 'bg-gradient-to-r from-[#2F54EB] to-[#1e3a8a] border-[#2F54EB] text-white shadow-md'
            : 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-300 text-primary-700 hover:from-primary-100 hover:to-primary-200 hover:border-primary-400 hover:shadow-md'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <CalendarDaysIcon className="w-5 h-5" />
            {allSelected ? 'All Year Selected' : 'Select All Year'}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {MONTHS_FULL.map((month) => {
          const isSelected = selectedMonths.includes(month)
          const monthAbbr = month.substring(0, 3)

          return (
            <label
              key={month}
              className={`relative flex flex-col items-center justify-center py-2 rounded-xl border cursor-pointer transition-all text-xs ${isSelected
                ? 'bg-[#2F54EB] border-[#2F54EB] text-white'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedMonths, month])
                  } else {
                    onChange(selectedMonths.filter((m) => m !== month))
                  }
                }}
                className="sr-only"
              />
              <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{monthAbbr}</div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
