import { useRef, useState, FormEvent, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useInView, useMotionValue, useSpring, useTransform,
} from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiGithub, FiLinkedin, FiArrowRight, FiDownload, FiMail, FiExternalLink } from 'react-icons/fi'
import { HiArrowDown } from 'react-icons/hi'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import { PROFILE, PROJECTS, EXPERIENCE, STATS, CERTIFICATIONS } from '@/data/portfolio'
import kartikPhoto from '@/assets/kartik.png'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import SplitReveal from '@/components/ui/SplitReveal'

const MB: [number,number,number,number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: MB } },
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function Reveal({ id, children, className = '' }: {
  id?: string; children: React.ReactNode; className?: string
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  return (
    <motion.section
      id={id} ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  )
}

function TiltCard({ children, className = '', strength = 5 }: {
  children: React.ReactNode; className?: string; strength?: number
}) {
  const ref  = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const cfg  = { stiffness: 180, damping: 18, mass: 0.5 }
  const x    = useSpring(rawX, cfg)
  const y    = useSpring(rawY, cfg)
  const rotX = useTransform(y, [-1, 1], [strength, -strength])
  const rotY = useTransform(x, [-1, 1], [-strength, strength])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2)
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-16">
      <motion.p variants={fadeUp} className="section-label mb-4">{label}</motion.p>
      <div className="flex items-end gap-6">
        <SplitReveal text={title} className="font-display text-4xl lg:text-5xl text-white" as="h2" />
        <motion.div
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: MB } } }}
          className="hidden lg:block h-px bg-white/[0.07] flex-1 mb-3 origin-left"
        />
      </div>
    </div>
  )
}

const SKILL_GROUPS = [
  { label: 'Languages',  items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Kotlin'] },
  { label: 'Frontend',   items: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML / CSS'] },
  { label: 'Backend',    items: ['Node.js', 'Express', 'Flask', 'FastAPI', 'REST APIs'] },
  { label: 'AI / ML',    items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'YOLOv8', 'Pandas', 'NumPy'] },
  { label: 'Databases',  items: ['MongoDB', 'MySQL'] },
  { label: 'Tools',      items: ['Git', 'Docker', 'AWS S3', 'Streamlit', 'Android SDK'] },
]

const TIMELINE = [
  { year: '2026', title: 'Published Research — DP-HPO', desc: 'Zenodo · Dynamic programming for neural network HPO · 90.7% eval reduction' },
  { year: '2025', title: 'Open to Internships',         desc: 'Seeking SWE / AI / ML roles at top companies' },
  { year: '2024', title: 'CropMD — AI for Agriculture', desc: 'ResNet-50 plant disease detection · 96.3% accuracy' },
  { year: '2024', title: 'VisionTrack — Android + AI',  desc: 'Real-time YOLOv8 object detection on Android' },
  { year: '2024', title: 'ML Internship',               desc: 'Customer churn prediction · 89% ROC-AUC · Flask API' },
  { year: '2023', title: 'DevConnect — Full-Stack',     desc: 'MERN developer social platform' },
  { year: '2022', title: 'B.Tech · AI & ML',            desc: 'Began specialisation in AI & Machine Learning' },
]

const PAPER = {
  title:    'DP-HPO: Approximate Dynamic Programming for Neural Network Hyperparameter Optimisation with Evaluation Caching',
  venue:    'Zenodo · June 2026',
  doi:      'https://doi.org/10.5281/zenodo.20760182',
  github:   'https://github.com/kartikjsonawane/dp-hpo',
  blog:     '/blog/dp-hpo-dynamic-programming-hyperparameter-optimisation',
  abstract: 'Formulates HPO as a finite-horizon MDP and solves it via approximate dynamic programming with evaluation caching. Achieves within 0.5% of exhaustive grid search accuracy using 10 evaluations instead of 108 — a 90.7% reduction. Proves an optimality gap bound of (d−1)·ε via Bellman induction.',
  tags:     ['Dynamic Programming', 'HPO', 'MDP', 'Neural Networks', 'Python'],
  stats:    [
    { value: '90.7%', label: 'Eval Reduction' },
    { value: '10',    label: 'vs 108 Evaluations' },
    { value: '0.5%',  label: 'Max Accuracy Gap' },
    { value: '8',     label: 'Baselines Beaten' },
  ],
}

export default function Home() {
  const [form, setForm]             = useState({ name: '', email: '', message: '' })
  const [sending, setSending]       = useState(false)
  const [hoveredProj, setHoveredProj] = useState<string | null>(null)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleContact = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!serviceId || !templateId || !publicKey) {
        // Fallback: open mailto if EmailJS not configured yet
        window.open(`mailto:kartikjaywantsonawane@gmail.com?subject=Portfolio contact from ${form.name}&body=${encodeURIComponent(form.message)}`)
        toast.success('Opening your email client...')
        setForm({ name: '', email: '', message: '' })
        return
      }
      await emailjs.send(serviceId, templateId, {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
        to_email:   'kartikjaywantsonawane@gmail.com',
      }, publicKey)
      toast.success('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed — email me directly.')
    } finally { setSending(false) }
  }

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center section-padding">
        <div className="absolute inset-0 grid-dots opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Left: text ── */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: MB }}
                className="section-label mb-10"
              >
                Portfolio · 2025
              </motion.p>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: 0.25, duration: 1, ease: MB }}
                  className="font-display text-[clamp(3.5rem,9vw,8rem)] tracking-[-0.02em] leading-[0.9] text-white"
                >
                  Kartik
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.h1
                  initial={{ y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: 0.38, duration: 1, ease: MB }}
                  className="font-display text-[clamp(3.5rem,9vw,8rem)] tracking-[-0.02em] leading-[0.9] text-silver-500"
                >
                  Sonawane
                </motion.h1>
              </div>

              {/* Horizontal rule — draws in */}
              <motion.div
                className="h-px bg-white/10 mb-8 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.9, ease: MB }}
              />

              {/* Typing role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                className="h-7 mb-8"
              >
                <TypeAnimation
                  sequence={['AI & ML Engineer', 2400, 'Full-Stack Developer', 2400, 'Android Developer', 2400, 'API Engineer', 2400]}
                  wrapper="span"
                  cursor
                  repeat={Infinity}
                  className="text-sm font-mono tracking-[0.3em] uppercase text-silver-500"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7, ease: MB }}
                className="text-silver-400 text-base font-light leading-relaxed max-w-md mb-12"
              >
                {PROFILE.bio}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6, ease: MB }}
                className="flex flex-wrap gap-4 mb-14"
              >
                <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                  <FiDownload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Resume
                </a>
                <button onClick={() => scrollTo('projects')} className="btn-secondary group">
                  View Work
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>

              <div className="flex items-center gap-8">
                {[
                  { icon: FiGithub,   href: PROFILE.github,            label: 'GitHub' },
                  { icon: FiLinkedin, href: PROFILE.linkedin,          label: 'LinkedIn' },
                  { icon: FiMail,     href: `mailto:${PROFILE.email}`, label: 'Email' },
                ].map(({ icon: Icon, href, label }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.35 + i * 0.08, duration: 0.5, ease: MB }}
                    className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-silver-700 hover:text-white transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* ── Right: photo ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: MB }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative w-[380px] h-[480px]">
                {/* Subtle ambient glow behind */}
                <div className="absolute inset-0 -z-10 rounded-sm blur-3xl opacity-20 bg-gradient-to-br from-white/10 to-transparent scale-110" />

                {/* Photo */}
                <img
                  src={kartikPhoto}
                  alt="Kartik Sonawane"
                  className="w-full h-full object-cover object-top rounded-sm"
                  style={{
                    filter: 'brightness(0.85) contrast(1.02) saturate(0.9)',
                  }}
                />

                {/* Subtle gradient fade at bottom only */}
                <div className="absolute inset-0 rounded-sm bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Thin border */}
                <div className="absolute inset-0 rounded-sm border border-white/[0.06]" />

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/20" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-white/20" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-transparent to-white/20"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2.4, duration: 0.8, ease: MB }}
          />
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <HiArrowDown className="w-4 h-4 text-silver-800" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <div className="border-y border-white/[0.05] bg-surface-1">
        <motion.div
          className="container-max py-12 grid grid-cols-2 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            { value: STATS.projectsBuilt, suffix: '+', label: 'Projects Built' },
            { value: STATS.mlModels,       suffix: '+', label: 'ML Models' },
            { value: STATS.techStack,       suffix: '+', label: 'Technologies' },
            { value: STATS.githubRepos,     suffix: '+', label: 'GitHub Repos' },
          ].map(({ value, suffix, label }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: MB } } }}
              className="text-center py-4 border-r border-white/[0.05] last:border-0"
            >
              <p className="font-display text-4xl text-white mb-1.5">
                <AnimatedCounter to={value} suffix={suffix} duration={1800} />
              </p>
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-silver-700">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ABOUT */}
      <Reveal id="about">
        <div className="container-max">
          <SectionHeader label="About" title="Engineering meets AI and product" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <motion.p variants={fadeUp} className="text-silver-400 font-light leading-relaxed text-lg mb-5">{PROFILE.bio}</motion.p>
              <motion.p variants={fadeUp} className="text-silver-500 font-light leading-relaxed mb-10">
                Pursuing a B.Tech in Computer Science (AI &amp; ML). I build full-stack apps, train and deploy ML models,
                and ship Android applications. Great engineering is invisible — it just works.
              </motion.p>
              <motion.div variants={fadeUp}>
                <p className="section-label mb-5">Certifications</p>
                <div className="space-y-0">
                  {CERTIFICATIONS.map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: MB }}
                      className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0 group"
                    >
                      <span className="text-lg mt-0.5 group-hover:scale-110 transition-transform duration-300">{c.icon}</span>
                      <div>
                        <p className="text-silver-200 font-light text-sm">{c.title}</p>
                        <p className="text-silver-600 text-xs font-mono">{c.issuer} · {c.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.p variants={fadeUp} className="section-label mb-8">Timeline</motion.p>
              <div className="space-y-0 relative">
                <motion.div
                  className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-white/[0.05] origin-top"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: MB }}
                />
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: MB }}
                    className="flex gap-6 pb-7 border-b border-white/[0.05] last:border-0 last:pb-0 group"
                  >
                    <span className="font-mono text-[10px] text-silver-700 tracking-widest pt-1 w-10 shrink-0">{item.year}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-silver-800 mt-1.5 shrink-0 group-hover:bg-white transition-colors duration-300 relative z-10" />
                    <div>
                      <p className="text-white font-light mb-1 group-hover:text-silver-200 transition-colors">{item.title}</p>
                      <p className="text-silver-600 text-sm font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* SKILLS */}
      <Reveal id="skills" className="bg-surface-1">
        <div className="container-max">
          <SectionHeader label="Expertise" title="Skills and Technologies" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {SKILL_GROUPS.map((group, gi) => (
              <TiltCard key={group.label} strength={3} className="bg-surface-1">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.07, duration: 0.7, ease: MB }}
                  className="p-8 h-full hover:bg-surface-2 transition-colors duration-500"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <p className="section-label">{group.label}</p>
                    <motion.div
                      className="h-px bg-white/10 flex-1 origin-left"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.07 + 0.3, duration: 0.7, ease: MB }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, si) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: gi * 0.04 + si * 0.04, duration: 0.4, ease: MB }}
                        whileHover={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', y: -1 }}
                        className="px-3 py-1 border border-white/[0.07] text-silver-400 text-[11px] font-mono cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* PROJECTS */}
      <Reveal id="projects">
        <div className="container-max">
          <SectionHeader label="Selected Work" title="Projects" />
          <div className="space-y-px bg-white/[0.04]">
            {PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: MB }}
                onMouseEnter={() => setHoveredProj(proj.slug)}
                onMouseLeave={() => setHoveredProj(null)}
                className="relative group bg-black hover:bg-surface-2 transition-all duration-500 p-8 lg:p-12"
              >
                {/* Left border draws down on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-px bg-white origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredProj === proj.slug ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: MB }}
                />

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.span
                        className="font-mono text-[10px] tracking-widest"
                        animate={{ color: hoveredProj === proj.slug ? '#888888' : '#444444' }}
                        transition={{ duration: 0.3 }}
                      >
                        0{i + 1}
                      </motion.span>
                      <span className="font-mono text-[10px] text-silver-700 tracking-widest uppercase">{proj.category}</span>
                      <span className="font-mono text-[10px] text-silver-700 tracking-widest">{proj.year}</span>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl text-white mb-2 group-hover:text-silver-100 transition-colors duration-300">
                      {proj.title}
                    </h3>
                    <p className="text-silver-500 font-light italic mb-5 text-sm">{proj.tagline}</p>
                    <p className="text-silver-400 font-light leading-relaxed max-w-lg mb-6 text-sm">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.tags.map((tag, ti) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04 + ti * 0.03, duration: 0.4 }}
                          className="px-2.5 py-0.5 border border-white/[0.07] text-silver-600 text-[10px] font-mono"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6">
                      <Link
                        to={`/projects/${proj.slug}`}
                        className="group/link text-[11px] font-mono tracking-widest uppercase text-white flex items-center gap-1.5"
                      >
                        <span className="border-b border-white/20 pb-px group-hover/link:border-white transition-colors">Case Study</span>
                        <motion.span
                          animate={{ x: hoveredProj === proj.slug ? 3 : 0 }}
                          transition={{ duration: 0.3, ease: MB }}
                        >
                          &rarr;
                        </motion.span>
                      </Link>
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <FiGithub className="w-3.5 h-3.5" /> GitHub
                      </a>
                      {proj.demo && (
                        <a
                          href={proj.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  <motion.div
                    className="lg:w-64 shrink-0"
                    animate={{ opacity: hoveredProj === proj.slug ? 1 : 0.45 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="section-label mb-4">Architecture</p>
                    <div className="space-y-2.5 mb-6">
                      {proj.architecture.map((layer, li) => (
                        <motion.div
                          key={layer.layer}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: li * 0.06, duration: 0.5, ease: MB }}
                          className="flex items-start gap-3 border-b border-white/[0.04] pb-2.5 last:border-0"
                        >
                          <span className="text-silver-700 font-mono text-[10px] w-16 shrink-0 pt-px">{layer.layer}</span>
                          <span className="text-silver-400 font-light text-xs leading-snug">{layer.tech}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="section-label mb-3">Results</p>
                    {proj.results.slice(0, 3).map((r, j) => (
                      <p key={j} className="text-silver-500 text-xs font-light mb-1.5">· {r}</p>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* RESEARCH */}
      <Reveal id="research">
        <div className="container-max">
          <SectionHeader label="Research" title="Published Work" />
          <div className="border border-white/[0.07] p-8 lg:p-12 hover:border-white/20 transition-all duration-500 group">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {PAPER.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono tracking-widest uppercase border border-white/[0.07] text-silver-600 px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-white leading-snug mb-3">
                  {PAPER.title}
                </h3>
                <p className="text-[11px] font-mono tracking-widest uppercase text-silver-600 mb-5">{PAPER.venue}</p>
                <p className="text-silver-400 font-light text-sm leading-relaxed max-w-2xl">{PAPER.abstract}</p>
              </div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 gap-px bg-white/[0.05] border border-white/[0.07] shrink-0 lg:w-56"
              >
                {PAPER.stats.map(s => (
                  <div key={s.label} className="bg-black p-4 text-center">
                    <p className="font-display text-2xl text-white mb-1">{s.value}</p>
                    <p className="text-[10px] font-mono tracking-widest uppercase text-silver-700">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Links */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-6 border-t border-white/[0.06]">
              <a
                href={PAPER.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2.5 px-5"
              >
                <FiExternalLink className="w-3.5 h-3.5" /> Read Paper (DOI)
              </a>
              <a
                href={PAPER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2.5 px-5"
              >
                <FiGithub className="w-3.5 h-3.5" /> View Code
              </a>
              <Link
                to={PAPER.blog}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                <FiArrowRight className="w-3.5 h-3.5" /> Read Blog Post
              </Link>
            </motion.div>
          </div>
        </div>
      </Reveal>

      {/* EXPERIENCE */}
      <Reveal id="experience" className="bg-surface-1">
        <div className="container-max">
          <SectionHeader label="Experience" title="Work History" />
          <div className="border-t border-white/[0.05]">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: MB }}
                className="py-10 border-b border-white/[0.05] grid grid-cols-1 lg:grid-cols-3 gap-8 group"
              >
                <div>
                  <p className="font-mono text-[10px] text-silver-700 tracking-widest mb-3 uppercase">
                    {exp.year} · {exp.duration} · {exp.location}
                  </p>
                  <h3 className="text-white font-light text-xl mb-1 group-hover:text-silver-200 transition-colors">{exp.role}</h3>
                  <p className="text-silver-500 font-light text-sm mb-4">{exp.company}</p>
                  <div className="inline-block">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-silver-700">{exp.impact}</p>
                    <motion.div
                      className="h-px bg-white/10 mt-1 origin-left"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.7, ease: MB }}
                    />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-silver-400 font-light text-sm leading-relaxed mb-6">{exp.description}</p>
                  <div className="space-y-2.5 mb-6">
                    {exp.highlights.map((h, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.06, duration: 0.5, ease: MB }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="w-px h-4 bg-white/15 mt-1.5 shrink-0" />
                        <span className="text-silver-400 font-light">{h}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map((t, ti) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ti * 0.04, duration: 0.4 }}
                        className="px-2.5 py-0.5 border border-white/[0.07] text-silver-600 text-[10px] font-mono hover:border-white/20 hover:text-white transition-all duration-200"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CONTACT */}
      <Reveal id="contact">
        <div className="container-max">
          <SectionHeader label="Contact" title="Let's build something together" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <motion.p variants={fadeUp} className="text-silver-400 font-light leading-relaxed mb-12 text-sm">
                Looking for internship opportunities in SWE, AI/ML, and full-stack. Open to relocation and remote.
              </motion.p>
              <div className="space-y-0">
                {[
                  { label: 'Email',    value: PROFILE.email,          href: `mailto:${PROFILE.email}` },
                  { label: 'LinkedIn', value: 'kartikjsonawane',      href: PROFILE.linkedin },
                  { label: 'GitHub',   value: PROFILE.githubUsername, href: PROFILE.github },
                  { label: 'Location', value: PROFILE.location,       href: null },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: MB }}
                    className="flex items-center gap-4 py-4 border-b border-white/[0.05] group"
                  >
                    <span className="font-mono text-[10px] tracking-widest uppercase text-silver-700 w-16 shrink-0">{item.label}</span>
                    <motion.div
                      className="h-px bg-white/10"
                      initial={{ width: 0 }}
                      whileInView={{ width: '16px' }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.5, ease: MB }}
                    />
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-silver-300 hover:text-white transition-colors duration-300 font-light text-sm flex items-center gap-1.5"
                      >
                        {item.value}
                        <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-silver-300 font-light text-sm">{item.value}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleContact}
              className="space-y-6"
            >
              {[
                { key: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your name' },
                { key: 'email',   label: 'Email',   type: 'email', placeholder: 'your@email.com' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-silver-700 mb-3">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-silver-800 focus:outline-none focus:border-white/20 transition-colors duration-300 font-light"
                  />
                </div>
              ))}
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-silver-700 mb-3">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell me about the role or project..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-silver-800 focus:outline-none focus:border-white/20 transition-colors duration-300 font-light resize-none"
                />
              </div>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </Reveal>

    </div>
  )
}
