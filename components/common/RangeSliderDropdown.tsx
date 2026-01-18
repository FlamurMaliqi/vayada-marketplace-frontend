'use client'

import { useState, useRef, useEffect } from 'react'
import { useClickOutside } from '@/hooks'

interface RangeSliderDropdownProps {
  label: string
  title: string
  min: number
  max: number
  step: number
  value: number
  defaultValue: number
  onChange: (value: number) => void
  formatValue: (value: number) => string
  formatMin?: string
  formatMax?: string
  showCurrentValue?: boolean
}

export function RangeSliderDropdown({
  label,
  title,
  min,
  max,
  step,
  value,
  defaultValue,
  onChange,
  formatValue,
  formatMin,
  formatMax,
  showCurrentValue = false,
}: RangeSliderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside([buttonRef, dropdownRef], () => setIsOpen(false), isOpen)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: number) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const percentage = ((localValue - min) / (max - min)) * 100

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors"
      >
        {value !== defaultValue ? `${label}: ${formatValue(value)}` : label}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 bg-white rounded-b-xl shadow-xl z-50 min-w-[320px] overflow-hidden"
        >
          <div className="px-5 py-3 text-gray-900 text-sm font-bold text-center">
            {title}
          </div>
          <div className="px-5 pb-5">
            <div className="relative">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(14, 165, 233) 0%, rgb(14, 165, 233) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`
                }}
              />
            </div>
            <div className="flex justify-between mt-3 text-sm text-gray-700">
              <span>{formatMin ?? formatValue(min)}</span>
              {showCurrentValue && (
                <span className="font-medium">{formatValue(localValue)}</span>
              )}
              <span>{formatMax ?? formatValue(max)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
