import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Weitere Felder, z.B. Profile, Rollen, etc.
})

export default mongoose.model('User', userSchema)