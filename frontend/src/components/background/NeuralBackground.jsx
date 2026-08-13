import { useEffect, useRef } from 'react'
import { useThemeStore } from '@store/themeStore'

const NODE_COUNT = 48
const CONNECT_DIST = 140

function createNodes(width, height) {
  return Array.from({ length: NODE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: 1.2 + Math.random() * 1.8,
    pulse: Math.random() * Math.PI * 2,
    hue: Math.random() > 0.5 ? 195 : 270,
  }))
}

export function NeuralBackground() {
  const canvasRef = useRef(null)
  const nodesRef = useRef([])
  const frameRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(width, height)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const isDark = theme === 'dark'
      const nodes = nodesRef.current

      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * (isDark ? 0.35 : 0.25)
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `hsla(${a.hue}, 90%, 65%, ${alpha})`)
            grad.addColorStop(1, `hsla(${b.hue}, 90%, 65%, ${alpha})`)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      for (const node of nodes) {
        const glow = 0.5 + Math.sin(node.pulse) * 0.3
        const alpha = isDark ? 0.7 * glow : 0.55 * glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * glow, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${node.hue}, 95%, 70%, ${alpha})`
        ctx.shadowColor = `hsla(${node.hue}, 100%, 70%, 0.8)`
        ctx.shadowBlur = isDark ? 12 : 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
