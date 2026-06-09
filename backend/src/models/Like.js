import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Target: one of post, project, or comment
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post',    default: null },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true })

// Ensure one like per user per target
likeSchema.index({ user: 1, post: 1 },    { unique: true, sparse: true })
likeSchema.index({ user: 1, project: 1 }, { unique: true, sparse: true })
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true })

export default mongoose.model('Like', likeSchema)
