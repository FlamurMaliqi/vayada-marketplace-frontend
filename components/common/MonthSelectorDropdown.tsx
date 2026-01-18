'use client'

import { useState, useRef } from 'react'
import { useClickOutside } from '@/hooks'
import { MONTHS_FULL, MONTHS_ABBR } from '@/lib/constants'

interface MonthSelectorDropdownProps {
  label: string
  selected: string[]
  onToggle: (month: string) => void
}

export function MonthSelectorDropdown({
  label,
  selected,
  onToggle,
}: MonthSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside([buttonRef, dropdownRef], () => setIsOpen(false), isOpen)

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
      >
        {label}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[280px] overflow-hidden"
        >
          <div className="px-5 py-2.5 text-gray-900 text-sm font-bold">
            Select Months
          </div>
          <div className="px-5 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_FULL.map((month, index) => {
                const isSelected = selected.includes(month)
                return (
                  <button
                    key={month}
                    onClick={() => onToggle(month)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {MONTHS_ABBR[index]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
