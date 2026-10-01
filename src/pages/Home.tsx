import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, ChevronDown, Flame, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { ARTICLES, FAQ, PRODUCTS, euro, isUpcoming, releaseDate, releaseLabel, universeOf } from '../lib/data'
import { SHOP } from '../lib/config'
import ProductCard from '../components/ProductCard'
import { Perks } from '../components/Footer'
import { GUARANTEES } from '../components/Trust'
import { useSeo } from '../lib/seo'
import { useRecent } from '../lib/recent'

// Produits épuisés en fin de liste
const collection30 = PRODUCTS.filter((p) => p.tags.includes('30 ans') && !p.release).sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0))
const releases = PRODUCTS.filter((p) => p.release)
// Prochaine sortie à date fixe (les sorties « au mois près », comme le classeur en décembre, ne comptent pas)
const nextDated = () => releases.find((p) => p.release!.length === 10 && isUpcoming(p))
const datedNames = releases.filter((p) => p.release!.length === 10).map((p) => p.name.replace(' — 30th Celebration', ''))
// Disposition du visuel d'accueil : le Booster Bundle au centre, le classeur à gauche, le Mini Tin à droite
const heroBundle = releases.find((p) => p.slug.startsWith('booster-bundle')) ?? releases[0]
const heroSides = releases.filter((p) => p !== heroBundle).slice(0, 2)

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
  const recent = useRecent()
  const next = nextDated()
  const soon = !!next
  useSeo({
    title: 'Poke 30 — Collection Pokémon 30 ans & 30th Celebration',
    description: 'Spécialiste français Pokémon : nouveautés 30th Celebration, coffrets First Partners et collection 30 ans. Produits officiels, livraison suivie depuis la France.',
    image: heroBundle?.image,
    jsonLd: ORGANIZATION_LD,
  })

  return (
    <>
      {/* HERO : sorties 30th Celebration en vedette */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(56,189,248,.22),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(255,210,63,.16),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-sky-300 ring-1 ring-sky-400/30">
              <Sparkles size={14} /> {next ? `Sortie le ${releaseDate(next)}` : 'Nouveautés · 30th Celebration'}
            </span>
            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              30th Celebration :
              <br />
              les nouveautés
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-orange-400 bg-clip-text text-transparent">{soon ? 'arrivent.' : 'sont là.'}</span>
            </h1>
            <ul className="mt-6 space-y-2 sm:text-lg">
              {releases.map((p) => (
                <li key={p.slug}>
                  <Link to={`/produit/${p.slug}`} className="group flex max-w-md items-center justify-between gap-4 border-b border-white/10 pb-2 hover:border-gold-400/60">
                    <span className="font-semibold text-white/85 group-hover:text-white">
                      {p.name.replace(' — 30th Celebration', '')}
                      {p.release!.length < 10 && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 align-middle text-xs font-bold text-sky-300">{releaseDate(p)}</span>}
                    </span>
                    <span className="font-display font-extrabold text-gold-300">{euro(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex gap-3 sm:mt-8">
              <a href="#nouveautes" className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-400 px-5 py-3.5 text-sm font-bold text-ink-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300 sm:flex-none sm:px-7 sm:py-4 sm:text-base">
                <span className="sm:hidden">Nouveautés</span>
                <span className="hidden sm:inline">Voir les nouveautés</span> <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
              <Link to="/collection-30-ans" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/5 sm:px-7 sm:py-4 sm:text-base">
                Collection 30 ans
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[460px]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/25 blur-3xl" />
            {heroBundle && (
              <Link
                to={`/produit/${heroBundle.slug}`}
                className="floaty absolute left-1/2 top-2 z-20 w-44 -translate-x-1/2 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-white/20 sm:w-64"
              >
                <img src={heroBundle.image} alt={heroBundle.name} fetchPriority="high" width={256} height={256} className="aspect-square w-full object-contain" />
                <span className="absolute -right-3 -top-3 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-bold text-ink-900 shadow-lg">{euro(heroBundle.price)}</span>
              </Link>
            )}
            {heroSides.map((p, i) => (
              <Link
                key={p.slug}
                to={`/produit/${p.slug}`}
                style={{ ['--r' as string]: i ? '8deg' : '-8deg', animationDelay: `${i + 1}s` }}
                className={`floaty absolute bottom-0 z-10 w-32 rounded-2xl bg-white p-2.5 shadow-2xl sm:w-48 ${i ? 'right-0' : 'left-0'}`}
              >
                <img src={p.image} alt={p.name} width={192} height={192} className="aspect-square w-full object-contain" />
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">{euro(p.price)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-10">
          <Perks dark />
        </div>
      </section>

      {/* BIENTÔT DISPONIBLE */}
      {releases.length > 0 && (
        <section id="nouveautes" className="mx-auto max-w-7xl scroll-mt-40 px-4 pt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-700 p-6 text-white md:p-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">
                  <CalendarClock size={14} /> {soon ? 'Bientôt disponible' : 'Nouveautés'}
                </p>
                <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                  {next ? `Sortie le ${releaseDate(next)}` : 'Les nouveautés 30th Celebration sont là'}
                </h2>
                <p className="mt-3 max-w-md text-white/80">
                  {soon
                    ? 'Les nouveautés 30th Celebration arrivent chez Poke 30. Les commandes ouvriront sur le site le jour de leur sortie.'
                    : `${datedNames.join(', ')} : commandez maintenant, expédié depuis la France.`}
                  {releases.filter((p) => p.release!.length < 10).map((p) => (
                    <span key={p.slug} className="mt-2 block font-semibold text-white">
                      {p.name.replace(' — 30th Celebration', '')} : sortie décalée {releaseLabel(p)}.
                    </span>
                  ))}
                </p>
              </div>
              <div className={`-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:items-stretch sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 ${releases.length > 2 ? 'sm:grid-cols-3' : releases.length > 1 ? 'sm:grid-cols-2' : 'sm:max-w-xs'}`}>
                {releases.map((p) => (
                  <div key={p.slug} className="w-56 shrink-0 snap-start text-ink-900 sm:w-auto">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
