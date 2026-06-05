import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineMatrix } from '../data/timelineMatrix'

export default function TimelinePanel({ onBranch }) {
  const [currentNodeId, setCurrentNodeId] = useState(timelineMatrix['donnie-darko'].rootNode)
  const currentNode = timelineMatrix['donnie-darko'].nodes[currentNodeId]

  return (
    <div className="w-full h-[600px] overflow-y-auto bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">{currentNode.title}</h2>
          <p className="text-gray-300 leading-relaxed mb-4">{currentNode.description}</p>

          <div className="flex flex-col gap-3 mt-4">
            {currentNode.isEnding ? (
              <button
                onClick={() => setCurrentNodeId(timelineMatrix['donnie-darko'].rootNode)}
                className="w-full py-3 px-6 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/30 transition-all text-sm tracking-wide text-cyan-400 font-medium"
              >
                ⟲ Reset Timeline
              </button>
            ) : (
              currentNode.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentNodeId(choice.targetId)
                    if (onBranch) {
                      const targetNodeData = timelineMatrix['donnie-darko'].nodes[choice.targetId]
                      const newNode = {
                        id: choice.targetId,
                        label: targetNodeData.title,
                        film: 'dd',
                        filmName: 'Donnie Darko',
                        type: targetNodeData.isEnding ? 'twist' : 'event',
                        size: targetNodeData.isEnding ? 6 : 4,
                        revealText: targetNodeData.description,
                        revealClassification: 'Timeline Branch',
                      }
                      const newLink = {
                        source: currentNodeId,
                        target: choice.targetId,
                        value: 0.7,
                        film: 'dd',
                      }
                      onBranch(newNode, newLink)
                    }
                  }}
                  className="w-full py-3 px-6 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/30 transition-all text-sm tracking-wide"
                >
                  {choice.label}
                </button>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
