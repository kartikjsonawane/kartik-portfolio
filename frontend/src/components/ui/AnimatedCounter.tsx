import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  to: number
  duration?: number
  suffix?: string
  className?: string
}

// Mercedes easing — fast start, slow finish
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function AnimatedCounter({ to, duration = 1600, suffix = '', className = '' }: Props) {
  const [value, setValue]   = useState(0)
  const ref                  = useRef<HTMLSpanElement>(null)
  const inView               = useInView(ref, { once: true, margin: '-5%' })
  const startTime            = useRef<number | null>(null)
  const rafRef               = useRef<number>(0)

  useEffect(() => {
    if (!inView) return
    startTime.current = null

    const tick = (now: number) => {
      if (!startTime.current) startTime.current = now
      const elapsed = now - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.round(easeOutExpo(progress) * to))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  )
}
