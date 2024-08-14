// routes/protectedRouter.js
import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getCurrentUserController, getUserWorkspacesController } from '../controllers/userController';

const protectedRouter = express.Router();

// Middleware zum Authentifizieren
protectedRouter.use(authenticateJWT);

// Route zum Abrufen des aktuellen Benutzers
protectedRouter.get('/', getCurrentUserController);

// Route zum Abrufen aller Workspaces des Benutzers
protectedRouter.get('/workspaces', getUserWorkspacesController);

export default protectedRouter;