import { motion } from 'framer-motion'

export default function TimelineMapOverlay({ timelineData, currentNodeId, visitedPath, closeMap, onNodeClick }) {
  const getCanonicalPath = () => {
    const path = [];
    let curr = timelineData.rootNode;
    while (curr) {
      const node = timelineData.nodes[curr];
      if (node && node.type === 'canonical') {
        path.push(curr);
      }
      const nextChoice = node.choices?.find(c => timelineData.nodes[c.targetId]?.type === 'canonical');
      curr = nextChoice ? nextChoice.targetId : null;
    }
    return path;
  }

  const getTangentPath = (startTangentId) => {
    const path = [];
    let curr = startTangentId;
    while (curr && visitedPath.includes(curr)) {
      const node = timelineData.nodes[curr];
      if (node && node.type === 'tangent') {
        path.push(curr);
        const nextChoice = node.choices?.find(c => timelineData.nodes[c.targetId]?.type === 'tangent');
        curr = nextChoice ? nextChoice.targetId : null;
      } else {
        break;
      }
    }
    return path;
  }

  const canonicalPath = getCanonicalPath();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-8 overflow-y-auto"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 40px 40px, 40px 40px'
      }}
    >
      <button 
        onClick={closeMap}
        className="fixed top-8 right-8 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl border border-white/10 transition-all text-sm tracking-wide z-20"
      >
        Close Map ✕
      </button>

      {/* Main Container */}
      <div className="relative flex flex-col items-start space-y-24 mx-auto w-max py-20 mt-12 pr-48 min-h-screen">
        
        {/* Main Trunk Line - perfectly centered on the canonical nodes (60px from the left of the min-w-[120px] container) */}
        <div className="absolute top-20 bottom-20 left-[60px] w-[2px] bg-white/20 z-0" />

        {canonicalPath.map((nodeId) => {
          const node = timelineData.nodes[nodeId];
          const isCurrent = nodeId === currentNodeId;
          const isVisited = visitedPath.includes(nodeId);

          const tangentChoices = node.choices?.filter(c => timelineData.nodes[c.targetId]?.type === 'tangent');
          const hasTangent = tangentChoices && tangentChoices.length > 0;
          const visitedTangents = tangentChoices?.filter(c => visitedPath.includes(c.targetId));

          return (
            <div key={nodeId} className={`flex flex-row items-center relative w-full transition-opacity duration-500 ${!isVisited ? 'opacity-50' : 'opacity-100'}`}>
              
              {/* Canonical Node Container */}
              <div className="flex flex-col items-center justify-center relative min-w-[120px]">
                {/* Divergence Indicator Ring */}
                {hasTangent && (
                  <div className="absolute top-[24px] left-[50%] -translate-x-1/2 -translate-y-1/2 border border-red-500/30 rounded-full pointer-events-none w-[60px] h-[60px]" />
                )}
                
                <div 
                  onClick={() => isVisited && onNodeClick(nodeId)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 bg-black transition-all ${isVisited ? 'cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''} ${isCurrent ? 'border-cyan-400 shadow-[0_0_15px_cyan]' : isVisited ? 'border-white/60' : 'border-white/20'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-cyan-400' : isVisited ? 'bg-white/60' : 'bg-transparent'}`} />
                </div>

                {/* Locked Text Label */}
                <div className="absolute top-12 mt-2 text-xs text-slate-400 whitespace-nowrap text-center px-2">
                  <p className={`font-semibold ${isCurrent ? 'text-cyan-400' : ''}`}>{node.title}</p>
                </div>
              </div>

              {/* Tangent Branches (Strict Horizontal Flex) */}
              {visitedTangents?.map((tangent) => {
                const tangentPath = getTangentPath(tangent.targetId);
                return (
                  <div key={tangent.targetId} className="flex flex-row items-center">
                    {/* Initial Connector */}
                    <div className="w-12 h-[2px] bg-red-500 shadow-[0_0_8px_red] shrink-0" />
                    
                    <div className="flex flex-row items-center">
                      {tangentPath.map((tNodeId, tIdx) => {
                        const tangentNode = timelineData.nodes[tNodeId];
                        const isTangentCurrent = tNodeId === currentNodeId;

                        return (
                          <div key={tNodeId} className="flex flex-row items-center">
                            {/* Inner Connectors */}
                            {tIdx > 0 && <div className="w-12 h-[2px] bg-red-500 shadow-[0_0_8px_red] shrink-0 mx-2" />}

                            {/* Tangent Node Container */}
                            <div className="flex flex-col items-center justify-center relative min-w-[120px]">
                              <div 
                                onClick={() => onNodeClick(tNodeId)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-black cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all ${isTangentCurrent ? 'border-red-500 shadow-[0_0_15px_red]' : 'border-red-500/40'}`}
                              >
                                <div className={`w-2.5 h-2.5 rounded-full ${isTangentCurrent ? 'bg-red-500' : 'bg-red-500/40'}`} />
                              </div>
                              
                              {/* Locked Text Label */}
                              <div className="absolute top-10 whitespace-nowrap text-xs text-center px-2 mt-2">
                                <p className={`font-semibold tracking-wide ${isTangentCurrent ? 'text-red-500' : 'text-red-500/60'}`}>{tangentNode.title}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
