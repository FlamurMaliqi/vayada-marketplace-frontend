/**
 * Hook for detecting clicks outside of specified elements
 */

import { useEffect, RefObject } from 'react'

export function useClickOutside(
  refs: RefObject<HTMLElement>[],
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(target)
      )

      if (isOutside) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs, handler, enabled])
}
