const { Order, OrderItem, User } = require("../models/mysql");
const Product = require("../models/mongodb/product");

const createOrder = async (req, res) => {
  const { product_ids, quantities } = req.body;
  const user_id = req.user.id;

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

    // Calculer le total
    const total_amount = products.reduce((total, product, index) => {
      return total + product.price * quantities[index];
    }, 0);

    // Créer la commande dans MySQL
    const order = await Order.create({ user_id, total_amount });

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

    res.status(201).json({ order_id: order.id, total_amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "price"],
            },
          ],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
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
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "unit_price"],
        },
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
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }
    const updateData = { status };
    if (tracking_number) {
      updateData.tracking_number = tracking_number;
    }
    await order.update(updateData);
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
