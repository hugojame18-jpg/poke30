import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, CreditCard, Flame, Lock, MousePointerClick, Sparkles, Truck } from 'lucide-react'
import { useState } from 'react'
import { FAQ, PRODUCTS, canOrder, euro, listRank, isUpcoming, releaseDate } from '../lib/data'
import { SHOP } from '../lib/config'
import { deliveryDate } from '../lib/delivery'
import ProductCard from '../components/ProductCard'
import { Perks } from '../components/Footer'
import { GUARANTEES } from '../components/Trust'
import { useSeo } from '../lib/seo'

// Une seule grille : nouveautés commandables en tête, puis la collection, puis à venir et épuisés
const collection30 = PRODUCTS.filter((p) => p.tags.includes('30 ans')).sort((a, b) => listRank(a) - listRank(b))
const releases = PRODUCTS.filter((p) => p.release)
// Prochaine sortie à date fixe (les sorties « au mois près », comme le classeur en décembre, ne comptent pas)
const nextDated = () => releases.find((p) => p.release!.length === 10 && isUpcoming(p))
// Visuel d'accueil : le Booster Bundle au centre, les autres sorties de chaque côté
const heroBundle = releases.find((p) => p.slug.startsWith('booster-bundle')) ?? releases[0]
const heroSides = releases.filter((p) => p !== heroBundle).slice(0, 2)
const shortName = (name: string) => name.replace(' — 30th Celebration', '')

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
  const next = nextDated()
  const heroOrderable = !!heroBundle && canOrder(heroBundle) && heroBundle.stock > 0
  useSeo({
    title: 'Poke 30 — Collection Pokémon 30 ans & 30th Celebration',
    description: 'Spécialiste français Pokémon : nouveautés 30th Celebration, coffrets First Partners et collection 30 ans. Produits officiels, livraison suivie offerte.',
    image: heroBundle?.image,
    jsonLd: ORGANIZATION_LD,
  })

  const steps = [
    { icon: MousePointerClick, title: 'Choisissez votre produit', text: '1 article par commande, pour que chaque collectionneur ait sa chance.' },
    { icon: CreditCard, title: 'Payez en toute sécurité', text: `${SHOP.payments.join(', ')}.` },
    { icon: Truck, title: `Reçu en ${SHOP.deliveryDays} jours`, text: `Livraison suivie offerte : commandé aujourd’hui, reçu le ${deliveryDate()}.` },
  ]

  return (
    <>
      {/* HERO : produit phare et achat direct */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(56,189,248,.22),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(255,210,63,.16),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-9 sm:gap-12 sm:py-16 md:grid-cols-[1.1fr_1fr] md:gap-8 lg:gap-12 lg:py-20">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-300 ring-1 ring-sky-400/30 sm:text-xs sm:tracking-[0.18em]">
              <Sparkles size={14} /> {next ? `Sortie le ${releaseDate(next)}` : 'Nouveau · 30th Celebration'}
            </span>
            <h1 className="mt-5 font-display text-[2.1rem] font-extrabold leading-[0.95] tracking-tight min-[380px]:text-[2.6rem] sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl">
              30th Celebration&nbsp;:
              <br />
              les nouveautés
              <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-orange-400 bg-clip-text text-transparent">{next ? 'arrivent.' : 'sont là.'}</span>
            </h1>
            <ul className="mt-6 space-y-2 sm:text-lg">
              {releases.map((p) => (
                <li key={p.slug}>
                  <Link to={`/produit/${p.slug}`} className="group flex max-w-md items-center justify-between gap-4 border-b border-white/10 pb-2 hover:border-gold-400/60">
                    <span className="font-semibold text-white/85 group-hover:text-white">
                      {shortName(p.name)}
                      {p.release!.length < 10 && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 align-middle text-xs font-bold text-sky-300">{releaseDate(p)}</span>}
                    </span>
                    <span className="font-display font-extrabold text-gold-300">{euro(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {heroOrderable ? (
                <Link
                  to={`/produit/${heroBundle.slug}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-5 py-4 text-center font-bold text-ink-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300 sm:px-7 lg:whitespace-nowrap"
                >
                  <Lock size={18} /> Commander le {shortName(heroBundle.name)} · {euro(heroBundle.price)}
                </Link>
              ) : null}
              <a
                href="#nouveautes"
                className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-4 text-center font-bold transition sm:px-7 lg:whitespace-nowrap ${
                  heroOrderable ? 'ring-1 ring-white/20 hover:bg-white/5' : 'bg-gold-400 text-ink-900 hover:bg-gold-300'
                }`}
              >
                Voir toutes les nouveautés <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {[`Livraison offerte en ${SHOP.deliveryDays} jours`, 'Officiel & scellé', '1 article par commande'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-400" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto h-[280px] w-full max-w-md sm:h-[440px] md:h-[360px] lg:h-[440px]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/25 blur-3xl" />
            {heroBundle?.image && (
              <Link
                to={`/produit/${heroBundle.slug}`}
                className="floaty absolute left-1/2 top-2 z-20 w-40 -translate-x-1/2 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-white/20 sm:w-64 md:w-48 lg:w-64"
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
                className={`floaty absolute bottom-0 z-10 w-28 rounded-2xl bg-white p-2.5 shadow-2xl sm:w-48 md:w-36 lg:w-48 ${i ? 'right-0' : 'left-0'}`}
              >
                {p.image && <img src={p.image.replace('/products/', '/products/sm/')} alt={p.name} width={192} height={192} className="aspect-square w-full object-contain" />}
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">{euro(p.price)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-10">
          <Perks dark />
        </div>
      </section>

      {/* PRODUITS : une seule grille, nouveautés d'abord */}
      <section id="nouveautes" className="scroll-mt-28 bg-ink-900 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead eyebrow="Nouveautés & collection 30 ans" title="Choisissez votre produit" to="/boutique" dark />
          <div className="mb-8 flex items-start gap-3 rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-100 ring-1 ring-orange-400/25">
            <Flame size={18} className="mt-0.5 shrink-0 text-orange-400" />
            <p>
              <strong className="text-orange-300">Stocks limités, 1 article par commande.</strong> Une fois épuisés, certains produits de l’anniversaire ne seront pas réassortis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {collection30.map((p) => (
              <ProductCard key={p.slug} product={p} dark />
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHead eyebrow="Simple et rapide" title="Comment ça marche" />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-3xl bg-white p-6 ring-1 ring-ink-900/5">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-ink-900/5">{i + 1}</span>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-500">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* GARANTIES */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
        <SectionHead eyebrow="Acheter en confiance" title="Nos engagements" />
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-5 ring-1 ring-ink-900/5 sm:p-6">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-400/15 text-gold-500">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-display font-bold sm:text-lg">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4">
        <SectionHead eyebrow="Avant de commander" title="Questions fréquentes" to="/faq" />
        <div className="divide-y divide-ink-900/10 rounded-2xl bg-white ring-1 ring-ink-900/5">
          {FAQ.slice(0, 5).map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" aria-expanded={faq === i}>
                {f.q}
                <ChevronDown size={18} className={`shrink-0 transition ${faq === i ? 'rotate-180' : ''}`} />
              </button>
              {faq === i && <p className="fade-in px-5 pb-5 text-sm text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#nouveautes" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-4 font-bold text-ink-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300">
            Voir les produits <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  )
}
