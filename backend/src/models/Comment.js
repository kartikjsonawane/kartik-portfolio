import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content:    { type: String, required: true, trim: true, maxlength: 1000 },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Either a post or a project
  post:       { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  project:    { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  parent:     { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likesCount: { type: Number, default: 0 },
  edited:     { type: Boolean, default: false },
}, { timestamps: true })

commentSchema.index({ post: 1, createdAt: 1 })
commentSchema.index({ project: 1, createdAt: 1 })
commentSchema.index({ parent: 1 })

export default mongoose.model('Comment', commentSchema)
