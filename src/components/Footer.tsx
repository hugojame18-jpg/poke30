import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { SHOP } from '../lib/config'
import { euro } from '../lib/data'
import { track } from '../lib/analytics'
import { PaymentBadges } from './Trust'

const PERKS = [
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: SHOP.payments.slice(0, 3).join(', ') },
  { icon: PackageCheck, title: '100 % officiel', text: 'Produits scellés d’usine' },
  { icon: Truck, title: 'Livraison suivie', text: `Offerte dès ${euro(SHOP.freeShippingFrom)}` },
  { icon: Clock, title: `Expédié sous ${SHOP.prepDays * 24} h`, text: 'Jours ouvrés' },
]

export function Perks({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="mt-24 bg-ink-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 p-8 ring-1 ring-white/10 md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Le Club Poke 30</p>
            <h3 className="mt-2 font-display text-3xl font-bold">Ne ratez plus aucune sortie.</h3>
            <p className="mt-2 text-white/60">Précommandes, réassorts et avantages membres, directement par e-mail.</p>
          </div>
          {sent ? (
            <p className="self-center text-lg font-semibold text-gold-300">Merci, vous êtes inscrit·e ✦</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes('@')) {
                  track.signUp('footer')
                  setSent(true)
                }
              }}
              className="flex flex-col gap-3 self-center sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="h-12 flex-1 rounded-full bg-white/10 px-5 outline-none ring-1 ring-white/15 placeholder:text-white/40 focus:ring-gold-400"
              />
              <button className="h-12 rounded-full bg-gold-400 px-6 font-bold text-ink-900 hover:bg-gold-300">S’inscrire</button>
            </form>
          )}
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}logo.webp`} alt="" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl font-extrabold">
                Poke<span className="text-gold-400">loot</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60">Spécialiste français du TCG. Pokémon, One Piece, Yu-Gi-Oh! et cartes gradées, expédiés depuis la France.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Boutique</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link className="hover:text-gold-400" to="/collection-30-ans">Collection 30 ans</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique/pokemon">Pokémon</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique/one-piece">One Piece</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique/yu-gi-oh">Yu-Gi-Oh!</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique/gradees">Cartes gradées</Link></li>
              <li><Link className="hover:text-gold-400" to="/boutique/accessoires">Accessoires</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Aide</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link className="hover:text-gold-400" to="/faq">Questions fréquentes</Link></li>
              <li><Link className="hover:text-gold-400" to="/faq#contact">Nous contacter</Link></li>
              <li><Link className="hover:text-gold-400" to="/blog">Blog & guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Retrait</h4>
            <p className="mt-4 flex gap-2 text-sm text-white/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> Émerainville, sur rendez-vous
            </p>
            <p className="mt-2 flex gap-2 text-sm text-white/80">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold-400" /> Préparation sous 24 à 48 h ouvrées
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Poke 30 — Tous droits réservés.</p>
          <PaymentBadges dark />
          <p>Pokémon, One Piece, Yu-Gi-Oh! et Magic sont des marques de leurs propriétaires respectifs.</p>
        </div>
      </div>
    </footer>
  )
}
