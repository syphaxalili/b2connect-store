const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('Erreur MongoDB:', error);
    process.exit(1);
  }
};

const sequelize = new Sequelize(process.env.MYSQL_URI, {
  dialect: 'mysql',
  logging: false
});

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Erreur MySQL:', error);
    process.exit(1);
  }
};

module.exports = { connectMongoDB, sequelize, connectMySQL };