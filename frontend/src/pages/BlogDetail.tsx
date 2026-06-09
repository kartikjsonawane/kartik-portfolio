import { useState, useEffect, FormEvent } from 'react'
import { marked } from 'marked'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { HiHeart, HiEye, HiArrowLeft, HiTrash, HiReply } from 'react-icons/hi'
import api from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface Post {
  _id: string; title: string; slug: string; excerpt: string
  content: string; coverImage?: string; tags: string[]
  author: { name: string; avatar?: string }
  publishedAt: string; views: number; likesCount: number; liked: boolean
}
interface Comment {
  _id: string; content: string; edited: boolean; likesCount: number; liked: boolean
  author: { _id: string; name: string; avatar?: string }
  createdAt: string; replyCount: number
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isAdmin } = useAuth()

  const [post, setPost]         = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [replyTo, setReplyTo]   = useState<Comment | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/api/posts/${slug}`),
          api.get('/api/comments', { params: {} }),
        ])
        setPost(postRes.data.post)
        // Load comments for this post after we have post._id
        const postId = postRes.data.post._id
        const cRes = await api.get('/api/comments', { params: { post: postId } })
        setComments(cRes.data.comments)
      } catch {
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleLike = async () => {
    if (!user || !post) { toast('Sign in to like', { icon: '🔒' }); return }
    try {
      const { data } = await api.post(`/api/posts/${post._id}/like`)
      setPost(prev => prev ? { ...prev, liked: data.liked, likesCount: data.likesCount } : prev)
    } catch { toast.error('Failed') }
  }

  const handleComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) { toast('Sign in to comment', { icon: '🔒' }); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post('/api/comments', {
        content: commentText.trim(),
        post: post?._id,
        parent: replyTo?._id || null,
      })
      setComments(prev => [data.comment, ...prev])
      setCommentText('')
      setReplyTo(null)
      toast.success('Comment added')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      await api.delete(`/api/comments/${id}`)
      setComments(prev => prev.filter(c => c._id !== id))
    } catch { toast.error('Failed to delete') }
  }

  const handleLikeComment = async (comment: Comment) => {
    if (!user) { toast('Sign in to like', { icon: '🔒' }); return }
    try {
      const { data } = await api.post(`/api/comments/${comment._id}/like`)
      setComments(prev => prev.map(c => c._id === comment._id
        ? { ...c, liked: data.liked, likesCount: data.likesCount }
        : c
      ))
    } catch { toast.error('Failed') }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <p className="text-neutral-500">Post not found.</p>
        <Link to="/blog" className="text-emerald-600 hover:underline mt-4 inline-block">← Back to blog</Link>
      </div>
    )
  }

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8 transition-colors">
            <HiArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full h-60 object-cover rounded-2xl mb-8" />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full">{t}</span>
            ))}
          </div>

          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><HiEye className="w-4 h-4" />{post.views}</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <HiHeart className="w-4 h-4" />
              {post.likesCount}
            </button>
          </div>

          <div
            className="mt-10 prose dark:prose-invert prose-sm max-w-none prose-headings:font-semibold prose-a:text-emerald-600"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }}
          />

          {/* Comments */}
          <div className="mt-16 border-t border-neutral-100 dark:border-neutral-800 pt-10">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-8">
                {replyTo && (
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500">
                    <span>Replying to <strong>{replyTo.author.name}</strong></span>
                    <button type="button" onClick={() => setReplyTo(null)} className="text-red-400 hover:text-red-500">✕</button>
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                  >
                    {submitting ? 'Posting…' : 'Post comment'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mb-8 text-sm text-neutral-500">
                <Link to="/login" className="text-emerald-600 hover:underline">Sign in</Link> to leave a comment.
              </p>
            )}

            {/* Comment list */}
            <div className="space-y-6">
              {comments.map(c => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {c.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{c.author.name}</span>
                      <span className="text-xs text-neutral-400">{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
                      {c.edited && <span className="text-xs text-neutral-400">(edited)</span>}
                    </div>
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{c.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleLikeComment(c)}
                        className={`flex items-center gap-1 text-xs transition-colors ${c.liked ? 'text-red-500' : 'text-neutral-400 hover:text-red-400'}`}
                      >
                        <HiHeart className="w-3.5 h-3.5" /> {c.likesCount}
                      </button>
                      {user && (
                        <button
                          onClick={() => setReplyTo(c)}
                          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-emerald-500 transition-colors"
                        >
                          <HiReply className="w-3.5 h-3.5" /> Reply
                        </button>
                      )}
                      {(user?._id === c.author._id || isAdmin) && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
