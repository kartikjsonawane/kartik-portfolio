import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
  path:      { type: String, required: true },
  userAgent: { type: String },
  ip:        { type: String },
  referrer:  { type: String },
  country:   { type: String },
}, { timestamps: true })

export default mongoose.model('Visitor', visitorSchema)
