import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  HiPlus, HiPencil, HiTrash, HiEye, HiHeart,
  HiDocumentText, HiCode, HiChatAlt2,
} from 'react-icons/hi'
import api from '@/services/api'
import toast from 'react-hot-toast'

interface Post {
  _id: string; title: string; slug: string; published: boolean
  views: number; likesCount: number; createdAt: string
}
interface Project {
  _id: string; title: string; slug: string; published: boolean
  featured: boolean; order: number; createdAt: string; likesCount: number
}

export default function AdminDashboard() {
  const [posts, setPosts]       = useState<Post[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tab, setTab]           = useState<'posts' | 'projects'>('posts')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          api.get('/api/posts'),
          api.get('/api/projects'),
        ])
        setPosts(postsRes.data.posts)
        setProjects(projectsRes.data.projects)
      } catch { toast.error('Failed to load data') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/api/posts/${id}`)
      setPosts(prev => prev.filter(p => p._id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Failed to delete') }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/api/projects/${id}`)
      setProjects(prev => prev.filter(p => p._id !== id))
      toast.success('Project deleted')
    } catch { toast.error('Failed to delete') }
  }

  const togglePublishPost = async (post: Post) => {
    try {
      const { data } = await api.patch(`/api/posts/${post._id}`, { published: !post.published })
      setPosts(prev => prev.map(p => p._id === post._id ? data.post : p))
      toast.success(data.post.published ? 'Published' : 'Unpublished')
    } catch { toast.error('Failed') }
  }

  const togglePublishProject = async (project: Project) => {
    try {
      const { data } = await api.patch(`/api/projects/${project._id}`, { published: !project.published })
      setProjects(prev => prev.map(p => p._id === project._id ? data.project : p))
      toast.success(data.project.published ? 'Published' : 'Unpublished')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-neutral-500 mt-1">Manage your content</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Posts', value: posts.length, icon: HiDocumentText, color: 'text-blue-500' },
            { label: 'Projects', value: projects.length, icon: HiCode, color: 'text-emerald-500' },
            { label: 'Total Likes', value: [...posts, ...projects].reduce((s, p) => s + (p.likesCount || 0), 0), icon: HiHeart, color: 'text-red-500' },
            { label: 'Total Views', value: posts.reduce((s, p) => s + (p.views || 0), 0), icon: HiEye, color: 'text-purple-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
              <div className={`${stat.color} mb-2`}><stat.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {(['posts', 'projects'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Posts Table */}
        {tab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-neutral-900 dark:text-white">Blog Posts</h2>
              <Link
                to="/admin/posts/new"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <HiPlus className="w-4 h-4" /> New Post
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                No posts yet.{' '}
                <Link to="/admin/posts/new" className="text-emerald-600 hover:underline">Create your first post</Link>
              </div>
            ) : (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Views</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Likes</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {posts.map(post => (
                      <tr key={post._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-medium text-neutral-900 dark:text-white line-clamp-1">{post.title}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-500">
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-500">{post.views}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-500">{post.likesCount}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => togglePublishPost(post)}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              post.published
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/blog/${post.slug}`} className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                              <HiEye className="w-4 h-4" />
                            </Link>
                            <Link to={`/admin/posts/${post._id}`} className="p-1.5 text-neutral-400 hover:text-blue-600">
                              <HiPencil className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deletePost(post._id)} className="p-1.5 text-neutral-400 hover:text-red-500">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Projects Table */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-neutral-900 dark:text-white">Projects</h2>
              <Link
                to="/admin/projects"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <HiPlus className="w-4 h-4" /> Manage Projects
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                No projects yet.{' '}
                <Link to="/admin/projects" className="text-emerald-600 hover:underline">Add your first project</Link>
              </div>
            ) : (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Likes</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {projects.map(project => (
                      <tr key={project._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 dark:text-white">{project.title}</span>
                            {project.featured && (
                              <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">Featured</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-500">{project.likesCount}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => togglePublishProject(project)}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              project.published
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {project.published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/projects/${project.slug}`} className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                              <HiEye className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteProject(project._id)} className="p-1.5 text-neutral-400 hover:text-red-500">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
