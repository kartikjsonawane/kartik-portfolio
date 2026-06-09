import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room:    { type: String, default: 'general' },  // room name / channel
}, { timestamps: true })

messageSchema.index({ room: 1, createdAt: -1 })

export default mongoose.model('Message', messageSchema)
