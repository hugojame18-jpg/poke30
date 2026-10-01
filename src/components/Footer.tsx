import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Clock, Mail, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { SHOP } from '../lib/config'
import { PaymentBadges } from './Trust'

const PERKS = [
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: SHOP.payments.slice(0, 3).join(', ') },
  { icon: PackageCheck, title: '100 % officiel', text: 'Produits scellés d’usine' },
  { icon: Truck, title: 'Livraison suivie', text: 'Offerte, sans minimum' },
  { icon: Clock, title: `Livré en ${SHOP.deliveryDays} jours`, text: 'Suivi inclus' },
]

export function Perks({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 lg:grid-cols-4">
      {PERKS.map(({ icon: Icon, title, text }) => (
        <div key={title} className={`flex items-center gap-3 rounded-2xl p-4 ${dark ? 'bg-white/5 text-white' : 'bg-white'}`}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-500">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className={`text-xs ${dark ? 'text-white/60' : 'text-slate-500'}`}>{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Footer() {
  const { pathname } = useLocation()

  // Page de commande : pied de page minimal, sans liens de sortie
  if (pathname === '/commande')
    return (
      <footer className="mt-16 border-t border-ink-900/10 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row">
          <p>
            Une question ? <a href={`mailto:${SHOP.email}`} className="font-semibold text-ink-900 underline">{SHOP.email}</a>
          </p>
          <p>© {new Date().getFullYear()} {SHOP.name}</p>
        </div>
      </footer>
    )

  return (
    <footer className="mt-24 bg-ink-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-center gap-6 rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 p-8 ring-1 ring-white/10 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Une question avant de commander ?</p>
            <h3 className="mt-2 font-display text-3xl font-bold">On vous répond par e-mail.</h3>
            <p className="mt-2 text-white/60">Disponibilité, livraison, suivi de colis : écrivez-nous, ou consultez les réponses aux questions les plus fréquentes.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={`mailto:${SHOP.email}`} className="flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 font-bold text-ink-900 hover:bg-gold-300">
              <Mail size={18} /> {SHOP.email}
            </a>
            <Link to="/faq" className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold ring-1 ring-white/20 hover:bg-white/5">
              Questions fréquentes <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl font-extrabold">
                Poke <span className="text-gold-400">30</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60">Spécialiste français Pokémon : collection 30 ans et nouveautés 30th Celebration, expédiées depuis la France.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Boutique</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link className="hover:text-gold-400" to="/boutique?tri=nouveautes">Nouveautés</Link></li>
              <li><Link className="hover:text-gold-400" to="/collection-30-ans">Collection 30 ans</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique">Toute la boutique</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Aide</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link className="hover:text-gold-400" to="/faq">Questions fréquentes</Link></li>
              <li><Link className="hover:text-gold-400" to="/faq#contact">Nous contacter</Link></li>
              <li><Link className="hover:text-gold-400" to="/blog">Blog & guides</Link></li>
              <li><Link className="hover:text-gold-400" to="/compte">Suivre ma commande</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Retrait</h4>
            <p className="mt-4 flex gap-2 text-sm text-white/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> Émerainville, sur rendez-vous
            </p>
            <p className="mt-2 flex gap-2 text-sm text-white/80">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold-400" /> Livraison en {SHOP.deliveryDays} jours
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SHOP.name} — Tous droits réservés.</p>
          <PaymentBadges dark />
          <p>Pokémon est une marque de Nintendo, Creatures Inc. et GAME FREAK inc.</p>
        </div>
      </div>
    </footer>
  )
}
