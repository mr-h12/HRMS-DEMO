import { useEffect, useState } from 'react'

/** Short artificial delay so pages can demo their skeleton loading states. */
export function useSimulatedLoading(ms = 450, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return loading
}
