import { motion } from 'framer-motion'
import { FiBriefcase, FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/ui/PageTransition'
import { EXPERIENCE, PROFILE } from '@/data/portfolio'

export default function Experience() {
  return (
    <PageTransition>
      <div className="pt-24">
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-label">Experience</span>
              <h1 className="section-title mt-2">Where I've worked</h1>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-max">
            <div className="space-y-8">
              {EXPERIENCE.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 lg:p-8 border-b border-neutral-200 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FiBriefcase className="w-4 h-4 text-accent-500" />
                          <span className="badge-accent">{exp.type}</span>
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-2">{exp.role}</h2>
                        <p className="text-emerald-600 dark:text-accent-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-neutral-500">
                        <span className="flex items-center gap-1.5">
                          <FiCalendar className="w-4 h-4" /> {exp.duration} · {exp.year}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiMapPin className="w-4 h-4" /> {exp.location}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">{exp.description}</p>
                  </div>

                  {/* Highlights */}
                  <div className="p-6 lg:p-8">
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Key Contributions</p>
                    <ul className="space-y-3">
                      {exp.highlights.map((h, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.05 }}
                          className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                          {h}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.stack.map(tech => (
                        <span key={tech} className="badge-neutral">{tech}</span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <div className="px-4 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm text-emerald-700 dark:text-accent-400 font-medium">
                        Impact: {exp.impact}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Open to Work CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 rounded-2xl border border-accent-500/20 bg-accent-500/5 p-8 text-center"
            >
              <span className="text-4xl">🎯</span>
              <h3 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">Open to new opportunities</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                Actively seeking AI Engineer, ML Engineer, and Full-Stack Developer internships for 2025.
                Let's build something great together.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  Get in touch <FiArrowRight className="w-4 h-4" />
                </Link>
                <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Download Resume
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
