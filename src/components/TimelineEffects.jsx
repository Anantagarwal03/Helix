import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function TimelineEffects({ effect, tangentDepth = 1 }) {
  const shakeMap = [0, 0, 2, 8];
  const shake = shakeMap[tangentDepth] || 0;
  
  const rotationMap = [0, 20, 5, 1];
  const rotationSpeed = rotationMap[tangentDepth] || 20;

  const particleSpeedMap = [0, 4, 1.5, 0.4];
  const particleSpeed = particleSpeedMap[tangentDepth] || 4;

  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 50; // 50vw to 100vw starting distance
      return {
        id: i,
        xStart: Math.cos(angle) * distance + 'vw',
        yStart: Math.sin(angle) * distance + 'vh',
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden pointer-events-none">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{ 
          x: [-shake, shake, -shake, shake, 0], 
          y: [-shake/2, shake/2, -shake/2, shake/2, 0] 
        }}
        transition={{ repeat: Infinity, duration: 0.2 }}
      >
        {/* Violent Chromatic Aberration Black Hole */}
        <div
          className="absolute rounded-full bg-black z-10"
          style={{ 
            width: '40vmin', 
            height: '40vmin', 
            boxShadow: '-20px 0 60px red, 20px 0 60px cyan, 0 0 100px rgba(80,0,150,1)' 
          }}
        />

        {/* Ambient Void Background (Spinning) */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 5%, rgba(40,10,60,0.9) 30%, rgba(0,0,0,0) 70%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: rotationSpeed, repeat: Infinity, ease: 'linear' }}
        />

        {/* Noise/Glitch Layer */}
        <motion.div
          className="absolute inset-0 z-20 mix-blend-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
          }}
          animate={{ opacity: [0.1, 0.3, 0] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatType: 'mirror' }}
        />

        {/* Gravity Particles */}
        <div className="absolute inset-0 z-15 flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              initial={{ x: p.xStart, y: p.yStart, scale: 1, opacity: 0 }}
              animate={{ x: 0, y: 0, scale: 0, opacity: [0, 1, 0] }}
              transition={{
                duration: particleSpeed + Math.random() * 0.5,
                repeat: Infinity,
                ease: 'easeIn',
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

      </motion.div>
    </div>
  )
}
