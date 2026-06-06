import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function TimelineEffects({ effect, tangentDepth = 1 }) {
  const shakeMap = [0, 0, 2, 8];
  const depthMultiplier = tangentDepth > 3 ? 3 : tangentDepth;
  
  const particles = useMemo(() => {
    return [...Array(40)].map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 40 + 40; 
      return {
        id: i,
        x: Math.cos(angle) * distance + 'vmin',
        y: Math.sin(angle) * distance + 'vmin',
        rotation: angle * (180 / Math.PI)
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden pointer-events-none">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{ x: [-8, 8, -5, 5, 0], y: [-3, 3, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 0.15 }}
      >
        {/* Ambient Void Background */}
        <div className="absolute inset-0"
             style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(30,10,15,0.7) 40%, rgba(0,0,0,0) 80%)' }} />

        {/* Gargantua Container */}
        <div className="relative w-[50vmin] h-[50vmin] flex items-center justify-center perspective-[1000px]">
          
          {/* Layer 1: Back/Top Ring (Gravitational Lensing) */}
          <motion.div
            className="absolute rounded-full border border-orange-200/50"
            style={{
              width: '100vmin',
              height: '100vmin',
              scaleY: 0.4,
              scaleX: 1.2,
              top: '-15%',
              boxShadow: '0 0 80px 20px rgba(255,220,150,0.9), inset 0 0 100px 20px rgba(255,255,255,0.8)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Layer 2: The Void (Event Horizon) */}
          <div
            className="absolute rounded-full bg-black z-10"
            style={{ 
              width: '45vmin', 
              height: '45vmin', 
              boxShadow: '0 0 40px 10px rgba(0,0,0,1), 0 0 60px 15px rgba(255,180,100,0.6)' 
            }}
          />

          {/* Layer 3: Front/Bottom Ring (Overlapping the Void) */}
          <motion.div
            className="absolute rounded-full border border-orange-200/80 z-20"
            style={{
              width: '100vmin',
              height: '100vmin',
              scaleY: 0.4,
              scaleX: 1.2,
              bottom: '-15%',
              boxShadow: '0 0 100px 30px rgba(255,200,100,1), inset 0 0 80px 15px rgba(255,255,255,1)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Spaghettification Particles */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-16 h-1 bg-white rounded-full shadow-[0_0_15px_white]"
                style={{ rotate: p.rotation }}
                initial={{ x: p.x, y: p.y, scaleX: 1, opacity: 0 }}
                animate={{ x: 0, y: 0, scaleX: [1, 5, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: 'easeIn',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

        </div>

        {/* Noise/Glitch Layer */}
        <motion.div
          className="absolute inset-0 z-40 mix-blend-overlay opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)'
          }}
          animate={{ opacity: [0.1, 0.4, 0] }}
          transition={{ duration: 0.1, repeat: Infinity, repeatType: 'mirror' }}
        />

      </motion.div>
    </div>
  )
}
