import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  listingId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  shopId?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.listingId === item.listingId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.listingId === item.listingId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (listingId) =>
        set({ items: get().items.filter((i) => i.listingId !== listingId) }),
      updateQuantity: (listingId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(listingId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.listingId === listingId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "dushanbe-cart" }
  )
);
