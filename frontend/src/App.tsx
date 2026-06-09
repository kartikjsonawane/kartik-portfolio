import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CommandPalette from '@/components/ui/CommandPalette'
import AskKartik from '@/components/chatbot/AskKartik'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { useCommandPalette } from '@/hooks/useCommandPalette'

// Public pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import Skills from '@/pages/Skills'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Experience from '@/pages/Experience'
import Blog from '@/pages/Blog'
import BlogDetail from '@/pages/BlogDetail'
import Contact from '@/pages/Contact'
import Chat from '@/pages/Chat'

// Auth pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard'
import PostEditor from '@/pages/admin/PostEditor'
import ProjectManager from '@/pages/admin/ProjectManager'

function AppInner() {
  const location = useLocation()
  const { isOpen, setIsOpen } = useCommandPalette()

  const noFooterRoutes = ['/chat', '/admin']
  const hideFooter = noFooterRoutes.some(r => location.pathname.startsWith(r))

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-x-hidden transition-colors duration-300">
      <ScrollToTop />
      <Navbar onCommandPalette={() => setIsOpen(true)} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/"               element={<Home />} />
          <Route path="/about"          element={<About />} />
          <Route path="/skills"         element={<Skills />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/experience"     element={<Experience />} />
          <Route path="/blog"           element={<Blog />} />
          <Route path="/blog/:slug"     element={<BlogDetail />} />
          <Route path="/contact"        element={<Contact />} />

          {/* Auth */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated */}
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />

          {/* Admin */}
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
        </Routes>
      </AnimatePresence>

      {!hideFooter && <Footer />}

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AskKartik />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-neutral-800 dark:text-white dark:border-neutral-700',
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
