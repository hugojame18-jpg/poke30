import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Flame, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { ARTICLES, FAQ, PRODUCTS, UNIVERSES, universeOf } from '../lib/data'
import { SHOP } from '../lib/config'
import ProductCard from '../components/ProductCard'
import { Perks } from '../components/Footer'
import { GUARANTEES } from '../components/Trust'
import { useSeo } from '../lib/seo'
import { useRecent } from '../lib/recent'

const collection30 = PRODUCTS.filter((p) => p.tags.includes('30 ans'))
const graded = PRODUCTS.filter((p) => p.universe === 'gradees')
const universes = UNIVERSES.map((u) => ({ ...u, products: PRODUCTS.filter((p) => p.universe === u.id) })).filter((u) => u.products.length)

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SHOP.name,
  url: SHOP.url,
  logo: `${SHOP.url}/logo.webp`,
  email: SHOP.email,
  address: { '@type': 'PostalAddress', addressLocality: SHOP.pickupCity, addressCountry: 'FR' },
}

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
    title: 'Poke 30 — Collection Pokémon 30 ans & cartes gradées',
    description: 'Spécialiste français Pokémon : ETB 30e anniversaire, coffrets First Partners et cartes gradées. Produits officiels, livraison suivie depuis la France.',
    image: etb.image,
    jsonLd: ORGANIZATION_LD,
  })

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,210,63,.18),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(59,130,246,.18),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-gold-400/30">
              <Sparkles size={14} /> Pokémon · 30e anniversaire
            </span>
            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              La collection
              <br />
              30 ans est
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-orange-400 bg-clip-text text-transparent">disponible.</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/70 sm:mt-6 sm:text-lg">
              ETB français et coffrets First Partners japonais des 7 générations. Produits officiels, stocks limités, expédiés depuis la France.
            </p>
            <div className="mt-7 flex gap-3 sm:mt-8">
              <Link to="/collection-30-ans" className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-400 px-5 py-3.5 text-sm font-bold sm:flex-none sm:px-7 sm:py-4 sm:text-base text-ink-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300">
                <span className="sm:hidden">La collection</span>
                <span className="hidden sm:inline">Découvrir la collection</span> <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to={`/produit/${etb.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold ring-1 sm:px-7 sm:py-4 sm:text-base ring-white/20 transition hover:bg-white/5">
                Voir l’ETB
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[290px] w-full max-w-md sm:h-[460px]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/25 blur-3xl" />
            <Link
              to={`/produit/${etb.slug}`}
              className="floaty absolute left-1/2 top-2 z-20 w-48 -translate-x-1/2 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-white/20 sm:w-72"
            >
              <img src={etb.image} alt={etb.name} fetchPriority="high" width={288} height={288} className="aspect-square w-full object-contain" />
              <span className="absolute -right-3 -top-3 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-lg">Édition 30e anniversaire</span>
            </Link>
            {[2, 5].map((g, i) => (
              <Link
                key={g}
                to={`/produit/coffret-first-partners-${g}g-30th-celebration-jp`}
                style={{ ['--r' as string]: i ? '8deg' : '-8deg', animationDelay: `${i + 1}s` }}
                className={`floaty absolute bottom-0 z-10 w-32 rounded-2xl bg-white p-2.5 shadow-2xl sm:w-48 ${i ? 'right-0' : 'left-0'}`}
              >
                <img src={`${import.meta.env.BASE_URL}products/first-partners-${g}g.webp`} alt={`Coffret First Partners ${g}G`} width={192} height={192} className="aspect-square w-full object-contain" />
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
        </div>
      </section>

      {/* UNIVERS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead eyebrow="Catalogue" title="Explorer par univers" to="/boutique" />
        <div className="grid gap-4 md:grid-cols-2">
          {universes.map((u) => {
            const shots = u.products.filter((p) => p.image).slice(0, 3)
            return (
              <Link
                key={u.id}
                to={`/boutique/${u.id}`}
                className="group relative flex min-h-56 overflow-hidden rounded-3xl p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl sm:p-8"
                style={{ background: `radial-gradient(circle at 85% 15%, ${u.from}, transparent 60%), linear-gradient(160deg, ${u.to}, #060919)` }}
              >
                <div className="relative z-10 flex max-w-[55%] flex-col justify-end">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                    {u.products.length} produit{u.products.length > 1 ? 's' : ''}
                  </p>
                  <p className="mt-1 font-display text-3xl font-extrabold leading-tight">{u.label}</p>
                  <p className="mt-1 text-sm text-white/70">{u.tagline}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition group-hover:bg-white/25">
                    Explorer <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
                {shots.length > 0 ? (
                  <div className="absolute -right-4 bottom-6 top-6 flex w-[45%] items-center">
                    {shots.map((p, i) => (
                      <img
                        key={p.slug}
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="absolute aspect-square w-[72%] rounded-2xl bg-white object-contain p-2 shadow-2xl transition duration-500 group-hover:scale-105"
                        style={{ right: `${i * 14}%`, transform: `rotate(${(i - 1) * 7}deg)`, zIndex: 3 - i }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="absolute -bottom-6 right-4 font-display text-[9rem] font-extrabold leading-none text-white/10 transition group-hover:scale-110">
                    {u.products.length}
                  </span>
                )}
              </Link>
            )
          })}
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

      {/* GRADÉES */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className={`grid items-center gap-8 rounded-3xl bg-white p-6 ring-1 ring-ink-900/5 md:p-10 ${graded.length > 1 ? 'lg:grid-cols-[1fr_2fr]' : 'md:grid-cols-[1.4fr_1fr]'}`}>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">Cartes gradées</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Slabs PSA, CGC et PCA</h2>
            <p className="mt-4 text-slate-600">Des cartes authentifiées et notées, expédiées protégées en colis renforcé. Pièces uniques : premier arrivé, premier servi.</p>
            <Link to="/boutique/gradees" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-700">
              Voir les gradées <ArrowRight size={16} />
            </Link>
          </div>
          <div className={`grid gap-4 ${graded.length > 1 ? 'grid-cols-2 sm:grid-cols-3' : 'mx-auto w-full max-w-xs'}`}>
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
            <p className="mt-4 text-lg text-ink-900/80">Spécialistes français de Pokémon, nous sélectionnons des produits officiels et les expédions depuis la France avec le soin qu’un collectionneur attend.</p>
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
