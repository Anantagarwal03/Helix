import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineMatrix } from '../data/timelineMatrix'
import Sidebar from '../components/layout/Sidebar'
import TimelineEffects from '../components/TimelineEffects'
import TimelineMapOverlay from '../components/TimelineMapOverlay'

export default function TimelineEngine() {
  const [currentNodeId, setCurrentNodeId] = useState(timelineMatrix['donnie-darko'].rootNode)
  const [visitedPath, setVisitedPath] = useState([timelineMatrix['donnie-darko'].rootNode])
  const [showMap, setShowMap] = useState(false)
  const currentNode = timelineMatrix['donnie-darko'].nodes[currentNodeId] || timelineMatrix['donnie-darko'].nodes[timelineMatrix['donnie-darko'].rootNode]

  const handleBranch = (choice) => {
    setCurrentNodeId(choice.targetId)
    setVisitedPath(prev => {
      if (prev.includes(choice.targetId)) return prev;
      return [...prev, choice.targetId];
    })
  }

  const handleReset = () => {
    setCurrentNodeId(timelineMatrix['donnie-darko'].rootNode)
    setVisitedPath([timelineMatrix['donnie-darko'].rootNode])
  }

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex text-white">
      {/* Sidebar */}
      <div className="flex-shrink-0 z-30 h-full relative" style={{ width: '200px' }}>
        <Sidebar activeSection={-1} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative h-full flex items-center justify-start px-16 lg:px-24">
        {/* Full-screen Background Crossfade */}
        <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            {currentNode.type === 'canonical' ? (
              <motion.img
                key={currentNodeId}
                src={currentNode.bgImage}
                alt="Timeline Background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            ) : (
              <motion.div
                key={currentNodeId}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <TimelineEffects effect={currentNode.effect} tangentDepth={currentNode.tangentDepth || 1} />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        {/* Floating Glassmorphic Overlay */}
        <div className="relative z-10 w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{currentNode.title}</h2>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">{currentNode.description}</p>

              <div className="flex flex-col gap-3 mt-2">
                {currentNode.isEnding ? (
                  <button
                    onClick={handleReset}
                    className="w-full py-4 px-6 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/50 transition-all text-sm tracking-wide text-cyan-400 font-medium"
                  >
                    ⟲ Reset Timeline
                  </button>
                ) : (
                  currentNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBranch(choice)}
                      className="w-full py-4 px-6 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/30 transition-all text-sm tracking-wide text-white"
                    >
                      {choice.label}
                    </button>
                  ))
                )}
              </div>

              {/* View Map Button */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowMap(true)}
                  className="w-full py-3 px-6 text-center rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-sm tracking-wide text-cyan-400 font-medium"
                >
                  View Timeline Map
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showMap && (
        <TimelineMapOverlay 
          timelineData={timelineMatrix['donnie-darko']}
          currentNodeId={currentNodeId}
          visitedPath={visitedPath}
          closeMap={() => setShowMap(false)}
          onNodeClick={(id) => {
            setCurrentNodeId(id);
            setShowMap(false);
          }}
        />
      )}
    </div>
  )
}
