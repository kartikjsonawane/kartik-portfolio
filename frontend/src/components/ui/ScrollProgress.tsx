import { useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const spring = useSpring(0, { stiffness: 200, damping: 30, mass: 0.5 })

  useEffect(() => {
    const update = () => {
      const el  = document.documentElement
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      spring.set(pct)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [spring])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-white z-[100] origin-left"
      style={{ scaleX: spring }}
    />
  )
}
