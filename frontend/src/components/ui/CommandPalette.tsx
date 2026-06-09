import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineLightningBolt, HiOutlineFolderOpen, HiOutlineUser, HiOutlineMail, HiOutlineCode } from 'react-icons/hi'

const COMMANDS = [
  { id: 'home',       label: 'Go to Home',       shortcut: 'H', icon: HiOutlineLightningBolt, href: '/', category: 'Navigation' },
  { id: 'about',      label: 'Go to About',       shortcut: 'A', icon: HiOutlineUser,          href: '/about', category: 'Navigation' },
  { id: 'skills',     label: 'Go to Skills',      shortcut: 'S', icon: HiOutlineCode,          href: '/skills', category: 'Navigation' },
  { id: 'projects',   label: 'Go to Projects',    shortcut: 'P', icon: HiOutlineFolderOpen,    href: '/projects', category: 'Navigation' },
  { id: 'experience', label: 'Go to Experience',  shortcut: 'E', icon: HiOutlineUser,          href: '/experience', category: 'Navigation' },
  { id: 'contact',    label: 'Go to Contact',     shortcut: 'C', icon: HiOutlineMail,          href: '/contact', category: 'Navigation' },
  { id: 'devconnect', label: 'DevConnect Project', shortcut: '',  icon: HiOutlineFolderOpen,   href: '/projects/devconnect', category: 'Projects' },
  { id: 'visiontrack',label: 'VisionTrack Project',shortcut: '', icon: HiOutlineFolderOpen,    href: '/projects/visiontrack', category: 'Projects' },
  { id: 'cropmd',     label: 'CropMD Project',    shortcut: '',  icon: HiOutlineFolderOpen,    href: '/projects/cropmd', category: 'Projects' },
  { id: 'github',     label: 'Open GitHub',       shortcut: '',  icon: HiOutlineCode,          href: 'https://github.com/kartikjsonawane', category: 'External', external: true },
  { id: 'resume',     label: 'Download Resume',   shortcut: '',  icon: HiOutlineUser,          href: '/Kartik_Sonawane_Resume.pdf', category: 'External', external: true },
]

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => setSelected(0), [query])

  const execute = (cmd: typeof COMMANDS[0]) => {
    if (cmd.external) window.open(cmd.href, '_blank')
    else navigate(cmd.href)
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected])
  }

  const groups = [...new Set(filtered.map(c => c.category))]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4"
          >
            <div className="rounded-xl border border-white/10 bg-surface-2/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <HiOutlineSearch className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Search pages, projects..."
                  className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none"
                />
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-white/10 text-neutral-500 rounded border border-white/10">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-neutral-600 py-8">No results for "{query}"</p>
                ) : (
                  groups.map(group => {
                    const items = filtered.filter(c => c.category === group)
                    const startIdx = filtered.indexOf(items[0])
                    return (
                      <div key={group}>
                        <p className="px-4 py-1.5 text-[10px] font-mono tracking-widest text-neutral-600 uppercase">{group}</p>
                        {items.map((cmd, i) => {
                          const Icon = cmd.icon
                          const idx = startIdx + i
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => execute(cmd)}
                              onMouseEnter={() => setSelected(idx)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                selected === idx ? 'bg-accent-500/10 text-accent-400' : 'text-neutral-300 hover:bg-white/5'
                              }`}
                            >
                              <Icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                              <span>{cmd.label}</span>
                              {cmd.shortcut && (
                                <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 bg-white/10 text-neutral-600 rounded">{cmd.shortcut}</kbd>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-4 text-[10px] text-neutral-600 font-mono">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>ESC close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
