import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  messages:  [messageSchema],
  ip:        { type: String },
}, { timestamps: true })

export default mongoose.model('ChatSession', chatSessionSchema)
