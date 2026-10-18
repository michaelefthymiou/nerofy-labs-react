import { create } from 'zustand'
import { products } from '../data/products'

type Live = { price: number | null; stock: number }

type StockState = {
  live: Record<string, Live>
  loaded: boolean
  load: () => Promise<void>
}

const fallback = Object.fromEntries(
  products.map((p) => [p.id, { price: p.price, stock: p.stock }]),
) as Record<string, Live>

export const useStock = create<StockState>()((set) => ({
  live: fallback,
  loaded: false,
  load: async () => {
    try {
      const res = await fetch('/.netlify/functions/stock')
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      set({ live: { ...fallback, ...data.products }, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },
}))

export type Availability = 'in-stock' | 'low' | 'out' | 'enquire'

export function availability(info: Live | undefined): Availability {
  if (!info || info.price === null) return 'enquire'
  if (info.stock <= 0) return 'out'
  if (info.stock <= 5) return 'low'
  return 'in-stock'
}

export const canBuy = (info: Live | undefined) => {
  const a = availability(info)
  return a === 'in-stock' || a === 'low'
}
