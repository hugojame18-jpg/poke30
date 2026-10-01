import { SHOP } from './config'

function addBusinessDays(d: Date, n: number) {
  const r = new Date(d)
  while (n > 0) {
    r.setDate(r.getDate() + 1)
    if (r.getDay() !== 0 && r.getDay() !== 6) n--
  }
  return r
}

const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

/** Date de livraison estimée pour une commande passée aujourd'hui (« jeudi 8 octobre »). */
export function deliveryDate(now = new Date()) {
  return fmt(addBusinessDays(now, SHOP.deliveryDays))
}
