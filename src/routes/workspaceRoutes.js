import express from "express"
import { authenticateJWT } from "../middleware/authenticateJWT"
import { createWorkspaceController } from "../controllers/workspaceController"

const protectedRouter = express.Router()

// Middleware zum Authentifizieren
protectedRouter.use(authenticateJWT)

protectedRouter.post('/', createWorkspaceController)

export default protectedRouter