import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  category: string; // e.g., 'Washing', 'Ironing'
  price: number;
  quantity: number;
}

interface CartState {
  shopId: string | null;
  shopName: string | null;
  items: CartItem[];
  addItem: (shopId: string, shopName: string, item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shopId: null,
      shopName: null,
      items: [],
      addItem: (shopId, shopName, item) => set((state) => {
        // If ordering from a different shop, reset the cart for safety
        const isNewShop = state.shopId !== shopId;
        const currentItems = isNewShop ? [] : [...state.items];
        
        const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);
        if (existingItemIndex > -1) {
          currentItems[existingItemIndex].quantity += 1;
        } else {
          currentItems.push({ ...item, quantity: 1 });
        }
        return { shopId, shopName, items: currentItems };
      }),
      removeItem: (itemId) => set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== itemId);
        if (updatedItems.length === 0) {
          return { shopId: null, shopName: null, items: [] };
        }
        return { items: updatedItems };
      }),
      updateQuantity: (itemId, quantity) => set((state) => {
        if (quantity <= 0) {
          const updatedItems = state.items.filter((item) => item.id !== itemId);
          return updatedItems.length === 0 
            ? { shopId: null, shopName: null, items: [] } 
            : { items: updatedItems };
        }
        return {
          items: state.items.map((item) => item.id === itemId ? { ...item, quantity } : item)
        };
      }),
      clearCart: () => set({ shopId: null, shopName: null, items: [] }),
      getCartTotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }
    }),
    { name: 'laundro-cart-storage' }
  )
);