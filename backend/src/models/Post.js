import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  excerpt:     { type: String, required: true, maxlength: 300 },
  content:     { type: String, required: true },   // HTML / markdown
  coverImage:  { type: String, default: '' },
  tags:        [{ type: String, trim: true }],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  published:   { type: Boolean, default: false },
  publishedAt: { type: Date },
  views:       { type: Number, default: 0 },
  likesCount:  { type: Number, default: 0 },
}, { timestamps: true })

postSchema.index({ published: 1, publishedAt: -1 })

export default mongoose.model('Post', postSchema)
