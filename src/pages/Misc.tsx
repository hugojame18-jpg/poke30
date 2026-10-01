import { useState } from 'react'
import { deliveryDate } from '../lib/delivery'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Clock, Mail, MapPin, PackageSearch, Truck } from 'lucide-react'
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

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

export function FaqPage() {
  useSeo({ title: 'Questions fréquentes', description: 'Livraison, retrait, commandes et authenticité : toutes les réponses.', jsonLd: FAQ_LD })
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
  useSeo({ title: 'Suivre ma commande', description: 'Suivi de commande, délais de livraison et contact Poke 30.' })
  const date = deliveryDate()
  const steps = [
    { icon: PackageSearch, title: 'Préparation', text: 'Votre commande est vérifiée et emballée avec soin dès sa réception.' },
    { icon: Truck, title: 'Expédition suivie', text: 'Le numéro de suivi vous est envoyé par e-mail dès le départ du colis.' },
    { icon: Clock, title: 'Livraison', text: `En ${SHOP.deliveryDays} jours : pour une commande passée aujourd’hui, livraison le ${date}.` },
  ]
  return (
    <>
      <PageHero eyebrow="Espace client" title="Suivre ma commande" text="Toutes les étapes de votre commande, de la préparation à la livraison." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[2fr_1fr]">
        <ol className="space-y-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-900/5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-400/15 text-gold-500">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Étape {i + 1}</p>
                <h2 className="mt-1 font-display text-lg font-bold">{title}</h2>
                <p className="mt-1 text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="self-start rounded-3xl bg-ink-900 p-8 text-white">
          <h2 className="font-display text-2xl font-bold">Une question sur votre commande ?</h2>
          <p className="mt-2 text-white/60">Écrivez-nous avec votre nom et l’adresse e-mail utilisée lors de la commande, nous vous répondons rapidement.</p>
          <a href={`mailto:${SHOP.email}?subject=${encodeURIComponent('Suivi de ma commande')}`} className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
            <Mail className="text-gold-400" size={20} /> {SHOP.email}
          </a>
          <Link to="/faq" className="mt-3 block rounded-2xl bg-white/5 p-4 text-center font-semibold hover:bg-white/10">
            Voir les questions fréquentes
          </Link>
        </aside>
      </div>
    </>
  )
}
