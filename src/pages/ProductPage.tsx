import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bell, Check, ChevronDown, PackageCheck, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { PRODUCTS, euro, getProduct, universeOf, type Product } from '../lib/data'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { track } from '../lib/analytics'
import { useSeo } from '../lib/seo'
import { pushRecent, useRecent } from '../lib/recent'
import ProductCard, { ProductVisual, StockPill } from '../components/ProductCard'
import { DeliveryEstimate, PaymentBadges } from '../components/Trust'
import NotFound from './NotFound'

function Accordion({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: typeof Truck; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-ink-900/10">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-3 py-4 text-left font-semibold">
        <Icon size={18} className="text-gold-500" />
        <span className="flex-1">{title}</span>
        <ChevronDown size={18} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="fade-in pb-5 pl-8 text-sm leading-relaxed text-slate-600">{children}</div>}
    </div>
  )
}

function NotifyMe({ product }: { product: Product }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  if (done) return <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">C’est noté ! Nous vous écrivons dès le retour en stock.</p>
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (email.includes('@')) setDone(true)
      }}
      className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/10"
    >
      <p className="flex items-center gap-2 font-semibold">
        <Bell size={16} className="text-gold-500" /> Prévenez-moi du retour en stock
      </p>
      <div className="mt-3 flex gap-2">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.fr" aria-label={`E-mail pour ${product.name}`} className="h-11 flex-1 rounded-full bg-cream px-4 text-sm outline-none ring-1 ring-ink-900/10 focus:ring-gold-500" />
        <button className="h-11 rounded-full bg-ink-900 px-5 text-sm font-bold text-white">M’alerter</button>
      </div>
    </form>
  )
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const { add, qtyOf } = useCart()
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [justAdded, setJustAdded] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const buyRef = useRef<HTMLDivElement>(null)
  const recent = useRecent(slug)

  const jsonLd = useMemo(
    () =>
      product && {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image ? SHOP.url + product.image : undefined,
        sku: product.slug,
        category: universeOf(product.universe).label,
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          url: `${SHOP.url}/produit/${product.slug}`,
        },
      },
    [product],
  )
  useSeo({
    title: product ? `${product.name} — ${euro(product.price)}` : 'Produit introuvable',
    description: product ? `${product.short} Produit officiel, expédié depuis la France en livraison suivie.` : '',
    image: product?.image,
    jsonLd: jsonLd || undefined,
  })

  useEffect(() => {
    if (!product) return
    track.viewItem(product)
    pushRecent(product.slug)
  }, [product])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [product])

  if (!product) return <NotFound />
  const u = universeOf(product.universe)
  const inCart = qtyOf(slug)
  const max = inCart > 0 ? 0 : Math.min(1, product.stock)
  const related = PRODUCTS.filter((p) => p.universe === product.universe && p.slug !== slug).slice(0, 4)

  const buy = () => {
    add(product.slug)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }
  const soldOut = product.stock <= 0

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:pb-8">
        <nav className="mb-6 text-xs text-slate-500">
          <Link to="/" className="hover:text-ink-900">Accueil</Link> / <Link to={`/boutique/${u.id}`} className="hover:text-ink-900">{u.label}</Link> /{' '}
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/5"
              onMouseMove={(e) => {
                if (!product.image) return
                const r = e.currentTarget.getBoundingClientRect()
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <div className="h-full w-full p-8 transition-transform duration-200" style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
                {product.image ? (
                  <img src={product.image} alt={product.name} fetchPriority="high" className="h-full w-full rounded-2xl object-contain" />
                ) : (
                  <ProductVisual product={product} className="rounded-2xl" />
                )}
              </div>
              <div className="absolute left-5 top-5 flex gap-2">
                {product.badge && <span className="rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold uppercase text-ink-900">{product.badge}</span>}
                <span className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-white">{product.lang}</span>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {[
                [PackageCheck, 'Officiel & scellé'],
                [ShieldCheck, 'Colis protégé'],
                [RotateCcw, `${SHOP.returnDays} j pour changer d’avis`],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Truck
                return (
                  <li key={t as string} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-center text-xs font-semibold ring-1 ring-ink-900/5">
                    <I size={20} className="text-gold-500" /> {t as string}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lg:py-2">
            <Link to={`/boutique/${u.id}`} className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500 hover:underline">
              {u.label}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-lg text-slate-600">{product.short}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-display text-4xl font-extrabold">{euro(product.price)}</span>
              <StockPill stock={product.stock} />
            </div>
            {product.price < SHOP.freeShippingFrom && !soldOut && (
              <p className="mt-2 text-sm text-slate-500">
                Livraison offerte dès {euro(SHOP.freeShippingFrom)} d’achat
              </p>
            )}

            <div ref={buyRef} className="mt-7 space-y-4 rounded-3xl bg-white p-5 ring-1 ring-ink-900/5">
              {soldOut ? (
                <NotifyMe product={product} />
              ) : (
                <>
                  <div className="flex gap-3">
                    <button
                      onClick={buy}
                      disabled={max <= 0}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-4 font-bold shadow-lg transition active:scale-[.98] disabled:opacity-40 disabled:shadow-none ${
                        justAdded ? 'bg-emerald-500 text-white shadow-emerald-500/25' : 'bg-gold-400 text-ink-900 shadow-gold-400/30 hover:bg-gold-300'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check size={18} /> Ajouté !
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} /> {max <= 0 ? 'Stock max. dans le panier' : `Ajouter au panier · ${euro(product.price)}`}
                        </>
                      )}
                    </button>
                  </div>
                  {inCart > 0 && (
                    <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <Check size={16} /> {inCart} déjà dans votre panier
                    </p>
                  )}
                  <DeliveryEstimate />
                  <PaymentBadges />
                </>
              )}
            </div>

            <div className="mt-6">
              <Accordion title="Description" icon={PackageCheck} defaultOpen>
                <p>{product.description}</p>
                <dl className="mt-4 divide-y divide-ink-900/10 rounded-2xl bg-cream">
                  {product.details.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="text-right font-semibold text-ink-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Livraison & retrait" icon={Truck}>
                <p>
                  Préparation sous {SHOP.prepDays * 24} h ouvrées, envoi en livraison suivie depuis la France ({euro(SHOP.shippingPrice)}, offerte dès {euro(SHOP.freeShippingFrom)}).
                </p>
                <p className="mt-2">Retrait gratuit à {SHOP.pickupCity} sur rendez-vous.</p>
              </Accordion>
              <Accordion title="Authenticité & emballage" icon={ShieldCheck}>
                <p>Tous nos produits sont officiels et scellés d’usine. Les coffrets sont calés en carton renforcé, les cartes seules envoyées sous sleeve + toploader.</p>
              </Accordion>
              <Accordion title="Retours" icon={RotateCcw}>
                <p>Vous disposez de {SHOP.returnDays} jours pour nous retourner un produit non ouvert, dans son état d’origine.</p>
              </Accordion>
            </div>
          </div>
        </div>

      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-4 max-w-7xl px-4">
          <h2 className="mb-6 font-display text-3xl font-bold tracking-tight">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">Récemment consultés</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recent.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Barre d'achat collante : toujours sur mobile, sur desktop dès que le bouton principal sort de l'écran */}
      {!soldOut && (
        <div
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-900/10 bg-white/95 backdrop-blur transition-transform duration-300 ${
            showSticky ? 'translate-y-0' : 'translate-y-0 lg:translate-y-full'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3 p-3">
            <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:block">
              <ProductVisual product={product} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="hidden truncate text-sm font-semibold sm:block">{product.name}</p>
              <p className="font-display text-lg font-bold">{euro(product.price)}</p>
            </div>
            <button
              onClick={buy}
              disabled={max <= 0}
              className={`rounded-full px-6 py-3 font-bold transition disabled:opacity-40 ${justAdded ? 'bg-emerald-500 text-white' : 'bg-gold-400 text-ink-900 hover:bg-gold-300'}`}
            >
              {justAdded ? 'Ajouté ✓' : 'Ajouter au panier'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
