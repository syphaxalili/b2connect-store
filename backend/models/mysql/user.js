const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
      },
      last_name: {
        type: DataTypes.STRING(100),
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      phone_number: {
        type: DataTypes.STRING(20),
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("client", "admin"),
        defaultValue: "client",
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reset_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      refresh_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
