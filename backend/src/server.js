import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])  // Use Google/Cloudflare DNS — fixes querySrv on Windows
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

import contactRoutes   from './routes/contact.js'
import chatbotRoutes   from './routes/chatbot.js'
import analyticsRoutes from './routes/analytics.js'
import authRoutes      from './routes/auth.js'
import postsRoutes     from './routes/posts.js'
import projectsRoutes  from './routes/projects.js'
import commentsRoutes  from './routes/comments.js'
import chatRoutes      from './routes/chat.js'
import { initSocket }  from './socket/index.js'
import { seedBlogs }  from './seed.js'

const app    = express()
const server = createServer(app)
const PORT   = process.env.PORT || 5000

const CORS_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'https://kartiksonawane.vercel.app',
  /\.vercel\.app$/,
]

// ── Socket.io ─────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: CORS_ORIGINS, credentials: true },
  transports: ['websocket', 'polling'],
})
initSocket(io)

// ── Security & Middleware ──────────────────────────────
app.use(helmet())
app.use(cors({ origin: CORS_ORIGINS, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Rate Limiting ──────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many chatbot requests. Please wait a moment.' },
})

app.use(globalLimiter)

// ── Routes ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))
app.use('/api/auth',     authRoutes)
app.use('/api/posts',    postsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/chat',     chatRoutes)
app.use('/api/contact',  contactRoutes)
app.use('/api/chatbot',  chatbotLimiter, chatbotRoutes)
app.use('/api/analytics', analyticsRoutes)

// ── 404 & Error Handlers ───────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Database & Start ───────────────────────────────────
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        family: 4,  // Force IPv4 — fixes querySrv ECONNREFUSED on Windows
      })
      console.log('✅ MongoDB connected')
      await seedBlogs()
    } else {
      console.warn('⚠️  MONGODB_URI not set — running without database')
    }
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

start()
