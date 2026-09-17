import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { PRODUCTS, euro } from '../lib/data'
import { track } from '../lib/analytics'
import { ProductVisual } from './ProductCard'
import { PaymentBadges } from './Trust'

export function PromoField() {
  const { promo, applyPromo, removePromo } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)

  if (promo)
    return (
      <p className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        <span className="flex items-center gap-2 font-semibold">
          <Tag size={14} /> {promo} appliqué (−{SHOP.promoCodes[promo]} %)
        </span>
        <button onClick={removePromo} className="text-xs underline">Retirer</button>
      </p>
    )
  if (!show)
    return (
      <button onClick={() => setShow(true)} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 underline-offset-2 hover:underline">
        <Tag size={14} /> Vous avez un code promo ?
      </button>
    )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setError(!applyPromo(code))
      }}
    >
      <div className="flex gap-2">
        <input
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(false)
          }}
          placeholder="Code promo"
          className={`h-10 flex-1 rounded-full bg-cream px-4 text-sm uppercase outline-none ring-1 ${error ? 'ring-red-400' : 'ring-ink-900/10 focus:ring-gold-500'}`}
        />
        <button className="h-10 rounded-full bg-ink-900 px-4 text-sm font-bold text-white">OK</button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">Ce code n’est pas valide.</p>}
    </form>
  )
}

export function FreeShippingBar() {
  const { subtotal, discount } = useCart()
  const net = subtotal - discount
  const left = SHOP.freeShippingFrom - net
  return (
    <div>
      <p className="flex items-center gap-2 text-sm">
        <Truck size={16} className={left > 0 ? 'text-gold-500' : 'text-emerald-600'} />
        {left > 0 ? (
          <span>
            Plus que <strong>{euro(left)}</strong> pour la <strong>livraison offerte</strong>
          </span>
        ) : (
          <strong className="text-emerald-700">Livraison offerte débloquée ✓</strong>
        )}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-900/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${left > 0 ? 'bg-gradient-to-r from-gold-500 to-gold-300' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(100, (net / SHOP.freeShippingFrom) * 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, discount, setQty, remove, count, add, qtyOf } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  // Suggestions : accessoires de protection d'abord, puis produits qui débloquent la livraison offerte
  const suggestions = useMemo(() => {
    const inCart = new Set(lines.map((l) => l.slug))
    const left = SHOP.freeShippingFrom - (subtotal - discount)
    const pool = PRODUCTS.filter((p) => !inCart.has(p.slug) && p.stock > 0)
    const acc = pool.filter((p) => p.universe === 'accessoires')
    const bridge = left > 0 ? pool.filter((p) => p.universe !== 'accessoires' && p.price >= left).sort((a, b) => a.price - b.price) : []
    return [...acc, ...bridge].slice(0, 3)
  }, [lines, subtotal, discount])

  if (!open) return null

  const checkout = () => {
    const net = subtotal - discount
    const cents = Math.round(net * 100)
    const url = SHOP.checkoutUrls[cents]
    track.beginCheckout(lines, net)
    setOpen(false)
    if (url) {
      window.location.href = url
    } else {
      navigate('/commande')
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Panier">
      <div className="fade-in absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
          <h2 className="font-display text-xl font-bold">Votre panier ({count})</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-ink-900/5" aria-label="Fermer le panier">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
              <ShoppingBag size={32} className="text-slate-400" />
            </div>
            <p className="font-display text-xl font-bold">Votre panier est vide</p>
            <p className="text-sm text-slate-500">La collection 30 ans part vite, jetez-y un œil.</p>
            <Link to="/collection-30-ans" onClick={() => setOpen(false)} className="rounded-full bg-gold-400 px-6 py-3 text-sm font-bold text-ink-900 hover:bg-gold-300">
              Voir la collection 30 ans
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-ink-900/10 px-5 py-3">
              <FreeShippingBar />
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-ink-900/10 px-5">
                {lines.map(({ slug, qty, product }) => (
                  <li key={slug} className="flex gap-4 py-4">
                    <Link to={`/produit/${slug}`} onClick={() => setOpen(false)} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                      <ProductVisual product={product} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-slate-500">
                        {product.lang} · {product.stock <= 3 ? <span className="font-semibold text-orange-600">plus que {product.stock} en stock</span> : 'en stock'}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-sm font-semibold text-slate-500">Qté : {qty}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{euro(qty * product.price)}</span>
                          <button onClick={() => remove(slug)} className="p-1 text-slate-400 hover:text-red-500" aria-label="Supprimer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {suggestions.length > 0 && (
                <div className="mx-5 mb-5 rounded-2xl bg-white p-4 ring-1 ring-ink-900/5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Complétez votre commande</p>
                  <ul className="mt-3 space-y-3">
                    {suggestions.map((p) => {
                      const added = qtyOf(p.slug) > 0
                      return (
                        <li key={p.slug} className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <ProductVisual product={p} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                            <p className="text-sm font-bold">{euro(p.price)}</p>
                          </div>
                          <button
                            onClick={() => add(p.slug, 1, { silent: true })}
                            className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white transition hover:bg-ink-700"
                            aria-label={`Ajouter ${p.name}`}
                          >
                            {added ? <Check size={16} /> : <Plus size={16} />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-ink-900/10 bg-white px-5 py-4">
              <PromoField />
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{euro(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700">
                  <span>Réduction</span>
                  <span>−{euro(discount)}</span>
                </div>
              )}
              <button
                onClick={checkout}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 py-4 font-bold text-ink-900 shadow-lg shadow-gold-400/25 transition hover:bg-gold-300"
              >
                Commander · {euro(subtotal - discount)} <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
              <PaymentBadges className="justify-center" />
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
