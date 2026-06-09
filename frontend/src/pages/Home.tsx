import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiGithub, FiLinkedin, FiArrowRight, FiDownload, FiMail } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import PageTransition from '@/components/ui/PageTransition'
import GitHubStats from '@/components/home/GitHubStats'
import { PROFILE, PROJECTS, STATS } from '@/data/portfolio'

const TECH_STACK = [
  { name: 'Python', color: '#3776AB' },
  { name: 'TensorFlow', color: '#FF6F00' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Kotlin', color: '#7F52FF' },
  { name: 'PyTorch', color: '#EE4C2C' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'FastAPI', color: '#009688' },
  { name: 'YOLOv8', color: '#10B981' },
]

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <PageTransition>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Ambient glow — follows mouse subtly */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(900px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(16,185,129,0.06), transparent 60%)`,
          }}
        />

        {/* Grid dots */}
        <div className="absolute inset-0 grid-dots opacity-40" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="container-max section-padding w-full">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            {/* Status badge */}
            <motion.div variants={fadeUp}>
              <span className="badge-accent mb-6 inline-flex">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-slow" />
                Open to Internship Opportunities — 2025
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              <span className="text-neutral-900 dark:text-white">Kartik</span>{' '}
              <span className="text-gradient">Sonawane</span>
            </motion.h1>

            {/* Typing Roles */}
            <motion.div variants={fadeUp} className="mt-4 h-10 flex items-center">
              <span className="text-xl sm:text-2xl text-neutral-500 dark:text-neutral-400 font-medium">
                <TypeAnimation
                  sequence={PROFILE.roles.flatMap(r => [r, 2200])}
                  wrapper="span"
                  cursor
                  repeat={Infinity}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-500 leading-relaxed max-w-2xl"
            >
              Final-year B.Tech student in <span className="text-neutral-900 dark:text-neutral-300">AI & Machine Learning</span>, building
              production-grade web apps, ML pipelines, and Android apps.
              I turn <span className="text-neutral-900 dark:text-neutral-300">research papers into working systems</span> and complex
              backends into clean interfaces.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/projects" className="btn-primary">
                View Projects <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FiDownload className="w-4 h-4" /> Resume
              </a>
              <Link to="/contact" className="btn-secondary">
                <FiMail className="w-4 h-4" /> Contact Me
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeUp} className="mt-6 flex items-center gap-4">
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer"
                className="text-neutral-600 hover:text-accent-400 transition-colors flex items-center gap-1.5 text-sm">
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
              <span className="w-px h-4 bg-neutral-800" />
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-neutral-600 hover:text-accent-400 transition-colors flex items-center gap-1.5 text-sm">
                <FiLinkedin className="w-4 h-4" /> LinkedIn
              </a>
              <span className="w-px h-4 bg-neutral-800" />
              <a href={`mailto:${PROFILE.email}`}
                className="text-neutral-600 hover:text-accent-400 transition-colors flex items-center gap-1.5 text-sm">
                <FiMail className="w-4 h-4" /> Email
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-neutral-700 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-accent-500/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── QUICK STATS ─────────────────────────────────── */}
      <section className="border-y border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-surface-1">
        <div className="container-max section-padding py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Projects Built', value: STATS.projectsBuilt + '+', icon: '🚀' },
              { label: 'ML Models Trained', value: STATS.mlModels + '+', icon: '🧠' },
              { label: 'Technologies', value: STATS.techStack + '+', icon: '⚡' },
              { label: 'GitHub Repos', value: STATS.githubRepos + '+', icon: '📦' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <span className="text-3xl">{stat.icon}</span>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="section-label">Tech Stack</span>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">Tools I work with</h2>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-surface-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-default transition-colors hover:border-accent-500/30 hover:text-emerald-600 dark:hover:text-accent-400"
                style={{ '--dot-color': tech.color } as React.CSSProperties}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: tech.color }}
                />
                {tech.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GITHUB STATS ────────────────────────────────── */}
      <section className="section-padding bg-neutral-50 dark:bg-surface-1">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="section-label">GitHub Activity</span>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">Code speaks louder</h2>
          </motion.div>
          <GitHubStats username={PROFILE.githubUsername} />
        </div>
      </section>

      {/* ── FEATURED PROJECTS ───────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <span className="section-label">Featured Work</span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">Projects that ship</h2>
            </div>
            <Link to="/projects" className="text-sm text-accent-500 hover:text-accent-400 flex items-center gap-1 transition-colors">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={`/projects/${proj.slug}`} className="group block h-full">
                  <div className="h-full rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-surface-2 p-6 card-hover">
                    {/* Color bar */}
                    <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: proj.color }} />

                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-accent-400 transition-colors">
                        {proj.title}
                      </h3>
                      <span className="badge-accent shrink-0">{proj.category}</span>
                    </div>

                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">{proj.tagline}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="badge-neutral">{tag}</span>
                      ))}
                    </div>

                    <span className="text-sm text-accent-500 group-hover:text-accent-400 flex items-center gap-1 transition-colors">
                      View case study <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-accent-500/20 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent p-10 lg:p-14 text-center overflow-hidden"
          >
            <div className="absolute inset-0 grid-dots opacity-30" />
            <div className="relative">
              <HiOutlineSparkles className="w-8 h-8 text-accent-500 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Let's build something great
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8">
                I'm actively looking for AI Engineer, ML Engineer, and Full-Stack Developer internships for 2025.
                If you're building something interesting, let's talk.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  Get in touch <FiArrowRight className="w-4 h-4" />
                </Link>
                <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <FiDownload className="w-4 h-4" /> Download Resume
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
