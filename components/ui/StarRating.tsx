/**
 * Star Rating component for displaying 1-5 star ratings
 */

interface StarRatingProps {
  rating: number // 1-5
  totalReviews?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  showReviews?: boolean
  className?: string
}

export function StarRating({
  rating,
  totalReviews,
  size = 'md',
  showNumber = true,
  showReviews = true,
  className = '',
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const starSize = sizeClasses[size]
  const textSize = textSizeClasses[size]

  // Clamp rating between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating))
  const fullStars = Math.floor(clampedRating)
  const hasHalfStar = clampedRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className={`${starSize} text-yellow-400 fill-yellow-400`} />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <HalfStarIcon className={`${starSize} text-yellow-400 fill-yellow-400`} />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className={`${starSize} text-gray-300 fill-gray-300`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`font-semibold text-gray-900 ${textSize}`}>
          {clampedRating.toFixed(1)}
        </span>
      )}
      {showReviews && totalReviews !== undefined && totalReviews > 0 && (
        <span className={`text-gray-600 ${textSize}`}>
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

// Star icon component
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

// Half star icon component
function HalfStarIcon({ className }: { className?: string }) {
  return (
    <div className="relative inline-block">
      {/* Empty star background */}
      <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#D1D5DB' }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {/* Half-filled star overlay */}
      <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          clipPath: 'inset(0 50% 0 0)',
          color: '#FBBF24',
        }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  )
}

export default StarRating
