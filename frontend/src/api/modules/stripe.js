import axiosPrivate from "../config/axiosPrivate";

/**
 * Créer une session de paiement Stripe
 */
export const createCheckoutSession = (
  product_ids,
  quantities,
  shipping_address
) =>
  axiosPrivate.post("/stripe/create-checkout-session", {
    product_ids,
    quantities,
    shipping_address
  });
