'use client'

import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import Button from './Button'

interface FeatureUnavailableModalProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
}

export function FeatureUnavailableModal({ 
  isOpen, 
  onClose, 
  featureName = 'This feature' 
}: FeatureUnavailableModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
            <CalendarDaysIcon className="w-8 h-8 text-primary-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {featureName} Will Be Available Shortly
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            We're working hard to bring you this feature. Please check back soon!
          </p>

          {/* Button */}
          <Button
            variant="primary"
            onClick={onClose}
            size="lg"
            className="w-full"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}
