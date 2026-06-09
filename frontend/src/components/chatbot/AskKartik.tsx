import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STARTERS = [
  'Tell me about DevConnect',
  'What ML projects has Kartik built?',
  'What technologies does Kartik know?',
  'Why should I hire Kartik?',
  'Tell me about CropMD',
]

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm **Ask Kartik** — an AI trained on Kartik's portfolio, projects, and experience.\n\nAsk me anything about his skills, projects, or background. 👋",
  timestamp: new Date(),
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-accent-400 bg-accent-500/10 px-1 rounded text-xs">$1</code>')
    .replace(/\n/g, '<br/>')
}

export default function AskKartik() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.filter(m => m.id !== 'welcome').map(m => ({
        role: m.role, content: m.content,
      }))
      const res = await axios.post(`${API_URL}/api/chatbot`, {
        message: text,
        history,
      })
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again or email Kartik directly at kartikjaywantsonawane@gmail.com",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl shadow-black/40 transition-all duration-300 ${
          open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'
        } bg-accent-500 text-black font-semibold hover:bg-accent-400`}
      >
        <HiOutlineSparkles className="w-5 h-5" />
        <span className="text-sm">Ask Kartik</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[540px] flex flex-col rounded-2xl border border-white/10 bg-surface-1 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface-2/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center">
                  <HiOutlineSparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ask Kartik</p>
                  <p className="text-[10px] text-neutral-600">AI Portfolio Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
                >
                  <FiMinimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-surface-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <HiOutlineSparkles className="w-3 h-3 text-black" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent-500 text-black font-medium'
                        : 'bg-surface-3 text-neutral-300 border border-white/10'
                    }`}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                    <HiOutlineSparkles className="w-3 h-3 text-black" />
                  </div>
                  <div className="bg-surface-3 border border-white/10 rounded-xl px-3.5 py-3 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-accent-500"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Starters (shown when only welcome msg) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {STARTERS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/10 bg-surface-3 text-neutral-500 hover:text-accent-400 hover:border-accent-500/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/10 bg-surface-2/80 shrink-0">
              <div className="flex items-center gap-2 bg-surface-3 rounded-xl border border-white/10 px-3 py-2 focus-within:border-accent-500/40 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about Kartik..."
                  className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-700 outline-none"
                  disabled={loading}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-400 transition-colors shrink-0"
                >
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
