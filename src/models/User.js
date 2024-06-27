const {Sequelize, DataTypes} = require('sequelize');
const  database  = require('../db/db');

const User = database.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true

    },
    token: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }

})

module.exports = User;