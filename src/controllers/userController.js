// controllers/userController.js
import { getCurrentUser, getUserWorkspaces } from '../services/userService';

// Controller-Funktion für das Abrufen des aktuellen Benutzers
export const getCurrentUserController = async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller-Funktion für das Abrufen der Workspaces des Benutzers
export const getUserWorkspacesController = async (req, res) => {
  try {
    const workspaces = await getUserWorkspaces(req);
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};