const Sequelize = require('sequelize');
require('dotenv').config();

const database = new Sequelize(process.env.DB_ACCESS);

database.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })

module.exports = database;