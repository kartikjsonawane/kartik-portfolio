import { useRef, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiGithub, FiLinkedin, FiArrowRight, FiDownload, FiMail, FiExternalLink } from 'react-icons/fi'
import { HiArrowDown } from 'react-icons/hi'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { PROFILE, PROJECTS, EXPERIENCE, STATS, CERTIFICATIONS } from '@/data/portfolio'

/* ─── Animation variants ─────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function Reveal({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  return (
    <motion.section
      id={id}
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  )
}

/* ─── Skill groups ──────────────────────────────── */
const SKILL_GROUPS = [
  { label: 'Languages',  items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Kotlin'] },
  { label: 'Frontend',   items: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML / CSS'] },
  { label: 'Backend',    items: ['Node.js', 'Express', 'Flask', 'FastAPI', 'REST APIs'] },
  { label: 'AI / ML',    items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'YOLOv8', 'Pandas', 'NumPy'] },
  { label: 'Databases',  items: ['MongoDB', 'MySQL'] },
  { label: 'Tools',      items: ['Git', 'Docker', 'AWS S3', 'Streamlit', 'Android SDK'] },
]

/* ─── Timeline data ─────────────────────────────── */
const TIMELINE = [
  { year: '2025', title: 'Open to Internships',         desc: 'Seeking SWE / AI / ML roles at top companies' },
  { year: '2024', title: 'CropMD — AI for Agriculture', desc: 'ResNet-50 plant disease detection · 96.3% accuracy' },
  { year: '2024', title: 'VisionTrack — Android + AI',  desc: 'Real-time YOLOv8 object detection on Android' },
  { year: '2024', title: 'ML Internship',               desc: 'Customer churn prediction · 89% ROC-AUC · Flask API' },
  { year: '2023', title: 'DevConnect — Full-Stack',     desc: 'MERN developer social platform' },
  { year: '2022', title: 'B.Tech · AI & ML',            desc: 'Began specialisation in AI & Machine Learning' },
]

export default function Home() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handleContact = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      await api.post('/api/contact', form)
      toast.success('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed. Email me directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center section-padding">
        <div className="absolute inset-0 grid-dots opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="container-max relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="section-label mb-8"
            >
              Portfolio · 2025
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3.2rem,10vw,8rem)] font-extralight tracking-[-0.02em] leading-[0.93] text-white mb-6"
            >
              Kartik<br />
              <span className="text-silver-500">Sonawane</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="h-7 mb-10"
            >
              <TypeAnimation
                sequence={[
                  'AI & ML Engineer', 2400,
                  'Full-Stack Developer', 2400,
                  'Android Developer', 2400,
                  'API Engineer', 2400,
                ]}
                wrapper="span"
                cursor
                repeat={Infinity}
                className="text-base font-mono tracking-[0.25em] uppercase text-silver-500"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-silver-400 text-lg font-light leading-relaxed max-w-lg mb-12"
            >
              {PROFILE.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <FiDownload className="w-4 h-4" /> Resume
              </a>
              <button onClick={() => scrollTo('projects')} className="btn-secondary">
                View Work <FiArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.7 }}
              className="flex items-center gap-8"
            >
              {[
                { icon: FiGithub,   href: PROFILE.github,            label: 'GitHub' },
                { icon: FiLinkedin, href: PROFILE.linkedin,          label: 'LinkedIn' },
                { icon: FiMail,     href: `mailto:${PROFILE.email}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-widest text-silver-800 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <HiArrowDown className="w-4 h-4 text-silver-800" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <div className="border-y border-white/[0.05] bg-surface-1">
        <div className="container-max py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${STATS.projectsBuilt}+`, label: 'Projects Built' },
            { value: `${STATS.mlModels}+`,       label: 'ML Models' },
            { value: `${STATS.techStack}+`,       label: 'Technologies' },
            { value: `${STATS.githubRepos}+`,     label: 'GitHub Repos' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-extralight text-white mb-1.5">{value}</p>
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-silver-600">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <Reveal id="about">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <div>
              <motion.p variants={fadeUp} className="section-label mb-5">About</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extralight text-white leading-tight mb-8">
                Engineering at the<br />intersection of<br />
                <span className="text-silver-500">AI and product</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-silver-400 font-light leading-relaxed text-lg mb-5">
                {PROFILE.bio}
              </motion.p>
              <motion.p variants={fadeUp} className="text-silver-500 font-light leading-relaxed">
                Pursuing a B.Tech in Computer Science (AI & ML). I build full-stack applications,
                train and deploy ML models, and ship Android apps. Great engineering is invisible — it just works.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10">
                <p className="section-label mb-5">Certifications</p>
                <div className="space-y-0">
                  {CERTIFICATIONS.map(c => (
                    <div key={c.title} className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
                      <span className="text-lg mt-0.5">{c.icon}</span>
                      <div>
                        <p className="text-silver-200 font-light text-sm">{c.title}</p>
                        <p className="text-silver-600 text-xs font-mono">{c.issuer} · {c.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Timeline */}
            <div>
              <motion.p variants={fadeUp} className="section-label mb-8">Timeline</motion.p>
              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex gap-6 pb-7 border-b border-white/[0.05] last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-[10px] text-silver-700 tracking-widest pt-1 w-10 shrink-0">
                      {item.year}
                    </span>
                    <div>
                      <p className="text-white font-light mb-1">{item.title}</p>
                      <p className="text-silver-600 text-sm font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════ */}
      <Reveal id="skills" className="bg-surface-1">
        <div className="container-max">
          <motion.p variants={fadeUp} className="section-label mb-5">Expertise</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extralight text-white mb-16">
            Skills & Technologies
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {SKILL_GROUPS.map((group) => (
              <motion.div
                key={group.label}
                variants={fadeUp}
                className="bg-surface-1 p-8 hover:bg-surface-2 transition-colors duration-500"
              >
                <p className="section-label mb-6">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 border border-white/[0.07] text-silver-400 text-[11px] font-mono
                                 hover:border-white/20 hover:text-white transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════ */}
      <Reveal id="projects">
        <div className="container-max">
          <motion.p variants={fadeUp} className="section-label mb-5">Selected Work</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extralight text-white mb-16">
            Projects
          </motion.h2>

          <div className="space-y-px bg-white/[0.04]">
            {PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.slug}
                variants={fadeUp}
                className="group bg-black hover:bg-surface-2 transition-all duration-500 p-8 lg:p-12"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-[10px] text-silver-700 tracking-widest">0{i + 1}</span>
                      <span className="font-mono text-[10px] text-silver-700 tracking-widest uppercase">{proj.category}</span>
                      <span className="font-mono text-[10px] text-silver-700 tracking-widest">{proj.year}</span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-extralight text-white mb-2 group-hover:text-silver-100 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-silver-500 font-light italic mb-5 text-sm">{proj.tagline}</p>
                    <p className="text-silver-400 font-light leading-relaxed max-w-lg mb-6 text-sm">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 border border-white/[0.07] text-silver-600 text-[10px] font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6">
                      <Link to={`/projects/${proj.slug}`}
                        className="text-[11px] font-mono tracking-widest uppercase text-white border-b border-white/20 pb-px hover:border-white transition-colors">
                        Case Study →
                      </Link>
                      <a href={proj.github} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors flex items-center gap-1.5">
                        <FiGithub className="w-3.5 h-3.5" /> GitHub
                      </a>
                      {proj.demo && (
                        <a href={proj.demo} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors flex items-center gap-1.5">
                          <FiExternalLink className="w-3.5 h-3.5" /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right — architecture + results */}
                  <div className="lg:w-64 shrink-0">
                    <p className="section-label mb-4">Architecture</p>
                    <div className="space-y-2.5 mb-6">
                      {proj.architecture.map(layer => (
                        <div key={layer.layer} className="flex items-start gap-3 border-b border-white/[0.04] pb-2.5 last:border-0">
                          <span className="text-silver-700 font-mono text-[10px] w-16 shrink-0 pt-px">{layer.layer}</span>
                          <span className="text-silver-400 font-light text-xs leading-snug">{layer.tech}</span>
                        </div>
                      ))}
                    </div>
                    <p className="section-label mb-3">Results</p>
                    {proj.results.slice(0, 3).map((r, j) => (
                      <p key={j} className="text-silver-500 text-xs font-light mb-1.5">· {r}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════════ */}
      <Reveal id="experience" className="bg-surface-1">
        <div className="container-max">
          <motion.p variants={fadeUp} className="section-label mb-5">Experience</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extralight text-white mb-16">
            Work History
          </motion.h2>

          <div className="border-t border-white/[0.05]">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="py-10 border-b border-white/[0.05] grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div>
                  <p className="font-mono text-[10px] text-silver-700 tracking-widest mb-3 uppercase">
                    {exp.year} · {exp.duration} · {exp.location}
                  </p>
                  <h3 className="text-white font-light text-xl mb-1">{exp.role}</h3>
                  <p className="text-silver-500 font-light text-sm mb-4">{exp.company}</p>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-silver-700">{exp.impact}</p>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-silver-400 font-light text-sm leading-relaxed mb-6">{exp.description}</p>
                  <div className="space-y-2 mb-6">
                    {exp.highlights.map((h, j) => (
                      <div key={j} className="flex items-start gap-3 text-sm">
                        <span className="w-px h-4 bg-white/15 mt-1.5 shrink-0" />
                        <span className="text-silver-400 font-light">{h}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map(t => (
                      <span key={t} className="px-2.5 py-0.5 border border-white/[0.07] text-silver-600 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <Reveal id="contact">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left */}
            <div>
              <motion.p variants={fadeUp} className="section-label mb-5">Contact</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extralight text-white leading-tight mb-6">
                Let's build<br />
                <span className="text-silver-500">something together</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-silver-400 font-light leading-relaxed mb-12 text-sm">
                I'm actively looking for internship opportunities in software engineering,
                AI/ML, and full-stack development. Open to relocation and remote roles.
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-0">
                {[
                  { label: 'Email',    value: PROFILE.email,          href: `mailto:${PROFILE.email}` },
                  { label: 'LinkedIn', value: 'kartikjsonawane',      href: PROFILE.linkedin },
                  { label: 'GitHub',   value: PROFILE.githubUsername, href: PROFILE.github },
                  { label: 'Location', value: PROFILE.location,       href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 py-4 border-b border-white/[0.05]">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-silver-700 w-16 shrink-0">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-silver-300 hover:text-white transition-colors font-light text-sm flex items-center gap-1.5">
                        {item.value} <FiExternalLink className="w-3 h-3 opacity-40" />
                      </a>
                    ) : (
                      <span className="text-silver-400 font-light text-sm">{item.value}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Form */}
            <motion.form variants={fadeUp} onSubmit={handleContact} className="space-y-8">
              {[
                { id: 'name',  label: 'Your Name',    type: 'text',  placeholder: 'Recruiter / Engineer' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com' },
              ].map(field => (
                <div key={field.id}>
                  <label className="section-label block mb-3">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.id as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="section-label block mb-3">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell me about the role or project..."
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </div>
      </Reveal>

    </div>
  )
}
