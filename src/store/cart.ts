import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShippingMethod = 'locker' | 'door'

/* ------------------------------------------------------------------
   Delivery pricing.
   Based on PUDO (The Courier Guy) rates for a small sub-5kg parcel.
   PUDO adjusts these periodically — check the PUDO app against your
   actual box size and edit the two numbers below when they change.
   ------------------------------------------------------------------ */
export const SHIPPING_OPTIONS: Record<
  ShippingMethod,
  { label: string; blurb: string; price: number }
> = {
  locker: {
    label: 'PUDO locker collection',
    blurb: 'Collect from your nearest PUDO locker, 1–3 business days',
    price: 60,
  },
  door: {
    label: 'Door delivery',
    blurb: 'Delivered to your address, 1–3 business days',
    price: 99,
  },
}

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  qty: number
}

type CartState = {
  items: CartItem[]
  shipping: ShippingMethod
  addItem: (item: Omit<CartItem, 'qty'>) => void
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

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, qty: 1 }] }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      setShipping: (method) => set({ shipping: method }),

      clear: () => set({ items: [], shipping: 'locker' }),
    }),
    { name: 'nerofy-cart' },
  ),
)

/* Derived helpers — kept outside the store so they don't trigger renders. */
export const countItems = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty, 0)

export const subtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0)

export const orderTotal = (items: CartItem[], shipping: ShippingMethod) =>
  subtotal(items) + (items.length ? SHIPPING_OPTIONS[shipping].price : 0)

export const formatRand = (amount: number) =>
  `R${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
