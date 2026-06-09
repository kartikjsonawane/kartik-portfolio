import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { PROFILE } from '@/data/portfolio'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-surface-1">
      <div className="container-max section-padding py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="font-mono text-accent-500 text-xl font-bold">&lt;KS/&gt;</span>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-xs">
              Building intelligent systems at the intersection of AI, web, and mobile development.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Navigation</p>
            <ul className="space-y-2">
              {LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-500 hover:text-emerald-600 dark:hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Connect</p>
            <div className="flex gap-3">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-accent-400 hover:border-accent-500/30 transition-all"
              >
                <FiGithub className="w-4 h-4" />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-accent-400 hover:border-accent-500/30 transition-all"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-accent-400 hover:border-accent-500/30 transition-all"
              >
                <FiMail className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              <a href={`mailto:${PROFILE.email}`} className="hover:text-accent-400 transition-colors">
                {PROFILE.email}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            © {year} Kartik Sonawane. Built with React + Vite + Tailwind.
          </p>
          <p className="text-xs text-neutral-500 font-mono">
            Designed to impress. Built to perform.
          </p>
        </div>
      </div>
    </footer>
  )
}
