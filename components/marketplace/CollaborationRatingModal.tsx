'use client'

import { useState } from 'react'
import { Button, Textarea, StarRating } from '@/components/ui'
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'

interface CollaborationRatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
  creatorName: string
  isLoading?: boolean
}

export function CollaborationRatingModal({
  isOpen,
  onClose,
  onSubmit,
  creatorName,
  isLoading = false,
}: CollaborationRatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (rating === 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit(rating, comment)
      // Reset form
      setRating(0)
      setHoveredRating(0)
      setComment('')
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const handleCancel = () => {
    setRating(0)
    setHoveredRating(0)
    setComment('')
    onClose()
  }

  const displayRating = hoveredRating || rating

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-2xl font-bold text-gray-900">Rate Your Experience</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting || isLoading}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Creator Name */}
          <div className="text-center">
            <p className="text-gray-600 mb-1">Your collaboration with</p>
            <p className="text-xl font-semibold text-gray-900 mb-2">{creatorName}</p>
            <p className="text-sm text-gray-500">has been completed. Please rate your experience:</p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  disabled={isSubmitting || isLoading}
                >
                  {star <= displayRating ? (
                    <StarIcon className="w-12 h-12 text-yellow-400" />
                  ) : (
                    <StarIconOutline className="w-12 h-12 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium text-gray-700">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Share your experience <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about the collaboration, content quality, communication, and overall experience..."
              className="resize-y"
              disabled={isSubmitting || isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your review will help other hotels make informed decisions when choosing creators
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting || isLoading}
              disabled={rating === 0}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
