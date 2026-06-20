import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -999, y: -999 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', move, { passive: true })

    const tick = () => {
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
        willChange: 'transform',
        transition: 'transform 0.12s linear',
      }}
    />
  )
}
