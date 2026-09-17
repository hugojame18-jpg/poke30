import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Mail, MapPin } from 'lucide-react'
import { ARTICLES, FAQ, universeOf } from '../lib/data'
import { SHOP } from '../lib/config'
import { useSeo } from '../lib/seo'
import { dateFr } from './Home'
import NotFound from './NotFound'

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {text && <p className="mt-2 max-w-xl text-white/60">{text}</p>}
      </div>
    </section>
  )
}

export function Blog() {
  useSeo({ title: 'Blog & guides Pokémon', description: 'Conseils de collection et de protection pour vos cartes Pokémon.' })
  return (
    <>
      <PageHero eyebrow="Infos & guides" title="Le blog Poke 30" text="Conseils de collection et de protection pour vos cartes Pokémon." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3">
        {ARTICLES.map((a) => {
          const u = universeOf(a.universe)
          return (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="group overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex aspect-[16/9] items-end p-5" style={{ background: `radial-gradient(circle at 80% 0%, ${u.from}, transparent 60%), linear-gradient(135deg, ${u.to}, #0b1026)` }}>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">{u.label}</span>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-500">{dateFr(a.date)}</p>
                <h2 className="mt-2 font-display text-xl font-bold leading-snug group-hover:underline">{a.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{a.excerpt}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export function ArticlePage() {
  const { slug } = useParams()
  const a = ARTICLES.find((x) => x.slug === slug)
  useSeo({ title: a?.title ?? 'Article introuvable', description: a?.excerpt ?? '' })
  if (!a) return <NotFound />
  const u = universeOf(a.universe)
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink-900">
        <ArrowLeft size={16} /> Tous les articles
      </Link>
      <p className="mt-8 text-sm text-slate-500">
        {dateFr(a.date)} · <span className="font-semibold text-gold-500">{u.label}</span>
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight tracking-tight">{a.title}</h1>
      <p className="mt-4 text-xl text-slate-600">{a.excerpt}</p>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-800">
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Link to={`/boutique/${u.id}`} className="mt-12 flex items-center justify-between rounded-2xl bg-ink-900 p-6 text-white hover:bg-ink-800">
        <span className="font-display text-lg font-bold">Voir les produits {u.label}</span>
        <span className="text-gold-400">→</span>
      </Link>
    </article>
  )
}

export function FaqPage() {
  useSeo({ title: 'Questions fréquentes', description: 'Livraison, retrait, commandes et authenticité : toutes les réponses.' })
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <PageHero eyebrow="Aide" title="Questions fréquentes" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="divide-y divide-ink-900/10 self-start rounded-3xl bg-white ring-1 ring-ink-900/5">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-6 text-left font-display text-lg font-bold">
                {f.q}
                <ChevronDown className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="fade-in px-6 pb-6 text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
        <aside id="contact" className="self-start rounded-3xl bg-ink-900 p-8 text-white">
          <h2 className="font-display text-2xl font-bold">Nous contacter</h2>
          <p className="mt-2 text-white/60">Une question sur une commande ou un produit ? On répond vite.</p>
          <a href={`mailto:${SHOP.email}`} className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
            <Mail className="text-gold-400" size={20} /> {SHOP.email}
          </a>
          <p className="mt-3 flex items-center gap-3 rounded-2xl bg-white/5 p-4">
            <MapPin className="text-gold-400" size={20} /> Retrait à Émerainville sur rendez-vous
          </p>
        </aside>
      </div>
    </>
  )
}

export function Account() {
  useSeo({ title: 'Mon compte', description: 'Espace client Poke 30.' })
  return (
    <>
      <PageHero eyebrow="Le Club Poke 30" title="Mon compte" text="Suivez vos commandes et cumulez des points sur vos achats." />
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-ink-900/5">
          <p className="text-slate-600">L’espace client sera branché sur votre système d’authentification.</p>
          <Link to="/boutique" className="mt-6 inline-block rounded-full bg-ink-900 px-6 py-3 font-bold text-white">Retour à la boutique</Link>
        </div>
      </div>
    </>
  )
}
