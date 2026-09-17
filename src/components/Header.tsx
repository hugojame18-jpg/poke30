import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { PRODUCTS, euro } from '../lib/data'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { track } from '../lib/analytics'
import { ProductVisual } from './ProductCard'

const NAV = [
  { to: '/boutique?tri=nouveautes', label: 'Nouveautés' },
  { to: '/boutique?tri=ventes', label: 'Meilleures ventes' },
  { to: '/collection-30-ans', label: 'Collection 30 ans', hot: true },
  { to: '/boutique/pokemon', label: 'Pokémon' },
  { to: '/boutique/gradees', label: 'Cartes gradées' },
  { to: '/blog', label: 'Blog' },
]

const ANNOUNCES = [
  'Collection Pokémon 30 ans disponible',
  'Produits 100 % officiels',
  'Livraison suivie depuis la France',
  `Livraison offerte dès ${SHOP.freeShippingFrom} €`,
  `Retrait gratuit à ${SHOP.pickupCity}`,
]

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const navigate = useNavigate()
  const results = useMemo(() => {
    const t = norm(q.trim())
    if (t.length < 2) return []
    return PRODUCTS.filter((p) => norm(`${p.name} ${p.universe} ${p.tags.join(' ')}`).includes(t)).slice(0, 5)
  }, [q])

  const go = (path: string) => {
    setQ('')
    setFocus(false)
    onDone?.()
    navigate(path)
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim()) track.search(q.trim())
        if (q.trim()) go(`/boutique?q=${encodeURIComponent(q.trim())}`)
      }}
      className="relative w-full"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        placeholder="Rechercher un produit, une extension, une licence…"
        className="h-11 w-full rounded-full border border-ink-900/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-gold-500 focus:ring-4 focus:ring-gold-400/25"
      />
      {focus && results.length > 0 && (
        <div className="fade-in absolute inset-x-0 top-13 z-50 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-2xl">
          {results.map((p) => (
            <button
              type="button"
              key={p.slug}
              onMouseDown={() => go(`/produit/${p.slug}`)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-cream"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <ProductVisual product={p} />
              </div>
              <span className="line-clamp-1 flex-1 text-sm font-medium">{p.name}</span>
              <span className="text-sm font-bold">{euro(p.price)}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

export default function Header() {
  const { count, setOpen } = useCart()
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const prevCount = useRef(count)
  const [bump, setBump] = useState(false)

  useEffect(() => setMobile(false), [location])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 400)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  return (
    <>
      <div className="overflow-hidden bg-ink-950 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {[...ANNOUNCES, ...ANNOUNCES].map((a, i) => (
            <span key={i} className="flex items-center gap-12">
              {a} <span className="text-white/30">✦</span>
            </span>
          ))}
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b border-ink-900/8 bg-cream/85 backdrop-blur-xl transition-shadow ${scrolled ? 'shadow-lg shadow-ink-900/5' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-8">
          <button className="rounded-full p-2 hover:bg-ink-900/5 lg:hidden" onClick={() => setMobile(true)} aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="" className="h-11 w-11 object-contain" />
            <span className="font-display text-2xl font-extrabold tracking-tight">
              Poke <span className="text-gold-500">30</span>
            </span>
          </Link>
          <div className="hidden flex-1 md:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/compte" className="rounded-full p-2.5 hover:bg-ink-900/5" aria-label="Mon compte">
              <User size={21} />
            </Link>
            <button onClick={() => setOpen(true)} className="relative rounded-full p-2.5 hover:bg-ink-900/5" aria-label={`Panier, ${count} articles`}>
              <ShoppingBag size={21} />
              {count > 0 && (
                <span
                  className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-ink-900 transition-transform ${
                    bump ? 'scale-125' : ''
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>
        <nav className="hidden border-t border-ink-900/5 lg:block">
          <ul className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    `relative block px-3 py-3 text-[13px] font-semibold transition hover:text-gold-500 ${isActive && !n.to.includes('?') ? 'text-gold-500' : ''}`
                  }
                >
                  {n.label}
                  {n.hot && <span className="absolute right-0 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fade-in absolute inset-0 bg-ink-950/60" onClick={() => setMobile(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-cream p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl font-extrabold">Menu</span>
              <button onClick={() => setMobile(false)} className="rounded-full p-2 hover:bg-ink-900/5" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="block rounded-xl px-3 py-3 font-semibold hover:bg-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/faq" className="block rounded-xl px-3 py-3 font-semibold hover:bg-white">
                  Aide & FAQ
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      )}
    </>
  )
}
