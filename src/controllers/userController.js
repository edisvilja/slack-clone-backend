// controllers/userController.js
import { getCurrentUser } from '../services/userService'

// Controller-Funktion für das Abrufen des aktuellen Benutzers
export const getCurrentUserController = async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    res.json(await user.fullObject())
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
