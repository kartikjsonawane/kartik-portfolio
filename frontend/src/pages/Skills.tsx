import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/ui/PageTransition'
import { SKILLS } from '@/data/portfolio'

type Category = 'all' | 'programming' | 'frontend' | 'backend' | 'aiml' | 'database' | 'tools'

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'all',         label: 'All',          emoji: '✨' },
  { key: 'aiml',        label: 'AI / ML',      emoji: '🧠' },
  { key: 'programming', label: 'Languages',    emoji: '⚡' },
  { key: 'backend',     label: 'Backend',      emoji: '🚂' },
  { key: 'frontend',    label: 'Frontend',     emoji: '⚛️' },
  { key: 'database',    label: 'Databases',    emoji: '🗄️' },
  { key: 'tools',       label: 'Tools',        emoji: '🛠️' },
]

interface Skill {
  name: string
  level: number
  years: number
  icon: string
  projects: string[]
}

function SkillCard({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2 p-5 cursor-default overflow-hidden group transition-colors hover:border-accent-500/30"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.06), transparent 70%)' }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{skill.icon}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{skill.name}</span>
          </div>
          <span className="font-mono text-xs text-accent-500">{skill.level}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-neutral-200 dark:bg-white/5 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{skill.years}y experience</span>
          <span className={`transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'} text-neutral-500`}>
            {skill.projects.length} project{skill.projects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Projects on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-hidden"
            >
              <div className="pt-3 border-t border-neutral-200 dark:border-white/10">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Used in</p>
                <div className="flex flex-wrap gap-1">
                  {skill.projects.map(p => (
                    <span key={p} className="badge-neutral text-[10px]">{p}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const ALL_SKILLS = Object.entries(SKILLS).flatMap(([cat, skills]) =>
  skills.map(s => ({ ...s, category: cat }))
)

export default function Skills() {
  const [active, setActive] = useState<Category>('all')

  const displayed = active === 'all'
    ? ALL_SKILLS
    : ALL_SKILLS.filter(s => s.category === active)

  return (
    <PageTransition>
      <div className="pt-24">
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-label">Skills</span>
              <h1 className="section-title mt-2">The tech I build with</h1>
              <p className="mt-3 text-neutral-500 max-w-xl">
                Hover any card to see which projects use that skill. Filter by category to explore.
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === cat.key
                      ? 'bg-accent-500/15 text-emerald-700 dark:text-accent-400 border border-accent-500/30'
                      : 'text-neutral-500 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-max">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {displayed.map(skill => (
                  <SkillCard key={`${skill.category}-${skill.name}`} skill={skill} />
                ))}
              </AnimatePresence>
            </motion.div>

            {displayed.length === 0 && (
              <p className="text-center text-neutral-500 py-20">No skills in this category yet.</p>
            )}
          </div>
        </section>

        {/* Summary Stats */}
        <section className="section-padding bg-neutral-50 dark:bg-surface-1">
          <div className="container-max">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Technologies', value: ALL_SKILLS.length + '+', icon: '⚡' },
                { label: 'AI/ML Frameworks', value: SKILLS.aiml.length.toString(), icon: '🧠' },
                { label: 'Avg Proficiency', value: Math.round(ALL_SKILLS.reduce((a, s) => a + s.level, 0) / ALL_SKILLS.length) + '%', icon: '📈' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 p-8"
                >
                  <span className="text-4xl">{s.icon}</span>
                  <p className="mt-3 text-4xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
                  <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
