import { create } from 'zustand';

interface WishlistState {
  items: any[];
  toggleItem: (item: any) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  toggleItem: (item) => set((state) => {
    const exists = state.items.find((i) => i.id === item.id);
    if (exists) {
      return { items: state.items.filter((i) => i.id !== item.id) };
    }
    return { items: [...state.items, item] };
  }),
}));
