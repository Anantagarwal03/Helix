/**
 * ShinyText — React Bits sweeping light reflection
 * Source: https://reactbits.dev/text-animations/shiny-text
 * Self-contained: uses pure CSS animation, no motion/react required
 */
import { useRef } from 'react'

const ShinyText = ({
  text,
  speed       = 2.5,
  className   = '',
  color       = '#94a3b8',
  shineColor  = '#ffffff',
  spread      = 140,
  disabled    = false,
}) => {
  const ref = useRef(null)

  // Use CSS custom property approach — no JS animation loop needed
  const gradientStyle = disabled ? { color } : {
    background: `linear-gradient(
      110deg,
      ${color} 0%,
      ${color} 35%,
      ${shineColor} 50%,
      ${color} 65%,
      ${color} 100%
    )`,
    backgroundSize: `${spread * 3}% 100%`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `shinyTextSweep ${speed}s linear infinite`,
    display: 'inline-block',
  }

  return (
    <span ref={ref} className={className} style={gradientStyle}>
      {text}
    </span>
  )
}

export default ShinyText
