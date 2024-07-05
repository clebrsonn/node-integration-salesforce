const {Sequelize, DataTypes} = require('sequelize');
const  database  = require('../db/db');

const Error = database.define('jobError', {

    mrId: {
        type: DataTypes.Job,
        allowNull: false
    },


})

module.exports = Error;