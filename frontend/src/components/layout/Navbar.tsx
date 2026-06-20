import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'

const SECTIONS = [
  { label: 'About',      id: 'about' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Research',   id: 'research' },
  { label: 'Experience', id: 'experience' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Contact',    id: 'contact' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome   = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleNav = (item: typeof SECTIONS[0]) => {
    setMobile(false)
    if (item.href) { navigate(item.href); return }
    if (isHome) { scrollTo(item.id!) } else { navigate('/#' + item.id) }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="font-light text-white text-lg tracking-[0.15em] uppercase">
              Kartik <span className="text-silver-500">Sonawane</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {SECTIONS.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="text-[11px] font-mono tracking-[0.2em] uppercase text-silver-500 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobile(!mobileOpen)}
              className="md:hidden text-silver-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenuAlt3 className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/98 md:hidden flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setMobile(false)}
              className="absolute top-5 right-6 text-silver-500 hover:text-white"
            >
              <HiX className="w-6 h-6" />
            </button>
            {SECTIONS.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNav(item)}
                className="text-2xl font-light tracking-[0.2em] uppercase text-silver-400 hover:text-white transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
