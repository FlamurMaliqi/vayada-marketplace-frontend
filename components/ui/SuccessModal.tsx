'use client'

import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Button from './Button'

interface SuccessModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message: string
}

export function SuccessModal({
    isOpen,
    onClose,
    title = 'Success!',
    message
}: SuccessModalProps) {
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
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Button */}
                    <Button
                        variant="primary"
                        onClick={onClose}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}
