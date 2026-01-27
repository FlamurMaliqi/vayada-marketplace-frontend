'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { countries } from 'countries-list'

const COUNTRIES = Object.values(countries).map(country => country.name).sort()

interface CountrySearchInputProps {
  selectedCountries: string[]
  onChange: (countries: string[]) => void
  searchValue: string
  onSearchChange: (value: string) => void
  maxSelections?: number
  label?: string
  description?: string
}

export function CountrySearchInput({
  selectedCountries,
  onChange,
  searchValue,
  onSearchChange,
  maxSelections = 3,
  label,
  description,
}: CountrySearchInputProps) {
  const filteredCountries = searchValue
    ? COUNTRIES.filter(
      c => c.toLowerCase().includes(searchValue.toLowerCase()) && !selectedCountries.includes(c)
    )
    : []

  return (
    <div>
      {label && <label className="block text-base font-semibold text-gray-900 mb-1">{label}</label>}
      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
      <div className="space-y-2">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const country = searchValue.trim()
              if (country && COUNTRIES.includes(country) && !selectedCountries.includes(country) && selectedCountries.length < maxSelections) {
                onChange([...selectedCountries, country])
                onSearchChange('')
              }
            }
          }}
          placeholder="Search countries..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
        />
        {filteredCountries.length > 0 && (
          <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            {filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  if (selectedCountries.length < maxSelections && !selectedCountries.includes(country)) {
                    onChange([...selectedCountries, country])
                    onSearchChange('')
                  }
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
              >
                {country}
              </button>
            ))}
          </div>
        )}
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((country, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 border border-primary-100">
                {country}
                <button
                  type="button"
                  onClick={() => onChange(selectedCountries.filter((c) => c !== country))}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
