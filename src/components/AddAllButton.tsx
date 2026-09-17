import { ShoppingBag } from 'lucide-react'
import { useCart } from '../lib/cart'
import { euro, type Product } from '../lib/data'

/** Ajoute en un clic tous les produits d'une sélection encore disponibles. */
export default function AddAllButton({ products, label, dark = false }: { products: Product[]; label: string; dark?: boolean }) {
  const { addMany, qtyOf } = useCart()
  const available = products.filter((p) => p.stock > qtyOf(p.slug))
  if (available.length < 2) return null
  const total = available.reduce((s, p) => s + p.price, 0)
  return (
    <button
      onClick={() => addMany(available.map((p) => p.slug))}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition ${
        dark ? 'bg-white text-ink-900 hover:bg-gold-300' : 'bg-ink-900 text-white hover:bg-ink-700'
      }`}
    >
      <ShoppingBag size={16} /> {label} ({available.length} produits · {euro(total)})
    </button>
  )
}
