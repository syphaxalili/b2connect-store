const { Order, OrderItem, User, Address } = require("../models/mysql");
const Product = require("../models/mongodb/product");
const { sendEmail } = require("../utils/mailService");
const { getOrderConfirmationEmail, getOrderStatusEmail } = require("../utils/emailTemplates");

const createOrder = async (req, res) => {
  const { product_ids, quantities, shipping_fee = 5.99, shipping_address } = req.body;
  const user_id = req.user.user_id;

  try {
    // Vérifier que l'utilisateur existe (MySQL)
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

    // Calculer le sous-total (sans frais de livraison)
    const subtotal = products.reduce((total, product, index) => {
      return total + product.price * quantities[index];
    }, 0);

    // Calculer le total (avec frais de livraison)
    const total_amount = subtotal + shipping_fee;

    // Créer l'adresse de livraison si fournie
    let shippingAddressId = null;
    if (shipping_address && typeof shipping_address === 'object') {
      if (shipping_address.street && shipping_address.postal_code && shipping_address.city) {
        const newShippingAddress = await Address.create({
          street: shipping_address.street,
          postal_code: shipping_address.postal_code,
          city: shipping_address.city,
          country: shipping_address.country || "France"
        });
        shippingAddressId = newShippingAddress.id;
      }
    }

    // Créer la commande dans MySQL
    const order = await Order.create({ 
      user_id, 
      total_amount, 
      shipping_fee,
      shipping_address_id: shippingAddressId 
    });

    // Créer les articles de commande
    const orderItems = product_ids.map((product_id, index) => ({
      order_id: order.id,
      product_id,
      quantity: quantities[index],
      unit_price: products.find((p) => p._id.toString() === product_id).price,
    }));
    await OrderItem.bulkCreate(orderItems);

    // Mettre à jour le stock
    for (let i = 0; i < products.length; i++) {
      await Product.findByIdAndUpdate(product_ids[i], {
        $inc: { stock: -quantities[i] },
      });
    }

    // Préparer les données pour l'email de confirmation
    const emailOrderItems = products.map((product, index) => ({
      name: product.name,
      quantity: quantities[index],
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

    // Envoi asynchrone pour ne pas bloquer la réponse
    sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    }).catch(error => {
      console.error("Erreur lors de l'envoi de l'email de confirmation de commande:", error);
    });

    res.status(201).json({
      order_id: order.id,
      total_amount,
      shipping_fee,
      subtotal: subtotal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // Récupérer les commandes avec OrderItems (MySQL)
    const orders = await Order.findAll({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "unit_price"],
        },
      ],
    });

    // Extraire les product_ids uniques
    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.OrderItems.map((item) => item.product_id)
        )
      ),
    ];

    // Récupérer les produits depuis MongoDB
    const products = await Product.find({ _id: { $in: productIds } });

    // Mapper les produits aux OrderItems
    const ordersWithProducts = orders.map((order) => {
      const orderData = order.toJSON();
      orderData.OrderItems = orderData.OrderItems.map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.product_id
        );
        return {
          ...item,
          product: product
            ? { _id: product._id, name: product.name, price: product.price }
            : null,
        };
      });
      return orderData;
    });

    res.status(200).json(ordersWithProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "unit_price"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
          ],
          include: [
            {
              model: Address,
              as: "address",
              attributes: ["id", "street", "postal_code", "city", "country"]
            }
          ]
        },
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "unit_price"],
        },
        {
          model: Address,
          as: "shippingAddress",
          attributes: ["id", "street", "postal_code", "city", "country"]
        }
      ],
    });
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking_number } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    const updateData = { status };
    if (tracking_number) {
      updateData.tracking_number = tracking_number;
    }
    await order.update(updateData);

    // Envoyer un email de notification du changement de statut
    if (order.User) {
      const emailTemplate = getOrderStatusEmail({
        orderId: order.id,
        firstName: order.User.first_name,
        status,
        trackingNumber: tracking_number,
      });

      // Envoi asynchrone pour ne pas bloquer la réponse
      sendEmail({
        to: order.User.email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html,
      }).catch(error => {
        console.error("Erreur lors de l'envoi de l'email de notification de statut:", error);
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    // Vérifier que la commande est annulée ou archivée
    if (!["cancelled", "archived"].includes(order.status)) {
      return res.status(400).json({
        error:
          "Seules les commandes annulées ou archivées peuvent être supprimées",
      });
    }
    await OrderItem.destroy({ where: { order_id: order.id } });
    await order.destroy();
    res.status(200).json({ message: "Commande supprimée" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
