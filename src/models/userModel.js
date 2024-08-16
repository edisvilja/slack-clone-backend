import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  isAway: { type: Boolean, default: false },
})

export default mongoose.model('User', userSchema)
