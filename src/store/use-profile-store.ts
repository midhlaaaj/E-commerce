import { create } from 'zustand';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  pincode: string;
  house_no: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  tracking_number: string | null;
  order_items: OrderItem[];
}

interface ProfileState {
  addresses: Address[];
  orders: Order[];
  hasLoadedAddresses: boolean;
  hasLoadedOrders: boolean;
  setAddresses: (addresses: Address[]) => void;
  setOrders: (orders: Order[]) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  addresses: [],
  orders: [],
  hasLoadedAddresses: false,
  hasLoadedOrders: false,

  setAddresses: (addresses) => set({ addresses, hasLoadedAddresses: true }),
  setOrders: (orders) => set({ orders, hasLoadedOrders: true }),

  clearProfile: () => set({ 
    addresses: [], 
    orders: [], 
    hasLoadedAddresses: false, 
    hasLoadedOrders: false 
  }),
}));
