'use client'

import { useState, useRef } from 'react'
import { useClickOutside } from '@/hooks'
import { MagnifyingGlassIcon, ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { ALL_COUNTRIES } from '@/lib/constants'

interface SearchableCountrySelectProps {
  selected: string[]
  onToggle: (country: string) => void
  onClearAll: () => void
}

export function SearchableCountrySelect({
  selected,
  onToggle,
  onClearAll,
}: SearchableCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(
    [buttonRef, dropdownRef],
    () => {
      setIsOpen(false)
      setSearch('')
    },
    isOpen
  )

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  const unselectedFilteredCountries = filteredCountries.filter(
    (c) => !selected.includes(c)
  )

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-xl transition-all duration-200 ${
          isOpen || selected.length > 0
            ? 'border-primary-500 bg-primary-50/30 text-primary-700 shadow-sm'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span>Top Countries</span>
        {selected.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary-600 text-white rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl z-50 min-w-[320px] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-72 overflow-y-auto py-2 custom-scrollbar">
            {/* Selected Countries Section (pinned to top when search is empty) */}
            {!search && selected.length > 0 && (
              <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Selected
                </p>
                <div className="space-y-1">
                  {selected.map((country) => (
                    <div
                      key={`selected-${country}`}
                      onClick={() => onToggle(country)}
                      className="flex items-center justify-between px-3 py-2 bg-primary-50 text-primary-700 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors group"
                    >
                      <span className="text-sm font-semibold">{country}</span>
                      <CheckIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All/Filtered Countries */}
            <div className="px-2 space-y-0.5">
              {(search ? filteredCountries : unselectedFilteredCountries).map((country) => {
                const isSelected = selected.includes(country)
                return (
                  <div
                    key={country}
                    onClick={() => onToggle(country)}
                    className={`flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-primary-600 border-primary-600'
                            : 'bg-white border-gray-200 group-hover:border-primary-300'
                        }`}
                      >
                        {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span
                      className={`ml-3 text-sm transition-colors ${
                        isSelected ? 'font-semibold' : 'group-hover:text-gray-900 font-medium'
                      }`}
                    >
                      {country}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* No Results */}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MagnifyingGlassIcon className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900">No results found</p>
                <p className="text-xs text-gray-500 mt-1">Try searching for another country</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selected.length} selected
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClearAll()
                }}
                className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
