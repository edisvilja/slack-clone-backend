import mongoose from 'mongoose'

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  role: { type: String, enum: ['member', 'admin', 'owner', 'primary_owner'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
})

// Custom Validation für Primary Owner
membershipSchema.path('role').validate({
  isAsync: true,
  validator: async function (value) {
    if (value === 'primary_owner') {
      // Prüfe, ob es bereits einen Primary Owner für den workspace gibt
      const existingPrimaryOwner = await this.constructor.findOne({
        workspace: this.workspace,
        role: 'primary_owner',
        _id: { $ne: this._id }, // Ausschließen des aktuellen Dokuments bei Update
      })
      return !existingPrimaryOwner // true, wenn kein anderer Primary Owner existiert
    }
    return true // Bei anderen Rollen keine zusätzliche Validierung
  },
  message: 'There can only be one primary owner for a workspace.',
})

export default mongoose.model('Membership', membershipSchema)
