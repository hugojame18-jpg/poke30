import { Lock, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { SHOP } from '../lib/config'
import { euro } from '../lib/data'
import { deliveryWindow } from '../lib/delivery'

export function PaymentBadges({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <Lock size={13} className={dark ? 'text-white/50' : 'text-slate-400'} />
      {SHOP.payments.map((p) => (
        <span
          key={p}
          className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${dark ? 'bg-white/10 text-white/80' : 'bg-white text-slate-600 ring-1 ring-ink-900/10'}`}
        >
          {p}
        </span>
      ))}
    </div>
  )
}

export function DeliveryEstimate({ compact = false }: { compact?: boolean }) {
  const { min, max } = deliveryWindow()
  return (
    <p className={`flex items-start gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      <Truck size={compact ? 14 : 18} className="mt-0.5 shrink-0 text-emerald-600" />
      <span>
        Commandez aujourd’hui, livraison estimée entre <strong>{min}</strong> et <strong>{max}</strong>
      </span>
    </p>
  )
}

export const GUARANTEES = [
  { icon: PackageCheck, title: '100 % officiel & scellé', text: 'Aucun produit reconditionné ni ouvert. Jamais.' },
  { icon: ShieldCheck, title: 'Emballage collectionneur', text: 'Coffrets calés en carton renforcé, cartes sous toploader.' },
  { icon: Truck, title: 'Livraison suivie', text: `Offerte dès ${euro(SHOP.freeShippingFrom)}, suivi envoyé par e-mail.` },
  { icon: RotateCcw, title: `${SHOP.returnDays} jours pour changer d’avis`, text: 'Sur les produits non ouverts, remboursement rapide.' },
]
