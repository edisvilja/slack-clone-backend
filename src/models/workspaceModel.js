import mongoose from "mongoose"
import slugify from "slugify"

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },  // URL zu einem Bild des Arbeitsplatzes
  slug: { type: String, unique: true, required: true },  // URL-freundlicher Name
  primaryOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Direkte Referenz auf einen User
  createdAt: { type: Date, default: Date.now }
});

// Virtuelle Eigenschaft für admins
workspaceSchema.virtual('admins').get(async function() {
  const memberships = await Membership.find({ workspace: this._id, role: { $in: ['admin', 'owner', 'primary_owner'] } })
    .populate('user');
  
  return memberships.map(membership => membership.user);
});

// Virtuelle Eigenschaft für owners
workspaceSchema.virtual('owners').get(async function() {
  const memberships = await Membership.find({ workspace: this._id, role: { $in: ['owner', 'primary_owner'] } })
    .populate('user');

  return memberships.map(membership => membership.user);
});

// Pre-save Hook zum Erzeugen des Slugs
workspaceSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Workspace', workspaceSchema)