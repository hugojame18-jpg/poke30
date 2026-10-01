import { Link } from 'react-router-dom'
import { CalendarClock, Check, ShoppingBag } from 'lucide-react'
import { canOrder, euro, isUpcoming, releaseDate, universeOf, type Product } from '../lib/data'
import { useCart } from '../lib/cart'
import { useState, type MouseEvent } from 'react'

export function ProductVisual({ product, className = '' }: { product: Product; className?: string }) {
  const u = universeOf(product.universe)
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" decoding="async" width={400} height={400} className={`h-full w-full object-contain ${className}`} />
  }
  // Visuel de remplacement tant qu'il n'y a pas de photo produit
  return (
    <div
      className={`@container grid h-full w-full place-items-center p-[8%] ${className}`}
      style={{ background: `radial-gradient(circle at 30% 20%, ${u.from}55, transparent 60%), linear-gradient(135deg, ${u.to}, #0b1026)` }}
    >
      <div className="text-center text-white">
        <div className="font-display text-[clamp(0.55rem,17cqw,1.875rem)] font-extrabold leading-none drop-shadow">{u.label}</div>
        <div className="mt-[6cqw] text-[clamp(0.4rem,6cqw,0.75rem)] font-medium uppercase tracking-widest text-white/70">Photo à venir</div>
      </div>
    </div>
  )
}

export function StockPill({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-xs font-semibold text-red-500">Rupture</span>
  if (stock <= 3)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" /> Plus que {stock}
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En stock
    </span>
  )
}

export default function ProductCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  const { add, qtyOf, setOpen } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = qtyOf(product.slug) > 0
  const soldOut = product.stock <= 0
  const orderable = canOrder(product)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    e.currentTarget.style.setProperty('--mx', `${x * 100}%`)
    e.currentTarget.style.setProperty('--my', `${y * 100}%`)
    e.currentTarget.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg)`
  }
  const onLeave = (e: MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = '')

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-2xl ${
        dark ? 'border-white/10 bg-ink-800 text-white hover:shadow-gold-400/10' : 'border-ink-900/8 bg-white hover:shadow-ink-900/10'
      }`}
    >
      <Link to={`/produit/${product.slug}`} className="relative block p-3">
        <div onMouseMove={onMove} onMouseLeave={onLeave} className="holo aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-white to-slate-100">
          <ProductVisual product={product} className="transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-1.5">
          {!orderable ? (
            <span className="rounded-full bg-sky-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">Bientôt disponible</span>
          ) : (
            product.badge && (
              <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-900 shadow">{product.badge}</span>
            )
          )}
        </div>
        <span className="absolute right-5 top-5 rounded-full bg-ink-900/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">{product.lang}</span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        <Link to={`/produit/${product.slug}`} className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug hover:underline">
          {product.name}
        </Link>
        {isUpcoming(product) ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500">
            <CalendarClock size={14} /> Sortie le {releaseDate(product)}
          </span>
        ) : orderable ? (
          <StockPill stock={product.stock} />
        ) : (
          <span className="text-xs font-semibold text-sky-500">Commandes bientôt ouvertes</span>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="font-display text-xl font-bold">{euro(product.price)}</span>
          {!orderable ? (
            <Link
              to={`/produit/${product.slug}`}
              className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-bold ring-1 transition ${dark ? 'ring-white/20 hover:bg-white/5' : 'ring-ink-900/15 hover:bg-ink-900/5'}`}
            >
              Bientôt
            </Link>
          ) : (
          <button
            onClick={() => {
              if (inCart) return setOpen(true)
              add(product.slug)
              setAdded(true)
              setTimeout(() => setAdded(false), 1800)
            }}
            disabled={soldOut}
            aria-label={inCart ? `${product.name} est dans votre panier` : `Ajouter ${product.name} au panier`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3.5 py-2 text-xs font-bold text-ink-900 transition hover:bg-gold-300 active:scale-95 disabled:opacity-40"
          >
            {added || inCart ? <Check size={14} /> : <ShoppingBag size={14} />} {added ? 'Ajouté' : soldOut ? 'Épuisé' : inCart ? 'Au panier' : 'Ajouter'}
          </button>
          )}
        </div>
      </div>
    </article>
  )
}
