/**
 * Reusable Input component
 */

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leadingIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leadingIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-base font-medium text-gray-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leadingIcon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors text-base text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-gray-500',
              leadingIcon ? 'pl-11' : '',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-700">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input


