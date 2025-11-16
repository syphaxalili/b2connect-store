import axiosPrivate from "../config/axiosPrivate";

/**
 * Créer une session de paiement Stripe
 * @param {Array} product_ids - IDs des produits
 * @param {Array} quantities - Quantités des produits
 * @param {Object} shipping_address - Adresse de livraison
 * @param {Object} guestDetails - Détails de l'invité (optionnel, pour guest checkout)
 */
export const createCheckoutSession = (
  product_ids,
  quantities,
  shipping_address,
  guestDetails = null
) =>
  axiosPrivate.post("/stripe/create-checkout-session", {
    product_ids,
    quantities,
    shipping_address,
    ...(guestDetails && { guestDetails })
  });
