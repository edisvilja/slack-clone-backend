import mongoose from 'mongoose'
import Membership from './membershipModel'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  isAway: { type: Boolean, default: false },
})

userSchema.virtual('workspaces').get(async function () {
  const memberships = await Membership.find({ user: this._id }).populate('workspace')

  return memberships.map(membership => membership.workspace)
})

userSchema.methods.fullObject = async function () {
  const obj = this.toObject({ virtuals: true })

  obj.workspaces = await this.workspaces

  return obj
}

export default mongoose.model('User', userSchema)
