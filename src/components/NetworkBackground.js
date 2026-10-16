import React, { useEffect, useRef } from 'react'

// A request network on black: nodes on a loose grid, packets running along the links like requests
// through middleware, and everything near the cursor lit red. Also drives the cursor spotlight
// (--mx / --my on the root). Static when the visitor prefers reduced motion.
export default function NetworkBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: -9999, y: -9999 }
    let W, H, dpr, nodes = [], links = [], packets = [], raf = 0

    const spawn = () => ({ l: links[(Math.random() * links.length) | 0], t: Math.random(), v: 0.002 + Math.random() * 0.006, dir: Math.random() < 0.5 })

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.width = window.innerWidth * dpr
      H = cv.height = window.innerHeight * dpr
      const step = 96 * dpr
      nodes = []
      for (let y = step / 2; y < H + step; y += step)
        for (let x = step / 2; x < W + step; x += step)
          nodes.push({ x: x + (Math.random() - 0.5) * step * 0.7, y: y + (Math.random() - 0.5) * step * 0.7, p: Math.random() * 6.28 })
      links = []
      nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < step * 1.25) links.push([a, b]) }))
      packets = Array.from({ length: Math.round(links.length / 9) }, spawn)
    }

    function frame(time) {
      ctx.clearRect(0, 0, W, H)
      const mx = mouse.x * dpr, my = mouse.y * dpr, R = 220 * dpr
      for (const [a, b] of links) {
        const k = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my) / R)
        ctx.strokeStyle = k > 0 ? `rgba(245,30,36,${0.08 + k * 0.45})` : 'rgba(255,255,255,.045)'
        ctx.lineWidth = dpr * (k > 0 ? 1 : 0.6)
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }
      for (const n of nodes) {
        const k = Math.max(0, 1 - Math.hypot(n.x - mx, n.y - my) / R), tw = 0.5 + 0.5 * Math.sin(time / 900 + n.p)
        ctx.fillStyle = k > 0 ? `rgba(255,90,95,${0.35 + k * 0.65})` : `rgba(255,255,255,${0.08 + tw * 0.1})`
        ctx.beginPath(); ctx.arc(n.x, n.y, dpr * (1.1 + k * 2.2), 0, 6.28); ctx.fill()
      }
      for (const p of packets) {
        p.t += reduce ? 0 : p.v
        if (p.t >= 1) Object.assign(p, spawn(), { t: 0 })
        const [a, b] = p.dir ? p.l : [p.l[1], p.l[0]]
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7 * dpr)
        g.addColorStop(0, 'rgba(255,120,120,.95)'); g.addColorStop(1, 'rgba(245,30,36,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7 * dpr, 0, 6.28); ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
      if (reduce) frame(0)
    }
    const onResize = () => { build(); if (reduce) frame(0) }

    build()
    raf = requestAnimationFrame(frame)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas className='net' ref={canvasRef} aria-hidden='true' />
      <div className='spot' aria-hidden='true' />
    </>
  )
}
