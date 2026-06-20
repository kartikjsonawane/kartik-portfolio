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
        const postRes = await api.get(`/api/posts/${slug}`)
        setPost(postRes.data.post)
        const postId = postRes.data.post._id
        const cRes   = await api.get('/api/comments', { params: { post: postId } })
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
        <div className="w-6 h-6 border border-white/20 border-t-white animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <p className="text-silver-500 mb-4">Post not found.</p>
        <Link to="/blog" className="text-[11px] font-mono tracking-widest uppercase text-white border-b border-white/20 hover:border-white transition-colors">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <main className="pt-24 pb-24 min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <Link to="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-silver-600 hover:text-white transition-colors mb-12"
          >
            <HiArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {post.coverImage && (
            <img src={post.coverImage} alt={post.title}
              className="w-full h-56 object-cover mb-10 border border-white/[0.06]" />
          )}

          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 border border-white/[0.08] text-silver-500 text-[10px] font-mono">
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl lg:text-4xl font-extralight text-white leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-5 mb-12 text-[11px] font-mono text-silver-600">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {post.views}</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-400' : 'hover:text-red-400'}`}
            >
              <HiHeart className="w-3.5 h-3.5" /> {post.likesCount}
            </button>
          </div>

          {/* Article body */}
          <div
            className="prose-mercedes"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }}
          />

          {/* Comments */}
          <div className="mt-20 border-t border-white/[0.05] pt-12">
            <h2 className="text-xl font-extralight text-white mb-8 tracking-wide">
              Comments <span className="text-silver-600">({comments.length})</span>
            </h2>

            {user ? (
              <form onSubmit={handleComment} className="mb-10">
                {replyTo && (
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-mono text-silver-600">
                    <span>Replying to <strong className="text-silver-300">{replyTo.author.name}</strong></span>
                    <button type="button" onClick={() => setReplyTo(null)} className="text-red-400 hover:text-red-300 ml-2">✕</button>
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="input-field resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mb-8 text-sm font-light text-silver-600">
                <Link to="/login" className="text-white border-b border-white/20 hover:border-white transition-colors">
                  Sign in
                </Link>{' '}to leave a comment.
              </p>
            )}

            <div className="space-y-6">
              {comments.map(c => (
                <div key={c._id} className="flex gap-4 py-4 border-b border-white/[0.05]">
                  <div className="w-7 h-7 border border-white/10 flex items-center justify-center text-[10px] font-mono text-silver-500 shrink-0 mt-0.5">
                    {c.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-sm font-light text-white">{c.author.name}</span>
                      <span className="text-[10px] font-mono text-silver-700">
                        {format(new Date(c.createdAt), 'MMM d, yyyy')}
                      </span>
                      {c.edited && <span className="text-[10px] font-mono text-silver-700">(edited)</span>}
                    </div>
                    <p className="text-sm font-light text-silver-400 leading-relaxed">{c.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLikeComment(c)}
                        className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${c.liked ? 'text-red-400' : 'text-silver-700 hover:text-red-400'}`}
                      >
                        <HiHeart className="w-3 h-3" /> {c.likesCount}
                      </button>
                      {user && (
                        <button
                          onClick={() => setReplyTo(c)}
                          className="flex items-center gap-1 text-[11px] font-mono text-silver-700 hover:text-white transition-colors"
                        >
                          <HiReply className="w-3 h-3" /> Reply
                        </button>
                      )}
                      {(user?._id === c.author._id || isAdmin) && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="flex items-center gap-1 text-[11px] font-mono text-silver-700 hover:text-red-400 transition-colors"
                        >
                          <HiTrash className="w-3 h-3" />
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
