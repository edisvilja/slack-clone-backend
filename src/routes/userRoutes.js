import express from "express"
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getCurrentUser, getUserWorkspaces } from '../services/userService';

const protectedRouter = express.Router()
protectedRouter.use(authenticateJWT);

// Route zum Abrufen des aktuellen Benutzers
protectedRouter.get('/', async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Route zum Abrufen aller Workspaces des Benutzers
protectedRouter.get('/workspaces', async (req, res) => {
  try {
    const workspaces = await getUserWorkspaces(req);
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default protectedRouter