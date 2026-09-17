import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Flame, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { ARTICLES, FAQ, PRODUCTS, UNIVERSES, universeOf } from '../lib/data'
import ProductCard from '../components/ProductCard'
import { Perks } from '../components/Footer'
import AddAllButton from '../components/AddAllButton'
import { GUARANTEES } from '../components/Trust'
import { useSeo } from '../lib/seo'
import { useRecent } from '../lib/recent'

const collection30 = PRODUCTS.filter((p) => p.tags.includes('30 ans'))
const inStock = PRODUCTS.filter((p) => !p.tags.includes('30 ans') && p.universe !== 'gradees' && p.universe !== 'accessoires').slice(0, 4)
const graded = PRODUCTS.filter((p) => p.universe === 'gradees')

export function SectionHead({ eyebrow, title, to, dark = false }: { eyebrow: string; title: string; to?: string; dark?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">{eyebrow}</p>
        <h2 className={`mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-white' : ''}`}>{title}</h2>
      </div>
      {to && (
        <Link to={to} className={`group hidden shrink-0 items-center gap-1 text-sm font-semibold sm:flex ${dark ? 'text-gold-300' : 'text-ink-900'}`}>
          Tout voir <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

export function dateFr(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Home() {
  const [faq, setFaq] = useState<number | null>(0)
  const etb = PRODUCTS[0]
  const recent = useRecent()
  useSeo({
    title: 'Poke 30 — Collection Pokémon 30 ans, One Piece & cartes gradées',
    description: 'Spécialiste français du TCG : ETB 30e anniversaire, coffrets First Partners, One Piece, Yu-Gi-Oh! et cartes gradées. Produits officiels, livraison suivie depuis la France.',
    image: etb.image,
  })

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,210,63,.18),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(59,130,246,.18),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-gold-400/30">
              <Sparkles size={14} /> Pokémon · 30e anniversaire
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              La collection
              <br />
              30 ans est
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-orange-400 bg-clip-text text-transparent">disponible.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              ETB français et coffrets First Partners japonais des 7 générations. Produits officiels, stocks limités, expédiés depuis la France.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/collection-30-ans" className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-4 font-bold text-ink-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300">
                Découvrir la collection <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to={`/produit/${etb.slug}`} className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold ring-1 ring-white/20 transition hover:bg-white/5">
                Voir l’ETB
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/25 blur-3xl" />
            <Link
              to={`/produit/${etb.slug}`}
              className="floaty absolute left-1/2 top-4 z-20 w-60 -translate-x-1/2 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-white/20 sm:w-72"
            >
              <img src={etb.image} alt={etb.name} fetchPriority="high" width={288} height={288} className="aspect-square w-full object-contain" />
              <span className="absolute -right-3 -top-3 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-lg">Édition 30e anniversaire</span>
            </Link>
            {[2, 5].map((g, i) => (
              <Link
                key={g}
                to={`/produit/coffret-first-partners-${g}g-30th-celebration-jp`}
                style={{ ['--r' as string]: i ? '8deg' : '-8deg', animationDelay: `${i + 1}s` }}
                className={`floaty absolute bottom-0 z-10 w-40 rounded-2xl bg-white p-2.5 shadow-2xl sm:w-48 ${i ? 'right-0' : 'left-0'}`}
              >
                <img src={`${import.meta.env.BASE_URL}products/first-partners-${g}g.webp`} alt={`Coffret First Partners ${g}G`} className="aspect-square w-full object-contain" />
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-10">
          <Perks dark />
        </div>
      </section>

      {/* COLLECTION 30 ANS */}
      <section className="bg-ink-900 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead eyebrow="Collection officielle" title="La collection 30 ans" to="/collection-30-ans" dark />
          <div className="mb-8 flex items-start gap-3 rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-100 ring-1 ring-orange-400/25">
            <Flame size={18} className="mt-0.5 shrink-0 text-orange-400" />
            <p>
              <strong className="text-orange-300">Stocks limités.</strong> Une fois épuisés, certains produits de l’anniversaire ne seront pas réassortis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {collection30.map((p) => (
              <ProductCard key={p.slug} product={p} dark />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <AddAllButton products={collection30.filter((p) => p.slug.startsWith('coffret-first-partners'))} label="Ajouter les First Partners 1G → 7G" dark />
            <p className="text-xs text-white/50">Pour les collectionneurs qui veulent la série complète en une fois.</p>
          </div>
        </div>
      </section>

      {/* UNIVERS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead eyebrow="Catalogue" title="Explorer par univers" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {UNIVERSES.map((u) => (
            <Link
              key={u.id}
              to={`/boutique/${u.id}`}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl p-4 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: `radial-gradient(circle at 80% 10%, ${u.from}, transparent 60%), linear-gradient(160deg, ${u.to}, #060919)` }}
            >
              <span className="absolute right-3 top-3 font-display text-5xl font-extrabold text-white/10 transition group-hover:scale-110">
                {PRODUCTS.filter((p) => p.universe === u.id).length}
              </span>
              <p className="font-display text-xl font-bold leading-tight">{u.label}</p>
              <p className="mt-1 text-xs text-white/70">{u.tagline}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold-300">
                Explorer <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <SectionHead eyebrow="Reprendre où vous en étiez" title="Récemment consultés" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recent.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* EN STOCK */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionHead eyebrow="En stock" title="Disponible immédiatement" to="/boutique" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {inStock.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* GRADÉES */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-ink-900/5 md:p-10 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">Cartes gradées</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Slabs PSA, CGC et PCA</h2>
            <p className="mt-4 text-slate-600">Des cartes authentifiées et notées, expédiées protégées en colis renforcé. Pièces uniques : premier arrivé, premier servi.</p>
            <Link to="/boutique/gradees" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-700">
              Voir les gradées <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {graded.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIES */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionHead eyebrow="Acheter en confiance" title="Pourquoi commander chez Poke 30" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-500">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 to-orange-400 p-10 text-ink-900 md:p-14">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border-[40px] border-ink-900/10" />
          <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full border-[30px] border-white/20" />
          <div className="relative max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Expertise Poke 30</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Notre sélection, votre collection.</h2>
            <p className="mt-4 text-lg text-ink-900/80">Spécialistes français du TCG, nous sélectionnons des produits officiels et les expédions depuis la France avec le soin qu’un collectionneur attend.</p>
            <Link to="/faq#contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 font-bold text-white hover:bg-ink-700">
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG + FAQ */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHead eyebrow="Infos & guides" title="Le blog" to="/blog" />
          <div className="space-y-4">
            {ARTICLES.map((a) => {
              const u = universeOf(a.universe)
              return (
                <Link key={a.slug} to={`/blog/${a.slug}`} className="group flex gap-5 rounded-2xl bg-white p-4 ring-1 ring-ink-900/5 transition hover:shadow-xl">
                  <div className="hidden h-24 w-32 shrink-0 rounded-xl sm:block" style={{ background: `linear-gradient(135deg, ${u.from}, ${u.to})` }} />
                  <div>
                    <p className="text-xs text-slate-500">
                      {dateFr(a.date)} · <span className="font-semibold text-ink-900">{u.label}</span>
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold leading-snug group-hover:underline">{a.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.excerpt}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Aide" title="Questions fréquentes" to="/faq" />
          <div className="divide-y divide-ink-900/10 rounded-2xl bg-white ring-1 ring-ink-900/5">
            {FAQ.slice(0, 4).map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" aria-expanded={faq === i}>
                  {f.q}
                  <ChevronDown size={18} className={`shrink-0 transition ${faq === i ? 'rotate-180' : ''}`} />
                </button>
                {faq === i && <p className="fade-in px-5 pb-5 text-sm text-slate-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
