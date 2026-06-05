/**
 * AnimatedCounter — counting-up animation with IntersectionObserver trigger
 * Custom implementation inspired by React Bits patterns
 */
import { useEffect, useRef, useState } from 'react'

const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const AnimatedCounter = ({ target, duration = 1400, delay = 0 }) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const triggered = useRef(false)

  const isNumeric = !isNaN(Number(target.replace(/[^0-9.]/g, '')))
  const numericTarget = isNumeric ? parseFloat(target.replace(/[^0-9.]/g, '')) : 0
  const suffix = isNumeric ? target.replace(/[0-9.]/g, '') : target

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          setTimeout(() => {
            const start = performance.now()
            const tick = (now) => {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = easeOutExpo(progress)
              setValue(Math.round(eased * numericTarget * 10) / 10)
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }, delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, delay, numericTarget])

  const display = isNumeric
    ? (Number.isInteger(numericTarget) ? Math.round(value) : value.toFixed(1)) + suffix
    : target

  return <span ref={ref}>{display}</span>
}

export default AnimatedCounter
