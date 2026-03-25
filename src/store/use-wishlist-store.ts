import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/product/ProductCard';

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleItem: (product) => set((state) => {
        const exists = state.items.some((item) => item.id === product.id);
        if (exists) {
          return { items: state.items.filter((item) => item.id !== product.id) };
        }
        return { items: [...state.items, product] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      isInWishlist: (id) => get().items.some((item) => item.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'elitewear-wishlist-storage',
    }
  )
);
