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
