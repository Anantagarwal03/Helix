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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col p-8 overflow-y-auto"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    >
      <button 
        onClick={closeMap}
        className="fixed top-8 right-8 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl border border-white/10 transition-all text-sm tracking-wide z-10"
      >
        Close Map ✕
      </button>

      {/* Main Container - Items Start for left alignment of the trunk */}
      <div className="relative flex flex-col items-start space-y-24 mx-auto w-max py-20 mt-12 pr-32">
        {/* Vertical canonical trunk line */}
        <div className="absolute top-20 bottom-20 left-6 w-0.5 -ml-[1px] bg-white/10 z-0" />

        {canonicalPath.map((nodeId, idx) => {
          const node = timelineData.nodes[nodeId];
          const isCurrent = nodeId === currentNodeId;
          const isVisited = visitedPath.includes(nodeId);

          const tangentChoices = node.choices?.filter(c => timelineData.nodes[c.targetId]?.type === 'tangent');
          const visitedTangents = tangentChoices?.filter(c => visitedPath.includes(c.targetId));

          return (
            <div key={nodeId} className="flex flex-row items-center relative w-full">
              
              <div className="absolute right-full mr-8 w-48 text-right">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-cyan-400' : 'text-white/60'}`}>{node.title}</p>
              </div>

              {/* Canonical Node */}
              <div 
                onClick={() => isVisited && onNodeClick(nodeId)}
                className={`w-12 h-12 shrink-0 rounded-full border-2 flex items-center justify-center z-10 bg-black transition-all ${isVisited ? 'cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''} ${isCurrent ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : isVisited ? 'border-white/60' : 'border-white/20'}`}
              >
                <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-cyan-400' : isVisited ? 'bg-white/60' : 'bg-transparent'}`} />
              </div>

              {/* Tangent Branches (Horizontal Row) */}
              {visitedTangents?.map((tangent) => {
                const tangentPath = getTangentPath(tangent.targetId);
                return (
                  <div key={tangent.targetId} className="flex flex-row items-center">
                    {tangentPath.map((tNodeId, tIdx) => {
                      const tangentNode = timelineData.nodes[tNodeId];
                      const isTangentCurrent = tNodeId === currentNodeId;
                      const isLoopBack = tangentNode.choices?.some(c => c.targetId === timelineData.rootNode);

                      const distanceToTrunk = 24 + (tIdx + 1) * 96 + tIdx * 40 + 20;

                      return (
                        <div key={tNodeId} className="flex flex-row items-center">
                          {/* Horizontal Connector BEFORE the node */}
                          <div className="w-24 h-[2px] bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-0" />

                          {/* Tangent Node */}
                          <div className="relative flex justify-center items-center w-10 h-10">
                            {isLoopBack && (
                              <>
                                {/* Loop Back 'C' Curve */}
                                <div 
                                  className="absolute border-t-2 border-l-2 border-b-2 border-cyan-400 rounded-l-3xl pointer-events-none z-[-1]"
                                  style={{ 
                                    top: `-${idx * 144 - 20}px`, 
                                    left: `-${distanceToTrunk + 100}px`, 
                                    width: '100px', 
                                    height: `${idx * 144}px`,
                                    boxShadow: '-4px 0 10px rgba(34,211,238,0.2), inset 4px 0 10px rgba(34,211,238,0.2)'
                                  }}
                                />
                                {/* Loop Back Bottom Connector */}
                                <div 
                                  className="absolute bg-cyan-400 pointer-events-none z-[-1]"
                                  style={{ 
                                    top: '18px', 
                                    left: `-${distanceToTrunk}px`, 
                                    width: `${distanceToTrunk}px`, 
                                    height: '2px',
                                    boxShadow: '0 0 10px rgba(34,211,238,0.5)'
                                  }}
                                />
                              </>
                            )}
                            <div 
                              onClick={() => onNodeClick(tNodeId)}
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-black cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all ${isTangentCurrent ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-red-500/40'}`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${isTangentCurrent ? 'bg-red-500' : 'bg-red-500/40'}`} />
                            </div>
                            <div className="absolute top-full mt-3 w-32 text-center pointer-events-none">
                              <p className={`text-[10px] font-semibold tracking-wide ${isTangentCurrent ? 'text-red-500' : 'text-red-500/60'}`}>{tangentNode.title}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
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
