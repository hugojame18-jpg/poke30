import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Copy, Gift, X } from 'lucide-react'
import { SHOP } from '../lib/config'
import { useCart } from '../lib/cart'
import { track } from '../lib/analytics'

const KEY = 'pokeloot-welcome-seen'
const WEEK = 7 * 864e5

function seenRecently() {
  try {
    return Date.now() - Number(localStorage.getItem(KEY) ?? 0) < WEEK
  } catch {
    return true
  }
}
function markSeen() {
  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}

/** Popup de bienvenue : intention de sortie (desktop) ou après 30 s de navigation, max 1 fois / semaine. */
export default function WelcomePopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const { pathname } = useLocation()
  const { applyPromo } = useCart()
  const blocked = !SHOP.welcome || pathname.startsWith('/commande')

  useEffect(() => {
    if (blocked || seenRecently()) return
    const show = () => {
      if (seenRecently()) return
      markSeen()
      setOpen(true)
    }
    const timer = setTimeout(show, 30000)
    const onLeave = (e: MouseEvent) => e.clientY <= 0 && show()
    document.addEventListener('mouseout', onLeave)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [blocked])

  useEffect(() => {
    if (blocked) setOpen(false)
  }, [blocked])

  if (!open || !SHOP.welcome) return null
  const { code, percent } = SHOP.welcome

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Offre de bienvenue">
      <div className="fade-in absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fade-in relative w-full max-w-md overflow-hidden rounded-3xl bg-ink-900 text-white shadow-2xl ring-1 ring-white/10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/25 blur-3xl" />
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Fermer">
          <X size={20} />
        </button>
        <div className="relative p-8">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-ink-900">
            <Gift size={28} />
          </div>
          {done ? (
            <>
              <h2 className="mt-5 font-display text-3xl font-extrabold">Bienvenue au Club !</h2>
              <p className="mt-2 text-white/70">Votre code est déjà appliqué à votre panier :</p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(code).catch(() => {})
                  setCopied(true)
                }}
                className="mt-5 flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-gold-400 px-5 py-4 font-display text-2xl font-extrabold tracking-widest text-gold-300"
              >
                {code} <span className="flex items-center gap-1 font-sans text-xs font-semibold tracking-normal text-white/60"><Copy size={14} /> {copied ? 'Copié' : 'Copier'}</span>
              </button>
              <button onClick={() => setOpen(false)} className="mt-4 w-full rounded-full bg-gold-400 py-3.5 font-bold text-ink-900 hover:bg-gold-300">
                Continuer mes achats
              </button>
            </>
          ) : (
            <>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Offre de bienvenue</p>
              <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight">−{percent} % sur votre première commande</h2>
              <p className="mt-3 text-white/70">Rejoignez le Club Poke 30 : réassorts et précommandes en avant-première, directement par e-mail.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.includes('@')) return
                  track.signUp('welcome_popup')
                  applyPromo(code)
                  setDone(true)
                }}
                className="mt-6 space-y-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="h-12 w-full rounded-full bg-white/10 px-5 outline-none ring-1 ring-white/15 placeholder:text-white/40 focus:ring-gold-400"
                />
                <button className="h-12 w-full rounded-full bg-gold-400 font-bold text-ink-900 hover:bg-gold-300">Recevoir mon code</button>
              </form>
              <button onClick={() => setOpen(false)} className="mt-3 w-full text-center text-xs text-white/40 hover:text-white/70">
                Non merci
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
