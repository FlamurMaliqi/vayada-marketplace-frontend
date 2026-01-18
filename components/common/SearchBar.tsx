'use client'

import { Input } from '@/components/ui'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  sortOption?: string
  onSortChange?: (sort: string) => void
  showSort?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  sortOption = 'relevance',
  onSortChange,
  showSort = true,
}: SearchBarProps) {
  return (
    <div className="mb-4 flex gap-4 items-center">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-4 py-3 w-full"
        />
      </div>
      {showSort && onSortChange && (
        <div className="flex-shrink-0">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px]"
          >
            <option value="relevance">Relevance</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      )}
    </div>
  )
}
