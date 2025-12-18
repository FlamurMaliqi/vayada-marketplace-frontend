'use client'

import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Button from './Button'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string | string[]
  details?: string
}

export function ErrorModal({ 
  isOpen, 
  onClose, 
  title = 'Error',
  message,
  details
}: ErrorModalProps) {
  if (!isOpen) return null

  // Handle array of messages (validation errors)
  const messages = Array.isArray(message) ? message : [message]
  const hasMultipleErrors = messages.length > 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div>
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {title}
          </h3>

          {/* Error Messages */}
          <div className="mb-6">
            {hasMultipleErrors ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Please fix the following errors:
                </p>
                <ul className="space-y-2">
                  {messages.map((msg, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-600 font-semibold mt-0.5">•</span>
                      <span className="flex-1">{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 text-center leading-relaxed">
                {messages[0]}
              </p>
            )}
          </div>

          {/* Additional Details */}
          {details && (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-words">
                {details}
              </p>
            </div>
          )}

          {/* Button */}
          <Button
            variant="primary"
            onClick={onClose}
            size="lg"
            className="w-full"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}

