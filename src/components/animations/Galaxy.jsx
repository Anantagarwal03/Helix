/**
 * Galaxy — React Bits WebGL background
 * Source: https://reactbits.dev/backgrounds/galaxy
 * Adapted from: DavidHDev/react-bits (MIT)
 * Uses ogl (WebGL micro-library)
 */
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3  uResolution;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2  uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool  uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool  uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071,-0.7071,0.7071,0.7071)
#define PERIOD 3.0

float Hash21(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}

float tri(float x){ return abs(fract(x)*2.0-1.0); }
float tris(float x){ float t=fract(x); return 1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0)); }
float trisn(float x){ float t=fract(x); return 2.0*(1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0)))-1.0; }

vec3 hsv2rgb(vec3 c){
  vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);
  vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);
  return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y);
}

float Star(vec2 uv,float flare){
  float d=length(uv);
  float m=(0.05*uGlowIntensity)/d;
  float rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));
  m+=rays*flare*uGlowIntensity;
  uv*=MAT45;
  rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));
  m+=rays*0.3*flare*uGlowIntensity;
  m*=smoothstep(1.0,0.2,d);
  return m;
}

vec3 StarLayer(vec2 uv){
  vec3 col=vec3(0.0);
  vec2 gv=fract(uv)-0.5;
  vec2 id=floor(uv);
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      vec2 offs=vec2(float(x),float(y));
      vec2 si=id+offs;
      float seed=Hash21(si);
      float size=fract(seed*345.32);
      float gloss=tri(uStarSpeed/(PERIOD*seed+1.0));
      float flare=smoothstep(0.9,1.0,size)*gloss;
      float red=smoothstep(STAR_COLOR_CUTOFF,1.0,Hash21(si+1.0))+STAR_COLOR_CUTOFF;
      float blu=smoothstep(STAR_COLOR_CUTOFF,1.0,Hash21(si+3.0))+STAR_COLOR_CUTOFF;
      float grn=min(red,blu)*seed;
      vec3 base=vec3(red,grn,blu);
      float hue=atan(base.g-base.r,base.b-base.r)/(2.0*3.14159)+0.5;
      hue=fract(hue+uHueShift/360.0);
      float sat=length(base-vec3(dot(base,vec3(0.299,0.587,0.114))))*uSaturation;
      float val=max(max(base.r,base.g),base.b);
      base=hsv2rgb(vec3(hue,sat,val));
      float twinkle=uTwinkleIntensity>0.0
        ?(1.0-uTwinkleIntensity)+uTwinkleIntensity*tris(seed*34.0+uTime*uSpeed)
        :1.0;
      vec2 pad=vec2(trisn(seed*34.0+uTime*uSpeed/10.0),trisn(seed*38.0+uTime*uSpeed/10.0))*0.5;
      vec2 j=gv-offs-(vec2(fract(seed*234.0),fract(seed*675.0))-0.5)*0.85+pad;

      // Mouse repulsion
      if(uMouseRepulsion&&uMouseActiveFactor>0.0){
        vec2 screenUV=vUv*2.0-1.0;
        screenUV.x*=uResolution.x/uResolution.y;
        vec2 starWorld=uv;
        vec2 mouseWorld=uMouse;
        vec2 toStar=starWorld-mouseWorld;
        float dist=length(toStar);
        float repulse=uRepulsionStrength*uMouseActiveFactor*smoothstep(2.0,0.0,dist)/max(dist*dist,0.001);
        j+=normalize(toStar)*repulse*0.1;
      }

      float star=Star(j,flare)*size*twinkle;
      col+=star*base;
    }
  }
  return col;
}

void main(){
  vec2 uv=(vUv-0.5)*vec2(uResolution.x/uResolution.y,1.0)*uDensity;
  vec3 col=vec3(0.0);
  float t=uTime*uSpeed;

  for(float i=0.0;i<NUM_LAYER;i++){
    float depth=fract(i/NUM_LAYER);
    float scale=mix(0.5,1.5,depth);
    float fade=depth*smoothstep(1.0,0.9,depth);
    col+=StarLayer(uv*scale+i*453.2)*fade;
  }

  if(uTransparent){
    float brightness=dot(col,vec3(0.299,0.587,0.114));
    gl_FragColor=vec4(col,brightness*3.0);
  } else {
    gl_FragColor=vec4(col,1.0);
  }
}
`

const Galaxy = ({
  mouseInteraction    = true,
  mouseRepulsion      = true,
  repulsionStrength   = 0.5,
  density             = 1.5,
  speed               = 0.3,
  starSpeed           = 1.0,
  glowIntensity       = 0.8,
  hueShift            = 260,       // 260 = cosmic violet/purple range
  saturation          = 1.4,
  twinkleIntensity    = 0.6,
  transparent         = true,      // let obsidian bg show through
  className           = '',
  style               = {},
}) => {
  const containerRef  = useRef(null)
  const rafRef        = useRef(null)
  const mouseRef      = useRef({ x: 0.5, y: 0.5, active: 0 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    Object.assign(gl.canvas.style, { position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' })
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    const program  = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:               { value: 0 },
        uResolution:         { value: [container.clientWidth, container.clientHeight, 1] },
        uStarSpeed:          { value: 0 },
        uDensity:            { value: density },
        uHueShift:           { value: hueShift },
        uSpeed:              { value: speed },
        uMouse:              { value: [0.5, 0.5] },
        uGlowIntensity:      { value: glowIntensity },
        uSaturation:         { value: saturation },
        uMouseRepulsion:     { value: mouseRepulsion },
        uTwinkleIntensity:   { value: twinkleIntensity },
        uRepulsionStrength:  { value: repulsionStrength },
        uMouseActiveFactor:  { value: 0 },
        uAutoCenterRepulsion:{ value: 0 },
        uTransparent:        { value: transparent },
      },
      transparent: true,
      depthTest: false,
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      program.uniforms.uResolution.value = [container.clientWidth, container.clientHeight, 1]
    }
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    const onMouseMove = e => {
      if (!mouseInteraction) return
      const rect = container.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      }
      mouseRef.current.active = 1
    }
    window.addEventListener('mousemove', onMouseMove)

    let elapsed = 0
    let last    = performance.now()
    const loop  = () => {
      rafRef.current = requestAnimationFrame(loop)
      const now   = performance.now()
      const delta = (now - last) / 1000
      last        = now
      elapsed    += delta

      // Smooth mouse follow
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.06

      program.uniforms.uTime.value              = elapsed
      program.uniforms.uStarSpeed.value         = elapsed * starSpeed
      program.uniforms.uMouse.value             = [mouseRef.current.x, mouseRef.current.y]
      program.uniforms.uMouseActiveFactor.value = mouseRef.current.active

      renderer.render({ scene: mesh })
    }
    loop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      try { container.removeChild(gl.canvas) } catch(_) {}
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [mouseInteraction, mouseRepulsion, repulsionStrength, density, speed, starSpeed,
      glowIntensity, hueShift, saturation, twinkleIntensity, transparent])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position:'absolute', inset:0, overflow:'hidden', ...style }}
    />
  )
}

export default Galaxy
