import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarClock, ChevronDown, Lock, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { PRODUCTS, canOrder, euro, getProduct, isUpcoming, releaseLabel, universeOf } from '../lib/data'
import { useBuyNow } from '../lib/cart'
import { SHOP } from '../lib/config'
import { track } from '../lib/analytics'
import { useSeo } from '../lib/seo'
import { pushRecent, useRecent } from '../lib/recent'
import ProductCard, { ProductVisual, StockPill } from '../components/ProductCard'
import { OneItemNotice, PaymentBadges } from '../components/Trust'
import { deliveryDate } from '../lib/delivery'
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

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const buyNow = useBuyNow()
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
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
        brand: { '@type': 'Brand', name: 'Pokémon' },
        category: universeOf(product.universe).label,
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: !canOrder(product) ? 'https://schema.org/PreOrder' : product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
  // Suggestions : produits commandables d'abord
  const related = PRODUCTS.filter((p) => p.slug !== slug && canOrder(p) && p.stock > 0).slice(0, 4)
  const soldOut = product.stock <= 0
  const orderable = canOrder(product)
  const upcoming = isUpcoming(product)
  const buy = () => buyNow(product.slug)

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:py-8 lg:pb-8">
        <nav className="mb-4 text-xs text-slate-500 sm:mb-6">
          <Link to="/" className="hover:text-ink-900">Accueil</Link> / <Link to="/boutique" className="hover:text-ink-900">Boutique</Link> /{' '}
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
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
              <div className="h-full w-full p-4 transition-transform sm:p-8 duration-200" style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
                {product.image ? (
                  <img src={product.image} alt={product.name} fetchPriority="high" className="h-full w-full rounded-2xl object-contain" />
                ) : (
                  <ProductVisual product={product} className="rounded-2xl" />
                )}
              </div>
              <div className="absolute left-5 top-5 flex gap-2">
                {product.badge && (
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase ${orderable ? 'bg-gold-400 text-ink-900' : 'bg-sky-500 text-white'}`}>
                    {orderable ? product.badge : 'Bientôt disponible'}
                  </span>
                )}
                <span className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-white">{product.lang}</span>
              </div>
            </div>
            <ul className="mt-4 hidden grid-cols-3 gap-3 lg:grid">
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
            <h1 className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-slate-600 sm:mt-3 sm:text-lg">{product.short}</p>

            <div className="mt-4 flex sm:mt-6 flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-display text-4xl font-extrabold">{euro(product.price)}</span>
              {upcoming ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-sm font-bold text-sky-600">
                  <CalendarClock size={16} /> Sortie {releaseLabel(product)}
                </span>
              ) : orderable ? (
                <StockPill stock={product.stock} />
              ) : null}
            </div>

            <div ref={buyRef} className="mt-5 space-y-4 rounded-3xl bg-white p-5 ring-1 ring-ink-900/5 sm:mt-7">
              {!orderable ? (
                <>
                  <p className="font-semibold">Bientôt disponible sur Poke 30</p>
                  <p className="text-sm text-slate-600">
                    {upcoming
                      ? `Ce produit sort ${releaseLabel(product)} : la commande ouvrira sur cette page le jour de sa sortie.`
                      : 'Les commandes de ce produit ouvrent très prochainement sur cette page.'}
                  </p>
                  <Link to="/boutique" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 font-bold text-white transition hover:bg-ink-700">
                    Voir les produits disponibles <ArrowRight size={18} />
                  </Link>
                </>
              ) : soldOut ? (
                <>
                  <p className="font-display text-xl font-bold text-red-500">Rupture de stock</p>
                  <p className="text-sm text-slate-600">Ce produit est épuisé pour le moment. Découvrez les nouveautés 30th Celebration.</p>
                  <Link to="/boutique" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-4 font-bold text-ink-900 transition hover:bg-gold-300">
                    Voir les produits disponibles <ArrowRight size={18} />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={buy}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-4 text-lg font-bold text-ink-900 shadow-lg shadow-gold-400/30 transition hover:bg-gold-300 active:scale-[.98]"
                  >
                    <Lock size={18} /> Commander · {euro(product.price)} <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </button>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-start gap-2.5">
                      <Truck size={18} className="mt-px shrink-0 text-emerald-600" />
                      <span>
                        <strong className="text-emerald-700">Livraison suivie offerte</strong> en {SHOP.deliveryDays} jours : commandez aujourd’hui, reçu le <strong>{deliveryDate()}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <PackageCheck size={18} className="mt-px shrink-0 text-gold-500" />
                      <span>Produit officiel, neuf et scellé d’usine</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <RotateCcw size={18} className="mt-px shrink-0 text-gold-500" />
                      <span>{SHOP.returnDays} jours pour changer d’avis (produit non ouvert)</span>
                    </li>
                  </ul>
                  <div className="rounded-2xl bg-gold-400/15 p-3">
                    <OneItemNotice compact />
                  </div>
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
                  Livraison suivie offerte en {SHOP.deliveryDays} jours, expédiée depuis la France.
                </p>
                <p className="mt-2">Retrait gratuit à {SHOP.pickupCity} sur rendez-vous.</p>
              </Accordion>
              <Accordion title="Authenticité & emballage" icon={ShieldCheck}>
                <p>Tous nos produits sont officiels et scellés d’usine. Les coffrets et boîtes sont calés en carton renforcé.</p>
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
      {!soldOut && orderable && (
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
              <p className="font-display text-lg font-bold leading-tight">{euro(product.price)}</p>
              <p className="text-xs font-semibold text-emerald-700">Livraison offerte</p>
            </div>
            <button onClick={buy} className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-6 py-3 font-bold text-ink-900 transition hover:bg-gold-300">
              Commander <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
