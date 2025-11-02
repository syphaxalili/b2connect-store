const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(100),
        defaultValue: "France",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "addresses",
      timestamps: false,
    }
  );
  return Address;
};
