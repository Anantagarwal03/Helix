import { motion } from 'framer-motion'

export default function TimelineEffects({ effect }) {
  return (
    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden pointer-events-none">
      <motion.div
        className="w-full h-full"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 5%, rgba(40,10,60,0.9) 30%, rgba(0,0,0,0) 70%)' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
