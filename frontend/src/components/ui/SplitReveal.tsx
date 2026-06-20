import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  once?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

const wordVariant = {
  hidden:  { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.75,
      delay: i * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function SplitReveal({
  text,
  className = '',
  delay = 0,
  once = true,
  as: Tag = 'h2',
}: Props) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once, margin: '-6%' })
  const words  = text.split(' ')

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={`overflow-hidden ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span
            className="inline-block"
            custom={i + delay / 0.07}
            variants={wordVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
