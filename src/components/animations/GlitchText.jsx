/**
 * GlitchText — React Bits CSS glitch effect
 * Source: https://reactbits.dev/text-animations/glitch-text
 * Pure CSS — pseudo-elements create the RGB split + clip distortion
 */
const GlitchText = ({
  children,
  speed         = 1,
  enableShadows = true,
  enableOnHover = false,  // false = always glitching
  className     = '',
}) => {
  const style = {
    '--after-duration':  `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow':    enableShadows ? '-5px 0 rgba(255,0,80,0.7)'   : 'none',
    '--before-shadow':   enableShadows ? '5px 0 rgba(0,242,254,0.7)'  : 'none',
    position: 'relative',
    display: 'inline-block',
  }

  return (
    <span
      className={`glitch-text ${enableOnHover ? 'glitch-hover' : 'glitch-always'} ${className}`}
      style={style}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}

export default GlitchText
