import { useState, useEffect, useRef, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { HiPaperAirplane } from 'react-icons/hi'
import { useAuth } from '@/contexts/AuthContext'
import { getSocket, disconnectSocket } from '@/services/socket'
import api from '@/services/api'
import toast from 'react-hot-toast'

interface Message {
  _id: string
  content: string
  author: { _id: string; name: string; avatar?: string }
  room: string
  createdAt: string
}

const ROOM = 'general'

export default function Chat() {
  const { user, token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Load message history
    api.get(`/api/chat/${ROOM}`)
      .then(({ data }) => setMessages(data.messages))
      .catch(() => toast.error('Failed to load messages'))

    if (!token) return
    const socket = getSocket(token)
    socket.connect()
    socket.emit('join_room', ROOM)

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })
    socket.on('typing', ({ name }: { name: string }) => {
      setTyping(prev => prev.includes(name) ? prev : [...prev, name])
    })
    socket.on('stopped_typing', ({ userId }: { userId: string }) => {
      setTyping(prev => prev.filter(n => n !== userId))
    })

    return () => {
      socket.emit('leave_room', ROOM)
      disconnectSocket()
    }
  }, [token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const socket = token ? getSocket(token) : null
    if (!socket) return
    socket.emit('typing_start', { room: ROOM })
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      socket.emit('typing_stop', { room: ROOM })
    }, 1500)
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !token) return
    const socket = getSocket(token)
    socket.emit('send_message', { room: ROOM, content: input.trim() })
    setInput('')
    socket.emit('typing_stop', { room: ROOM })
  }

  return (
    <div className="flex flex-col h-screen pt-16 bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
        <h1 className="text-base font-semibold text-neutral-900 dark:text-white">General Chat</h1>
        <span className="text-xs text-neutral-400 ml-auto">{connected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-neutral-400 text-sm mt-20">No messages yet. Say hello!</div>
        )}
        {messages.map(msg => {
          const isOwn = msg.author._id === user?._id
          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {msg.author.name.charAt(0).toUpperCase()}
              </div>
              <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                <span className={`text-xs text-neutral-400 mb-1 ${isOwn ? 'text-right' : ''}`}>
                  {isOwn ? 'You' : msg.author.name} · {format(new Date(msg.createdAt), 'HH:mm')}
                </span>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isOwn
                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          )
        })}

        {typing.filter(n => n !== user?.name).length > 0 && (
          <p className="text-xs text-neutral-400 italic">
            {typing.filter(n => n !== user?.name).join(', ')} {typing.length === 1 ? 'is' : 'are'} typing…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-4 md:px-8 py-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Message #general…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || !connected}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
          >
            <HiPaperAirplane className="w-4 h-4 rotate-90" />
          </button>
        </div>
      </form>
    </div>
  )
}
