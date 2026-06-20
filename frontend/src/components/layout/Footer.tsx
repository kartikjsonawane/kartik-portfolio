import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { PROFILE } from '@/data/portfolio'

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const NAV_SECTIONS = [
  { label: 'About',      id: 'about' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact',    id: 'contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.05] bg-surface-1">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand */}
          <div>
            <p className="text-white font-light text-lg tracking-[0.15em] uppercase mb-4">
              Kartik <span className="text-silver-500">Sonawane</span>
            </p>
            <p className="text-silver-600 text-sm font-light leading-relaxed max-w-xs">
              Building intelligent systems at the intersection of AI, web, and mobile.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label mb-5">Navigation</p>
            <div className="space-y-3">
              {NAV_SECTIONS.map(item => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.id)}
                  className="block text-sm font-light text-silver-600 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a href="/blog" className="block text-sm font-light text-silver-600 hover:text-white transition-colors">
                Blog
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="section-label mb-5">Connect</p>
            <div className="flex items-center gap-4 mb-5">
              {[
                { icon: FiGithub,   href: PROFILE.github,            label: 'GitHub' },
                { icon: FiLinkedin, href: PROFILE.linkedin,          label: 'LinkedIn' },
                { icon: FiMail,     href: `mailto:${PROFILE.email}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 border border-white/[0.08] text-silver-600 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <a href={`mailto:${PROFILE.email}`}
              className="text-silver-600 text-sm font-light hover:text-white transition-colors">
              {PROFILE.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-silver-700">
            © {year} Kartik Sonawane · Built with React + Vite + Tailwind
          </p>
          <p className="text-[11px] font-mono text-silver-700">
            Designed to impress. Built to perform.
          </p>
        </div>
      </div>
    </footer>
  )
}
