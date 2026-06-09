import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiArrowRight } from 'react-icons/fi'
import PageTransition from '@/components/ui/PageTransition'
import { PROJECTS } from '@/data/portfolio'

type Filter = 'all' | 'Full-Stack' | 'Android + AI' | 'AI/ML + Web'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',          label: 'All Projects' },
  { key: 'AI/ML + Web',  label: 'AI / ML' },
  { key: 'Full-Stack',   label: 'Full-Stack' },
  { key: 'Android + AI', label: 'Android + AI' },
]

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter)

  return (
    <PageTransition>
      <div className="pt-24">
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-label">Projects</span>
              <h1 className="section-title mt-2">Things I've shipped</h1>
              <p className="mt-3 text-neutral-500 max-w-xl">
                Each project is a full case study — architecture decisions, challenges, and results.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    filter === f.key
                      ? 'bg-accent-500/15 text-emerald-700 dark:text-accent-400 border-accent-500/30'
                      : 'text-neutral-500 border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-max">
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((proj, i) => (
                  <motion.div
                    key={proj.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.08 }}
                    className={i === 0 ? 'lg:col-span-2' : ''}
                  >
                    <div className="group relative rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 overflow-hidden card-hover h-full">
                      {/* Top color accent */}
                      <div
                        className="h-1 w-full"
                        style={{ background: `linear-gradient(to right, ${proj.color}, transparent)` }}
                      />

                      <div className={`p-7 lg:p-8 flex flex-col ${i === 0 ? 'lg:flex-row lg:gap-10' : ''}`}>
                        {/* Left / Main content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <span className="badge-accent mb-2 inline-flex">{proj.category}</span>
                              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-accent-400 transition-colors">
                                {proj.title}
                              </h2>
                              <p className="mt-1 text-sm text-neutral-500 italic">{proj.tagline}</p>
                            </div>
                            <span className="text-xs font-mono text-neutral-500">{proj.year}</span>
                          </div>

                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">{proj.description}</p>

                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {proj.tags.map(tag => (
                              <span key={tag} className="badge-neutral">{tag}</span>
                            ))}
                          </div>

                          {/* Results */}
                          <div className="grid grid-cols-2 gap-2 mb-6">
                            {proj.results.slice(0, 4).map(r => (
                              <div key={r} className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                                {r}
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Link
                              to={`/projects/${proj.slug}`}
                              className="btn-primary text-sm py-2"
                            >
                              Case Study <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary text-sm py-2"
                            >
                              <FiGithub className="w-4 h-4" /> GitHub
                            </a>
                          </div>
                        </div>

                        {/* Right column (featured only) */}
                        {i === 0 && (
                          <div className="hidden lg:flex flex-col justify-center min-w-64">
                            <div className="space-y-3">
                              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Architecture</p>
                              {proj.architecture.slice(0, 4).map(layer => (
                                <div key={layer.layer} className="flex items-center gap-3 text-sm">
                                  <span className="w-2 h-2 rounded-full bg-accent-500/60 shrink-0" />
                                  <span className="text-neutral-600 dark:text-neutral-400 w-20 shrink-0">{layer.layer}</span>
                                  <span className="text-neutral-500 truncate">{layer.tech}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
