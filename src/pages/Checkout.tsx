import { useEffect, useState, type InputHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, PackageCheck, RotateCcw, Truck } from 'lucide-react'
import { useCart } from '../lib/cart'
import { SHOP } from '../lib/config'
import { euro } from '../lib/data'
import { useSeo } from '../lib/seo'
import { ProductVisual } from '../components/ProductCard'
import { DeliveryEstimate, OneItemNotice, PaymentBadges } from '../components/Trust'

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
  // Champs déjà quittés : leurs erreurs s'affichent sans attendre l'envoi du formulaire
  const [visited, setVisited] = useState<Partial<Record<keyof Form, boolean>>>({})

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
  if (!form.firstName.trim()) errors.firstName = 'Indiquez votre prénom'
  if (!form.lastName.trim()) errors.lastName = 'Indiquez votre nom'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Adresse e-mail invalide (ex. vous@email.fr)'
  if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'Numéro de téléphone incomplet'
  if (!form.address.trim()) errors.address = 'Indiquez votre adresse'
  if (!form.zip.trim()) errors.zip = 'Code postal requis'
  if (!form.city.trim()) errors.city = 'Ville requise'
  const valid = Object.keys(errors).length === 0
  const err = (k: keyof Form) => (touched || visited[k] ? errors[k] : undefined)
  const bind = (k: keyof Form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
    onBlur: () => setVisited((v) => (v[k] ? v : { ...v, [k]: true })),
  })

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Votre panier est vide</h1>
        <Link to="/boutique" className="mt-6 inline-block rounded-full bg-gold-400 px-6 py-3 font-bold">Voir la boutique</Link>
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

  const product = lines[0].product

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link to={`/produit/${lines[0].slug}`} className="-m-2 inline-flex items-center gap-1 p-2 text-sm font-semibold text-slate-500 hover:text-ink-900" aria-label="Retour au produit">
          <ArrowLeft size={16} /> <span className="hidden min-[360px]:inline">Retour</span>
        </Link>
        <ol className="flex items-center gap-1.5 text-xs font-bold sm:gap-2 sm:text-sm" aria-label="Étapes de la commande">
          <li className="flex items-center gap-1.5 text-ink-900">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-400">1</span> Livraison
          </li>
          <li aria-hidden="true" className="h-px w-4 bg-ink-900/20 sm:w-6" />
          <li className="flex items-center gap-1.5 text-slate-400">
            <span className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-slate-300">2</span> Paiement
          </li>
        </ol>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        {/* Récapitulatif : en haut sur mobile, à droite sur ordinateur */}
        <aside className="self-start lg:sticky lg:top-6 lg:order-2">
          <div className="rounded-3xl bg-white p-4 ring-1 ring-ink-900/5 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                <ProductVisual product={product} sizes="96px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold">{product.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">Quantité : 1 · {product.lang}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-1.5 border-t border-ink-900/10 pt-3 text-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{euro(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-emerald-700">
                <dt className="flex items-center gap-1.5"><Truck size={14} /> Livraison suivie</dt>
                <dd className="font-semibold">Offerte</dd>
              </div>
              <div className="flex justify-between pt-1 font-display text-xl font-bold">
                <dt>Total</dt>
                <dd>{euro(subtotal)}</dd>
              </div>
            </dl>
            <div className="mt-4 hidden space-y-3 lg:block">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">
                <DeliveryEstimate compact />
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><PackageCheck size={14} className="shrink-0 text-gold-500" /> Produit officiel, neuf et scellé d’usine</li>
                <li className="flex items-center gap-2"><RotateCcw size={14} className="shrink-0 text-gold-500" /> {SHOP.returnDays} jours pour changer d’avis (produit non ouvert)</li>
              </ul>
            </div>
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="space-y-4 lg:order-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Adresse de livraison</h1>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" autoComplete="given-name" autoCapitalize="words" error={err('firstName')} {...bind('firstName')} />
            <Field label="Nom" autoComplete="family-name" autoCapitalize="words" error={err('lastName')} {...bind('lastName')} />
          </div>
          <Field label="E-mail" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" placeholder="vous@email.fr" error={err('email')} {...bind('email')} />
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
          <Field label="Téléphone (pour le suivi du colis)" type="tel" autoComplete="tel-national" inputMode="tel" enterKeyHint="done" prefix={country.dial} placeholder="6 12 34 56 78" error={err('phone')} {...bind('phone')} />

          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900 lg:hidden">
            <DeliveryEstimate compact />
          </div>
          <div className="rounded-2xl bg-gold-400/15 p-3 text-ink-900">
            <OneItemNotice compact />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 py-4 text-lg font-bold text-ink-900 shadow-lg shadow-gold-400/25 transition hover:bg-gold-300"
          >
            <Lock size={18} /> Continuer vers le paiement · {euro(subtotal)}
          </button>
          {touched && !valid && <p className="text-center text-sm text-red-500">Merci de compléter les champs indiqués.</p>}
          <PaymentBadges className="justify-center" />
        </form>
      </div>
    </div>
  )
}
