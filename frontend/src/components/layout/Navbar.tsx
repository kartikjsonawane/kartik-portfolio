import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenuAlt3, HiX, HiOutlineLogout, HiOutlineCog } from 'react-icons/hi'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const SECTIONS = [
  { label: 'About',      id: 'about' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Contact',    id: 'contact' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const [userMenu, setUserMenu]   = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setUserMenu(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleNav = (item: typeof SECTIONS[0]) => {
    setMobile(false)
    if (item.href) { navigate(item.href); return }
    if (isHome) { scrollTo(item.id!) } else { navigate('/#' + item.id) }
  }

  const handleLogout = async () => {
    await logout(); setUserMenu(false)
    toast.success('Signed out'); navigate('/')
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
            <Link to="/" className="flex items-center gap-3 group">
              <span className="font-light text-white text-lg tracking-[0.15em] uppercase">
                Kartik <span className="text-silver-500">Sonawane</span>
              </span>
            </Link>

            {/* Desktop Nav */}
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

            {/* Right — admin only shown if logged in as admin */}
            <div className="flex items-center gap-4">
              {user && isAdmin && (
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs text-silver-400 hover:border-white/50 hover:text-white transition-all"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-48 bg-surface-3 border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-xs text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-silver-600 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link to="/admin" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-silver-400 hover:text-white hover:bg-white/5 transition-colors">
                            <HiOutlineCog className="w-3.5 h-3.5" /> Admin
                          </Link>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                            <HiOutlineLogout className="w-3.5 h-3.5" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobile(!mobileOpen)}
                className="md:hidden text-silver-400 hover:text-white transition-colors"
              >
                {mobileOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenuAlt3 className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/98 md:hidden flex flex-col items-center justify-center gap-8"
          >
            <button onClick={() => setMobile(false)} className="absolute top-5 right-6 text-silver-500 hover:text-white">
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
            {user && isAdmin && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-3 mt-4">
                <Link to="/admin" onClick={() => setMobile(false)}
                  className="text-xs font-mono tracking-widest text-silver-600 hover:text-silver-300 uppercase transition-colors">
                  Admin Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="text-xs font-mono tracking-widest text-red-500 hover:text-red-400 uppercase transition-colors">
                  Sign Out
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
