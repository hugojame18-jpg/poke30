import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProduct, type Product } from './data'
import { SHOP } from './config'
import { track } from './analytics'

type Line = { slug: string; qty: number }
type CartCtx = {
  lines: (Line & { product: Product })[]
  count: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  promo: string | null
  applyPromo: (code: string) => boolean
  removePromo: () => void
  open: boolean
  setOpen: (v: boolean) => void
  add: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
  qtyOf: (slug: string) => number
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'pokeloot-cart'
const PROMO_KEY = 'pokeloot-promo'

function load(): Line[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((l) => getProduct(l.slug)) : []
  } catch {
    return []
  }
}
function save(key: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(key)
    else localStorage.setItem(key, v)
  } catch {
    /* storage unavailable */
  }
}

const clamp = (slug: string, q: number) => Math.max(0, Math.min(q, getProduct(slug)?.stock ?? 0))

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>(load)
  const [open, setOpenState] = useState(false)
  const [promo, setPromo] = useState<string | null>(() => {
    try {
      const p = localStorage.getItem(PROMO_KEY)
      return p && SHOP.promoCodes[p] ? p : null
    } catch {
      return null
    }
  })

  useEffect(() => save(KEY, JSON.stringify(raw)), [raw])
  useEffect(() => save(PROMO_KEY, promo), [promo])

  const lines = useMemo(() => raw.map((l) => ({ ...l, product: getProduct(l.slug)! })), [raw])
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0)

  const setOpen = useCallback(
    (v: boolean) => {
      if (v) track.viewCart(lines, subtotal)
      setOpenState(v)
    },
    [lines, subtotal],
  )

  const add = useCallback((slug: string) => {
    const p = getProduct(slug)
    if (!p) return
    track.addToCart(p, 1)
    // Un seul article par commande : le total doit correspondre à un lien de paiement (19,99 € ou 49,99 €)
    setRaw([{ slug, qty: clamp(slug, 1) }])
    setOpenState(true)
  }, [])

  const value = useMemo<CartCtx>(() => {
    const pct = promo ? SHOP.promoCodes[promo] ?? 0 : 0
    const discount = Math.round(subtotal * pct) / 100
    const shipping = subtotal === 0 || subtotal - discount >= SHOP.freeShippingFrom ? 0 : SHOP.shippingPrice
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      promo,
      applyPromo: (code) => {
        const c = code.trim().toUpperCase()
        if (!SHOP.promoCodes[c]) return false
        setPromo(c)
        return true
      },
      removePromo: () => setPromo(null),
      open,
      setOpen,
      add,
      setQty: (slug, qty) => {
        const cur = raw.find((l) => l.slug === slug)
        const p = getProduct(slug)
        if (cur && p && qty < cur.qty) track.removeFromCart(p, cur.qty - qty)
        if (cur && p && qty > cur.qty) track.addToCart(p, qty - cur.qty)
        setRaw((c) => (qty <= 0 ? c.filter((l) => l.slug !== slug) : c.map((l) => (l.slug === slug ? { ...l, qty: clamp(slug, qty) } : l))))
      },
      remove: (slug) => {
        const cur = raw.find((l) => l.slug === slug)
        if (cur) track.removeFromCart(getProduct(slug)!, cur.qty)
        setRaw((c) => c.filter((l) => l.slug !== slug))
      },
      clear: () => setRaw([]),
      qtyOf: (slug) => raw.find((l) => l.slug === slug)?.qty ?? 0,
    }
  }, [lines, subtotal, promo, open, setOpen, add, raw])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
