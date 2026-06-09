import { motion } from 'framer-motion'
import { FiDownload, FiGithub, FiLinkedin, FiMapPin, FiBookOpen } from 'react-icons/fi'
import PageTransition from '@/components/ui/PageTransition'
import { PROFILE, CERTIFICATIONS } from '@/data/portfolio'

const TIMELINE = [
  {
    year: '2021',
    title: 'Started B.Tech — CSE (AI & ML)',
    description: 'Enrolled in Computer Science Engineering with specialization in Artificial Intelligence & Machine Learning. Began learning Python and data structures.',
    type: 'education',
    icon: '🎓',
  },
  {
    year: '2022',
    title: 'Discovered Machine Learning',
    description: 'Completed Andrew Ng\'s ML course and fell in love with the field. Built first neural network from scratch. Started working with NumPy, Pandas, Scikit-learn.',
    type: 'milestone',
    icon: '🧠',
  },
  {
    year: '2023',
    title: 'Full-Stack & Android Development',
    description: 'Expanded into MERN stack web development and Kotlin Android development. Built first full-stack project with authentication and a REST API.',
    type: 'milestone',
    icon: '💻',
  },
  {
    year: '2023',
    title: 'CropMD — First Production ML System',
    description: 'Fine-tuned ResNet-50 on PlantVillage dataset. Deployed Flask API with React frontend. Achieved 96.3% validation accuracy on 38 crop disease classes.',
    type: 'project',
    icon: '🌱',
  },
  {
    year: '2024',
    title: 'Machine Learning Internship',
    description: 'Built end-to-end churn prediction model (XGBoost, 89% ROC-AUC). Deployed as Flask REST API. Created Streamlit business dashboard. Worked on feature engineering and data quality pipelines.',
    type: 'work',
    icon: '💼',
  },
  {
    year: '2024',
    title: 'VisionTrack & DevConnect',
    description: 'Shipped Android app with on-device YOLOv8 inference via TFLite (<30ms latency). Built DevConnect, a full MERN social platform with JWT auth and real-time features.',
    type: 'project',
    icon: '🚀',
  },
  {
    year: '2025',
    title: 'Final Year — Seeking Internship',
    description: 'Final year of B.Tech. Actively targeting AI Engineer, ML Engineer, and Full-Stack Developer internship roles at top tech companies.',
    type: 'education',
    icon: '🎯',
  },
]

const GOALS = [
  { icon: '🤖', title: 'AI Engineering', desc: 'Building and deploying ML systems at production scale' },
  { icon: '🌐', title: 'Full-Stack Systems', desc: 'End-to-end web applications with clean architecture' },
  { icon: '📱', title: 'Mobile + AI', desc: 'On-device AI in Android applications' },
  { icon: '🔬', title: 'Research-to-Product', desc: 'Turning papers into working, deployed software' },
]

const typeColor: Record<string, string> = {
  education: 'border-blue-500/50 bg-blue-500/10',
  milestone:  'border-purple-500/50 bg-purple-500/10',
  project:    'border-accent-500/50 bg-accent-500/10',
  work:       'border-yellow-500/50 bg-yellow-500/10',
}

export default function About() {
  return (
    <PageTransition>
      <div className="pt-24">
        {/* ── HEADER ─────────────────────── */}
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-label">About</span>
              <h1 className="section-title mt-2">The story so far</h1>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Bio Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed"
              >
                <p className="text-lg text-neutral-800 dark:text-neutral-300">
                  I'm <span className="text-neutral-900 dark:text-white font-semibold">Kartik Sonawane</span>, a final-year B.Tech student
                  specializing in AI & Machine Learning. I build software at the intersection of intelligence and usability.
                </p>
                <p>
                  My journey started with Python and a fascination for how machines learn. That curiosity pushed me to
                  explore full-stack web development, Android apps, and eventually deploying real ML models that solve
                  real problems — like helping farmers diagnose crop diseases with a phone photo.
                </p>
                <p>
                  I believe great software is invisible. Whether it's a React component, a Flask API, or a TFLite model
                  running on-device — the technology should disappear and the experience should remain. That principle
                  drives every project I build.
                </p>
                <p>
                  Right now I'm in my final year, actively seeking <span className="text-emerald-600 dark:text-accent-400">AI Engineer,
                  ML Engineer, and Full-Stack Developer</span> internship roles where I can contribute to real
                  production systems and continue growing fast.
                </p>

                {/* Socials */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2">
                    <FiGithub className="w-4 h-4" /> GitHub
                  </a>
                  <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2">
                    <FiLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2">
                    <FiDownload className="w-4 h-4" /> Download Resume
                  </a>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2 p-6 h-fit"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-600 uppercase tracking-widest mb-1">Education</p>
                    <div className="flex items-start gap-2">
                      <FiBookOpen className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">B.Tech CSE (AI & ML)</p>
                        <p className="text-xs text-neutral-500">Final Year — 2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-white/10" />
                  <div>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-600 uppercase tracking-widest mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-accent-500 shrink-0" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">India (Remote-first)</p>
                    </div>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-white/10" />
                  <div>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-600 uppercase tracking-widest mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Machine Learning', 'LLMs', 'Computer Vision', 'System Design', 'Android', 'Open Source'].map(i => (
                        <span key={i} className="badge-neutral">{i}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CAREER GOALS ───────────────── */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Goals</span>
              <h2 className="section-title mt-2 text-3xl">What I'm aiming for</h2>
            </motion.div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GOALS.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2 p-5 card-hover"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">{g.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ───────────────────── */}
        <section className="section-padding bg-neutral-50 dark:bg-surface-1">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Journey</span>
              <h2 className="section-title mt-2 text-3xl">Technical timeline</h2>
            </motion.div>

            <div className="mt-12 relative">
              {/* Vertical line */}
              <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/10 -translate-x-px" />

              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className={`relative flex gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white dark:border-surface-1 bg-neutral-100 dark:bg-surface-3 flex items-center justify-center text-base z-10 shadow-lg">
                      {item.icon}
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block w-1/2" />

                    {/* Card */}
                    <div className="ml-14 lg:ml-0 lg:w-1/2 lg:px-8">
                      <div className={`rounded-xl border p-5 ${typeColor[item.type]}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-neutral-500">{item.year}</span>
                        </div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ──────────────── */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label">Certifications</span>
              <h2 className="section-title mt-2 text-3xl">Credentials</h2>
            </motion.div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2"
                >
                  <span className="text-3xl">{cert.icon}</span>
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{cert.title}</p>
                    <p className="text-sm text-neutral-500">{cert.issuer} — {cert.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
