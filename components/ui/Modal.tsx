'use client'

import { ReactNode, useEffect } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  /** Modal max-width size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean
  /** Whether to show the backdrop blur effect */
  blur?: boolean
  /** Backdrop opacity - 50 = bg-black/50, 60 = bg-black/60, 70 = bg-black/70 */
  backdropOpacity?: 50 | 60 | 70
  /** Additional classes for the modal container */
  className?: string
  /** Z-index level */
  zIndex?: 50 | 60
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-4xl',
}

const backdropClasses = {
  50: 'bg-black/50',
  60: 'bg-black/60',
  70: 'bg-black/70',
}

const zIndexClasses = {
  50: 'z-50',
  60: 'z-[60]',
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  blur = true,
  backdropOpacity = 50,
  className = '',
  zIndex = 50,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 ${zIndexClasses[zIndex]} flex items-center justify-center p-4 ${backdropClasses[backdropOpacity]} ${blur ? 'backdrop-blur-sm' : ''} overflow-y-auto`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export interface ModalHeaderProps {
  children: ReactNode
  onClose?: () => void
  className?: string
}

export function ModalHeader({ children, onClose, className = '' }: ModalHeaderProps) {
  return (
    <div className={`sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}

export default Modal
