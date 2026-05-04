import { useState } from 'react'
import type { ErrorModalState } from '@/components/profile/types'

type ValidationError = { loc?: (string | number)[]; msg?: string }

const PYDANTIC_PREFIXES = [
  'Value error, ',
  'Assertion failed, ',
  'Type error, ',
]

const FIELD_LABELS: Record<string, string> = {
  collaboration_offerings: 'Collaboration offering',
  creator_requirements: 'Creator requirements',
  collaborationOfferings: 'Collaboration offering',
  creatorRequirements: 'Creator requirements',
  availability_months: 'Availability months',
  availabilityMonths: 'Availability months',
  accommodation_type: 'Accommodation type',
  accommodationType: 'Accommodation type',
  target_age_min: 'Minimum target age',
  target_age_max: 'Maximum target age',
  target_age_groups: 'Target age groups',
  target_countries: 'Target countries',
  creator_types: 'Creator types',
  min_followers: 'Minimum followers',
  free_stay_min_nights: 'Minimum nights',
  free_stay_max_nights: 'Maximum nights',
  paid_max_amount: 'Maximum payment amount',
  discount_percentage: 'Discount percentage',
  commission_percentage: 'Commission percentage',
  collaboration_type: 'Collaboration type',
}

function humaniseSegment(seg: string): string {
  if (FIELD_LABELS[seg]) return FIELD_LABELS[seg]
  const spaced = seg.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  if (!spaced) return seg
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}

function formatLoc(loc: (string | number)[] | undefined): string {
  if (!Array.isArray(loc)) return ''
  // Strip the leading 'body' / 'query' / 'path' segment FastAPI prepends.
  const head = loc[0]
  const path = head === 'body' || head === 'query' || head === 'path' ? loc.slice(1) : loc.slice()
  if (path.length === 0) return ''

  const parts: string[] = []
  for (const seg of path) {
    if (typeof seg === 'number') {
      // 1-based index attached to the previous label, e.g. "Collaboration offering 1".
      if (parts.length === 0) {
        parts.push(`Item ${seg + 1}`)
      } else {
        parts[parts.length - 1] = `${parts[parts.length - 1]} ${seg + 1}`
      }
    } else {
      parts.push(humaniseSegment(seg))
    }
  }
  return parts.join(' › ')
}

function cleanMessage(msg: string | undefined): string {
  if (!msg) return 'Validation error'
  let cleaned = msg
  for (const prefix of PYDANTIC_PREFIXES) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length)
      break
    }
  }
  cleaned = cleaned.trim()
  if (!cleaned) return 'Validation error'
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function formatValidationError(err: ValidationError): string {
  const field = formatLoc(err.loc)
  const message = cleanMessage(err.msg)
  return field ? `${field}: ${message}` : message
}

/**
 * Format error detail for display
 * Handles string, array of validation errors, or object
 */
export function formatErrorDetail(detail: unknown): string {
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail)) {
    return (detail as ValidationError[]).map(formatValidationError).join('; ')
  }
  if (detail && typeof detail === 'object') {
    return JSON.stringify(detail)
  }
  return 'An error occurred'
}

/**
 * Format error detail for modal display (returns array of messages)
 */
export function formatErrorForModal(detail: unknown): string[] {
  if (typeof detail === 'string') {
    return [detail]
  }
  if (Array.isArray(detail)) {
    return (detail as ValidationError[]).map(formatValidationError)
  }
  if (detail && typeof detail === 'object') {
    return [JSON.stringify(detail)]
  }
  return ['An error occurred']
}

export function useErrorModal() {
  const [errorModal, setErrorModal] = useState<ErrorModalState>({
    isOpen: false,
    title: 'Error',
    message: '',
  })

  const showError = (title: string, message: string | string[], details?: string) => {
    setErrorModal({
      isOpen: true,
      title,
      message,
      details,
    })
  }

  const closeError = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }))
  }

  return {
    errorModal,
    showError,
    closeError,
  }
}
