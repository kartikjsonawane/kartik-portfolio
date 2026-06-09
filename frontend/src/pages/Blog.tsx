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
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">Blog</h1>
          <p className="mt-2 text-neutral-500 text-sm">Thoughts on AI, engineering, and building things</p>
        </motion.div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setTag('')}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                !tag
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
              }`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? '' : t)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  t === tag
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">No posts yet.</div>
        ) : (
          <div>
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex gap-4 py-6 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-4 px-4 rounded-lg transition-colors"
                >
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-medium text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <HiClock className="w-3.5 h-3.5" />
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiEye className="w-3.5 h-3.5" />
                        {post.views}
                      </span>
                      <button
                        onClick={(e) => handleLike(post, e)}
                        className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-500' : 'hover:text-red-400'}`}
                      >
                        <HiHeart className="w-3.5 h-3.5" />
                        {post.likesCount}
                      </button>
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">{t}</span>
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
