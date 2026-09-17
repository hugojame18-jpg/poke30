import { useEffect, useState, type InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { euro } from '../lib/data'
import { useSeo } from '../lib/seo'
import { ProductVisual } from '../components/ProductCard'
import { DeliveryEstimate, PaymentBadges } from '../components/Trust'

const COUNTRIES = [
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'BE', name: 'Belgique', dial: '+32' },
  { code: 'CH', name: 'Suisse', dial: '+41' },
  { code: 'LU', name: 'Luxembourg', dial: '+352' },
  { code: 'MC', name: 'Monaco', dial: '+377' },
  { code: 'DE', name: 'Allemagne', dial: '+49' },
  { code: 'ES', name: 'Espagne', dial: '+34' },
  { code: 'IT', name: 'Italie', dial: '+39' },
  { code: 'NL', name: 'Pays-Bas', dial: '+31' },
  { code: 'PT', name: 'Portugal', dial: '+351' },
] as const

type Form = { firstName: string; lastName: string; email: string; phone: string; address: string; zip: string; city: string; country: string }
const EMPTY: Form = { firstName: '', lastName: '', email: '', phone: '', address: '', zip: '', city: '', country: 'FR' }
const KEY = 'pokeloot-checkout'

function Field({ label, error, prefix, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; prefix?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <span className={`flex h-12 items-center overflow-hidden rounded-xl bg-white ring-1 transition focus-within:ring-2 ${error ? 'ring-red-400' : 'ring-ink-900/15 focus-within:ring-gold-500'}`}>
        {prefix && <span className="pl-4 pr-1 font-semibold text-slate-500">{prefix}</span>}
        <input {...props} aria-invalid={!!error} className="h-full w-full bg-transparent px-4 outline-none" />
      </span>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

// Numéro international sans espaces : "06 12 34 56 78" + FR → "+33612345678"
function fullPhone(raw: string, dial: string) {
  const digits = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+')) return `+${digits}`
  if (raw.trim().startsWith('00')) return `+${digits.slice(2)}`
  return dial + digits.replace(/^0/, '')
}

export default function Checkout() {
  useSeo({ title: 'Livraison', description: 'Finalisez votre commande Poke 30.' })
  const { lines, subtotal } = useCart()
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
      /* storage unavailable */
    }
  }, [form])

  const country = COUNTRIES.find((c) => c.code === form.country) ?? COUNTRIES[0]
  const paymentUrl = SHOP.checkoutUrls[Math.round(subtotal * 100)]

  const errors: Partial<Record<keyof Form, string>> = {}
  if (!form.firstName.trim()) errors.firstName = 'Requis'
  if (!form.lastName.trim()) errors.lastName = 'Requis'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Adresse e-mail invalide'
  if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'Numéro invalide'
  if (!form.address.trim()) errors.address = 'Requis'
  if (!form.zip.trim()) errors.zip = 'Requis'
  if (!form.city.trim()) errors.city = 'Requis'
  const valid = Object.keys(errors).length === 0
  const err = (k: keyof Form) => (touched ? errors[k] : undefined)
  const bind = (k: keyof Form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
  })

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Votre panier est vide</h1>
        <Link to="/collection-30-ans" className="mt-6 inline-block rounded-full bg-gold-400 px-6 py-3 font-bold">Voir la collection 30 ans</Link>
      </div>
    )

  const submit = (e: React.FormEvent) => {
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
    if (!paymentUrl) return
    const url = new URL(paymentUrl)
    url.searchParams.set('sub9', form.firstName.trim())
    url.searchParams.set('sub10', form.lastName.trim())
    url.searchParams.set('sub11', form.email.trim())
    url.searchParams.set('sub12', fullPhone(form.phone, country.dial))
    url.searchParams.set('sub13', form.address.trim())
    url.searchParams.set('sub14', form.zip.trim())
    url.searchParams.set('sub15', form.city.trim())
    url.searchParams.set('sub16', country.code)
    window.location.href = url.toString()
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-ink-900">
          <ArrowLeft size={16} /> Retour
        </Link>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          <Lock size={14} /> Paiement sécurisé
        </p>
      </div>

      <div className="rounded-3xl bg-white p-4 ring-1 ring-ink-900/5">
        {lines.map(({ slug, product }) => (
          <div key={slug} className="flex items-center gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
              <ProductVisual product={product} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-semibold">{product.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
                <Truck size={14} /> Livraison offerte
              </p>
            </div>
            <p className="font-display text-2xl font-bold">{euro(product.price)}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Adresse de livraison</h1>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" autoComplete="given-name" error={err('firstName')} {...bind('firstName')} />
          <Field label="Nom" autoComplete="family-name" error={err('lastName')} {...bind('lastName')} />
        </div>
        <Field label="E-mail" type="email" autoComplete="email" inputMode="email" placeholder="vous@email.fr" error={err('email')} {...bind('email')} />
        <Field label="Adresse" autoComplete="street-address" placeholder="12 rue des Lilas" error={err('address')} {...bind('address')} />
        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <Field label="Code postal" autoComplete="postal-code" inputMode="numeric" error={err('zip')} {...bind('zip')} />
          <Field label="Ville" autoComplete="address-level2" error={err('city')} {...bind('city')} />
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Pays</span>
          <select autoComplete="country" {...bind('country')} className="h-12 w-full rounded-xl bg-white px-3 outline-none ring-1 ring-ink-900/15 focus:ring-2 focus:ring-gold-500">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </label>
        <Field label="Téléphone" type="tel" autoComplete="tel-national" inputMode="tel" prefix={country.dial} placeholder="6 12 34 56 78" error={err('phone')} {...bind('phone')} />

        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">
          <DeliveryEstimate compact />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 py-4 text-lg font-bold text-ink-900 shadow-lg shadow-gold-400/25 transition hover:bg-gold-300"
        >
          <Lock size={18} /> Procéder au paiement · {euro(subtotal)}
        </button>
        {touched && !valid && <p className="text-center text-sm text-red-500">Merci de compléter les champs indiqués.</p>}
        <PaymentBadges className="justify-center" />
        <p className="flex items-start justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} className="mt-px shrink-0 text-gold-500" />
          Produits 100 % officiels et scellés. Droit de rétractation de {SHOP.returnDays} jours sur les produits non ouverts.
        </p>
      </form>
    </div>
  )
}
