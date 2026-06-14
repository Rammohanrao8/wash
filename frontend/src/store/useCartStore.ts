import { create } from 'zustand';
import { ShopService } from '@/services/shopService';

export interface CartItem extends ShopService {
  quantity: number;
}

interface CartState {
  shopId: string | null;
  items: CartItem[];
  
  addItem: (shopId: string, service: ShopService) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  shopId: null,
  items: [],
  
  addItem: (shopId, service) => {
    const state = get();
    
    // If adding an item from a different shop, clear the cart first
    if (state.shopId && state.shopId !== shopId) {
      if (!window.confirm('Adding items from a different shop will clear your current cart. Continue?')) {
        return;
      }
      set({ shopId, items: [{ ...service, quantity: 1 }] });
      return;
    }
    
    const existingItem = state.items.find(item => item.id === service.id);
    
    if (existingItem) {
      set({
        items: state.items.map(item => 
          item.id === service.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        shopId,
        items: [...state.items, { ...service, quantity: 1 }]
      });
    }
  },
  
  removeItem: (serviceId) => {
    const state = get();
    const newItems = state.items.filter(item => item.id !== serviceId);
    
    set({
      items: newItems,
      shopId: newItems.length === 0 ? null : state.shopId
    });
  },
  
  updateQuantity: (serviceId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(serviceId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item => 
        item.id === serviceId ? { ...item, quantity } : item
      )
    }));
  },
  
  clearCart: () => set({ shopId: null, items: [] }),
  
  getTotalAmount: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));