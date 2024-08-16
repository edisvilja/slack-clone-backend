import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true }, // The actual message content
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who sent the message
  receiverUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Recipient if the message is directed at a user
  receiverChannel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }, // Optional: Recipient if the message is directed at a channel
  createdAt: { type: Date, default: Date.now }, // Timestamp when the message was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp when the message was last updated
  attachments: [{ type: String }], // Optional: Array of attachment URLs or metadata
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Optional: References to replies
})

// Custom validation to ensure only one of `receiverUser` or `receiverChannel` is set
messageSchema.path('receiverChannel').validate(function (value) {
  return !(this.receiverUser && value)
}, 'Message cannot be directed to both a user and a channel.')

messageSchema.path('receiverUser').validate(function (value) {
  return !(this.receiverChannel && value)
}, 'Message cannot be directed to both a user and a channel.')

// Middleware to enforce message sending constraints
messageSchema.pre('save', async function (next) {
  if (this.receiverChannel) {
    // Check if sender is a member of the channel
    const channel = await Channel.findById(this.receiverChannel).exec()
    if (!channel) {
      return next(new Error('Channel not found.'))
    }

    const isMember = await Membership.exists({
      user: this.sender,
      workspace: channel.workspace,
      isActive: true,
    }).exec()

    if (!isMember) {
      return next(new Error('Sender is not a member of the channel.'))
    }
  } else if (this.receiverUser) {
    // Check if both sender and receiver are in the same workspace
    const receiverUser = await User.findById(this.receiverUser).exec()
    if (!receiverUser) {
      return next(new Error('Receiver user not found.'))
    }

    const senderMembership = await Membership.findOne({
      user: this.sender,
      workspace: { $in: receiverUser.workspaces }, // Assuming `workspaces` field in `User` schema
      isActive: true,
    }).exec()

    if (!senderMembership) {
      return next(new Error('Sender is not a member of the same workspace as the receiver.'))
    }
  }

  next()
})

export default mongoose.model('Message', messageSchema)
