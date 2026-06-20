import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import CommandPalette from '@/components/ui/CommandPalette'
import ScrollToTop    from '@/components/ui/ScrollToTop'
import PageLoader     from '@/components/ui/PageLoader'
import CursorGlow     from '@/components/ui/CursorGlow'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { useCommandPalette } from '@/hooks/useCommandPalette'

import Home          from '@/pages/Home'
import ProjectDetail from '@/pages/ProjectDetail'
import Blog          from '@/pages/Blog'
import BlogDetail    from '@/pages/BlogDetail'

export default function App() {
  const location = useLocation()
  const { isOpen, setIsOpen } = useCommandPalette()

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <PageLoader />
      <ScrollProgress />
      <CursorGlow />
      <ScrollToTop />
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"               element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog"           element={<Blog />} />
          <Route path="/blog/:slug"     element={<BlogDetail />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Footer />

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0',
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, monospace',
          },
          duration: 4000,
        }}
      />
    </div>
  )
}
