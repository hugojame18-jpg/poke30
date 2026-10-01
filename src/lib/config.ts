// ⚠️ Toutes les règles commerciales du site sont ici : vérifiez-les avant la mise en ligne.
export const SHOP = {
  name: 'Poke 30',
  url: 'https://poke30.site',
  email: 'contact@poke30.site',
  // Livraison suivie toujours offerte : le client paie exactement le montant du lien de paiement
  deliveryDays: 3, // délai de livraison annoncé, en jours ouvrés (préparation + transport)
  returnDays: 14, // droit de rétractation légal (produits scellés)
  pickupCity: 'Émerainville',
  payments: ['CB', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay'],
  // Code de bienvenue offert à l'inscription newsletter. Mettre null pour désactiver la popup.
  welcome: null as { code: string; percent: number } | null,
  // Codes promo acceptés au panier (code → pourcentage)
  promoCodes: {} as Record<string, number>,
  // Liens de paiement affiliés (montant net arrondi en centimes)
  checkoutUrls: {
    999: 'https://t.trklinkx.com/click?pid=4784&offer_id=13179&sub3=9,99',
    1999: 'https://t.trklinkx.com/click?pid=4784&offer_id=13057&sub3=19',
    4999: 'https://t.trklinkx.com/click?pid=4784&offer_id=12355',
    7999: 'https://t.trklinkx.com/click?pid=4784&offer_id=12541',
  } as Record<number, string>,
}
