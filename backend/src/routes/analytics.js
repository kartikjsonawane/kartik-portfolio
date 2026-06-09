import { Router } from 'express'
import Visitor from '../models/Visitor.js'

const router = Router()

// POST /api/analytics/pageview — track page visits
router.post('/pageview', async (req, res) => {
  try {
    const { path, referrer } = req.body
    if (!path) return res.status(400).json({ error: 'Path required.' })
    await Visitor.create({
      path:      path.slice(0, 200),
      userAgent: req.headers['user-agent']?.slice(0, 500),
      ip:        req.ip,
      referrer:  referrer?.slice(0, 500),
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to track.' })
  }
})

// GET /api/analytics/stats — summary stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Visitor.countDocuments()
    const last7 = await Visitor.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })
    const topPages = await Visitor.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    res.json({ total, last7Days: last7, topPages })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' })
  }
})

export default router
