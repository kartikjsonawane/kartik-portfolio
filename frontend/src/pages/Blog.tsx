import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { HiHeart, HiEye, HiClock } from 'react-icons/hi'
import api from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  tags: string[]
  author: { name: string; avatar?: string }
  publishedAt: string
  views: number
  likesCount: number
  liked: boolean
}

export default function Blog() {
  const { user } = useAuth()
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tag, setTag]         = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (tag) params.tag = tag
        const { data } = await api.get('/api/posts', { params })
        setPosts(data.posts)
      } catch {
        toast.error('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tag])

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).slice(0, 12)

  const handleLike = async (post: Post, e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { toast('Sign in to like posts', { icon: '🔒' }); return }
    try {
      const { data } = await api.post(`/api/posts/${post._id}/like`)
      setPosts(prev => prev.map(p => p._id === post._id
        ? { ...p, liked: data.liked, likesCount: data.likesCount }
        : p
      ))
    } catch { toast.error('Failed to like post') }
  }

  return (
    <main className="pt-24 pb-24 min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <p className="section-label mb-4">Writing</p>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-4">Blog</h1>
          <p className="text-silver-500 font-light">Thoughts on AI, engineering, and building things</p>
        </motion.div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setTag('')}
              className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase border transition-colors ${
                !tag
                  ? 'bg-white text-black border-white'
                  : 'border-white/[0.08] text-silver-500 hover:border-white/20 hover:text-white'
              }`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? '' : t)}
                className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase border transition-colors ${
                  t === tag
                    ? 'bg-white text-black border-white'
                    : 'border-white/[0.08] text-silver-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="space-y-px bg-white/[0.04]">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-surface-2 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-silver-700 font-mono text-sm">No posts yet.</div>
        ) : (
          <div className="space-y-px bg-white/[0.04]">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex gap-5 bg-black hover:bg-surface-2 transition-colors duration-300 p-6"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-20 h-20 object-cover border border-white/[0.06] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-light text-white group-hover:text-silver-200 transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-silver-600 font-light line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-mono text-silver-700">
                      <span className="flex items-center gap-1">
                        <HiClock className="w-3 h-3" />
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiEye className="w-3 h-3" /> {post.views}
                      </span>
                      <button
                        onClick={(e) => handleLike(post, e)}
                        className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-400' : 'hover:text-red-400'}`}
                      >
                        <HiHeart className="w-3 h-3" /> {post.likesCount}
                      </button>
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="border border-white/[0.07] px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
