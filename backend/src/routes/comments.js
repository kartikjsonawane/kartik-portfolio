import { Router } from 'express'
import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import Project from '../models/Project.js'
import Like from '../models/Like.js'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/comments?post=<id>&project=<id>&parent=<id>
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { post, project, parent } = req.query
    const filter = {}
    if (post) filter.post = post
    if (project) filter.project = project
    filter.parent = parent || null  // top-level if no parent

    const comments = await Comment.find(filter)
      .sort({ createdAt: 1 })
      .populate('author', 'name avatar')

    // attach reply counts
    const enriched = await Promise.all(comments.map(async (c) => {
      const replyCount = await Comment.countDocuments({ parent: c._id })
      const liked = req.user
        ? !!(await Like.findOne({ user: req.user._id, comment: c._id }))
        : false
      return { ...c.toObject(), replyCount, liked }
    }))

    res.json({ success: true, comments: enriched })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/comments
router.post('/', protect, async (req, res) => {
  try {
    const { content, post, project, parent } = req.body
    if (!content) return res.status(400).json({ error: 'Content is required' })
    if (!post && !project) return res.status(400).json({ error: 'post or project is required' })

    const comment = await Comment.create({
      content, author: req.user._id,
      post: post || null,
      project: project || null,
      parent: parent || null,
    })
    await comment.populate('author', 'name avatar')
    res.status(201).json({ success: true, comment })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/comments/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'Comment not found' })
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' })

    comment.content = req.body.content || comment.content
    comment.edited = true
    await comment.save()
    await comment.populate('author', 'name avatar')
    res.json({ success: true, comment })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'Comment not found' })
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' })

    // Delete all replies recursively (simple one-level deep for now)
    await Comment.deleteMany({ parent: comment._id })
    await comment.deleteOne()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/comments/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ error: 'Comment not found' })

    const existing = await Like.findOne({ user: req.user._id, comment: comment._id })
    if (existing) {
      await existing.deleteOne()
      await Comment.findByIdAndUpdate(comment._id, { $inc: { likesCount: -1 } })
      return res.json({ success: true, liked: false, likesCount: comment.likesCount - 1 })
    }
    await Like.create({ user: req.user._id, comment: comment._id })
    await Comment.findByIdAndUpdate(comment._id, { $inc: { likesCount: 1 } })
    res.json({ success: true, liked: true, likesCount: comment.likesCount + 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
