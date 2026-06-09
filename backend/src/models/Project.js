import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  content:     { type: String, default: '' },   // detailed writeup
  coverImage:  { type: String, default: '' },
  images:      [{ type: String }],
  tags:        [{ type: String, trim: true }],
  techStack:   [{ type: String, trim: true }],
  liveUrl:     { type: String, default: '' },
  githubUrl:   { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  published:   { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likesCount:  { type: Number, default: 0 },
}, { timestamps: true })

projectSchema.index({ published: 1, order: 1 })

export default mongoose.model('Project', projectSchema)
