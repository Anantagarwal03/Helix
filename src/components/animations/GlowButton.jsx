/**
 * GlowButton — Animated gradient border + neon glow CTA button
 * Inspired by React Bits animated border patterns
 */
import { useRef } from 'react'
import { motion } from 'motion/react'

const GlowButton = ({ children, id, onClick, className = '', variant = 'primary' }) => {
  const btnRef = useRef(null)

  if (variant === 'ghost') {
    return (
      <motion.button
        ref={btnRef}
        id={id}
        onClick={onClick}
        whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium tracking-[-0.01em] cursor-pointer ${className}`}
        style={{
          color: '#94a3b8',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          outline: 'none',
          transition: 'color 150ms ease',
        }}
        onHoverStart={e => { if (btnRef.current) btnRef.current.style.color = '#fff' }}
        onHoverEnd={e => { if (btnRef.current) btnRef.current.style.color = '#94a3b8' }}
      >
        {children}
      </motion.button>
    )
  }

  return (
    // Outer wrapper — the animated gradient border
    <div className="relative rounded-lg p-px" style={{ background: 'linear-gradient(135deg, #00f2fe, #7c3aed, #ec4899, #00f2fe)', backgroundSize: '300% 300%', animation: 'gradientBorderSpin 3s linear infinite' }}>
      <motion.button
        ref={btnRef}
        id={id}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-[7px] text-[13px] font-semibold tracking-[-0.01em] cursor-pointer overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(135deg, #030a10 0%, #05000f 100%)',
          color: '#00f2fe',
          outline: 'none',
          border: 'none',
          boxShadow: '0 0 24px rgba(0,242,254,0.18)',
        }}
      >
        {/* Inner shimmer sweep */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(0,242,254,0.06) 50%,transparent 100%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
        />
        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      </motion.button>
    </div>
  )
}

export default GlowButton
