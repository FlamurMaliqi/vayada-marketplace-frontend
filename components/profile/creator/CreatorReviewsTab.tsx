'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { StarRating } from '@/components/ui'
import type { CreatorRating } from '@/lib/types'

interface CreatorReviewsTabProps {
  rating?: CreatorRating
}

export function CreatorReviewsTab({ rating }: CreatorReviewsTabProps) {
  const hasReviews = rating && rating.totalReviews > 0

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
      </div>

      {hasReviews ? (
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Rating</h3>
                <StarRating
                  rating={rating.averageRating ?? 0}
                  totalReviews={rating.totalReviews ?? 0}
                  size="lg"
                />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">
                  {(rating?.averageRating ?? 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">out of 5.0</div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {rating.reviews && rating.reviews.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Reviews ({rating.reviews.length})
              </h3>
              <div className="space-y-4">
                {rating.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {review.hotelName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <StarRating
                        rating={review.rating}
                        size="sm"
                        showNumber={false}
                        showReviews={false}
                      />
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed mt-3">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyReviewsState />
          )}
        </div>
      ) : (
        <EmptyReviewsState />
      )}
    </div>
  )
}

function EmptyReviewsState() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">No reviews yet</p>
      <p className="text-sm text-gray-500 mt-2">
        Reviews from hotels will appear here after collaborations
      </p>
    </div>
  )
}
