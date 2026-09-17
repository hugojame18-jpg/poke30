import { useEffect, useState, type InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, ShieldCheck, Store, Truck } from 'lucide-react'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { euro } from '../lib/data'
import { useSeo } from '../lib/seo'
import { ProductVisual } from '../components/ProductCard'
import { DeliveryEstimate, PaymentBadges } from '../components/Trust'

type Form = { email: string; firstName: string; lastName: string; address: string; zip: string; city: string; phone: string }
const EMPTY: Form = { email: '', firstName: '', lastName: '', address: '', zip: '', city: '', phone: '' }
const KEY = 'pokeloot-checkout'

function Field({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        className={`h-12 w-full rounded-xl bg-white px-4 outline-none ring-1 transition focus:ring-2 ${error ? 'ring-red-400' : 'ring-ink-900/15 focus:ring-gold-500'}`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/60 p-5 ring-1 ring-ink-900/5 sm:p-6">
      <h2 className="flex items-center gap-3 font-display text-xl font-bold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-sm text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function Checkout() {
  useSeo({ title: 'Commande', description: 'Finalisez votre commande Poke 30.' })
  const { lines, subtotal, discount, total } = useCart()
  const [mode, setMode] = useState<'livraison' | 'retrait'>('livraison')
  const [form, setForm] = useState<Form>(() => {
    try {
      return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) ?? '{}') }
    } catch {
      return EMPTY
    }
  })
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(form))
    } catch {
      /* ignore */
    }
  }, [form])

  const shipping = mode === 'retrait' ? 0 : total - (subtotal - discount)
  const grand = subtotal - discount + shipping

  const errors: Partial<Record<keyof Form, string>> = {}
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Adresse e-mail invalide'
  if (!form.firstName.trim()) errors.firstName = 'Requis'
  if (!form.lastName.trim()) errors.lastName = 'Requis'
  if (mode === 'livraison') {
    if (!form.address.trim()) errors.address = 'Requis'
    if (!/^\d{5}$/.test(form.zip)) errors.zip = '5 chiffres'
    if (!form.city.trim()) errors.city = 'Requis'
  }
  if (mode === 'retrait' && form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Pour convenir du rendez-vous'
  const valid = Object.keys(errors).length === 0
  const err = (k: keyof Form) => (touched ? errors[k] : undefined)
  const bind = (k: keyof Form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value })) })

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Votre panier est vide</h1>
        <Link to="/collection-30-ans" className="mt-6 inline-block rounded-full bg-gold-400 px-6 py-3 font-bold">Voir la collection 30 ans</Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/boutique" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink-900">
          <ArrowLeft size={16} /> Continuer mes achats
        </Link>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          <Lock size={14} /> Paiement sécurisé
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setTouched(true)
            if (!valid) {
              setTimeout(() => {
                const el = document.querySelector<HTMLInputElement>('[aria-invalid="true"]')
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el?.focus({ preventScroll: true })
              })
              return
            }
            const cents = Math.round((subtotal - discount) * 100)
            const url = SHOP.checkoutUrls[cents]
            if (url) {
              window.location.href = url
            }
          }}
          noValidate
        >
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Finaliser ma commande</h1>
          <p className="text-sm text-slate-500">Pas besoin de créer de compte : commandez en invité.</p>

          <Step n={1} title="Contact">
            <Field label="E-mail" type="email" autoComplete="email" inputMode="email" placeholder="vous@email.fr" error={err('email')} {...bind('email')} />
            <p className="mt-2 text-xs text-slate-500">Pour la confirmation et le suivi de colis.</p>
          </Step>

          <Step n={2} title="Réception">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ['livraison', Truck, 'Livraison suivie', total - (subtotal - discount) === 0 ? 'Offerte' : euro(SHOP.shippingPrice)],
                ['retrait', Store, `Retrait à ${SHOP.pickupCity}`, 'Gratuit · sur rendez-vous'],
              ] as const).map(([id, Icon, t, s]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setMode(id)}
                  aria-pressed={mode === id}
                  className={`flex items-center gap-3 rounded-2xl bg-white p-4 text-left ring-2 transition ${mode === id ? 'ring-gold-500' : 'ring-ink-900/5 hover:ring-ink-900/15'}`}
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-2 ${mode === id ? 'ring-gold-500' : 'ring-ink-900/20'}`}>
                    {mode === id && <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />}
                  </span>
                  <Icon className="shrink-0 text-gold-500" size={20} />
                  <span>
                    <span className="block font-bold">{t}</span>
                    <span className="text-sm text-slate-500">{s}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" autoComplete="given-name" error={err('firstName')} {...bind('firstName')} />
              <Field label="Nom" autoComplete="family-name" error={err('lastName')} {...bind('lastName')} />
              {mode === 'livraison' ? (
                <>
                  <div className="sm:col-span-2">
                    <Field label="Adresse" autoComplete="street-address" error={err('address')} {...bind('address')} />
                  </div>
                  <Field label="Code postal" autoComplete="postal-code" inputMode="numeric" maxLength={5} error={err('zip')} {...bind('zip')} />
                  <Field label="Ville" autoComplete="address-level2" error={err('city')} {...bind('city')} />
                  <div className="sm:col-span-2">
                    <Field label="Téléphone (facultatif)" type="tel" autoComplete="tel" inputMode="tel" {...bind('phone')} />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <Field label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" error={err('phone')} {...bind('phone')} />
                </div>
              )}
            </div>
            {mode === 'livraison' && (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-emerald-900">
                <DeliveryEstimate compact />
              </div>
            )}
          </Step>

          <Step n={3} title="Paiement">
            <div className="rounded-2xl border-2 border-dashed border-ink-900/15 p-5 text-sm text-slate-600">
              <p className="flex items-center gap-2 font-semibold text-ink-900">
                <Lock size={16} /> Module de paiement à connecter
              </p>
              <p className="mt-1">Branchez ici Stripe Checkout, PayPal ou Shopify. Aucune donnée bancaire n’est collectée sur cette page.</p>
            </div>
            <PaymentBadges className="mt-4" />
          </Step>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 py-4 text-lg font-bold text-ink-900 shadow-lg shadow-gold-400/25 transition hover:bg-gold-300"
          >
            <Lock size={18} /> Payer {euro(grand)}
          </button>
          {touched && !valid && <p className="text-center text-sm text-red-500">Merci de compléter les champs indiqués.</p>}
          {touched && valid && <p className="text-center text-sm text-slate-600">Formulaire valide — il reste à connecter le paiement.</p>}
          <p className="text-center text-xs text-slate-500">
            En commandant, vous acceptez nos conditions générales de vente. Droit de rétractation de {SHOP.returnDays} jours sur les produits non ouverts.
          </p>
        </form>

        <aside className="space-y-4 self-start lg:sticky lg:top-36">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-900/5">
            <h2 className="font-display text-xl font-bold">Récapitulatif</h2>
            <ul className="mt-4 divide-y divide-ink-900/10">
              {lines.map(({ slug, qty, product }) => (
                <li key={slug} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-lg bg-slate-100">
                    <div className="h-full w-full overflow-hidden rounded-lg">
                      <ProductVisual product={product} />
                    </div>
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink-900 px-1 text-[11px] font-bold text-white">{qty}</span>
                  </div>
                  <span className="line-clamp-2 flex-1 text-sm">{product.name}</span>
                  <span className="text-sm font-bold">{euro(qty * product.price)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Sous-total</dt><dd>{euro(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Réduction</dt><dd>−{euro(discount)}</dd></div>}
              <div className="flex justify-between"><dt>{mode === 'retrait' ? 'Retrait' : 'Livraison'}</dt><dd>{shipping ? euro(shipping) : 'Gratuite'}</dd></div>
              <div className="flex justify-between border-t border-ink-900/10 pt-3 font-display text-2xl font-bold"><dt>Total</dt><dd>{euro(grand)}</dd></div>
              <p className="text-right text-xs text-slate-500">TVA incluse</p>
            </dl>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-ink-900/5">
            <ShieldCheck size={20} className="shrink-0 text-gold-500" />
            <p>
              <strong>Produits 100 % officiels et scellés.</strong> Emballage renforcé, expédition depuis la France.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
