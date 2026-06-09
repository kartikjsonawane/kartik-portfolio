import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiSave, HiEye } from 'react-icons/hi'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function PostEditor() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle]         = useState('')
  const [excerpt, setExcerpt]     = useState('')
  const [content, setContent]     = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags]           = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [preview, setPreview]     = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/api/posts`)
      .then(({ data }) => {
        const post = data.posts.find((p: any) => p._id === id)
        if (post) {
          setTitle(post.title)
          setExcerpt(post.excerpt || '')
          setContent(post.content || '')
          setCoverImage(post.coverImage || '')
          setTags(post.tags?.join(', ') || '')
          setPublished(post.published)
        }
      })
      .catch(() => toast.error('Failed to load post'))
  }, [id, isEdit])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title,
      excerpt,
      content,
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      published,
    }
    try {
      if (isEdit) {
        await api.patch(`/api/posts/${id}`, payload)
        toast.success('Post updated')
      } else {
        await api.post('/api/posts', payload)
        toast.success('Post created')
        navigate('/admin')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back to dashboard
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <HiEye className="w-4 h-4" />
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                <HiSave className="w-4 h-4" />
                {saving ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          {preview ? (
            /* Preview */
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-4">{title || 'Untitled'}</h1>
              {excerpt && <p className="text-neutral-500 mb-6 text-lg">{excerpt}</p>}
              <div
                className="prose dark:prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            /* Editor */
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Post title…"
                  required
                  className="w-full text-3xl font-semibold bg-transparent border-none outline-none text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Short excerpt…"
                  className="w-full text-base bg-transparent border-none outline-none text-neutral-500 placeholder-neutral-300 dark:placeholder-neutral-600"
                />
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
                <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wide">Content (HTML)</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your post content in HTML…"
                  rows={20}
                  className="w-full px-4 py-3 font-mono text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://…"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="AI, Python, React"
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {published ? 'Published' : 'Draft'}
                </span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
