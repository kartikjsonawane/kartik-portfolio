import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import PageTransition from '@/components/ui/PageTransition'
import { PROJECTS } from '@/data/portfolio'

export default function ProjectDetail() {
  const { slug } = useParams()
  const proj = PROJECTS.find(p => p.slug === slug)
  if (!proj) return <Navigate to="/projects" replace />

  const others = PROJECTS.filter(p => p.slug !== slug)
  const next = others[0]

  return (
    <PageTransition>
      <div className="pt-24">
        {/* ── HERO ─────────────────────── */}
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-accent-400 transition-colors mb-6">
                <FiArrowLeft className="w-4 h-4" /> Back to Projects
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-accent">{proj.category}</span>
                  <span className="badge-neutral">{proj.status}</span>
                  <span className="badge-neutral">{proj.year}</span>
                </div>

                {/* Color accent bar */}
                <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: proj.color }} />

                <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white">{proj.title}</h1>
                <p className="mt-2 text-xl text-neutral-600 dark:text-neutral-400 italic">{proj.tagline}</p>
                <p className="mt-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">{proj.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <FiGithub className="w-4 h-4" /> View Source
                  </a>
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      <FiExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2 p-6 h-fit"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map(t => (
                        <span key={t} className="badge-neutral">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-white/10" />
                  <div>
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Key Results</p>
                    <ul className="space-y-2">
                      {proj.results.map(r => (
                        <li key={r} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PROBLEM / SOLUTION ─────── */}
        <section className="section-padding">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-red-500/20 bg-red-500/5 p-7"
              >
                <p className="text-xs font-mono text-red-500 dark:text-red-400 uppercase tracking-widest mb-3">Problem</p>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{proj.problem}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-7"
              >
                <p className="text-xs font-mono text-emerald-600 dark:text-accent-400 uppercase tracking-widest mb-3">Solution</p>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{proj.solution}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE ─────────── */}
        <section className="section-padding bg-neutral-50 dark:bg-surface-1">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Architecture</span>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">System design</h2>
            </motion.div>

            <div className="mt-8 space-y-3">
              {proj.architecture.map((layer, i) => (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 p-5"
                >
                  <div
                    className="w-1 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color, opacity: 0.7 }}
                  />
                  <div className="min-w-24">
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{layer.layer}</p>
                    <p className="font-semibold text-neutral-900 dark:text-white mt-0.5">{layer.tech}</p>
                  </div>
                  <p className="text-sm text-neutral-500 flex-1">{layer.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────── */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Features</span>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">What it does</h2>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proj.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                  </span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{feat}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHALLENGES ────────────── */}
        <section className="section-padding bg-neutral-50 dark:bg-surface-1">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Engineering</span>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-2">Challenges & how I solved them</h2>
            </motion.div>

            <div className="mt-8 space-y-5">
              {proj.challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 p-7"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-accent-500">#{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{c.title}</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{c.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEXT PROJECT ──────────── */}
        {next && (
          <section className="section-padding">
            <div className="container-max">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="section-label mb-4">Up Next</p>
                <Link
                  to={`/projects/${next.slug}`}
                  className="group flex items-center justify-between p-7 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 hover:border-accent-500/30 transition-all"
                >
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{next.category}</p>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-accent-400 transition-colors">
                      {next.title}
                    </h3>
                    <p className="text-neutral-500 mt-1">{next.tagline}</p>
                  </div>
                  <FiArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-accent-400 group-hover:translate-x-2 transition-all" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  )
}
