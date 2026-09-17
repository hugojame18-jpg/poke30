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

/** Fourchette de livraison estimée à partir d'aujourd'hui. */
export function deliveryWindow(now = new Date()) {
  const min = addBusinessDays(now, 1 + SHOP.transitDays)
  const max = addBusinessDays(now, SHOP.prepDays + SHOP.transitDays)
  return { min: fmt(min), max: fmt(max) }
}
