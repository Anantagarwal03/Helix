/**
 * BlurText — React Bits text animation
 * Source: https://reactbits.dev/text-animations/blur-text
 * Adapted from: DavidHDev/react-bits (MIT)
 */
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const BlurText = ({
  text = '',
  delay = 80,
  className = '',
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  stepDuration = 0.38,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fromY = direction === 'top' ? -18 : 18

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`} style={{ gap: animateBy === 'words' ? '0.28em' : '0' }}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)', y: fromY }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            delay: i * (delay / 1000),
            duration: stepDuration,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {el}
        </motion.span>
      ))}
    </p>
  )
}

export default BlurText
