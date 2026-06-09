import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineMenuAlt3, HiX, HiOutlineSearch,
  HiSun, HiMoon, HiOutlineUser, HiOutlineLogout,
  HiOutlineCog,
} from 'react-icons/hi'
import { PROFILE } from '@/data/portfolio'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Skills',     href: '/skills' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Blog',       href: '/blog' },
  { label: 'Chat',       href: '/chat' },
  { label: 'Contact',    href: '/contact' },
]

interface NavbarProps { onCommandPalette: () => void }

export default function Navbar({ onCommandPalette }: NavbarProps) {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu]     = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const { user, logout, isAdmin } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  const handleLogout = async () => {
    await logout()
    setUserMenu(false)
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-lg font-bold">&lt;KS/&gt;</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={onCommandPalette}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
              >
                <HiOutlineSearch className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="ml-1 font-mono text-[10px] px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">⌘K</kbd>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
              </button>

              {/* Auth */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                      : (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )
                    }
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenu(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                              <HiOutlineCog className="w-4 h-4" />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <HiOutlineUser className="w-4 h-4" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <HiOutlineLogout className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-2 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    Sign out
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Sign in</Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Sign up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
