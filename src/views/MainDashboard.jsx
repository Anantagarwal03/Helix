import { useState, useRef, useCallback, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import OverviewTab    from './OverviewTab'
import GraphSection   from '../sections/GraphSection'
import LibrarySection from '../sections/LibrarySection'
import { playTransitionSound } from '../utils/audio'
import { MOVIES } from '../data/movies'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = ['overview', 'graph', 'library']

export default function MainDashboard() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const initialNode = searchParams.get('node')

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState(() => {
    if (location.state?.scrollToSection !== undefined) {
      return Number(location.state.scrollToSection)
    }
    return initialNode ? 1 : 0
  })

  const [movies, setMovies] = useState(MOVIES)

  const scrollerRef  = useRef(null)
  const sectionsRef  = useRef([])
  const stRef        = useRef(null)
  const isScrolling  = useRef(false)

  const scrollToSection = useCallback((index) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    
    isScrolling.current = true
    setActiveSection(index)
    playTransitionSound()
    
    gsap.to(scroller, {
      scrollTop: index * window.innerHeight,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => { isScrolling.current = false },
    })
  }, [])

  useEffect(() => {
    if (initialNode) {
      setTimeout(() => scrollToSection(1), 100)
    }
  }, [initialNode, scrollToSection])

  useEffect(() => {
    if (location.state?.scrollToSection !== undefined) {
      const targetSection = Number(location.state.scrollToSection)
      setActiveSection(targetSection)
      
      const animationTimeout = setTimeout(() => {
        if (typeof scrollToSection === 'function') {
          scrollToSection(targetSection)
        }
      }, 150)
      
      return () => clearTimeout(animationTimeout)
    }
  }, [location.state, scrollToSection])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    if (stRef.current) stRef.current.kill()

    let ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger:  scroller,
        scroller: scroller,
        start:    'top top',
        end:      () => `+=${(SECTIONS.length - 1) * window.innerHeight}`,
        onUpdate: self => {
          const idx = Math.round(self.progress * (SECTIONS.length - 1))
          if (!isScrolling.current) {
            setActiveSection(idx)
          }
        },
      })

      sectionsRef.current.forEach((el, i) => {
        if (!el) return
        const inner = el.querySelectorAll('[data-reveal]')
        ScrollTrigger.create({
          trigger:  el,
          scroller: scroller,
          start:    'top 60%',
          onEnter:  () => {
            gsap.fromTo(inner,
              { y: 22, opacity: 0, filter: 'blur(8px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)',
                duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true }
            )
          },
          onEnterBack: () => {
            gsap.fromTo(inner,
              { y: -14, opacity: 0, filter: 'blur(6px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)',
                duration: 0.55, stagger: 0.06, ease: 'power2.out', overwrite: true }
            )
          },
        })
      })
    }, scroller)

    return () => {
      ctx.revert()
      if (stRef.current) stRef.current.kill()
    }
  }, [])

  const setSectionRef = useCallback((el, i) => {
    sectionsRef.current[i] = el
  }, [])

  return (
    <div className="w-full h-screen overflow-hidden flex bg-[#030014] text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.04)_0%,transparent_70%)] pointer-events-none z-0" />
      
      <div className="flex-1 w-full h-full relative z-10 overflow-y-auto">
        {activeSection === 0 && <OverviewTab />}
        {activeSection === 1 && <GraphSection initialNode={initialNode} />}
        {activeSection === 2 && <LibrarySection movies={movies} />}
      </div>
    </div>
  )
}
