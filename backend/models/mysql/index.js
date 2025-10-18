const { sequelize } = require('../../config/db');
const User = require('./user')(sequelize);
const Order = require('./order')(sequelize);
const OrderItem = require('./orderItem')(sequelize);
const Payment = require('./payment')(sequelize);

// Définir les relations
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Synchroniser les modèles avec la base de données
const initModels = async () => {
  try {
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Erreur lors de la synchronisation des modèles MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, User, Order, OrderItem, Payment, initModels };