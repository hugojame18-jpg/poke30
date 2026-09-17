export type Universe = 'pokemon' | 'one-piece' | 'yu-gi-oh' | 'gradees' | 'accessoires' | 'magic'
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
  { id: 'one-piece', label: 'One Piece', tagline: 'Boosters & collections JP', from: '#ef4444', to: '#7f1d1d' },
  { id: 'yu-gi-oh', label: 'Yu-Gi-Oh!', tagline: 'Decks & coffrets', from: '#a855f7', to: '#312e81' },
  { id: 'gradees', label: 'Cartes gradées', tagline: 'PSA, CGC, PCA', from: '#38bdf8', to: '#1e3a8a' },
  { id: 'accessoires', label: 'Accessoires', tagline: 'Sleeves, toploaders, deck box', from: '#34d399', to: '#065f46' },
  { id: 'magic', label: 'Magic', tagline: 'Kits & boosters', from: '#fb923c', to: '#7c2d12' },
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
    slug: 'one-piece-premium-card-collection-best-selection-vol1-jp',
    name: 'Premium Card Collection Best Selection Vol.1',
    short: 'Sélection premium de cartes One Piece, édition japonaise.',
    price: 49.99,
    universe: 'one-piece',
    lang: 'JPN',
    stock: 7,
    tags: [],
    description: 'Collection premium rassemblant une sélection de cartes marquantes du One Piece Card Game, en finition spéciale. Édition japonaise scellée.',
    details: [['Langue', 'Japonais'], ['Jeu', 'One Piece Card Game'], ['État', 'Neuf, scellé']],
    addedAt: '2026-08-28',
    sales: 64,
  },
  {
    slug: 'one-piece-luffy-st29-001-promo-magazine-vol21-jp',
    name: 'Monkey D. Luffy ST29-001 – Promo Magazine Vol.21',
    short: 'Carte promo magazine, édition japonaise.',
    price: 19.99,
    universe: 'one-piece',
    lang: 'JPN',
    stock: 5,
    tags: ['Promo'],
    description: 'Carte promotionnelle Monkey D. Luffy distribuée avec le magazine Vol.21. Carte seule, état near mint, expédiée sous sleeve et toploader.',
    details: [['Langue', 'Japonais'], ['Numéro', 'ST29-001'], ['État', 'Near Mint']],
    addedAt: '2026-09-12',
    sales: 41,
  },
  {
    slug: 'yu-gi-oh-decks-legendaires-arc-v-fr',
    name: 'Decks Légendaires ARC-V – Coffret 3 Decks',
    short: 'Trois decks prêts à jouer de l’ère ARC-V.',
    price: 19.99,
    universe: 'yu-gi-oh',
    lang: 'FR',
    stock: 12,
    tags: [],
    description: 'Coffret de trois decks inspirés des duellistes d’ARC-V, jouables immédiatement et parfaits pour découvrir les invocations Pendule. Édition française.',
    details: [['Langue', 'Français'], ['Contenu', '3 decks'], ['État', 'Neuf, scellé']],
    addedAt: '2026-08-20',
    sales: 88,
  },
  {
    slug: 'magic-kit-demarrage-final-fantasy-fr',
    name: 'Kit de démarrage Magic – FINAL FANTASY',
    short: 'Deux decks pour apprendre Magic dans l’univers Final Fantasy.',
    price: 19.99,
    universe: 'magic',
    lang: 'FR',
    stock: 9,
    tags: [],
    description: 'Kit de démarrage Magic: The Gathering édition Final Fantasy : deux decks prêts à jouer et un guide pour apprendre les règles. Édition française.',
    details: [['Langue', 'Français'], ['Contenu', '2 decks + guide'], ['État', 'Neuf, scellé']],
    addedAt: '2026-09-05',
    sales: 52,
  },
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
  {
    slug: 'charmeleon-169-165-sv2a-cgc-9',
    name: 'Reptincel 169/165 – Pokémon Card 151 – CGC 9',
    short: 'Art rare Card 151 japonais, gradé CGC 9 Mint.',
    price: 80,
    universe: 'gradees',
    lang: 'JPN',
    stock: 1,
    tags: ['CGC'],
    description: 'Charmeleon (Reptincel) 169/165 de l’extension japonaise Pokémon Card 151 (SV2a), gradé CGC 9 Mint.',
    details: [['Langue', 'Japonais'], ['Extension', 'Pokémon Card 151 (SV2a)'], ['Gradation', 'CGC 9 Mint']],
    addedAt: '2026-08-15',
    sales: 9,
  },
  {
    slug: 'charmeleon-169-165-sv2a-cgc-9-5',
    name: 'Reptincel 169/165 – Pokémon Card 151 – CGC 9.5',
    short: 'Art rare Card 151 japonais, gradé CGC 9.5 Gem Mint.',
    price: 80,
    universe: 'gradees',
    lang: 'JPN',
    stock: 1,
    tags: ['CGC'],
    description: 'Charmeleon (Reptincel) 169/165 de l’extension japonaise Pokémon Card 151 (SV2a), gradé CGC 9.5 Gem Mint.',
    details: [['Langue', 'Japonais'], ['Extension', 'Pokémon Card 151 (SV2a)'], ['Gradation', 'CGC 9.5 Gem Mint']],
    addedAt: '2026-08-16',
    sales: 7,
  },
  {
    slug: 'ultra-pro-toploader-regular-x25',
    name: 'Ultra Pro Toploader Regular – x25',
    short: 'Protection rigide 3"x4" pour cartes standard.',
    price: 4.9,
    universe: 'accessoires',
    lang: 'EN',
    stock: 60,
    tags: [],
    description: 'Lot de 25 toploaders Ultra Pro transparents au format standard, pour protéger vos cartes les plus précieuses.',
    details: [['Format', '3" x 4"'], ['Quantité', '25'], ['Marque', 'Ultra Pro']],
    addedAt: '2026-07-30',
    sales: 190,
  },
  {
    slug: 'ultra-pro-alcove-click-box-sinnoh',
    name: 'Deck box Alcove Click – Pokémon Sinnoh',
    short: 'Deck box magnétique 100+ cartes sleevées.',
    price: 14.9,
    universe: 'accessoires',
    lang: 'EN',
    stock: 18,
    tags: [],
    description: 'Deck box Ultra Pro Alcove Click illustrée Sinnoh, fermeture magnétique, contient jusqu’à 100 cartes en double sleeve.',
    details: [['Capacité', '100 cartes sleevées'], ['Marque', 'Ultra Pro']],
    addedAt: '2026-08-02',
    sales: 75,
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
    slug: 'texte-cartes-yu-gi-oh-condition-cout-effet',
    title: 'Texte des cartes Yu-Gi-Oh! : condition, coût et effet',
    excerpt: 'Utilisez la ponctuation pour séparer conditions d’activation, coûts, cibles et résolution à la lecture d’une carte.',
    date: '2026-09-14',
    universe: 'yu-gi-oh',
    body: [
      'Depuis la standardisation du texte des cartes, la ponctuation n’est plus décorative : elle indique précisément ce qui se passe et à quel moment.',
      'Les deux-points (:) séparent la condition d’activation du reste de l’effet. Tout ce qui précède doit être vrai pour pouvoir activer la carte.',
      'Le point-virgule (;) marque la fin du coût. Ce qui se trouve avant est payé à l’activation, et ne peut pas être annulé même si l’effet l’est.',
      'Enfin, tout ce qui suit le point-virgule constitue la résolution : c’est la partie que l’adversaire peut contrer avec une chaîne.',
    ],
  },
  {
    slug: 'tournoi-one-piece-verifier-deck',
    title: 'Tournoi One Piece : vérifiez votre deck avant la première ronde',
    excerpt: 'Nombre de cartes, deck list, sleeves opaques, langue des cartes et matériel indispensable.',
    date: '2026-09-13',
    universe: 'one-piece',
    body: [
      'Un deck One Piece compte exactement 50 cartes plus un Leader, et jamais plus de quatre exemplaires d’une même carte.',
      'Préparez votre deck list à l’avance et vérifiez qu’elle correspond carte pour carte à ce que vous jouez.',
      'Utilisez des sleeves opaques identiques et en bon état : une sleeve abîmée peut être considérée comme un marquage.',
      'Pensez aux dés, compteurs de DON!! et à un stylo. Le reste, c’est du jeu.',
    ],
  },
  {
    slug: 'capacite-deck-box-tcg',
    title: 'Capacité d’une deck box TCG : choisir sans comprimer ses cartes',
    excerpt: 'Accorder la deck box aux cartes simple ou double sleeve, aux intercalaires et aux tokens.',
    date: '2026-09-13',
    universe: 'accessoires',
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
