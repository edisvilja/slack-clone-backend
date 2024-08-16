import mongoose from 'mongoose'

const authUserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  magicLinkToken: { type: String },
  magicLinkExpires: { type: Date },
})

export default mongoose.model('AuthUser', authUserSchema)
