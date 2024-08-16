import Workspace from '../models/workspaceModel'
import Membership from '../models/membershipModel'

export const createWorkspace = async workspaceData => {
  try {
    // Erstelle den neuen Workspace
    workspaceData.slug = 'undefined'
    const newWorkspace = new Workspace(workspaceData)
    await newWorkspace.save() // Speichert den neuen Workspace in der Datenbank

    // Erstelle die Mitgliedschaft für den primaryOwner
    const membership = new Membership({
      user: workspaceData.primaryOwner,
      workspace: newWorkspace._id,
      role: 'primary_owner',
    })
    await membership.save() // Speichert die Membership in der Datenbank

    return newWorkspace
  } catch (error) {
    throw new Error('Error creating workspace: ' + error.message)
  }
}
