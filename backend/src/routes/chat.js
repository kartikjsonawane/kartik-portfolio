import { Router } from 'express'
import Message from '../models/Message.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// GET /api/chat/:room — fetch last N messages
router.get('/:room', protect, async (req, res) => {
  try {
    const { room } = req.params
    const limit = Math.min(Number(req.query.limit) || 50, 100)
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name avatar')
    res.json({ success: true, messages: messages.reverse() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
