import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { euro } from '../lib/data'
import { track } from '../lib/analytics'
import { ProductVisual } from './ProductCard'
import { PaymentBadges } from './Trust'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, discount, remove, count } = useCart()
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

  if (!open) return null

  const checkout = () => {
    track.beginCheckout(lines, subtotal - discount)
    setOpen(false)
    navigate('/commande')
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
            </div>

            <div className="space-y-3 border-t border-ink-900/10 bg-white px-5 py-4">
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
