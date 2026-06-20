import { useRef, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  strength?: number
}

export default function MagneticCard({ children, className = '', strength = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springCfg = { stiffness: 200, damping: 20, mass: 0.5 }
  const x = useSpring(rawX, springCfg)
  const y = useSpring(rawY, springCfg)

  const rotateX = useTransform(y, [-1, 1], [strength, -strength])
  const rotateY = useTransform(x, [-1, 1], [-strength, strength])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    rawX.set(nx)
    rawY.set(ny)
  }

  const onLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
