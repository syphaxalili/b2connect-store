/**
 * Contrôleur Stripe - Gestion des paiements
 *
 * ARCHITECTURE:
 * 1. createCheckoutSession() - Crée une session de paiement Stripe
 * 2. handleWebhook() - Traite les événements Stripe (webhook unifié prod/dev)
 *
 * FLUX DE PAIEMENT:
 * Frontend → POST /create-checkout-session → Stripe Checkout
 * User paie → Stripe → POST /webhook
 * Webhook crée la commande → Frontend redirigé vers /payment-success
 *
 * DEV: Utilisez Stripe CLI pour tester: stripe listen --forward-to localhost:5000/api/stripe/webhook
 */

const {
  Order,
  OrderItem,
  User,
  Address,
  sequelize,
} = require("../models/mysql");
const Product = require("../models/mongodb/product");
const { sendEmail } = require("../utils/mailService");
const { getOrderConfirmationEmail } = require("../utils/emailTemplates");
let stripeClient = null;

const getStripeClient = () => {
  if (!stripeClient) {
    stripeClient = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

/**
 * Créer une session de paiement Stripe Checkout
 */
const createCheckoutSession = async (req, res) => {
  const stripe = getStripeClient();
  const { product_ids, quantities, shipping_address } = req.body;
  const user_id = req.user.user_id;

  try {
    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Récupérer les produits depuis MongoDB
    const products = await Product.find({ _id: { $in: product_ids } });
    if (products.length !== product_ids.length) {
      return res
        .status(400)
        .json({ error: "Certains produits n'existent pas" });
    }

    // Vérifier le stock
    for (let i = 0; i < products.length; i++) {
      if (products[i].stock < quantities[i]) {
        return res
          .status(400)
          .json({ error: `Stock insuffisant pour ${products[i].name}` });
      }
    }

    // Créer les line items pour Stripe
    const line_items = products.map((product, index) => {
      // Préparer l'image (Stripe nécessite une URL complète)
      const productImages = [];
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0];
        productImages.push(imageUrl);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.brand || "",
            images: productImages,
          },
          unit_amount: Math.round(product.price * 100), // Stripe utilise les centimes
        },
        quantity: quantities[index],
      };
    });

    // Ajouter les frais de livraison
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Frais de livraison",
        },
        unit_amount: 599, // 5.99€ en centimes
      },
      quantity: 1,
    });

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      customer_email: user.email,
      metadata: {
        user_id: user_id.toString(),
        product_ids: JSON.stringify(product_ids),
        quantities: JSON.stringify(quantities),
        shipping_address: JSON.stringify(shipping_address),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Webhook Stripe pour gérer les événements de paiement
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripeClient();

  let event;

  // En développement, si pas de webhook secret, on parse directement le body
  if (!endpointSecret || endpointSecret === "whsec_YOUR_WEBHOOK_SECRET_HERE") {
    event = req.body;
  } else {
    // En production, on vérifie la signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Gérer l'événement
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const transaction = await sequelize.transaction();

    try {
      // Récupérer les métadonnées
      const { user_id, product_ids, quantities, shipping_address } =
        session.metadata;

      const parsedProductIds = JSON.parse(product_ids);
      const parsedQuantities = JSON.parse(quantities);
      const parsedShippingAddress = JSON.parse(shipping_address);

      // Récupérer les produits
      const products = await Product.find({ _id: { $in: parsedProductIds } });

      // Calculer le sous-total
      const subtotal = products.reduce((total, product, index) => {
        return total + product.price * parsedQuantities[index];
      }, 0);

      const shipping_fee = 5.99;
      const total_amount = subtotal + shipping_fee;

      // Créer l'adresse de livraison
      let shippingAddressId = null;
      if (parsedShippingAddress && parsedShippingAddress.street) {
        const newShippingAddress = await Address.create(
          {
            street: parsedShippingAddress.street,
            postal_code: parsedShippingAddress.postal_code,
            city: parsedShippingAddress.city,
            country: parsedShippingAddress.country || "France",
          },
          { transaction },
        );
        shippingAddressId = newShippingAddress.id;
      }

      // Créer la commande
      const order = await Order.create(
        {
          user_id: parseInt(user_id),
          total_amount,
          shipping_fee,
          shipping_address_id: shippingAddressId,
          status: "pending",
        },
        { transaction },
      );

      // Créer les articles de commande
      const orderItems = parsedProductIds.map((product_id, index) => ({
        order_id: order.id,
        product_id,
        quantity: parsedQuantities[index],
        unit_price: products.find((p) => p._id.toString() === product_id).price,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction });

      // Mettre à jour le stock
      for (let i = 0; i < products.length; i++) {
        await Product.findByIdAndUpdate(parsedProductIds[i], {
          $inc: { stock: -parsedQuantities[i] },
        });
      }

      // Commit de la transaction si tout s'est bien passé
      await transaction.commit();

      // Envoyer l'email de confirmation de commande
      const user = await User.findByPk(parseInt(user_id));
      if (user && user.email) {
        const emailOrderItems = products.map((product, index) => ({
          name: product.name,
          quantity: parsedQuantities[index],
          price: product.price,
        }));

        const emailTemplate = getOrderConfirmationEmail({
          orderId: order.id,
          firstName: user.first_name,
          totalAmount: total_amount,
          shippingFee: shipping_fee,
          subtotal: subtotal,
          items: emailOrderItems,
        });

        // Envoi asynchrone pour ne pas bloquer le webhook
        sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          text: emailTemplate.text,
          html: emailTemplate.html,
        }).catch((error) => {
          console.error(
            "Erreur lors de l'envoi de l'email de confirmation (webhook):",
            error,
          );
        });
      }
    } catch (error) {
      // Rollback de la transaction en cas d'erreur
      await transaction.rollback();
      console.error("Erreur lors de la création de la commande:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
