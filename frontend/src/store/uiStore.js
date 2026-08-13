import { create } from 'zustand'

export const useUiStore = create((set) => ({
  isWizardOpen: false,
  wizardStep: 0,
  openWizard: (step = 0) => set({ isWizardOpen: true, wizardStep: step }),
  closeWizard: () => set({ isWizardOpen: false }),
  toggleWizard: () => set((s) => ({ isWizardOpen: !s.isWizardOpen })),
  setWizardStep: (wizardStep) => set({ wizardStep }),
}))
