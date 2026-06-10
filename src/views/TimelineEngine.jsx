import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineMatrix } from '../data/timelineMatrix'
import TimelineEffects from '../components/TimelineEffects'
import TimelineMapOverlay from '../components/TimelineMapOverlay'

import { MOVIES } from '../data/movies'

export default function TimelineEngine() {
  const [activeMovieId, setActiveMovieId] = useState('donnie-darko');
  const movies = MOVIES;

  // Safely fallback onto a valid string key if timelineMatrix lookup fails
  const targetMatrix = timelineMatrix[activeMovieId] || {
    rootNode: "start",
    nodes: {
      start: {
        title: "Syncing Narrative Vault",
        description: "The historical event log structure for this cinematic selection is currently generating inside the system database registry.",
        choices: []
      }
    }
  };

  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [visitedPath, setVisitedPath] = useState(["start"]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const initialRoot = timelineMatrix[activeMovieId]?.rootNode || "start";
    setCurrentNodeId(initialRoot);
    setVisitedPath([initialRoot]);
  }, [activeMovieId]);

  const currentNode = targetMatrix.nodes[currentNodeId] || targetMatrix.nodes["start"] || { title: "Archiving...", description: "Loading registry streams...", choices: [] };
  const choicesList = currentNode.choices || [];
  const isTerminalNode = currentNode.isEnding || choicesList.length === 0;

  const handleBranch = (choice) => {
    setCurrentNodeId(choice.targetId)
    setVisitedPath(prev => {
      if (prev.includes(choice.targetId)) return prev
      return [...prev, choice.targetId]
    })
  }

  const handleReset = () => {
    const initialRoot = timelineMatrix[activeMovieId]?.rootNode || "start";
    setCurrentNodeId(initialRoot);
    setVisitedPath([initialRoot]);
  }



  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden w-full">
      {currentNode.type === 'tangent' ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <TimelineEffects effect={currentNode.effect} tangentDepth={currentNode.tangentDepth || 1} />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#020205] overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="absolute w-[800px] h-[800px] rounded-full blur-[100px] bg-cyan-600/30 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="relative w-[30rem] h-[30rem] rounded-full border-2 border-cyan-400/80 shadow-[0_0_100px_rgba(6,182,212,0.4)] animate-[spin_30s_linear_infinite] flex items-center justify-center">
            <div className="absolute w-[24rem] h-[24rem] rounded-full border-2 border-blue-400/40 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute w-[18rem] h-[18rem] rounded-full border-2 border-indigo-400/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-blue-300/50 to-transparent" />
          </div>
        </div>
      )}

      <header className="mb-10 relative z-10 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-serif tracking-widest uppercase mb-2 drop-shadow-lg">
            Labyrinth <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Timelines</span>
          </h1>
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase">Interactive timeline fracture and variance explorer</p>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {movies.map(m => (
            <button key={m.id} onClick={() => setActiveMovieId(m.id)} className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${activeMovieId === m.id ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{m.title}</button>
          ))}
        </div>
      </header>

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
                choicesList.map((choice, idx) => {
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

      {showMap && (
        <TimelineMapOverlay 
          timelineData={targetMatrix}
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
