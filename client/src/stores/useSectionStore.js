import { create } from 'zustand';

export const useSectionStore = create((set) => ({
  activeSectionId: null,
  sectionProgress: {},
  setActiveSection: (activeSectionId) => set({ activeSectionId }),
  setSectionProgress: (sectionId, progress) =>
    set((state) => ({
      sectionProgress: {
        ...state.sectionProgress,
        [sectionId]: progress
      }
    })),
  resetSectionProgress: () => set({ sectionProgress: {}, activeSectionId: null })
}));
