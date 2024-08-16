import User from '../models/userModel'
import Membership from '../models/membershipModel'

export const getCurrentUser = async req => {
  try {
    const user = await User.findById(req.user.id) // Benutzer aus der Datenbank abrufen
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw new Error('Error retrieving current user: ' + error.message)
  }
}

export const getUserWorkspaces = async req => {
  try {
    const memberships = await Membership.find({ user: req.user.id }).populate('workspace')

    if (!memberships) {
      throw new Error('No memberships found for the user')
    }

    const workspaces = memberships.map(membership => membership.workspace)
    return workspaces
  } catch (error) {
    throw new Error('Error retrieving user workspaces: ' + error.message)
  }
}
