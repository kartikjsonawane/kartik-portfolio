import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowLeft, HiPlus, HiPencil, HiTrash, HiX, HiSave } from 'react-icons/hi'
import api from '@/services/api'
import toast from 'react-hot-toast'

interface Project {
  _id: string; title: string; slug: string; description: string
  content?: string; coverImage?: string; images?: string[]
  tags: string[]; techStack: string[]
  liveUrl?: string; githubUrl?: string
  featured: boolean; published: boolean; order: number; likesCount: number
}

const EMPTY: Partial<Project> = {
  title: '', description: '', content: '', coverImage: '',
  tags: [], techStack: [], liveUrl: '', githubUrl: '',
  featured: false, published: false, order: 0,
}

export default function ProjectManager() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [editing, setEditing]   = useState<Partial<Project> | null>(null)
  const [isNew, setIsNew]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  const [form, setForm] = useState({ ...EMPTY, tagsStr: '', techStr: '' } as any)

  useEffect(() => {
    api.get('/api/projects')
      .then(({ data }) => setProjects(data.projects))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setIsNew(true)
    setEditing({ ...EMPTY })
    setForm({ ...EMPTY, tagsStr: '', techStr: '' })
  }

  const openEdit = (p: Project) => {
    setIsNew(false)
    setEditing(p)
    setForm({
      ...p,
      tagsStr: p.tags.join(', '),
      techStr: p.techStack.join(', '),
    })
  }

  const closeModal = () => { setEditing(null); setIsNew(false) }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean),
      techStack: form.techStr.split(',').map((t: string) => t.trim()).filter(Boolean),
    }
    delete payload.tagsStr
    delete payload.techStr

    try {
      if (isNew) {
        const { data } = await api.post('/api/projects', payload)
        setProjects(prev => [data.project, ...prev])
        toast.success('Project created')
      } else {
        const { data } = await api.patch(`/api/projects/${editing!._id}`, payload)
        setProjects(prev => prev.map(p => p._id === editing!._id ? data.project : p))
        toast.success('Project updated')
      }
      closeModal()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/api/projects/${id}`)
      setProjects(prev => prev.filter(p => p._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  const f = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }))

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-2 transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" /> Back
              </button>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Project Manager</h1>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" /> Add Project
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              No projects yet.{' '}
              <button onClick={openNew} className="text-emerald-600 hover:underline">Add your first</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p._id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                  {p.coverImage && (
                    <img src={p.coverImage} alt={p.title} className="w-full h-36 object-cover rounded-lg mb-4" />
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-neutral-900 dark:text-white">{p.title}</h3>
                        {p.featured && <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">Featured</span>}
                        <span className={`px-1.5 py-0.5 text-xs rounded ${p.published ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                          {p.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <HiPencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 dark:border-red-800 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <HiTrash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                  {isNew ? 'Add Project' : 'Edit Project'}
                </h2>
                <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Title *</label>
                    <input required type="text" value={form.title} onChange={e => f('title', e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Description *</label>
                    <textarea required value={form.description} onChange={e => f('description', e.target.value)} rows={2}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Content (HTML)</label>
                    <textarea value={form.content || ''} onChange={e => f('content', e.target.value)} rows={6}
                      className="mt-1 w-full px-3 py-2 font-mono text-xs border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Cover Image URL</label>
                    <input type="url" value={form.coverImage || ''} onChange={e => f('coverImage', e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Order</label>
                    <input type="number" value={form.order || 0} onChange={e => f('order', Number(e.target.value))}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tags</label>
                    <input type="text" value={form.tagsStr || ''} onChange={e => f('tagsStr', e.target.value)} placeholder="React, Node.js"
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Tech Stack</label>
                    <input type="text" value={form.techStr || ''} onChange={e => f('techStr', e.target.value)} placeholder="Python, TensorFlow"
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Live URL</label>
                    <input type="url" value={form.liveUrl || ''} onChange={e => f('liveUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">GitHub URL</label>
                    <input type="url" value={form.githubUrl || ''} onChange={e => f('githubUrl', e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published || false} onChange={e => f('published', e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured || false} onChange={e => f('featured', e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Featured</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50">
                    <HiSave className="w-4 h-4" />
                    {saving ? 'Saving…' : isNew ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
