import type { Product } from './data'

// Événements e-commerce au format GA4 poussés dans window.dataLayer.
// Brancher Google Tag Manager / GA4 / Meta Pixel dessus pour mesurer le taux de conversion.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

const item = (p: Product, quantity = 1) => ({
  item_id: p.slug,
  item_name: p.name,
  item_category: p.universe,
  price: p.price,
  quantity,
})

function push(event: string, ecommerce: Record<string, unknown>) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({ event, ecommerce })
  if (import.meta.env.DEV) console.debug('[track]', event, ecommerce)
}

export const track = {
  viewItem: (p: Product) => push('view_item', { currency: 'EUR', value: p.price, items: [item(p)] }),
  viewList: (name: string, list: Product[]) => push('view_item_list', { item_list_name: name, items: list.slice(0, 20).map((p) => item(p)) }),
  addToCart: (p: Product, qty: number) => push('add_to_cart', { currency: 'EUR', value: p.price * qty, items: [item(p, qty)] }),
  removeFromCart: (p: Product, qty: number) => push('remove_from_cart', { currency: 'EUR', value: p.price * qty, items: [item(p, qty)] }),
  viewCart: (lines: { product: Product; qty: number }[], value: number) => push('view_cart', { currency: 'EUR', value, items: lines.map((l) => item(l.product, l.qty)) }),
  beginCheckout: (lines: { product: Product; qty: number }[], value: number) =>
    push('begin_checkout', { currency: 'EUR', value, items: lines.map((l) => item(l.product, l.qty)) }),
  search: (term: string) => push('search', { search_term: term }),
  signUp: (method: string) => push('sign_up', { method }),
}
