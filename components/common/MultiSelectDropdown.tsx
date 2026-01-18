'use client'

import { useState, useRef } from 'react'
import { useClickOutside } from '@/hooks'

interface MultiSelectDropdownProps {
  label: string
  title: string
  options: readonly string[]
  selected: string[]
  onToggle: (option: string) => void
}

export function MultiSelectDropdown({
  label,
  title,
  options,
  selected,
  onToggle,
}: MultiSelectDropdownProps) {
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
          className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[220px] overflow-hidden"
        >
          <div className="px-5 py-2.5 text-gray-900 text-sm">
            {title}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option)
              return (
                <label
                  key={option}
                  className="flex items-center px-5 py-0.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    onToggle(option)
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {isSelected ? (
                      <div className="w-4 h-4 bg-primary-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-primary-400 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="ml-3 text-sm text-gray-900">{option}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
