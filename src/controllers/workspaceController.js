import { createWorkspace } from '../services/workspaceService'

export const createWorkspaceController = async (req, res) => {
  try {
    const workspaceData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl, // Optionales Bild-URL
      primaryOwner: req.user.id, // Setzt den aktuellen Benutzer als primaryOwner
    }

    const workspace = await createWorkspace(workspaceData)
    res.status(201).json(workspace) // Erfolgreiche Erstellung, Rückgabe des neuen Workspaces
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message }) // Fehlerbehandlung
  }
}
