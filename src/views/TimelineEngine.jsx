import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineMatrix } from '../data/timelineMatrix'
import Sidebar from '../components/layout/Sidebar'
import TimelineEffects from '../components/TimelineEffects'
import TimelineMapOverlay from '../components/TimelineMapOverlay'

export default function TimelineEngine() {
  const [activeMovieId, setActiveMovieId] = useState('donnie-darko')
  const [currentNodeId, setCurrentNodeId] = useState(timelineMatrix[activeMovieId].rootNode)
  const [visitedPath, setVisitedPath] = useState([timelineMatrix[activeMovieId].rootNode])
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    setCurrentNodeId(timelineMatrix[activeMovieId].rootNode)
    setVisitedPath([timelineMatrix[activeMovieId].rootNode])
  }, [activeMovieId])

  const currentNode = timelineMatrix[activeMovieId].nodes[currentNodeId] || timelineMatrix[activeMovieId].nodes[timelineMatrix[activeMovieId].rootNode]

  const handleBranch = (choice) => {
    setCurrentNodeId(choice.targetId)
    setVisitedPath(prev => {
      if (prev.includes(choice.targetId)) return prev;
      return [...prev, choice.targetId];
    })
  }

  const handleReset = () => {
    setCurrentNodeId(timelineMatrix[activeMovieId].rootNode)
    setVisitedPath([timelineMatrix[activeMovieId].rootNode])
  }

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex text-white">
      {/* Sidebar */}
      <div className="flex-shrink-0 z-30 h-full relative" style={{ width: '200px' }}>
        <Sidebar activeSection={-1} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative h-full flex items-center justify-start px-16 lg:px-24">
        <div className="absolute top-8 right-16 z-50 flex gap-3">
          <button onClick={() => setActiveMovieId('donnie-darko')} className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${activeMovieId === 'donnie-darko' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>Donnie Darko</button>
          <button onClick={() => setActiveMovieId('the-sixth-sense')} className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${activeMovieId === 'the-sixth-sense' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>The Sixth Sense</button>
          <button onClick={() => setActiveMovieId('zodiac')} className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${activeMovieId === 'zodiac' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>Zodiac</button>
        </div>
        {currentNode.type === 'tangent' ? (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <TimelineEffects effect={currentNode.effect} tangentDepth={currentNode.tangentDepth || 1} />
          </div>
        ) : (
          <div className="fixed inset-0 z-0 bg-[#020205] overflow-hidden flex items-center justify-center pointer-events-none">
            <div className="absolute w-[800px] h-[800px] rounded-full blur-[120px] bg-cyan-900/20 animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="relative w-[30rem] h-[30rem] rounded-full border-[1px] border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)] animate-[spin_30s_linear_infinite] flex items-center justify-center">
              <div className="absolute w-[24rem] h-[24rem] rounded-full border border-blue-400/20 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute w-[18rem] h-[18rem] rounded-full border border-indigo-500/10 animate-[spin_10s_linear_infinite]" />
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
            </div>
          </div>
        )}

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
          timelineData={timelineMatrix[activeMovieId]}
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
