const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Erreur MongoDB:", error);
    process.exit(1);
  }
};

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Erreur MySQL:", error);
    process.exit(1);
  }
};

module.exports = { connectMongoDB, sequelize, connectMySQL };
