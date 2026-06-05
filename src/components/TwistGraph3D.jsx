import { useEffect, useRef, useState, useCallback } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'

const NODE_COLOR = {
  film: '#fbbf24',
  character: '#00f2fe',
  event: '#8b5cf6',
  twist: '#ec4899',
}

const GRAPH_DATA = {
  nodes: [
    { id: 'ss-film', label: 'The Sixth Sense', film: 'ss', filmName: 'The Sixth Sense', type: 'film', size: 8,
      revealText: 'Not every gift is a blessing.',
      revealSubtext: 'Every clue was present from the opening frame. The cold air. The ring. The silence of the living.',
      revealClassification: 'Film Hub' },
    { id: 'ss-malcolm', label: 'Malcolm Crowe', film: 'ss', filmName: 'The Sixth Sense', type: 'character', size: 5,
      revealText: 'Dr. Malcolm Crowe is actually a ghost. He was shot in the opening scene and has been dead the entire movie.',
      revealSubtext: 'Every session with Cole was his desperate attempt to reconcile his final failure — from the other side of death.',
      revealClassification: 'Protagonist' },
    { id: 'ss-cole', label: 'Cole Sear', film: 'ss', filmName: 'The Sixth Sense', type: 'character', size: 5,
      revealText: 'I see dead people. They walk around like regular people.',
      revealSubtext: 'Cole alone could see Malcolm for what he truly was — a lost soul who needed to be told it was okay to leave.',
      revealClassification: 'Witness' },
    { id: 'ss-anna', label: 'Anna Crowe', film: 'ss', filmName: 'The Sixth Sense', type: 'character', size: 3.5,
      revealText: 'She has been grieving alone since the first scene.',
      revealSubtext: 'Her distance from Malcolm was not coldness — it was the silence of a widow who could not see or hear her husband.',
      revealClassification: 'Survivor' },
    { id: 'ss-ghost', label: 'Vincent Grey', film: 'ss', filmName: 'The Sixth Sense', type: 'character', size: 3,
      revealText: 'Patient Zero. The gunshot that started the ghost story.',
      revealSubtext: 'Malcolm\'s former patient whose unresolved pain became the inciting wound that killed the doctor.',
      revealClassification: 'Catalyst' },
    { id: 'ss-e1', label: 'I See Dead People', film: 'ss', filmName: 'The Sixth Sense', type: 'event', size: 4,
      revealText: 'Cole\'s confession in the church — spoken to one of them.',
      revealSubtext: 'The emotional axis of the film. Neither Cole nor the audience yet understands he is confessing to a dead man.',
      revealClassification: 'Revelation Event' },
    { id: 'ss-e2', label: 'Shooting Scene', film: 'ss', filmName: 'The Sixth Sense', type: 'event', size: 3.5,
      revealText: 'The night the timeline fractured. Malcolm dies here.',
      revealSubtext: 'Vincent breaks into the Crowe home and fires twice. Malcolm dies before the title card. Everything after is aftermath.',
      revealClassification: 'Inciting Incident' },
    { id: 'ss-twist', label: 'Identity Reveal', film: 'ss', filmName: 'The Sixth Sense', type: 'twist', size: 7,
      revealText: 'Dr. Malcolm Crowe is actually a ghost. He was shot in the opening scene and has been dead the entire movie.',
      revealSubtext: 'The ring on Anna\'s bedside table. The cold breath at dinner. No living character ever looked directly at him. Every clue was hidden in plain sight across 107 minutes.',
      revealClassification: 'Core Twist' },

    { id: 'dd-film', label: 'Donnie Darko', film: 'dd', filmName: 'Donnie Darko', type: 'film', size: 8,
      revealText: '28 days, 6 hours, 42 minutes, 12 seconds.',
      revealSubtext: 'The Tangent Universe has a lifespan. Unless the artifact is returned, it collapses and destroys the Primary Universe.',
      revealClassification: 'Film Hub' },
    { id: 'dd-donnie', label: 'Donnie Darko', film: 'dd', filmName: 'Donnie Darko', type: 'character', size: 5,
      revealText: 'The primary universe is stable because Donnie stays in his bedroom, allowing the jet engine to crash down and kill him, saving the timeline.',
      revealSubtext: 'He chose death knowingly and with joy — laughing in his bedroom as the engine fell. Everyone he saved will never remember his name.',
      revealClassification: 'The Receiver' },
    { id: 'dd-frank', label: 'Frank (The Rabbit)', film: 'dd', filmName: 'Donnie Darko', type: 'character', size: 5,
      revealText: 'Frank is already dead — killed on Halloween by Donnie himself.',
      revealSubtext: 'The rabbit suit conceals Donnie\'s sister\'s boyfriend. He travels back from death to guide Donnie toward the only correct decision.',
      revealClassification: 'Manipulated Dead' },
    { id: 'dd-gretchen', label: 'Gretchen Ross', film: 'dd', filmName: 'Donnie Darko', type: 'character', size: 3.5,
      revealText: 'She waves at Donnie\'s mother — a phantom memory from the erased timeline.',
      revealSubtext: 'In the Primary Universe they never met. Yet she somehow grieves a boy whose name she should not know.',
      revealClassification: 'Living Receiver' },
    { id: 'dd-sparrow', label: 'Roberta Sparrow', film: 'dd', filmName: 'Donnie Darko', type: 'character', size: 3,
      revealText: 'She wrote the book that explains how to collapse the universe.',
      revealSubtext: 'Waiting at her mailbox for decades for a letter she already wrote — to herself — about the end of time.',
      revealClassification: 'Keeper of the Key' },
    { id: 'dd-e1', label: 'Engine Falls on House', film: 'dd', filmName: 'Donnie Darko', type: 'event', size: 4.5,
      revealText: 'The artifact enters the Primary Universe. The Tangent Universe is born.',
      revealSubtext: 'A jet engine from the future crashes into Donnie\'s bedroom. Frank led him away before it struck — but it should have killed him.',
      revealClassification: 'Inciting Temporal Event' },
    { id: 'dd-e2', label: 'Time Portal Opens', film: 'dd', filmName: 'Donnie Darko', type: 'event', size: 4,
      revealText: 'Donnie can see the liquid-metal paths of the immediate future.',
      revealSubtext: 'Time spears project from the chests of every person around him — showing where they will walk in the next few seconds. He is the only one who sees this.',
      revealClassification: 'Temporal Collapse Warning' },
    { id: 'dd-twist', label: 'Tangent Universe', film: 'dd', filmName: 'Donnie Darko', type: 'twist', size: 7,
      revealText: 'The primary universe is stable because Donnie stays in his bedroom, allowing the jet engine to crash down and kill him, saving the timeline.',
      revealSubtext: 'He sent the engine back through time, collapsing the 28-day loop. He died laughing. No one in the corrected timeline will ever know what he sacrificed.',
      revealClassification: 'Core Twist' },

    { id: 'z-film', label: 'Zodiac', film: 'z', filmName: 'Zodiac', type: 'film', size: 8,
      revealText: 'The killer was never convicted. The case remains officially open.',
      revealSubtext: 'Fincher\'s film argues the truth is knowable — but the institutions built to deliver justice refused to see it.',
      revealClassification: 'Film Hub' },
    { id: 'z-gray', label: 'Robert Graysmith', film: 'z', filmName: 'Zodiac', type: 'character', size: 5,
      revealText: 'He gave twenty years to a case that refused to close.',
      revealSubtext: 'A cartoonist consumed by a puzzle that cost him his marriage, career, and peace of mind — in pursuit of a killer the courts never touched.',
      revealClassification: 'The Obsessed' },
    { id: 'z-toschi', label: 'Det. Toschi', film: 'z', filmName: 'Zodiac', type: 'character', size: 4,
      revealText: 'He knew. He had no proof the system would accept.',
      revealSubtext: 'Dave Toschi was taunted by name in the ciphers. He followed every lead, closed every door. The courts still could not act.',
      revealClassification: 'The Proceduralist' },
    { id: 'z-allen', label: 'Arthur Leigh Allen', film: 'z', filmName: 'Zodiac', type: 'character', size: 4,
      revealText: 'All evidence pointed here. None of it was legally sufficient.',
      revealSubtext: 'The watch. The shoes. The typewriter. The stated desire to hunt humans. Cleared by DNA — though experts have since disputed that result.',
      revealClassification: 'Prime Suspect' },
    { id: 'z-e1', label: 'Cipher Published', film: 'z', filmName: 'Zodiac', type: 'event', size: 4,
      revealText: 'The Zodiac wrote to the press because he needed to be known.',
      revealSubtext: 'He demanded front-page publication or he would kill again. He set the rules. The investigators had to play by them.',
      revealClassification: 'Escalation Event' },
    { id: 'z-e2', label: 'Lake Berryessa Attack', film: 'z', filmName: 'Zodiac', type: 'event', size: 3.5,
      revealText: 'He arrived with rope pre-cut to identical lengths. He was prepared.',
      revealSubtext: 'The most theatrically staged of all the attacks. A survivor gave the best physical description — which matched Allen exactly.',
      revealClassification: 'Defining Attack' },
    { id: 'z-twist', label: 'Unreliable Reality', film: 'z', filmName: 'Zodiac', type: 'twist', size: 7,
      revealText: 'The primary suspect Arthur Leigh Allen is never definitively caught, leaving the cipher open and the case hauntingly unresolved.',
      revealSubtext: 'Fincher\'s true horror: in a world of perfect obsession, named suspects, and mountains of evidence — the system still cannot convict. The Zodiac\'s identity is officially unknown.',
      revealClassification: 'Core Twist' },
  ],

  links: [
    { source: 'ss-film', target: 'ss-malcolm', value: 0.8, film: 'ss' },
    { source: 'ss-film', target: 'ss-cole', value: 0.8, film: 'ss' },
    { source: 'ss-film', target: 'ss-anna', value: 0.5, film: 'ss' },
    { source: 'ss-malcolm', target: 'ss-cole', value: 0.9, film: 'ss' },
    { source: 'ss-malcolm', target: 'ss-e2', value: 0.7, film: 'ss' },
    { source: 'ss-ghost', target: 'ss-e2', value: 0.8, film: 'ss' },
    { source: 'ss-cole', target: 'ss-e1', value: 0.9, film: 'ss' },
    { source: 'ss-e1', target: 'ss-twist', value: 1.0, film: 'ss' },
    { source: 'ss-e2', target: 'ss-twist', value: 0.8, film: 'ss' },
    { source: 'ss-malcolm', target: 'ss-twist', value: 1.0, film: 'ss' },

    { source: 'dd-film', target: 'dd-donnie', value: 0.8, film: 'dd' },
    { source: 'dd-film', target: 'dd-frank', value: 0.8, film: 'dd' },
    { source: 'dd-donnie', target: 'dd-frank', value: 0.9, film: 'dd' },
    { source: 'dd-donnie', target: 'dd-gretchen', value: 0.6, film: 'dd' },
    { source: 'dd-sparrow', target: 'dd-donnie', value: 0.5, film: 'dd' },
    { source: 'dd-frank', target: 'dd-e1', value: 0.9, film: 'dd' },
    { source: 'dd-donnie', target: 'dd-e1', value: 0.8, film: 'dd' },
    { source: 'dd-e1', target: 'dd-e2', value: 0.9, film: 'dd' },
    { source: 'dd-e2', target: 'dd-twist', value: 1.0, film: 'dd' },
    { source: 'dd-frank', target: 'dd-twist', value: 0.9, film: 'dd' },

    { source: 'z-film', target: 'z-gray', value: 0.8, film: 'z' },
    { source: 'z-film', target: 'z-toschi', value: 0.7, film: 'z' },
    { source: 'z-gray', target: 'z-toschi', value: 0.6, film: 'z' },
    { source: 'z-allen', target: 'z-e2', value: 0.8, film: 'z' },
    { source: 'z-gray', target: 'z-e1', value: 0.9, film: 'z' },
    { source: 'z-e1', target: 'z-e2', value: 0.7, film: 'z' },
    { source: 'z-e1', target: 'z-twist', value: 1.0, film: 'z' },
    { source: 'z-e2', target: 'z-twist', value: 0.8, film: 'z' },
    { source: 'z-gray', target: 'z-twist', value: 0.9, film: 'z' },

    { source: 'ss-twist', target: 'dd-twist', value: 0.22, isBridge: true },
    { source: 'dd-twist', target: 'z-twist', value: 0.18, isBridge: true },
    { source: 'ss-twist', target: 'z-twist', value: 0.16, isBridge: true },
  ],
}

const nodeColor = node => NODE_COLOR[node.type] || '#ffffff'

const buildNodeObject = node => {
  const color = nodeColor(node)
  const radius = node.size || 4
  const group = new THREE.Group()

  const coreMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: node.type === 'twist' ? 1.6 : 1.1,
    shininess: 120,
    transparent: true,
    opacity: 0.92,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), coreMat))

  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: node.type === 'film' ? 0.12 : 0.07,
    side: THREE.BackSide,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 2.6, 12, 12), haloMat))

  if (node.type === 'film') {
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.28 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 2, 0.5, 8, 32), ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    const sprite = new SpriteText(node.label)
    sprite.color = '#ffffff'
    sprite.textHeight = 2.8
    sprite.fontFamily = 'Inter, system-ui, sans-serif'
    sprite.fontWeight = '600'
    sprite.backgroundColor = 'rgba(3,0,20,0.72)'
    sprite.borderColor = color + '55'
    sprite.borderWidth = 0.6
    sprite.borderRadius = 4
    sprite.padding = [2, 5]
    sprite.position.y = radius * 3.2 + 6
    group.add(sprite)
  }

  return group
}

const linkColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.07)'
  const c = { ss: 'rgba(0,242,254,0.28)', dd: 'rgba(139,92,246,0.28)', z: 'rgba(236,72,153,0.28)' }
  return c[link.film] || 'rgba(255,255,255,0.15)'
}

const particleColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.2)'
  const c = { ss: '#00f2fe', dd: '#8b5cf6', z: '#ec4899' }
  return c[link.film] || '#ffffff'
}

const nodeLabel = node => {
  const color = NODE_COLOR[node.type] || '#fff'
  const canClick = node.type !== 'film'
  return `<div style="font-family:Inter,sans-serif;font-size:12px;color:#fff;background:rgba(3,0,20,0.92);border:1px solid ${color}28;border-radius:10px;padding:8px 12px;max-width:210px;box-shadow:0 4px 24px rgba(0,0,0,0.65)">
    <div style="font-weight:600;margin-bottom:3px">${node.label}</div>
    <div style="color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:${canClick ? '6px' : '0'}">${node.type}${node.filmName ? ' · ' + node.filmName : ''}</div>
    ${canClick ? `<div style="color:${color};font-size:10px;font-family:monospace;opacity:0.7">Click to reveal ↗</div>` : ''}
  </div>`
}

const TwistGraph3D = ({ onMount, onNodeClick: onNodeClickProp, initialNode }) => {
  const wrapperRef = useRef(null)
  const graphRef = useRef(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setDims({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleEngineStop = useCallback(() => {
    if (!graphRef.current || ready) return
    const scene = graphRef.current.scene()
    scene.add(new THREE.AmbientLight(0x1a0033, 2.5))
    const cl = new THREE.PointLight(0x00f2fe, 2.5, 200); cl.position.set(60, 80, 60); scene.add(cl)
    const vl = new THREE.PointLight(0x7c3aed, 2.0, 200); vl.position.set(-80, -40, -60); scene.add(vl)
    const pl = new THREE.PointLight(0xec4899, 1.5, 160); pl.position.set(0, -80, 80); scene.add(pl)
    graphRef.current.cameraPosition({ x: 0, y: 0, z: 340 }, { x: 0, y: 0, z: 0 }, 1200)
    setReady(true)
    if (onMount) onMount()
  }, [ready, onMount])

  useEffect(() => {
    if (ready && initialNode && graphRef.current) {
      setTimeout(() => {
        const node = GRAPH_DATA.nodes.find(n => n.id === initialNode)
        if (node) {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            1200
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }
      }, 500)
    }
  }, [ready, initialNode, onNodeClickProp])

  const pan = useCallback((direction) => {
    if (!graphRef.current) return
    const cam = graphRef.current.cameraPosition()
    const controls = graphRef.current.controls()
    const target = controls ? controls.target : { x: 0, y: 0, z: 0 }
    const step = 20
    const delta = direction === 'left' ? -step : step
    graphRef.current.cameraPosition(
      { x: cam.x + delta, y: cam.y, z: cam.z },
      { x: target.x + delta, y: target.y, z: target.z },
      200
    )
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        pan('left')
      } else if (e.key === 'ArrowRight') {
        pan('right')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pan])

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-cyan-400/30 border-t-cyan-400"
              style={{ animation: 'spin 1s linear infinite' }} />
            <span className="text-[11px] font-mono text-slate-600">Initializing graph engine…</span>
          </div>
        </div>
      )}

      {ready && (
        <>
          <button
            onClick={() => pan('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
              <path d="M9 12L4 7.5L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => pan('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
              <path d="M6 3L11 7.5L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <ForceGraph3D
        ref={graphRef}
        width={dims.w}
        height={dims.h}
        graphData={GRAPH_DATA}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel={nodeLabel}
        nodeColor={nodeColor}
        nodeRelSize={1}
        nodeThreeObject={buildNodeObject}
        nodeThreeObjectExtend={false}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => link.isBridge ? 0.3 : 0.6}
        linkDirectionalParticles={link => link.isBridge ? 0 : 3}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={particleColor}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.25}
        warmupTicks={120}
        cooldownTicks={0}
        onEngineStop={handleEngineStop}
        onNodeHover={node => { if (wrapperRef.current) wrapperRef.current.style.cursor = node ? 'pointer' : 'grab' }}
        onNodeClick={node => {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current?.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            800,
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }}
        rendererConfig={{ antialias: true, alpha: true }}
        showNavInfo={false}
      />
    </div>
  )
}

export default TwistGraph3D
