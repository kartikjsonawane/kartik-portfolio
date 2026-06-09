import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiGithub, FiLinkedin, FiMail, FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import axios from 'axios'
import PageTransition from '@/components/ui/PageTransition'
import { PROFILE } from '@/data/portfolio'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/contact`, form)
      toast.success('Message sent! I\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please email me directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="pt-24">
        <section className="section-padding pb-0">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-label">Contact</span>
              <h1 className="section-title mt-2">Let's work together</h1>
              <p className="mt-3 text-neutral-500 max-w-xl">
                I'm actively looking for AI/ML and Full-Stack internship opportunities. Whether you have a role, a project idea, or just want to say hi — I'm all ears.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-3"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a topic</option>
                      <option value="Internship Opportunity">Internship Opportunity</option>
                      <option value="Project Collaboration">Project Collaboration</option>
                      <option value="Freelance Work">Freelance Work</option>
                      <option value="Just saying hi">Just saying hi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                      rows={6}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                        />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FiSend className="w-4 h-4" /> Send Message
                      </span>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Info Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-5"
              >
                {/* Direct contacts */}
                {[
                  { icon: FiMail,    label: 'Email',    value: PROFILE.email,    href: `mailto:${PROFILE.email}` },
                  { icon: FiGithub,  label: 'GitHub',   value: '@kartikjsonawane', href: PROFILE.github },
                  { icon: FiLinkedin,label: 'LinkedIn', value: 'Kartik Sonawane', href: PROFILE.linkedin },
                  { icon: FiMapPin,  label: 'Location', value: 'India (Remote-first)', href: null },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-surface-2"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-accent-500" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-mono">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-accent-400 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Status */}
                <div className="p-5 rounded-xl border border-accent-500/20 bg-accent-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-slow" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-accent-400">Available for Internships</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Targeting AI Engineer, ML Engineer, and Full-Stack Developer roles.
                    Final-year student, graduating 2025.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
