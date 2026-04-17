import { create } from 'zustand';

interface UIState {
  activeSizeSelectionId: string | null;
  setActiveSizeSelectionId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSizeSelectionId: null,
  setActiveSizeSelectionId: (id) => set({ activeSizeSelectionId: id }),
}));
