import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  type Phase = 'logo' | 'line' | 'exit' | 'done'
  const [phase, setPhase] = useState<Phase>('logo')

  useEffect(() => {
    // Already seen this session
    if (sessionStorage.getItem('ks-loaded')) { setPhase('done'); return }
    const t1 = setTimeout(() => setPhase('line'), 900)
    const t2 = setTimeout(() => setPhase('exit'), 1800)
    const t3 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('ks-loaded', '1')
    }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === ('done' as Phase)) return null

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* KS monogram */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <span className="text-white font-extralight text-5xl tracking-[0.5em] uppercase">
              KS
            </span>

            {/* Line draw */}
            <motion.div
              className="h-px bg-white/40"
              initial={{ width: 0 }}
              animate={{ width: phase === 'line' || phase === 'exit' ? 80 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'line' || phase === 'exit' ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[10px] font-mono tracking-[0.4em] text-silver-600 uppercase"
            >
              Portfolio
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
