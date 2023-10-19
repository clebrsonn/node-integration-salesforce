const Job = require('../models/Job')
const socket = require("../service/create-socket");
const {Op} = require("sequelize");

function insert(params) {
    return Job.create(params);
}

function update(params, where) {

    Job.update(params,
        where).then( ()=> {
            Job.findAll().then(result =>
                socket.getIO().emit('registry-update', result)
            );

    });
}
async function findAll(where) {
    return await Job.findAll(where);
}

module.exports= {insert, update, findAll}