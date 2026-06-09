import { Router } from 'express'
import validator from 'validator'
import Contact from '../models/Contact.js'

const router = Router()

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validate
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address.' })
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Message too short (minimum 10 characters).' })
    }

    const contact = await Contact.create({
      name:    name.trim().slice(0, 100),
      email:   email.trim().toLowerCase(),
      subject: subject?.trim().slice(0, 200) || 'No subject',
      message: message.trim().slice(0, 5000),
      ip:      req.ip,
    })

    console.log(`📨 New contact from ${contact.email}`)
    res.status(201).json({ success: true, message: 'Message received! Kartik will get back to you soon.' })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
})

// GET /api/contact (admin — add auth middleware in production)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50)
    res.json(contacts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts.' })
  }
})

export default router
