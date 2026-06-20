import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CommandPalette from '@/components/ui/CommandPalette'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { useCommandPalette } from '@/hooks/useCommandPalette'

// Pages
import Home         from '@/pages/Home'
import ProjectDetail from '@/pages/ProjectDetail'
import Blog         from '@/pages/Blog'
import BlogDetail   from '@/pages/BlogDetail'

// Auth (hidden — used only to access /admin)
import Login    from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin
import AdminDashboard  from '@/pages/admin/Dashboard'
import PostEditor      from '@/pages/admin/PostEditor'
import ProjectManager  from '@/pages/admin/ProjectManager'

function AppInner() {
  const location = useLocation()
  const { isOpen, setIsOpen } = useCommandPalette()

  const noFooterRoutes = ['/admin']
  const hideFooter = noFooterRoutes.some(r => location.pathname.startsWith(r))

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ScrollToTop />
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ── Main one-page portfolio ── */}
          <Route path="/"               element={<Home />} />

          {/* ── Project case study pages ── */}
          <Route path="/projects/:slug" element={<ProjectDetail />} />

          {/* ── Blog ── */}
          <Route path="/blog"           element={<Blog />} />
          <Route path="/blog/:slug"     element={<BlogDetail />} />

          {/* ── Auth (unlisted — needed for /admin access) ── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Admin (protected) ── */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/posts/new" element={
            <ProtectedRoute adminOnly><PostEditor /></ProtectedRoute>
          } />
          <Route path="/admin/posts/:id" element={
            <ProtectedRoute adminOnly><PostEditor /></ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute adminOnly><ProjectManager /></ProtectedRoute>
          } />

          {/* ── Catch-all → home ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>

      {!hideFooter && <Footer />}

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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
