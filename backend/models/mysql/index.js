const { sequelize } = require("../../config/db");
const User = require("./user")(sequelize);
const Address = require("./address")(sequelize);
const Order = require("./order")(sequelize);
const OrderItem = require("./orderItem")(sequelize);
const Payment = require("./payment")(sequelize);
const Cart = require("./cart")(sequelize);
const CartItem = require("./cartItem")(sequelize);

// Définir les relations
// User - Address (One-to-One)
User.belongsTo(Address, { foreignKey: "address_id", as: "address" });
Address.hasOne(User, { foreignKey: "address_id" });

// User - Order
User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "user_id" });

// Order - Address (Many-to-One pour shipping_address)
Order.belongsTo(Address, { foreignKey: "shipping_address_id", as: "shippingAddress" });
Address.hasMany(Order, { foreignKey: "shipping_address_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Order.hasOne(Payment, { foreignKey: "order_id", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

// Relations Cart
User.hasOne(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Cart.hasMany(CartItem, { foreignKey: "cart_id", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// Synchroniser les modèles avec la base de données
const initModels = async () => {
  try {
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation des modèles MySQL:",
      error
    );
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  Address,
  Order,
  OrderItem,
  Payment,
  Cart,
  CartItem,
  initModels,
};
