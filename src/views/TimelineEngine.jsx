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
    const root = timelineMatrix[activeMovieId].rootNode
    setCurrentNodeId(root)
    setVisitedPath([root])
  }, [activeMovieId])

  const movieData = timelineMatrix[activeMovieId]
  const currentNode = movieData.nodes[currentNodeId] || movieData.nodes[movieData.rootNode]

  const handleBranch = (choice) => {
    setCurrentNodeId(choice.targetId)
    setVisitedPath(prev => {
      if (prev.includes(choice.targetId)) return prev
      return [...prev, choice.targetId]
    })
  }

  const handleReset = () => {
    const root = timelineMatrix[activeMovieId].rootNode
    setCurrentNodeId(root)
    setVisitedPath([root])
  }

  const isTerminalNode = currentNode.isEnding || !currentNode.choices || currentNode.choices.length === 0;

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex text-white">
      <div className="flex-shrink-0 z-30 h-full relative" style={{ width: '200px' }}>
        <Sidebar activeSection={-1} />
      </div>

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
            <div className="absolute w-[800px] h-[800px] rounded-full blur-[100px] bg-cyan-600/30 animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="relative w-[30rem] h-[30rem] rounded-full border-2 border-cyan-400/80 shadow-[0_0_100px_rgba(6,182,212,0.4)] animate-[spin_30s_linear_infinite] flex items-center justify-center">
              <div className="absolute w-[24rem] h-[24rem] rounded-full border-2 border-blue-400/40 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute w-[18rem] h-[18rem] rounded-full border-2 border-indigo-400/30 animate-[spin_10s_linear_infinite]" />
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
              <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-blue-300/50 to-transparent" />
            </div>
          </div>
        )}

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
                {isTerminalNode ? (
                  <button
                    onClick={handleReset}
                    className="w-full py-4 px-6 text-left rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-sm tracking-wide text-cyan-400 font-bold"
                  >
                    ⟲ Reset Timeline
                  </button>
                ) : (
                  currentNode.choices.map((choice, idx) => {
                    const isResetAction = choice.label.toLowerCase().includes('collapse') || choice.label.toLowerCase().includes('wake') || choice.label.toLowerCase().includes('restart');
                    return (
                      <button
                        key={idx}
                        onClick={() => isResetAction ? handleReset() : handleBranch(choice)}
                        className={`w-full py-4 px-6 text-left rounded-xl border transition-all text-sm tracking-wide font-medium ${isResetAction ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/30 text-white'}`}
                      >
                        {choice.label}
                      </button>
                    )
                  })
                )}
              </div>

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
            setCurrentNodeId(id)
            setShowMap(false)
          }}
        />
      )}
    </div>
  )
}
