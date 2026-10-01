import { SHOP } from './config'

// Jours calendaires ; pas de livraison le dimanche, reportée au lundi
function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  if (r.getDay() === 0) r.setDate(r.getDate() + 1)
  return r
}

const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

/** Date de livraison estimée pour une commande passée aujourd'hui (« jeudi 8 octobre »). */
export function deliveryDate(now = new Date()) {
  return fmt(addDays(now, SHOP.deliveryDays))
}
