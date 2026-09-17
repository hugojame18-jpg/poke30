export type Universe = 'pokemon' | 'gradees'
export type Lang = 'FR' | 'JPN' | 'EN'

export interface Product {
  slug: string
  name: string
  short: string
  price: number
  compareAt?: number
  universe: Universe
  lang: Lang
  stock: number
  image?: string
  tags: string[]
  badge?: string
  description: string
  details: [string, string][]
  addedAt: string
  sales: number
}

export const UNIVERSES: { id: Universe; label: string; tagline: string; from: string; to: string }[] = [
  { id: 'pokemon', label: 'Pokémon', tagline: 'ETB, displays, coffrets', from: '#facc15', to: '#f97316' },
  { id: 'gradees', label: 'Cartes gradées', tagline: 'PSA, CGC, PCA', from: '#38bdf8', to: '#1e3a8a' },
]

const fp = (g: number): Product => ({
  slug: `coffret-first-partners-${g}g-30th-celebration-jp`,
  name: `Coffret First Partners ${g}G – 30th Celebration`,
  short: `Les starters de la génération ${g} réunis dans un coffret anniversaire.`,
  price: 19.99,
  universe: 'pokemon',
  lang: 'JPN',
  stock: [14, 9, 6, 11, 3, 8, 5][g - 1],
  image: `${import.meta.env.BASE_URL}products/first-partners-${g}g.webp`,
  tags: ['30 ans'],
  badge: '30e anniversaire',
  description: `Coffret japonais de la gamme 30th Celebration consacré aux trois Pokémon de départ de la génération ${g}. Produit officiel scellé, idéal pour compléter la collection anniversaire.`,
  details: [
    ['Langue', 'Japonais'],
    ['Extension', '30th Celebration'],
    ['État', 'Neuf, scellé d’usine'],
    ['Génération', `${g}G`],
  ],
  addedAt: `2026-09-0${g}`,
  sales: 120 - g * 9,
})

export const PRODUCTS: Product[] = [
  {
    slug: 'etb-30e-anniversaire-fr',
    name: 'Coffret Dresseur d’Élite — 30e Anniversaire',
    short: 'L’ETB officiel de la collection anniversaire, en français.',
    price: 49.99,
    universe: 'pokemon',
    lang: 'FR',
    stock: 4,
    image: `${import.meta.env.BASE_URL}products/etb-30e-anniversaire.webp`,
    tags: ['30 ans'],
    badge: '30e anniversaire',
    description:
      'Le Coffret Dresseur d’Élite de la collection 30 ans : boosters, sleeves illustrées, dés, marqueurs et boîte de rangement aux couleurs de l’anniversaire. Produit officiel en français, scellé.',
    details: [
      ['Langue', 'Français'],
      ['Contenu', 'Boosters, sleeves, dés, marqueurs, guide'],
      ['État', 'Neuf, scellé d’usine'],
    ],
    addedAt: '2026-09-10',
    sales: 240,
  },
  ...[1, 2, 3, 4, 5, 6, 7].map(fp),
  {
    slug: 'charmeleon-169-165-sv2a-cgc-8-5',
    name: 'Reptincel 169/165 – Pokémon Card 151 – CGC 8.5',
    short: 'Art rare Card 151 japonais, gradé CGC 8.5 Near Mint+.',
    price: 49.99,
    universe: 'gradees',
    lang: 'JPN',
    stock: 2,
    tags: ['CGC'],
    description: 'Charmeleon (Reptincel) 169/165 de l’extension japonaise Pokémon Card 151 (SV2a), gradé CGC 8.5 Near Mint+. Slab protégé et expédié en colis renforcé.',
    details: [['Langue', 'Japonais'], ['Extension', 'Pokémon Card 151 (SV2a)'], ['Gradation', 'CGC 8.5 NM+']],
    addedAt: '2026-08-15',
    sales: 12,
  },
]

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
export const universeOf = (id: Universe) => UNIVERSES.find((u) => u.id === id)!

export const euro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export interface Article {
  slug: string
  title: string
  excerpt: string
  date: string
  universe: Universe
  body: string[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'capacite-deck-box-tcg',
    title: 'Capacité d’une deck box : choisir sans comprimer ses cartes Pokémon',
    excerpt: 'Accorder la deck box aux cartes simple ou double sleeve, aux intercalaires et aux tokens.',
    date: '2026-09-13',
    universe: 'pokemon',
    body: [
      'La capacité annoncée d’une deck box correspond souvent à des cartes en simple sleeve. En double sleeve, retirez environ 20 %.',
      'Ajoutez l’épaisseur des intercalaires, tokens et dés si vous les rangez au même endroit.',
      'Une boîte trop pleine courbe les cartes ; une boîte trop vide les laisse s’abîmer en transport. Visez un léger jeu.',
    ],
  },
]

export const FAQ: { q: string; a: string }[] = [
  { q: 'Quand ma commande est-elle préparée et expédiée ?', a: 'Les commandes sont préparées sous 24 à 48 h ouvrées, puis expédiées en suivi depuis la France. Vous recevez le numéro de suivi par e-mail dès l’envoi.' },
  { q: 'Puis-je modifier ou annuler ma commande ?', a: 'Oui, tant qu’elle n’a pas été expédiée. Contactez-nous au plus vite avec votre numéro de commande.' },
  { q: 'Puis-je retirer ma commande à Émerainville ?', a: 'Oui, le retrait est possible sur rendez-vous. Choisissez « Retrait » lors de la commande et nous vous contactons pour fixer un créneau.' },
  { q: 'Les produits sont-ils officiels ?', a: 'Tous nos produits sont officiels et scellés d’usine. Les cartes gradées sont vendues dans leur slab d’origine.' },
  { q: 'Comment sont protégés les colis ?', a: 'Coffrets en carton renforcé avec calage, cartes seules sous sleeve + toploader, slabs sous papier bulle.' },
]
