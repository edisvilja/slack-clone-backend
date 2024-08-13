import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the channel
  workplace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workplace', required: true },  // Reference to the Workplace
  createdAt: { type: Date, default: Date.now },  // Creation date
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }],  // References to Memberships
  topic: { type: String },  // Topic of the channel
  description: { type: String }  // Description of the channel
})

// Virtual field to get the message history for this channel
channelSchema.virtual('history', {
  ref: 'Message',  // The model to use
  localField: '_id',  // Field in the `Channel` schema
  foreignField: 'receiverChannel',  // Field in the `Message` schema
  justOne: false,  // If true, will only return one message; false returns an array
  options: { sort: { createdAt: -1 } }  // Sort messages by creation date, newest first
})

// Ensure the virtuals are included when converting to JSON
channelSchema.set('toJSON', { virtuals: true })
channelSchema.set('toObject', { virtuals: true })

export default mongoose.model('Channel', channelSchema)