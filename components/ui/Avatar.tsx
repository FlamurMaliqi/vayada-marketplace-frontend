'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface AvatarProps {
  /** Image source URL */
  src?: string | null
  /** Name for fallback initials */
  name: string
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Fallback style - 'initials' shows up to 2 letters, 'letter' shows first letter only */
  fallbackStyle?: 'initials' | 'letter'
  /** Color variant for fallback */
  variant?: 'blue' | 'gradient'
  /** Additional class names */
  className?: string
  /** Alt text for image */
  alt?: string
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
}

const textSizeClasses = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-3xl',
}

const variantClasses = {
  blue: 'bg-blue-100 text-blue-600',
  gradient: 'bg-gradient-to-br from-primary-400 to-primary-600 text-white',
}

/**
 * Get initials from a name (up to 2 characters)
 */
function getInitials(name: string | undefined | null): string {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

/**
 * Get first letter from a name
 */
function getFirstLetter(name: string | undefined | null): string {
  if (!name) return ''
  return name.charAt(0).toUpperCase()
}

export function Avatar({
  src,
  name,
  size = 'md',
  fallbackStyle = 'initials',
  variant = 'blue',
  className = '',
  alt,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const fallbackText = fallbackStyle === 'initials' ? getInitials(name) : getFirstLetter(name)
  const showImage = src && !imageError

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex-shrink-0 overflow-hidden relative ${className}`}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt || name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold ${textSizeClasses[size]} ${variantClasses[variant]}`}
        >
          {fallbackText}
        </div>
      )}
    </div>
  )
}

/**
 * Simple avatar using img tag instead of Next.js Image (for cases where unoptimized native img is preferred)
 */
export function AvatarSimple({
  src,
  name,
  size = 'md',
  fallbackStyle = 'initials',
  variant = 'blue',
  className = '',
  alt,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const fallbackText = fallbackStyle === 'initials' ? getInitials(name) : getFirstLetter(name)
  const showImage = src && !imageError

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex-shrink-0 overflow-hidden ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold ${textSizeClasses[size]} ${variantClasses[variant]}`}
        >
          {fallbackText}
        </div>
      )}
    </div>
  )
}

export default Avatar
