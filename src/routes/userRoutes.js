import express from 'express'
import { authenticateJWT } from '../middleware/authenticateJWT'
import { getCurrentUserController } from '../controllers/userController'

const protectedRouter = express.Router()

// Middleware zum Authentifizieren
protectedRouter.use(authenticateJWT)

// Route zum Abrufen des aktuellen Benutzers
protectedRouter.get('/', getCurrentUserController)

export default protectedRouter
