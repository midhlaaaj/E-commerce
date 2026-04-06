import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number; // Discounted Price
  originalPrice: number; // Original MRP
  image: string;
  size: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, size: string) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  totalMRP: () => number;
  totalSavings: () => number;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => set((state) => {
        const existingItem = state.items.find(
          (item) => item.id === product.id && item.size === size
        );

        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.offer_price || product.price,
          originalPrice: product.price,
          image: product.images?.[0] || '',
          size,
          color: product.color || undefined,
          quantity: 1,
        };

        return { items: [...state.items, newItem] };
      }),

      removeItem: (id, size) => set((state) => ({
        items: state.items.filter((item) => !(item.id === id && item.size === size)),
      })),

      updateQuantity: (id, size, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      subtotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),

      totalMRP: () => get().items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0),

      totalSavings: () => {
        const mrp = get().totalMRP();
        const discount = get().subtotal();
        return Math.max(0, mrp - discount);
      },
      selectedAddressId: null,
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
    }),
    {
      name: 'elitewear-cart-storage',
    }
  )
);
