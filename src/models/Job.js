const {Sequelize, DataTypes} = require('sequelize');
const  database  = require('../db/db');

const Job = database.define('job', {
    mrId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jobId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true

    },
    token: {
        type: DataTypes.STRING
    },
    instanceURL: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "Waiting"
    },
    commented:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    discussionId:{
        type: DataTypes.STRING
    }

})

module.exports = Job;