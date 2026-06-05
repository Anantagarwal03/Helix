/**
 * SpotlightCard — React Bits dynamic mouse-tracking gradient spotlight
 * Source: https://reactbits.dev/components/spotlight-card
 * Adapted from: DavidHDev/react-bits (MIT)
 */
import { useRef } from 'react'

const SpotlightCard = ({
  children,
  className       = '',
  spotlightColor  = 'rgba(0,242,254,0.18)',
  spotlightSize   = 350,
  style           = {},
}) => {
  const ref = useRef(null)

  const handleMouseMove = e => {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top
    el.style.setProperty('--spotlight-x', `${x}px`)
    el.style.setProperty('--spotlight-y', `${y}px`)
    el.style.setProperty('--spotlight-opacity', '1')
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (el) el.style.setProperty('--spotlight-opacity', '0')
  }

  return (
    <div
      ref={ref}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--spotlight-color': spotlightColor,
        '--spotlight-size':  `${spotlightSize}px`,
        '--spotlight-x':     '50%',
        '--spotlight-y':     '50%',
        '--spotlight-opacity': '0',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Spotlight radial gradient — follows cursor */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: `radial-gradient(
            var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y),
            var(--spotlight-color),
            transparent 70%
          )`,
          opacity: 'var(--spotlight-opacity)',
          transition: 'opacity 400ms ease',
          borderRadius: 'inherit',
        }}
      />
      {/* Content sits above the spotlight */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

export default SpotlightCard
