import { Router } from 'express'
import Project from '../models/Project.js'
import Like from '../models/Like.js'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js'

const router = Router()

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// GET /api/projects
router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { published: true }
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate('author', 'name avatar')

    let likedIds = new Set()
    if (req.user) {
      const likes = await Like.find({ user: req.user._id, project: { $in: projects.map(p => p._id) } })
      likedIds = new Set(likes.map(l => l.project.toString()))
    }

    const enriched = projects.map(p => ({
      ...p.toObject(),
      liked: likedIds.has(p._id.toString()),
    }))

    res.json({ success: true, projects: enriched })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/projects/:slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('author', 'name avatar')
    if (!project) return res.status(404).json({ error: 'Project not found' })
    if (!project.published && req.user?.role !== 'admin')
      return res.status(404).json({ error: 'Project not found' })

    const liked = req.user
      ? !!(await Like.findOne({ user: req.user._id, project: project._id }))
      : false

    res.json({ success: true, project: { ...project.toObject(), liked } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/projects (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, content, coverImage, images, tags, techStack, liveUrl, githubUrl, featured, published, order } = req.body
    const slug = slugify(title) + '-' + Date.now().toString(36)
    const project = await Project.create({
      title, slug, description, content, coverImage, images, tags, techStack,
      liveUrl, githubUrl, featured, published, order,
      author: req.user._id,
    })
    res.status(201).json({ success: true, project })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/projects/:id (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/projects/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/projects/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    const existing = await Like.findOne({ user: req.user._id, project: project._id })
    if (existing) {
      await existing.deleteOne()
      await Project.findByIdAndUpdate(project._id, { $inc: { likesCount: -1 } })
      return res.json({ success: true, liked: false, likesCount: project.likesCount - 1 })
    }
    await Like.create({ user: req.user._id, project: project._id })
    await Project.findByIdAndUpdate(project._id, { $inc: { likesCount: 1 } })
    res.json({ success: true, liked: true, likesCount: project.likesCount + 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
