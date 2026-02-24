import { useCallback, useRef, useState } from 'react'

export function useDebounce<T>(ms: number) {
  const [value, setValue] = useState<T | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const setDebounced = useCallback(
    (v: T) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setValue(v)
        timer.current = undefined
      }, ms)
    },
    [ms]
  )

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  return [value, setDebounced, flush] as const
}
