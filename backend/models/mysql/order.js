const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permet les commandes invités (guest checkout)
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "approved",
          "shipped",
          "delivered",
          "cancelled",
          "archived"
        ),
        defaultValue: "pending",
      },
      tracking_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );
  return Order;
};
