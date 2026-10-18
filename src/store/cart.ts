import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShippingMethod = 'locker' | 'door'

/* Delivery prices. Keep in sync with SHIPPING in netlify/lib/store.mjs */
export const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; blurb: string; price: number }> = {
  locker: {
    label: 'PUDO locker collection',
    blurb: 'Collect from a PUDO locker near you. 2 to 4 working days.',
    price: 60,
  },
  door: {
    label: 'Door delivery',
    blurb: 'Delivered to your home or office. 2 to 4 working days.',
    price: 99,
  },
}

export type CartItem = { id: string; name: string; price: number; image: string; qty: number }

type CartState = {
  items: CartItem[]
  shipping: ShippingMethod
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  setShipping: (method: ShippingMethod) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      shipping: 'locker',
      addItem: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, qty: Math.min(i.qty + qty, 20) } : i,
              ),
            }
          }
          return { items: [...s.items, { ...item, qty: Math.min(qty, 20) }] }
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i)),
        })),
      setShipping: (method) => set({ shipping: method }),
      clear: () => set({ items: [], shipping: 'locker' }),
    }),
    /* skipHydration keeps the prerendered HTML and the first client render identical.
       App calls useCart.persist.rehydrate() after mount. */
    { name: 'nerofy-cart', skipHydration: true },
  ),
)

export const countItems = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0)
export const subtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price * i.qty, 0)
export const orderTotal = (items: CartItem[], shipping: ShippingMethod) =>
  subtotal(items) + (items.length ? SHIPPING_OPTIONS[shipping].price : 0)
export const formatRand = (amount: number) =>
  'R' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
