import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/services/api'

export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/api/auth/me')
        setUser(data.user)
      } catch {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchMe()
    else setLoading(false)
  }, [token])

  const saveToken = (t: string) => {
    setToken(t)
    localStorage.setItem('token', t)
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    saveToken(data.token)
    setUser(data.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    saveToken(data.token)
    setUser(data.user)
  }

  const logout = async () => {
    try { await api.post('/api/auth/logout') } catch { /* ignore */ }
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const updateProfile = async (payload: Partial<User>) => {
    const { data } = await api.patch('/api/auth/me', payload)
    setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, updateProfile,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
