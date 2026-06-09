import { Router } from 'express'
import Post from '../models/Post.js'
import Like from '../models/Like.js'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js'

const router = Router()

// Slug helper
const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// GET /api/posts — list published posts (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query
    const filter = req.user?.role === 'admin' ? {} : { published: true }
    if (tag) filter.tags = tag

    const posts = await Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'name avatar')

    const total = await Post.countDocuments(filter)

    // Add liked flag if user is authenticated
    let likedIds = new Set()
    if (req.user) {
      const likes = await Like.find({ user: req.user._id, post: { $in: posts.map(p => p._id) } })
      likedIds = new Set(likes.map(l => l.post.toString()))
    }

    const enriched = posts.map(p => ({
      ...p.toObject(),
      liked: likedIds.has(p._id.toString()),
    }))

    res.json({ success: true, posts: enriched, total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/posts/:slug — single post
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar')
    if (!post) return res.status(404).json({ error: 'Post not found' })
    if (!post.published && req.user?.role !== 'admin')
      return res.status(404).json({ error: 'Post not found' })

    // Increment views
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    const liked = req.user
      ? !!(await Like.findOne({ user: req.user._id, post: post._id }))
      : false

    res.json({ success: true, post: { ...post.toObject(), views: post.views + 1, liked } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/posts — create (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, tags, published } = req.body
    const slug = slugify(title) + '-' + Date.now().toString(36)
    const post = await Post.create({
      title, slug, excerpt, content, coverImage, tags,
      author: req.user._id,
      published: published || false,
      publishedAt: published ? new Date() : null,
    })
    res.status(201).json({ success: true, post })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/posts/:id — update (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, tags, published } = req.body
    const update = { title, excerpt, content, coverImage, tags, published }
    if (published) update.publishedAt = new Date()
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ success: true, post })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/posts/:id — delete (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const existing = await Like.findOne({ user: req.user._id, post: post._id })
    if (existing) {
      await existing.deleteOne()
      await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: -1 } })
      return res.json({ success: true, liked: false, likesCount: post.likesCount - 1 })
    }
    await Like.create({ user: req.user._id, post: post._id })
    await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: 1 } })
    res.json({ success: true, liked: true, likesCount: post.likesCount + 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
