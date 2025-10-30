const { Cart, CartItem } = require("../models/mysql");
const Product = require("../models/mongodb/product");

/**
 * Récupérer le panier de l'utilisateur connecté avec les détails des produits
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer ou créer le panier
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "CartItems",
        },
      ],
    });

    // Si le panier n'existe pas, le créer
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      return res.status(200).json({ items: [], total: 0 });
    }

    // Récupérer les détails des produits depuis MongoDB
    const cartItems = cart.CartItems || [];
    const productIds = cartItems.map((item) => item.product_id);

    let products = [];
    if (productIds.length > 0) {
      products = await Product.find({ _id: { $in: productIds } });
    }

    // Mapper les items avec les détails des produits
    const itemsWithDetails = cartItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product_id
      );

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        product: product
          ? {
              _id: product._id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              stock: product.stock,
              images: product.images,
            }
          : null,
      };
    });

    // Calculer le total
    const total = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      items: itemsWithDetails,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération du panier",
      error: error.message,
    });
  }
};

/**
 * Ajouter un article au panier
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "product_id est requis" });
    }

    // Vérifier que le produit existe
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Vérifier le stock
    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Stock insuffisant",
        available: product.stock,
      });
    }

    // Récupérer ou créer le panier
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Vérifier si le produit est déjà dans le panier
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (cartItem) {
      // Mettre à jour la quantité
      const newQuantity = cartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          message: "Stock insuffisant",
          available: product.stock,
          current: cartItem.quantity,
        });
      }

      cartItem.quantity = newQuantity;
      cartItem.updated_at = new Date();
      await cartItem.save();
    } else {
      // Créer un nouvel item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
        price: product.price,
      });
    }

    // Mettre à jour le timestamp du panier
    cart.updated_at = new Date();
    await cart.save();

    res.status(200).json({
      message: "Produit ajouté au panier",
      item: {
        id: cartItem.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: parseFloat(cartItem.price),
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout au panier",
      error: error.message,
    });
  }
};

/**
 * Mettre à jour la quantité d'un article
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "La quantité doit être supérieure ou égale à 1",
      });
    }

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    // Récupérer l'item
    const cartItem = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    // Vérifier le stock
    const product = await Product.findById(cartItem.product_id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Stock insuffisant",
        available: product.stock,
      });
    }

    // Mettre à jour la quantité
    cartItem.quantity = quantity;
    cartItem.updated_at = new Date();
    await cartItem.save();

    // Mettre à jour le timestamp du panier
    cart.updated_at = new Date();
    await cart.save();

    res.status(200).json({
      message: "Quantité mise à jour",
      item: {
        id: cartItem.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: parseFloat(cartItem.price),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'article",
      error: error.message,
    });
  }
};

/**
 * Supprimer un article du panier
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    // Supprimer l'item
    const deleted = await CartItem.destroy({
      where: { id: itemId, cart_id: cart.id },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Article non trouvé dans le panier" });
    }

    // Mettre à jour le timestamp du panier
    cart.updated_at = new Date();
    await cart.save();

    res.status(200).json({ message: "Article supprimé du panier" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'article",
      error: error.message,
    });
  }
};

/**
 * Vider le panier
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    // Supprimer tous les items
    await CartItem.destroy({ where: { cart_id: cart.id } });

    // Mettre à jour le timestamp du panier
    cart.updated_at = new Date();
    await cart.save();

    res.status(200).json({ message: "Panier vidé" });
  } catch (error) {
    console.error("Erreur lors du vidage du panier:", error);
    res.status(500).json({
      message: "Erreur lors du vidage du panier",
      error: error.message,
    });
  }
};

/**
 * Fusionner le panier invité avec le panier de l'utilisateur
 * Cette fonction est appelée lors de la connexion
 */
const mergeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body; // items du localStorage

    if (!items || !Array.isArray(items) || items.length === 0) {
      // Pas de panier invité à fusionner, retourner le panier existant
      return getCart(req, res);
    }

    // Récupérer ou créer le panier de l'utilisateur
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Récupérer les items existants du panier
    const existingItems = await CartItem.findAll({
      where: { cart_id: cart.id },
    });

    // Fusionner les items
    for (const guestItem of items) {
      const { product_id, quantity } = guestItem;

      // Vérifier que le produit existe
      const product = await Product.findById(product_id);
      if (!product) {
        console.warn(`Produit ${product_id} non trouvé, ignoré lors de la fusion`);
        continue;
      }

      // Chercher si le produit existe déjà dans le panier
      const existingItem = existingItems.find(
        (item) => item.product_id === product_id
      );

      if (existingItem) {
        // Additionner les quantités (avec vérification du stock)
        const newQuantity = existingItem.quantity + quantity;

        if (product.stock >= newQuantity) {
          existingItem.quantity = newQuantity;
          existingItem.updated_at = new Date();
          await existingItem.save();
        } else {
          // Si stock insuffisant, prendre le maximum disponible
          existingItem.quantity = Math.min(product.stock, newQuantity);
          existingItem.updated_at = new Date();
          await existingItem.save();
        }
      } else {
        // Créer un nouvel item
        const finalQuantity = Math.min(product.stock, quantity);
        if (finalQuantity > 0) {
          await CartItem.create({
            cart_id: cart.id,
            product_id,
            quantity: finalQuantity,
            price: product.price,
          });
        }
      }
    }

    // Mettre à jour le timestamp du panier
    cart.updated_at = new Date();
    await cart.save();

    // Retourner le panier fusionné
    return getCart(req, res);
  } catch (error) {
    console.error("Erreur lors de la fusion du panier:", error);
    res.status(500).json({
      message: "Erreur lors de la fusion du panier",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
};
