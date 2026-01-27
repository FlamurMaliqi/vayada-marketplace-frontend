import { useState } from 'react'
import type { ErrorModalState } from '@/components/profile/types'

/**
 * Format error detail for display
 * Handles string, array of validation errors, or object
 */
export function formatErrorDetail(detail: unknown): string {
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail)) {
    return detail.map((err: { loc?: (string | number)[]; msg?: string }) => {
      const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field'
      return `${field}: ${err.msg || 'Validation error'}`
    }).join('; ')
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
    return detail.map((err: { loc?: (string | number)[]; msg?: string }) => {
      const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field'
      return `${field}: ${err.msg || 'Validation error'}`
    })
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
