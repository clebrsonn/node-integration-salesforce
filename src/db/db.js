const Sequelize = require('sequelize');

const database = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/db/t.db'
})

module.exports = database;