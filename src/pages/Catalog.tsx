import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { PRODUCTS, UNIVERSES, type Lang, type Universe } from '../lib/data'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import { useSeo } from '../lib/seo'
import { track } from '../lib/analytics'
import { DeliveryEstimate } from '../components/Trust'

const SORTS = {
  pertinence: 'Pertinence',
  nouveautes: 'Nouveautés',
  ventes: 'Meilleures ventes',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix décroissant',
} as const
type Sort = keyof typeof SORTS

const LANGS: Lang[] = ['FR', 'JPN', 'EN']
const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function Catalog({ collection30 = false }: { collection30?: boolean }) {
  const { universe } = useParams<{ universe?: Universe }>()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const sort = (params.get('tri') as Sort) in SORTS ? (params.get('tri') as Sort) : 'pertinence'
  const langs = params.getAll('langue') as Lang[]
  const stockOnly = params.get('stock') === '1'

  const u = UNIVERSES.find((x) => x.id === universe)

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => (collection30 ? p.tags.includes('30 ans') : true) && (u ? p.universe === u.id : true))
    if (q) l = l.filter((p) => norm(`${p.name} ${p.short} ${p.universe}`).includes(norm(q)))
    if (langs.length) l = l.filter((p) => langs.includes(p.lang))
    if (stockOnly) l = l.filter((p) => p.stock > 0)
    const sorted = [...l]
    if (sort === 'nouveautes') sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    if (sort === 'ventes') sorted.sort((a, b) => b.sales - a.sales)
    if (sort === 'prix-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'prix-desc') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [collection30, u, q, langs, stockOnly, sort])

  const seoTitle = collection30 ? 'Collection Pokémon 30 ans — ETB & First Partners' : u ? `${u.label} — produits officiels` : 'Boutique TCG'
  useSeo({ title: seoTitle, description: collection30 ? 'ETB français et coffrets First Partners japonais du 30e anniversaire Pokémon. Stocks limités, expédition depuis la France.' : `${u?.tagline ?? 'Pokémon, One Piece, Yu-Gi-Oh!, cartes gradées'} : produits officiels expédiés depuis la France.` })
  const listKey = list.map((p) => p.slug).join()
  useEffect(() => {
    track.viewList(seoTitle, list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey])

  if (universe && !u) return <NotFound />

  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    fn(next)
    setParams(next, { replace: true })
  }
  const toggleLang = (l: Lang) =>
    update((p) => {
      const cur = p.getAll('langue')
      p.delete('langue')
      ;(cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]).forEach((x) => p.append('langue', x))
    })

  const title = collection30 ? 'Collection 30 ans' : u ? u.label : q ? `Résultats pour « ${q} »` : sort !== 'pertinence' ? SORTS[sort] : 'Toute la boutique'
  const hasFilters = langs.length > 0 || stockOnly || q

  return (
    <>
      <section className={`${collection30 ? 'bg-ink-950 text-white' : 'bg-ink-900 text-white'} relative overflow-hidden`}>
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(ellipse at 85% 20%, ${u?.from ?? '#ffd23f'}40, transparent 55%)` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14">
          <nav className="text-xs text-white/50">
            <Link to="/" className="hover:text-white">Accueil</Link> / <Link to="/boutique" className="hover:text-white">Boutique</Link>
            {u && <> / {u.label}</>}
          </nav>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-2 text-white/60">
            {collection30 ? 'Les produits officiels du 30e anniversaire Pokémon — quantités limitées.' : u ? u.tagline : 'Produits officiels, expédiés depuis la France.'}
          </p>
          {collection30 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-white/80"><DeliveryEstimate compact /></div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {!collection30 && (
          <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
            <Link to="/boutique" className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${!u ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-900/10 hover:ring-ink-900/30'}`}>
              Tout
            </Link>
            {UNIVERSES.map((x) => (
              <Link
                key={x.id}
                to={`/boutique/${x.id}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${u?.id === x.id ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-900/10 hover:ring-ink-900/30'}`}
              >
                {x.label}
              </Link>
            ))}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink-900/5">
          <SlidersHorizontal size={16} className="ml-1 text-slate-400" />
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => toggleLang(l)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${langs.includes(l) ? 'bg-gold-400 ring-gold-400' : 'ring-ink-900/10 hover:ring-ink-900/30'}`}
            >
              {l}
            </button>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={stockOnly} onChange={(e) => update((p) => (e.target.checked ? p.set('stock', '1') : p.delete('stock')))} className="accent-gold-500" />
            En stock
          </label>
          {hasFilters && (
            <button onClick={() => update((p) => ['langue', 'stock', 'q'].forEach((k) => p.delete(k)))} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-ink-900">
              <X size={14} /> Effacer
            </button>
          )}
          <span className="ml-auto text-sm text-slate-500">{list.length} produit{list.length > 1 ? 's' : ''}</span>
          <select
            value={sort}
            onChange={(e) => update((p) => (e.target.value === 'pertinence' ? p.delete('tri') : p.set('tri', e.target.value)))}
            className="rounded-full bg-cream px-3 py-2 text-sm font-semibold outline-none"
            aria-label="Trier"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-20 text-center ring-1 ring-ink-900/5">
            <p className="font-display text-2xl font-bold">Aucun produit trouvé</p>
            <p className="mt-2 text-slate-500">Essayez d’élargir vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>
    </>
  )
}
