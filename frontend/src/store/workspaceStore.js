import { create } from 'zustand'

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
}))
