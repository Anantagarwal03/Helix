/**
 * DecryptedText — React Bits text animation
 * Source: https://reactbits.dev/text-animations/decrypted-text
 * Adapted from: DavidHDev/react-bits (MIT)
 * Triggers on 'view' (IntersectionObserver) or 'hover'
 */
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=<>?'

export default function DecryptedText({
  text,
  speed            = 40,
  maxIterations    = 12,
  sequential       = true,
  revealDirection  = 'start',
  characters       = CHARS,
  className        = '',
  parentClassName  = '',
  encryptedClassName = '',
  animateOn        = 'view',   // 'view' | 'hover'
}) {
  const [display, setDisplay]   = useState(text)
  const [revealed, setRevealed] = useState(new Set())
  const [running, setRunning]   = useState(false)
  const containerRef = useRef(null)
  const intervalRef  = useRef(null)
  const pointer      = useRef(0)
  const triggered    = useRef(false)

  const chars = useMemo(() => characters.split(''), [characters])

  const getOrder = useCallback(len => {
    if (revealDirection === 'start') return Array.from({ length: len }, (_, i) => i)
    if (revealDirection === 'end')   return Array.from({ length: len }, (_, i) => len - 1 - i)
    // center outward
    const mid = Math.floor(len / 2)
    const order = []
    let off = 0
    while (order.length < len) {
      if (off % 2 === 0) { const i = mid + off / 2;        if (i >= 0 && i < len) order.push(i) }
      else               { const i = mid - Math.ceil(off/2); if (i >= 0 && i < len) order.push(i) }
      off++
    }
    return order
  }, [revealDirection])

  const shuffle = useCallback((orig, rev) =>
    orig.split('').map((ch, i) => {
      if (ch === ' ') return ' '
      if (rev.has(i)) return orig[i]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join(''),
  [chars])

  const startAnimation = useCallback(() => {
    if (running) return
    setRunning(true)
    const order = getOrder(text.length)
    pointer.current = 0
    const rev = new Set()
    let iter = 0

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (sequential) {
        if (pointer.current < text.length) {
          rev.add(order[pointer.current])
          pointer.current++
        } else {
          clearInterval(intervalRef.current)
          setDisplay(text)
          setRevealed(new Set(Array.from({ length: text.length }, (_, i) => i)))
          setRunning(false)
          return
        }
        setRevealed(new Set(rev))
        setDisplay(shuffle(text, rev))
      } else {
        if (iter >= maxIterations) {
          clearInterval(intervalRef.current)
          setDisplay(text)
          setRevealed(new Set(Array.from({ length: text.length }, (_, i) => i)))
          setRunning(false)
          return
        }
        iter++
        setDisplay(shuffle(text, rev))
      }
    }, speed)
  }, [running, text, sequential, maxIterations, speed, getOrder, shuffle])

  // IntersectionObserver trigger for animateOn='view'
  useEffect(() => {
    if (animateOn !== 'view') return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true
        setTimeout(startAnimation, 200)
        obs.unobserve(el)
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [animateOn, startAnimation])

  return (
    <span
      ref={containerRef}
      className={parentClassName}
      onMouseEnter={animateOn === 'hover' ? startAnimation : undefined}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
    >
      <span aria-hidden="true">
        {display.split('').map((ch, i) => (
          <span
            key={i}
            className={revealed.has(i) ? className : `${encryptedClassName} ${className}`}
            style={revealed.has(i) ? {} : { opacity: 0.35 }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span style={{ position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0,0,0,0)' }}>
        {text}
      </span>
    </span>
  )
}
