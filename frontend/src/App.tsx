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
import PageLoader from '@/components/ui/PageLoader'
import CursorGlow from '@/components/ui/CursorGlow'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { useCommandPalette } from '@/hooks/useCommandPalette'

import Home          from '@/pages/Home'
import ProjectDetail from '@/pages/ProjectDetail'
import Blog          from '@/pages/Blog'
import BlogDetail    from '@/pages/BlogDetail'
import Login         from '@/pages/auth/Login'
import Register      from '@/pages/auth/Register'
import AdminDashboard  from '@/pages/admin/Dashboard'
import PostEditor      from '@/pages/admin/PostEditor'
import ProjectManager  from '@/pages/admin/ProjectManager'

function AppInner() {
  const location = useLocation()
  const { isOpen, setIsOpen } = useCommandPalette()

  const hideFooter = location.pathname.startsWith('/admin')

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

          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

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
