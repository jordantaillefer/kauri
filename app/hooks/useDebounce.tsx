import debounce from "lodash.debounce"
import { ChangeEvent, useEffect, useMemo, useRef } from "react"

export const useDebounce = (callback: (event: ChangeEvent<HTMLInputElement>) => void) => {
  const ref = useRef<any>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  return useMemo(() => {
    const func = (event: ChangeEvent<HTMLInputElement>) => {
      ref.current?.(event)
    }

    return debounce(func, 1000)
  }, [])
}
