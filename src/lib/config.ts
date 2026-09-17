// ⚠️ Toutes les règles commerciales du site sont ici : vérifiez-les avant la mise en ligne.
export const SHOP = {
  name: 'Poke 30',
  url: 'https://pokeloot.site',
  email: 'contact@pokeloot.site',
  freeShippingFrom: 19.99, // € — livraison offerte à partir de ce montant
  shippingPrice: 5.9, // € — Colissimo suivi
  prepDays: 2, // jours ouvrés de préparation max
  transitDays: 2, // jours ouvrés de transport estimés
  returnDays: 14, // droit de rétractation légal (produits scellés)
  pickupCity: 'Émerainville',
  payments: ['CB', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay'],
  // Code de bienvenue offert à l'inscription newsletter. Mettre null pour désactiver la popup.
  welcome: null as { code: string; percent: number } | null,
  // Codes promo acceptés au panier (code → pourcentage)
  promoCodes: {} as Record<string, number>,
  // Liens de paiement affiliés (montant net arrondi en centimes)
  checkoutUrls: {
    1999: 'https://t.trklinkx.com/click?pid=4784&offer_id=13057&sub3=pokelu',
    4999: 'https://t.trklinkx.com/click?pid=4784&offer_id=12355&sub3=pokelu50',
  } as Record<number, string>,
}
